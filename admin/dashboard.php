<?php
session_start();
require_once '../api/config.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: ../sign-in.html');
    exit;
}

// Get user info
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - StyleHub</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="../assets/css/style.css" rel="stylesheet">
    <style>
        .sidebar {
            min-height: 100vh;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        .sidebar .nav-link {
            color: rgba(255,255,255,0.8);
            padding: 15px 20px;
            border-radius: 10px;
            margin: 5px 0;
            transition: all 0.3s ease;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .main-content {
            padding: 20px;
        }
        .stats-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .stats-card:hover {
            transform: translateY(-5px);
        }
        .stats-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 sidebar">
                <div class="p-3">
                    <h4 class="text-white mb-4">
                        <i class="fas fa-tshirt me-2"></i>StyleHub Admin
                    </h4>
                    <nav class="nav flex-column">
                        <a class="nav-link active" href="#dashboard" onclick="showSection('dashboard')">
                            <i class="fas fa-chart-bar me-2"></i>Dashboard
                        </a>
                        <a class="nav-link" href="#products" onclick="showSection('products')">
                            <i class="fas fa-box me-2"></i>Products
                        </a>
                        <a class="nav-link" href="#orders" onclick="showSection('orders')">
                            <i class="fas fa-shopping-cart me-2"></i>Orders
                        </a>
                        <a class="nav-link" href="#users" onclick="showSection('users')">
                            <i class="fas fa-users me-2"></i>Users
                        </a>
                        <a class="nav-link" href="#messages" onclick="showSection('messages')">
                            <i class="fas fa-envelope me-2"></i>Messages
                        </a>
                        <hr class="my-3" style="border-color: rgba(255,255,255,0.3);">
                        <a class="nav-link" href="../index.html">
                            <i class="fas fa-home me-2"></i>View Site
                        </a>
                        <a class="nav-link" href="#" onclick="logout()">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout
                        </a>
                    </nav>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 main-content">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Welcome back, <?php echo htmlspecialchars($user['first_name']); ?>!</h2>
                    <div class="d-flex align-items-center">
                        <span class="me-3">Last login: <?php echo date('M j, Y g:i A', strtotime($user['last_login'])); ?></span>
                        <img src="/placeholder.svg?height=40&width=40" alt="Profile" class="rounded-circle">
                    </div>
                </div>
                
                <!-- Dashboard Section -->
                <div id="dashboard-section" class="content-section">
                    <div class="row mb-4">
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="stats-card">
                                <div class="d-flex align-items-center">
                                    <div class="stats-icon bg-primary">
                                        <i class="fas fa-box"></i>
                                    </div>
                                    <div class="ms-3">
                                        <h3 class="mb-0" id="total-products">0</h3>
                                        <p class="text-muted mb-0">Total Products</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="stats-card">
                                <div class="d-flex align-items-center">
                                    <div class="stats-icon bg-success">
                                        <i class="fas fa-shopping-cart"></i>
                                    </div>
                                    <div class="ms-3">
                                        <h3 class="mb-0" id="total-orders">0</h3>
                                        <p class="text-muted mb-0">Total Orders</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="stats-card">
                                <div class="d-flex align-items-center">
                                    <div class="stats-icon bg-info">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="ms-3">
                                        <h3 class="mb-0" id="total-users">0</h3>
                                        <p class="text-muted mb-0">Total Users</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="stats-card">
                                <div class="d-flex align-items-center">
                                    <div class="stats-icon bg-warning">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="ms-3">
                                        <h3 class="mb-0" id="total-messages">0</h3>
                                        <p class="text-muted mb-0">New Messages</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Recent Orders</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table" id="recent-orders-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Orders will be loaded here -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-4">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Quick Actions</h5>
                                </div>
                                <div class="card-body">
                                    <div class="d-grid gap-2">
                                        <button class="btn btn-primary" onclick="showSection('products'); showAddProductModal();">
                                            <i class="fas fa-plus me-2"></i>Add New Product
                                        </button>
                                        <button class="btn btn-outline-primary" onclick="showSection('products')">
                                            <i class="fas fa-edit me-2"></i>Manage Products
                                        </button>
                                        <button class="btn btn-outline-success" onclick="showSection('orders')">
                                            <i class="fas fa-list me-2"></i>View All Orders
                                        </button>
                                        <button class="btn btn-outline-info" onclick="showSection('messages')">
                                            <i class="fas fa-envelope me-2"></i>Check Messages
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Products Section -->
                <div id="products-section" class="content-section" style="display: none;">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3>Product Management</h3>
                        <button class="btn btn-primary" onclick="showAddProductModal()">
                            <i class="fas fa-plus me-2"></i>Add New Product
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table" id="products-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Featured</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Products will be loaded here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Other sections would go here -->
                <div id="orders-section" class="content-section" style="display: none;">
                    <h3>Orders Management</h3>
                    <p>Orders management functionality would be implemented here.</p>
                </div>
                
                <div id="users-section" class="content-section" style="display: none;">
                    <h3>User Management</h3>
                    <p>User management functionality would be implemented here.</p>
                </div>
                
                <div id="messages-section" class="content-section" style="display: none;">
                    <h3>Contact Messages</h3>
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table" id="messages-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Messages will be loaded here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="productModalTitle">Add New Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <input type="hidden" id="productId">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="productName" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="productName" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="productCategory" class="form-label">Category</label>
                                <select class="form-select" id="productCategory" required>
                                    <option value="">Select Category</option>
                                    <option value="men">Men's Clothing</option>
                                    <option value="women">Women's Clothing</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="productPrice" class="form-label">Price ($)</label>
                                <input type="number" class="form-control" id="productPrice" step="0.01" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="productImage" class="form-label">Image URL</label>
                                <input type="url" class="form-control" id="productImage">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="productDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="productDescription" rows="3"></textarea>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="productFeatured">
                            <label class="form-check-label" for="productFeatured">
                                Featured Product
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveProduct()">Save Product</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="admin.js"></script>
</body>
</html>
