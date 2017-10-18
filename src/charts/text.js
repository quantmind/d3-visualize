import createChart from '../core/chart';
import textWrap from '../utils/text-wrapping';


export default createChart('text', {

    options: {
        label: 'label',
        data: 'data',
        text: 'label + " " + data'
    },

    doDraw (frame) {
        var self = this,
            model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            size = this.font(box),
            group = this.group()
                    .attr("transform", this.translate(box.total.left, box.total.top))
                    .selectAll('text').data(frame.data),
            width = box.innerWidth/frame.data.length,
            widthWrap = 0.4*width,
            store = this.dataStore;

        this.paper().size(box);
        group
            .enter()
                .append('text')
                .attr("transform", shift)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("font-size", `${size}px`)
                .style('fill-opacity', 0)
            .merge(group)
                .attr("transform", shift)
                .text(d => store.eval(model.text, d))
                .style('fill-opacity', color.fillOpacity)
                .call(textWrap, widthWrap);

        group.exit().remove();


        function shift (d, i) {
            return self.translate((i+0.5)*width, 0);
        }
    }
});
