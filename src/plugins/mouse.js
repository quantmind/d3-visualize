//
//
//  Mouse events handling
//  ==========================
//
import {map} from 'd3-collection';
import {color} from 'd3-color';

import {visuals} from '../core/base';
import {vizPrototype} from '../core/chart';
import warn from '../utils/warn';


export const mouseStrategies = map({
    darker: darkerStrategy(),
    fill: fillStrategy()
});


visuals.options.mouse = {
    over: ['darker'],
    darkerFactor: 0.5,
    fillColor: '#addd8e'
};


vizPrototype.mouseOver = function () {
    var self = this,
        model = this.getModel('mouse');

    return function (d, i) {
        if (!this.__mouse_over__) this.__mouse_over__ = {};
        var sel = self.select(this);
        let strategy;
        model.over.forEach(name => {
            strategy = mouseStrategies.get(name);
            if (!strategy) warn(`Unknown mouse strategy ${name}`);
            else strategy(self, sel, d, i);
        });
    };
};

vizPrototype.mouseOut = function () {
    var self = this,
        model = this.getModel('mouse');

    return function (d, i) {
        if (!this.__mouse_over__) this.__mouse_over__ = {};
        var sel = self.select(this);
        let strategy;
        model.over.forEach(name => {
            strategy = mouseStrategies.get(name);
            if (!strategy) warn(`Unknown mouse strategy ${name}`);
            else strategy.out(self, sel, d, i);
        });
    };
};


function darkerStrategy () {

    function darker (viz, sel) {
        var model = viz.getModel('mouse'),
            fill = color(sel.style('fill')),
            filldarker = fill.darker(model.darkerFactor),
            node = sel.node();
        node.__mouse_over__.fill = fill;
        sel.style('fill', filldarker);
    }

    darker.out = function (viz, sel) {
        var node = sel.node(),
            fill = node.__mouse_over__.fill;
        if (fill) sel.style('fill', fill);
    };

    return darker;
}


function fillStrategy () {

    function fill (viz, sel) {
        var model = viz.getModel('mouse'),
            fill = color(sel.style('fill')),
            node = sel.node();
        node.__mouse_over__.fill = fill;
        sel.style('fill', model.fillColor);
    }

    fill.out = function (viz, sel) {
        var node = sel.node(),
            fill = node.__mouse_over__.fill;
        if (fill) sel.style('fill', fill);
    };

    return fill;
}
