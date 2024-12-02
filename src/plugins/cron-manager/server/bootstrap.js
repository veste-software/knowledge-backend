// src/plugins/cron-manager/server/bootstrap.js
const cron = require('node-cron'); // Ensure node-cron is installed

module.exports = ({ strapi }) => {
  // Load cron jobs from config
  const cronJobsConfig = require('../../../config/functions/cron.js');
  const cronJobs = {};

  // Create cron job instances (they are initially stopped)
  Object.keys(cronJobsConfig).forEach((key) => {
    cronJobs[key] = cron.schedule(key, cronJobsConfig[key].task, { scheduled: false });
  });

  // Enable or disable a cron job
  strapi.config.functions.cronManager = {
    enableCron: (cronJobKey) => {
      if (cronJobs[cronJobKey]) {
        cronJobs[cronJobKey].start();
        return 'Cron job enabled and started';
      }
      return 'Cron job not found';
    },
    disableCron: (cronJobKey) => {
      if (cronJobs[cronJobKey]) {
        cronJobs[cronJobKey].stop();
        return 'Cron job disabled';
      }
      return 'Cron job not found';
    },
    getCronJobs: () => {
      return Object.keys(cronJobs).map((key) => ({
        key,
        status: cronJobs[key].getStatus() === 'running' ? 'running' : 'stopped',
      }));
    }
  };
};
