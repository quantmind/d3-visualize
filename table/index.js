import table from './table';
import plugins from './plugins/index';


export default {
    plugins,
    
    install (vm) {
        vm.addComponent('d3-table', table);
    }
};
