import constant from "../utils/constant";
import descending from "../utils/descending";
import identity from "../utils/identity";


export default function () {
    var value = identity,
        pad = constant(0),
        height = 1,
        base = 1;

    function funnel (data) {
        let i, j, points, fr,
            v0, bi, pim, pi=0, h=0;

        var n = data.length,
            polygons = new Array(n),
            index = new Array(n),
            hi = height/n;

        // evaluate the value for each data point
        for (i=0; i<n; ++i) {
            polygons[index[i] = i] = +value(data[i], i, data);
        }

        // Sort the polygons
        index.sort((i, j) => {return descending(polygons[i], polygons[j]);});

        // Compute the polygons! They are stored in the original data's order.
        v0 = polygons[index[0]];

        for (i=0; i<n; ++i) {
            j = index[i];
            fr = polygons[j]/v0;
            bi = base*fr;
            pim = pi;
            pi = height*(i === n-1 ? 0 : 0.5*pad(fr, i));
            points = [
                [bi/2, h+pim],
                [-bi/2, h+pim],
                [-bi/2, h+hi-pi],
                [bi/2, h+hi-pi]
            ];
            h += hi;
            polygons[j] = {
                index: i,
                value: polygons[j],
                fraction: fr,
                points: points,
                data: data[j]
            };
        }
        return polygons;
    }

    funnel.value = function(_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), funnel) : value;
    };

    funnel.base = function (_) {
        return arguments.length ? (base = _, funnel) : base;
    };

    funnel.height = function (_) {
        return arguments.length ? (height = _, funnel) : height;
    };

    funnel.pad = function(_) {
        return arguments.length ? (pad = typeof _ === "function" ? _ : constant(+_), funnel) : pad;
    };

    return funnel;
}
