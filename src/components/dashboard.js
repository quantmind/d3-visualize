import {isString} from 'd3-let';

//
//  Dashboard Component
export default {
    props: ['schema'],

    render (data) {
        var self = this,
            inner = this.self.html();

        if (isString(data.schema)) {
            return this.json(data.schema).then(build);
        }
        else return build(data.schema);

        function build (schema) {
            var data = schema.data;
            self.model.visuals = schema.visuals;
            // self.model.$set('dashboard', schema);
            return self.createElement('div')
                .classed('dashboard', true)
                .html(inner);
        }
    }
};
