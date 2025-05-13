const { updateEmbelishCE } = require('../src/cronjobs/updateEmbelishCE.ts');
const { populateRelations } = require('../src/cronjobs/populate_relations_userseu_ce.ts');
const https = require('https');
const S2_API_KEY = 'TPryTJ9m838pMjkp7iWKy5wlJQNSulHd3mXTLAuC';

// Function to fetch data from a given URL
function fetchData(url, method = 'GET', payload = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': S2_API_KEY,
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error.message);
      reject(error);
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}

// Helper function to shuffle an array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Main cron job
module.exports = {
  syncCopyrightEvidence: {
    task: async ({ strapi }) => {
      console.log('Starting cron job "syncCopyrightEvidence"');
      strapi.log.info('Starting cron job "syncCopyrightEvidence"');

      // waiting for
    },
    options: {
      start: true,
      cron: '0 0 * * *', // Run every hour
    },
  },
  populateRelationsCE_CU: {
    task: async ({ strapi }) => {
      console.log('Starting cron job "populateRelationsCE_CU"');
      strapi.log.info('Starting cron job "populateRelationsCE_CU"');
//      await populateRelations(strapi);
    },
    options: {
      start: true,
      cron: '0 0 * * *', // Run every hour
    },
  },
  updateEmbelishCE: {
    task: async ({ strapi }) => {
      console.log('Starting disabled update cron job "updateEmbelishCE"');
      strapi.log.info('Starting disabled update cron job "updateEmbelishCE"');
      // await updateEmbelishCE(strapi);
    },
    options: {
      start: true,
      cron: '0 0 * * *', // Run every hour
    },
  },
};

// Function to create or update suggestions in Strapi
async function writeOrUpdateOrNothing(embellishedEntry, suggestions_list, embellished_list, strapi) {
  const { paperId } = embellishedEntry;

  if (!paperId || embellished_list.some((entry) => entry.paperId === paperId)) return;

  if (paperId && !suggestions_list.some((suggestion) => suggestion.paperId === paperId)) {
    await strapi.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence').create({
      data: { ...embellishedEntry, suggestionCount: 1 },
    });
  } else {
    const existingSuggestion = suggestions_list.find((suggestion) => suggestion.paperId === paperId);
    if (existingSuggestion && existingSuggestion.approved !== false) {
      await strapi.entityService.update(
        'api::suggestions-copyright-evidence.suggestions-copyright-evidence',
        existingSuggestion.id,
        { data: { suggestionCount: existingSuggestion.suggestionCount + 1 } }
      );
    }
  }
}
