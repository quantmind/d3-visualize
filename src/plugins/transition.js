import {transition} from 'd3-transition';

import {vizPrototype} from '../core/chart';
import {visuals} from '../core/base';


visuals.options.transition = {
    duration: 250,
    delay: 0,
    ease: null
};


vizPrototype.transition = function (name) {
    var uname = this.idname(name),
        model = this.getModel('transition');
    return transition(uname).duration(model.duration);
};


vizPrototype.applyTransform = function (sel, transform) {
    //var cname = sel.attr('class'),
    ///    model = this.getModel('transition'),
    //    tr = cname ? transition(cname).duration(model.duration) : null,
    var t = sel.attr('transform');
    if (!t) sel.attr('transform', transform);
    sel.transition().attr('transform', transform);
};
