async function populateRelations(strapi) {
  const topicMappings = {
    "PROTECTED WORKS": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Originality", "subject matter", "fixation", "types of work"] },
    "ECONOMIC RIGHTS": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Exclusive rights", "reproduction", "distribution", "rental", "communication to the public", "adaptation", "public performance", "exhaustion"] },
    "RELATED RIGHTS": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Performers’ rights", "database"] },
    "MORAL RIGHTS": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Integrity", "paternity", "attribution"] },
    "AUTHORS AND OWNERS": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Authorship", "ownership", "computer-generated work"] },
    "COPYRIGHT DURATION": { "policy_issue": "A. Nature and Scope of exclusive rights (hyperlinking/browsing; reproduction right)", "keywords": ["Public domain", "copyright term"] },
    "THE PUBLIC DOMAIN": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "(COPYRIGHT EXCEPTIONS)": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "MANDATORY EXCEPTIONS": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "OPTIONAL EXCEPTIONS": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "CONTRACTS AND TPMS": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "ONLINE INTERMEDIARIES": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "MASS DIGITISATION AND ORPHAN WORKS": { "policy_issue": "B. Exceptions (distinguish innovation and public policy purposes; open-ended/closed list; commercial/non-commercial distinction)", "keywords": [] },
    "ORPHAN WORKS": { "policy_issue": "C. Mass digitisation/orphan works (non-use; extended collective licensing)", "keywords": [] },
    "OUT OF COMMERCE WORKS": { "policy_issue": "C. Mass digitisation/orphan works (non-use; extended collective licensing)", "keywords": [] },
    "GETTING PERMISSION": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "GIVING PERMISSION": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "COLLECTING SOCIETIES": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "AUTHORS AND OWNERS (FAIR REMUNERATION)": { "policy_issue": "E. Fair remuneration (levies; copyright contracts)", "keywords": [] },
    "GIVING PERMISSION (FAIR REMUNERATION)": { "policy_issue": "E. Fair remuneration (levies; copyright contracts)", "keywords": [] },
    "COLLECTING SOCIETIES (FAIR REMUNERATION)": { "policy_issue": "E. Fair remuneration (levies; copyright contracts)", "keywords": [] },
    "ONLINE INTERMEDIARIES (FAIR REMUNERATION)": { "policy_issue": "E. Fair remuneration (levies; copyright contracts)", "keywords": [] },
    "CONTRACTS AND TPMS (ENFORCEMENT)": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "(ENFORCEMENT)": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "PRIVATE ENFORCEMENT": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "ONLINE INTERMEDIARIES (ENFORCEMENT)": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] },
    "PUBLIC ENFORCEMENT": { "policy_issue": "D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)", "keywords": [] }
  };

  async function updateRelationFields() {
    // Fetch all records from the collections
    const copyrightUsers = await strapi.db.query('api::copyright-user-eu.copyright-user-eu').findMany();
    const copyrightEvidences = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').findMany();
//
//    console.debug("copyrightUsers length", copyrightUsers.length);
//    console.debug("copyrightEvidences length", copyrightEvidences.length);

    // Iterate through each user and update relationships based on topicMappings
    for (const user of copyrightUsers) {
      const topic = user.category.toUpperCase();
      console.log("topic", topic);
      const mapping = topicMappings[topic];

      if (mapping) {
        const { policy_issue, keywords } = mapping;
        console.log("policy_issue", policy_issue, keywords);
        const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());

        // Find matching evidence records based on EvidenceBasedPolicy and abstract includes any of the keywords (case insensitive)
        const matchingEvidences = copyrightEvidences.filter(evidence => {
          const abstract = (evidence.abstract || "").toLowerCase();
          const matchesPolicy = Array.isArray(evidence.EvidenceBasedPolicy) && evidence.EvidenceBasedPolicy.includes(policy_issue);
//          console.debug("matchesPolicy", matchesPolicy, evidence.EvidenceBasedPolicy, policy_issue);
          const matchesKeywords = lowerKeywords.some(keyword => abstract.includes(keyword));
          return matchesPolicy && matchesKeywords;
        });

//        console.debug("matchingEvidences length", matchingEvidences.length);

        // If no keyword matches the policy, just add 3 that match the policy
        const relatedEvidences = matchingEvidences.length > 0 ? matchingEvidences :
          copyrightEvidences.filter(evidence => Array.isArray(evidence.EvidenceBasedPolicy) && evidence.EvidenceBasedPolicy.includes(policy_issue)).slice(0, 10);

        const relatedEvidenceIds = relatedEvidences.map(evidence => evidence.id);

        // Fetch current relations
        const currentRelations = user.data_embellished_copyright_evidences || [];
        console.log("currentRelations", currentRelations);

        // Merge and remove duplicates
        const updatedRelations = Array.from(new Set([...currentRelations, ...relatedEvidenceIds]));

        // Update the CopyrightUser.EU record
        await strapi.db.query('api::copyright-user-eu.copyright-user-eu').update({
          where: { id: user.id },
          data: {
            data_embellished_copyright_evidences: updatedRelations
          }
        });

//        console.log(updatedRelations.length);
        // Update the related CopyrightEvidence records
        for (const evidenceId of relatedEvidenceIds) {
          const evidence = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').findOne({
            where: { id: evidenceId },
            populate: ['copyright_user_eus']
          });

          const currentUserEus = evidence.copyright_user_eus.map(eu => eu.id);
          const updatedUserEus = Array.from(new Set([...currentUserEus, user.id]));

          console.debug(updatedUserEus, "updatedUserEus", "evidenceId", evidenceId);

          const result = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').update({
            where: { id: evidenceId },
            data: {
              copyright_user_eus: updatedUserEus
            }
          });

//          console.log("Update result:", result);
        }
      }
    }

    console.log('Relationship fields have been updated.');
  }

  // Call the function to update relation fields
  await updateRelationFields();
}

module.exports = { populateRelations };
