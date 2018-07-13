/**
 * Module dependencies
 */

/**
 * Jobmanager hook
 *
 * @description :: A hook to compile assets using Webhook.
 */
module.exports = function defineJobmanagerHook(sails) {

	// set the default file path if none is enabled
	let defaults = {
		path: ('../../jobs')
	};

	function log(s) {
		sails.log.debug(`[sails-hook-jobmanager] -> ${s}.`);
	}

	return {

		/**
		 * defaults
		 *
		 * The implicit configuration defaults merged into `sails.config` by this hook.
		 *
		 * @type {Dictionary}
		 */
		defaults: function () {

			// verify that the hook is enabled else return
			if (!(sails && sails.config && sails.config.jobmanager && sails.config.jobmanager.enabled)) {
				log('DISABLED -> sails.config.jobmanager.enabled !== true');
				return false;
			}

			// inform if path is overwritten
			if (sails.config.jobmanager.path) {
				log('job manager path provided attemting to use ' + sails.config.jobmanager.path);
			} else {
				log('no job manager path provided attemting to use default ' + defaults.path);
			}

			let validateFalse = '';
			try {

				// attempt to import the file
				let jobs = sails.config.jobmanager.path ? require(sails.config.jobmanager.path) : require(defaults.path);

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
						} else if (prop === 'start' && ( job[prop] instanceof Date === false || isNaN(job[prop])) ) {
							validateFalse += `[sails-hook-jobmanager] ${key} -> ${prop} prop should be a valid date, it did not validate, returned ${new Date(job[prop])}.\n`;
						}
					}
				}

			} catch (err) {
				throw new Error(
					'\n\n[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n' +
					'[sails-hook-jobmanager] Could not import jobs, view error\n' +
					'[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n\n'
				);
			}

			if (validateFalse.length > 0)	{
				throw new Error(
					'\n\n[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n' +
					'[sails-hook-jobmanager] Could not import jobs, config errors:\n' + validateFalse +
					'[sails-hook-jobmanager] -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-\n\n'
				);
			} else {
				log('job configuration sucessfully loaded');
			}

			return defaults;

		},

		/**
		 * Runs when a Sails app loads/lifts.
		 *
		 * @param {Function} done
		 */
		initialize: function (done) {

			// verify that the hook is enabled else return
			if (!(sails && sails.config && sails.config.jobmanager && sails.config.jobmanager.enabled)) {
				return done();
			}

			log('initializing');

			sails.after('lifted', function () {

				// choose the correct file to use
				let jobs = sails.config.jobmanager.path ? require(sails.config.jobmanager.path) : require(defaults.path);

				setInterval( (d = new Date()) => {
					if (sails.config.jobmanager.pulse) {
						log('pulse ' + d.getHours() + ':' + `0${d.getMinutes()}`.slice(-2) );
					}

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

			// Continue lifting Sails.
			return done();

		}

	};

};
