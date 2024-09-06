const https = require('https');
//const Strapi = require('strapi-sdk-javascript');
const S2_API_KEY = 'EEnArnIbFz7UyomYkXSJf8KnAOiBmqQc41oZnjpH';
//const strapi = new Strapi('http://localhost:1337'); // Update with your Strapi instance URL


const qmn = {
    "20": "Protection",
    "21": "Use",
    "22": "Exploitation",
    "23": "Enforcement",
}

const categoryIdMap = {
    6: "research",
    7: "legislation",
    5: "guidance",
    4: "content",
    8: "cases"
}

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

async function main() {
  // Fetch base data from the Strapi collection
  const baseECData = await strapi.db.query('api::copyright-user-eu.copyright-user-eu').findMany();

console.debug("baseECData", baseECData);
  // Fetch base data
  const baseSourceDataUrl =
    'https://backend.copyrightuser.eu/wp-json/wp/v2/posts?per_page=1000&categories=9';

  const dataEntries = await fetchData(baseSourceDataUrl);

  if (!dataEntries) {
    strapi.log.error('Error fetching base data from Strapi collection.');
    return;
  }

  const updatedResultObject = {};
  const ceTitles = baseECData.map((item) => item.u_id);


  strapi.log.info('Processing base copyright evidence data with length of ' + dataEntries.length);

  for (const {id, date, title, content, excerpt, categories} of dataEntries) {
    const itemId = id;
    const CE_Title = id;

    console.debug("ceTitles", ceTitles, "vs", ""+CE_Title, ceTitles.includes(""+CE_Title));


    if (!ceTitles.includes(""+CE_Title)) {

      // Flatten SemanticScholarData and add it to the resultObject
      updatedResultObject[itemId] = {
        u_id: id,
        category: title.rendered,
        content: content.rendered,
        excerpt: excerpt.rendered,
        types: categories.filter(categoryE => categoryIdMap[categoryE]).map((categoryE) => {  return categoryIdMap[categoryE]  } ).join(","),
      };

          try {
            await strapi.query('api::copyright-user-eu.copyright-user-eu').create({
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

console.log('Executing cron job "syncCopyrightUserEU"');
// Run the main function
main();
