/**
 * Module dependencies
 */
const log = require('captains-log')();


/**
 * Jobmanager hook
 *
 * @description :: A hook to compile assets using Webhook.
 */
module.exports = function defineJobmanagerHook(sails) {

	return {

		/**
		 * defaults
		 *
		 * The implicit configuration defaults merged into `sails.config` by this hook.
		 *
		 * @type {Dictionary}
		 */
		defaults: function () {

			let defaults = {};

			if (typeof sails.config.custom.jobmanager === 'boolean' && sails.config.custom.jobmanager === true ) {

				try {
					let jobs = require('../../jobs');
					log.info('[sails-hook-jobmanager] -> job configuration sucessfully loaded.');
				} catch (err) {
				//console.log(err);
					throw new Error(
						'\n\n[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n' +
						'[sails-hook-jobmanager] Could not import jobs, view error\n' +
						'[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n\n' +
						err);
				}

			}

			return defaults;

		},

		/**
		 * Runs when a Sails app loads/lifts.
		 *
		 * @param {Function} done
		 */
		initialize: function (done) {

			if (typeof sails.config.custom.jobmanager === 'boolean' && sails.config.custom.jobmanager === true ) {

				log.info('[sails-hook-jobmanager] -> initializing.');

				sails.after('lifted', function () {

					let jobs = require('../../jobs');

					setInterval( (d = new Date()) => {

						let minutesPastMidnight = (d.getHours() * 60) + d.getMinutes();

						for (let key in jobs) {
							let job = jobs[key];

							// if current time is greater then start time
							// and minutes past midnight is equally divisible by the interval
							if ( (d >= job.start) && (minutesPastMidnight % job.interval === 0) ) {
								job.run();
							}

						}

					}, 60000);

				});

			}

			// Continue lifting Sails.
			return done();

		}

	};

};
