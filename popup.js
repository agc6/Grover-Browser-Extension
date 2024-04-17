document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('clickButton').addEventListener('click', onClick);
});

async function onClick() {
    var sourceHTML = await getHTML();
    var message = document.querySelector('#message');
    articleText = getArticle(sourceHTML);
    if (verifyArticleText(articleText)) {
        queryAPI(articleText);
    }
    //message.innerText = articleText;
}

// handle edge conditions to ensure accurate result
function verifyArticleText(articleText) {
    var message = document.querySelector('#message');
    var accept = true;
    console.log("Verify " + articleText);
    if (articleText == "None found") {
        message.innerText = "We couldn't find an article on this page."
        accept = false;
    } else if (articleText.length < 100) {
        message.innerText = "This article is too short to reliably determine its origin."
        accept = false;
    }
    return accept;                   // only reached if !false conditions
}

function getArticle(sourceHTML) {
    articleIndex = sourceHTML.indexOf("articleBody");                         // find articleBody tag
    if (articleIndex == -1) {
        articleIndex = sourceHTML.indexOf("article-body");                      // if no articleBody, check article-body tag
    } if (articleIndex == -1) {
        articleIndex = sourceHTML.indexOf("article");                           // if neither, settle for "article"
    }

    if (articleIndex != -1) {
        const colonIndex = sourceHTML.indexOf(":", articleIndex);                      
        let startIndex = colonIndex + 1;                                                // start after "articleBody:"
        let nextElementIndex = sourceHTML.indexOf('":', startIndex+1);                  // find next : to identify next element
        let articleSubString = sourceHTML.substring(startIndex, nextElementIndex)       // get substring of text between articleBody and next element
        let endIndex = articleSubString.lastIndexOf(",");                               // identify last comma to find end of HTML element
        if (endIndex === -1) {
        // If comma is not found, take the substring until the next element
            endIndex = nextElementIndex;
        }

        console.log("Article found: " + sourceHTML.substring(articleIndex-500, endIndex));
        return articleSubString.substring(0, endIndex);                              // return clean article substring
    } else {
        console.log("No tags articleBody, article-body, or article found.");
        return "None found" ;                                                       // if no article index found, show error
    }
}

function getHTML() {
    var message = document.querySelector('#message');
    message.innerText = "Please wait a moment...";

    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
            var activeTab = tabs[0];
            var activeTabId = activeTab.id;

            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                func: DOMtoString
            });

        }).then(function (results) {
            resolve(results[0].result);
        }).catch(function (error) {
            console.log('There was an error injecting script : \n' + error.message);
            reject(error);
        });
    });
 }

 // Function to query API with article text
function queryAPI(articleText) {
    // Assemble request body
    const requestBodyJSON = {
        "article": articleText,
        "authors": "",
        "date": "",
        "domain": "",
        "title": "",
        "target": "discrimination"
    };
    const requestBody = JSON.stringify(requestBodyJSON);

    // Send POST request to API
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", 'https://discriminate.grover.allenai.org/api/disc', false);
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(requestBody);

    // Handle API response
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var jsonResponse = JSON.parse(xmlHttp.responseText);
        var groverprob = jsonResponse.groverprob;
        var result = "";
        // Determine result based on groverprob
        if (articleText == "none found") {
            result = "We couldn't find an article on this page. ):";
        } else if (groverprob >= 0 && groverprob <= 0.014853283762931824) {
            result = "We believe this article is <str>human-written.</str>";
        } else if (groverprob >= 0.014853283762931824 && groverprob <= 0.1) {
            result = "This article is most likely <str>human-written.</str>";
        } else if (groverprob >= 0.1 && groverprob <= 0.15) {
            result = "This article may be human-written, but we're not sure.";
        } else if (groverprob >= 0.8 && groverprob <= 0.85) {
            result = "This article may be machine-written, but we're not sure.";
        } else if (groverprob >= 0.85 && groverprob <= 0.9996635913848877) {
            result = "This article is most likely <str>machine-written.</str>";
        } else if (groverprob >= 0.9996635913848877 && groverprob <= 0.9999986886978149) {
            result = "We believe this article is <str>human-written.</str>";
        } else {
            result = "We're not sure about this article.";
        }
        // Display the result
        message.innerHTML = "<p>" + result + "</p>";
    } else {
        message.innerHTML = "Error querying API.";
    }
}

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}