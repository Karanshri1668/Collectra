// ===============================
// SELECT IMPORTANT UI ELEMENTS
// ===============================

const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal");
const saveBtn = document.querySelector(".save-btn");
const cardContainer = document.querySelector(".card-container");
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");

// ===============================
// FORM INPUT ELEMENTS
// ===============================

const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const imageInput = document.getElementById("imageInput");
const categoryInput = document.getElementById("categoryInput");
const youtubeInput = document.getElementById("youtubeInput");
const spotifyInput = document.getElementById("spotifyInput");
const websiteInput = document.getElementById("websiteInput");
const bookmarkInput = document.getElementById("bookmarkInput");

const songFields = document.getElementById("songFields");
const websiteFields = document.getElementById("websiteFields");
const bookmarkFields = document.getElementById("bookmarkFields");

// ===============================
// TRACK CURRENT CATEGORY
// ===============================

let currentCategory = "songs";

// ===============================
// SIDEBAR TOGGLE LOGIC
// ===============================

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
});

// ===============================
// OPEN MODAL WITH FORM RESET
// ===============================

addBtn.addEventListener("click", () => {
    // Reset form
    titleInput.value = "";
    descInput.value = "";
    imageInput.value = "";
    youtubeInput.value = "";
    spotifyInput.value = "";
    websiteInput.value = "";
    bookmarkInput.value = "";
    
    // Set default category
    categoryInput.value = "songs";
    
    // Show correct fields
    songFields.style.display = "block";
    websiteFields.style.display = "none";
    bookmarkFields.style.display = "none";
    
    modal.classList.remove("hidden");
});

// ===============================
// CLOSE MODAL WHEN CLICK OUTSIDE
// ===============================

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// ===============================
// CHANGE INPUT FIELDS BASED ON CATEGORY
// ===============================

categoryInput.addEventListener("change", () => {
    const category = categoryInput.value;
    
    songFields.style.display = "none";
    websiteFields.style.display = "none";
    bookmarkFields.style.display = "none";
    
    if (category === "songs") {
        songFields.style.display = "block";
    } else if (category === "websites") {
        websiteFields.style.display = "block";
    } else if (category === "bookmarks") {
        bookmarkFields.style.display = "block";
    }
});

// ===============================
// SAVE ITEM TO LOCAL STORAGE
// ===============================

saveBtn.addEventListener("click", function(e) {
    e.preventDefault(); // Prevent any form submission
    
    console.log("Save button clicked"); // Debug log
    
    // Validate required fields
    if (!titleInput.value.trim()) {
        alert("Please enter a title");
        return;
    }
    
    const category = categoryInput.value;
    let links = {};

    // Validate and save links based on category
    if (category === "songs") {
        if (!youtubeInput.value.trim() && !spotifyInput.value.trim()) {
            alert("Please enter at least one link (YouTube or Spotify)");
            return;
        }
        if (youtubeInput.value.trim()) links.youtube = youtubeInput.value.trim();
        if (spotifyInput.value.trim()) links.spotify = spotifyInput.value.trim();
    } else if (category === "websites") {
        if (!websiteInput.value.trim()) {
            alert("Please enter a website URL");
            return;
        }
        links.website = websiteInput.value.trim();
    } else if (category === "bookmarks") {
        if (!bookmarkInput.value.trim()) {
            alert("Please enter a bookmark URL");
            return;
        }
        links.bookmark = bookmarkInput.value.trim();
    }

    const newItem = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        image: imageInput.value.trim(),
        category: category,
        links: links
    };

    console.log("New item:", newItem); // Debug log

    // Get existing data from localStorage
    let vault = JSON.parse(localStorage.getItem("collectraVault")) || [];
    
    // Add new item
    vault.push(newItem);
    
    // Save back to localStorage
    localStorage.setItem("collectraVault", JSON.stringify(vault));
    
    console.log("Saved to localStorage:", vault); // Debug log

    // Refresh UI
    displayItems();

    // Close modal
    modal.classList.add("hidden");
    
    // Show success message
    alert("Item saved successfully!");
});

// ===============================
// DISPLAY ITEMS FUNCTION
// ===============================

