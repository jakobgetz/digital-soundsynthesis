import store, { State, Action, setOsc } from "../redux";
import watch from "redux-watch";

export default () => {
  let prevState: State = store.getState();

  const setupOsc = () => {
    const { ctx, osc, voices } = store.getState();
    osc.forEach((voice) => voice.disconnect());
    let newOsc = new Array<OscillatorNode>(voices);
    for (let i = 0; i < voices; i++) newOsc[i] = ctx.createOscillator();
    store.dispatch(setOsc(newOsc));
  };

  const startOsc = () => {
    const { osc, ctx } = store.getState();
    for (const voice of osc) {
      voice.start();
    }
  };

  const setupVoices = () => {};

  const setupDetune = () => {};

  const setupWaveTablePosition = () => {
    console.log("yo");
  };

  const watchCtx = watch(store.getState, "ctx");
  store.subscribe(watchCtx(setupOsc));
  const watchOsc = watch(store.getState, "osc");
  store.subscribe(watchOsc(startOsc));
  const watchVoices = watch(store.getState, "voices");
  store.subscribe(watchVoices(setupOsc));

  //   store.subscribe(() => {
  //     console.log(prevState);
  //     if (store.getState().osc === null) setupOsc();
  //     else if (prevState.voices !== store.getState().voices) setupVoices();
  //     else if (prevState.detune !== store.getState().detune) setupDetune();
  //     else if (prevState.waveTablePosition !== store.getState().voices)
  //       setupWaveTablePosition();
  //     prevState = store.getState();
  //   });
  setupOsc();
};

export const connect = () => {
  const { ctx, osc } = store.getState();
  osc.forEach((voice) => voice.connect(ctx.destination));
};

export const disconnect = () => {
  const { osc } = store.getState();
  osc.forEach((voice) => voice.disconnect());
};
