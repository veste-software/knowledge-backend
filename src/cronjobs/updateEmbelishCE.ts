const https = require('https');
const S2_API_KEY = 'TPryTJ9m838pMjkp7iWKy5wlJQNSulHd3mXTLAuC';

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function fetchSemanticScholarData(title) {
  const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
    title
  )}&fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=1`;

  const options = {
    headers: {
      'x-api-key': S2_API_KEY,
    },
  };

  try {
    const response = await fetchData(apiUrl);
    if (response.data && response.data[0]) {
      strapi.log.info('[X] Found Semantic Scholar data for title ' + title + ' with semantic title ' +  response.data[0].title);
    } else {
      strapi.log.info('[-] No Semantic Scholar data found for title ' + title);
    }
    return response.data ? response.data[0] : null;
  } catch (error) {
    strapi.log.error('Error fetching Semantic Scholar data:', error.message);
    return null;
  }
}

async function updateEmbelishCE(strapi) {
  try {
    // Fetch base data from the Strapi collection
    const baseECData = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').findMany();

    // Fetch base data from external source
    const baseSourceDataUrl =
      'https://www.copyrightevidence.org/wiki/api.php?action=ask&query=[[Category:Studies]]%20|?Has%20title=Title|?Has%20reference%20to=references|?Has%20relationship%20with%20evidence%20based%20policy=EvidenceBasedPolicy|?Has%20industry=industry|?Has%20hyperlink=hyperlink|?has%20country=Country|?Has%20method%20of%20analysis=MethodOfAnalysis|?Has%20method%20of%20collection=MethodOfCollections|?Is%20titled=id|?Was%20published%20in%20year=Year|?Was%20written%20by=Author|format=table%20|limit=1000%20|offset=0&format=json&prop=info';

    const baseData = await fetchData(baseSourceDataUrl);

    if (!baseData || !baseData.query || !baseData.query.results) {
      strapi.log.error('Error fetching base data.');
      return;
    }

    const updatedResultObject = {};
    const ceTitles = baseECData.map(item => item.CE_Title);
    const dataEntries = Object.entries(baseData.query.results);

    strapi.log.info(`Processing ${dataEntries.length} base copyright evidence records.`);

    for (const [id, item] of dataEntries) {
      const CE_Title = item.printouts.Title[0];
      const Country = (item.printouts.Country[0] || {}).fulltext;
      const Industry = (item.printouts.industry || []).map(industry => industry.fulltext);
      const EvidenceBasedPolicy = (item.printouts.EvidenceBasedPolicy || []).map(policy => policy.fulltext);

      if (ceTitles.includes(CE_Title)) {
        const CE_Authors = item.printouts.Author.map(author => author.fulltext);

        // Fetch Semantic Scholar data (mocked as an empty object for now)
        const semanticScholarData = {}; // await fetchSemanticScholarData(CE_Title);

        // Flatten SemanticScholarData and add it to the resultObject
        updatedResultObject[id] = {
          EvidenceBasedPolicy,
          Industry,
          Country
        };

        // Update the existing entry
        try {
          await strapi.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').update({
            where: { CE_Title },
            data: { ...updatedResultObject[id] }
          });
          strapi.log.info(`Updated entry with title ${CE_Title}`);
        } catch (error) {
          strapi.log.error(`Error updating entry with title ${CE_Title}: ${error.message}`);
        }

        // Wait for 1 second before making the next request (to comply with rate limiting)
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  } catch (error) {
    strapi.log.error(`An error occurred: ${error.message}`);
  }
}

console.log('Executing cron job "semanticallyEmbelLishCE"');
// Run the main function
//main();

module.exports = { updateEmbelishCE };
