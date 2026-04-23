const scrapingbee = require('scrapingbee'); // Correct import for Node.js
const fs = require('fs');

async function getNewPrices() {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: SCRAPINGBEE_API_KEY is missing from GitHub Secrets.");
    process.exit(1);
  }

  // Note the 'new' keyword and the library name
  const client = new scrapingbee.ScrapingBeeClient(apiKey);
  
  try {
    console.log("Scraper is starting...");
    
    // We use a stable URL to ensure the bot works first
    const response = await client.get({
      url: 'https://scrapingbee.com', 
      params: {
        "extract_rules": { "title": "h1" },
        "render_js": "False"
      }
    });

    if (response.status === 200) {
      // PRO FIX: Correctly decode the raw data buffer into a string
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(response.data);
      const scrapedData = JSON.parse(text);
      
      console.log("Found Title:", scrapedData.title);

      // This is the data structure your website's script.js expects
      const services = [
        { 
          name: "Fast Plumbing", 
          category: "Plumbing", 
          price: "85" 
        },
        { 
          name: "Green Gardeners", 
          category: "Landscaping", 
          price: "45" 
        }
      ];

      // Save the file
      fs.writeFileSync('./services-data.json', JSON.stringify(services, null, 2));
      console.log("✅ services-data.json updated successfully!");
    } else {
      console.error(`ScrapingBee returned an error status: ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("The script hit a snag:", error.message);
    process.exit(1);
  }
}

getNewPrices();
