

const num_points = 20;
const t = 1;

let amps = [...Array(num_points)].map(_ => 5);

let vels = [...Array(num_points)].map(_ => 0);

amps[0] = 10;


let time = 0, freq = 5;


createLoop(() => {
    time += .01;

    amps[0] = 2 * Math.cos(time * freq) + 5;

    vels = vels.map((v, i) => ((amps[i - 1] + amps[i + 1]) * .5 - amps[i]) * t);

    vels[0] = 0;
    vels[vels.length - 1] = 0;

    amps = amps.map((a, i) => a + vels[i]);

    amps.forEach((a, i) => drawPoint({ x: i - num_points * .5, y: a }, 'red'));

});