// 1. Initial function to fetch your scraped data
async function loadServices() {
    try {
        const response = await fetch('./services-data.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        const services = await response.json();
        window.allServices = services;
        displayServices(services);
        console.log("Success: Data loaded.");
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// 2. Build the cards on your screen
function displayServices(data) {
    const serviceGrid = document.querySelector('.service-grid');
    if (!serviceGrid) return;
    serviceGrid.innerHTML = ""; 

    data.forEach(service => {
        const name = service.name || "Unknown";
        const price = service.price || "Contact for Quote";
        
        serviceGrid.innerHTML += `
            <div class="card">
                <div class="card-content">
                    <h3>${name}</h3>
                    <p class="category">${service.category || "Local Service"}</p>
                    <p class="price-range">Starting at <strong>$${price}</strong></p>
                    <button class="btn-outline" onclick="contactVendor('${name}')">Compare Prices</button>
                </div>
            </div>
        `;
    });
}

// 3. Search Logic (Fixed the reference error)
function searchServices() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    if (!window.allServices) return;

    const filtered = window.allServices.filter(service => 
        (service.name && service.name.toLowerCase().includes(input)) || 
        (service.category && service.category.toLowerCase().includes(input))
    );
    displayServices(filtered);
}

// 4. Alert Logic
function contactVendor(vendorName) {
    alert("Redirecting you to " + vendorName);
}

// 5. Initialize the site
window.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.innerHTML = new Date().getFullYear();
    loadServices();
});
