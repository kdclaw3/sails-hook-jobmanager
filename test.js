/* Testing Framework */
const hook = require('./index.js');
const	expect = require('chai').expect;

/* Imitate Sails */
const log = require('captains-log')();
let sails = {
	log: log
};


describe('[sails-hook-jobmanager] test -> defaults', function () {

	it('determins if defaults is a function', function () {

		let matches = hook(sails);
		expect(typeof matches.defaults).to.deep.equal('function');

	});

	it('expects to return false with no configuration passed in', function () {

		let r = hook(sails).defaults();
		expect(r).to.deep.equal(false);

	});

	it('expects to throw error with files not in default location', function () {

		sails.config = {
			jobmanager: {
				enabled: true
			}
		};

		expect( () => {hook(sails).defaults();} ).to.throw(Error);

	});

	it('expects to return defaults with a valid file', function () {

		sails.config = {
			jobmanager: {
				enabled: true,
				path: './example'
			}
		};

		let r = hook(sails).defaults();
		expect(r).to.deep.equal({ path: '../../jobs' });


	});


});
