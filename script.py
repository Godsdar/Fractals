import pygame as pg
import numpy as np

res = width, height = 160, 100
offset = np.array([1.2 * width, height]) // 2
max_iter = 30
zoom = 2.2 / height

class Fractal:
    def __init__(self, app):
        self.app = app;
        self.screen_array = np.full((width, height, 3), [0, 0, 0], dtype=np.uint8)

    def render(self):
        for x in range(width):
            for y in range(height):
                c = (x - offset[0]) * zoom + 1j * (y - offset[1]) * zoom;
                z = c
                num_iter = 0
                for i in range(max_iter):
                    if z:
                      z -= (z ** 3 + 1) / (3 * z ** 2)
                    else:
                      z = 0
                    if abs(z ** 3 - 1) > 0.001:
                      break
                    num_iter += 1
                col = int(255 * num_iter / max_iter)
                self.screen_array[x, y] = (col, col, col)

    def update(self):
        self.render()

    def draw(self):
        pg.surfarray.blit_array(self.app.screen, self.screen_array)

    def run(self):
        self.update()
        self.draw()

class App:
    def __init__(self):
        self.screen = pg.display.set_mode(res, pg.SCALED)
        self.fractal = Fractal(self)

    def run(self):
        while True:
            self.screen.fill('black')
            self.fractal.run()
            pg.display.flip()

            [exit() for i in pg.event.get() if i.type == pg.QUIT]

if __name__ == '__main__':
    app = App()
    app.run()                 
