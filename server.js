'use strict';

var fs              = require('fs')
  , split           = require('split')
  , request         = require('request')
  , ParallelStream  = require('./lib/parallel-stream');

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(new ParallelStream(function(url, enc, cb) {
    if (!url) return cb();
    var self = this;
    request.head(url, function(err, res) {
      var text = url + ' is ' + (err ? 'down' : 'up' + '\n');
      self.push(text);
      cb();
    });
  }))
  .pipe(fs.createWriteStream('status.txt'))
  .on('finish', function() {
    console.log('All urls where checked');
  });
