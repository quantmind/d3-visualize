export default function (data) {
    var cols = new Set;
    data.forEach(d => {
        Object.keys(d).forEach(k => cols.add(k));
    });
    return Array.from(cols).sort();
}
