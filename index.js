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

				let validateFalse = '';
				try {

					// attempt to import the file
					let jobs = require('../../jobs');

					// validate the properties of each job;
					for (let key in jobs) {
						let job = jobs[key];
						let props = {
							interval: 'number',
							start: 'object',
							run: 'function'
						};
						for (let prop in props) {
							if (typeof job[prop] !== props[prop]) {
								validateFalse += `[sails-hook-jobmanager] ${key} -> ${prop} prop should be ${props[prop]}, found ${typeof job[prop]}.\n`;
							}
						}
					}

				} catch (err) {
					throw new Error(
						'\n\n[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n' +
						'[sails-hook-jobmanager] Could not import jobs, view error\n' +
						'[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n\n' + err
					);
				}

				if (validateFalse.length > 0)	{
					throw new Error(
						'\n\n[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n' +
						'[sails-hook-jobmanager] Could not import jobs, config errors:\n' + validateFalse +
						'[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n\n'
					);
				} else {
					log.info('[sails-hook-jobmanager] -> job configuration sucessfully loaded.');
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
						log.info('[sails-hook-jobmanager] -> pulse ' + d.getHours() + ':' + d.getMinutes());

						let minutesPastMidnight = (d.getHours() * 60) + d.getMinutes();

						for (let key in jobs) {
							let job = jobs[key];
							let evaltime = minutesPastMidnight - job.start.getMinutes();
							if ( (d >= job.start) && (evaltime % job.interval === 0) ) {
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
