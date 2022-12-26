//                 0  1     2      3       4        5      6      7         8      9       10      11       12
const dist_prob = [0, 0, 1 / 36, 2 / 36, 3 / 36, 4 / 36, 5 / 36, 6 / 36, 5 / 36, 4 / 36, 3 / 36, 2 / 36, 1 / 36]

let positions = [12, 14]

let sum = 0;

for (let i = 0; i < 11; i++) {
    positions.forEach(p => {
        let dist = p - i;
        if (dist > 0 && dist < 13) sum += dist_prob[dist]
    })
}

console.log(sum / 12);