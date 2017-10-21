import {select} from 'd3-selection';

import functor from './functor';


//Text wrapping code adapted from Mike Bostock
export default function (text, width, callback) {
    width = functor(width);

    text.each(function(d, i) {
        var text = select(this),
            dy = parseFloat(text.attr("dy")) || 0,
            wd = width(d, i),
            lineHeight = 1.2,
            lines = text.text().split('\n');

        let word, words, done,
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", 0)
                        .attr("dy", dy + "em");

        lines.forEach((t, i) => {
            done = [];
            words = t.split(/\s+/).reverse();
            if (i)
                tspan = text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", lineHeight + dy + "em");

            while (word = words.pop()) {
                done.push(word);
                tspan.text(done.join(' '));
                if (tspan.node().getComputedTextLength() > wd && done.length > 1) {
                    done.pop();
                    tspan.text(done.join(' '));
                    done = [word];
                    tspan = text.append("tspan")
                                .attr("x", 0)
                                .attr("dy", lineHeight + dy + "em")
                                .text(word);
                }
            }
        });

        if (callback)
            text.selectAll('tspan')
                .each(callback);
    });
}
