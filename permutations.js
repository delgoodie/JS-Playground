//#region BONUS
function permutations(l = 0, p = []) {
    if (typeof (l) == 'number') l = [...Array(l)].map((_, i) => i);
    return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n != n2), p.concat([n]))), []) : [p];
}
//#endregion








function permutations(l = [], p = []) {
    return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n != n2), p.concat([n]))), []) : [p];
}
