'use strict';

var fs = require('fs');
var dependencies = require('../dependencies');
var exportedFunctions = require('../custom/export-functions');

var processed = { blas: {}, lapack: {} };
var results = { blas: [], lapack: [] };

function findDependencies(key) {
  var parent = dependencies[key];

  if (!parent) { return; }

  Object.keys(parent).forEach(function(subkey) {
    var children = parent[subkey];
    var processingKey = key;

    children.forEach(function(c) {
      if (c === processingKey) { return; }
      if (processed[subkey][c]) { return; }

      results[subkey].push(c);

      processed[subkey][c] = true;

      findDependencies(c);
    });
  });
}

exportedFunctions.forEach(function(f) {
  var func = f.replace(/_/g, "");
  findDependencies(func);
});

fs.writeFile('./custom/blas-files.js', "module.exports = " + JSON.stringify(results.blas, null, 2) + ";\n");

fs.writeFile('./custom/lapack-files.js', "module.exports = " + JSON.stringify(results.lapack, null, 2) + ";\n");
