import React, { useEffect } from "react";
import {
  Inputs,
  WaveForm,
  //  FFT,
  //  Granular
} from "./components";

import osc, { connect, disconnect } from "./logic/osc";

function App() {
  // read osc function
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
  });

  // jsx
  return (
    <div>
      Osc <br />
      <Inputs />
      <WaveForm />
      <button onMouseDown={connect} onMouseUp={disconnect}>
        Play Sound
      </button>
    </div>
  );
}

export default App;
