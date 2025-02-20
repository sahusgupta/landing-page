document.addEventListener('DOMContentLoaded', () => {
    // 1) Initialize AOS
    AOS.init({
      duration: 1000,
      once: false,
    });
  
    // 2) Set the current year in the footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
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
  
    // 4) Typed.js effect in hero subtitle
    const typedEl = document.getElementById('typed');
    if (typedEl) {
      new Typed('#typed', {
        strings: [
          "High School Student",
          "Developer",
          "AI Enthusiast",
          "Tennis Coach",
          "Math Lover @ 2 AM"
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1200,
        loop: true,
      });
    }
  
    // 5) Dark/Light mode toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const bodyEl = document.body;
  
    // Check localStorage for theme
    let savedTheme = localStorage.getItem('theme') || 'dark';
    bodyEl.classList.remove('light-mode', 'dark-mode');
    bodyEl.classList.add(`${savedTheme}-mode`);
    themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  
    // On button click, toggle theme
    if(themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        if(bodyEl.classList.contains('dark-mode')) {
          bodyEl.classList.remove('dark-mode');
          bodyEl.classList.add('light-mode');
          themeIcon.textContent = '🌙';
          localStorage.setItem('theme', 'light');
        } else {
          bodyEl.classList.remove('light-mode');
          bodyEl.classList.add('dark-mode');
          themeIcon.textContent = '☀️';
          localStorage.setItem('theme', 'dark');
        }
      });
    }
  
    // 6) Custom Cursor
    const customCursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', (e) => {
      customCursor.style.top = e.clientY + 'px';
      customCursor.style.left = e.clientX + 'px';
    });
  
    // OPTIONAL: If you want the cursor to grow/shrink on link hover
    // you can add event listeners for mouseover/mouseout
    const hoverElements = document.querySelectorAll('a, button');
    hoverElements.forEach(el => {
      el.addEventListener('mouseover', () => {
        customCursor.style.transform = 'scale(1.8)';
      });
      el.addEventListener('mouseout', () => {
        customCursor.style.transform = 'scale(1)';
      });
    });
  
    // Example Contact Form Handler (if you have one on this page)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // If using EmailJS, integrate here, otherwise:
        alert("Thank you! Your message has been sent. (Demo)");
        contactForm.reset();
      });
    }
  });
  