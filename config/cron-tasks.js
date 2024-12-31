const { updateEmbelishCE } = require('../src/cronjobs/updateEmbelishCE.ts');

const https = require('https');
const S2_API_KEY = 'EEnArnIbFz7UyomYkXSJf8KnAOiBmqQc41oZnjpH';

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

// waiting for API key
//      try {
//        // Step 1: Fetch records from Strapi collections
//        const suggestions_list = await strapi.db.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence').findMany();
//        const embellished_list = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').findMany();
//
//        // Step 2: Create an array of all paperIds from embellished_list and shuffle
//        const allPaperIds = embellished_list.filter((entry) => entry.paperId).map((entry) => entry.paperId);
//        const randomizedPaperIds = shuffleArray(allPaperIds);
//
//        // Step 3: Iterate through paperIds and process recommendations
//        for (let i = 0; i < randomizedPaperIds.length; i += 20) {
//          const myPositivePaperIds = randomizedPaperIds.slice(i, i + 20);
//
//          const apiUrl = 'https://api.semanticscholar.org/recommendations/v1/papers/?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=50';
//          const payload = { positivePaperIds: myPositivePaperIds };
//
//          console.debug('Posting to Semantic Scholar API with payload:', payload);
//          const recommendationResponse = await fetchData(apiUrl, 'POST', payload);
//
//          if (Array.isArray(recommendationResponse.recommendedPapers)) {
//            for (const recommendation of recommendationResponse.recommendedPapers) {
//              await writeOrUpdateOrNothing(recommendation, suggestions_list, embellished_list, strapi);
//            }
//          } else {
//      console.debug("recommendationResponse", recommendationResponse);
//            console.error('Invalid response format from Semantic Scholar API.');
//          }
//        }
//      } catch (error) {
//      console.debug("recommendationResponse", recommendationResponse);
//        console.error('Error in cron job "syncCopyrightEvidence":', error.message);
//      }
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
//      await updateEmbelishCE(strapi);

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
