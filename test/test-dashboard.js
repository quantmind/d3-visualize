import {view} from 'd3-view';
import {visualComponents} from '../index';


const dashboard =  `<dashboard class="dashboard container-fluid">
<div class="row">
<div class="col">
<visual></visual>
</div>
</div>
</dashboard>`;


describe('dashboard', () => {

    it('test dashboard component', () => {
        var vm = view().use(visualComponents);
        expect(vm.components.get('dashboard')).toBeTruthy();
    });

    it('test dashboard empty datastore', () => {
        var vm = view().use(visualComponents),
            el = vm.viewElement('<div><dashboard class="dashboard"></dashboard></div>');
        vm.mount(el);
        var d = vm.sel.select('.dashboard').view();
        expect(d).toBeTruthy();
        var visual = d.model.visual;
        expect(visual.dataStore).toBeTruthy();
        expect(visual.dataStore.size()).toBe(0);
    });

    it('test dashboard', () => {
        var vm = view().use(visualComponents),
            el = vm.viewElement(`<div>${dashboard}</div>`);
        vm.mount(el);
        var d = vm.sel.select('.dashboard').view();
        expect(d).toBeTruthy();
        var viz = vm.sel.select('.d3-visual');
        expect(viz.size()).toBe(1);
    });
});
