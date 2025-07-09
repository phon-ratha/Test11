// Authentication JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeAuthForms()
})

function initializeAuthForms() {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }
}

// Show sign up form
function showSignUp() {
  document.getElementById("signInForm").classList.remove("active")
  document.getElementById("signUpForm").classList.add("active")
}

// Show sign in form
function showSignIn() {
  document.getElementById("signUpForm").classList.remove("active")
  document.getElementById("signInForm").classList.add("active")
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    button.classList.remove("fa-eye")
    button.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    button.classList.remove("fa-eye-slash")
    button.classList.add("fa-eye")
  }
}

// Handle login
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  // Basic validation
  if (!email || !password) {
    showNotification("Please fill in all fields", "error")
    return
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  if (!validateEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  try {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...'
    submitBtn.disabled = true

    const response = await fetch("api/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        email: email,
        password: password,
      }),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Login successful! Redirecting...", "success")

      // Store user data
      localStorage.setItem("user", JSON.stringify(result.user))

      // Redirect based on user role
      setTimeout(() => {
        if (result.user.role === "admin") {
          window.location.href = "admin/dashboard.php"
        } else {
          window.location.href = "index.html"
        }
      }, 1500)
    } else {
      throw new Error(result.message || "Login failed")
    }
  } catch (error) {
    console.error("Login error:", error)
    showNotification(error.message || "Login failed. Please try again.", "error")
  } finally {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}

// Handle registration
async function handleRegister(e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const agreeTerms = document.getElementById("agreeTerms").checked
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields", "error")
    return
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  if (!validateEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  const checkPasswordStrength = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    return { isValid: re.test(password) }
  }

  const passwordStrength = checkPasswordStrength(password)
  if (!passwordStrength.isValid) {
    showNotification(
      "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers",
      "error",
    )
    return
  }

  if (!agreeTerms) {
    showNotification("Please agree to the terms and conditions", "error")
    return
  }

  try {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...'
    submitBtn.disabled = true

    const response = await fetch("api/auth.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "register",
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Account created successfully! Please sign in.", "success")

      // Clear form and switch to login
      document.getElementById("registerForm").reset()
      setTimeout(() => {
        showSignIn()
      }, 1500)
    } else {
      throw new Error(result.message || "Registration failed")
    }
  } catch (error) {
    console.error("Registration error:", error)
    showNotification(error.message || "Registration failed. Please try again.", "error")
  } finally {
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}

// Notification function
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.classList.add("notification", type)
  notification.innerHTML = message
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}
