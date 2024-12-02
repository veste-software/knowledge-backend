export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
        method: 'GET',
        path: '/cron-jobs',
        handler: 'controller.index',
      },
      {
        method: 'POST',
        path: '/enableCron',
        handler: 'controller.enableCron',
      },
      {
        method: 'POST',
        path: '/disableCron',
        handler: 'controller.disableCron',
      },
];
