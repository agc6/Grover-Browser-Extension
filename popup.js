// popup.js

// Function to send message to content script and receive article text
function getArticleText() {
    // Send message to content script to extract article text
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractArticleText" }, function (response) {
            const articleText = response && response.articleText ? response.articleText : "none found";
            // Call function to query API with the article text
            queryAPI(articleText);
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
        document.getElementById('result').innerHTML = "<p>" + result + " " + groverprob + "</p>";
    } else {
        document.getElementById('result').innerHTML = "<p>Error querying API.</p>";
    }
}

// Add event listener to the button to trigger the process
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fakeNewsButton').addEventListener('click', getArticleText);
});
