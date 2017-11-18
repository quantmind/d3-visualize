//
//  d3-view components
//  ======================
//
//  d3-view plugin for visualization components
//
//  visual plugins first
import '../plugins/scale';
import '../plugins/menu';
import '../plugins/data';
import '../plugins/format';
import '../plugins/font';
import '../plugins/responsive';
import '../plugins/title';
import '../plugins/margin';
import '../plugins/axis';
import '../plugins/shapes';
import '../plugins/color';
import '../plugins/legend';
import '../plugins/tooltip';
import '../plugins/mouse';
import '../plugins/expand';
import '../plugins/transition';
import '../plugins/brush';
import dashboard from './dashboard';
import visual from './visual';


// Visual components plugin
export default {

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
    }

};
