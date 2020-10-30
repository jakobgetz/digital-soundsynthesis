import { Dispatch } from "redux";
import {
  ActionTypes,
  CHANGE_DETUNE,
  CHANGE_VOICES,
  CHANGE_WAVE_TABLE_POSITION,
  SET_OSC,
  SET_AUDIO_CONTEXT,
  SET_VOICE_PAN,
  SET_AUDIO_FILE_REQUEST,
  SET_AUDIO_FILE_SUCCESS,
  SET_AUDIO_FILE_ERROR,
  SET_WAVETABLE,
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

export const setVoicePan: ActionCreator = (value) => ({
  type: SET_VOICE_PAN,
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

export const setWaveTable: ActionCreator = (value) => ({
  type: SET_WAVETABLE,
  payload: value,
});

export const changeWaveTablePosition: ActionCreator = (value) => ({
  type: CHANGE_WAVE_TABLE_POSITION,
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

export const setAudioFile = (fileList: FileList | null) => (
  dispatch: Dispatch
) => {
  dispatch(setAudioFileRequest());
  if (fileList) {
    fileList[0]
      // @ts-ignore
      .arrayBuffer()
      .then((buffer: ArrayBuffer) => new AudioContext().decodeAudioData(buffer))
      .then((data: AudioBuffer) =>
        dispatch(setAudioFileSuccess(data.getChannelData(0)))
      )
      .catch((err: Error) => dispatch(setAudioFileError(err.message)));
  } else {
    const err = new Error("no file selected");
    dispatch(setAudioFileError(err.message));
  }
};
