import './style.css';

// Создаем холст и контекст 2d

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Размеры холста совпадают с размерами окна браузера

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Определяем класс комплексных чисел

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  // Методы для арифметических действий с комплесными числами
  // Каждый метод возвращает новый объект класса Complex, с соответвующими
  // параметрами в конструкторе

  module() {
    return this.re ** 2 + this.im ** 2;
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

  // Для возведения комплесного числа в степень, применяется показательный метод

  power(degree) {
    const r = Math.sqrt(this.re ** 2 + this.im ** 2);
    const theta = Math.atan2(this.im, this.re);
    const x = r ** degree.re * Math.exp(-degree.im * theta);
    const y = degree.re * theta + degree.im * Math.log(r);

    const re = x * Math.cos(y);
    const im = x * Math.sin(y);
    return new Complex(re, im);
  }

  // Предусмотрены отдельные методы для возведения комплесного числа в квадрат и в куб

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

  // Предусмотрен отдельный метод для преобразования координат в соответвующие им пиксельные

  toPixels() {
    const re = canvas.width / 2 + this.re;
    const im = canvas.height / 2 - this.im;
    return new Complex(re, im);
  }
}

// Функция drawPoint используется для отрисовки отдельной точки на холсте

const drawPoint = function(ctx, point, radius, color, zoom) {
  ctx.fillStyle = color; // Сначала устанавливаем нужный цвет
  // Выполняем масштабирование, иначе фрактал получится слишком маленьким
  point.re *= zoom;
  point.im *= zoom;
  // Получаем правильные пиксельные координаты из canvas-координат
  const formatted = point.toPixels();
  ctx.rect(formatted.re, formatted.im, radius, radius); // Отрисовываем прямоугольник с заданным радиусом
  ctx.fill(); // Выполняем заливку прямоугольника заданным цветом
};

// Функция newtonMethod выполняет заданное число итераций по алгоритму Ньютона, для переданной точки с

const newtonMethod = function(f, fp, c, n) {
  let z = c;
  const e = 0.001;
  const [one, two, three, four] = [new Complex(1, 0), new Complex(2, 0), new Complex(3, 0), new Complex(4, 0)];

  let k = 20;
  let maxIter = n;
  let r = z.power(four).sub(one).module();

  while (k > 0 && r > e) {
    z = z.sub(f(z).div(fp(z)));
    r = z.power(four).sub(one).module();
    k--;
  }

  k == 0 && drawPoint(ctx, c, "#444", 5, 150);
}

const draw = function(xmin, xmax, ymin, ymax) {
  const step = .01;
  const n = 20;
  const [one, three, four] = [new Complex(1, 0), new Complex(3, 0), new Complex(4, 0)];

  const f = (z) => z.power(four).sub(one);
  const fp = (z) => four.mul(z.cube());
  let i, j;

  for (i = xmin; i < xmax; i += step) {
    for (j = ymin; j < ymax; j += step)
      newtonMethod(f, fp, new Complex(i, j), n);
  }
};

draw(-2, 2, -2, 2);
