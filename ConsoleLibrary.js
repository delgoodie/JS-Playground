window.PI = Math.PI;
window.round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

window.math = {
    //basic ops
    fac: x => x > 1 ? math.fac(x - 1) * x : 1,

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
    normdist: (x, mean = 0, stdev = 1) => 1 / (stdev * (2 * Math.PI) ** .5) * Math.exp(-.5 * ((x - mean) / stdev) ** 2),
    erf: x => Math.tanh(x * Math.PI / 6 ** .5),
    cumstdnormdist: (x, iters = 100) => .5 + 1 / (2 * Math.PI) ** .5 * [...Array(iters)].reduce((a, _, i) => a + (-1) ** i * Math.max(Math.min(x, 7.24067455), -7.24067455) ** (2 * i + 1) / 2 ** i / math.fac(i) / (2 * i + 1), 0),
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
    constructor(a, b, IsPolar = 0) {
        if (a instanceof Vec) {
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
        else if (typeof (a) == 'number' && typeof (b) == 'number') {
            if (IsPolar) {
                this._r = a;
                this._t = b;
                this._polarUpdated = true;
                this._rectUpdated = false;
            }
            else {
                this._x = a;
                this._y = b;
                this._polarUpdated = false;
                this._rectUpdated = true;
            }
        }
        else {
            console.log('Invalid Vec initialization');
        }
    }

    get X() { if (!this._rectUpdated) this._updaterect(); return this._x; }
    get Y() { if (!this._rectUpdated) this._updaterect(); return this._y; }
    get T() { if (!this._polarUpdated) this._updatepolar(); return this._t; }
    get R() { if (!this._polarUpdated) this._updatepolar(); return this._r; }
    set X(x) { if (!this._rectUpdated) this._updaterect(); this._x = x; this._polarUpdated = false; }
    set Y(y) { if (!this._rectUpdated) this._updaterect(); this._y = y; this._updatepolar(); this._polarUpdated = false; }
    set T(t) { if (!this._polarUpdated) this._updatepolar(); this._t = t % (PI * 2); this._updaterect(); this._rectUpdated = false; }
    set R(r) { if (!this._polarUpdated) this._updatepolar(); this._r = r; this._updaterect(); this._rectUpdated = false; }
    _updatepolar() { this._t = Math.atan(this.Y / this.X); this._r = Math.hypot(this.X, this.Y); this._polarUpdated = true; }
    _updaterect() { this._x = Math.cos(this.T) * this.R; this._y = Math.sin(this.T) * this.R; this._rectUpdated = true; }


    static Add(v1, v2) { return new Vec(v1.X + v2.X, v1.Y + v2.Y); }
    static Dot(v1, v2) { return v1.X * v2.X + v1.Y * v2.Y; }
    static Sub(v1, v2) { return new Vec(v1.X - v2.X, v1.Y - v2.Y); }
    static Mul(v1, c) { return new Vec(v1.X * c, v1.Y * c); }
    static Pow(v, x) { return new Vec(Math.pow(v.X, x), Math.pow(v.Y, x)); }
    static Normalize(v) { let r = v.R; v.X /= r; v.Y /= r; return v; }

    add(v) { return Vec.Add(this, v); }
    dot(v) { return Vec.Dot(this, v); }
    sub(v) { return Vec.Sub(this, v); }
    mul(v) { return Vec.Mul(this, v); }
    set(a, b, isPolar = false) {
        let newVec = new Vec(a, b, isPolar);
        this.X = newVec.X;
        this.Y = newVec.Y;
    }
    normalize(v) { return Vec.Normalize(this, v); }
    get normalized() { return new Vec(this.X / this.R, this.Y / this.R); }
}
class Point {
    constructor(a, b, IsPolar = false) {
        this._vec = new Vec(a, b, IsPolar);
    }
    get X() { return this._vec.X; }
    get Y() { return this._vec.Y; }
    get R() { return this._vec.R; }
    get T() { return this._vec.T; }
    get V() { return this._vec; }
}
class Line {
    constructor(a, b, c, d) {
        if (typeof (a) == 'number' && typeof (b) == 'number') {
            this.A = new Vec(a, b);
            this.B = new Vec(c, d);
        }
        else if (a instanceof Vec || a instanceof Point || a instanceof Array) {
            this.A = new Vec(a);
            this.B = new Vec(b, c);
        }
    }

    setA(a = 0, b = 0) {
        this.A = new Vec(a, b);
    }
    setB(a = 0, b = 0) {
        this.B = new Vec(a, b);
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
                if (!('color' in obj)) obj.color = canvas._unusedColors.shift();

                if (obj instanceof Vec) {
                    canvas.setLineWidth(3);
                    canvas.setStrokeColor(obj.color);
                    canvas.beginPath();
                    canvas.moveTo(new Vec(0, 0));
                    canvas.lineTo(obj);
                    canvas.moveTo(obj.add(new Vec(.3, obj.T + PI / 1.2, true)));
                    canvas.lineTo(obj);
                    canvas.moveTo(obj.add(new Vec(.3, obj.T - PI / 1.2, true)));
                    canvas.lineTo(obj);
                    canvas.stroke();

                    canvas._context.font = '24px Arial';

                    canvas._context.fillText(
                        'Vec ' + canvas._objects.indexOf(obj) +
                        '  X: ' + round(obj.X, 2) + ' Y: ' + round(obj.Y, 2) +
                        '  R: ' + round(obj.R, 2) + ' T: ' + round(obj.T, 2) + ' (' + round(obj.T * 180 / PI, 1) + ')',
                        20, textY
                    );
                    textY += 30;
                }
                else if (obj instanceof Point) {
                    canvas.setFillColor(obj.color);
                    canvas.beginPath();
                    canvas.arc(obj, .1);
                    canvas.fill();
                }
                else if (obj instanceof Line) {
                    canvas.setLineWidth(3);
                    canvas.setStrokeColor(obj.color);
                    canvas.beginPath();
                    canvas.moveTo(obj.A);
                    canvas.lineTo(obj.B);
                    canvas.stroke();
                }
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
}


canvas._init();