# Easy.ts

[![Badge](https://img.shields.io/badge/Typescript-blue.svg)](https://github.com/AndrewB330/)
[![Badge](https://europe-west6-xlocc-badge.cloudfunctions.net/XLOCC/AndrewB330/Easy.ts)](https://github.com/AndrewB330/)

Library that contains three modules:

- **EasyVec** - allows you to work with arrays as with vectors of arbitrary dimension. Contains all essential functions like `add`, `sub` (subtract), `mul` (multiply), `dot` (dot product), `cross2` (2d cross product), `cross3` (3d cross product), `length`, `normalized` and more.
- **EasyMat** - allows you to work with 2d arrays as with matrices. Contains all essential function. (Not ready)
- **EasyCanvas** - makes canvas interface easier.

Run `./tsc` to build js files.

# EasyCanvas

Quick example:
```ts
import {EasyCanvas} from "../out/easy_canvas.js";
const easyCanvas = new EasyCanvas("canvas-element-id");
easyCanvas.fitToScreen();
easyCanvas.enableDrag();
easyCanvas.enableZoom();

const circles = [];
const colors = [];

easyCanvas.mouseCallback("mousedown", (pos) => {
    circles.push(pos);
    colors.push(`hsl(${Math.floor(Math.random() * 256)}, 50%, 65%)`);
});

easyCanvas.renderCallback(() => {
    easyCanvas.clear();
    circles.forEach((c, i) => {
        easyCanvas.circleFill(c, 14, colors[i]);
    });
});
```