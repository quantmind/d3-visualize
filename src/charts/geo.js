import createChart from '../core/chart';
import camelFunction from '../utils/camelfunction';
import warn from '../utils/warn';

//
//  GeoChart
//  =============
//
//  A chart displaying a geographical map
export default createChart('geochart', {
    // load these libraries
    requires: ['d3-geo', 'topojson', 'd3-geo-projection', 'leaflet'],

    options: {
        // list of geometry data to display in this chart
        geometry: 'countries',
        propertyid: 'id',
        center: 'italy',
        // specify one of the topojson geometry object for calculating
        // the projected bounding box
        boundGeometry: null,
        boundScaleFactor: 0.9,
        projection: null,
        graticule: false,
        leaflet: false,
        scale: 200
    },

    doDraw (frame, geo) {
        var model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            paper = this.paper().size(box),
            group = paper.group()
                    .attr("transform", this.translate(box.total.left, box.total.top)),
            info = this.getGeoData(frame),
            propertyid = model.propertyid;

        if (!info) return warn ('Topojson data not available - cannot draw topology');

        var topoData = info.topology,
            geometryData = geo.feature(topoData, topoData.objects[model.geometry]).features,
            boundGeometry = model.boundGeometry ? geo.feature(topoData, topoData.objects[model.boundGeometry]).features : null,
            // neighbors = geo.neighbors(geometry.geometries),
            projection = camelFunction(geo, 'geo', info.projection).scale(model.scale),
            path = geo.geoPath().projection(projection),
            // drawing paths
            paths = group.selectAll('.geometry').data(geometryData);

        // If we are centering on a given geometry, calculate bounds andnew scale & translate
        // Thanks to https://bl.ocks.org/mbostock/4707858
        if (boundGeometry) {
            // reset scale and translate
            projection.scale(1).translate([0, 0]);
            // get boudns and new scale and translate
            var b = path.bounds(boundGeometry[0]),
                s = Math.round(model.boundScaleFactor / Math.max((b[1][0] - b[0][0]) / box.innerWidth, (b[1][1] - b[0][1]) / box.innerHeight)),
                t = [(box.innerWidth - s * (b[1][0] + b[0][0])) / 2, (box.innerHeight - s * (b[1][1] + b[0][1])) / 2];

            projection.scale(s).translate(t);
        }
        //var map = new geo.Map("map", {center: [37.8, -96.9], zoom: 4})
        //            .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

        paths
            .enter()
                .append("path")
                .attr("class", "geometry")
                .attr("d", path)
                .attr("id", d => d.properties[propertyid])
                .style('fill', 'none')
                .style("stroke", color.stroke)
                .style("stroke-opacity", 0)
            .merge(paths)
                .transition()
                .attr("d", path)
                .style("stroke", color.stroke)
                .style("stroke-opacity", color.strokeOpacity);
    },

    getGeoData (frame) {
        var info = {};
        if (frame.type === 'frameCollection')
            for (let key in frame) {
                if (frame[key].type === 'Topology') info.topology = frame[key];
                else info.data = frame[key];
            }
        else if (frame.type === 'Topology')
            info.topology = frame;
        if (info.topology) {
            var model = this.getModel();
            if (model.projection) info.projection = model.proection;
            else {
                info.projection = 'kavrayskiy7';
            }
            return info;
        }
    }
});
