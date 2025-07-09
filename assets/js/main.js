// Main JavaScript file for StyleHub

document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initializeAnimations()

  // Initialize navigation
  initializeNavigation()

  // Load featured products on home page
  if (document.getElementById("featured-products")) {
    loadFeaturedProducts()
  }
})

// Animation Observer
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    ".animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right",
  )
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.8s ease-out"
    observer.observe(el)
  })
}

// Navigation functionality
function initializeNavigation() {
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// Load featured products
async function loadFeaturedProducts() {
  const container = document.getElementById("featured-products")

  try {
    const response = await fetch("api/products.php?featured=true")
    const products = await response.json()

    container.innerHTML = products
      .map(
        (product) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card product-card animate-card">
                    <div class="product-image">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="product-overlay">
                            <button class="btn btn-light" onclick="viewProduct(${product.id})">
                                <i class="fas fa-eye me-2"></i>View Details
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text text-muted">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">$${product.price}</span>
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading products:", error)
    container.innerHTML = '<div class="col-12 text-center"><p>Error loading products. Please try again later.</p></div>'
  }
}

// View product details
function viewProduct(productId) {
  window.location.href = `products.html?id=${productId}`
}

// Add to cart functionality
function addToCart(productId) {
  // Get existing cart or create new one
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ id: productId, quantity: 1 })
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Show success message
  showNotification("Product added to cart!", "success")

  // Update cart counter
  updateCartCounter()
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} notification`
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `
  notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 3000)
}

// Update cart counter
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const counter = document.querySelector(".cart-counter")
  if (counter) {
    counter.textContent = totalItems
    counter.style.display = totalItems > 0 ? "block" : "none"
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Form validation helper
function validateForm(formId) {
  const form = document.getElementById(formId)
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
    }
  })

  return isValid
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Password strength checker
function checkPasswordStrength(password) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let strength = 0
  if (password.length >= minLength) strength++
  if (hasUpperCase) strength++
  if (hasLowerCase) strength++
  if (hasNumbers) strength++
  if (hasSpecialChar) strength++

  return {
    score: strength,
    isValid: strength >= 3 && password.length >= minLength,
  }
}

// Initialize cart counter on page load
document.addEventListener("DOMContentLoaded", updateCartCounter)
