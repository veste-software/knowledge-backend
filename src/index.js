'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.ff
   *
   * This gives you an opportunity to extend code.
   */
  register( full) {
//  console.log('hi',full);
//  console.log('hi',full.strapi.server.router.routes());
//    const indexRoute = full.strapi.server.router.routes.find(({ index }) => index);
//    if (!indexRoute) throw new Error('unable to find index page');
//    indexRoute.lazy = async () => {
//      const { App } = await import('./pages/App');
//      return { Component: App };
//    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};


/* working:

'use strict';

module.exports = {
  register({ strapi }) {
    strapi.server.use(async (ctx, next) => {
      if (ctx.request.path === '/admin') {
//        const { App } = await import('./pages/App.js');
        ctx.body = 'hi';
      } else {
        await next();
      }
    });
  },

  async bootstrap({ strapi }) {
    // Your bootstrap logic here
  },
};


*/
