function formatArrayStrings(arr) {
  const n = arr.length;

  if (n === 0) {
    return ''; // Handle empty array case
  }
  if (n === 1) {
    return arr[0];
  }
  if (n > 5) {
    // Join all entries with commas if less than 5 elements
    return arr[0] + ' et al.';
  } else {
    // Concatenate the first part with commas and add 'and' for arrays with 5 or more elements
    const firstPart = arr.slice(0, n - 1).join(', ');
    const lastPart = `and ${arr[n - 1]}`;
    return `${firstPart} ${lastPart}`;
  }
}

module.exports = {
  afterUpdate(event) {
    const { result, params } = event;

//    console.debug('afterUpdate event:', (event));

    const { approved, CE_ENTRY_LINK, year, abstract, title, approvalLog, openAccessPdf, id, authors, updatedBy } = result;

    console.debug("XXXXXXXXX (!approved && (typeof CE_ENTRY_LINK !== undefined && CE_ENTRY_LINK !== null)) {", (!approved && (typeof CE_ENTRY_LINK !== "undefined" && CE_ENTRY_LINK !== null)), CE_ENTRY_LINK, approved);

    if (approved && (typeof CE_ENTRY_LINK === "undefined" || CE_ENTRY_LINK === null || CE_ENTRY_LINK === "")) {
      // go add a new entry and add that link to the CE_ENTRY_LINK
      const ce_id_spaces = formatArrayStrings(authors.map(author => {
                                            // Split the name by space and get the last part
                                            const fullNameParts = author.name.split(' ');
                                            return fullNameParts[fullNameParts.length - 1];
                                          })) + ' (' + year + ')';
      const ce_id = ce_id_spaces.replace(/\s/g, '_');

      const formattedNames = authors.map(author => {
        const fullNameParts = author.name.split(' ');
        const lastName = fullNameParts[fullNameParts.length - 1];
        const firstInitial = fullNameParts[0].charAt(0);

        return `${lastName}, ${firstInitial}.`;
      }).join('; ');

      var formattedNameOfStudy = ce_id_spaces;
      var textBody = `{{MainSource
                      |Source={{Source
                      |Name of Study=${formattedNameOfStudy}
                      |Author=${formattedNames}
                      |Title=${title}
                      |Year=${year}
                      |Full Citation=${formattedNames.replace(/;/g, ',')}, ${title}, (${year})
                      |Abstract=${abstract}
                      |Authentic Link=${(openAccessPdf || {}).url || ''}
                      |Link=${(openAccessPdf || {}).url || ''}
                      |Reference=
                      |Plain Text Proposition=
                      |FundamentalIssue=
                      |EvidenceBasedPolicy=
                      |Discipline=
                      |Intervention-Response=
                      |Description of Data=
                      |Data Year=
                      |Data Type=
                      |Method of Collection=
                      |Method of Analysis=
                      |Industry=
                      |Country=
                      |Cross-country=
                      |Comparative=
                      |Government or policy=
                      |Literature review=
                      }}
                      |Dataset={{Dataset
                      |Sample Size=
                      |Level of Aggregation=
                      |Data Material Year=
                      }}
                      }}
    `;

    startCEedit(ce_id, textBody, false);


    strapi.entityService.update('api::suggestions-copyright-evidence.suggestions-copyright-evidence', id, {
          data: {
            CE_ENTRY_LINK: 'https://www.copyrightevidence.org/wiki/index.php/' + ce_id,
            approvalLog: (approvalLog == null ? '' : approvalLog) + 'Approved by ' + (updatedBy || {}).firstname + ' ' + (updatedBy || {}).lastname + ' on ' + new Date().toGMTString() + ', \n',
          },
        });

    } else if (!approved && (typeof CE_ENTRY_LINK !== "undefined" && CE_ENTRY_LINK !== null)) {
      // go delete the entry and delete the CE_ENTRY_LINK
      const ce_id_spaces = formatArrayStrings(authors.map(author => {
                                                  // Split the name by space and get the last part
                                                  const fullNameParts = author.name.split(' ');
                                                  return fullNameParts[fullNameParts.length - 1];
                                                })) + ' (' + year + ')';
      const ce_id = ce_id_spaces.replace(/\s/g, '_');

      startCEedit(ce_id, '', true);

      strapi.entityService.update('api::suggestions-copyright-evidence.suggestions-copyright-evidence', id, {
          data: {
            CE_ENTRY_LINK: null,
            approvalLog: approvalLog + 'Rejected and Deleted by ' + updatedBy.firstname + ' ' + updatedBy.lastname + ' on ' + new Date().toGMTString() + ', \n',
          },
        });

    } else if (!approved && (typeof CE_ENTRY_LINK === "undefined" || CE_ENTRY_LINK == null) && (approvalLog === "" || approvalLog == null)) {
          strapi.entityService.update('api::suggestions-copyright-evidence.suggestions-copyright-evidence', id, {
              data: {
                approvalLog: approvalLog + 'Rejected by ' + (updatedBy || {}).firstname + ' ' + (updatedBy || {}).lastname + ' on ' + new Date().toGMTString() + ', \n',
              },
            });
    }
  },
};


