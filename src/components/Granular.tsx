import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { State } from "../redux";

// let headerLength = 0;
// let source: AudioBufferSourceNode;
// let isPlaying = false;
// let currentPosition = 0;

// export const Granular = () => {
//   const [position, setPosition] = useState(0);
//   const [play, setPlay] = useState(false);
//   const [audioFile, setAudioFile] = useState<number[] | null>(null);
//   const [waveTable, setWaveTable] = useState<any>(null);
//   const [audio, setAudio] = useState<null | AudioBuffer>(null);
//   const { ctx } = useSelector((state: State) => state);

//   const writeBuffer = (buffer: ArrayBuffer) => {
//     let data = new Int8Array(buffer);

//     let headerData: number[] = [];
//     let audioData: number[] = [];
//     let currentInt;
//     for (let i = 0; i < 150; i++) {
//       currentInt = `${String.fromCharCode(data[i])}${String.fromCharCode(
//         data[i + 1]
//       )}${String.fromCharCode(data[i + 2])}${String.fromCharCode(data[i + 3])}`;
//       if (currentInt === "data") {
//         // data = data.slice(0, i + 4) as any;
//         headerLength = i + 4;
//         break;
//       }
//     }
//     for (let i = 0; i < headerLength; i++) headerData.push(data[i]);
//     setAudioFile(headerData);
//     // headerLength + 3 to jump over the data length
//     for (let i = headerLength + 3; i < data.length; i++)
//       audioData.push(data[i]);
//     splitAudio(audioData);
//   };

//   const splitAudio = (audioData: number[]) => {
//     audioData = audioData.slice(0, 311280);
//     let wT: any[][] = [];
//     let j = 0;
//     const waveLength = audioData.length / 40;
//     for (let i = 0; i < 40; i++) {
//       wT.push([]);
//       wT[i] = audioData.slice(j, j + waveLength);
//       j += waveLength;
//     }
//     setWaveTable(wT);
//   };

//   const printAudioFileUtf8 = () => {
//     if (audioFile) {
//       let audioFileString: string = "";
//       audioFile.forEach(
//         (byte) => (audioFileString += String.fromCharCode(byte))
//       );
//       console.log(audioFileString);
//     }
//   };

//   const playCurrentWave = () => {
//     if (audioFile) {
//       const af = new Int8Array(audioFile.length);
//       ctx
//         .decodeAudioData(af.buffer)
//         .then((a) => console.log(a))
//         .catch((e) => console.log(e));
//     }
//   };

//   useEffect(() => {
//     fetch("/DudaChoir.wav")
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => ctx.decodeAudioData(buffer))
//       .then((decodedAudio) => setAudio(decodedAudio));
//     source = ctx.createBufferSource();
//   }, []);

//   //   useEffect(() => {
//   //     if (audioFile) setAudioFile(audioFile.slice(0, headerLength));
//   //   }, [position]);

//   //   useEffect(() => {
//   //     if (audioFile && waveTable) {
//   //       let af = audioFile;
//   //       for (let i = 0; i < waveTable[position].length(); i++) {
//   //         af.push(waveTable[position][i]);
//   //       }
//   //       setAudioFile(af);
//   //     }
//   //   }, [audioFile]);

//   const pl = () => {
//     if (isPlaying) {
//       let src = ctx.createBufferSource();
//       src.buffer = audio;
//       src.connect(ctx.destination);
//       src.start(0, currentPosition, 0.01);

//       setTimeout(pl, 10);
//     }
//   };

//   useEffect(() => {
//     if (play) pl();
//   }, [play]);

//   useEffect(() => {
//     currentPosition = position;
//   }, [position]);

//   return (
//     <div>
//       Granular
//       <input
//         type="range"
//         min={0}
//         max={1}
//         step={0.01}
//         value={position}
//         onChange={(e) => setPosition(e.target.valueAsNumber)}
//       />
//       Position: {position}
//       <button
//         onClick={() => {
//           isPlaying = !isPlaying;
//           pl();
//         }}
//       >
//         Play Sound: {play.toString()}
//       </button>
//       <button onClick={printAudioFileUtf8}>Print buffer utf-8</button>
//       <button onClick={playCurrentWave}>Play CurrentWave</button>
//     </div>
//   );
// };
