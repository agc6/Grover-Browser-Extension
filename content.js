// Extract article text from loaded HTML
function extractArticleText() {
    // Get the full HTML content of the web page
    const allText = document.documentElement.outerHTML;
    console.log(allText);
    
    // Find the index of "articleBody" in the HTML string
    const articleIndex = allText.indexOf("articleBody");
    if (articleIndex !== -1) {
        // If "articleBody" is found, find the next colon and the next element
        const colonIndex = allText.indexOf(":", articleIndex);
        let startIndex = colonIndex + 1;
        let nextElementIndex = allText.indexOf('":', startIndex + 1);
        
        // Extract the substring containing the article text
        let articleSubString = allText.substring(startIndex, nextElementIndex);
        
        // Find the index of the last comma within the substring
        let endIndex = articleSubString.lastIndexOf(",");
        if (endIndex === -1) {
            // If comma is not found, take the substring until the end
            endIndex = nextElementIndex;
        }
        
        // Extract the article text
        let articleText = articleSubString.substring(0, endIndex);
        
        return articleText;
    } else {
        // If "articleBody" is not found, return "none found"
        return "none found";
    }
}


// Send the article text to the background script
function sendArticleText(articleText) {
    chrome.runtime.sendMessage({ articleText: articleText });
}

// Invoke the functions to extract and send the article text
const articleText = extractArticleText();
sendArticleText(articleText);
