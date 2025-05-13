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
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Invalid JSON response from Semantic Scholar'));
        }
      });
    });

    req.on('error', (error) => {
      console.error('HTTP request error:', error.message);
      reject(error);
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }

    req.end();
  });
}

// Query records from Strapi
async function fetchStrapiData(collection) {
  try {
    return await strapi.db.query(collection).findMany();
  } catch (error) {
    console.error(`Error fetching data from ${collection}:`, error.message);
    return [];
  }
}

// Helper to shuffle an array
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Fetch individual paper recommendations
async function fetchPaperData(paperId) {
  const apiUrl = `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/${paperId}?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=3`;

  try {
    const response = await fetchData(apiUrl);
    return response.recommendedPapers || [];
  } catch (error) {
    console.error(`Error fetching recommendations for paper ${paperId}:`, error.message);
    return [];
  }
}

// Core write/update logic
async function writeOrUpdateOrNothing(entry, suggestions_list, embellished_list) {
  const { paperId } = entry;
  if (!paperId) return;

  // Skip if already in embellished evidence
  if (embellished_list.some((e) => e.paperId === paperId)) return;

  const existing = suggestions_list.find((s) => s.paperId === paperId);

  if (!existing) {
    // Create new suggestion
    try {
      await strapi.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence').create({
        data: { ...entry, suggestionCount: 1 },
      });
      console.log(`Created new suggestion for paperId: ${paperId}`);
    } catch (err) {
      console.error(`Failed to create suggestion for ${paperId}:`, err.message);
    }
  } else if (existing.approved !== false) {
    // Update suggestion count
    try {
      await strapi.entityService.update(
        'api::suggestions-copyright-evidence.suggestions-copyright-evidence',
        existing.id,
        {
          data: { suggestionCount: existing.suggestionCount + 1 },
        }
      );
      console.log(`Updated suggestion count for paperId: ${paperId}`);
    } catch (err) {
      console.error(`Failed to update suggestion for ${paperId}:`, err.message);
    }
  }
}

// Main cron job function
async function recommendCE() {
  console.log('⏳ Running cron job: recommendCE');

  const suggestions_list = await fetchStrapiData('api::suggestions-copyright-evidence.suggestions-copyright-evidence');
  const embellished_list = await fetchStrapiData('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence');

  const allPaperIds = embellished_list
    .filter((entry) => entry.paperId)
    .map((entry) => entry.paperId);

  const randomizedPaperIds = shuffleArray(allPaperIds);

  // Individual paper recommendations
  for (let paperId of randomizedPaperIds) {
    const paperRecs = await fetchPaperData(paperId);
    for (const recommendation of paperRecs) {
      await writeOrUpdateOrNothing(recommendation, suggestions_list, embellished_list);
    }
  }

  // Batch recommendation query (20 at a time)
  for (let i = 0; i < randomizedPaperIds.length; i += 20) {
    const paperBatch = randomizedPaperIds.slice(i, i + 20);
    const apiUrl =
      'https://api.semanticscholar.org/recommendations/v1/papers/?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=50';
    const payload = { positivePaperIds: paperBatch };

    console.debug('🔍 Sending batch request for papers:', paperBatch);

    try {
      const response = await fetchData(apiUrl, 'POST', payload);
      const recommendations = response.recommendedPapers || [];

      for (const rec of recommendations) {
        await writeOrUpdateOrNothing(rec, suggestions_list, embellished_list);
      }
    } catch (err) {
      console.error('Batch request failed:', err.message);
    }
  }

  console.log('✅ Cron job "recommendCE" completed.');
}

module.exports = { recommendCE };
