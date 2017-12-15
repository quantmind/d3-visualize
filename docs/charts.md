# Charts

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Available Charts](#available-charts)
- [Crate a chart](#crate-a-chart)
- [API](#api)
  - [chart.dataStore](#chartdatastore)
  - [chart.draw ([fecthData])](#chartdraw-fecthdata)
  - [chart.getData ()](#chartgetdata-)
  - [chart.getStack ()](#chartgetstack-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Available Charts

The charts available are in the ``visuals`` object

## Crate a chart

It is possible to expand the library by creating custom charts via the ``createChart`` function.
```javascript
import createChart from 'd3-visualise';
```

## API

The chart API is implemented in the ``vizPrototype`` object. Plugins extend the
prototype with methods.

### chart.dataStore

Plugin: **data**, **Read-only**

The [data store][] associated with the chart. It is injected during chart initialisation by the data plugin.

### chart.draw ([fecthData])

Draw the chart and return a ``Promise`` which resolve in ``true`` or ``false`` indicating if the chart was
successfully drawn in the DOM.


### chart.getData ()

Plugin: **data**

Retrive data from the datastore. This is a safe function and it never throws an error. If data could not be retrived it logs the warning or exception and returns nothing.

### chart.getStack ()

Plugin: **shapes**

Return a [stack](https://github.com/d3/d3-shape#stacks) object configured by the ``chart.model.stack`` entry.


[data store]: ./data.md#data-store
