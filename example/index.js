//const moment = require('moment');

/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const hourly = 60;
const daily = 1440;
/* eslint-enable no-unused-vars */


module.exports = {

	/**
	*
	* @param {integer} 		interval	//in minutes, minimum interval is 1 minute
	* @param {date} 			start			//time to start the job
	* @param {function} 	run				//function to run
	*
	*/

	// this job runs every minute immediatly after starting the job
	a: {
		interval: 1,
		start: new Date(),
		run: () => {
			for (let i = 0; i < 100; i++) {
				console.log('a', i);
			}
		}
	},

	b: {
		interval: 1,
		start: new Date(),
		run: () => {
			for (let i = 0; i < 100; i++) {
				console.log('b', i);
			}
		}
	}

	/*
	bJob: {
		interval: 5,
		start: new Date( moment().startOf('hour').add(1, 'minutes') ),
		run: () => {
			sails.log.info('[JOB MANAGER] this job runs every five minutes on the 1,6,11,16,21 etc...');
		}
	},

	dataCleanup: {
		interval: 2,
		start: addMinutes(new Date(), 100), //start this job in 100 minutes and run every two minutes
		run: require('./datacleanup') //import function from a file
	},

	dataQuality: {
		interval: daily,
		start: addMinutes(new Date(), 30), //start this job once a 'daily' 30 minutes from now
		run: () => {
			sails.log.info('[JOB MANAGER] this job is boring and only executes once a day.');
		}
	}
	*/

};
