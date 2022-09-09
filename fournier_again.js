

approx = (int, N, L, x) => [...Array(N)].reduce((a, _, i) => a + 2 / L * int(i + 1) * Math.sin((i + 1) * Math.PI * x / L), 0)


x = 0
N = 20
L = 2
int = n => (2 - 2 * Math.cos(Math.PI * n)) / (Math.PI * n)
createLoop(() => {
    x += .005;

    pt = { x: 0, y: 0 }
    for (i = 0; i < N; i++) {
        b = 2 / L * int(i + 1) * Math.sin((i + 1) * Math.PI * x / L);

        next_pt = { x: pt.x + b * Math.sin(x * (i + 1) * Math.PI / L) * 10, y: pt.y + b * Math.cos(x * (i + 1) * Math.PI / L) * 10 };
        drawLine(pt, next_pt);
        pt = next_pt;
    }
    drawGrid(20, 20, true);

})