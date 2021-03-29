const CronJob = require('cron').CronJob;

class Cron {
  addJob(schedule = '* * * * *', job = function() {}) {
    this.job = new CronJob(schedule, job);
    return this;
  }

  start() {
    this.job.start();
  }

  stop() {
    this.job.stop();
  }
}

module.exports = new Cron();
