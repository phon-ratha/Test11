// Contact page JavaScript

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

document.addEventListener("DOMContentLoaded", () => {
  initializeContactForm()
})

function initializeContactForm() {
  const form = document.getElementById("contactForm")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (validateContactForm()) {
      await submitContactForm()
    }
  })
}

function validateContactForm() {
  const firstName = document.getElementById("firstName")
  const lastName = document.getElementById("lastName")
  const email = document.getElementById("email")
  const subject = document.getElementById("subject")
  const message = document.getElementById("message")

  let isValid = true

  // Reset previous validation states
  ;[firstName, lastName, email, subject, message].forEach((field) => {
    field.classList.remove("is-invalid")
  })

  // Validate first name
  if (!firstName.value.trim()) {
    firstName.classList.add("is-invalid")
    isValid = false
  }

  // Validate last name
  if (!lastName.value.trim()) {
    lastName.classList.add("is-invalid")
    isValid = false
  }

  // Validate email
  if (!email.value.trim() || !validateEmail(email.value)) {
    email.classList.add("is-invalid")
    isValid = false
  }

  // Validate subject
  if (!subject.value) {
    subject.classList.add("is-invalid")
    isValid = false
  }

  // Validate message
  if (!message.value.trim() || message.value.trim().length < 10) {
    message.classList.add("is-invalid")
    isValid = false
  }

  return isValid
}

async function submitContactForm() {
  const form = document.getElementById("contactForm")
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  try {
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'
    submitBtn.disabled = true

    const formData = new FormData(form)
    const data = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    }

    const response = await fetch("api/contact.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Message sent successfully! We'll get back to you soon.", "success")
      form.reset()
    } else {
      throw new Error(result.message || "Failed to send message")
    }
  } catch (error) {
    console.error("Error sending message:", error)
    showNotification("Error sending message. Please try again later.", "error")
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }
}
