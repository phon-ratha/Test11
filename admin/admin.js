// Admin Dashboard JavaScript

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardStats()
  loadProducts()
  loadMessages()
})

// Show different sections
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".content-section")
  sections.forEach((section) => (section.style.display = "none"))

  // Show selected section
  document.getElementById(sectionName + "-section").style.display = "block"

  // Update active nav link
  const navLinks = document.querySelectorAll(".sidebar .nav-link")
  navLinks.forEach((link) => link.classList.remove("active"))
  document.querySelector(`.sidebar .nav-link[href="#${sectionName}"]`).classList.add("active")
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const response = await fetch("../api/admin-stats.php")
    const stats = await response.json()

    document.getElementById("total-products").textContent = stats.products || 0
    document.getElementById("total-orders").textContent = stats.orders || 0
    document.getElementById("total-users").textContent = stats.users || 0
    document.getElementById("total-messages").textContent = stats.messages || 0
  } catch (error) {
    console.error("Error loading stats:", error)
  }
}

// Load products
async function loadProducts() {
  try {
    const response = await fetch("../api/admin-products.php")
    const products = await response.json()

    const tbody = document.querySelector("#products-table tbody")
    tbody.innerHTML = products
      .map(
        (product) => `
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                </td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>
                    <span class="badge ${product.featured ? "bg-success" : "bg-secondary"}">
                        ${product.featured ? "Yes" : "No"}
                    </span>
                </td>
                <td>
                    <span class="badge ${product.status === "active" ? "bg-success" : "bg-danger"}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading products:", error)
  }
}

// Show add product modal
function showAddProductModal() {
  document.getElementById("productModalTitle").textContent = "Add New Product"
  document.getElementById("productForm").reset()
  document.getElementById("productId").value = ""

  const modal = document.getElementById("productModal")
  new bootstrap.Modal(modal).show()
}

// Edit product
async function editProduct(productId) {
  try {
    const response = await fetch(`../api/products.php?id=${productId}`)
    const product = await response.json()

    document.getElementById("productModalTitle").textContent = "Edit Product"
    document.getElementById("productId").value = product.id
    document.getElementById("productName").value = product.name
    document.getElementById("productCategory").value = product.category
    document.getElementById("productPrice").value = product.price
    document.getElementById("productImage").value = product.image
    document.getElementById("productDescription").value = product.description
    document.getElementById("productFeatured").checked = product.featured == 1

    const modal = document.getElementById("productModal")
    new bootstrap.Modal(modal).show()
  } catch (error) {
    console.error("Error loading product:", error)
    alert("Error loading product details")
  }
}

// Save product
async function saveProduct() {
  const productId = document.getElementById("productId").value
  const isEdit = productId !== ""

  const productData = {
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    price: document.getElementById("productPrice").value,
    image: document.getElementById("productImage").value || "/placeholder.svg?height=300&width=300",
    description: document.getElementById("productDescription").value,
    featured: document.getElementById("productFeatured").checked ? 1 : 0,
  }

  if (isEdit) {
    productData.id = productId
  }

  try {
    const response = await fetch("../api/products.php", {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })

    const result = await response.json()

    if (result.success) {
      alert(isEdit ? "Product updated successfully!" : "Product added successfully!")

      // Close modal
      const modal = document.getElementById("productModal")
      new bootstrap.Modal(modal).hide()

      // Reload products
      loadProducts()
      loadDashboardStats()
    } else {
      alert("Error saving product: " + result.error)
    }
  } catch (error) {
    console.error("Error saving product:", error)
    alert("Error saving product")
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return
  }

  try {
    const response = await fetch("../api/products.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId }),
    })

    const result = await response.json()

    if (result.success) {
      alert("Product deleted successfully!")
      loadProducts()
      loadDashboardStats()
    } else {
      alert("Error deleting product: " + result.error)
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    alert("Error deleting product")
  }
}

// Load messages
async function loadMessages() {
  try {
    const response = await fetch("../api/admin-messages.php")
    const messages = await response.json()

    const tbody = document.querySelector("#messages-table tbody")
    tbody.innerHTML = messages
      .map(
        (message) => `
            <tr>
                <td>${message.first_name} ${message.last_name}</td>
                <td>${message.email}</td>
                <td>${message.subject}</td>
                <td>${new Date(message.created_at).toLocaleDateString()}</td>
                <td>
                    <span class="badge ${message.status === "new" ? "bg-warning" : "bg-success"}">
                        ${message.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewMessage(${message.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading messages:", error)
  }
}

// View message
function viewMessage(messageId) {
  // Implementation for viewing message details
  alert("View message functionality would be implemented here")
}

// Logout
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    fetch("../api/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "logout" }),
    }).then(() => {
      window.location.href = "../sign-in.html"
    })
  }
}

// Import Bootstrap
const bootstrap = window.bootstrap
