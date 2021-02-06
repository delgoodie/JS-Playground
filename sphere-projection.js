drawGrid(20, 20, true);

var offset = { x: 10, y: 10 };

var n = 5000;
var i = [...new Array(n)].map((_, i) => i + .5);

var goldenRatio = (1 + 5 ** 0.5) / 2;


i.forEach(v => {
    var phi = Math.acos(1 - 2 * v / n);
    var theta = 2 * Math.PI * v / goldenRatio
    var x = Math.cos(theta) * Math.sin(phi);
    var y = Math.sin(theta) * Math.sin(phi);
    var z = Math.cos(phi);  //dropping Z portion
    drawPoint({ x: z * 9 + offset.x, y: x * 9 + offset.y }, 'red');
});