import watch from "redux-watch";
import store, { setOsc, setWaveTable, Voice } from "../redux";
const FFT = require("fft-js");

/**
 * Creating global variables
 * Because of performance reasons, some of the Information from the redux store
 * are saved in global variables within the code, so that there are viewer request
 * to the store.
 */
let waveTable = store.getState().waveTable;

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
    const { ctx, osc, voices, waveTablePosition } = store.getState();

    // disconnecting all previously connected voices if they are not yet disconnected
    if (osc) osc.forEach((voice) => voice.pan.disconnect());

    // set up Oscillator by filing the osc array with the diffrent voices, pans, waveForms
    let newOsc = new Array<Voice>(voices);
    if (waveTable)
      for (let i = 0; i < voices; i++)
        newOsc[i] = {
          voice: ctx.createOscillator(),
          pan: ctx.createStereoPanner(),
          waveForm: waveTable[waveTablePosition].periodicWave,
        };

    // dispatch the new Oscillator to the redux store
    store.dispatch(setOsc(newOsc));
  };

  /**
   * This function gets called after the property oscillator has changed in the redux store
   * this means it gets called only every time after the setUpOsc Method
   */
  const startOsc = () => {
    const { osc } = store.getState();
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
    const { osc, waveTablePosition } = store.getState();
    waveTable = store.getState().waveTable;
    // setting the waveform of each oscillator node
    if (osc)
      osc.forEach((voice) =>
        voice.voice.setPeriodicWave(waveTable[waveTablePosition].periodicWave)
      );
  };

  /**
   * creates a waveTable from an audioFile which is stored in the redux store
   * after that is done, the new waveTable is dispatched to the store
   */
  const createWaveTable = () => {
    const { ctx } = store.getState();
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
    // normalize waveTableAudioArray
    // waveTableAudioArray = waveTableAudioArray.map((wave) => {
    //   const maxAmplitude = getMaxValue(wave);
    //   return wave.map((sample) => sample / maxAmplitude);
    // });

    // get Phasors
    const phasors = waveTableAudioArray.map((wave) => FFT.fft(wave));

    // fourier coefficients
    const magnitudes = phasors.map((ph) => FFT.util.fftMag(ph));

    // set Wavetable
    const newWaveTable = magnitudes.map((m, i) => ({
      periodicWave: ctx.createPeriodicWave(
        m.map(() => 0),
        m
      ),
      samples: waveTableAudioArray[i],
    }));
    store.dispatch(setWaveTable(newWaveTable));
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
  store.subscribe(watchWaveTable(setUpWaveForm));

  // when the application starts the oscillator gets set to its default settings
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
 * This function returns a position in [-1, 1] for a cirtain item
 * the values beetween -1 and 1 are on a grid with the grid size of @param steps
 * and the exact position is the grid point at @param index
 */
const spread = (steps: number, index: number): number => {
  if (steps === 1) return 0;
  else return (index - (steps - 1) / 2) / ((steps - 1) / 2);
};

/**
 * This function returns a positive value of the number which is the most away from 0
 * @param array
 */
const getMaxValue = (array: number[]): number => {
  let maxValue = 0;
  array.map((n) => {
    let currentValue = n;
    if (currentValue < 0) currentValue = currentValue * -1;
    if (currentValue > maxValue) {
      maxValue = n;
    }
  });
  return maxValue;
};
