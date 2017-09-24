# Getting Started

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [Dependencies](#dependencies)
- [Creating a visual](#creating-a-visual)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

If you use [NPM](https://www.npmjs.com/package/d3-visualize), ``npm install d3-visualize``.
Otherwise, download the [latest release](https://github.com/quantmind/d3-visualize/releases).
You can also load directly from [giottojs.org](https://giottojs.org),
as a [standalone library](https://giottojs.org/latest/d3-visualize.js) or
[unpkg](https://unpkg.com/d3-visualize/).
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.
Try [d3-visualize](https://runkit.com/npm/d3-visualize) in your browser.
```javascript
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://giottojs.org/latest/d3-view.min.js"></script>
<script>
<script src="https://giottojs.org/latest/d3-visualise.min.js"></script>
<script>

var vm = d3.view();
...
vm.mount("#my-element");

</script>
```

## Dependencies

d3-view strictly depends on four d3 plugins:

* [d3-collection](https://github.com/d3/d3-collection)
* [d3-dispatch](https://github.com/d3/d3-dispatch)
* [d3-selection](https://github.com/d3/d3-selection)
* [d3-timer](https://github.com/d3/d3-timer)
* [d3-view](https://github.com/d3/d3-view)

However, to write interesting UI components one may want to use many other
d3 plugins, or the whole d3 library.

## Creating a visual

To create a visual object for you application, invoke the ``d3.view`` function
```javascript
var viz = new d3.Visual({
    type: "barchart",
    data: [1, 2, 3, 4, 5],
    
});
```
