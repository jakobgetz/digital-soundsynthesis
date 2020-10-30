import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../redux";

const CANVAS = styled.div`
  width: 300px;
  height: 100px;
  border: 1px solid black;
  margin: 5px;
  position: relative;
`;

type Props = {
  x: number;
  y: number;
};

const DIV = styled.div`
  position: absolute;
  left: ${(p: Props) => p.x * 100}%;
  bottom: ${(p: Props) => 50 + p.y * 50}%;
  width: 1px;
  height: 1px;
  background-color: black;
`;

export const WaveForm = () => {
  const { waveTable, waveTablePosition } = useSelector((state: State) => state);

  const calcX = (i: number) => {
    const len = waveTable[waveTablePosition].samples?.length;
    return len ? i / len : i;
  };
  return (
    <CANVAS>
      {waveTable[waveTablePosition].samples?.map((sample, i) => (
        <DIV key={i} x={calcX(i)} y={sample} />
      ))}
    </CANVAS>
  );
};
