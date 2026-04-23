const { ScrapingBeeClient } = require('scrapingbee');
const fs = require('fs');

async function getNewPrices() {
  const client = new ScrapingBeeClient(process.env.SCRAPINGBEE_API_KEY);
  
  // 1. Target your local business
  const response = await client.get({
    url: 'https://local-business-example.com',
    params: {
      "extract_rules": {"price": ".price-amount"}, // Use your selector here
      "render_js": "True"
    }
  });

  if (response.status === 200) {
    const data = JSON.parse(response.data);
    
    // 2. Format the data to match your script.js services array
    const newServiceData = [
      { name: "Fast Plumbing", category: "Plumbing", price: data.price },
      // Add more scraping calls here for other businesses
    ];

    // 3. Save the data to a local JSON file
    fs.writeFileSync('./services-data.json', JSON.stringify(newServiceData, null, 2));
    console.log("Database updated successfully!");
  }
}

getNewPrices();
