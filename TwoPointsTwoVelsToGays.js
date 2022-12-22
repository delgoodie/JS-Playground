

let P1 = new Point(-4, -1, false, { color: 'black' });
let V1 = new Vec(1, D2R(120), true, { base: P1, color: 'black' });

let P2 = new Point(0, 0, false, { color: 'black' });
let V2 = new Vec(1, 0, false, { base: P2, color: 'black' });

let P = new Point(P1.X, P1.Y, false, { trace: true, color: 'orange' });
let V = new Vec(V1.X, V1.Y, false, { base: P, color: 'blue' });

let F = new Vec(0, 0, false, { base: P, color: 'red' });
let DeltaLine = new Line(P, P2, false, false, { color: 'red', alpha: .5 });

// Init Canvas
canvas.add(P1);
canvas.add(P2);
canvas.add(V1);
canvas.add(V2);
canvas.add(F);
canvas.add(P);
canvas.add(V);
canvas.add(DeltaLine);
canvas.add(new Text(dt => calcField(P.X, P.Y).toString()))
canvas.size = new Vec(10, 6)

let playing = true;

window.Exp = 15; // 1 < Exp < 10
window.Thresh = .005; // 10 < Thresh < 200

window.MaxAlpha = 1.5;

const calcField = (x, y) => {
    let V2Field = new Vec(2 * x ** 2 - 0.6 * y ** 2, 3 * Math.sign(y) * x * Math.abs(y) ** .5);

    let V1Field;
    if (x == P1.X || y == P1.Y)
        V1Field = new Vec(0, 0)
    else
        V1Field = new Vec(1 / (x - P1.X) / (y - P1.Y) ** 2, 1 / (x - P1.X) ** 2 / (y - P1.Y))
    let sum = V1Field.add(V2Field)
    return V2Field;
}

// Draw Vector Field
let res = .3
for (let x = -5; x <= 5; x += res) {
    for (let y = -3; y <= 3; y += res) {
        let vec = new Vec(calcField(x, y), 0, false, { base: new Vec(x, y), alpha: .3 })
        vec.R = res / 2;
        canvas.add(vec);
    }
}

const step = dt => {
    let totaldelta = P2.sub(P1);
    let delta = P2.sub(P);
    let alpha = delta.R / totaldelta.R;
    let speed = math.lerp(V1.R, V2.R, 1 - alpha);

    if (delta.R < .01) {
        P.V = P1.V;
        V.set(V1);
        canvas.clearTrace();
        return;
    }

    // Force
    let field = calcField(P.X, P.Y);
    let targetVelocity = new Vec(speed, field.T, true);
    targetVelocity.R = Math.min(targetVelocity.R, delta.R / dt)
    let targetAccel = targetVelocity.sub(V).div(dt);

    if (delta.dot(V2) > 0)
        targetAccel = targetAccel.mul(Math.min(1 / (Math.max(delta.dot(new Vec(1, 0)), .01) ** 2 * Math.max(V.dot(new Vec(1, 0)) ** 2), .1), 1))

    F.set(targetAccel.mul((MaxAlpha - alpha) ** 2));


    // V += a * dt
    V.set(V.add(F.mul(dt)))

    V.R = speed;
    V.R = Math.min(speed, delta.R / dt);

    P.V = P.add(V.mul(dt))

    F.R /= 1;
}
window.onkeydown = e => {
    if (e.key == ' ') {
        playing = !playing;
        if (playing) canvas.addloopfunction(step);
        if (!playing) canvas.removeloopfunction(step);
    }
    else if (e.key == 'ArrowRight') step(.03)
}

if (playing) canvas.addloopfunction(step);
