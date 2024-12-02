import { createPlugin } from '@strapi/helper-plugin';
import CronManager from './pages/CronManager';

export default createPlugin({
  id: 'cron-manager',
  isReady: true,
  mainComponent: CronManager,
  name: 'Cron Manager',
  description: 'Manage Cron Jobs',
  icon: 'clock',
  menu: {
    type: 'admin', // This places the menu under the admin UI
    name: 'Cron Manager', // Name of the menu item
    icon: 'clock', // You can use a clock icon or any other
    to: '/settings/cron-manager', // Route path for this plugin
  },
  // Register the route explicitly so it works
  routes: [
    {
      method: 'GET',
      path: '/settings/cron-manager', // Path for the route
      handler: 'CronManager.index', // The handler will call the CronManager page
      config: {
        policies: [],
      },
    },
  ],
});
