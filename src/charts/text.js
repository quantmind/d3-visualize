import createChart from '../core/chart';
import textWrap from '../utils/text-wrapping';


export default createChart('text', {

    options: {
        label: 'label',
        data: 'data',
        text: 'label + " " + data',
        sizeReduction: 0.7
    },

    doDraw (frame) {
        var self = this,
            model = this.getModel(),
            font = this.getModel('font'),
            box = this.boundingBox(),
            size = this.font(box),
            group = this.group(),
            chart = this.group('chart'),
            words = chart.selectAll('text').data(frame.data),
            width = box.innerWidth/frame.data.length,
            widthWrap = 0.4*width,
            store = this.dataStore,
            stroke = this.modelProperty('stroke', font);

        this.applyTransform(group, this.translate(box.padding.left, box.padding.top));
        this.applyTransform(chart, this.translate(box.margin.left, box.margin.top + box.innerHeight/2));

        words
            .enter()
                .append('text')
                .attr("transform", shift)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style('fill', stroke)
            .merge(words)
                .attr("transform", shift)
                .text(d => store.eval(model.text, d))
                .style('fill', stroke)
                .call(textWrap, widthWrap, sizing);

        group.exit().remove();


        function shift (d, i) {
            return self.translate((i+0.5)*width, 0);
        }

        function sizing (d, i) {
            var s = size;
            if (i) s = model.sizeReduction*size;
            self.select(this).attr('font-size', `${s}px`);
        }
    }
});
