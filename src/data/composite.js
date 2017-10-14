import {isArray, isObject} from 'd3-let';
//
//  A composite dataSource
//  ===================
//
//  A composite data source has the source attribute with the name of one
//  or more data sets to use as the source for this data set.
//  The source property is useful in combination with a transform pipeline
//  to derive new data.
//  If string-valued, indicates the name of the source data set.
//  If array-valued, specifies a collection of data source names that
//  should be merged (unioned) together.
export default {

    initialise (config) {
        this.source = config.source;
    },

    getConfig (config) {
        if (isObject(config) && config.source) {
            if (!isArray(config.source)) config.source = [config.source];
            return config;
        }
    },

    getData () {
        var store = this.store,
            sources = this.source,
            self = this;

        return Promise.all(sources.map(source => {
             return store.getData(source);
        })).then(frames => {
            if (frames.length === 1) return frames[0];
            else if (self.config.merge) return self.mergeFrames(frames);
            else return frames.reduce((o, frame, index) => {
                o[sources[index]] = frame;
                return o;
            }, {type: 'frameCollection'});
        });
    },

    // TODO: implement frame merging
    mergeFrames (frames) {
        return frames[0];
    }
};
