# Data

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Data Properties](#data-properties)
- [Data Store](#data-store)
  - [store.size ()](#storesize-)
- [Data Sources](#data-sources)
  - [Composite DataSource](#composite-datasource)
  - [Array DataSource](#array-datasource)
  - [Remote DataSource](#remote-datasource)
  - [Expression DataSource](#expression-datasource)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


The basic data model used by d3-visualize is tabular data, similar to a spreadsheet or database table.
Individual data sets are assumed to contain a collection of records (or “rows”), which may contain any number of named data attributes (fields, or “columns”).
Records are modeled using standard JavaScript objects.

If the input data is simply an array of primitive values, ``visualize`` maps each value to the data property of a new object. For example ```[5, 3, 8, 1]``` is loaded as:
```javascript
[
    {"data": 5},
    {"data": 3},
    {"data": 8},
    {"data": 1}
]
```

## Data Properties

| Property  | Type  | Description  |
|---|---|---|
| name | String  | A unique name for the data set. If not provided it will be assigned by the library  |
| source | String/String[] | The name of one or more data sets to use as the source for this data set ([CompositeDataSource][])|
| url | String | A URL from which to load the data set  ([RemoteDataSource][])|


## Data Store

The ``DataStore`` is used as a container of [DataSources][].

### store.size ()

Number of [DataSources][] in the data store


## Data Sources

### Composite DataSource

### Array DataSource

### Remote DataSource

### Expression DataSource

## Visual Binding

The DataStore is used by the visual API to retrieve data. The Binding
with the visual API is implemented via the [data](/src/plugins/data.js)
plugin.

### visual.dataStore

Property returning the datastore instance associated with the visual.

### visual.getContext(context)

Returns a new model context as a child of the ``dataStore`` context.

[DataSources]: #datasources
[CompositeDataSource]: #composite-datasource
[RemoteDataSource]: #remote-datasource
