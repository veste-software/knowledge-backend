/**
 * This file was automatically generated by Strapi.
 * Any modifications made will be discarded.
 */
import graphql from "@strapi/plugin-graphql/strapi-admin";
import usersPermissions from "@strapi/plugin-users-permissions/strapi-admin";
import strapiImportExport from "strapi-import-export/strapi-admin";
import cronsManager from "../../src/plugins/crons-manager/./dist/admin/index.mjs";
import { renderAdmin } from "@strapi/strapi/admin";

import customisations from "../../src/admin/app.js";

renderAdmin(document.getElementById("strapi"), {
  customisations,

  plugins: {
    graphql: graphql,
    "users-permissions": usersPermissions,
    "strapi-import-export": strapiImportExport,
    "crons-manager": cronsManager,
  },
});
