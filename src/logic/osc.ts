import watch from "redux-watch";
import store, { setCurrentWave, setOsc, setWaveTable, Voice } from "../redux";
const FFT = require("fft-js");

/**
 * Creating global variables
 * Because of performance reasons, some of the Information from the redux store
 * are saved in global variables within the code, so that there are viewer requests
 * to the store.
 */
const ctx = store.getState().ctx;
let waveTable = store.getState().waveTable;
let osc = store.getState().osc;
let waveTablePosition = store.getState().waveTablePosition;
let currentWave = store.getState().currentWave;

/**
 * This function is imported outside that file as 'osc'
 * it gets called when the application starts
 */
export default () => {
  /**
   * This function gets called when the user launches the application the first time
   * and when you change the number of voices of the oscillator
   */
  const setUpOsc = () => {
    const { voices } = store.getState();

    // disconnecting all previously connected voices if they are not yet disconnected
    if (osc) osc.forEach((voice) => voice.pan.disconnect());

    // set up Oscillator by filing the osc array with the diffrent voices, pans, waveForms
    let newOsc = new Array<Voice>(voices);
    for (let i = 0; i < voices; i++)
      newOsc[i] = {
        voice: ctx.createOscillator(),
        pan: ctx.createStereoPanner(),
      };

    // dispatch the new Oscillator to the redux store
    store.dispatch(setOsc(newOsc));
    // }
  };

  /**
   * This function gets called after the property oscillator has changed in the redux store
   * this means it gets called only every time after the setUpOsc Method
   */
  const startOsc = () => {
    osc = store.getState().osc;
    // starting each oscillator node of each voice and connect them to the panning of each voice
    if (osc)
      osc.forEach((voice) => {
        voice.voice.start();
        voice.voice.connect(voice.pan);
      });
    // because all previously used oscillator nodes have been deleted and created new
    // the detuning and the waveform of every oscillator node has to be set up once again
    setUpDetune();
    setUpWaveForm();
  };

  /**
   * This function gets called whenever the user change the detuning of the oscillator
   * It also gets called after the user changed the number of voices
   */
  const setUpDetune = () => {
    const { osc, voices, detune } = store.getState();
    // calculating detune and pan for each voice of the oscillator
    // detune also increases the panning besides the actual detuning
    if (osc)
      osc.forEach((voice, i) => {
        voice.voice.detune.value = detune * spread(voices, i);
        voice.pan.pan.value = (spread(voices, i) * detune) / 100;
      });
  };

  /**
   * This function gets calles whenever the user changes the wavetable position of the oscillator
   * It also gets called afer te user changed the number of voices
   */
  const setUpWaveForm = () => {
    waveTablePosition = store.getState().waveTablePosition;
    // setting the waveform of each oscillator node
    if (osc && waveTable) {
      osc.forEach((voice) => {
        voice.voice.setPeriodicWave(
          // @ts-ignore
          waveTable[waveTablePosition].periodicWave
        );
      });
    }
  };

  /**
   * creates a waveTable from an audioFile which is stored in the redux store
   * after that is done, the new waveTable is dispatched to the store
   */
  const createWaveTable = () => {
    const { audio } = store.getState().audioFile;
    const waveTableSampleLength = 2048;
    let audioArray = new Array(audio.length);
    let waveTableAudioArray = new Array<number[]>(
      Math.floor(audio.length / waveTableSampleLength)
    );
    for (let i = 0; i < audio.length; i++) audioArray[i] = audio[i];
    let audioPosition = 0;
    waveTableAudioArray.fill([]);
    waveTableAudioArray = waveTableAudioArray.map(() =>
      audioArray.slice(audioPosition, (audioPosition += waveTableSampleLength))
    );

    // get Phasors
    const phasors = waveTableAudioArray.map((wave) => FFT.fft(wave));

    // fourier coefficients
    let magnitudes = phasors.map((ph) => FFT.util.fftMag(ph));
    magnitudes = magnitudes.map((m) => m.map((a: number) => Math.floor(a)));
    magnitudes = magnitudes.map((m) => normalize(m));

    // set Wavetable
    const newWaveTable = magnitudes.map((m, i) => ({
      periodicWave: ctx.createPeriodicWave(
        m.map(() => 0),
        m
      ),
      samples: waveTableAudioArray[i],
      coefficients: m,
    }));

    store.dispatch(setWaveTable(newWaveTable));
    store.dispatch(setCurrentWave(newWaveTable[waveTablePosition]));
  };

  /**
   * constructs a waveform out of the current coefficients
   */
  const constructWaveForm = () => {
    if (currentWave) {
      // set periodic Wave
      currentWave.periodicWave = ctx.createPeriodicWave(
        currentWave.coefficients.map(() => 0),
        currentWave.coefficients
      );
      // fourier transform to set samples
      let sample;
      for (let x = 0; x < 2048; x++) {
        sample = 0;
        for (let k = 0; k < 1024; k++) {
          sample +=
            currentWave.coefficients[k] *
            Math.sin((-2 * Math.PI * x * k) / 2048);
        }
        currentWave.samples[x] = sample;
      }
      currentWave.samples = normalize(currentWave.samples);
    }
  };

  /**
   * changes the wavetable when the current waveform changes
   */
  const changeWaveTable = () => {
    if (waveTable && currentWave) {
      waveTable[waveTablePosition] = currentWave;
      store.dispatch(setWaveTable(waveTable));
      setUpWaveForm();
    }
  };

  /**
   *  -- Defining subscriptions --
   * These lines define on which propertychange of the redux store
   * which of the above functions are fired
   */
  const watchCtx = watch(store.getState, "ctx");
  store.subscribe(watchCtx(setUpOsc));
  const watchOsc = watch(store.getState, "osc");
  store.subscribe(watchOsc(startOsc));
  const watchVoices = watch(store.getState, "voices");
  store.subscribe(watchVoices(setUpOsc));
  const watchDetune = watch(store.getState, "detune");
  store.subscribe(watchDetune(setUpDetune));
  const watchWaveTablePosition = watch(store.getState, "waveTablePosition");
  store.subscribe(watchWaveTablePosition(setUpWaveForm));
  const watchAudioFileAudio = watch(store.getState, "audioFile.audio");
  store.subscribe(watchAudioFileAudio(createWaveTable));
  const watchWaveTable = watch(store.getState, "waveTable");
  store.subscribe(
    watchWaveTable(() => (waveTable = store.getState().waveTable))
  );
  const watchCurrentWave = watch(store.getState, "currentWave");
  store.subscribe(
    watchCurrentWave(() => (currentWave = store.getState().currentWave))
  );
  const watchCurrentWaveCoefficients = watch(
    store.getState,
    "currentWave.coefficients"
  );
  store.subscribe(watchCurrentWaveCoefficients(constructWaveForm));
  const watchCurrentWavePeriodicWave = watch(
    store.getState,
    "currentWave.periodicWave"
  );
  store.subscribe(watchCurrentWavePeriodicWave(changeWaveTable));

  // call this once when the page is loaded
  setUpOsc();
};

/**
 * This function gets called when the oscillator resives input
 */
export const connect = () => {
  const { ctx, osc } = store.getState();
  if (osc) osc.forEach((voice) => voice.pan.connect(ctx.destination));
};

/**
 * This function gets called when the oscillator stops getting input
 */
export const disconnect = () => {
  const { osc } = store.getState();
  if (osc) osc.forEach((voice) => voice.pan.disconnect());
};

/**
 * This function returns a position in [-1, 1] for a certain item
 * the values beetween -1 and 1 are on a grid with the grid size of @param steps
 * and the exact position is the grid point at @param index
 */
const spread = (steps: number, index: number): number => {
  if (steps === 1) return 0;
  else return (index - (steps - 1) / 2) / ((steps - 1) / 2);
};

/**
 * normalizes the numbers in an array of Floats in a range between [0, 1];
 * @param numArray
 */
const normalize = (numArray: number[]): number[] => {
  const max = Math.max(...numArray);
  return numArray.map((a) => a / max);
};
