// 1. Initial function to fetch your scraped data
async function loadServices() {
    try {
        // This fetches the file your Robot Script creates
        const response = await fetch('./services-data.json');
        const services = await response.json();
        
        // Save data globally so the search function can use it
        window.allServices = services;
        
        // Display all services immediately on page load
        displayServices(services);
    } catch (error) {
        console.error("Pro Tip: Ensure update-prices.js has run once to create services-data.json!", error);
    }
}

// 2. The function that actually builds the cards on your screen
function displayServices(data) {
    const serviceGrid = document.querySelector('.service-grid');
    if (!serviceGrid) return; // Safety check
    
    serviceGrid.innerHTML = ""; 

    if (data.length === 0) {
        serviceGrid.innerHTML = "<p>No services found. Run the scraper!</p>";
        return;
    }

    data.forEach(service => {
        serviceGrid.innerHTML += `
            <div class="card">
                <div class="card-content">
                    <h3>${service.name || "Unknown Business"}</h3>
                    <p class="category">${service.category || "General Service"}</p>
                    <p class="price-range">Starting at <strong>$${service.price || "???"}</strong></p>
                    <button class="btn-outline" onclick="contactVendor('${service.name}')">Compare Prices</button>
                </div>
            </div>
        `;
    });
}


// 3. Modern Real-Time Search Logic
function searchServices() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    
    // Filter the global data based on user input
    const filtered = window.allServices.filter(service => 
        service.name.toLowerCase().includes(input) || 
        service.category.toLowerCase().includes(input)
    );
    
    displayServices(filtered);
}

// 4. Your existing Alert Logic
function contactVendor(vendorName) {
    alert("Redirecting you to " + vendorName + ". This is where your lead-gen magic happens!");
}

// 5. Initialize the site
document.getElementById("year").innerHTML = new Date().getFullYear();
loadServices();
