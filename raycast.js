var chips = [];
for (let x = 0; x < 20; x++) {
    chips.push([]);
    for (let y = 0; y < 20; y++) chips[x].push(Math.random() > .5);
}



function normalize(vec) {
    return {
        x: vec.x * (1 / Math.hypot(vec.x, vec.y)),
        y: vec.y * (1 / Math.hypot(vec.x, vec.y)),
    }
}

function add(p1, p2) {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

function sqrMagnitude(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}


for (let x = 0; x < 20; x++)
    for (let y = 0; y < 20; y++) drawPoint({ x: x, y: y }, 'black');

for (let x = 0; x < 20; x++) drawLine({ x: x + .5, y: 0 }, { x: x + .5, y: 19.5 }, 'black');
for (let y = 0; y < 20; y++) drawLine({ x: 0, y: y + .5 }, { x: 19.5, y: y + .5 }, 'black');




var origin = { x: 3.5, y: 6.5 };
var direction = { x: 0.4, y: .2 };
direction = normalize(direction);

drawLine(origin, { x: origin.x + direction.x, y: origin.y + direction.y }, 'green');

drawPoint(origin, 'red');

let distance = 10;

let caster = { x: origin.x, y: origin.y };
let omitX = direction.x == 0;
let omitY = direction.y == 0;
let dx = 0;
let dy = 0;


while (sqrMagnitude(caster, origin) < distance * distance) {
    let closestPoint = { x: Math.round(caster.x), y: Math.round(caster.y) };
    if (false) {

    }
    else {
        if (!omitX) dx = closestPoint.x + (direction.x > 0 ? .5 : -.5) - caster.x;
        if (!omitY) dy = closestPoint.y + (direction.y > 0 ? .5 : -.5) - caster.y;
        let min = -1e9;
        if (!omitX && direction.x / dx > min) min = direction.x / dx;
        if (!omitY && direction.y / dy > min) min = direction.y / dy;

        if (!omitX && min == direction.x / dx) {
            caster = add(caster, {
                x: direction.x * (dx / direction.x),
                y: direction.y * (dx / direction.x),
            });
        }
        else if (!omitY) {
            caster = add(caster, {
                x: direction.x * (dy / direction.y),
                y: direction.y * (dy / direction.y),
            }
            );
        }
    }
    drawPoint(caster, 'blue');
}