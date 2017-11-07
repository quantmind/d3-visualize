import {extent, max} from 'd3-array';
import {assign} from 'd3-let';

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
export default createChart('geochart2', {
    // load these libraries - add 'leaflet'?
    requires: ['d3-geo', 'topojson', 'd3-geo-projection'],

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
        neighbors: false,
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
        projection: 'kavrayskiy7',
        graticule: false,
        leaflet: false,
        scale: 200,
        //
        // mouseover strategy
        mouseover: ['darken', 'tooltip']
    },

    doDraw (frame, geo) {
        var info = dataInfo(frame);
        if (!info.topology) return warn ('Topojson data not available - cannot draw topology');
        if (!this._geoPath) this.createGeoPath(geo, info);
        this.update(geo, info);
    },

    update (geo, info) {
        var model = this.getModel(),
            color = this.getModel('color'),
            box = this.boundingBox(),
            group = this.group(),
            geogroup = this.group('geo'),
            path = this._geoPath,
            data = geodata(geo, info, model);

        if (!data) {
            var objects = Object.keys(info.topology.objects).map(key => `"${key}"`).join(', ');
            return warn(`Could not find *geometry* "${model.geometry}" in [${objects}] - cannot draw geochart`);
        }

        group
            .transition(this.transition('group0'))
            .attr("transform", this.translate(box.padding.left, box.padding.top));
        geogroup
            .transition(this.transition('group1'))
            .attr("transform", this.translate(box.margin.left, box.margin.top));

        var paths = geogroup.selectAll('.geometry').data(data),
            fill = this.choropleth(data, box);

        this.center(geo, info);

        paths
            .enter()
                .append("path")
                .attr("class", "geometry")
                .attr("d", path)
                .style('fill', 'none')
                .style("stroke", this.modelProperty('stroke', color))
                .on("mouseover", this.mouseOver())
                .on("mouseout", this.mouseOut())
            .merge(paths)
                .transition(this.transition('geometry'))
                .attr("d", path)
                .style("stroke", this.modelProperty('stroke', color))
                .style("fill", fill)
                .style("fill-opacity", color.fillOpacity);

        paths
            .exit()
            .remove();
    },

    createGeoPath (geo, info) {
        var model = this.getModel(),
            projection = camelFunction(geo, 'geo', model.projection).scale(model.scale),
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

    center (geo, info) {
        var model = this.getModel();
        if (!model.boundGeometry) return;

        var path = this._geoPath,
            projection = path.projection(),
            box = this.boundingBox(),
            boundObject = info.topology.objects[model.boundGeometry],
            boundGeometry = boundObject ? geo.feature(info.topology, boundObject).features : null;

        if (!boundGeometry) return warn(`Could not find *boundGeometry* "${model.boundGeometry}" for centering - skip centering geochart`);

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
    choropleth (data, box) {
        var model = this.getModel(),
            dataLabelKey = model.dataLabelKey,
            dataValueKey = model.dataValueKey;
        let dataValue, valueRange, colors, buckets;

        if (model.neighbors) {
            dataValue = accessor('rank');
            valueRange = extent(data, dataValue);
            buckets = valueRange[1] + 1;
        } else {
            dataValue = (d) => d.data[dataValueKey];
            buckets = Math.min(model.buckets, data.length);
            valueRange = niceRange(extent(data, dataValue), buckets);
        }

        colors = this.getScale(model.choroplethScale).range(this.colors(buckets).reverse()).domain(valueRange);

        this.legend({
            type: 'color',
            scale: colors
        }, box);

        return d => {
            d.label = d.data[dataLabelKey] || d.id;
            d.value = dataValue(d);
            d.color = colors(d.value);
            return d.color;
        };
    }

});


export function dataInfo (frame) {
    var info = {};
    if (frame.type === 'frameCollection')
        frame.frames.each(df => {
            if (df.type === 'Topology') info.topology = df;
            else if (df.type === 'dataframe') info.data = df.data;
        });
    else if (frame.type === 'Topology')
        info.topology = frame;
    return info;
}


//
//  Create a geo data frame
//  ===========================
//
//  * geo - d3-geo & topojson object
//  * info - object with topology and data frame (optional)
export function geodata (geo, info, config) {
    var geoKey = config.geoKey,
        dataKey = config.dataKey;
    let data = {}, features, key, props;

    if (!info.topology) return warn('No topology object available');
    var geometry = info.topology.objects[config.geometry];
    if (!geometry) return warn(`Topology object ${config.geometry} is not available`);


    var neighbors = config.neighbors ? geo.neighbors(geometry.geometries) : null;

    features = geo.feature(info.topology, geometry).features;
    if (info.data) data = info.data.reduce((o, d) => {o[d[dataKey]] = d; return o;}, {});

    features = features.map(d => {
        props = d.properties;
        key = d[geoKey] || props[geoKey];
        return {
            id: key,
            type: d.type,
            geometry: d.geometry,
            data: assign({}, props, data[key])
        };
    });

    if (neighbors) features.forEach((d, i) => {
        d.neighbors = neighbors[i];
        d.rank = max(d.neighbors, j => features[j].rank) + 1 | 0;
    });

    return features;
}
