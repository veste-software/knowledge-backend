const https = require('https');
//const Strapi = require('strapi-sdk-javascript');
const S2_API_KEY = 'TPryTJ9m838pMjkp7iWKy5wlJQNSulHd3mXTLAuC';
//const strapi = new Strapi('http://localhost:1337'); // Update with your Strapi instance URL

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

async function main() {
  // Fetch base data from the Strapi collection
  const baseECData = await strapi.db.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').findMany();

  // Fetch base data
  const baseSourceDataUrl =
    'https://mediawiki.copyrightflexibilities.eu/api.php?action=ask&query=[[Category:Provision]]%20|?Country=Country%20|?Flexibility-category=Flexibility%20Category|?Flexibility-subcategory=Flexibility%20Subcategory|?Legal%20provision=Legal%20Provision|?Notes%20on%20Legal%20provision=Notes%20on%20Legal%20Provision|?Entry%20into%20force=Entry%20Into%20Force|?Notes%20on%20Entry%20into%20force=Notes%20on%20Entry%20Into%20Force|?Related%20EU%20provision=Related%20EU%20Provision|?Notes%20on%20Related%20EU%20provision=Notes%20on%20Related%20EU%20Provision|?Legal%20text%20in%20English=Legal%20Text%20in%20English|?Notes%20on%20Legal%20text%20in%20English=Notes%20on%20Legal%20Text%20in%20English|?Beneficiaries=Beneficiaries|?Notes%20on%20Beneficiaries=Notes%20on%20Beneficiaries|?Beneficiaries%20Score=Beneficiaries%20Score|?Subject-matter=Subject%20Matter|?Notes%20on%20Subject-matter=Notes%20on%20Subject%20Matter|?Subject-matter%20Score=Subject%20Matter%20Score|?Rights%20or%20uses%20covered=Rights%20or%20Uses%20Covered|?Notes%20on%20Rights%20or%20uses%20covered=Notes%20on%20Rights%20or%20Uses%20Covered|?Rights%20or%20uses%20covered%20Score=Rights%20or%20Uses%20Covered%20Score|?Purpose%20of%20the%20use=Purpose%20of%20the%20Use|?Notes%20on%20Purpose%20of%20the%20use=Notes%20on%20Purpose%20of%20the%20Use|?Purpose%20of%20the%20use%20Score=Purpose%20of%20the%20Use%20Score|?Remuneration?=Remuneration|?Notes%20on%20Remuneration?=Notes%20on%20Remuneration|?Remuneration%20Score=Remuneration%20Score|?Specificities%20in%20implementation?=Specificities%20in%20implementation|?Attribution?=Attribution|?Notes%20on%20Attribution?=Notes%20on%20Attribution|?Attribution%20Score=Attribution%20Score|?Other%20conditions%20of%20applicability=Other%20Conditions%20of%20Applicability|?Notes%20on%20Other%20conditions%20of%20applicability=Notes%20on%20Other%20Conditions%20of%20Applicability|?Other%20conditions%20of%20applicability%20Score=Other%20Conditions%20of%20Applicability%20Score|?Related%20case%20law=Related%20Case%20Law|?Notes%20on%20Related%20case%20law=Notes%20on%20Related%20Case%20Law|?Case%20law=Case%20Law|?Notes%20on%20Case%20law=Notes%20on%20Case%20Law|?Statutory%20reference=Statutory%20Reference|?Notes%20on%20Statutory%20reference=Notes%20on%20Statutory%20Reference|%20format=table%20|%20limit=5000%20|%20offset=0&format=json&format=json';

  const baseData = await fetchData(baseSourceDataUrl);

  if (!baseData || (!baseData || !baseData.query || !baseData.query.results)) {
    strapi.log.error('Error fetching base data from Strapi collection.');
    return;
  }

  const updatedResultObject = {};
  const ceTitles = baseECData.map((item) => item.CE_Title);

  const dataEntries = Object.entries(baseData.query.results);

  strapi.log.info('Processing base copyright evidence data with length of ' + dataEntries.length);

  for (const [id, item] of Object.entries(dataEntries)) {
    // for (const item of baseData.query.results.filter((item) => !ceTitles.includes(item.title))) {

    const itemId = item[0];
    const CE_Title = item[1].printouts.Title[0];
    if (!ceTitles.includes(CE_Title)) {
      const CE_Authors = item[1].printouts.Author.map((author) => author.fulltext);

      // Fetch Semantic Scholar data
      const semanticScholarData = await fetchSemanticScholarData(CE_Title);

      // Flatten SemanticScholarData and add it to the resultObject
      updatedResultObject[itemId] = {
        CE_Title,
        CE_Authors,
        ...(semanticScholarData || {}),
      };

          try {
            await strapi.query('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence').create({
              data: { ...updatedResultObject[itemId] }
            });
            console.debug('Updated entry with id ' + id);
            strapi.log.info(`Updated entry with id ${id}`);
          } catch (error) {
            console.error(error);
          }

      // Wait for 1 second before making the next request (to comply with rate limiting)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

console.log('Executing cron job "semanticallyFlexibilities"');
// Run the main function
main();
