document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('clickButton').addEventListener('click', onClick);
});

async function onClick() {
    var sourceHTML = await getHTML();
    var message = document.querySelector('#message');
    articleText = getArticle(sourceHTML)
    message.innerText = articleText;
}

function getArticle(sourceHTML) {
    const articleIndex = sourceHTML.indexOf("articleBody");                         // find articleBody tag
        if (articleIndex == -1) {
            articleIndex = sourceHTML.indexOf("article-body");                      // if no articleBody, check article-body tag
        } if (articleIndex == -1) {
            articleIndex = sourceHTML.indexOf("article");                           // if neither, settle for "article"
        }
    const colonIndex = sourceHTML.indexOf(":", articleIndex);                      
    let startIndex = colonIndex + 1;                                                // start after "articleBody:"
    let nextElementIndex = sourceHTML.indexOf('":', startIndex+1);                  // find next : to identify next element
    let articleSubString = sourceHTML.substring(startIndex, nextElementIndex)       // get substring of text between articleBody and next element
    let endIndex = articleSubString.lastIndexOf(",");                               // identify last comma to find end of HTML element
    if (endIndex === -1) {
    // If comma is not found, take the substring until the next element
        endIndex = nextElementIndex;
    }

    return articleSubString.substring(0, endIndex);                  // return clean article substring
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

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}