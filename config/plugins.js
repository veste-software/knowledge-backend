module.exports = {
  "strapi-plugin-entity-relationship-chart": {
    enabled: false,
  },
//   'cron-manager': {
//      enabled: true,
//      resolve: './src/plugins/cron-manager',
//    },
//   'crons-manager': {
//      enabled: true,
//      resolve: './src/plugins/crons-manager',
//    },
  'strapi-plugin-cron': {
    enabled: false,
//    resolve: './src/plugins/strapi-plugin-cron',
  },
   'import-export-entries': {
      enabled: false,
      config: {
        // See `Config` section.
      },
    },
//  email: {
//      config: {
//        provider: 'nodemailer',
//        providerOptions: {
//          host: 'smtp.gmail.com',
//          port: 465,
//          auth: {
//            user: 'gmail_username',
//            pass: 'gmail_password',
//          },
//        },
//        settings: {
//          defaultFrom: 'dietmar.aumann@gmail.com',
//          defaultReplyTo: 'dietmar.aumann@gmail.com',
//          testAddress: 'dietmar.aumann@gmail.com',
//        },
//      },
//    },
  "apollo-sandbox": {
    // enables the plugin only in development mode
    // if you also want to use it in production, set this to true
    // keep in mind that graphql playground has to be enabled
    enabled: false,
    config: {
      // endpoint: "https://tunneled-strapi.com/graphql", // OPTIONAL - endpoint has to be accessible from the browser
    }
  },
   "entity-relationship-chart": {
      enabled: false,
      config: {
        // By default all contentTypes and components are included.
        // To exlclude strapi's internal models, use:
        exclude: [
          "strapi::core-store",
          "webhook",
          "admin::permission",
          "admin::user",
          "admin::role",
          "admin::api-token",
          "plugin::upload.file",
          "plugin::i18n.locale",
          "plugin::users-permissions.permission",
          "plugin::users-permissions.role",
        ],
      },
    },
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
};

