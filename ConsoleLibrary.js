window.PI = Math.PI;
window.round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
window.R2D = r => r * 180 / PI;
window.D2R = d => d / 180 * PI;

window.math = {
    //basic ops
    fac: x => x > 1 ? math.fac(x - 1) * x : 1,

    lerp: (a, b, t) => a + (b - a) * Math.max(Math.min(t, 1), 0),

    // probability
    mean: data => data.reduce((a, v) => a + v, 0) / data.length,
    expected: (prob_data, expression = 'X', data = 0) => prob_data.reduce((a, v, i) => a + v * eval((expression ? expression : 'X').replace('X', data ? data[i] : i).replace('^', '**')), 0),
    choose: (n, x) => math.fac(n) / (math.fac(x) * math.fac(n - x)),
    permute: (n, x) => math.fac(n) / math.fac(x),
    binomial: (prob, x, n) => prob ** x * (1 - prob) ** (n - x) * math.choose(n, x),
    cumbinomial: (prob, x1, x2, n) => [...Array(x2 - x1 + 1)].reduce((a, _, i) => a + math.binomial(prob, i + x1, n), 0),
    probvar: data => math.expected(data, 'X^2') - math.expected(data) ** 2,
    popvar: data => data.reduce((a, v) => a + (v - math.mean(data)) ** 2, 0) / data.length,
    sampvar: data => data.reduce((a, v) => a + (v - math.mean(data)) ** 2, 0) / (data.length - 1),
    popstdev: data => (data.reduce((a, v) => a + (v - math.mean(data)) ** 2, 0) / data.length) ** .5,
    sampstdev: data => (data.reduce((a, v) => a + (v - math.mean(data)) ** 2, 0) / (data.length - 1)) ** .5,
    poissondist: (x, lambda) => Math.exp(-lambda) * lambda ** x / math.fac(x),
    cumpoissondist: (x1, x2, lambda) => [...Array(x2 - x1 + 1)].reduce((a, _, i) => a + math.poisson(i + x1, lambda), 0),
    multinomialdist: (prob, x, n = 0) => math.fac(n ? n : x.reduce((a, v) => a + v, 0)) / x.reduce((a, v) => a * math.fac(v), 1) * prob.reduce((a, v, i) => a * v ** x[i], 1),
    normdist: (x, mean = 0, stdev = 1) => 1 / (stdev * (2 * PI) ** .5) * Math.exp(-.5 * ((x - mean) / stdev) ** 2),
    erf: x => Math.tanh(x * PI / 6 ** .5),
    cumstdnormdist: (x, iters = 100) => .5 + 1 / (2 * PI) ** .5 * [...Array(iters)].reduce((a, _, i) => a + (-1) ** i * Math.max(Math.min(x, 7.24067455), -7.24067455) ** (2 * i + 1) / 2 ** i / math.fac(i) / (2 * i + 1), 0),
    cumnormdist: (x, mean, stdev) => math.cumstdnormdist((x - mean) / stdev, 100),
    invcumnormdist: (p, mean = 0, stdev = 1, tol = .0001) => {
        x = mean, cp = 0;
        while (Math.abs((cp = math.cumnormdist(x, mean, stdev)) - p) > tol) x += (p - cp) * stdev * .01;
        return x;
    },
    expdist: (x, lambda) => x >= 0 ? lambda * Math.exp(-lambda * x) : 0,
    cumexpdist: (x, lambda) => x >= 0 ? 1 - Math.exp(-lambda * x) : 0,
    pCn_or: (p, n, l = []) => p.reduce((ac, v, i, ar) => [...ac, ...n > 1 ? math.pCn_or(ar.filter(f => f != v), n - 1, [...l, v]) : [[...l, v]]], []),
    pCn_uo: (p, n, l = []) => p.reduce((ac, v, i, ar) => [...ac, ...n > 1 ? math.pCn_uo(ar.slice(i + 1), n - 1, [...l, v]) : [[...l, v]]], []),
}
class Vec {
    constructor(a, b, IsPolar = 0, props = undefined) {
        if (props) {
            this._base = props.base;
            this._trace = props.trace;
            this._color = props.color;
            this._alpha = props.alpha;
        }
        if ((a instanceof Vec) || (a instanceof Point)) {
            this._x = a.X;
            this._y = a.Y;
            this._polarUpdated = false;
            this._rectUpdated = true;
        }
        else if (a instanceof Array) {
            this._x = a[0];
            this._y = a[1];
            this._polarUpdated = false;
            this._rectUpdated = true;
        }
        else if (typeof (a) == 'number') {
            if (IsPolar) {
                if (typeof (b) == 'number') { this._r = a; this._t = b; } else { this._t = a; this._r = 1; }
                this._polarUpdated = true;
                this._rectUpdated = false;
            }
            else {
                if (typeof (b) == 'number') { this._x = a; this._y = b; } else { this._x = a; this._y = a; }
                this._polarUpdated = false;
                this._rectUpdated = true;
            }
        }
        else {
            throw `Invalid Vec initialization ${a} ${b} ${IsPolar} ${base}`;
        }
    }

