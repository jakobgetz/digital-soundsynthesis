import React, { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { State, setAudioFile, setIsPlaying } from "./redux";
import { Inputs, WaveForm } from "./components";
import osc from "./logic/osc";
const Spectrum = lazy(() => import("./components/Spectrum"));

function App() {
  const { waveTable } = useSelector((state: State) => state);
  const dispatch = useDispatch();

  // jsx
  return (
    <div>
      Osc <br />
      {waveTable ? (
        <>
          <Inputs />
          <WaveForm />
          <Suspense fallback={<div>Load Spectrum</div>}>
            <Spectrum />
          </Suspense>
          <button onMouseDown={() => dispatch(setIsPlaying())}>
            Play Sound
          </button>
        </>
      ) : (
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