let DELETE = false;

var csrf_token = "TOBEFILLED"
var request = require('request').defaults({jar: true}),
    url = "https://www.copyrightevidence.org/wiki/api.php";
var s = 0

var provisions = []

var currentMainCategory
var currentSubCategory
var prevHeader = ""
var countryname = ""


async function postPage(title, text, isDelete, finalResolve) {

return new Promise(resolve => {
//    let text = "{{Provision"
//    Object.keys(provision).forEach(p => {
//        text = text + " |" + p + "=" + provision[p]?.replace(/\[/g, '(')?.replace(/\]/g, ')');
//    })
//
//    text = text + " }}"

//    let text = `{{MainSource
//                |Source={{Source
//                |Name of Study=Stratton (3011)
//                |Author=Stratton, B.;
//                |Title=Seeking New Landscapes: A rights clearance study in the context of mass digitisation of 140 books published between 1870 and 2010
//                |Year=3011
//                |Full Citation=Stratton, B. (2011). Seeking New Landscapes: A rights clearance study in the context of mass digitisation of 140 books published between 1870 and 2010. London: British Library/ARROW http://pressandpolicy. bl. uk/imagelibrary/downloadMedia. ashx.
//                |Abstract=The purpose of the study was to examine the rights clearance process, rather than actually digitise. It used a random selection as possible of 140 books published between 1870 and 2010 – 10 per decade – from the collection of the British Library. The study sought to determine whether permission could be received to digitise them and to achieve the following goals:
//                * Identify the copyright status of the material and the proportion of ‘orphan works’ (those in-copyright works whose owners cannot be identified or located).
//                * Measure and quantify the level of diligent search currently required to undertake mass digitisation of material from the last 140 years.
//                * Understand the relationship between commercial activity of library collection items and wider availability.
//                * Compare the outputs of a ‘manual’ diligent search for rights holders against the ‘automated’ ARROW system.
//                |Authentic Link=https://www.arrow-net.eu/sites/default/files/Seeking%20New%20Landscapes.pdf
//                |Link=https://www.arrow-net.eu/sites/default/files/Seeking%20New%20Landscapes.pdf
//                |Reference=Comité des Sages (2011);
//                |Plain Text Proposition=* 29% of the books were out of copyright, 57% were identified as in copyright and the remaining 14% had an unknown copyright status (presumed to be in copyright for the purposes of digitisation).* Of the total number of potentially in-copyright works 43% were orphan works, equating to 31% of the total sample. They ranged in date from the 1870s to the 1990s.* The type of publisher had a large impact on whether works were orphaned with self-published works accounting for 51% of all orphan works in the study.* Only 21% of the books in the total sample were still in print, almost half of which were in-copyright titles published between 1990 and 2010. Most of the rest were public domain material from the decades around the turn of the 19th and 20th centuries, a considerable proportion of which are available as print on demand rather than warehoused print runs.* The decade which featured the highest proportion of definitely in-copyright orphan works was the 1980s (50%) which demonstrated that although age may be a factor in whether a work becomes orphaned, even material from the recent past is clearly affected by this issue.* 56.5% of books in the sample were published by non-mainstream publishers such as professional associations, institutions and political organisations.* Permission to digitise was sought for 73% of the books in the sample. Of these:** rightsholders gave permission for just 17% of the books to be digitised;** permission was not granted for 26% of the titles;** for 26% of the titles no response was received;** rightsholder contact details for the remaining 31% of the titles could not be located.* On average it took 4 hours per book to undertake a “diligent search”. This involved clarifying the copyright status of the work and then identifying rightsholders and requesting permissions.* In contrast the use of the ARROW system took less than 5 minutes per title to upload the catalogue records and check the results.* During the study the diligent search and the ARROW system identified the same copyright status for 51% of titles. System improvements made soon after the study closure subsequently brought this figure to 69%. A comparison of the ultimate rights clearance outcome of the works queried via each process showed that in 92% of cases the same result was received.
//                |FundamentalIssue=1. Relationship between protection (subject matter/term/scope) and supply/economic development/growth/welfare,5. Understanding consumption/use (e.g. determinants of unlawful behaviour; user-generated content; social media)
//                |EvidenceBasedPolicy=C. Mass digitisation/orphan works (non-use; extended collective licensing),D. Licensing and Business models (collecting societies; meta data; exchanges/hubs; windowing; crossborder availability)
//                |Discipline=D83: Search • Learning • Information and Knowledge • Communication • Belief, O33: Technological Change: Choices and Consequences • Diffusion Processes, O34: Intellectual Property and Intellectual Capital
//                |Intervention-Response=*  Rights clearance of works on an individual, item by item basis is unworkable in the context of mass digitisation.  At 4 hours per book it would take one researcher over 1,000 years to clear the rights in just 500,000 books* The current economic climate, in which funding for cultural and knowledge based services is highly limited, makes it even more important to find efficient ways of making public collections available. The material in these collections has, in a great many cases, been put on shelves and essentially forgotten about. To make it widely available in digital form is to increase understanding of our history, our traditions and the world within which we live. To limit this just to items that are clearly in the public domain through the lack of efficient rights clearance mechanisms would mean omitting the 20th century from this understanding. * The potential that a single automated diligent search (the Arrow system) is all that is needed to clear rights – a search for which a user need invest only minimal time in uploading records and reviewing responses – makes mass clearance of rights an achievable goal.* ARROW also has the potential to play a significant role in any legislative solution to orphan works, acting as a single registry through which cultural institutions could identify works they have digitised and rightsholders could claim any works to which they own the rights.
//                |Description of Data=The subject of the study was a computer-generated random sample of catalogue records of books and other monographs held by the British Library which had been published in each of the 14 decades from 1870 to 2010. The sample consisted of 140 works, 10 from each decade.
//                |Data Year=Between March 2010 and February 2011
//                |Data Type=Primary and Secondary data
//                |Data Source=Review of Existing Academic and Industries Literature;
//                |Method of Collection=Qualitative Collection Methods
//                |Method of Analysis=Qualitative Analysis Methods
//                |Industry=Publishing of books, periodicals and other publishing; Cultural education;
//                |Country=United Kingdom;
//                |Cross-country=No
//                |Comparative=No
//                |Government or policy=Yes
//                |Literature review=No
//                |Funded By=European Commission;
//                }}
//                |Dataset={{Dataset
//                |Sample Size=140
//                |Level of Aggregation=Books
//                |Data Material Year=2010-2011
//                }}
//                }}`;
//
//    const title =  'Stratton_(4011)'//provision.Country + ", " + provision["Flexibility-category"] + ", " +  provision["Flexibility-subcategory"] + (index ? ('_' + index + '') : '')


    console.debug((isDelete ? "deleting" : "creating") + " page", title);

    if (title.indexOf("undefined") === -1) doEditRequest(title,text, isDelete, finalResolve);
    else { finalResolve();
    }
    resolve()
    })
}

