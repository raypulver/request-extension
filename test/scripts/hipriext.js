module.exports = require('../..')({
  middleware: function (request, params, next) {
    console.log('first');
    next();
  }
});
