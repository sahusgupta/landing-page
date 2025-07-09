/* ========== ENHANCED PORTFOLIO JAVASCRIPT ========== */

// Global variables
let scene, camera, renderer, particles;
let mouse = { x: 0, y: 0 };
let isLoading = true;
let scrollY = 0;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeLoading();
    initializeThreeJS();
    initializeGSAP();
    initializeCursor();
    initializeNavigation();
    initializeScrolling();
    initializeTyping();
    initializeStats();
    initializeTheme();
    initializeContactForm();
    
    // Start the application
    startApp();
});

/* ========== LOADING SCREEN ========== */
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    isLoading = false;
                    animateHeroElements();
                }
            });
        } else {
            // Fallback without GSAP
            loadingScreen.style.transition = 'opacity 1s ease';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                isLoading = false;
                animateHeroElements();
            }, 1000);
        }
    }, 1500);
}

/* ========== THREE.JS BACKGROUND ========== */
function initializeThreeJS() {
    try {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, skipping 3D background');
            return;
        }

        const canvas = document.getElementById('threejs-canvas');
        
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create particle system
        createParticleSystem();
        
        // Position camera
        camera.position.z = 50;
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start render loop
        animate();
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
    }
}

function createParticleSystem() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        // Color (blue-purple theme)
        const hue = Math.random() * 0.3 + 0.5; // Blue to purple range
        const color = new THREE.Color();
        color.setHSL(hue, 0.7, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Store reference for animation
    window.particleSystem = particleSystem;
}

function animate() {
    if (!scene || !renderer || !camera) return;
    
    requestAnimationFrame(animate);
    
    if (!isLoading && window.particleSystem) {
        // Rotate particles slowly
        window.particleSystem.rotation.y += 0.0005;
        window.particleSystem.rotation.x += 0.0002;
        
        // Add floating motion
        const positions = window.particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        }
        window.particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Mouse interaction
        if (mouse.x !== undefined && mouse.y !== undefined) {
            camera.position.x += (mouse.x * 2 - camera.position.x) * 0.03;
            camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);
        }
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ========== GSAP ANIMATIONS ========== */
function initializeGSAP() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, using fallback animations');
        return;
    }
    
    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        setupScrollTriggers();
    }
}

function setupScrollTriggers() {
    // About section animations
    gsap.from(".about-text .text-block", {
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    gsap.from(".stat-item", {
        scrollTrigger: {
            trigger: ".about-stats",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });
    
    // Projects section animations
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    // Timeline animations
    gsap.from(".timeline-item", {
        scrollTrigger: {
            trigger: "#experience",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        x: (index) => index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out"
    });
    
    // Contact section animations
    gsap.from(".contact-item", {
        scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });
}

function animateHeroElements() {
    const elements = [
        '.hero-greeting',
        '.hero-title .title-line',
        '.hero-subtitle',
        '.hero-description',
        '.hero-actions .btn',
        '.profile-container',
        '.scroll-indicator'
    ];
    
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        elements.forEach((selector, index) => {
            tl.from(selector, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: selector.includes('.title-line') ? 0.2 : 0.1,
                ease: "power2.out"
            }, index * 0.1);
        });
    } else {
        // Fallback CSS animations
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }
}

/* ========== CUSTOM CURSOR ========== */
function initializeCursor() {
    const cursor = document.getElementById('custom-cursor');
    let cursorVisible = false;
    
    // Show cursor on mouse enter
    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        if (typeof gsap !== 'undefined') {
            gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 });
        } else {
            cursor.style.opacity = '1';
            cursor.style.transform = 'scale(1)';
        }
    });
    
    // Hide cursor on mouse leave
    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        if (typeof gsap !== 'undefined') {
            gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.3 });
        } else {
            cursor.style.opacity = '0';
            cursor.style.transform = 'scale(0)';
        }
    });
    
    // Follow mouse movement
    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) return;
        
        // Update cursor position
        if (typeof gsap !== 'undefined') {
            gsap.to(cursor, {
                x: e.clientX - 20,
                y: e.clientY - 20,
                duration: 0.1,
                ease: "power2.out"
            });
        } else {
            cursor.style.left = (e.clientX - 20) + 'px';
            cursor.style.top = (e.clientY - 20) + 'px';
        }
        
        // Update Three.js mouse coordinates
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-item, .stat-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: "power2.out" });
            } else {
                cursor.style.transform = 'scale(1.5)';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
            } else {
                cursor.style.transform = 'scale(1)';
            }
        });
    });
}

