import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { State } from "../redux";
import { BinSlider } from "./BinSlider";

const CANVAS = styled.div`
  height: 120px;
  border: 1px solid black;
  overflow-y: scroll;
  position: relative;
`;

const Spectrum = () => {
  const { currentWave } = useSelector((state: State) => state);

  return (
    <CANVAS>
      {currentWave &&
        currentWave.coefficients.map(
          (_, i) => i !== 0 && i < 200 && <BinSlider key={i} i={i} />
        )}
    </CANVAS>
  );
};

export default Spectrum;
