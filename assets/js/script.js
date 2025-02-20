document.addEventListener('DOMContentLoaded', () => {
    // 1) Initialize AOS
    AOS.init({
      duration: 1000, // animation duration in ms
      once: false,    // whether animation should happen only once
    });
  
    // 2) Set current year in footer
    const yearEl = document.getElementById('year');
    if(yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  
    // 3) Hamburger menu toggle
    const toggleBtn = document.querySelector('.brand__toggle');
    const navLinks = document.querySelector('.navbar__links');
  
    if(toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
      });
    }
  
    // 4) Contact form submission
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Simple demonstration - replace with a real email-handling service
        alert('Thank you! Your message has been sent. (This is a demo.)');
        contactForm.reset();
      });
    }
  });
  