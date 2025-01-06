module.exports = [
  'strapi::errors',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "frame-src": [
             "http://localhost:*",
             "self",
             "sandbox.embed.apollographql.com",
             "https://www.youtube.com/"
           ],
          "default-src": ["'self'"],
        },
      },
    },
  },
  {
    name: "strapi::body",
    config: {
      jsonLimit: "256mb",
      formLimit: "256mb",
      textLimit: "256mb",
      formidable: { maxFileSize: 200 * 1024 * 1024, },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
