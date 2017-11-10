import {map} from 'd3-collection';
import {isArray, isObject} from 'd3-let';
import DataFrame from './dataframe';
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
    schema: {
        type: "object",
        description: 'Composite data source for combining data together',
        properties: {
            source: {
                type: "array",
                description: "Array of data sources keys",
                item: {
                    type: "string"
                }
            }
        }
    },

    initialise (config) {
        this.source = config.source;
    },

    getConfig (config) {
        if (isObject(config) && config.source) {
            if (!isArray(config.source)) config.source = [config.source];
            return config;
        }
    },

    getData (context) {
        var store = this.store,
            sources = this.source,
            self = this;

        return Promise.all(sources.map(source => {
             return store.getData(source, context);
        })).then(frames => {
            let fc;
            if (frames.length === 1) fc = frames[0];
            else if (self.config.merge) fc = self.mergeFrames(frames);
            else {
                fc = new FrameCollection(store);
                frames.forEach((frame, index) => {
                    fc.frames.set(sources[index], frame);
                });
            }
            return self.asFrame(fc);
        });
    },

    // TODO: implement frame merging
    mergeFrames (frames) {
        return frames[0];
    }
};


function FrameCollection (store) {
    this.frames = map();
    Object.defineProperties(this, {
        store: {
            get () {
                return store;
            }
        },
        type: {
            get () {
                return 'frameCollection';
            }
        }
    });
}

FrameCollection.prototype = {

    new (data) {
        return new DataFrame(data, null, this.store);
    },

    dataFrame () {
        var frames = this.frames.values();
        for (let i=0; i<frames.length; ++i) {
            if (frames[i].type === 'dataframe') return frames[i];
        }
    }
};
