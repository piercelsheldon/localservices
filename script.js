// This is your data (In the future, this might come from a database)
const services = [
    { name: "Fast Plumbing", category: "Plumbing", price: 50 },
    { name: "Green Gardeners", category: "Landscaping", price: 40 },
    { name: "Sparkle Cleaners", category: "Cleaning", price: 30 }
];

// This function runs when someone types in the search bar
function searchServices() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    console.log("User is searching for: " + input);
    
    // Logic to filter the cards on the screen would go here
    // For now, it just prints the search to your browser's console
}

// Example of a button alert
function contactVendor(vendorName) {
    alert("Redirecting you to " + vendorName + ". This is where your lead-gen magic happens!");
}
