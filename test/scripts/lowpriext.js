module.exports = require('../..')({
  depends: [require('./hipriext')],
  middleware: function (request, params, next) {
    console.log('second');
    next();
  }
});
