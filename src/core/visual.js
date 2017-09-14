import createVisual, {visualTypes} from './base';


export default createVisual('visual', {

    initialise (options, element) {
        if (!options.group)
            options.group = new visualTypes.group(options, element);
        this.group = options.group;
        var type = options.type;
    }
});
