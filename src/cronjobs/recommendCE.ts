const https = require('https');
const S2_API_KEY = 'TPryTJ9m838pMjkp7iWKy5wlJQNSulHd3mXTLAuC';

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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Failed to parse JSON: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      console.error('HTTPS request error:', error.message);
      reject(error);
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

async function fetchStrapiData(collection) {
  try {
    return await strapi.db.query(collection).findMany();
  } catch (error) {
    console.error(`Error fetching from ${collection}:`, error.message);
    return [];
  }
}

function mapPaperToSuggestion(paper) {
  return {
    paperId: paper.paperId,
    title: paper.title,
    abstract: paper.abstract,
    authors: JSON.stringify(paper.authors || []),
    year: paper.year,
    url: paper.url,
    venue: paper.venue,
    citationCount: paper.citationCount,
    influentialCitationCount: paper.influentialCitationCount,
    referenceCount: paper.referenceCount,
    publicationDate: paper.publicationDate,
    suggestionCount: 1,
  };
}

function mapPaperToSuggestion(paper) {
  return {
    paperId: paper.paperId,
    corpusId: "" + paper.corpusId,
    url: paper.url,
    title: paper.title,
    venue: paper.venue,
    year: paper.year,
    citationCount: paper.citationCount || 0,
    referenceCount: paper.referenceCount || 0,
    influentialCitationCount: paper.influentialCitationCount || 0,
    fieldsOfStudy: JSON.stringify(paper.fieldsOfStudy || []),
    publicationDate: paper.publicationDate,
    journal: paper.journal || {},
    citationStyles: paper.citationStyles || {},
    authors: paper.authors || [],
    externalIds: paper.externalIds || {},
    s2FieldsOfStudy: paper.s2FieldsOfStudy || [],
    publicationTypes: paper.publicationTypes || [],
    openAccessPdf: paper.openAccessPdf || {},
    abstract: paper.abstract,
    suggestionCount: 1,
    CE_ENTRY_LINK: '', // you can populate this later if needed
    approvalLog: '',   // to be updated during moderation
  };
}

async function writeOrUpdateOrNothing(paper, suggestions_list, embellished_list) {
  const { paperId, title } = paper;


  if (!paperId || !paperId || !title) {
    return;
  }

  const existing = suggestions_list.find(s => s.paperId === paperId);

  if (!existing) {

                     await strapi.query('api::suggestions-copyright-evidence.suggestions-copyright-evidence')
      .create({ data: mapPaperToSuggestion(paper) });

    try {
      const result = await strapi.entityService.create('api::suggestions-copyright-evidence.suggestions-copyright-evidence', {
        data: mapPaperToSuggestion(paper),
      });
    } catch (error) {
      console.error('Error creating suggestion:', error.message);
    }

  } else if (existing.approved !== false) {
  console.debug("existing!", existing);
    await strapi.entityService.update('api::suggestions-copyright-evidence.suggestions-copyright-evidence', existing.id, {
      data: {
        suggestionCount: existing.suggestionCount + 1,
      },
    });
  }
}

async function fetchPaperRecommendations(paperId) {
  const url = `https://api.semanticscholar.org/recommendations/v1/papers/forpaper/${paperId}?fields=externalIds,url,citationCount,paperId,corpusId,title,venue,year,externalIds,abstract,referenceCount,citationCount,influentialCitationCount,openAccessPdf,fieldsOfStudy,s2FieldsOfStudy,publicationTypes,publicationDate,journal,citationStyles,authors&limit=3`;

  try {
    const response = await fetchData(url);
    return response.recommendedPapers || [];
  } catch (err) {
    console.error(`Failed to fetch recommendations for ${paperId}:`, err.message);
    return [];
  }
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function recommendCE() {
  console.log('Executing cron job "recommendCE"...');

  const suggestions_list = await fetchStrapiData('api::suggestions-copyright-evidence.suggestions-copyright-evidence');
  const embellished_list = await fetchStrapiData('api::data-embellished-copyright-evidence.data-embellished-copyright-evidence');

  const allPaperIds = embellished_list.map(e => e.paperId).filter(Boolean);
  const randomized = shuffleArray(allPaperIds);

  for (const paperId of randomized) {
    const recs = await fetchPaperRecommendations(paperId);
    for (const paper of recs) {
      await writeOrUpdateOrNothing(paper, suggestions_list, embellished_list);
    }
  }

  console.log('Cron job "recommendCE" finished.');
}

module.exports = { recommendCE };
