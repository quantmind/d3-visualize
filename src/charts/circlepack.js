import createChart from '../core/chart';


export default createChart('circlepack', {
    requires: ['d3-hierarchy'],

    options: {
        scale: 'linear'
    },

    doDraw (frame, d3) {
        var box = this.boundingBox(),
            paper = this.paper().size(box),
            packs = paper.group()
                .attr("transform", this.translate(box.total.left+box.innerWidth/2, box.total.top+box.innerHeight/2))
                .selectAll('.packs'),
            pack = d3.pack();

        packs
            .enter()
            .append('circle')
            .data(pack);
    }
});
