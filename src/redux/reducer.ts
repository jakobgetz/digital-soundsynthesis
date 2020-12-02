import { Reducer } from "redux";
import {
  SET_IS_PLAYING,
  CHANGE_WAVE_TABLE_POSITION,
  SET_AUDIO_FILE_REQUEST,
  SET_AUDIO_FILE_ERROR,
  SET_AUDIO_FILE_SUCCESS,
  SET_WAVETABLE,
  CHANGE_FREQUENCY_BIN,
  SET_CURRENT_WAVE,
} from "./types";
import { Action } from "./actions";

type Wave = {
  periodicWave: PeriodicWave;
  samples: number[];
  coefficients: number[];
};

type FileUpload = {
  loading: boolean;
  audio: Float32Array;
  error: string
}

export type State = {
  isPlaying: boolean
  waveTablePosition: number;
  waveTable?: Wave[];
  currentWave?: Wave;
  audioFile: FileUpload
};

const initialState: State = {
  isPlaying: false,
  waveTablePosition: 0,
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
    case SET_IS_PLAYING:
      return { ...state, isPlaying: !state.isPlaying};
    case SET_WAVETABLE:
      return { ...state, waveTable: action.payload };
    case CHANGE_FREQUENCY_BIN:
      return { ...state, waveTable: changeFrequencyBin(state, action.payload) };
    case CHANGE_WAVE_TABLE_POSITION:
      return { ...state, waveTablePosition: action.payload };
    case SET_CURRENT_WAVE:
      return { ...state, currentWave: action.payload };
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

/**
 * This Method changes the Frequency bin at a specific index at the currently selected
 * waveForm in the waveTable (the only property that is changed here is 'coefficients')
 *
 * @param state current state
 * @param payload this is an object holding the id and the new value for the frequency bin
 */
const changeFrequencyBin = (
  state: State,
  payload: { value: number; id: number }
) => {
  const { waveTablePosition, waveTable } = state;
  if (waveTable)
    return waveTable.map((wave, p) => {
      if (p === waveTablePosition)
        wave.coefficients = wave.coefficients.map((c, i) => {
          if (payload.id === i) {
            return payload.value / 100;
          }
          return c;
        });
      return wave;
    });
};
