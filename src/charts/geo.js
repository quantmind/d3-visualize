import {extent} from 'd3-array';

import createChart from '../core/chart';
import camelFunction from '../utils/camelfunction';
import accessor from '../utils/accessor';
import niceRange from '../utils/nicerange';
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
        // Geometry data to display in this chart - must be in the topojson source
        geometry: 'countries',
        //
        // for choropleth maps
        // geoKey and dataKey are used to match geometry with data
        geoKey: 'id',
        dataKey: 'id',
        dataLabelKey : 'label',
        dataValueKey: 'value',
        // how many color buckets to visualise
        buckets: 10,
        choroplethScale: 'quantile',
        //
        // specify one of the topojson geometry object for calculating
        // the projected bounding box
        boundGeometry: null,
        // how much to zoom out, 1 = no zoom out, 0.95 to 0.8 are sensible values
        boundScaleFactor: 0.9,
        //
        projection: null,
        graticule: false,
        leaflet: false,
        scale: 200,
        //
        // mouseover strategy
        mouseover: ['darken', 'tooltip']
    },

    doDraw (frame, geo) {
        var info = this.getGeoData(frame);
        if (!info) return warn ('Topojson data not available - cannot draw topology');
        if (!this._geoPath) this.createGeoPath(geo, info);
        this.update(geo, info);
    },

    update (geo, info) {
        var model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            paper = this.paper().size(box),
            group = paper.group()
                    .attr("transform", this.translate(box.total.left, box.total.top)),
            path = this._geoPath,
            geometryData = geo.feature(info.topology, info.topology.objects[model.geometry]).features,
            paths = group.selectAll('.geometry').data(geometryData),
            fill = 'none';

        this.center(geo, info);
        if (info.data) fill = this.choropleth(info.data, box);

        paths
            .enter()
                .append("path")
                .attr("class", "geometry")
                .attr("d", path)
                .style('fill', 'none')
                .style("stroke", color.stroke)
                .style("stroke-opacity", 0)
                .style("fill-opacity", 0)
                .on("mouseover", this.mouseOver())
                .on("mouseout", this.mouseOut())
            .merge(paths)
                .transition()
                .attr("d", path)
                .style("stroke", color.stroke)
                .style("stroke-opacity", color.strokeOpacity)
                .style("fill", fill)
                .style("fill-opacity", color.fillOpacity);

        paths
            .exit()
            .remove();
    },

    createGeoPath (geo, info) {
        var model = this.getModel(),
            projection = camelFunction(geo, 'geo', info.projection).scale(model.scale),
            path = geo.geoPath().projection(projection),
            self = this,
            lefletMap;

        this._geoPath = path;
        this.center(geo, info);

        if (model.leaflet) {
            var leafletId = `leaflet-${model.uid}`,
                paper = this.paper();
            this.visualParent.paper
                    .append('div')
                    .attr('id', leafletId);
            lefletMap = new geo.Map(leafletId, {center: [37.8, -96.9], zoom: 4})
                            .addLayer(new geo.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")),
            lefletMap.getPanes().overlayPane.appendChild(paper.element);
            projection = geo.transform({point: projectPoint});
            lefletMap.on("viewreset", () => self.update(geo, info));
        }

        return path;

        function projectPoint(x, y) {
            var point = lefletMap.latLngToLayerPoint(new geo.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
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
    },

    center (geo, info) {
        var model = this.getModel();
        if (!model.boundGeometry) return;

        var path = this._geoPath,
            projection = path.projection(),
            box = this.boundingBox(),
            boundGeometry = geo.feature(info.topology, info.topology.objects[model.boundGeometry]).features;

        projection.scale(1).translate([0, 0]);

        var b = path.bounds(boundGeometry[0]),
            topLeft = b[0],
            bottomRight = b[1],
            scaleX = (bottomRight[0] - topLeft[0]) / box.innerWidth,
            scaleY = (bottomRight[1] - topLeft[1]) / box.innerHeight,
            scale = Math.round(model.boundScaleFactor / Math.max(scaleX, scaleY)),
            translate = [
                (box.innerWidth - scale * (bottomRight[0] + topLeft[0])) / 2,
                (box.innerHeight - scale * (bottomRight[1] + topLeft[1])) / 2
            ];

        projection.scale(scale).translate(translate);
    },

    // choropleth map based on data
    choropleth (frame, box) {
        var model = this.getModel(),
            buckets = Math.min(model.buckets, frame.data.length),
            dataKey = model.dataKey,
            dataLabelKey = model.dataLabelKey,
            dataValueKey = model.dataValueKey,
            geoKey = model.geoKey,
            valueRange = niceRange(extent(frame.data, accessor(dataValueKey)), buckets),
            colors = this.getScale(model.choroplethScale).range(this.colors(buckets).reverse()).domain(valueRange),
            values = frame.data.reduce((o, d) => {o[d[dataKey]] = d; return o;}, {});
        let key, value;

        this.legend({
            type: 'color',
            scale: colors
        }, box);

        return d => {
            key = d.properties[geoKey];
            value = values[key];
            d.choropleth = {
                label: value[dataLabelKey] || key,
                value: value[dataValueKey],
                color: colors(value[dataValueKey])
            };
            return d.choropleth.color;
        };
    }

});
