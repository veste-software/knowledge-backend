// src/plugins/cron-manager/server/controllers/cron-manager.js
module.exports = {
  getCronJobs: async (ctx) => {
    const cronJobs = strapi.config.functions.cronManager.getCronJobs();
    ctx.send(cronJobs);
  },

  enableCron: async (ctx) => {
    const { cronJobKey } = ctx.request.body;
    const message = strapi.config.functions.cronManager.enableCron(cronJobKey);
    ctx.send({ message });
  },

  disableCron: async (ctx) => {
    const { cronJobKey } = ctx.request.body;
    const message = strapi.config.functions.cronManager.disableCron(cronJobKey);
    ctx.send({ message });
  },
};
