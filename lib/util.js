"use strict";

function isExtension(cfg, v) {
  return ((typeof cfg.middleware !== 'undefined' && v.middleware === cfg.middleware) || (typeof cfg.mount !== 'undefined' && v.mount === cfg.mount) || (typeof v.unmount !== 'undefined' && v.unmount === cfg.unmount));
}

module.exports.isExtension = isExtension;