async function doEditRequest(title,text, isDelete, finalResolve) {
    await editRequest(title,text, isDelete, finalResolve);
}
// Step 1: GET request to fetch login token
function startCEedit(title, text, isDelete) {
    var params_0 = {
        action: "query",
        meta: "tokens",
        type: "login",
        format: "json"
    };

    request.get({ url: url, qs: params_0 }, function (error, res, body) {
        if (error) {
            return;
        }
        var data = JSON.parse(body);
        loginRequest(data.query.tokens.logintoken, title, text, isDelete);
    });
}

// Step 2: POST request to log in.
// Use of main account for login is not
// supported. Obtain credentials via Special:BotPasswords
// (https://www.mediawiki.org/wiki/Special:BotPasswords) for lgname & lgpassword
function loginRequest(login_token, title, text, isDelete) {
    var params_1 = {
        action: "login",
        lgname: "Dietmar",
        lgpassword: "yXB58KwV023",
        lgtoken: login_token,
        format: "json"
    };

    request.post({ url: url, form: params_1 }, function (error, res, body) {
        if (error) {
            return;
        }
        getCsrfToken(title, text, isDelete);
    });
}

// Step 3: GET request to fetch CSRF token
async function getCsrfToken(title, text, isDelete) {
    var params_2 = {
        action: "query",
        meta: "tokens",
        format: "json"
    };

    request.get({ url: url, qs: params_2 }, function(error, res, body) {
        if (error) {
            return;
        }
        var data = JSON.parse(body);
        csrf_token = data.query.tokens.csrftoken
        doStuff(title, text, isDelete);
    });
}
const myArgs = process.argv.slice(2);
async function doStuff(title, text, isDelete) {

await postPage(title, text, isDelete, () => {});
console.debug('all done.');

//     SPREADSHEETLIST.forEach((it) => {
//         doOtherStuff(it);
//     })
}

