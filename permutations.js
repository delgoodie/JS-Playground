// //#region BONUS
// function permutations(l = 0, p = []) {
//     if (typeof (l) == 'number') l = [...Array(l)].map((_, i) => i);
//     return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n != n2), p.concat([n]))), []) : [p];
// }
// //#endregion






// function fac(n) {
//     return n > 0 ? n * fac(n - 1) : 1;
// }





// function permutations(l = [], p = []) {
//     return l.length > 0 ? l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n2 != n), p.concat([n]))), []) : [p];
// }


// Update
function permutations(l = [], p = []) {
    return l.length > 0 ? l.reduce((arr, v) => arr.concat(permutations(l.filter(v2 => v2 != v), [...p, v])), []) : [p];
}

console.log(permutations([1, 2, 3, 4]));