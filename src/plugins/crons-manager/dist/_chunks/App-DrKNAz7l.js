"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const react = require("react");
const designSystem = require("@strapi/design-system");
const CronManager = () => {
  const [cronJobs, setCronJobs] = react.useState([]);
  const [isLoading, setIsLoading] = react.useState(true);
  react.useEffect(() => {
    const fetchCronJobs = async () => {
      const response = await fetch("/admin/plugins/crons-manager/cron-jobs");
      const data = await response.json();
      setCronJobs(data);
      setIsLoading(false);
    };
    fetchCronJobs();
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { variant: "alpha", children: "Manage Cron Jobs" }),
    isLoading ? /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Loading..." }) : /* @__PURE__ */ jsxRuntime.jsx("ul", { children: cronJobs.map((job) => /* @__PURE__ */ jsxRuntime.jsxs("li", { children: [
      job.key,
      " - ",
      job.status,
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { children: "Enable" }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { children: "Disable" })
    ] }, job.key)) })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(CronManager, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
exports.App = App;
