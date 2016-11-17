'use strict';

const errors = require('./errors');

module.exports.IpAddress = class {
  constructor(ip) {

  }

  static test(ip) {

  }

  static normalize(ip) {
    
  }
}

module.exports.MacAddress = class {
  constructor(mac) {
    mac = this.constructor.normalize(mac);
    this.blocks = mac.split(':');
  }

  static test(mac) {
    try {
      mac = this.constructor.normalize(mac);
    } catch (e) {
      return false;
    }

    return /^([a-f0-9]:){5}[a-f0-9]$/.test(mac);
  }

  static normalize(mac) {
    if (typeof(mac) !== 'string' && !(mac instanceof String)) {
      throw new errors.ArgumentError();
    }

    mac = mac.toLowerCase();

    let split = undefined;
    let blocks = [''];

    for (let c of mac) {
      if ([':', '-', '.'].indexOf(c) + 1) {
        split = split || c;
        if (split === c) {
          blocks.push('');
        }
      } else if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
        blocks[blocks.length - 1] += c;
      }
    }

    if ([':', '-'].indexOf(split) + 1) {
      if (blocks.length != 6 || blocks.find(x => x.length != 2)) {
        throw new errors.ArgumentError()
      }
    } else if (split === '.') {
      if (blocks.length != 3 || blocks.find(x => x.length != 4)) {
        throw new errors.ArgumentError()
      }

      blocks = blocks
        .map(x => [x.slice(0, 2), x.slice(2, 4)])
        .reduce((a, b) => a.concat(b));
    } else {
      blocks = (/.{2}/g)[Symbol.match](blocks[0]);
    }

    return blocks.join(':');
  }
}