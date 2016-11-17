'use strict';

const errors = require('./errors');

module.exports.Address = class {
  static test(mac) {
    try {
      this.constructor.normalize(mac);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports.IPv4Address = class {
  constructor(ip) {

  }

  static normalize(ip) {
    if (typeof(ip) !== 'string' && !(ip instanceof String) || !ip) {
      throw new errors.ArgumentError();
    }

    ip = ip.toLowerCase();

    let blocks = [''];
    let valid = true;

    for (let i = 0, l = ip.length, c = ip[0]; valid && i < l && (c = ip[i]); c = i++) {
      if (c === '.') {
        (valid = blocks.length <= 4 && blocks[blocks.length - 1]) && blocks.push('');
      } else if ((c >= '0' && c <= '9')) {
        blocks[blocks.length - 1] += c;
        valid = blocks[blocks.length - 1] <= 255
      } else {
        valid = false;
      }
    }

    if (!valid || blocks.length !== 4 || !blocks[3]) {
      throw new errors.ArgumentError();
    }

    return blocks.map(x => parseInt(x)).join('.');
  }
}

module.exports.IPv6Address = class {
  constructor(ip) {

  }

  static normalize(ip) {
    if (typeof(ip) !== 'string' && !(ip instanceof String) || !ip) {
      throw new errors.ArgumentError();
    }

    ip = ip.toLowerCase();

    let shortened = false;
    let blocks = [''];
    let valid = true;

    for (let i = 0, l = ip.length, c = ip[0]; valid && i < l && (c = ip[i]); i++) {
      if (c === ':') {
        if (i + 1 === l) {
          break;
        }

        if (ip[i + 1] === ':') {
          if (shortened) {
            throw new errors.ArgumentError();
          }

          i++;
        } else if (blocks[blocks.length - 1] !== null) {
          blocks.push('');
        } else {
          throw new errors.ArgumentError();
        }

      } else if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
        blocks[blocks.length - 1] += c;
        if (parseInt(blocks[blocks.length - 1], 16) > 0xffff) {
          throw new errors.ArgumentError();
        }
      } else {
        throw new errors.ArgumentError();
      }
    }

    if (!valid || blocks.length > 8) {
      throw new errors.ArgumentError();
    }
  }
}

module.exports.MACAddress = class {
  constructor(mac) {
    mac = this.constructor.normalize(mac);
    this.blocks = mac.split(':');
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
      } else {
        throw new errors.ArgumentError();
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