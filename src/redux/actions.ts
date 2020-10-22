import {
  ActionTypes,
  CHANGE_DETUNE,
  CHANGE_VOICES,
  CHANGE_WAVE_TABLE_POSITION,
  SET_OSC,
  SET_AUDIO_CONTEXT,
} from "./types";

export type Action = { type: ActionTypes; payload?: any };
export type ActionCreator = (value?: any) => Action;

export const setAudioContext: ActionCreator = () => ({
  type: SET_AUDIO_CONTEXT,
});

export const setOsc: ActionCreator = (value) => ({
  type: SET_OSC,
  payload: value,
});

export const changeVoices: ActionCreator = (value) => ({
  type: CHANGE_VOICES,
  payload: value,
});

export const changeDetune: ActionCreator = (value) => ({
  type: CHANGE_DETUNE,
  payload: value,
});

export const changeWaveTablePosition: ActionCreator = (value) => ({
  type: CHANGE_WAVE_TABLE_POSITION,
  payload: value,
});
