import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { changeFrequencyBin, State } from "../redux";

type Props = {
  i: number;
};

const BIN = styled.input`
  transform: rotate(270deg);
  display: inline;
  position: absolute;
  left: ${(p: Props) => p.i * 20 - 20}px;
  width: 80px;
  bottom: 40px;
`;

export const BinSlider: React.FC<Props> = ({ i }) => {
  const { currentWave } = useSelector((state: State) => state);
  const [amplitude, setAmplitude] = useState(
    currentWave ? currentWave.coefficients[i] * 100 : 0
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setAmplitude(currentWave ? currentWave.coefficients[i] * 100 : 0);
  }, [currentWave]);

  return (
    <BIN
      type="range"
      key={i}
      i={i}
      value={Math.floor(amplitude)}
      onChange={(e) => setAmplitude(e.target.valueAsNumber)}
      onMouseUp={() => dispatch(changeFrequencyBin(amplitude, i))}
    />
  );
};
