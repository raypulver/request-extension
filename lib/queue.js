"use strict";

const clone = require('clone'),
  util = require('./util'),
  PriorityQueue = require('js-priority-queue');

Queue.prototype = Object.create(PriorityQueue.prototype, {
  forEach: {
    value: function (cb, thisArg) {
      let tmp = new Queue({ comparator: this.priv.comparator });
      for (var i = 0, len = this.length; i < len; ++i) {
        tmp.queue(this.peek());
        if (cb.call(thisArg, this.dequeue(), i) === false) break;
      }
      for (; i < this.length; ++i) tmp.queue(this.dequeue());
      while (tmp.length) this.queue(tmp.dequeue());
    }
  },
  filter: {
    value: function (cb, thisArg) {
      let retval = new Queue({ comparator: this.priv.comparator });
      let copy = clone(this);
      for (var i = 0; i < copy.length; ++i) {
        let value = copy.dequeue();
        if (cb.call(thisArg, value, i)) retval.queue(value);
      }
      return retval;
    }
  },
  splice: {
    value: function (cfg) {
      for (var i = 0; i < this.length; ++i) {
        let value = this.dequeue();
        if (!util.isExtension(cfg, value)) this.queue(value);
      }
    }
  }
});

function Queue(config) {
  if (!(this instanceof Queue)) return new Queue(config);
  PriorityQueue.apply(this, arguments);
}

module.exports = Queue;
