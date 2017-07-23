// Based on: https://github.com/rreusser/emlapack/blob/dependency-graph/analysis/index.js

'use strict'

var glob = require('glob');
var fs = require('fs');

var lapackFiles = require('../src/lapack-files');
var blasFiles = require('../src/blas-files');

var CLAPACK_BLAS_PATH = process.env.CLASPACK_BLAS_PATH || './clapack/BLAS/SRC';
var CLAPACK_SRC_PATH = process.env.CLAPACK_SRC_PATH || './clapack/SRC';

var funcIdentifierToName = { blas: {}, lapack: {} };
var funcIdentifiers = { blas: [], lapack: [] };

blasFiles.forEach(function(f) {
  funcIdentifiers.blas.push(f + '_');
  funcIdentifierToName.blas[f + '_'] = f;
});

lapackFiles.forEach(function(f) {
  funcIdentifiers.lapack.push(f + '_');
  funcIdentifierToName.lapack[f + '_'] = f;
});

var dependencies = {};

glob(CLAPACK_BLAS_PATH + '/*.c', function(err, files) {
  files.forEach(function (file) {
    var content = fs.readFileSync(file, "utf8");

    var func = file.match(/.*\/([^.]*)\.c$/)[1];
    for (var i = funcIdentifiers.blas.length; i >= 0; i--) {
      var identifier = funcIdentifiers.blas[i]
      if (content.indexOf(identifier) !== -1) {
        var dep = funcIdentifierToName.blas[identifier]

        if (dep !== func) {
          dependencies[func] = dependencies[func] || {};
          dependencies[func].blas = dependencies[func].blas || [];
          dependencies[func].blas.push(dep);
        }

      }
    }

    for (var i = funcIdentifiers.lapack.length; i >= 0; i--) {
      var identifier = funcIdentifiers.lapack[i]
      if (content.indexOf(identifier) !== -1) {
        var dep = funcIdentifierToName.lapack[identifier]

        if (dep !== func) {
          dependencies[func] = dependencies[func] || {};
          dependencies[func].lapack = dependencies[func].lapack || [];
          dependencies[func].lapack.push(dep);
        }

      }
    }
  });

  glob(CLAPACK_SRC_PATH + '/*.c', function(err, files) {
    files.forEach(function (file) {
      var content = fs.readFileSync(file, "utf8");

      var func = file.match(/.*\/([^.]*)\.c$/)[1];
      for (var i = funcIdentifiers.blas.length; i >= 0; i--) {
        var identifier = funcIdentifiers.blas[i]
        if (content.indexOf(identifier) !== -1) {
          var dep = funcIdentifierToName.blas[identifier]

          if (dep !== func) {
            dependencies[func] = dependencies[func] || {};
            dependencies[func].blas = dependencies[func].blas || [];
            dependencies[func].blas.push(dep);
          }

        }
      }

      for (var i = funcIdentifiers.lapack.length; i >= 0; i--) {
        var identifier = funcIdentifiers.lapack[i]
        if (content.indexOf(identifier) !== -1) {
          var dep = funcIdentifierToName.lapack[identifier]

          if (dep !== func) {
            dependencies[func] = dependencies[func] || {};
            dependencies[func].lapack = dependencies[func].lapack || [];
            dependencies[func].lapack.push(dep);
          }

        }
      }
    });

    console.log(dependencies)
  });
});
