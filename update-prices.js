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
  url: 'https://www.davisheat.com/resources/', // Targeting their resources/membership page
  params: {
    "extract_rules": {
      "business_name": "title", // Grabs "Davis Heating, Cooling, Plumbing & Electric"
      "membership_deal": ".card-title" // Grabs the name of their maintenance plan
    },
    "render_js": "True" 
  }
});

if (response.status === 200) {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(response.data);
  const scrapedData = JSON.parse(text);

  const services = [
    { 
      name: "Davis Heating & Cooling", // We can keep the name clean
      category: scrapedData.membership_deal || "HVAC & Plumbing", 
      price: "16.25" // Their current starting monthly membership rate
    }
  ];

  fs.writeFileSync('./services-data.json', JSON.stringify(services, null, 2));
}


    if (response.status === 200) {
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(response.data);
      const scrapedData = JSON.parse(text);
      
      console.log("Scrape Success! Found:", scrapedData.title);

      // Now we use the ACTUAL data from the website
      const services = [
        { 
          name: scrapedData.title || "Unknown Business", // Uses real title
          category: "Local Service", 
          price: scrapedData.price || "Contact for Quote" // Uses real price (if scraped)
        }
      ];

      fs.writeFileSync('./services-data.json', JSON.stringify(services, null, 2));
      console.log("✅ Live data saved to services-data.json!");
    }
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
