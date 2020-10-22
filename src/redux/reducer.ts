import { Reducer } from "redux";
import {
  CHANGE_DETUNE,
  CHANGE_VOICES,
  CHANGE_WAVE_TABLE_POSITION,
  SET_OSC,
  SET_AUDIO_CONTEXT,
} from "./types";
import { Action } from "./actions";

export type State = {
  ctx: AudioContext;
  osc: OscillatorNode[];
  waveForm: PeriodicWave | null;
  waveTablePosition: number;
  waveTable: PeriodicWave[] | null;
  voices: number;
  detune: number;
};

const initialState: State = {
  ctx: new AudioContext(),
  osc: [new AudioContext().createOscillator()],
  waveForm: null,
  waveTablePosition: 0,
  waveTable: null,
  voices: 1,
  detune: 0,
};

export const reducer: Reducer<State, Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_AUDIO_CONTEXT:
      return { ...state, ctx: new AudioContext() };
    case SET_OSC:
      return { ...state, osc: action.payload };
    case CHANGE_VOICES:
      return { ...state, voices: action.payload };
    case CHANGE_DETUNE:
      return { ...state, detune: action.payload };
    case CHANGE_WAVE_TABLE_POSITION:
      return { ...state, waveTablePosition: action.payload };
    default:
      return state;
  }
};
