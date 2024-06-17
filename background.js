
async function getSummaryFromOpenAI(content, sendResponse) {
    const apiKey = 'Enter your Key'
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Summarize the following content:\n\n${content}`,
            }],
            temperature: 0.7,
            max_tokens: 150
        })
    });

    console.log("openAI response is: ", response)
    if (response.ok) {
        const data = await response.json();
        console.log("data json is: ", data);
        sendResponse({ action: "summaryResponse", summary: data.choices[0].message.content });
    } else {
        console.error('Error getting summary from openAI, status code: ', response.status);
        console.error('Error text: ', await response.text());
    }

    const data = response.json();
    return data.choices[0].text.trim();
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarizePage") {
       const pageContent = request.content;
       console.log("Received summarize page request");

       // Call the function to summarize the page content and send the response back
       getSummaryFromOpenAI(pageContent, sendResponse);
   }

   return true;
});