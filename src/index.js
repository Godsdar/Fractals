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

  // Этот метод возвращает модуль комплексного числа, возведенный в квадрат.
  // В алгоритме метода Ньютона используется именно квадрат модуля.

   squaredModule() {
    return this.re ** 2 + this.im ** 2;
  }

  // Предусмотрен отдельный метод для преобразования координат в соответвующие им пиксельные
  toPixels() {
    return new Complex(canvas.width / 2 + this.re, canvas.height / 2 - this.im);
  }

  // Методы для арифметических действий с комплесными числами
  // Каждый метод возвращает новый объект класса Complex, с соответвующими
  // параметрами в конструкторе

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
}

// Функция drawPoint используется для отрисовки отдельной точки на холсте
const drawPoint = function(ctx, point, color, radius, zoom) {
  ctx.fillStyle = color; // Сначала задаем нужный цвет
  // Выполняем масштабирование, иначе фрактал получится слишком маленьким
  point.re *= zoom;
  point.im *= zoom;
  // Получаем правильные пиксельные координаты из canvas-координат
  const formatted = point.toPixels();
  // Отрисовываем прямоугольник с заданным радиусом
  ctx.rect(formatted.re, formatted.im, radius, radius); 
  ctx.fill(); // Заливаем прямоугольник заданным цветом
};

// Функция newtonMethod выполняет заданное число итераций по алгоритму Ньютона, для переданной точки с
const newtonMethod = function (f, fp, c, n, coords) {
  let z = c; // Объявляем переменную z, которая будет хранить zn точку
  const e = 0.001; // Определяем границу точности
  // С помощью специального синтаксиса JavaScript, объявляем сразу четыре константы натуральных чисел в комплесной форме
  const [one, two, three, four] = [new Complex(1, 0), new Complex(2, 0), new Complex(3, 0), new Complex(4, 0)];
  let k = n; // Объявляем переменную, которая будет изменяться в цикле
  let r = z.power(four).sub(one).squaredModule(); // Переменная, отражающая условие выхода из цикла
  // Пока k не равно нулю и r больше e, продолжаем выполнение цикла
  while (k && r > e) {
    z = z.sub(f(z).div(fp(z))); // Вычисляем значение переменной на определенной итерации
    r = z.power(four).sub(one).squaredModule(); // Вычисляем условие выхода из цикла
    k--; // Уменьшаем переменную цикла
  }

  !k && coords.push(c); // Если k равно нулю, то добавляем в массив coords, координаты точки c.
};

// Функция calcCoords вычисляет координаты точек, принадлежащих границам фрактала Ньютона
const calcCoords = function (xmin, xmax, ymin, ymax) {
  const step = 0.005; // Задаем шаг, с которым будем идти по координатам плоскости
  const n = 25; // Задаем количество итераций которое будем использовать в функцци newtonMethod
  const [one, three, four] = [new Complex(1, 0), new Complex(3, 0), new Complex(4, 0)];
  const coords = []; // Создаем массив, который будет содержать координаты точек фрактала
  // Задаем функцию по которой будет отрисовываться фрактал
  // Используется функция без коэффицента, потому что в противном случае
  // вычисления оказались бы слишком тяжелыми для браузера
  const f = (z) => z.power(four).sub(one);
  // Определяем производную функции f
  const fp = (z) => four.mul(z.cube());
  let x, y; // Объявляем переменные цикла

  // Проходимся по каждой точке комплексной плоскости, находящейся
  // в заданных нами границах xmin, xmax, ymin, ymax.
  // Для каждой такой точки выполняем функцию newtonMethod

  for (x = xmin; x < xmax; x += step) {
    for (y = ymin; y < ymax; y += step)
      newtonMethod(f, fp, new Complex(x, y), n, coords);
  }

  return coords; // Возвращаем массив координат
};

// Функция run отрисовывает фрактал Ньютона
const run = function () {
  const coords = calcCoords(-0.9, 0.9, -0.8, 0.8);
  // Цикл "for of" используется для итерирования элементов массива
  for (let point of coords)
    drawPoint(ctx, point, "blue", 7, 150);
};

run();