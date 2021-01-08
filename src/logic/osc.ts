import watch from "redux-watch";
import store, { setCurrentWave, setWaveTable } from "../redux";
const FFT = require("fft-js");

/**
 * This function is imported outside that file as 'osc'
 * it gets called when the application starts
 */
const osc = () => {
  /**
   * This function gets calles whenever the user changes the wavetable position of the oscillator
   * It also gets called afer te user changed the number of voices
   */
  const setUpWaveForm = () => {
    waveTablePosition = store.getState().waveTablePosition;
    // setting the waveform of the oscillator node
    if (waveTable) {
      osc.setPeriodicWave(waveTable[waveTablePosition].periodicWave);
    }
  };

  /**
   * starts or stops the playback of the oscillator when the play sound button is pressed
   */
  const connect = () => {
    const { isPlaying } = store.getState();
    isPlaying ? osc.connect(ctx.destination) : osc.disconnect();
  };

  /**
   * creates a waveTable from an audioFile which is stored in the redux store
   * after that is done, the new waveTable is dispatched to the store
   */
  const createWaveTable = () => {
    // get audio data from the store
    const { audio } = store.getState().audioFile;

    // define the sample length for each wave
    const waveTableSampleLength = 2048;

    // copy audio data from store into simple Array
    let audioArray = new Array(audio.length);
    for (let i = 0; i < audio.length; i++) audioArray[i] = audio[i];

    // copy the actual waveform samples into 2D Array
    let samples = new Array<number[]>(
      Math.floor(audio.length / waveTableSampleLength)
    );
    let audioPosition = 0;
    samples.fill([]);
    samples = samples.map(() =>
      audioArray.slice(audioPosition, (audioPosition += waveTableSampleLength))
    );

    // get Phasors
    const phasors = samples.map((wave) => FFT.fft(wave));

    // fourier coefficients
    let magnitudes = phasors.map((ph) => FFT.util.fftMag(ph));
    magnitudes = magnitudes.map((m) => m.map((a: number) => Math.floor(a)));
    magnitudes = magnitudes.map((m) => normalize(m));

    // create Wavetable
    const newWaveTable = magnitudes.map((m, i) => ({
      periodicWave: ctx.createPeriodicWave(
        m.map(() => 0),
        m
      ),
      samples: samples[i],
      coefficients: m,
    }));

    // set Wavetable in the store
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

    // set new waveTable
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
  const watchIsPlaying = watch(store.getState, "isPlaying");
  store.subscribe(watchIsPlaying(connect));
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

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  osc.start();

  /**
   * Creating global variables
   * Because of performance reasons, some of the Information from the redux store
   * are saved in global variables within the code, so that there are viewer requests
   * to the store.
   */
  let { waveTablePosition, waveTable, currentWave } = store.getState();

  setUpWaveForm();
};

/**
 * normalizes the numbers in an array of Floats in a range between [0, 1];
 * @param numArray
 */
const normalize = (numArray: number[]): number[] => {
  const max = Math.max(...numArray);
  return numArray.map((a) => a / max);
};

export default osc;
