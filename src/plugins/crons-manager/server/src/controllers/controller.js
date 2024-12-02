const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('crons-manager')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  getCronJobs: async (ctx) => {
        ctx.body = strapi
              .plugin('crons-manager')
              .service('service').getCronJobs();
      },

      enableCron: async (ctx) => {
        ctx.body = strapi
              .plugin('crons-manager')
              .service('service').enableCron();
      },

      disableCron: async (ctx) => {
        ctx.body = strapi
              .plugin('crons-manager')
              .service('service').disableCron();

      }
});

export default controller;
