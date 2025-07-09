// Products page JavaScript

let allProducts = []
let filteredProducts = []
let currentPage = 1
const productsPerPage = 12
const bootstrap = window.bootstrap // Declare bootstrap variable

document.addEventListener("DOMContentLoaded", () => {
  loadProducts()
  initializeFilters()
})

// Load all products
async function loadProducts() {
  const loading = document.getElementById("loading")
  const grid = document.getElementById("products-grid")

  try {
    loading.style.display = "block"

    const response = await fetch("api/products.php")
    allProducts = await response.json()
    filteredProducts = [...allProducts]

    displayProducts()
  } catch (error) {
    console.error("Error loading products:", error)
    grid.innerHTML =
      '<div class="col-12 text-center"><p class="text-danger">Error loading products. Please try again later.</p></div>'
  } finally {
    loading.style.display = "none"
  }
}

// Display products
function displayProducts() {
  const grid = document.getElementById("products-grid")
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const productsToShow = filteredProducts.slice(startIndex, endIndex)

  if (productsToShow.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center"><p>No products found matching your criteria.</p></div>'
    return
  }

  grid.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card animate-card">
                <div class="product-image">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                    <div class="product-overlay">
                        <button class="btn btn-light me-2" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye me-2"></i>Quick View
                        </button>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">$${product.price}</span>
                        <div class="btn-group" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="addToWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Add animation to new cards
  const cards = grid.querySelectorAll(".product-card")
  cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    setTimeout(() => {
      card.style.transition = "all 0.5s ease-out"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Initialize filters
function initializeFilters() {
  const categoryFilter = document.getElementById("categoryFilter")
  const priceFilter = document.getElementById("priceFilter")
  const searchInput = document.getElementById("searchInput")

  categoryFilter.addEventListener("change", filterProducts)
  priceFilter.addEventListener("change", filterProducts)
  searchInput.addEventListener("input", debounce(filterProducts, 300))
}

// Filter products
function filterProducts() {
  const category = document.getElementById("categoryFilter").value
  const priceRange = document.getElementById("priceFilter").value
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()

  filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (category && product.category !== category) {
      return false
    }

    // Price filter
    if (priceRange) {
      const price = Number.parseFloat(product.price)
      if (priceRange === "0-50" && (price < 0 || price > 50)) return false
      if (priceRange === "50-100" && (price < 50 || price > 100)) return false
      if (priceRange === "100+" && price < 100) return false
    }

    // Search filter
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm) &&
      !product.description.toLowerCase().includes(searchTerm)
    ) {
      return false
    }

    return true
  })

  currentPage = 1
  displayProducts()
}

// View product details in modal
async function viewProductDetails(productId) {
  try {
    const response = await fetch(`api/products.php?id=${productId}`)
    const product = await response.json()

    // Populate modal
    document.getElementById("modalProductName").textContent = product.name
    document.getElementById("modalProductPrice").textContent = `$${product.price}`
    document.getElementById("modalProductDescription").textContent = product.description
    document.getElementById("modalProductImage").src = product.image
    document.getElementById("modalProductImage").alt = product.name

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("productModal"))
    modal.show()
  } catch (error) {
    console.error("Error loading product details:", error)
    showNotification("Error loading product details", "error")
  }
}

// Add to wishlist
function addToWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  if (!wishlist.includes(productId)) {
    wishlist.push(productId)
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    showNotification("Added to wishlist!", "success")
  } else {
    showNotification("Already in wishlist!", "info")
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
