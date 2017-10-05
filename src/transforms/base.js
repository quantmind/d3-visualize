import {viewProviders} from 'd3-view';


export default function (options) {
    const
        transform = options.transform,
        schema = options.schema || {},
        jsonValidator = viewProviders.jsonValidator ? viewProviders.jsonValidator(options.schema) : dummyValidator;
    if (!schema.type) schema.type = 'object';

    function transformFactory (config) {
        const valid = jsonValidator.validate(config);

        if (!valid) return jsonValidator.logError();

        return doTransform;

        function doTransform (frame) {
            return transform(frame, config);
        }
    }

    transformFactory.schema = schema;

    return transformFactory;
}


const dummyValidator = {
    validate () {
        return true;
    }
};
