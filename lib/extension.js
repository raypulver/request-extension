"use strict";

const Queue = require('./queue'),
  util = require('./util'),
  clone = require('clone'),
  defaultPriority = 1;

module.exports = function ExtensionFactory(cfg) {
  function Extension (request) {
    if (!request.$inject) {
      Object.defineProperty(request, "$inject", {
        enumerable: false,
        configurable: true,
        value: new Queue({ comparator: function (a, b) { return a.priority - b.priority; } })
      });
      request.$inject.Request = request.Request;
      request.Request = function InjectedRequest (params) {
        request.$inject.$init = request.$inject.Request.prototype.init;
        request.$inject.Request.prototype.init = function () {
          let self = this, args = arguments, tmp = clone(request.$inject), len = tmp.length;
          (function strandGenerator(transitionFn) {
            return function asyncStrand($inject, cb, idx) {
              if (typeof idx === 'undefined') idx = 0;
              function next() {
                return transitionFn(function () {
                  if (idx === len - 1) return cb();
                  return asyncStrand($inject, cb, idx + 1);
                });
              }
              let middleware = $inject.dequeue().middleware;
              if (typeof middleware !== 'function') return next();
              middleware.call(Extension, self, params, next);
            };
          })(process.nextTick)(tmp, function () {
            self.on('complete', function (res, body) {
              request.$inject.Request.prototype.init = request.$inject.$init;
            });
            request.$inject.$init.apply(self, args);
          });
        };
        return new request.$inject.Request(params);
      }
    }
    if (!request.$inject.filter(util.isExtension.bind(null, cfg)).length) {
      if (typeof cfg.mount === 'function') cfg.mount.call(Extension, request);
      if (Array.isArray(cfg.depends)) {
        let priorities = [];
        cfg.depends.forEach(function (v) {
          try {
            request.$inject.forEach(function (extension) {
              if (util.isExtension(v.getConfig(), extension)) priorities.push(extension.priority);
            });
          } catch (e) {
            priorities.push(defaultPriority);
          }
        });
        cfg.priority = Math.max.apply(null, priorities) + 1;
      } else cfg.priority = defaultPriority;
      request.$inject.queue(cfg);
    }
    return request;
  }
  Extension.unmount = function unmount (request) {
    if (!request.$inject) return request;
    if (cfg.unmount) cfg.unmount.call(this, request);
    request.$inject.splice(cfg);
    if (!request.$inject.length) {
      request.Request = request.$inject.Request;
      request.Request.prototype.init = request.$inject.$init;
      delete request.$inject;
    }
    return request;
  }
  Object.defineProperty(Extension, "getConfig", {
    enumerable: false,
    value: function getConfig() {
      return cfg;
    }
  });
  return Extension;
};
