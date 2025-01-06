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
      jsonLimit: "30mb",
      formLimit: "30mb",
      textLimit: "30mb",
      formidable: { maxFileSize: 30 * 1024 * 1024, },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
