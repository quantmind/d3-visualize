export default function (range, splits) {
    var x0 = range[0],
        x1 = range[1],
        dx = (x1 - x0)/splits,
        n = Math.floor(Math.log10(dx)),
        v = Math.pow(10, n),
        ndx = v*Math.ceil(dx/v),
        nx0 = v*Math.floor(x0/v);
    return [nx0, nx0 + splits*ndx];
}