    get X() { if (!this._rectUpdated) this._updaterect(); return this._x; }
    get Y() { if (!this._rectUpdated) this._updaterect(); return this._y; }
    get T() { if (!this._polarUpdated) this._updatepolar(); return this._t; }
    get R() { if (!this._polarUpdated) this._updatepolar(); return this._r; }
    get Base() { return this._base || new Vec(0, 0); }
    get Trace() { return this._trace; }
    get Tip() { return this._base ? this._base.add(this) : this }
    set X(x) { if (!this._rectUpdated) this._updaterect(); this._x = x; this._polarUpdated = false; }
    set Y(y) { if (!this._rectUpdated) this._updaterect(); this._y = y; this._updatepolar(); this._polarUpdated = false; }
    set T(t) { if (!this._polarUpdated) this._updatepolar(); this._t = t % (PI * 2); this._updaterect(); this._rectUpdated = false; }
    set R(r) { if (!this._polarUpdated) this._updatepolar(); this._r = r; this._updaterect(); this._rectUpdated = false; }
    set Base(b) { this._base = b; }
    _updatepolar() { this._t = ((this.X < 0 || this.Y < 0) ? PI : 0) + ((this.X > 0 && this.Y < 0) ? PI : 0) + (this.X == 0 ? PI / 2 : Math.atan(this.Y / this.X)); this._r = Math.hypot(this.X, this.Y); this._polarUpdated = true; }
    _updaterect() { this._x = Math.cos(this.T) * this.R; this._y = Math.sin(this.T) * this.R; this._rectUpdated = true; }


    static Add(v1, v2) { return new Vec(v1.X + v2.X, v1.Y + v2.Y); }
    static Dot(v1, v2) { return v1.X * v2.X + v1.Y * v2.Y; }
    static Sub(v1, v2) { return new Vec(v1.X - v2.X, v1.Y - v2.Y); }
    static Mul(v1, v2) { return new Vec(v1.X * v2.X, v1.Y * v2.Y); }
    static Div(v1, v2) { return new Vec(v1.X / v2.X, v1.Y / v2.Y); }
    static AngleBetween(v1, v2) { return (v1.T - v2.T + PI * 4) % PI; }
    static Pow(v, x) { return v.normalized.mul(Math.pow(v.R, x)); }
    static Normalize(v) { let r = v.R; v.X /= r; v.Y /= r; return v; }

    add(v) { return Vec.Add(this, new Vec(v)); }
    dot(v) { return Vec.Dot(this, new Vec(v)); }
    sub(v) { return Vec.Sub(this, new Vec(v)); }
    mul(v) { return Vec.Mul(this, new Vec(v)); }
    div(v) { return Vec.Div(this, new Vec(v)); }
    angleBetween(v) { return Vec.AngleBetween(this, v); }
    proj(v) { return v.mul(v.dot(this)); }
    pow(x) { return Vec.Pow(this, x); }
    set(a, b, isPolar = false) {
        let newVec = new Vec(a, b, isPolar);
        this.X = newVec.X;
        this.Y = newVec.Y;
    }
    toString() { return `${round(this.X, 2)} ${round(this.Y, 2)}` }
    normalize() { return Vec.Normalize(this); }
    get normalized() { return new Vec(this.X / this.R, this.Y / this.R); }
}
class Point {
    constructor(a, b, IsPolar = false, props = undefined) {
        if (props) {
            this._trace = props.trace;
            this._color = props.color;
            this._alpha = props.alpha;
        }
        this._vec = new Vec(a, b, IsPolar);
    }
    get X() { return this._vec.X; }
    get Y() { return this._vec.Y; }
    get R() { return this._vec.R; }
    get T() { return this._vec.T; }
    get V() { return this._vec; }
    get Trace() { return this._trace; }
    set V(x) { this._vec.X = x.X; this._vec.Y = x.Y; }