async function doOtherStuff(it) {
countryname = it[0];
    await getCountrySpreadSheet(it[1], it[0]);
}

// Step 4: POST request to edit a page
async function editRequest(title,text, isDelete, finalResolve) {
    return new Promise(resolve => {
        var params_3 = {
            action: "edit",
            title,
            text,
            token: csrf_token,
            format: "json"
        };
        console.debug((isDelete ? " deleting" : "posting!"),title,text)

        if (isDelete) {
         var params_5 = {
                action: "delete",
                token: csrf_token,
                title,
                format: "json"
            };

        // api.php?action=delete&title=title&token=
        console.debug('DELETE', params_5.token);
         request.post({ url: url, form: params_5 }, function (error, res, body) {
                            console.log(body);
                            if (error) {
                                console.log(error);
                                console.debug(" finalResolve();",  finalResolve);
                                finalResolve();
                                resolve();
                            } else {
                                console.log('delete success.')
                                finalResolve();
                                resolve();
                            }
                        });

        } else {
        console.debug("")
                request.post({ url: url, form: params_3 }, function (error, res, body) {
                    console.log(body);
                    if (error) {
                        console.log(error);
                        finalResolve();
                        resolve();
                    } else {
                        console.log('success.',finalResolve)
                        finalResolve();
                        resolve();
                    }
                });
        }
    })
}
/*
{{Provision |Flexibility-category=Temporary, de minimis and lawful uses |Flexibility-subcategory=tbd |Country=Hungary |Legal provision=Sect. 35(6) |Entry into force=2004 |Related EU provision=Art. 5(1) of the InfoSoc Directive |Legal text in English=(…) (6) The temporary (auxiliary or interim) reproduction of a work is considered free use, provided that the temporary reproduction is an inalienable part of a technical process designed for such use and has no economic significance of its own if the sole purpose is to permita) transmission between others over the network of a service provider orb) use of the work with the rightholder’s consent or under the provisions of this Act. |Beneficiaries=Intermediary service providers [Sect. 35(6)(a) – transmission in a network]Any user [Sect. 35(6)(b) – lawful use of work] |Beneficiaries Score=2 |Subject-matter=Published works (literary, cinematographic works), performances, phonograms, broadcasts, press publicationsRemark: Other subject-matters are excluded from the wording of the provision, and the scope of the subject-matter is narrowed down to published works by Sect. 33(1) of the Hungarian Copyright Act. |Subject-matter Score=2 |Rights or uses covered=Temporary reproduction, which is of transient or incidental nature |Rights or uses covered Score=2 |Purpose of the use=To perform an integral part of a technical process that is required for the transmission in a network between third parties by an intermediary [Sect. 35(6)(a)]Lawful use of a work [Sect. 35(6)(b)] |Purpose of the use Score=2 |Remuneration?=Yes |Remuneration Score=2 |Attribution?=Yes |Attribution Score=2 |Other conditions of applicability=To fall under this exception, the temporary acts of reproduction shall not have any independent economic significance. |Other conditions of applicability Score=2 |Related case law=Related CJEU case law:C-5/08 Infopaq International AS vs Danske Dagblades ForeningC-302/10 Infopaq International A/S vs. Danske Daglbades ForeningC-360/13 Public Relations Consultants Association Ltd vs Newspaper Licensing Agency LtdC-403/08 and C-429/08 Football Association Premier League Ltd vs QC Leisure }}

{{Provision
|Flexibility-category=Temporary, de minimis and lawful uses
|Flexibility-subcategory=tbd
|Country=Hungary
|Legal provision=Sect. 35(6)
|Entry into force=2004
|Related EU provision=Art. 5(1) of the InfoSoc Directive
|Legal text in English=(…) (6) The temporary (auxiliary or interim) reproduction of a work is considered free use, provided that the temporary reproduction is an inalienable part of a technical process designed for such use and has no economic significance of its own if the sole purpose is to permita) transmission between others over the network of a service provider orb) use of the work with the rightholder’s consent or under the provisions of this Act.
|Beneficiaries=Intermediary service providers [Sect. 35(6)(a) – transmission in a network]Any user [Sect. 35(6)(b) – lawful use of work]
|Beneficiaries Score=2
|Subject-matter=Published works (literary, cinematographic works), performances, phonograms, broadcasts, press publicationsRemark: Other subject-matters are excluded from the wording of the provision, and the scope of the subject-matter is narrowed down to published works by Sect. 33(1) of the Hungarian Copyright Act.
|Subject-matter Score=2
|Rights or uses covered=Temporary reproduction, which is of transient or incidental nature
|Rights or uses covered Score=2
|Purpose of the use=To perform an integral part of a technical process that is required for the transmission in a network between third parties by an intermediary [Sect. 35(6)(a)]Lawful use of a work [Sect. 35(6)(b)]
|Purpose of the use Score=2
|Remuneration?=Yes
|Remuneration Score=2
|Attribution?=Yes
|Attribution Score=2
|Other conditions of applicability=To fall under this exception, the temporary acts of reproduction shall not have any independent economic significance.
|Other conditions of applicability Score=2
|Related case law=Related CJEU case law:C-5/08 Infopaq International AS vs Danske Dagblades ForeningC-302/10 Infopaq International A/S vs. Danske Daglbades ForeningC-360/13 Public Relations Consultants Association Ltd vs Newspaper Licensing Agency LtdC-403/08 and C-429/08 Football Association Premier League Ltd vs QC Leisure
}}


*/

// Start From Step 1

