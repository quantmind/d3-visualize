export default function (o, prefix, name, objectOnly) {
    if (name.substring(0, prefix.length) !== prefix)
        name = `${prefix}${name[0].toUpperCase()}${name.substring(1)}`;
    return objectOnly ? o[name] : o[name]();
}
