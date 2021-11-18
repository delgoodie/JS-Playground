/**
 * P Choose N probability function, order matters
 * @param {Array} p array of elements to combine
 * @param {Number} n number of elements to choose
 * @param {Array} l leave empty
 * @returns {Array<Array>} returns an array of all array combinations
 */
var pCn_or = (p, n, l = []) =>
    p.reduce((ac, v, i, ar) => [...ac, ...n > 1 ? pCn_or(ar.filter(f => f != v), n - 1, [...l, v]) : [
        [...l, v]
    ]], []);


// console.log(pCn([1, 2, 3, 4], 3));

/**
 * P Choose N probability function, unordered
 * @param {Array} p array of elements to combine
 * @param {Number} n number of elements to choose
 * @param {Array} l leave empty
 * @returns {Array<Array>} returns an array of all array combinations
 */
var pCn_uo = (p, n, l = []) => p.reduce((ac, v, i, ar) => [...ac, ...n > 1 ? pCn_uo(ar.slice(i + 1), n - 1, [...l, v]) : [
    [...l, v]
]], []);

console.log(pCn_uo([Array(8).map((_, i) => i)], 8));

/*
function pCn(p, n, l = []) {
    if (typeof p == 'number') p = [...Array(p)].map((_, i) => i);
    nL = [];
    for (let i = 0; i < p.length; i++) {
        let n_p = p.slice();
        let n_l = l.slice();
        n_l.push(n_p.splice(i, 1)[0]);
        nL = nL.concat(n > 1 ? pCn(n_p, n - 1, n_l) : [n_l]);
        console.log(nL);
    }
    return nL;
}

console.log(pCn(2, 2));
*/