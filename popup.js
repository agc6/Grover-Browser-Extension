//puts together the request body to send to the sendPost function
function groverRequest() {

    // get article text from loaded HTML
    const allText = document.documentElement.outerHTML;
    const articleIndex = allText.indexOf("articleBody");                        // find articleBody tag
    const colonIndex = allText.indexOf(":", articleIndex);                      
    let startIndex = colonIndex + 1;                                            // start after "articleBody:"
    let nextElementIndex = allText.indexOf('":', startIndex+1);                 // find next : to identify next element
    let articleSubString = allText.substring(startIndex, nextElementIndex)      // get substring of text between articleBody and next element
    let endIndex = articleSubString.lastIndexOf(",");                           // identify last comma to find end of HTML element
    if (endIndex === -1) {
    // If comma is not found, take the substring until the next element
        endIndex = nextElementIndex;
    }

    let articleText = articleSubString.substring(0, endIndex);                  // get clean article substring

    console.log(articleText);                                                   // debug

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
    if (groverprob >= 0.000002291430519107962 && groverprob <= 0.014853283762931824) {
        result = "We believe this article is <str>human-written.</str>";
    } else if (groverprob >= 0.9996635913848877 && groverprob <= 0.9999986886978149) {
        result = "We believe this article is <str>human-written.</str>";
    } else {
        result = "We're not sure about this article.";
    }

    // display the result
    document.getElementById('result').innerHTML = "<p>" + result + "</p>";
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
