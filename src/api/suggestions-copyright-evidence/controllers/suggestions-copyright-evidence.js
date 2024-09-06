'use strict';

/**
 * suggestions-copyright-evidence controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const myController = createCoreController('api::suggestions-copyright-evidence.suggestions-copyright-evidence');

// Assuming your module.exports is an object with functions
//myController.update = async (ctx) => {
//    const { id } = ctx.params;
//    const { approved } = ctx.request.body;
//
//      console.log(`Updating ${id}`,  ctx.request.body);
//
//    // Check if the entry being updated is the one with API ID "suggestions-copyright-evidence"
//    if (id === 'suggestions-copyright-evidence' && approved !== undefined) {
//      // Perform actions before the update
//      console.log(`Updating approved status for suggestions-copyright-evidence to ${approved}`);
//    }
//
//    // Call the default update controller action
//    const result = await strapi.controllers['suggestions-copyright-evidence'].update(ctx);
//
//    // Check if the entry being updated is the one with API ID "suggestions-copyright-evidence"
//    if (id === 'suggestions-copyright-evidence' && approved !== undefined) {
//      // Perform actions after the update
//      console.log(`Approved status for suggestions-copyright-evidence has been updated to ${approved}`);
//    }
//
//    return result;
//}

module.exports = myController;
//// ./api/suggestions-copyright-evidence/controllers/SuggestionsCopyrightEvidence.js
//module.exports = {
//  async find(ctx) {
//    // Your logic for handling the find action
//    const entities = await strapi.services['suggestions-copyright-evidence'].find(ctx.query);
//    return entities.map(entity => strapi.transformMongooseEntity(entity, { model: 'suggestions-copyright-evidence' }));
//  },
//
//  async findOne(ctx) {
//    const { id } = ctx.params;
//    // Your logic for handling the findOne action
//    const entity = await strapi.services['suggestions-copyright-evidence'].findOne({ id });
//    return strapi.transformMongooseEntity(entity, { model: 'suggestions-copyright-evidence' });
//  },
//
//  async update(ctx) {
//    const { id } = ctx.params;
//    const { approved } = ctx.request.body;
//
//    // Check if the entry being updated is the one with API ID "suggestions-copyright-evidence"
//    if (id === 'suggestions-copyright-evidence' && approved !== undefined) {
//      // Perform actions before the update
//      console.log(`Updating approved status for suggestions-copyright-evidence to ${approved}`);
//    }
//
//    // Call the default update controller action
//    const result = await strapi.controllers['suggestions-copyright-evidence'].update(ctx);
//
//    // Check if the entry being updated is the one with API ID "suggestions-copyright-evidence"
//    if (id === 'suggestions-copyright-evidence' && approved !== undefined) {
//      // Perform actions after the update
//      console.log(`Approved status for suggestions-copyright-evidence has been updated to ${approved}`);
//    }
//
//    return result;
//  },
//};
