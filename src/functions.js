const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  sum(other) { return new Complex(this.re + other.re, this.im + other.im); }
  sub(other) { return new Complex(this.re - other.re, this.im - other.im); }

  mul(other) {
    const re = this.re * other.re - this.im * other.im;
    const im = this.re * other.im + this.im * other.re;
    return new Complex(re, im);
  }

  div(other) {
    const denominator = other.re ** 2 + other.im ** 2;
    const re = (this.re * other.re + this.im * other.im) / denominator;
    const im = (this.im * other.re - this.re * other.im) / denominator;
    return new Complex(re, im);
  }

  power(degree) {
    const r = Math.sqrt(this.re ** 2 + this.im ** 2);
    const theta = Math.atan2(this.im, this.re);
    const x = r ** degree.re * Math.exp(-degree.im * theta);
    const y = degree.re * theta + degree.im * Math.log(r);

    const re = x * Math.cos(y);
    const im = x * Math.sin(y);
    return new Complex(re, im);
  }

  square() {
    const re = this.re * this.re - this.im * this.im;
    const im = 2 * this.re * this.im;
    return new Complex(re, im);
  }

  cube() {
    const re = this.re ** 3 - 3 * this.re * this.im ** 2;
    const im = 3 * this.re ** 2 * this.im - this.im ** 3;
    return new Complex(re, im);
  }

  module() {
    return this.re ** 2 + this.im ** 2;
  }

  toPixels() {
    const re = canvas.width / 2 + this.re;
    const im = canvas.height / 2 - this.im;
    return new Complex(re, im);
  }
}

const drawPoint = function(ctx, point, color) {
  ctx.fillStyle = color;
  point.re *= 150;
  point.im *= 150;
  const formatted = point.toPixels();
  ctx.rect(formatted.re, formatted.im, 5, 5);
  ctx.fill();
};

const newtonMethod = function(f, fp, c, n) {
  let z = c;
  const e = .001;
  const [one, two, three, four] = [new Complex(1, 0), new Complex(2, 0), new Complex(3, 0), new Complex(4, 0)];

  let k = 20;
  let maxIter = n;
  let r = z.power(four).sub(one).module();

  while (k > 0 && r > e) {
    z = z.sub(f(z).div(fp(z)));
    r = z.power(four).sub(one).module();
    k--;
  }

  k == 0 && drawPoint(ctx, c, "#444");
}

const drawFragment = function(c) {
  let z = new Complex(0, 0);
  let r = 0;
  let k = 20;

  while (k > 0 && r <= 4) {
    z = z.square().sum(c);
    r = z.re ** 2 + z.im ** 2;
    k--;
  }

  k == 0 && drawPoint(ctx, c, "royalblue");
};

const draw = function(xmin, xmax, ymin, ymax) {
  const step = .01;
  const n = 20;
  const [one, three, four] = [new Complex(1, 0), new Complex(3, 0), new Complex(4, 0)];

  const f = (z) => z.power(four).sub(one);
  const fp = (z) => four.mul(z.cube());

  for (let i = xmin; i < xmax; i += step) {
    for (let j = ymin; j < ymax; j += step) {
      let point = new Complex(i, j);
      newtonMethod(f, fp, point, n);
    }
  }
};