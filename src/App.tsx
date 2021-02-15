import React, { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  State,
  setAudioFile,
  setIsPlaying,
  changeWaveTablePosition,
  setCurrentWave,
} from "./redux";
import osc from "./logic/osc";
import WaveForm from "./components/WaveForm";
const Spectrum = lazy(() => import("./components/Spectrum"));

function App() {
  const { waveTable, waveTablePosition } = useSelector((state: State) => state);
  const dispatch = useDispatch();

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAudioFile(e.target.files && e.target.files[0]));
  };

  // jsx
  return (
    <div>
      <h2>Oscillator</h2>
      <p>Google Chrome is required to run this application</p>
      {waveTable ? (
        <>
          {/* Input for changing the wavetable Position */}
          <input
            type="range"
            value={waveTablePosition}
            min="0"
            max={`${waveTable.length - 1}`}
            onChange={(e) =>
              dispatch(changeWaveTablePosition(e.target.valueAsNumber))
            }
            onMouseUp={() =>
              dispatch(setCurrentWave(waveTable[waveTablePosition]))
            }
          />
          Wavetable Position: {waveTablePosition} <br />
          {/* Input for upoading a wave file */}
          <input type="file" onChange={(e) => uploadFile(e)} />
          Upload Wavetable
          {/* Time / Amplitude Graphic */}
          <WaveForm />
          {/* Manipulative Spectrum 
          this component gets lazy loaded because there are a lot of elements wich would
          prevent the rest of the implementation from loading */}
          <Suspense fallback={<div>Load Spectrum</div>}>
            <Spectrum />
          </Suspense>
          {/* Start/Stop button */}
          <button onMouseDown={() => dispatch(setIsPlaying())}>
            Play Sound
          </button>
        </>
      ) : (
        // Aplication start button
        <button
          onClick={() => {
            osc();
            fetch("/Basic Shapes.wav").then((res) =>
              dispatch(setAudioFile(res))
            );
          }}
        >
          Start Application
        </button>
      )}
    </div>
  );
}

export default App;
