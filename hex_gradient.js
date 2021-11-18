/**
 * @param {Array.<string>} colors array of hex color strings -- minimum of two elements
 * @param {Array.<number>} positions correlated array of positions from 0.0 to 1.0
 * @param {Number} pos target position for the gradient to evaluate, i.e. 0.5
 * @returns {string} hex color
 */
function hex_gradient(colors, positions, pos) {
    //check and remove for # in hex strings
    colors = colors.map(c => c[0] == '#' ? c.substring(1, c.length) : c);
    // get the closest gradient indicies on left and right sides
    let leftIndex = positions.reduce((mindex, v, i, arr) => v - pos < 0 && arr[mindex] - v < 0 ? i : mindex, 0);
    let rightIndex = leftIndex + 1 < positions.length ? leftIndex + 1 : leftIndex;
    // hex to rgb function -- returns rgb in array -> [r, g, b]
    let hexToRgb = hex => [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
    // get rgb arrays of left and right side
    let lrgb = hexToRgb(colors[leftIndex]);
    let rrgb = hexToRgb(colors[rightIndex]);
    // get normalized position of pos between left and right so if left position = .3 and right = .5 and pos = .4, normal = .5
    let normalized = (pos - positions[leftIndex]) / (positions[rightIndex] - positions[leftIndex]);
    // gross abuse of new Array to find the rgb of the pos through linear interpolation from lrgb to rrgb
    let posRgb = [...new Array(3)].map((_, i) => Math.round(lrgb[i] + normalized * (rrgb[i] - lrgb[i])));
    //change this to true to prepend a hashtag
    let PREPEND_HASHTAG = false
        // return rgb to hex
    return posRgb.reduce((ac, v) => {
        let hex = v.toString(16);
        return ac + (hex.length == 1 ? '0' + hex : hex);
    }, PREPEND_HASHTAG ? '#' : '');
}


var currentProgress = 60 / 100; // 60% of goal

var color = hex_gradient(['#ff0000', '#d2ee06', '#0300e7', '#00ff37'], [0, .26, .80, 1.0], currentProgress);

console.log(color);