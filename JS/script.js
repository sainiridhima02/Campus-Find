
// Get the Lost Item Form
const lostForm = document.getElementById("lostForm");

if (lostForm) {

    lostForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Collect form details
        const item = {
            id: Date.now(),
            type: "Lost",
            name: document.getElementById("itemName").value,
            category: document.getElementById("category").value,
            location: document.getElementById("location").value,
            date: document.getElementById("dateLost").value,
            description: document.getElementById("description").value,
            user: document.getElementById("userName").value,
            contact: document.getElementById("contact").value
        };

        // Get previously saved items
        let items = JSON.parse(localStorage.getItem("campusItems")) || [];

        // Add new item
        items.push(item);

        // Save items in browser
        localStorage.setItem("campusItems", JSON.stringify(items));

        alert("Lost item reported successfully!");

        // Clear the form
        lostForm.reset();

    });

}

// Found Item Form
const foundForm = document.getElementById("foundForm");

if (foundForm) {

    foundForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Collect found item details
        const item = {
            id: Date.now(),
            type: "Found",
            name: document.getElementById("foundName").value,
            category: document.getElementById("foundCategory").value,
            location: document.getElementById("foundLocation").value,
            date: document.getElementById("foundDate").value,
            description: document.getElementById("foundDescription").value,
            user: document.getElementById("foundUser").value,
            contact: document.getElementById("foundContact").value
        };

        // Get saved items
        let items = JSON.parse(localStorage.getItem("campusItems")) || [];

        // Store the new found item
        items.push(item);

        localStorage.setItem("campusItems", JSON.stringify(items));

        alert("Found item reported successfully!");

        foundForm.reset();

    });

}

/* Display and Search Items */

const itemContainer = document.getElementById("itemContainer");

if (itemContainer) {

    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    function displayItems() {

        let items = JSON.parse(localStorage.getItem("campusItems")) || [];

        const searchText = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedCategory = categoryFilter.value;

        // Filter items
        let filteredItems = items.filter(function(item) {

            return (
                (item.name.toLowerCase().includes(searchText) ||
                item.location.toLowerCase().includes(searchText)) &&
                (selectedType === "All" || item.type === selectedType) &&
                (selectedCategory === "All" || item.category === selectedCategory)
            );

        });

        itemContainer.innerHTML = "";

        if (filteredItems.length === 0) {
            itemContainer.innerHTML =
                "<p class='no-items'>No matching items found.</p>";
            return;
        }

        // Display item cards
        filteredItems.forEach(function(item) {

            const card = document.createElement("div");

            card.className = "item-card";

            card.innerHTML = `
                <span class="item-badge ${item.type === "Lost" ? "lost-badge" : "found-badge"}">
                    ${item.type}
                </span>

                <h3>${item.name}</h3>

                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p>${item.description}</p>

                <button onclick="openClaim(${item.id})">
                    Claim Item
                </button>
            `;

            itemContainer.appendChild(card);

        });

    }

    searchInput.addEventListener("input", displayItems);
    typeFilter.addEventListener("change", displayItems);
    categoryFilter.addEventListener("change", displayItems);

    displayItems();
}

function openClaim(id) {
    localStorage.setItem("selectedItem", id);
    window.location.href = "claim.html";
}

/* Claim Item Functionality */

const claimForm = document.getElementById("claimForm");
const selectedItemDetails = document.getElementById("selectedItemDetails");

let selectedItemId = localStorage.getItem("selectedItem");
let allItems = JSON.parse(localStorage.getItem("campusItems")) || [];

let selectedItem = allItems.find(function(item) {
    return item.id == selectedItemId;
});

// Display selected item
if (selectedItemDetails) {

    if (selectedItem) {

        selectedItemDetails.innerHTML = `
            <h3>Selected Item</h3>
            <p><strong>Name:</strong> ${selectedItem.name}</p>
            <p><strong>Type:</strong> ${selectedItem.type}</p>
            <p><strong>Location:</strong> ${selectedItem.location}</p>
        `;

    } else {

        selectedItemDetails.innerHTML = `
            <p>No item selected. 
            <a href="search.html">Browse items here</a>.</p>
        `;

    }
}

// Submit claim
if (claimForm) {

    claimForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!selectedItem) {
            alert("Please select an item from the search page first.");
            return;
        }

        const claim = {
            claimId: Date.now(),
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            name: document.getElementById("claimName").value,
            contact: document.getElementById("claimContact").value,
            reason: document.getElementById("claimReason").value,
            status: "Pending"
        };

        let claims = JSON.parse(localStorage.getItem("campusClaims")) || [];

        claims.push(claim);

        localStorage.setItem("campusClaims", JSON.stringify(claims));

        alert("Your claim has been submitted successfully!");

        claimForm.reset();

        window.location.href = "status.html";

    });

}

/* Display Claim Status */

const claimsContainer = document.getElementById("claimsContainer");

if (claimsContainer) {

    let claims = JSON.parse(localStorage.getItem("campusClaims")) || [];

    if (claims.length === 0) {

        claimsContainer.innerHTML =
            "<p class='no-items'>No claims have been submitted yet.</p>";

    } else {

        claimsContainer.innerHTML = "";

        claims.forEach(function(claim) {

            const card = document.createElement("div");

            card.className = "claim-card";

            card.innerHTML = `
                <h3>${claim.itemName}</h3>

                <p><strong>Claimant:</strong> ${claim.name}</p>

                <p><strong>Contact:</strong> ${claim.contact}</p>

                <p><strong>Reason:</strong> ${claim.reason}</p>

                <p>
                    <strong>Status:</strong>
                    <span class="status-badge pending">
                        ${claim.status}
                    </span>
                </p>
            `;

            claimsContainer.appendChild(card);

        });

    }
}

