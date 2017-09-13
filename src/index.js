import dashboard from './components/dashboard';
import visual from './components/visual';
import paper from './components/paper';
import table from './table';

import './plugins/responsive';


// Forms plugin
export default {

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
        vm.addComponent('paper', paper);
        vm.addComponent('tabular', table);
    }

};
