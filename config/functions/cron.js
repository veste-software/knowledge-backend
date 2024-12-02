// ./config/functions/cron.js
module.exports = {
  '*/5 * * * *': {
    task: async () => {
      console.log('Cron job running every 5 minutes');
      // Your task logic here
    },
  },
  '0 0 * * *': {
    task: async () => {
      console.log('Cron job running daily at midnight');
      // Your task logic here
    },
  },
};
