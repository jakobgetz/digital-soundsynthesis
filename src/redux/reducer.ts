import { Reducer } from "redux";
import {
  CHANGE_DETUNE,
  CHANGE_VOICES,
  CHANGE_WAVE_TABLE_POSITION,
  SET_OSC,
  SET_AUDIO_CONTEXT,
  // SET_VOICE_PAN,
  SET_AUDIO_FILE_REQUEST,
  SET_AUDIO_FILE_ERROR,
  SET_AUDIO_FILE_SUCCESS,
  SET_WAVETABLE,
} from "./types";
import { Action } from "./actions";

export type Voice = {
  voice: OscillatorNode;
  waveForm: PeriodicWave;
  pan: StereoPannerNode;
};

type Wave = { periodicWave: PeriodicWave; samples?: number[] };

export type State = {
  ctx: AudioContext;
  osc: Voice[] | null;
  voicePan: StereoPannerNode[] | null;
  waveForm: Wave | null;
  waveTablePosition: number;
  waveTable: Wave[];
  voices: number;
  detune: number;
  audioFile: {
    loading: boolean;
    error: string;
    audio: Float32Array;
  };
};

/**
 * Calculates and returns an Array with lenght 0, that contains a sawtooth wave form
 */
const initialWaveTable = (): Wave[] => {
  const ctx = new AudioContext();
  let waveTable = new Array<Wave>(3);
  waveTable.fill({ periodicWave: new PeriodicWave(ctx) });
  const n = 1024;
  const real = new Float32Array(496);
  const imag = new Float32Array(496);

  // calculate sine
  real[1] = 1;
  waveTable[0].periodicWave = ctx.createPeriodicWave(real, imag);
  // reset real/imag
  real.forEach(() => 0);
  imag.forEach(() => 0);

  // calculete square
  for (let x = 1; x < n; x += 2) imag[x] = 4 / (Math.PI * x);
  waveTable[1].periodicWave = ctx.createPeriodicWave(real, imag);
  // reset real/imag
  real.forEach(() => 0);
  imag.forEach(() => 0);

  // calculete saw
  for (let x = 1; x < n; x++) imag[x] = 4 / (Math.PI * x);
  waveTable[2].periodicWave = ctx.createPeriodicWave(real, imag);
  return waveTable;
};

const initialState: State = {
  ctx: new AudioContext(),
  osc: null,
  voicePan: null,
  waveForm: null,
  waveTablePosition: 0,
  waveTable: initialWaveTable(),
  voices: 1,
  detune: 0,
  audioFile: {
    loading: false,
    error: "",
    audio: new Float32Array(),
  },
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
    case SET_WAVETABLE:
      return { ...state, waveTable: action.payload };
    case CHANGE_WAVE_TABLE_POSITION:
      return { ...state, waveTablePosition: action.payload };
    case SET_AUDIO_FILE_REQUEST:
      return { ...state, audioFile: { ...state.audioFile, loading: true } };
    case SET_AUDIO_FILE_SUCCESS:
      return {
        ...state,
        audioFile: { loading: false, error: "", audio: action.payload },
      };
    case SET_AUDIO_FILE_ERROR:
      return {
        ...state,
        audioFile: {
          loading: false,
          error: action.payload,
          audio: new Float32Array(),
        },
      };
    default:
      return state;
  }
};
