class Wave {
    constructor(_a, _w, _p) {
        this.a = _a;
        this.w = _w;
        this.p = _p;
    }
    vector(t) {
        let angle = t * this.w + this.p;
        return { x: Math.cos(angle) * this.a, y: Math.sin(angle) * this.a };
    }
}

class Ray {
    constructor(_o, _d) {
        this.o = _o;
        this.d = _d;
    }
}



function plot(waves, step = .01) {
    for (let t = 0; t < 02 * Math.PI; t += step) {
        let p = { x: 10, y: 10 };
        waves.forEach(w => {
            let v = w.vector(t);
            p.x += v.x;
            p.y += v.y;
        });
        drawPoint(p, 'red');
    }
}

function intersection(waves = Array[Wave], ray = Ray) {
    let aw2 = 0,
        ap2 = 0,
        a = 0,
        awp = 0;
    for (let i = 0; i < waves.length; i++) {
        aw2 += waves[i].a * waves[i].w ** 2;
        ap2 += waves[i].a * waves[i].p ** 2;
        a += waves[i].a;
        awp = waves[i].a * waves[i].w * waves[i].p;
    }

    let t = (-.5 * Math.sqrt((2 * awp) ** 2 - 4 * aw2 * (ap2 - 2 * a + 2 * x)) - awp) / g;
}


let waves = [new Wave(3, 1, 0), new Wave(2, 4, 2), new Wave(2, 3.32, 2)];

drawGrid(20, 20, true);
plot(waves, .01);

let a1, a2, w1, w2, p1, p2;