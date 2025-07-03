// Content animations and interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initSkillBars();
    initRevealContent();
    initTiltEffect();
    initTypewriterWithCursor();
    initParticles();
    initInteractiveCards();
    initScrollIndicator();
    initProjectFilter();
    initScrollNavHighlight();
    initHeaderScroll();
    
    // Enable WebGL-based background if supported
    checkWebGLSupport();
});

// Initialize animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    
    // Set initial width for skills
    const skills = {
        'HTML': 95,
        'CSS': 90,
        'JavaScript': 60,
        'React': 10,
        'Node.js': 10,
        'Express': 10,
        'MongoDB': 65,
        'Git': 85,
        'Figma': 70
    };
    
    // Observer for revealing skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillName = entry.target.getAttribute('data-skill');
                const skillLevel = skills[skillName] || 50;
                
                setTimeout(() => {
                    entry.target.style.width = `${skillLevel}%`;
                }, 200);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe all skill bars
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize content reveal animation
function initRevealContent() {
    const revealElements = document.querySelectorAll('.reveal-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize tilt effect for cards and images
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width - 0.5;
            const yPercent = y / rect.height - 0.5;
            
            const rotateX = yPercent * -10; // Rotate around X-axis (horizontal)
            const rotateY = xPercent * 10;  // Rotate around Y-axis (vertical)
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Enhanced typewriter with cursor effect
function initTypewriterWithCursor() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.classList.add('typing-cursor');
    typewriterElement.parentNode.insertBefore(cursor, typewriterElement.nextSibling);
    
    const phrases = [
        'Web Developer',
        'UI/UX Designer',
        'Creative Coder',
        'Problem Solver'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Typing text
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal speed when typing
        }
        
        // Handle phrase completion or deletion
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Completed typing current phrase
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end of phrase
        } else if (isDeleting && charIndex === 0) {
            // Completed deleting current phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
            typingSpeed = 500; // Pause before starting new phrase
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start the typewriter effect
    setTimeout(typeEffect, 1000);
}

// Add particle effects to sections
function initParticles() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        // Only add particles to certain sections (e.g., home, skills)
        if (index === 0 || index === 3) {
            const particlesContainer = document.createElement('div');
            particlesContainer.classList.add('particles-container');
            section.appendChild(particlesContainer);
            
            // Create particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random position
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Random size
                const size = Math.random() * 5 + 2;
                
                // Random opacity
                const opacity = Math.random() * 0.5 + 0.1;
                
                // Random animation duration
                const duration = Math.random() * 20 + 10;
                
                particle.style.cssText = `
                    left: ${x}%;
                    top: ${y}%;
                    width: ${size}px;
                    height: ${size}px;
                    opacity: ${opacity};
                    animation: float ${duration}s infinite ease-in-out;
                    animation-delay: ${Math.random() * 5}s;
                    background-color: var(--primary-color);
                `;
                
                particlesContainer.appendChild(particle);
            }
        }
    });
}

// Initialize interactive project cards
function initInteractiveCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add enhanced card class
        card.classList.add('enhanced-card');
        
        // Add glow border to project images
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            projectImage.classList.add('image-effect');
            
            // Create overlay
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            
            // Create view button
            const viewButton = document.createElement('button');
            viewButton.classList.add('btn', 'animated');
            viewButton.textContent = 'View Details';
            
            overlay.appendChild(viewButton);
            projectImage.appendChild(overlay);
        }
        
        // Add animated links
        const links = card.querySelectorAll('a');
        links.forEach(link => {
            link.classList.add('animated-link');
        });
    });
}

// Add scroll progress indicator
function initScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('scroll-indicator');
    
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    
    indicator.appendChild(progressBar);
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollTotal) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// Check WebGL support and enable enhanced background
function checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        console.log('WebGL not supported, using fallback background');
        document.body.classList.add('no-webgl');
    } else {
        console.log('WebGL supported, using enhanced background');
    }
}

// Add CSS styles for dynamically created elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Particles */
    .particles-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    }
    
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    }
    
    /* Scroll indicator */
    .scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.2);
    }
    
    .scroll-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        width: 0;
        transition: width 0.2s ease;
    }
`;

document.head.appendChild(dynamicStyles);

// Initialize project filter functionality
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Set all as default filter
    filterButtons[0].click();
}

// Initialize scroll-based navigation highlighting
function initScrollNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!sections.length || !navLinks.length) return;
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize header background on scroll
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
} 