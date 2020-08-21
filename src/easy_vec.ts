export type Point = Array<number>;

export namespace V {
    export const ZERO2 = [0, 0];
    export const ZERO3 = [0, 0, 0];

    export function add(a: Point, b: Point): Point {
        if (a.length != b.length) {
            throw 'Vector dimensions must be equal';
        }
        return a.map((v, i) => v + b[i]);
    }

    export function sub(a: Point, b: Point): Point {
        if (a.length != b.length) {
            throw 'Vector dimensions must be equal';
        }
        return a.map((v, i) => v - b[i]);
    }

    export function mul(a: Point, b: number): Point {
        return a.map(v => v * b);
    }

    export function lengthSqr(a: Point): number {
        return a.reduce((prev, cur) => prev + cur * cur, 0);
    }

    export function length(a: Point): number {
        return Math.sqrt(lengthSqr(a));
    }

    export function inverse(a: Point, radius: number = 1, center: Point = new Array(a.length).fill(0)) {
        return add(center, mul(sub(a, center), (radius * radius) / lengthSqr(a)));
    }

    export function cross2(a: Point, b: Point): number {
        return a[0] * b[1] - a[1] * b[0];
    }

    export function cross3(a: Point, b: Point): Point {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    export function dot(a: Point, b: Point): number {
        return a.reduce((prev, cur, i) => prev + cur * b[i], 0);
    }

    export function rotateXY(a: Point): Point {
        return a.map((v, i) => i == 0 ? -a[1] : (i == 1 ? a[0] : v));
    }
}