// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Navbar background on scroll
const nav = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("shadow-lg");
  } else {
    nav.classList.remove("shadow-lg");
  }
});
// EMAILJS INTEGRATION - UPDATED FOR ALL FIELD

// Add EmailJS SDK to my web  page
(function () {
  // Load EmailJS SDK
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  script.onload = function () {
    // Initialize EmailJS with YOUR PUBLIC KEY
    emailjs.init("onGXsnomyfbaJ9Vv5");
    console.log(" EmailJS initialized successfully");
  };
  document.head.appendChild(script);
})();

// from submission from user 
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      //  Required Element fromvthe form
      const submitBtn = document.getElementById("submitBtn");
      const btnText = document.getElementById("btnText");
      const spinner = document.getElementById("spinner");
      const sendIcon = document.getElementById("sendIcon");
      const successMessage = document.getElementById("successMessage");
      const errorMessage = document.getElementById("errorMessage");

      // Hide previous messages
      successMessage.classList.add("hidden");
      errorMessage.classList.add("hidden");

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      // From Validation and Confirmation
      if (!name || !email || !subject || !message) {
        showMessage(errorMessage, " Please fill in all fields");
        return;
      }

      if (!validateEmail(email)) {
        showMessage(errorMessage, " Please enter a valid email address");
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      btnText.textContent = "Sending...";
      spinner.classList.remove("hidden");
      sendIcon.classList.add("hidden");
      submitBtn.classList.add("opacity-70", "cursor-not-allowed");

      try {
        // Prepare ALL template parameters for EmailJS
        const templateParams = {
          // REQUIRED: These must match your EmailJS template variables
          name: name, // {{name}}
          email: email, // {{email}}
          subject: subject, // {{subject}}
          message: message, // {{message}}

          // Optional: Additional info
          date: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),

          // For the email "to" and "reply_to" fields
          to_name: "Ayomide",
          reply_to: email,
          from_name: name,
        };

        console.log(" Sending email with data:", templateParams);

        // Send email using EmailJS
        const response = await emailjs.send(
          "service_yrem8dr", // Here is my servoce ID 
          "template_r24k5fe", // My  Template ID 
          templateParams
        );

        console.log(" Email sent successfully:", response);

        // Show success message, whenn sent 
        showMessage(
          successMessage,
          " Message sent successfully! We will get back to you soon at  " +
            email
        );

        // Reset form
        contactForm.reset();

        // Remove validation styling
        document
          .querySelectorAll("#contactForm input, #contactForm textarea")
          .forEach((input) => {
            input.classList.remove("border-red-300", "border-green-300");
            input.classList.add("border-gray-300");
          });

        // Hide success message after 8 seconds
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 8000);
      } catch (error) {
        console.error("Eror!!!  Failed to send email:", error);

        // Detailed error handling
        let errorText = "Failed to send message. ";

        if (error.status === 400) {
          errorText += "Bad request - check template variables.";
        } else if (error.status === 401) {
          errorText += "Unauthorized - check your API keys.";
        } else if (error.status === 0) {
          errorText += "Network error - check your internet connection.";
        } else if (error.text) {
          errorText += `Error: ${error.text}`;
        }

        showMessage(errorMessage, `❌ ${errorText}`);

        // Hide error message after 8 seconds
        setTimeout(() => {
          errorMessage.classList.add("hidden");
        }, 8000);
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = "Send Message";
        spinner.classList.add("hidden");
        sendIcon.classList.remove("hidden");
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
      }
    });
  }

  // Test connection on load
  setTimeout(testEmailJSConnection, 2000);
});

// Test EmailJS connection
function testEmailJSConnection() {
  if (typeof emailjs !== "undefined") {
    console.log("✅ EmailJS SDK loaded");
  } else {
    console.log(" EmailJS SDK not loaded");
  }
}

// Helper function to show messages
function showMessage(element, text) {
  const messageSpan = element.querySelector("span");
  if (messageSpan) {
    messageSpan.textContent = text;
  } else {
    // If no span, set the text directly
    element.innerHTML = text;
  }
  element.classList.remove("hidden");
  element.classList.add("animate__animated", "animate__fadeIn");
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Setup form validation
function setupFormValidation() {
  const formInputs = document.querySelectorAll(
    "#contactForm input, #contactForm textarea"
  );

  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      this.classList.remove("border-red-500", "border-green-500");
      this.classList.add("border-gray-300");
    });
  });
}

// Validate individual field
function validateField(field) {
  if (field.value.trim() === "") {
    field.classList.remove("border-green-500", "border-gray-300");
    field.classList.add("border-red-500");
    return false;
  }

  if (field.type === "email" && !validateEmail(field.value)) {
    field.classList.remove("border-green-500", "border-gray-300");
    field.classList.add("border-red-500");
    return false;
  }

  field.classList.remove("border-red-500", "border-gray-300");
  field.classList.add("border-green-500");
  return true;
}
