import constant from "../utils/constant";
import descending from "../utils/descending";
import identity from "../utils/identity";

//
//  Pyramid Shape generator
//  ============================
export default function () {
    var value = identity,
        pad = constant(0),
        height = 1,
        base = 1;

    function pyramid (data) {
        let i, j, k, points, fraction,
            hi, x, y, v0, ph, pj;
        var n = data.length,
            r = 0.5*base/height,
            polygons = new Array(n),
            index = new Array(n);

        for (i=0; i<n; ++i) {
            polygons[index[i] = i] = +value(data[i], i, data);
        }

        // Sort the polygons
        index.sort((i, j) => {return descending(polygons[i], polygons[j]);});

        // Compute the polygons! They are stored in the original data's order.
        v0 = polygons[index[0]];
        hi = null;

        for (i=n-1; i>=0; --i) {
            points = [];
            if (hi === null)
                points.push([0, 0]);
            else {
                y = hi + ph;
                x = y*r;
                points.push([x, y]);
                points.push([-x, y]);
            }
            j = index[i];
            k = n - i - 1;
            fraction = polygons[j]/v0;
            pj = Math.sqrt(fraction);
            hi = height*pj;
            ph = i ? pad(pj, k) : 0;
            y = hi - ph;
            x = y*r;
            points.push([-x, y]);
            points.push([x, y]);
            polygons[j] = {
                index: k,
                value: polygons[j],
                fraction: fraction,
                points: points,
                data: data[j]
            };
        }
        return polygons;
    }

    pyramid.value = function(_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pyramid) : value;
    };

    pyramid.base = function (_) {
        return arguments.length ? (base = _, pyramid) : base;
    };

    pyramid.height = function (_) {
        return arguments.length ? (height = _, pyramid) : height;
    };

    pyramid.pad = function(_) {
        return arguments.length ? (pad = typeof _ === "function" ? _ : constant(+_), pyramid) : pad;
    };

    return pyramid;
}
