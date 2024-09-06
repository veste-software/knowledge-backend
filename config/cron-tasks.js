module.exports = {
  syncCopyrightEvidence: {
    task: async ({strapi}) => {
      const count = 0;
      console.log(`Starting cron syncCopyrightEvidence`);
      strapi.log.info(`Starting cron syncCopyrightEvidence`);

      try {
//          await strapi.plugins.email.services.email.send({
//            to: 'dietmar.aumann@gmail.com',
//            from: 'info@veste-software.de',
//            subject: 'Cron Job',
//            text: `Synced ${count} evidence`,
//            html: `Synced ${count} evidence`
//          });
        } catch (err) {
          console.log(err);
        }
    },
    options: {
      start: true, // Start task immediately
      // run every day
      // cron: '0 0 * * * *',

    }
  }
}
