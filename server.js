'use strict'

const fs = require('fs')
const split = require('split')
const request = require('request')
const ParallelStream = require('./lib/parallel-stream')

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(new ParallelStream(function (url, enc, cb) {
    if (!url) return cb()
    request.head(url, (err, res) => {
      const text = url + ' is ' + (err ? 'down' : 'up' + '\n')
      this.push(text)
      cb()
    })
  }))
  .pipe(fs.createWriteStream('status.txt'))
  .on('finish', () =>
    console.log('All urls where checked'))
