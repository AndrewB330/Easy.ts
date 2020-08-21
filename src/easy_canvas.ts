import {Point, V} from "./easy_vec.js";

const SCALE_LEVELS = [0.04, 0.06, 0.09, 0.13, 0.2, 0.3, 0.45, 0.65, 1.0, 1.5, 2.25, 3.5, 5, 7.5, 11.5, 17, 25, 38];
const DEFAULT_SCALE_LEVEL = SCALE_LEVELS.indexOf(1);

export class EasyCanvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    cameraTarget: Point;
    scale: number;

    previousMousePos: Point;
    mouseDown: boolean;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.cameraTarget = V.ZERO2;
        this.scale = 1;
        this.updateTransform();

        this.previousMousePos = V.ZERO2;
        this.mouseDown = false;
    }

    fitToScreen() {
        this.canvas.width = Math.round(window.innerWidth * window.devicePixelRatio);
        this.canvas.height = Math.round(window.innerHeight * window.devicePixelRatio);
        this.canvas.style.height = this.canvas.height / window.devicePixelRatio + "px";
        this.canvas.style.width = this.canvas.width / window.devicePixelRatio + "px";
        this.updateTransform();
    }

    enableDrag() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.previousMousePos = [e.pageX, e.pageY];
            this.mouseDown = true;
        });
        this.canvas.addEventListener("mouseleave", (e) => {
            this.mouseDown = false;
        });
        this.canvas.addEventListener("mouseup", (e) => {
            this.mouseDown = false;
        });
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.mouseDown) {
                const mouse = [e.pageX, e.pageY];
                const diff = V.mul(V.sub(mouse, this.previousMousePos), window.devicePixelRatio / this.scale);
                this.cameraTarget = V.add(this.cameraTarget, diff);
                this.previousMousePos = mouse;
                this.updateTransform();
            }
        });
    }

    enableZoom() {
        let scale_level = DEFAULT_SCALE_LEVEL;
        this.canvas.addEventListener("wheel", (e) => {
            if (e.deltaY < 0 && scale_level + 1 < SCALE_LEVELS.length) {
                scale_level++;
            }
            if (e.deltaY > 0 && scale_level > 0) {
                scale_level--;
            }
            this.scale = SCALE_LEVELS[scale_level];
            this.updateTransform();
        });
    }

    moveCameraTo(cameraTarget: Point) {
        this.cameraTarget = cameraTarget;
        this.updateTransform();
    }

    clear() {
        this.ctx.clearRect(
            -(this.canvas.width * 0.5 + 5) / this.scale - this.cameraTarget[0],
            -(this.canvas.height * 0.5 + 5) / this.scale - this.cameraTarget[1],
            (this.canvas.width + 10) / this.scale,
            (this.canvas.height + 10) / this.scale
        );
    }

    renderCallback(callback) {
        let prevTimestamp = Date.now();
        const loop = () => {
            const curTimestamp = Date.now();
            callback(curTimestamp - prevTimestamp);
            prevTimestamp = curTimestamp;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    mouseCallback(event: "mouseup" | "mousedown" | "mousemove" | "mouseleave" | "mouseenter", callback) {
        this.canvas.addEventListener(event, (e) => {
            const rect = this.canvas.getBoundingClientRect();
            callback([
                ((e.pageX - rect.left) * window.devicePixelRatio - this.canvas.width * 0.5) / this.scale - this.cameraTarget[0],
                ((e.pageY - rect.top) * window.devicePixelRatio - this.canvas.height * 0.5) / this.scale - this.cameraTarget[1]
            ]);
        })
    }

    setStrokeStyle(lineWidth: number, color: string, dash: number[] = []) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.setLineDash(dash);
    }

    setFillStyle(color: string) {
        this.ctx.fillStyle = color;
    }

    segment(from: Point, to: Point, lineWidth: number = 1, color: string = 'black', dash: number[] = []) {
        this.setStrokeStyle(lineWidth, color, dash);
        this.ctx.beginPath();
        this.ctx.moveTo(from[0], from[1]);
        this.ctx.lineTo(to[0], to[1]);
        this.ctx.stroke();
    }

    line(points: Point[], lineWidth: number = 1, color: string = 'black', dash: number[] = [], close: boolean = false) {
        this.setStrokeStyle(lineWidth, color, dash);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        if (close) this.ctx.closePath();
        this.ctx.stroke();
    }

    circle(center: Point, radius: number, lineWidth: number = 1, color: string = 'black', dash: number[] = []) {
        this.setStrokeStyle(lineWidth, color, dash)
        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    circleFill(center: Point, radius: number, color: string = 'black') {
        this.setFillStyle(color);
        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    private updateTransform() {
        this.ctx.resetTransform();
        this.ctx.translate(
            Math.round(this.canvas.width / 2),
            Math.round(this.canvas.height / 2),
        );
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(
            Math.round(this.cameraTarget[0]),
            Math.round(this.cameraTarget[1])
        );
        this.ctx.translate(0.5, 0.5);
    }
}