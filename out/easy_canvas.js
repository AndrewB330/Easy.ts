import { V } from "./easy_vec.js";
var SCALE_LEVELS = [0.04, 0.06, 0.09, 0.13, 0.2, 0.3, 0.45, 0.65, 1.0, 1.5, 2.25, 3.5, 5, 7.5, 11.5, 17, 25, 38];
var DEFAULT_SCALE_LEVEL = SCALE_LEVELS.indexOf(1);
var EasyCanvas = /** @class */ (function () {
    function EasyCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cameraTarget = V.ZERO2;
        this.scale = 1;
        this.updateTransform();
        this.previousMousePos = V.ZERO2;
        this.mouseDown = false;
    }
    EasyCanvas.prototype.fitToScreen = function () {
        this.canvas.width = Math.round(window.innerWidth * window.devicePixelRatio);
        this.canvas.height = Math.round(window.innerHeight * window.devicePixelRatio);
        this.canvas.style.height = this.canvas.height / window.devicePixelRatio + "px";
        this.canvas.style.width = this.canvas.width / window.devicePixelRatio + "px";
        this.updateTransform();
    };
    EasyCanvas.prototype.enableDrag = function () {
        var _this = this;
        this.canvas.addEventListener("mousedown", function (e) {
            _this.previousMousePos = [e.pageX, e.pageY];
            _this.mouseDown = true;
        });
        this.canvas.addEventListener("mouseleave", function (e) {
            _this.mouseDown = false;
        });
        this.canvas.addEventListener("mouseup", function (e) {
            _this.mouseDown = false;
        });
        this.canvas.addEventListener("mousemove", function (e) {
            if (_this.mouseDown) {
                var mouse = [e.pageX, e.pageY];
                var diff = V.mul(V.sub(mouse, _this.previousMousePos), window.devicePixelRatio / _this.scale);
                _this.cameraTarget = V.add(_this.cameraTarget, diff);
                _this.previousMousePos = mouse;
                _this.updateTransform();
            }
        });
    };
    EasyCanvas.prototype.enableZoom = function () {
        var _this = this;
        var scale_level = DEFAULT_SCALE_LEVEL;
        this.canvas.addEventListener("wheel", function (e) {
            if (e.deltaY < 0 && scale_level + 1 < SCALE_LEVELS.length) {
                scale_level++;
            }
            if (e.deltaY > 0 && scale_level > 0) {
                scale_level--;
            }
            _this.scale = SCALE_LEVELS[scale_level];
            _this.updateTransform();
        });
    };
    EasyCanvas.prototype.moveCameraTo = function (cameraTarget) {
        this.cameraTarget = cameraTarget;
        this.updateTransform();
    };
    EasyCanvas.prototype.clear = function () {
        this.ctx.clearRect(-(this.canvas.width * 0.5 + 5) / this.scale - this.cameraTarget[0], -(this.canvas.height * 0.5 + 5) / this.scale - this.cameraTarget[1], (this.canvas.width + 10) / this.scale, (this.canvas.height + 10) / this.scale);
    };
    EasyCanvas.prototype.renderCallback = function (callback) {
        var prevTimestamp = Date.now();
        var loop = function () {
            var curTimestamp = Date.now();
            callback(curTimestamp - prevTimestamp);
            prevTimestamp = curTimestamp;
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };
    EasyCanvas.prototype.mouseCallback = function (event, callback) {
        var _this = this;
        this.canvas.addEventListener(event, function (e) {
            var rect = _this.canvas.getBoundingClientRect();
            callback([
                ((e.pageX - rect.left) * window.devicePixelRatio - _this.canvas.width * 0.5) / _this.scale - _this.cameraTarget[0],
                ((e.pageY - rect.top) * window.devicePixelRatio - _this.canvas.height * 0.5) / _this.scale - _this.cameraTarget[1]
            ]);
        });
    };
    EasyCanvas.prototype.setStrokeStyle = function (lineWidth, color, dash) {
        if (dash === void 0) { dash = []; }
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.setLineDash(dash);
    };
    EasyCanvas.prototype.setFillStyle = function (color) {
        this.ctx.fillStyle = color;
    };
    EasyCanvas.prototype.segment = function (from, to, lineWidth, color, dash) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (color === void 0) { color = 'black'; }
        if (dash === void 0) { dash = []; }
        this.setStrokeStyle(lineWidth, color, dash);
        this.ctx.beginPath();
        this.ctx.moveTo(from[0], from[1]);
        this.ctx.lineTo(to[0], to[1]);
        this.ctx.stroke();
    };
    EasyCanvas.prototype.line = function (points, lineWidth, color, dash, close) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (color === void 0) { color = 'black'; }
        if (dash === void 0) { dash = []; }
        if (close === void 0) { close = false; }
        this.setStrokeStyle(lineWidth, color, dash);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        if (close)
            this.ctx.closePath();
        this.ctx.stroke();
    };
    EasyCanvas.prototype.circle = function (center, radius, lineWidth, color, dash) {
        if (lineWidth === void 0) { lineWidth = 1; }
        if (color === void 0) { color = 'black'; }
        if (dash === void 0) { dash = []; }
        this.setStrokeStyle(lineWidth, color, dash);
        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    };
    EasyCanvas.prototype.circleFill = function (center, radius, color) {
        if (color === void 0) { color = 'black'; }
        this.setFillStyle(color);
        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.ctx.fill();
    };
    EasyCanvas.prototype.updateTransform = function () {
        this.ctx.resetTransform();
        this.ctx.translate(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(Math.round(this.cameraTarget[0]), Math.round(this.cameraTarget[1]));
        //this.ctx.translate(0.5, 0.5);
    };
    return EasyCanvas;
}());
export { EasyCanvas };
