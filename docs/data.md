# Data

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Data Source](#data-source)
  - [Data Source properties](#data-source-properties)
- [Data Store](#data-store)
  - [store.sources](#storesources)
  - [store.size ()](#storesize-)
  - [store.addSources (sources)](#storeaddsources-sources)
  - [store.getData (source, [context])](#storegetdata-source-context)
- [Data events](#data-events)
- [Data Sources](#data-sources)
  - [Composite DataSource](#composite-datasource)
  - [Array DataSource](#array-datasource)
  - [Remote DataSource](#remote-datasource)
  - [Expression DataSource](#expression-datasource)
- [DataFrame](#dataframe)
  - [df.type](#dftype)
  - [df.columns](#dfcolumns)

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

## Data Source

### Data Source properties

A data source is created by specifing a config object. Depending on the properties of the config object
a different data source is created. Check the full list of [available data sources](#data-sources)
for further information.

| Property  | Type  | Description  |
|---|---|---|
| name | String  | A unique name for the data set. If not provided it will be assigned by the library  |
| source | String/String[] | The name of one or more data sets to use as the source for this data set ([CompositeDataSource][])|
| url | String | A URL from which to load the data set  ([RemoteDataSource][] only)|
| cache | Boolean | if ``true`` the data source caches data (default ``false``) |
| data | Array | The dataset as array of objects or values ([Array datasource](#array-datasource) only) |


## Data Store

The ``DataStore`` is used as a container of [DataSources][].

### store.sources

**Read only** property

A map of data source names to [DataSources][].

### store.size ()

Number of [DataSources][] in the data store, equivalent to ``store.sources.size()``.

### store.addSources (sources)

Add a new data sources, if ``sources`` is an object rather than an array, it adds only one data source.
The ``sources`` contains objects which identify the data source type. For example (adding only one data source):
```javascript
store.addSources({
    data: [1, 2, 3, 4, 5]
});
```
adds an [array datasource](#array-datasource) to the datastore. We didn't pass a name for the data source, therefore the data store created one for us which in this case is ``default``. To retrive the data:
```javascript
ds = store.source('default');
```
To create a source with a name:
```javascript
store.addSources({
    name: 'test',
    data: [1, 2, 3, 4, 5]
});
```

### store.getData (source, [context])

Fetch data from a data ``source`` and returns a ``Promise`` which resolve in a [DataFrame][].
If the ``source`` is not available it throws an error. If the source support caching and a data frame
is available it returns it without fetching new data.


## Data events

The datastore and datasources trigger the following events:

* ``init`` a new data source has been initialised and added to the dataStore
* ``remove`` a data source has been removed from the dataStore
* ``data`` new data is available for a given data source

## Data Sources

### Composite DataSource

### Array DataSource

### Remote DataSource

### Expression DataSource

## DataFrame

The DataFrame is the object returned by a [store.getData](#storegetdata-source-context).

### df.columns

The columns in the data frame
```javascript
df = new DataFrame([{a: 3, b: 4}, {a:4, c: 6}]);
df.columns  //  ['a', 'b', 'c']
```
### df.type

always ``dataframe``.


[DataSources]: #datasources
[DataFrame]: #dataframe
[CompositeDataSource]: #composite-datasource
[RemoteDataSource]: #remote-datasource
