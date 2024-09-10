self.onmessage = function ({ data }) {
  const write = new Function(
    "return " + data.function
    )();
  const fractal = write(data.min, data.max, data.min, data.max);
  self.postMessage({
    answer: fractal
  });
};