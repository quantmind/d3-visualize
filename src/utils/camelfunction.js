export default function (o, prefix, name) {
    if (name.substring(0, prefix.length) !== prefix)
        name = `${prefix}${name[0].toUpperCase()}${name.substring(1)}`;
    return o[name]();
}
