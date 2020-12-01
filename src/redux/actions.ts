import { Dispatch } from "redux";
import {
  ActionTypes,
  CHANGE_WAVE_TABLE_POSITION,
  SET_AUDIO_FILE_REQUEST,
  SET_AUDIO_FILE_SUCCESS,
  SET_AUDIO_FILE_ERROR,
  SET_WAVETABLE,
  CHANGE_FREQUENCY_BIN,
  SET_CURRENT_WAVE,
  SET_IS_PLAYING,
} from "./types";

export type Action = { type: ActionTypes; payload?: any };
export type ActionCreator = (value?: any, id?: number) => Action;

export const setIsPlaying: ActionCreator = () => ({
  type: SET_IS_PLAYING,
});

export const setWaveTable: ActionCreator = (value) => ({
  type: SET_WAVETABLE,
  payload: value,
});

export const changeFrequencyBin: ActionCreator = (value, id) => ({
  type: CHANGE_FREQUENCY_BIN,
  payload: { id, value },
});

export const changeWaveTablePosition: ActionCreator = (value) => ({
  type: CHANGE_WAVE_TABLE_POSITION,
  payload: value,
});

export const setCurrentWave: ActionCreator = (value) => ({
  type: SET_CURRENT_WAVE,
  payload: value,
});

export const setAudioFileRequest: ActionCreator = () => ({
  type: SET_AUDIO_FILE_REQUEST,
});

const setAudioFileSuccess: ActionCreator = (value) => ({
  type: SET_AUDIO_FILE_SUCCESS,
  payload: value,
});

const setAudioFileError: ActionCreator = (value) => ({
  type: SET_AUDIO_FILE_ERROR,
  payload: value,
});

export const setAudioFile = (data: File | Response | null) => (
  dispatch: Dispatch
) => {
  dispatch(setAudioFileRequest());
  if (data) {
    data
      // @ts-ignore
      .arrayBuffer()
      .then((buffer: ArrayBuffer) => new AudioContext().decodeAudioData(buffer))
      .then((audioBuffer: AudioBuffer) =>
        dispatch(setAudioFileSuccess(audioBuffer.getChannelData(0)))
      )
      .catch((err: Error) => dispatch(setAudioFileError(err.message)));
  } else {
    const err = new Error("could not find data");
    dispatch(setAudioFileError(err.message));
  }
};