/* ========== NAVIGATION ========== */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
                    gsap.to(spans[1], { opacity: 0, duration: 0.3 });
                    gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
                    gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                    gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
                }
            }
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: offsetTop,
                        ease: "power2.inOut"
                    });
                } else {
                    // Fallback smooth scroll
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Update active navigation
                updateActiveNavigation(link);
                
                // Close mobile menu
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        }
    });
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 80;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: offsetTop,
                        ease: "power2.inOut"
                    });
                } else {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

function updateActiveNavigation(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/* ========== SCROLLING FUNCTIONALITY ========== */
function initializeScrolling() {
    // Intersection Observer for navigation
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const navLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (navLink) {
                        updateActiveNavigation(navLink);
                    }
                }
            });
        },
        { 
            threshold: 0.6,
            rootMargin: '-80px 0px -80px 0px'
        }
    );
    
    sections.forEach(section => observer.observe(section));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrollY < window.innerHeight) {
            const offset = scrollY * 0.5;
            heroSection.style.transform = `translateY(${offset}px)`;
        }
    });
}

/* ========== TYPING ANIMATION ========== */
function initializeTyping() {
    const typedElement = document.getElementById('typed-text');
    
    if (typedElement) {
        if (typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'Full-Stack Developer',
                    'AI Enthusiast',
                    'National Merit Finalist',
                    'App Development Intern',
                    'Innovation Driver'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                loop: true,
                cursorChar: '|',
                showCursor: true
            });
        } else {
            // Fallback typing animation
            const strings = [
                'Full-Stack Developer',
                'AI Enthusiast', 
                'National Merit Finalist',
                'App Development Intern',
                'Innovation Driver'
            ];
            
            let stringIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            function type() {
                const currentString = strings[stringIndex];
                
                if (isDeleting) {
                    typedElement.textContent = currentString.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typedElement.textContent = currentString.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                let typeSpeed = isDeleting ? 30 : 50;
                
                if (!isDeleting && charIndex === currentString.length) {
                    typeSpeed = 1500;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    stringIndex = (stringIndex + 1) % strings.length;
                }
                
                setTimeout(type, typeSpeed);
            }
            
            type();
        }
    }
}

/* ========== STATISTICS COUNTER ========== */
function initializeStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetNumber = parseInt(stat.getAttribute('data-count'));
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(stat, {
                        textContent: targetNumber,
                        duration: 2,
                        ease: "power2.out",
                        snap: { textContent: 1 }
                    });
                } else {
                    // Fallback counter animation
                    let currentNumber = 0;
                    const increment = targetNumber / 60; // 60 frames for smooth animation
                    
                    const counter = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= targetNumber) {
                            currentNumber = targetNumber;
                            clearInterval(counter);
                        }
                        stat.textContent = Math.floor(currentNumber);
                    }, 33); // ~30fps
                }
                
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

/* ========== THEME TOGGLE ========== */
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(savedTheme + '-mode');
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.classList.remove(currentTheme + '-mode');
        body.classList.add(newTheme + '-mode');
        
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Animate theme transition
        if (typeof gsap !== 'undefined') {
            gsap.to(body, {
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/* ========== CONTACT FORM ========== */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('span').textContent;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(submitBtn.querySelector('span'), {
                    textContent: 'Sending...',
                    duration: 0.3
                });
            } else {
                submitBtn.querySelector('span').textContent = 'Sending...';
            }
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                if (typeof gsap !== 'undefined') {
                    gsap.to(submitBtn.querySelector('span'), {
                        textContent: 'Message Sent!',
                        duration: 0.3,
                        onComplete: () => {
                            setTimeout(() => {
                                gsap.to(submitBtn.querySelector('span'), {
                                    textContent: originalText,
                                    duration: 0.3
                                });
                            }, 2000);
                        }
                    });
                } else {
                    submitBtn.querySelector('span').textContent = 'Message Sent!';
                    setTimeout(() => {
                        submitBtn.querySelector('span').textContent = originalText;
                    }, 2000);
                }
                
                // Show success animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(contactForm, {
                        scale: 1.02,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }, 1500);
        });
    }
}

/* ========== UTILITY FUNCTIONS ========== */
function startApp() {
    // Set current year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Performance optimizations
    optimizePerformance();
    
    console.log('🚀 Portfolio website loaded successfully!');
}

function optimizePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            onWindowResize();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 250);
    });
    
    // Optimize Three.js rendering if available
    if (renderer) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

/* ========== ERROR HANDLING ========== */
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Fallback for critical failures
    if (e.error && e.error.message && (e.error.message.includes('THREE') || e.error.message.includes('WebGL'))) {
        const canvas = document.getElementById('threejs-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        console.warn('Three.js disabled due to error');
    }
});

// Prevent common errors
window.addEventListener('unhandledrejection', (e) => {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export functions for debugging
window.portfolioApp = {
    initializeThreeJS,
    initializeGSAP,
    initializeCursor,
    initializeNavigation,
    initializeScrolling,
    initializeTyping,
    initializeStats,
    initializeTheme,
    initializeContactForm
}; 