export default function (Constructor, prototype) {
    Constructor.prototype = prototype;
    return Constructor;
}
