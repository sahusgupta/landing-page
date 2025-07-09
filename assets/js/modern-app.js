/* ========== MODERN PORTFOLIO JAVASCRIPT ========== */

// Global variables
let scene, camera, renderer, particles, mouse, raycaster;
let scroll, cursor, threeJsScene;
let isLoading = true;
let currentSection = 'home';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core components
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
    }, 2000);
}

/* ========== THREE.JS BACKGROUND ========== */
function initializeThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create particle system
    createParticleSystem();
    
    // Create floating geometries
    createFloatingGeometries();
    
    // Mouse interaction
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    
    // Position camera
    camera.position.z = 50;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start render loop
    animate();
}

function createParticleSystem() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        // Color
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Size
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Store reference for animation
    window.particleSystem = particleSystem;
}

function createFloatingGeometries() {
    const geometries = [];
    
    // Create different geometric shapes
    const shapes = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.ConeGeometry(1, 2, 8),
        new THREE.TorusGeometry(1, 0.3, 8, 16)
    ];
    
    for (let i = 0; i < 8; i++) {
        const geometry = shapes[Math.floor(Math.random() * shapes.length)];
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.4, 0.7, 0.5),
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
        );
        
        mesh.userData = {
            originalPosition: mesh.position.clone(),
            rotationSpeed: {
                x: Math.random() * 0.01,
                y: Math.random() * 0.01,
                z: Math.random() * 0.01
            }
        };
        
        scene.add(mesh);
        geometries.push(mesh);
    }
    
    window.floatingGeometries = geometries;
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isLoading) {
        // Animate particles
        if (window.particleSystem) {
            window.particleSystem.rotation.y += 0.001;
            const positions = window.particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            }
            
            window.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate floating geometries
        if (window.floatingGeometries) {
            window.floatingGeometries.forEach(mesh => {
                mesh.rotation.x += mesh.userData.rotationSpeed.x;
                mesh.rotation.y += mesh.userData.rotationSpeed.y;
                mesh.rotation.z += mesh.userData.rotationSpeed.z;
                
                // Floating motion
                mesh.position.y = mesh.userData.originalPosition.y + Math.sin(Date.now() * 0.001) * 2;
            });
        }
        
        // Mouse interaction
        updateMouseInteraction();
    }
    
    renderer.render(scene, camera);
}

function updateMouseInteraction() {
    if (mouse.x !== undefined && mouse.y !== undefined) {
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ========== GSAP ANIMATIONS ========== */
function initializeGSAP() {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // Set up scroll triggers for sections
    setupScrollTriggers();
}

function setupScrollTriggers() {
    // About section animations
    gsap.timeline({
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    })
    .from(".about-text .text-block", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    })
    .from(".stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.3");
    
    // Projects section animations
    gsap.timeline({
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    })
    .from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });
    
    // Timeline animations
    gsap.timeline({
        scrollTrigger: {
            trigger: "#experience",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    })
    .from(".timeline-item", {
        x: (index) => index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out"
    });
    
    // Contact section animations
    gsap.timeline({
        scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    })
    .from(".contact-item", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    })
    .from(".contact-form-container", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4");
}

function animateHeroElements() {
    const tl = gsap.timeline();
    
    tl.from(".hero-greeting", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    .from(".title-line", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4")
    .from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.3")
    .from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.3")
    .from(".hero-actions .btn", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.3")
    .from(".profile-container", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=0.8")
    .from(".scroll-indicator", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3");
}

/* ========== CUSTOM CURSOR ========== */
function initializeCursor() {
    const cursor = document.getElementById('custom-cursor');
    
    // Show cursor on mouse enter
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3 });
    });
    
    // Hide cursor on mouse leave
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.3 });
    });
    
    // Follow mouse movement
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX - 20,
            y: e.clientY - 20,
            duration: 0.1,
            ease: "power2.out"
        });
        
        // Update Three.js mouse coordinates
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3, ease: "power2.out" });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out" });
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
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotation: -45, y: -6, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: targetElement,
                    ease: "power2.inOut"
                });
                
                // Update active navigation
                updateActiveNavigation(link);
                
                // Close mobile menu
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
}

function updateActiveNavigation(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/* ========== SMOOTH SCROLLING ========== */
function initializeScrolling() {
    // Initialize Locomotive Scroll
    scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 0.8,
        class: 'is-revealed'
    });
    
    // Update ScrollTrigger when Locomotive Scroll updates
    scroll.on('scroll', ScrollTrigger.update);
    
    // Set up ScrollTrigger to work with Locomotive Scroll
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
    });
    
    // Refresh ScrollTrigger and Locomotive Scroll
    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();
}

/* ========== TYPING ANIMATION ========== */
function initializeTyping() {
    const typedElement = document.getElementById('typed-text');
    
    if (typedElement) {
        const typed = new Typed('#typed-text', {
            strings: [
                'Full-Stack Developer',
                'AI Enthusiast',
                'Problem Solver',
                'Tennis Coach',
                'Innovation Driver'
            ],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            cursorChar: '|',
            onComplete: () => {
                // Animation complete
            }
        });
    }
}

/* ========== STATISTICS COUNTER ========== */
function initializeStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const targetNumber = parseInt(stat.getAttribute('data-count'));
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    textContent: targetNumber,
                    duration: 2,
                    ease: "power2.out",
                    snap: { textContent: 1 },
                    stagger: 0.1
                });
            }
        });
    });
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
        gsap.to(body, {
            duration: 0.3,
            ease: "power2.out"
        });
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
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
            
            gsap.to(submitBtn.querySelector('span'), {
                textContent: 'Sending...',
                duration: 0.3
            });
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
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
                
                // Show success animation
                gsap.to(contactForm, {
                    scale: 1.02,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
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
    
    // Initialize intersection observer for navigation
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
        { threshold: 0.6 }
    );
    
    sections.forEach(section => observer.observe(section));
    
    // Add scroll reveal animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Generic scroll animations for elements with data-scroll attributes
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(element => {
        const speed = element.getAttribute('data-scroll-speed') || 1;
        
        gsap.to(element, {
            y: -50 * speed,
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
    
    // Performance optimizations
    optimizePerformance();
}

function optimizePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            onWindowResize();
            ScrollTrigger.refresh();
            scroll.update();
        }, 250);
    });
    
    // Optimize Three.js rendering
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
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

/* ========== ERROR HANDLING ========== */
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Fallback for critical failures
    if (e.error.message.includes('THREE') || e.error.message.includes('WebGL')) {
        document.getElementById('threejs-canvas').style.display = 'none';
        console.warn('Three.js disabled due to error');
    }
});

// Export functions for testing
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