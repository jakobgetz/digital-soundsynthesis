const FFT = require("fft-js");

// define functions

const createSine = (length, frequency) => {
  let sine = new Array(length);

  for (let t = 0; t < length; t++)
    sine[t] = Math.sin((frequency * 2 * Math.PI * t) / length);
  return sine;
};

const signal = createSine(1024, 50);

const phasors = FFT.fft(signal);
console.log(phasors);
const mag = phasors.map((ph) =>
  Math.sqrt(Math.pow(ph[0], 2) + Math.pow(ph[1], 2))
);
console.log(mag);

// var frequencies = FFT.util.fftFreq(phasors, 1024), // Sample rate and coef is just used for length, and frequency step
//   magnitudes = FFT.util.fftMag(phasors);

// var both = frequencies.map(function (f, ix) {
//   return { frequency: f, magnitude: magnitudes[ix] };
// });

// console.log(both);
