import dashboard from './dashboard';
import visual from './dashboard';
import paper from './dashboard';
import table from './table';


// Forms plugin
export default {

    install (vm) {
        vm.addComponent('dashboard', dashboard);
        vm.addComponent('visual', visual);
        vm.addComponent('paper', paper);
        vm.addComponent('table', table);
    }

};
