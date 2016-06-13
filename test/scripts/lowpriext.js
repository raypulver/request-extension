module.exports = require('../..')({
  depends: ['./hipriext'],
  middleware: function (request, params, next) {
    console.log('second');
    next();
  }
});
