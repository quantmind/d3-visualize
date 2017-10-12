//
//  d3-view components
//  ======================
//
//  d3-view plugin for visualization components
//
//  visual plugins first
import '../plugins/menu';
import '../plugins/data';
import '../plugins/responsive';
import '../plugins/title';
import '../plugins/margin';
import '../plugins/axis';
import '../plugins/shapes';
import '../plugins/color';
import '../plugins/legend';
import dashboard from './dashboard';
import visual from './visual';


// Visual components plugin
export default {

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
    }

};
