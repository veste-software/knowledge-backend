import { jsxs, jsx } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@strapi/design-system";
const CronManager = () => {
  const [cronJobs, setCronJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCronJobs = async () => {
      const response = await fetch("/admin/plugins/crons-manager/cron-jobs");
      const data = await response.json();
      setCronJobs(data);
      setIsLoading(false);
    };
    fetchCronJobs();
  }, []);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("span", { variant: "alpha", children: "Manage Cron Jobs" }),
    isLoading ? /* @__PURE__ */ jsx("span", { children: "Loading..." }) : /* @__PURE__ */ jsx("ul", { children: cronJobs.map((job) => /* @__PURE__ */ jsxs("li", { children: [
      job.key,
      " - ",
      job.status,
      /* @__PURE__ */ jsx(Button, { children: "Enable" }),
      /* @__PURE__ */ jsx(Button, { children: "Disable" })
    ] }, job.key)) })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(CronManager, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
