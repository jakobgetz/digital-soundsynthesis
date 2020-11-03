import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  State,
  changeWaveTablePosition,
  changeVoices,
  changeDetune,
  setAudioFile,
  setCurrentWave,
} from "../redux";

export const Inputs = () => {
  const maxVoices = 16,
    maxDetune = 100;

  const { voices, detune, waveTablePosition, waveTable } = useSelector(
    (state: State) => state
  );
  const dispatch = useDispatch();

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAudioFile(e.target.files && e.target.files[0]));
  };

  return waveTable ? (
    <div>
      <input
        type="range"
        value={voices}
        min="1"
        max={`${maxVoices}`}
        onChange={(e) => dispatch(changeVoices(e.target.valueAsNumber))}
      />
      Voices: {voices} <br />
      <input
        type="range"
        value={detune}
        min="0"
        max={`${maxDetune}`}
        onChange={(e) => dispatch(changeDetune(e.target.valueAsNumber))}
      />
      Detune: {detune} <br />
      <input
        type="range"
        value={waveTablePosition}
        min="0"
        max={`${waveTable.length - 1}`}
        onChange={(e) =>
          dispatch(changeWaveTablePosition(e.target.valueAsNumber))
        }
        onMouseUp={() => dispatch(setCurrentWave(waveTable[waveTablePosition]))}
      />
      Wavetable Position: {waveTablePosition} <br />
      <input type="file" onChange={(e) => uploadFile(e)} />
      Upload Wavetable
    </div>
  ) : null;
};
