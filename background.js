// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarizePage") {
       const pageContent = request.content;
       console.log("Received summarize page request");
       sendResponse({ action: "summaryResponse", summary: "abc" });
       // Call the function to summarize the page content and send the response back
       //summarizePageContent(pageContent, sendResponse);
   }

   // Ensure that sendResponse is called asynchronously
   return true;
});