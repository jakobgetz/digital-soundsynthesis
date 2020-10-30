import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useSelector } from "react-redux";
// import { State } from "../redux";
// import { sign } from "crypto";
// const ft = require("fourier-transform");
// const { fft, util } = require("fft-js");

// type Props = { x: number; y: number };

// const DIV = styled.div`
//   position: absolute;
//   width: 1px;
//   height: 3px;
//   left: ${(p: Props) => p.x}px;
//   bottom: ${(p: Props) => (p.y * 80) / 2 + 40}%;
//   background-color: black;
// `;

// const CANVAS = styled.div`
//   position: relative;
//   height: 400px;
//   border: 1px black solid;
// `;

// export const FFT = () => {
//   const createSine = () => {
//     var frequency = 440;
//     var size = 1024;
//     var sampleRate = 44100;
//     var waveform = new Array(size);
//     for (var i = 0; i < size; i++) {
//       waveform[i] = Math.sin(frequency * Math.PI * 2 * (i / sampleRate));
//     }
//     return waveform;
//   };
//   const [audio, setAudio] = useState<AudioBuffer | null>(null);
//   const [signal, setSignal] = useState<Float32Array | null>(null);
//   const [spectrum, setSpectrum] = useState<any[] | null>(null);
//   const [sine, setSine] = useState<number[]>(createSine());
//   const { ctx } = useSelector((state: State) => state);

//   const fold = () => {
//     // const loadSample = async (files: FileList | null) => {
//     //   if (files) {
//     //     const file = files[0];
//     //     const reader = new FileReader();
//     //     reader.readAsArrayBuffer(file);
//     //     reader.onload = () => {
//     //       const buffer = reader.result as ArrayBufferLike;
//     //       let data = new Uint8Array(buffer);
//     //       let newData: number[] = [];
//     //       let currentInt;
//     //       for (let i = 0; i < 150; i++) {
//     //         currentInt = `${String.fromCharCode(data[i])}${String.fromCharCode(
//     //           data[i + 1]
//     //         )}${String.fromCharCode(data[i + 2])}${String.fromCharCode(
//     //           data[i + 3]
//     //         )}`;
//     //         if (currentInt === "data") {
//     //           data = data.slice(i + 4) as any;
//     //           break;
//     //         }
//     //       }
//     //       for (let i = 0; i < data.length; i++) newData.push(data[i]);
//     //       setAudio(newData.slice(0, 1024));
//     //     };
//     //   }
//     // };
//     // useEffect(() => {
//     //   let signal = new Float32Array(1024);
//     //   for (let i = 0; i < signal.length; i++) {
//     //     signal[i] = Math.sin(2 * Math.PI * 440 * (i / 44100));
//     //   }
//     //   if (audio) {
//     //     console.log(signal);
//     //     setSpectrum(ft(signal));
//     //   }
//     // }, [audio]);
//     // const loadSine = () => {
//     //   fetch("/DudaChoir.wav")
//     //     .then((res) => res.arrayBuffer())
//     //     .then((buffer) => ctx.decodeAudioData(buffer))
//     //     .then((data) => {
//     //       setAudio(data);
//     //       setSignal(data.getChannelData(0));
//     //     });
//     // };
//     // useEffect(loadSine, []);
//     // useEffect(() => {
//     //   if (audio) {
//     //     const bS = ctx.createBufferSource();
//     //     bS.buffer = audio;
//     //     bS.connect(ctx.destination);
//     //     bS.start();
//     //   }
//     // }, [audio]);
//   };

//   const loadSine = () => {
//     fetch("/DudaChoir.wav")
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => ctx.decodeAudioData(buffer))
//       .then((data) => {
//         setAudio(data);
//         setSignal(data.getChannelData(0));
//       });
//   };
//   useEffect(loadSine, []);

//   useEffect(() => {
//     if (audio) {
//       const bS = ctx.createBufferSource();
//       bS.buffer = audio;
//       bS.connect(ctx.destination);
//       bS.start();
//     }
//   }, [audio]);

//   useEffect(() => {
//     if (signal) {
//       let s = new Array<any>(signal.length);
//       for (let i = 0; i < signal.length; i++) s[i] = signal[i];
//       console.log(s);
//       console.log(sine);
//       let phasors = fft(s.slice(0, 1024 * 2));
//       // let pwd = phasors.map((freq: any[]) => {
//       // magnitude
//       //   let power =
//       //     (freq[0] * freq[0] +
//       //       freq[0] * -freq[1] +
//       //       freq[1] * freq[0] +
//       //       freq[1] * -freq[1] * -1) /
//       //     s.length;
//       //   return power;
//       // });
//       console.log(phasors);
//       var frequencies = util.fftFreq(phasors, 44100), // Sample rate and coef is just used for length, and frequency step
//         magnitudes = util.fftMag(phasors);

//       var both = frequencies.map(function (f: any, ix: any) {
//         return { frequency: f, magnitude: magnitudes[ix]};
//       });

//       setSpectrum(both);
//     }
//   }, [signal]);

//   return (
//     <>
//       <CANVAS>
//         <br />
//         {/* <input type="file" onChange={(e) => loadSample(e.target.files)} /> */}
//         <button onClick={() => console.log(audio)}>print audio</button>
//         <button onClick={() => console.log(signal)}>print signal</button>
//         <button onClick={() => console.log(spectrum)}>Print Spectrum</button>
//         {sine && sine.map((value, i) => <DIV key={i} x={i} y={value} />)}
//       </CANVAS>
//       <CANVAS>
//         {spectrum &&
//           spectrum.map((freq, i) => <DIV key={i} x={i} y={freq.magnitude} />)}
//       </CANVAS>
//     </>
//   );
// };
