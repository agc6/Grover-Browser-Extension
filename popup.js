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
        
    
        //check the groverprob number returned in the response to determine whether the article was human or AI-written (and our level of certainty about that).
        if (groverprob < 0.2) {
            result = "We believe this article is <str>human-written.</str>";
        }
        else if (groverprob < 0.35) {
            result = "This article is most likely <str>human-written.</str>";
        }
        else if (groverprob < 0.45) {
            result = "This article may be human-written, but we're not sure.";
        } 
        else if (groverprob < 0.55) {
            result = "We're not sure about this article.";
        }
        else if (groverprob < 0.65) {
            result = "This article may be machine-written, but we're not sure.";
        } 
        else if (groverprob < 0.8) {
            result = "This article is most likely <str>machine-written.</str>";
        }
        else {
            result = "We believe this article is <str>machine-written.</str>";
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