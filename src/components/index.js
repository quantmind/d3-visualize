//
//  d3-view components
//  ======================
//
//  d3-view plugin for visualization components
//
import tabularPlugins from '../plugins/index';
import dashboard from './dashboard';
import visual from './visual';
import tabular from './tabular';


// Visual components plugin
export default {
    tabularPlugins,

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
        vm.addComponent('tabular', tabular);
    }

};
