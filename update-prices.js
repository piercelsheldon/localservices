const scrapingbee = require('scrapingbee');
const fs = require('fs');

async function getNewPrices() {
  const apiKey = process.env.SCRAPINGBEE_API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: SCRAPINGBEE_API_KEY is missing from GitHub Secrets.");
    process.exit(1);
  }

  const client = new scrapingbee.ScrapingBeeClient(apiKey);

  try {
    console.log("Scraper is starting for Davis Heating & Cooling...");

    const response = await client.get({
      url: 'https://www.davisheat.com/resources/',
      params: {
        "extract_rules": {
          "business_name": "title",
          "membership_deal": ".card-title"
        },
        "render_js": "True"
      }
    });

    if (response.status === 200) {
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(response.data);
      const scrapedData = JSON.parse(text);

      console.log("Scrape Success! Found:", scrapedData.business_name);

      // Create the array using the names we defined in 'extract_rules'
      const services = [
        {
          name: "Davis Heating & Cooling", // Keep it clean for the UI
          category: scrapedData.membership_deal || "HVAC & Plumbing",
          price: "16.25" // Their current starting rate
        }
      ];

      fs.writeFileSync('./services-data.json', JSON.stringify(services, null, 2));
      console.log("✅ Live data saved to services-data.json!");
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
