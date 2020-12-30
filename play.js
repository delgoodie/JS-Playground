function justify(text, l) {
    return [...new Array(text.length)].reduce(o => ({ before: o.before.indexOf(' ') != -1 ? o.before.substring(o.before.indexOf(' ') + 1) : '', after: o.after.concat([o.before.substring(0, o.before.indexOf(' ') != -1 ? o.before.indexOf(' ') : o.before.length)]) }), { before: text, after: [] }).after.reduce((acc, v) => acc += v + (acc.length + v.length - acc.lastIndexOf('\n') > l ? '\n' : ' '), '');
}

function justRE(text, l) {
    return [...text.matchAll(/(?<=\s)\w+(?=\s)/g)].map(r => r[0]).reduce((acc, v) => acc += v + (acc.length + v.length - acc.lastIndexOf('\n') > l ? '\n' : ' '), '');
}

console.log(justRE('a long string of text is justifyable but how will it handle extremelyextralongextreme long words', 10));



function zigzag(text) {
    return [...new Array(Math.ceil(text.length / 3))].reduce((acc, _, i) => acc + text[i % 3], "");
}

console.log(zigzag("HOWREL O ELHA"));
//HOWREL O ELHA
//HELLO

// 13 / x = 13 / 4

//  H   O   W  R
//  E L   O    
//  L   H   A

function permutations(l = 0, p = []) {
    if (typeof(l) == 'number') l = [...Array(l)].map((_, i) => i);
    return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n != n2), p.concat([n]))), []) : [p];
}