const { ScrapingBeeClient } = require('scrapingbee');
const fs = require('fs');

async function getNewPrices() {
  // 1. Check if the API Key exists in the environment
  if (!process.env.SCRAPINGBEE_API_KEY) {
    console.error("ERROR: API Key is missing! Check your GitHub Secrets.");
    process.exit(1);
  }

  const client = new ScrapingBeeClient(process.env.SCRAPINGBEE_API_KEY);
  
  try {
    console.log("Starting scrape...");
    const response = await client.get({
      url: 'https://scrapingbee.com', // Testing with a real, stable page
      params: {
        "extract_rules": {"title": "h1"}, 
        "render_js": "False"
      }
    });

    if (response.status === 200) {
      // ScrapingBee returns a Buffer, we need to convert it to a string
      const decoder = new TextDecoder();
      const text = decoder.decode(response.data);
      const data = JSON.parse(text);
      
      console.log("Scrape successful! Found:", data);

      const newServiceData = [
        { 
          name: "Fast Plumbing", 
          category: "Plumbing", 
          price: data.title ? "85" : "N/A" // Safety fallback
        }
      ];

      fs.writeFileSync('./services-data.json', JSON.stringify(newServiceData, null, 2));
      console.log("services-data.json updated!");
    } else {
      console.error("ScrapingBee returned status:", response.status);
      process.exit(1);
    }
  } catch (error) {
    console.error("CRITICAL ERROR:", error.message);
    process.exit(1);
  }
}

getNewPrices();
