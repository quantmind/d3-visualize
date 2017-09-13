//
//  d3-view components
//  ======================
//
//  d3-view plugin for visualization components
//
import dashboard from './dashboard';
import visual from './visual';
import table from './table';


// Forms plugin
export default {

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
        vm.addComponent('table', table);
    }

};