function displayItems() {
    cardContainer.innerHTML = "";
    
    // Get data from localStorage
    let vault = JSON.parse(localStorage.getItem("collectraVault")) || [];
    
    console.log("Loading items for category:", currentCategory); // Debug log
    console.log("All items:", vault); // Debug log
    
    // Filter items by category
    let filteredVault = vault.filter(item => item.category === currentCategory);

    if (filteredVault.length === 0) {
        // Show empty state
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `
            <i class="fa-solid fa-folder-open"></i>
            <p>No items found</p>
            <p class="hint">Click the "Add Item" button to get started!</p>
        `;
        cardContainer.appendChild(emptyState);
        return;
    }

    // Loop through items
    filteredVault.forEach(item => {
        const card = document.createElement("div");
        card.className = "collectra-card";

        // Generate link buttons dynamically
        let linksHTML = "";

        if (item.links && item.links.youtube) {
            linksHTML += `
            <a href="${item.links.youtube}" target="_blank" class="link youtube">
                <i class="fa-brands fa-youtube"></i>
                YouTube
            </a>
            `;
        }

        if (item.links && item.links.spotify) {
            linksHTML += `
            <a href="${item.links.spotify}" target="_blank" class="link spotify">
                <i class="fa-brands fa-spotify"></i>
                Spotify
            </a>
            `;
        }

        if (item.links && item.links.website) {
            linksHTML += `
            <a href="${item.links.website}" target="_blank" class="link website">
                <i class="fa-solid fa-globe"></i>
                Visit
            </a>
            `;
        }

        if (item.links && item.links.bookmark) {
            linksHTML += `
            <a href="${item.links.bookmark}" target="_blank" class="link bookmark">
                <i class="fa-solid fa-bookmark"></i>
                Open
            </a>
            `;
        }

        card.innerHTML = `
            <button class="delete-btn" onclick="deleteItem(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
            <div class="card-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}" 
                     alt="${item.title}"
                     onerror="this.src='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'">
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description || "No description"}</p>
                <div class="card-links">
                    ${linksHTML}
                </div>
            </div>
        `;

        cardContainer.appendChild(card);
    });
}

// ===============================
// DELETE FUNCTION
// ===============================

// window.deleteItem = function(id) {
//     if (confirm("Are you sure you want to delete this item?")) {
//         let vault = JSON.parse(localStorage.getItem("collectraVault")) || [];
//         vault = vault.filter(item => item.id !== id);
//         localStorage.setItem("collectraVault", JSON.stringify(vault));
//         displayItems();
//     }
// };
window.deleteItem = function(id) {
        let vault = JSON.parse(localStorage.getItem("collectraVault")) || [];
        vault = vault.filter(item => item.id !== id);
        localStorage.setItem("collectraVault", JSON.stringify(vault));
        displayItems();
};

// ===============================
// CATEGORY SWITCHING
// ===============================

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        navButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentCategory = button.dataset.category;
        displayItems();
    });
});

// ===============================
// EXPORT BACKUP
// ===============================

const exportBtn = document.querySelector(".export-btn");

exportBtn.addEventListener("click", () => {
    let vault = localStorage.getItem("collectraVault");
    
    if (!vault || vault === "[]") {
        alert("No data to export");
        return;
    }

    const blob = new Blob([vault], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `collectra_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
});

// ===============================
// INITIAL LOAD
// ===============================

// Initialize with sample data if vault is empty
if (!localStorage.getItem("collectraVault")) {
    const sampleData = [
        {
            id: Date.now() - 1000,
            title: "Bohemian Rhapsody",
            description: "Classic rock masterpiece by Queen",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            category: "songs",
            links: {
                youtube: "https://youtube.com/watch?v=fJ9rUzIMcZQ",
                spotify: "https://open.spotify.com/track/3z8h0TU7ReDPLIbEnYhWZb"
            }
        },
        {
            id: Date.now() - 2000,
            title: "GitHub",
            description: "Where the world builds software",
            image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            category: "websites",
            links: {
                website: "https://github.com"
            }
        }
    ];
    localStorage.setItem("collectraVault", JSON.stringify(sampleData));
}

// Display items on load
displayItems();