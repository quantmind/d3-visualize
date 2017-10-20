export default function (value, min, max) {
    if (max !== undefined) value = Math.min(value, max);
    return min === undefined ? value : Math.max(value, min);
}
