# Top Hat [![Build Status](https://secure.travis-ci.org/davidwood/tophat.png)](http://travis-ci.org/davidwood/tophat)

Top Hat is a minimal wrapper for the [StatHat](http://www.stathat.com) EZ API.

## Installation

    npm install tophat

## Example

```
var tophat = require('tophat'),
    stats = new tophat('EZ_KEY');

stats.count('login.success'); // Count 1 successful login
stats.count('login.failed', 2); // Count 2 failed logins

stats.value('users.active', 100); // Record 100 active users
```

## Constructor options

* `key`: StatHat EZ key, found on the [Settings](https://www.stathat.com/settings) page
* `options`: optional options object with the following keys
    * `prefix`: prefix for stat name
    * `ssl`: boolean specifying transport, defaults to `true`

## Methods

### .count(name, count, cb)

* `name`: Stat name
* `count`: Optional count, defaults to `1`
* `cb`: Optional callback function

### .value(name, value, cb)

* `name`: Stat name
* `value`: Stat value
* `cb`: Optional callback function
