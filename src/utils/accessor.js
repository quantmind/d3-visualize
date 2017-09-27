export default function (field) {
    return function (d) {
        return d[field];
    };
}