    add(v) { return Vec.Add(this.V, v); }
    sub(v) { return Vec.Sub(this.V, v); }
}
class Line {
    constructor(a, b, c, d, props) {
        if (props) {
            this._color = props.color;
            this._alpha = props.alpha;
        }
        if (typeof (a) == 'number' && typeof (b) == 'number') {
            this.A = new Vec(a, b);
            this.B = new Vec(c, d);
        }
        else if (a instanceof Vec || a instanceof Point || a instanceof Array) {
            this.A = a;
            this.B = b;
        }
    }

    setA(a = 0, b = 0) {
        this.A = new Vec(a, b);
    }
    setB(a = 0, b = 0) {
        this.B = new Vec(a, b);
    }
}

class Text {
    constructor(getText, point, color, opacity) {
        this.getText = getText;
        this.P = point;
        this._color = color;
        this._alpha = opacity;
    }
}



window.canvas = {
    _element: null,
    _context: null,
    _starttime: 0,
    _lastframetime: 0,
    _width: 0,
    _height: 0,
    _unusedColors: ['black', 'red', 'green', 'blue', 'purple', 'brown', 'coral', 'darkgrey', 'darkorange', 'darkslategrey', 'gold', 'maroon', 'midnightblue', 'teal'],


    showGraph: true,
    size: new Vec(10, 10),
    center: new Vec(0, 0),
    maintainAspectRatio: true,

    graphStyle: {
        showTicks: false,
        showAxis: true,
        showGridlines: true,
    },

    _objects: [],
    _trace_points: [],
    _loop_functions: [],

    _init() {
        // Init Element
        canvas._element = document.createElement("canvas");
        canvas._element.style.width = '100%';
        canvas._element.style.height = '100%';
        canvas._element.style.top = '0';
        canvas._element.style.left = '0';
        canvas._element.style.position = 'absolute';
        canvas._element.style.zIndex = 1000000;
        document.body.appendChild(canvas._element);

        // Init Context
        canvas._context = canvas._element.getContext('2d');

        canvas._starttime = Date.now();

        // Init Loop
        let loop = () => {
            canvas._width = canvas._element.width = window.innerWidth;
            canvas._height = canvas._element.height = window.innerHeight;
            if (canvas.maintainAspectRatio) canvas.size.Y = canvas.size.X * (canvas._height / canvas._width);

            canvas._context.clearRect(0, 0, canvas.width, canvas.height);



            // Draw Graph
            if (canvas.showGraph) {
                let lowerX = Math.floor(canvas.center.X - canvas.size.X / 1.95);
                let upperX = Math.ceil(canvas.center.X + canvas.size.X / 1.95);
                let lowerY = Math.floor(canvas.center.Y - canvas.size.Y / 1.95);
                let upperY = Math.ceil(canvas.center.Y + canvas.size.Y / 1.95);

                if (canvas.graphStyle.showGridlines) {
                    canvas.setLineWidth(1);
                    canvas.setStrokeColor('lightgrey');
                    canvas.beginPath();
                    for (let x = lowerX; x <= upperX; x++) {
                        canvas.moveTo(x, lowerY);
                        canvas.lineTo(x, upperY);
                    }
                    for (let y = lowerY; y <= upperY; y++) {
                        canvas.moveTo(lowerX, y);
                        canvas.lineTo(upperX, y);
                    }
                    canvas.stroke();
                }
                if (canvas.graphStyle.showAxis) {
                    canvas.setLineWidth(2);
                    canvas.setStrokeColor('black');
                    canvas.beginPath();
                    canvas.moveTo(lowerX, 0);
                    canvas.lineTo(upperX, 0);
                    canvas.moveTo(0, lowerY);
                    canvas.lineTo(0, upperY);
                    canvas.stroke();
                }
                if (canvas.graphStyle.showTicks) {
                    canvas.setLineWidth(2);
                    canvas.setStrokeColor('black');
                    canvas.beginPath();
                    for (let x = lowerX; x <= upperX; x++) {
                        canvas.moveTo(x, .1);
                        canvas.lineTo(x, -.1);
                    }
                    for (let y = lowerY; y <= upperY; y++) {
                        canvas.moveTo(.1, y);
                        canvas.lineTo(-.1, y);
                    }
                    canvas.stroke();
                }
            }

            // loop functions
            let time = Date.now();
            let dt = (time - canvas._lastframetime) / 1000;
            let elapsed = (time - canvas._starttime) / 1000;
            canvas._loop_functions.forEach(func => func(dt, elapsed));
            canvas._lastframetime = time;

            // Draw Objects
            let textY = 30;
            canvas._objects.forEach(obj => {
                if (!('_color' in obj)) obj._color = canvas._unusedColors.shift();
                canvas.setStrokeColor(obj._color);
                canvas.setFillColor(obj._color);
                canvas._context.globalAlpha = obj._alpha || 1;
                if (obj instanceof Vec) {
                    canvas.setLineWidth(3);

                    canvas.beginPath();
                    canvas.moveTo(obj.Base);
                    canvas.lineTo(obj.Tip);
                    canvas.moveTo(obj.Tip.add(new Vec(Math.min(.2, obj.R / 2), obj.T + PI / 1.2, true)));
                    canvas.lineTo(obj.Tip);
                    canvas.moveTo(obj.Tip.add(new Vec(Math.min(.2, obj.R / 2), obj.T - PI / 1.2, true)));
                    canvas.lineTo(obj.Tip);
                    canvas.stroke();

                    canvas._context.font = '24px Arial';
                }
                else if (obj instanceof Point) {
                    canvas.beginPath();
                    canvas.arc(obj, .1);
                    canvas.fill();

                    if (obj.Trace) {
                        canvas._trace_points.push({ x: obj.X, y: obj.Y, c: obj._color });
                    }
                }
                else if (obj instanceof Line) {
                    canvas.setLineWidth(3);
                    canvas.beginPath();
                    canvas.moveTo(obj.A);
                    canvas.lineTo(obj.B);
                    canvas.stroke();
                }
                else if (obj instanceof Text) {
                    canvas._context.fillText(obj.getText(dt), obj.P ? obj.P.X : 20, obj.P ? obj.P.Y : textY);
                    textY += 30;
                }
            });

            canvas._trace_points.forEach(p => {
                canvas.setFillColor(p.c);
                canvas.beginPath();
                canvas.arc(new Vec(p.x, p.y), .02);
                canvas.fill();
            });

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    },

    addloopfunction(func) {
        canvas._loop_functions.push(func);
        return func;
    },
    removeloopfunction(func) {
        if (func == null) return canvas._loop_functions.pop();
        canvas._loop_functions.splice(canvas._loop_functions.indexOf(func), 1);
        return func;
    },

    add: obj => canvas._objects.push(obj),
    makePoint(a, b) {
        let newObj = new Point(a, b);
        canvas.add(newObj);
        return newObj;
    },
    makeVec(a, b) {
        let newObj = new Vec(a, b);
        canvas.add(newObj);
        return newObj;

    },
    makeLine(a, b, c, d) {
        let newObj = new Line(a, b, c, d);
        canvas.add(newObj);
        return newObj;
    },

    _transformVec(v) {
        let xscale = canvas._width / canvas.size.X;
        let yscale = canvas._height / canvas.size.Y;
        let screenX = (v.X - canvas.center.X + canvas.size.X / 2) * xscale;
        let screenY = canvas._height - (v.Y - canvas.center.Y + canvas.size.Y / 2) * yscale;
        return new Vec(screenX, screenY);
    },
    _transformScalar: s => s * canvas._width / canvas.size.X,
    moveTo(a, b) {
        let tv = canvas._transformVec(new Vec(a, b));
        canvas._context.moveTo(tv.X, tv.Y);
    },
    lineTo(a, b) {
        let tv = canvas._transformVec(new Vec(a, b));
        canvas._context.lineTo(tv.X, tv.Y);
    },
    arc: (v, r, a1 = 0, a2 = 2 * PI, counterclockwise = false) => {
        let tv = canvas._transformVec(v);
        canvas._context.arc(tv.X, tv.Y, canvas._transformScalar(r), a1, a2, counterclockwise);
    },
    beginPath: () => canvas._context.beginPath(),
    stroke: () => canvas._context.stroke(),
    fill: () => canvas._context.fill(),
    setLineWidth: w => canvas._context.lineWidth = w,
    setStrokeColor: c => canvas._context.strokeStyle = c,
    setFillColor: c => canvas._context.fillStyle = c,
    clearTrace: () => canvas._trace_points = [],
}


canvas._init();