import cron from 'node-cron'; // Ensure node-cron is installed
import path from 'path';

const cronJobsConfigPath = path.resolve(__dirname, '../../../../../config/functions/cron.js');
let cronJobsConfig;

try {
  cronJobsConfig = require(cronJobsConfigPath); // Load the cron configuration dynamically
} catch (error) {
  console.error(`Error loading cron configuration from ${cronJobsConfigPath}:`, error);
  cronJobsConfig = {}; // Default to an empty configuration if there's an error
}

const cronJobs = {};

// Create cron job instances (initially stopped)
Object.keys(cronJobsConfig).forEach((key) => {
  cronJobs[key] = cron.schedule(
    key,
    cronJobsConfig[key].task,
    { scheduled: false } // Jobs are not started automatically
  );
});

const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },

  enableCron: (cronJobKey) => {
    if (cronJobs[cronJobKey]) {
      cronJobs[cronJobKey].start();
      return `Cron job "${cronJobKey}" enabled and started.`;
    }
    return `Cron job "${cronJobKey}" not found.`;
  },

  disableCron: (cronJobKey) => {
    if (cronJobs[cronJobKey]) {
      cronJobs[cronJobKey].stop();
      return `Cron job "${cronJobKey}" disabled.`;
    }
    return `Cron job "${cronJobKey}" not found.`;
  },

  getCronJobs: () => {
    return Object.keys(cronJobs).map((key) => ({
      key,
      status: cronJobs[key]?.getStatus() === 'running' ? 'running' : 'stopped',
    }));
  },
});

export default service;
