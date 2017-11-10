import {assign} from 'd3-let';

import {visuals} from '../core/base';

const curveTypes = [
    "basis", "basisClosed", "basisOpen", "bundle",
    "cardinal", "cardinalClosed", "cardinalOpen",
    "catmullRom", "catmullRomClosed", "catmullRomOpen",
    "linear", "linearClosed", "monotoneX", "monotoneY",
    "natural", "step", "stepAfter", "stepBefore"
];

const scales = ["linear", "log", "time"];

assign(visuals.schema.definitions, {
    curve: {
        type: "string",
        description: "curve type for line and area charts",
        default: "natural",
        enum: curveTypes
    },
    stack: {
        type: "object",
        properties: {
            order: {
                type: "string",
                enum: ['ascending', 'descending', 'insideOut', 'none', 'reverse'],
                default: 'none'
            },
            offset: {
                type: "string",
                enum: ['diverging', 'expand', 'none', 'silhouette', 'wiggle'],
                default: 'none'
            }
        }
    }
});

export default {
    lineWidth: {
        type: "number",
        default: 1
    },
    curve: {
        "$ref": "#/definitions/curve"
    },
    cornerRadius: {
        type: "number",
        default: 0,
        minimum: 0,
        description: "corner radius in pixels"
    },
    x: {
        type: "string",
        description: "data accessor for the x coordinate",
        default: "x"
    },
    y: {
        type: "string",
        description: "data accessor for the y coordinate",
        default: "y"
    },
    scaleX: {
        type: "string",
        description: "scale for the x coordinate",
        enum: scales,
        default: "linear"
    },
    scaleY: {
        type: "string",
        description: "scale for the y coordinate",
        enum: scales,
        default: "linear"
    },
    axisX: {
        type: "boolean",
        description: "draw x axis",
        default: false
    },
    axisY: {
        type: "boolean",
        description: "draw y axis",
        default: false
    },
    groupby: {
        type: "string",
        description: "Group data by a given dimension"
    },
    stack: {
        "$ref": "#/definitions/stack"
    },
    gradient: {
        type: "boolean",
        description: "Gradient to zero opacity",
        default: false
    },
    lineDarken: {
        type: "number",
        description: "Darken line color",
        minimum: 0,
        maximum: 1,
        default: 0.2
    }
};
