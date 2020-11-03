import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Konva from "konva";
import { State } from "../redux";

export const WaveForm = () => {
  const { waveTable, waveTablePosition } = useSelector((state: State) => state);

  const renderKonva = () => {
    // Create Konva Stage
    let stage = new Konva.Stage({
      container: "container",
      width: 300,
      height: 100,
    });
    
    // Create one Konva Layer
    let layer = new Konva.Layer();

    // Create Outline for Konva Stage
    let container = new Konva.Rect({
      width: stage.width(),
      height: stage.height(),
      stroke: "black",
      strokeWidth: 1,
    });

    // Calculate coordinates for graph based on the samples
    let coordinates: number[] = [];
    waveTable[waveTablePosition].samples?.map((sample, i) => {
      coordinates.push(
        calcX(i) * stage.width(),
        sample * (stage.height() / 2 - 1) + stage.height() / 2
      );
    });

    // Create Konva Line based on the coordinates
    const graph = new Konva.Line({
      points: coordinates,
      stroke: "black",
      storkeWidth: 1,
    });

    // Add elements to Konva Stage
    layer.add(container);
    layer.add(graph);
    stage.add(layer);
  };

  const calcX = (i: number) => {
    const len = waveTable[waveTablePosition].samples?.length;
    return len ? i / len : i;
  };

  useEffect(() => {
    renderKonva();
  }, [waveTable, waveTablePosition]);
  return <div id="container"></div>;
};
