export var V;
(function (V) {
    V.ZERO2 = [0, 0];
    V.ZERO3 = [0, 0, 0];
    function add(a, b) {
        if (a.length != b.length) {
            throw 'Vector dimensions must be equal';
        }
        return a.map(function (v, i) { return v + b[i]; });
    }
    V.add = add;
    function sub(a, b) {
        if (a.length != b.length) {
            throw 'Vector dimensions must be equal';
        }
        return a.map(function (v, i) { return v - b[i]; });
    }
    V.sub = sub;
    function mul(a, b) {
        return a.map(function (v) { return v * b; });
    }
    V.mul = mul;
    function lengthSqr(a) {
        return a.reduce(function (prev, cur) { return prev + cur * cur; }, 0);
    }
    V.lengthSqr = lengthSqr;
    function length(a) {
        return Math.sqrt(lengthSqr(a));
    }
    V.length = length;
    function inverse(a, radius, center) {
        if (radius === void 0) { radius = 1; }
        if (center === void 0) { center = new Array(a.length).fill(0); }
        return add(center, mul(sub(a, center), (radius * radius) / lengthSqr(a)));
    }
    V.inverse = inverse;
    function cross2(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    V.cross2 = cross2;
    function cross3(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }
    V.cross3 = cross3;
    function dot(a, b) {
        return a.reduce(function (prev, cur, i) { return prev + cur * b[i]; }, 0);
    }
    V.dot = dot;
    function rotateXY(a) {
        return a.map(function (v, i) { return i == 0 ? -a[1] : (i == 1 ? a[0] : v); });
    }
    V.rotateXY = rotateXY;
})(V || (V = {}));
