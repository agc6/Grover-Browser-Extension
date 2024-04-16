//puts together the request body to send to the sendPost function
function groverRequest() {
    //this is a placeholder; ideally we would have the article text scraped in somehow (BeautifulSoup?)
    articleText = "Artificial intelligence (AI), in its broadest sense, is intelligence exhibited by machines, particularly computer systems. It is a field of research in computer science that develops and studies methods and software which enable machines to perceive their environment and uses learning and intelligence to take actions that maximize their chances of achieving defined goals.[1] Such machines may be called AIs.\nAI technology is widely used throughout industry, government, and science. Some high-profile applications include advanced web search engines (e.g., Google Search); recommendation systems (used by YouTube, Amazon, and Netflix); interacting via human speech (e.g., Google Assistant, Siri, and Alexa); autonomous vehicles (e.g., Waymo); generative and creative tools (e.g., ChatGPT and AI art); and superhuman play and analysis in strategy games (e.g., chess and Go).[2] However, many AI applications are not perceived as AI: \"A lot of cutting edge AI has filtered into general applications, often without being called AI because once something becomes useful enough and common enough it's not labeled AI anymore.\"[3][4]\nAlan Turing was the first person to conduct substantial research in the field that he called machine intelligence.[5] Artificial intelligence was founded as an academic discipline in 1956.[6] The field went through multiple cycles of optimism,[7][8] followed by periods of disappointment and loss of funding, known as AI winter.[9][10] Funding and interest vastly increased after 2012 when deep learning surpassed all previous AI techniques,[11] and after 2017 with the transformer architecture.[12] This led to the AI boom of the early 2020s, with companies, universities, and laboratories overwhelmingly based in the United States pioneering significant advances in artificial intelligence.[13]"

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
        result = "Human Written";
    } else if (groverprob >= 0.9996635913848877 && groverprob <= 0.9999986886978149) {
        result = "Machine Written";
    } else {
        result = "Uncertain";
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
