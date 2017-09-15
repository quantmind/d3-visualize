# Data

The basic data model used by d3-visualize is tabular data, similar to a spreadsheet or database table.
Individual data sets are assumed to contain a collection of records (or “rows”), which may contain any number of named data attributes (fields, or “columns”).
Records are modeled using standard JavaScript objects.

If the input data is simply an array of primitive values, ``visualize`` maps each value to the data property of a new object. For example ```[5, 3, 8, 1]``` is loaded as:
```
[ {"data": 5}, {"data": 3}, {"data": 8}, {"data": 1} ]
```
