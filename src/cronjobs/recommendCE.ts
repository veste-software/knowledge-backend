const https = require('https');
//const Strapi = require('strapi-sdk-javascript');

const S2_API_KEY = 'TPryTJ9m838pMjkp7iWKy5wlJQNSulHd3mXTLAuC';
//const strapi = new Strapi('http://localhost:1337'); // Update with your Strapi instance URL

// Function to fetch data from a given URL
function fetchData(url, method = 'GET', payload = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add your Semantic Scholar API key here
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
    console.debug('Error:', error.message);
      reject(error);
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}


// Function to query and fetch records from Strapi
async function fetchStrapiData(collection) {
  try {
    const data = await strapi.db.query(collection).findMany();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${collection}:`, error.message);
    return null;
  }
}

// Function to create or update suggestions in Strapi
//async function handleSuggestions(suggestions_list, embellished_list) {
//  for (const embellishedEntry of embellished_list) {
//    const { paperId } = embellishedEntry;
//
//    if (paperId && !suggestions_list.some((suggestion) => suggestion.paperId === paperId)) {
//      // Check if paperId doesn't exist in suggestions_list, create a new suggestion
//      await strapi.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence').create({
//        data: { paperId, suggestionCount: 1 },
//      });
//    } else {
//      // PaperId exists in suggestions_list, find the suggestion and update suggestionCount
//      const existingSuggestion = suggestions_list.find((suggestion) => suggestion.paperId === paperId);
//      if (existingSuggestion && existingSuggestion.approved !== false) {
//      console.debug('Updating suggestion:', existingSuggestion);
//        await strapi.entityService.update('api::suggestions-copyright-evidence.suggestions-copyright-evidence', existingSuggestion.id,
//           {data: { suggestionCount: existingSuggestion.suggestionCount + 1 } }
//        );
//      }
//    }
//  }
//}

// Main function
async function recommendCE() {

console.log('Executing cron job "recommendCE"');
  // Step 1: Fetch records from 'api::suggestions-copyright-evidence.suggestions-copyright-evidence'
  const suggestions_list = await fetchStrapiData('api::suggestions-copyright-evidence.suggestions-copyright-evidence');

  // Step 2: Fetch records from 'api::data-embellished-copyright-evidence.data-embellished-copyright-evidence'
  const embellished_list = await fetchStrapiData('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence');

  // Step 3: Handle suggestions based on embellished_list
//  await handleSuggestions(suggestions_list, embellished_list);

  // Step 4: Create an array of all paperIds from embellished_list and randomize the order
  const allPaperIds = embellished_list.filter((entry) => entry.paperId).map((entry) => entry.paperId);
  const randomizedPaperIds = shuffleArray(allPaperIds);



   for (let j = 0; j < randomizedPaperIds.length; j++) {
       // Step 6: Fetch data for each positive paperId
       const positivePaperId = randomizedPaperIds[j];
       const paperRecs = await fetchPaperData(positivePaperId);

        // Check if paperRecs is an array before iterating
         // Handle the paperData as needed

         // iterate over paperRecs
          for (const recommendation of paperRecs) {
            await writeOrUpdateOrNothing(recommendation, suggestions_list, embellished_list);
          }
        // Handle each recommendation as needed


   }

  // Step 5: Iterate through the randomizedPaperIds with a step of 20
  for (let i = 0; i < randomizedPaperIds.length; i += 20) {
    // Create an array of the next 20 paperIds
    const myPositivePaperIds = randomizedPaperIds.slice(i, i + 20);


    // Step 6: Post to Semantic Scholar API with positivePaperIds payload
    const apiUrl = 'https://api.semanticscholar.org/recommendations/v1/papers/?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=50';
    const payload = { positivePaperIds: myPositivePaperIds };

    console.debug('Posting to Semantic Scholar API with payload:', payload);
    const recommendationResponse = await fetchData(apiUrl, 'POST', payload);
    const recommendations = recommendationResponse.recommendedPapers;

    // Check if recommendations is an array before iterating
    if (Array.isArray(recommendations)) {
      for (const recommendation of recommendations) {
        // Handle each recommendation as needed
        await writeOrUpdateOrNothing(recommendation, suggestions_list, embellished_list);
        console.log('Handling recommendation:', recommendation);
      }
    } else {
      console.error('Invalid response format. Expected an array of recommendations.');
    }
  }
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


// Function to fetch data for a specific paperId from Semantic Scholar API
async function fetchPaperData(paperId) {
  const apiUrl = `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/${paperId}?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=3`;

  try {
    const response = await fetchData(apiUrl);
    return response.recommendedPapers || [];
  } catch (error) {
    console.error('Error fetching paper data:', error.message);
    return [];
  }
}

async function writeOrUpdateOrNothing(embellishedEntry, suggestions_list, embellished_list) {
    const { paperId } = embellishedEntry;

    // if already in embellished_list, return
    if (!paperId || embellished_list.some((suggestion) => suggestion.paperId === paperId)) {
        return;
    }

    if (paperId && !suggestions_list.some((suggestion) => suggestion.paperId === paperId)) {
      // Check if paperId doesn't exist in suggestions_list, create a new suggestion
      await strapi.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence').create({
        data: { ...embellishedEntry, suggestionCount: 1 },
      });
    } else {
      // PaperId exists in suggestions_list, find the suggestion and update suggestionCount
      const existingSuggestion = suggestions_list.find((suggestion) => suggestion.paperId === paperId);
      if (existingSuggestion && existingSuggestion.approved !== false) {
      console.debug('Updating suggestion:', suggestions_list, existingSuggestion);
        await strapi.documents('api::suggestions-copyright-evidence.suggestions-copyright-evidence').update({
          documentId: "__TODO__",
          data: { suggestionCount: existingSuggestion.suggestionCount + 1 }
        });
      }
    }
  }

// Run the main function
//main();

module.exports = { recommendCE };
