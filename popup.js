
function handleTab(tab) {
    // Get the "summary" div element where we will display the summary
    const summaryDiv = document.getElementById("summary");

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: () => {
                return document.body.innerText; // Get the entire HTML content of the page in body tag
            }
        },
        (results) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            } 

            const pageContent = results[0].result;
            //console.log('handle tab result:', pageContent);
             // Send the page content to the background script for summarization
             chrome.runtime.sendMessage({ action: "summarizePage", content: pageContent }, (response) => {
                console.log('handling response after sendMessage');
                if (response && response.action === "summaryResponse") {
                    console.log('Received summary response:', response);
                    if (response.summary) {
                        summaryDiv.textContent = response.summary;
                    } else {
                        summaryDiv.textContent = "Error: Unable to summarize the page.";
                    }
                }
            });
        }
    )
    
}

document.addEventListener("DOMContentLoaded", function () {
    // Get the "Summarize" button element from popup.html
    const summarizeButton = document.getElementById("summarizeButton");

    summarizeButton.addEventListener("click", () => {
        console.log("Clicked summarize button");
        chrome.tabs.query({ active: true, lastFocusedWindow: true })
            .then((tabs)=>{
                const tab = tabs[0];
                console.log("tab is ", tab);
                handleTab(tab);
            })
            .catch((error)=>{
                console.error('Error query the active tab:', error);
            })
        
    })
})