import React, { lazy, Suspense, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { State, setAudioFile } from "./redux";
import osc, { connect, disconnect } from "./logic/osc";
import { Inputs, WaveForm } from "./components";
const Spectrum = lazy(() => import("./components/Spectrum"));

function App() {
  const { waveTable } = useSelector((state: State) => state);
  const dispatch = useDispatch();

  // load default wave table
  useEffect(() => {
    fetch("/Basic Shapes.wav").then((res) => dispatch(setAudioFile(res)));
  }, [dispatch]);

  // call osc function
  useEffect(osc, []);

  // add event listener so you can now play sound by pressing a on your keybord
  useEffect(() => {
    document.addEventListener("keydown", (e) => e.key === "a" && connect());
    document.addEventListener("keyup", (e) => e.key === "a" && disconnect());
    return () => {
      document.removeEventListener(
        "keydown",
        (e) => e.key === "a" && connect()
      );
      document.removeEventListener(
        "keyup",
        (e) => e.key === "a" && disconnect()
      );
    };
  }, []);

  // jsx
  return (
    <div>
      Osc <br />
      {waveTable && (
        <>
          <Inputs />
          <WaveForm />
          <Suspense fallback={<BeatLoader loading />}>
            <Spectrum />
          </Suspense>
          <button onMouseDown={connect} onMouseUp={disconnect}>
            Play Sound
          </button>
        </>
      )}
    </div>
  );
}

export default App;
