

let P1 = new Point(0, 0);
let P2 = new Point(2, 2);
let V1 = new Vec(0, 1, false, P1);
let V2 = new Vec(1, 0, false, P2);

let P = new Point(0, 0);
let V = new Vec(V1.X, V1.Y, false, P);

let G = new Vec(0, 0, false, P);
let T = new Vec(0, 0, false, P);

canvas.add(P1);
canvas.add(P2);
canvas.add(V1);
canvas.add(V2);
canvas.add(G);
canvas.add(T);
canvas.add(P);
canvas.add(V);

console.log(canvas.makeVec(-2, 0).T)

step = dt => {
    let g = P2.V.sub(P.V);
    g = g.mul(g.R);
    G.set(g);

    V.set(V.add(G.mul(dt)))

    P.V = P.V.add(V.mul(dt))
}
// window.onkeydown = () => step(.3)

canvas.addloopfunction(step)

