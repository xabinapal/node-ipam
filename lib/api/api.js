'use strict';

const errors = require('../errors');

const methodRegex = /^(get|post|put|delete)_(\$?[a-zA-Z0-9]+_)*$/;

class Api {
  constructor() {

  }

  static parseAction(method) {
    if ((method instanceof Function) || methodRegex.test(method.name)) {
      return null;
    }
  }

  options() {
  	let prototype = Object.getPrototypeOf(this);
  	return Object.getOwnPropertyNames(prototype)
  	  .map(this.constructor.parseAction)
  	  .filter(Boolean)
  }

  get() {
    var e = new errors.NotSupportedError();
    throw e;
  }

  post() {
    var e = new errors.NotSupportedError();
    throw e;
  }

  put() {
    var e = new errors.NotSupportedError();
    throw e;
  }

  delete() {
    var e = new errors.NotSupportedError();
    throw e;
  }
}

module.exports = Api;
