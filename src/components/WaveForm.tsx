import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Konva from "konva";
import { State } from "../redux";

const WaveForm = () => {
  const { waveTable, waveTablePosition } = useSelector((state: State) => state);

  const renderKonva = () => {
    /**
     * calculate the coordinates of the samples based on
     * waveTable, waveTablePosition und stage
     */
    const calcCoordinates = () => {
      let coordinates: number[] = [];
      if (waveTable)
        waveTable[waveTablePosition].samples.map((sample, i) => {
          coordinates.push(
            calcX(i) * stage.width(),
            sample * (stage.height() / 2) + (stage.height() / 2)
          );
        });
      return coordinates;
    };

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
    let coordinates = calcCoordinates();

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

  /**
   * calculate the x coordinate based on
   * @param i index of the sample
   */
  const calcX = (i: number) => {
    if (waveTable) {
      const len = waveTable[waveTablePosition].samples?.length;
      return len ? i / len : i;
    }
    return 0;
  };

  useEffect(() => {
    renderKonva();
  }, [waveTable, waveTablePosition]);
  return <div id="container"></div>;
};

export default WaveForm;
