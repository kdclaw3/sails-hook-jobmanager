const moment = require('moment');
const hourly = 60, daily = 1440;


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

  aa: {
    interval: 2,
    start: new Date(),
    run: () => {
      for (let i = 0; i < 100; i++) {
        console.log('aa', i);
      }
    }
  },

  b: {
    interval: hourly,
    start: new Date(moment().startOf('hour').add(26, 'minutes')),
    run: () => {
      for (let i = 0; i < 100; i++) {
        console.log('b', i);
      }
    }
  },

  c: {
    interval: daily,
    start: new Date(moment().startOf('day').add(16, 'hours').add(26, 'minutes')),
    run: () => {
      for (let i = 0; i < 100; i++) {
        console.log('c', i);
      }
    }
  }

  /*
	 *
	 *  everyMinute: {
	 *   interval: 1, // runs every minute
	 *   start: new Date(), // starts immediatly
	 *   run: () => { // simple function
	 *     sails.log.info('[everyMinute] this job runs every minute.');
	 *   }
	 *  },
	 *
	 *  everyMinuteImportedJob: {
	 *   interval: 1, // runs every minute
	 *   start: new Date(), // starts immediatly
	 *   run: require('./sample') // import logic
	 *  },
	 *
	 *  everyTwoMinues: {
	 *   interval: 2, // runs every 2 minutes
	 *   start: new Date( moment().startOf('hour').add(2, 'minutes') ), // on the 2s of the hour
	 *   run: () => { // simple function
	 *     sails.log.info('[everyTwoMinues] this job runs every 2 minutes.');
	 *   }
	 *  },
	 *
	 *  everyFiveMinues: {
	 *   interval: 5, // runs every 5 minutes
	 *   start: new Date( moment().startOf('hour').add(5, 'minutes') ), // on the 5s of the hour
	 *   run: () => { // simple function
	 *     sails.log.info('[everyFiveMinues] this job runs every 5 minute.');
	 *   }
	 *  },
	 *
	 *  everyHour: {
	 *   interval: hourly, // runs every hour
	 *   start: new Date( moment().startOf('hour').add(45, 'minutes') ), // on the 45 of the hour
	 *   run: () => { // simple function
	 *     sails.log.info('[everyHour] this job runs every hour.');
	 *   }
	 *  },
	 *
	 *  everyDay: {
	 *   interval: daily, // runs every day
	 *   start: new Date( moment().startOf('day').add(10, 'hours').add(35, 'minutes') ), // at 10:35
	 *   run: () => { // simple function
	 *     sails.log.info('[everyDay] this job runs once a day.');
	 *   }
	 *  }
	 *
	 */

};
