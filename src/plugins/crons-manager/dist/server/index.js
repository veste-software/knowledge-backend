"use strict";
const cron = require("node-cron");
const path = require("path");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const cron__default = /* @__PURE__ */ _interopDefault(cron);
const path__default = /* @__PURE__ */ _interopDefault(path);
const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("crons-manager").service("service").getWelcomeMessage();
  },
  getCronJobs: async (ctx) => {
    ctx.body = strapi.plugin("crons-manager").service("service").getCronJobs();
  },
  enableCron: async (ctx) => {
    ctx.body = strapi.plugin("crons-manager").service("service").enableCron();
  },
  disableCron: async (ctx) => {
    ctx.body = strapi.plugin("crons-manager").service("service").disableCron();
  }
});
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const routes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  },
  {
    method: "GET",
    path: "/cron-jobs",
    handler: "controller.index"
  },
  {
    method: "POST",
    path: "/enableCron",
    handler: "controller.enableCron"
  },
  {
    method: "POST",
    path: "/disableCron",
    handler: "controller.disableCron"
  }
];
const cronJobsConfigPath = path__default.default.resolve(__dirname, "../../../../../config/functions/cron.js");
let cronJobsConfig;
try {
  cronJobsConfig = require(cronJobsConfigPath);
} catch (error) {
  console.error(`Error loading cron configuration from ${cronJobsConfigPath}:`, error);
  cronJobsConfig = {};
}
const cronJobs = {};
Object.keys(cronJobsConfig).forEach((key) => {
  cronJobs[key] = cron__default.default.schedule(
    key,
    cronJobsConfig[key].task,
    { scheduled: false }
    // Jobs are not started automatically
  );
});
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },
  enableCron: (cronJobKey) => {
    if (cronJobs[cronJobKey]) {
      cronJobs[cronJobKey].start();
      return `Cron job "${cronJobKey}" enabled and started.`;
    }
    return `Cron job "${cronJobKey}" not found.`;
  },
  disableCron: (cronJobKey) => {
    if (cronJobs[cronJobKey]) {
      cronJobs[cronJobKey].stop();
      return `Cron job "${cronJobKey}" disabled.`;
    }
    return `Cron job "${cronJobKey}" not found.`;
  },
  getCronJobs: () => {
    return Object.keys(cronJobs).map((key) => ({
      key,
      status: cronJobs[key]?.getStatus() === "running" ? "running" : "stopped"
    }));
  }
});
const services = {
  service
};
const index = {
  bootstrap,
  destroy,
  register,
  config,
  controllers,
  contentTypes,
  middlewares,
  policies,
  routes,
  services
};
module.exports = index;
