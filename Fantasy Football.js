var players = {
    luke: {
        wins: 10,
        score: 1700.08,
        projection: 116.36,
        match: 'evan',
    },
    nolan: {
        wins: 9,
        score: 1718.52,
        projection: 148.43,
        match: 'aiden',
    },
    will: {
        wins: 7,
        score: 1573.82,
        projection: 124.85,
        match: 'graham',
    },
    tim: {
        wins: 7,
        score: 1527.52,
        projection: 129.88,
        match: 'adam',
    },
    adam: {
        wins: 6,
        score: 1774.38,
        projection: 131.75,
        match: 'tim',
    },
    sean: {
        wins: 6,
        score: 1636.24,
        projection: 130.86,
        match: 'jake',
        rank: 6,
    },
    graham: {
        wins: 5,
        score: 1633.34,
        projection: 137.79,
        match: 'will',
    },
    jake: {
        wins: 5,
        score: 1632.06,
        projection: 126.37,
        match: 'sean',
    },
    aiden: {
        wins: 5,
        score: 1544.40,
        projection: 114.54,
        match: 'nolan',
    },
    evan: {
        wins: 5,
        score: 1496.00,
        projection: 115.65,
        match: 'luke',
    },
}

function generateOutcomes(matches = [
    ['1', '2']
], win = []) {
    if (matches.length > 0) {
        let temp = matches.map(m => m.slice());
        let current = temp.shift();
        return generateOutcomes(temp, win.concat([current[0]])).concat(generateOutcomes(temp, win.concat([current[1]])));
    } else return [win];
}

function evaluateRank(players) {
    let keys = Object.getOwnPropertyNames(players);
    let before = keys.slice();
    let ret = {};
    let done = false;
    while (!done) {
        done = true;
        for (let i = 1; i < keys.length; i++)
            if (players[keys[i]].wins > players[keys[i - 1]].wins || (players[keys[i]].wins == players[keys[i - 1]].wins && players[keys[i]].score > players[keys[i - 1]].score)) {
                let temp = keys[i];
                keys[i] = keys[i - 1];
                keys[i - 1] = temp;
                done = false;
            }
    }
    keys.map((name, rank) => ret[name] = rank + 1);
    return ret;
}

function permutations(l = 0, p = []) {
    if (typeof(l) == 'number') l = [...Array(l)].map((_, i) => i);
    return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n != n2), p.concat([n]))), []) : [p];
}

var matches = Object.getOwnPropertyNames(players).map(n => [n, players[n].match]).reduce((arr, m) => {
    if (!arr.some(m2 => m[0] == m2[1] && m[1] == m2[0])) return arr.concat([m]);
    else return arr;
}, []);

var outcomes = generateOutcomes(matches, []);


ranks = outcomes.map(o => {
    let temp = {};
    Object.getOwnPropertyNames(players).forEach(name => temp[name] = {});
    Object.getOwnPropertyNames(players).forEach(name => Object.assign(temp[name], players[name]));
    let weight = 0;
    o.forEach(winner => {
        temp[winner].wins++;
        if (temp[winner].projection > temp[temp[winner].match].projection) {
            temp[winner].score += temp[winner].projection;
            temp[temp[winner].match].score += temp[temp[winner].match].projection;
        } else {
            let avg = (temp[temp[winner].match].projection + temp[winner].projection) * .5;
            temp[winner].score += avg + 10;
            temp[temp[winner].match].score += avg - 10;
        }
        weight += temp[winner].projection / temp[temp[winner].match].projection;
    });
    let tempRank = evaluateRank(temp);
    tempRank['weight'] = weight;
    return tempRank;
});

var weighted = ranks.reduce((sum, o) => {
    Object.getOwnPropertyNames(o).forEach((name, i, arr) => {
        if (i != arr.length - 1) sum[name] += o[name] * o['weight'];
    });
    return sum;
}, {
    will: 0,
    luke: 0,
    aiden: 0,
    adam: 0,
    nolan: 0,
    jake: 0,
    graham: 0,
    evan: 0,
    tim: 0,
    sean: 0,
});

Object.getOwnPropertyNames(weighted).forEach(name => weighted[name] /= ranks.length);

let keys = Object.getOwnPropertyNames(weighted);
let done = false;
while (!done) {
    done = true;
    for (let i = 1; i < keys.length; i++)
        if (weighted[keys[i]] < weighted[keys[i - 1]]) {
            let temp = keys[i];
            keys[i] = keys[i - 1];
            keys[i - 1] = temp;
            done = false;
        }
}


//OUTPUT
//keys.forEach(name => console.log(name, (10 / (weighted[keys[keys.length - 1]] / weighted[keys[0]])) * (weighted[name] / weighted[keys[0]])));