<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getProduct($_GET['id']);
        } elseif (isset($_GET['featured'])) {
            getFeaturedProducts();
        } else {
            getAllProducts();
        }
        break;
    case 'POST':
        createProduct();
        break;
    case 'PUT':
        updateProduct();
        break;
    case 'DELETE':
        deleteProduct();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllProducts() {
    global $pdo;
    
    try {
        $stmt = $pdo->query("SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($products);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getProduct($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND status = 'active'");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($product) {
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getFeaturedProducts() {
    global $pdo;
    
    try {
        $stmt = $pdo->query("SELECT * FROM products WHERE featured = 1 AND status = 'active' ORDER BY created_at DESC LIMIT 6");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($products);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createProduct() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['price']) || !isset($input['category'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO products (name, description, price, category, image, featured, status) VALUES (?, ?, ?, ?, ?, ?, 'active')");
        $stmt->execute([
            $input['name'],
            $input['description'] ?? '',
            $input['price'],
            $input['category'],
            $input['image'] ?? '/placeholder.svg?height=300&width=300',
            $input['featured'] ?? 0
        ]);
        
        $productId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'id' => $productId,
            'message' => 'Product created successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateProduct() {
    global $pdo;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, featured = ? WHERE id = ?");
        $stmt->execute([
            $input['name'],
            $input['description'],
            $input['price'],
            $input['category'],
            $input['image'],
            $input['featured'] ?? 0,
            $input['id']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteProduct() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }
    
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("UPDATE products SET status = 'deleted' WHERE id = ?");
        $stmt->execute([$input['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
