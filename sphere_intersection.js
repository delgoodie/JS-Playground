class Vector {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    static Add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static Dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static Sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static Mul(v1, c) {
        return new Vector(v1.x * c, v1.y * c);
    }

    static Norm(v) {
        return new Vector(v.x / Math.hypot(v.x, v.y), v.y / Math.hypot(v.x, v.y));
    }

    static SqrMag(v) {
        return v.x * v.x + v.y * v.y;
    }

    static Mag(v) {
        return Math.hypot(v.x, v.y);
    }

    static Pow(v, x) {
        return new Vector(Math.pow(v.x, x), Math.pow(v.y, x));
    }
}

let circle = { p: new Vector(10, 5), r: 4 };

let ray = { o: new Vector(1, 1), d: new Vector(2, 2) }
let t = 0;

function loop() {
    t += .002;
    t %= .75;
    window.requestAnimationFrame(loop);
    clearScreen();
    ray.d = new Vector(Math.cos(t + .5), Math.sin(t + .5));

    ray.d = Vector.Norm(ray.d);

    let dif = Vector.Sub(circle.p, ray.o);

    inter = Math.pow(Vector.Dot(ray.d, dif), 2) * (Math.pow(Vector.Mag(dif), 2) + Math.pow(circle.r, 2)) > Math.pow(Vector.SqrMag(dif), 2);

    drawCircle(circle.p, circle.r, 'lightcoral');
    drawCircle(ray.o, .2, 'blue', true);
    drawLine(ray.o, Vector.Add(ray.o, dif), 'orange');
    drawLine(ray.o, Vector.Add(ray.o, Vector.Mul(ray.d, 20)), inter ? 'green' : 'red');
    drawGrid(20, 20, true);
}
loop();