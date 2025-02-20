document.addEventListener('DOMContentLoaded', () => {
    // ========== INIT AOS ==========
    AOS.init({
      duration: 1000,
      once: false,
    });
  
    // ========== YEAR IN FOOTER ==========
    const yearEl = document.getElementById('year');
    if(yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  
    // ========== NAV TOGGLE (Hamburger) ==========
    const toggleBtn = document.querySelector('.brand__toggle');
    const navLinks = document.querySelector('.navbar__links');
  
    if(toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
      });
    }
  
    // ========== TYPED.JS EFFECT ==========
    // Make sure typed.js is loaded in index.html (see above)
    const typedEl = document.getElementById('typed');
    if(typedEl) {
      new Typed('#typed', {
        strings: [
          "High School Student",
          "Developer",
          "AI Enthusiast",
          "Tennis Coach",
          "Math Lover at 2am",
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1200,
        loop: true,
      });
    }
  
    // ========== CONTACT FORM (EmailJS or Alert) ==========
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // For EmailJS, just as an example:
        //const templateParams = {...};
        //emailjs.send("SERVICE_ID","TEMPLATE_ID",templateParams);
  
        alert("Thanks! Your message has been submitted. (Demo)");
        contactForm.reset();
      });
    }
  });
  