/**
 * Module imports
 */
var request = require('request').defaults({ pool: false });

/**
 * Export the factory
 */
module.exports = function(key, prefix) {
  return new TopHat(key, prefix);
};

/**
 * Constructor
 *
 * @param {String}  key     EZ API key
 * @param {Object}  options Optional options
 */
function TopHat(key, options) {
  if (!key) {
    throw new Error('Invalid EZ API key');
  }
  if (!options) {
    options = {};
  }
  this._key = key;
  this._prefix = options.prefix || '';
  this._ssl = options.ssl !== false;
}

/**
 * Track a counter stat
 *
 * @param   {String}    name    Stat name
 * @param   {Number}    count   Optional count
 * @param   {Function}  cb      Optional callback function
 * @return  {this}      for chaining
 */
TopHat.prototype.count = function(name, count, cb) {
  if (name) {
    if (typeof count === 'function') {
      cb = count;
      count = null;
    }
    if (typeof count !== 'number' || isNaN(count)) {
      count = 1;
    }
    this._post({ stat: this._prefix + name, count: count }, cb);
  } else {
    if (typeof cb === 'function') {
      cb(new Error('Invalid stat name'));
    }
  }
  return this;
};

/**
 * Track a value stat
 *
 * @param   {String}    name    Stat name
 * @param   {Number}    value   Stat value
 * @param   {Function}  cb      Optional callback function
 * @return  {this}      for chaining
 */
TopHat.prototype.value = function(name, value, cb) {
  var error;
  if (!name) {
    error = 'Invalid stat name';
  } else if (typeof value !== 'number' || isNaN(value)) {
    error = 'Invalid value';
  } else {
    this._post({ stat: this._prefix + name, value: value }, cb);
  }
  if (error && typeof cb === 'function') {
    cb(new Error(error));
  }
  return this;
};

/**
 * Post a stat to StatHat
 *
 * @param   {Object|Array}  data  Data to post
 * @param   {Function}      cb    Optional callback function
 */
TopHat.prototype._post = function(data, cb) {
  var options = {
        url: (this._ssl ? 'https://' : 'http://') + 'api.stathat.com/ez',
        method: 'POST'
      },
      payload = {
        ezkey: this._key
      };
  if (Array.isArray(data)) {
    payload.data = data;
  } else {
    payload.data = [data];
  }
  options.json = data;
  request(options, function(err, resp) {
    if (typeof cb === 'function') {
      if (resp) {
        if (resp.statusCode === 200) {
          cb(null);
        } else {
          cb(new Error('Failed to create stat: ' + resp.statusCode));
        }
      } else if (err) {
        cb(err);
      } else {
        cb(new Error('Failed to create stat'));
      }
    }
  });
};
