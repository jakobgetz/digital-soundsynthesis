import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  State,
  changeWaveTablePosition,
  changeVoices,
  changeDetune,
  setAudioFile,
} from "../redux";

export const Inputs = () => {
  const maxVoices = 16,
    maxDetune = 100;

  const { voices, detune, waveTablePosition, waveTable } = useSelector(
    (state: State) => state
  );
  const dispatch = useDispatch();
  return (
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
      />
      Wavetable Position: {waveTablePosition} <br />
      <input
        type="file"
        onChange={(e) => dispatch(setAudioFile(e.target.files))}
      />
      Upload Wavetable
    </div>
  );
};
