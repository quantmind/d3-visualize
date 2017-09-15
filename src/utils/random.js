export default function (size) {
    var serie = [];
    for (var i=0; i<size; ++i) {
        var o = {};
        for (var j=1; j<arguments.length; ++j) {
            o[arguments[j]] = Math.random();
        }
        serie.push(o);
    }
    return serie;
}
