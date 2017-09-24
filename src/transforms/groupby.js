//
// Create a groupby transform from a config object
export default function (config) {
    return groupby;

    function groupby (series) {
        return series.groupby(config.field);
    }
}
