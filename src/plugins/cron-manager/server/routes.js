// src/plugins/cron-manager/server/routes.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cron-manager/cron-jobs',
      handler: 'cron-manager.getCronJobs',
    },
    {
      method: 'POST',
      path: '/cron-manager/enableCron',
      handler: 'cron-manager.enableCron',
    },
    {
      method: 'POST',
      path: '/cron-manager/disableCron',
      handler: 'cron-manager.disableCron',
    },
  ],
};
