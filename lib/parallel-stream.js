'use strict';

var Transform = require('stream').Transform
  , util      = require('util');

module.exports = ParallelStream;

function ParallelStream(userTransform) {
  Transform.call(this, {objectMode: true});
  this.userTransform = userTransform;
  this.running = 0;
  this.terminateCallback;
}
util.inherits(ParallelStream, Transform);

ParallelStream.prototype._transform = function(chunk, enc, cb) {
  this.running++;
  this.userTransform(chunk, enc, this._complete.bind(this));
  cb();
};

ParallelStream.prototype._flush = function(cb) {
  if (!this.running > 0) return cb();
  this.terminateCallback = cb;
};

ParallelStream.prototype._complete = function(err) {
  this.running--;
  if (err) return this.emit('error', err);
  if (this.running === 0) this.terminateCallback && this.terminateCallback();
};
