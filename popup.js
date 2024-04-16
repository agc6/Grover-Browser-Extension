//puts together the request body to send to the sendPost function
function groverRequest() {
    let articleText = ""
    // Listen for messages sent from the content script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log("received");
        // Check if the message contains the articleText
        if (message.articleText) {
        // Process the articleText here
        console.log("Received articleText from the content script:", message.articleText);
        articleText = message.articleText;
        // You can perform further processing or send the articleText to other functions
    }
    });

    //article and target are the important things here
    requestBodyJSON = {
        "article": articleText,
        "authors": "",
        "date": "",
        "domain": "",
        "title": "",
        "target": "discrimination"
    }
    requestBody = JSON.stringify(requestBodyJSON);

    //call sendPost with the request body we have
    var response = sendPost(requestBody);

    // parse the response JSON
    var jsonResponse = JSON.parse(response);

    // extract groverprob from the response
    var groverprob = jsonResponse.groverprob;

    // determine whether the text was likely written by a human or a machine
    var result = "";
    if (articleText == "none found") {
        result = "We couldn't find an article on this page. ):"
    } if (groverprob >= 0 && groverprob <= 0.014853283762931824) {
        result = "We believe this article is <str>human-written.</str>";
    } if (groverprob >= 0.014853283762931824 && groverprob <= 0.1) {
        result = "This article is most likely <str>human-written.</str>";
    } if (groverprob >= 0.1 && groverprob <= 0.15) {
        result = "This article may be human-written, but we're not sure.";
    } if (groverprob >= 0.8 && groverprob <= 0.85) {
        result = "This article may be machine-written, but we're not sure.";
    } if (groverprob >= 0.85 && groverprob <= 0.9996635913848877) {
        result = "This article is most likely <str>machine-written.</str>";
    } else if (groverprob >= 0.9996635913848877 && groverprob <= 0.9999986886978149) {
        result = "We believe this article is <str>human-written.</str>";
    } else {
        result = "We're not sure about this article.";
    }

    // display the result
    document.getElementById('result').innerHTML = "<p>" + result + " " + groverprob + "text: " + articleText + "</p>";
}

//function to actually send the POST request to the groverAPI
function sendPost(body) {
    //url that we're sending our request to
    var url = 'https://discriminate.grover.allenai.org/api/disc';

    //make a variable to store the request
    var xmlHttp = new XMLHttpRequest();

    //make it a POST request, add in the url. the false makes this request async (sendPost will wait until the response is returned)
    xmlHttp.open("POST", url, false);

    //add this header, because without it we get an HTTP 500 error instead of the response
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    //send the request and return the response
    xmlHttp.send(body);
    return xmlHttp.responseText;
}

//when the document loads, add an event listener to the button so clicking it runs the groverRequest function.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fakeNewsButton').addEventListener('click', groverRequest, false);
})
