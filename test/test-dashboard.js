import {view} from 'd3-view';
import {visualComponents} from '../index';


const dashboard =  `<dashboard>
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
            el = vm.viewElement('<div><dashboard></dashboard></div>');
        vm.mount(el);
        var d = vm.sel.select('.dashboard').view();
        expect(d).toBeTruthy();
        expect(d.model.visuals).toBeTruthy();
        expect(d.model.dataStore).toBeTruthy();
        expect(d.model.dataStore.size()).toBe(0);
    });

    it('test dashboard', () => {
        var vm = view().use(visualComponents),
            el = vm.viewElement(`<div>${dashboard}</div>`);
        vm.mount(el);
        var d = vm.sel.select('.dashboard').view();
        expect(d).toBeTruthy();
        var board = d.model;
        expect(board.visuals).toBeTruthy();
        expect(board.visuals.length).toBe(1);
        var viz = vm.sel.select('.visual');
        expect(viz.size()).toBe(1);
    });
});
