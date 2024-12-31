'use strict';

/**
 * knowledge-graph service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::knowledge-graph.knowledge-graph');
