const expect = require('chai').expect,
  request = require('request'),
  path = require('path'),
  spawnSync = require('child_process').spawnSync,
  Queue = require('../lib/queue'),
  util = require('../lib/util'),
  Extension = require('..');

describe('priority queue', function () {
  it('should perform forEach without side effects', function () {
    var q = new Queue({ comparator: function (a, b) { return b - a } }), arr = [];
    q.queue(5);
    q.queue(3);
    q.queue(7);
    q.forEach(function (v) {
      arr.push(v);
    });
    expect(arr).to.eql([7, 5, 3]);
    expect(q.length).to.eql(3);
  });
  it('should be able to splice extensions', function () {
    var q = new Queue();
    function middleware() {}
    q.queue({ middleware: middleware });
    expect(q.length).to.equal(1);
    q.splice({ middleware: middleware});
    expect(q.length).to.equal(0);
  });
});

describe('request-extension factory', function () {
  it('should be able to mount and unmount', function () {
    var ext = Extension({
      mount: function (request) {
        request.property = 1;
      },
      unmount: function (request) {
        delete request.property;
      }
    });
    ext(request);
    expect(request.property).to.be.ok;
    ext.unmount(request);
    expect(request.property).to.not.be.ok;
    expect(request.$inject).to.be.undefined;
  });
  it('should execute middleware based on their dependency graph', function () {
    expect(spawnSync('node', [path.join(__dirname, 'scripts', 'testexec')]).stdout.toString('utf8')).to.match(/first\nsecond/);
  });
});
