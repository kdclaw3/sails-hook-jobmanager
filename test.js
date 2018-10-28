/* Testing Framework */
const hook = require('./index.js');
const	expect = require('chai').expect;

/* Imitate Sails */
let sails = {
  log: {
    debug: x => {
      console.log(x); // eslint-disable-line no-console
    }
  }
};

describe('DEFAULTS', function () {

  it('determins if defaults is a function', function () {

    let matches = hook(sails);
    expect(typeof matches.defaults).to.deep.equal('function');

  });

  it('expects to return false with no configuration passed in', function () {

    let r = hook(sails).defaults();
    expect(r).to.deep.equal(false);

  });

  it('expects to throw error with files not in default location', function () {

    sails.config = { jobmanager: { enabled: true } };

    expect(() => {
      hook(sails).defaults();
    }).to.throw(Error);

  });

  it('expects to return defaults with a valid file', function () {

    sails.config = {
      jobmanager: {
        pulse: true,
        enabled: true,
        path: './example'
      }
    };

    let r = hook(sails).defaults();
    expect(r).to.deep.equal({ path: '../../jobs' });


  });


});


let done = function () {
  // do nothing
};
// reset sails
sails = {
  log: {
    debug: x => {
      console.log(x); // eslint-disable-line no-console
    }
  },
  jobmanager: {
    enabled: true,
    pulse: true,
    path: './example'
  },
  after: function (action, cb) {
    if (action === 'lifted') cb();
  }
};

describe('INITIALIZE', function () {

  it('determins if initialize is a function', function () {

    let matches = hook(sails);
    expect(typeof matches.initialize).to.deep.equal('function');

  });

  it('expects to run the example config', function () {

    hook(sails).initialize(done);
    // expect(r).to.deep.equal(false);

  });

});
