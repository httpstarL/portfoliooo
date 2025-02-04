const nav = document.querySelector("#nav");
const navBtn = document.querySelector("#nav-btn");
const navBtnImg = document.querySelector("#nav-btn-img");

//Preloader
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  preloader.style.display = "none";
}

window.addEventListener("load", function () {
  setTimeout(hidePreloader, 1700);
});

//Hamburger menu
navBtn.onclick = () => {
  if (nav.classList.toggle("open")) {
    navBtnImg.src = "/static/img/icons/close.svg";
  } else {
    navBtnImg.src = "/static/img/icons/open.svg";
  }
};

//Sticky header & goToTop button
window.addEventListener("scroll", function () {
  const header = document.querySelector("#header");
  const hero = document.querySelector("#home");
  let triggerHeight = hero.offsetHeight - 170;

  if (window.scrollY > triggerHeight) {
    header.classList.add("header-sticky");
    goToTop.classList.add("reveal");
  } else {
    header.classList.remove("header-sticky");
    goToTop.classList.remove("reveal");
  }
});

//AOS animations settings
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme or system preference
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
};

// Apply theme
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize theme
setTheme(getCurrentTheme());

// Handle toggle click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Handle system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Smoke cursor effect
const canvas = document.getElementById('cursor-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -2 - 0.5; // Upward movement
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        this.size += 0.2;
        this.speedX *= 0.99;
        this.speedY *= 0.99;
    }

    draw() {
        // Red smoke effect
        const red = Math.floor(255 * this.life); // Fades from red to transparent
        ctx.fillStyle = `rgba(${red}, 0, 0, ${this.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const mouse = {
    x: undefined,
    y: undefined,
    lastX: undefined,
    lastY: undefined
}

function createParticles(e) {
    mouse.x = e.x;
    mouse.y = e.y;

    if (mouse.lastX === undefined) {
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
    }

    // Calculate movement distance
    const dx = mouse.x - mouse.lastX;
    const dy = mouse.y - mouse.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only create particles if the mouse is moving
    if (distance > 1) {
        const steps = Math.floor(distance / 2);
        for (let i = 0; i < steps; i++) {
            const x = mouse.lastX + (dx * i / steps);
            const y = mouse.lastY + (dy * i / steps);
            particles.push(new Particle(x, y));
        }
    }

    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
}

window.addEventListener('mousemove', createParticles);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}

animate();

// Cleanup particles
setInterval(() => {
    if (particles.length > 80) {
        particles = particles.slice(-80);
    }
}, 1000);

// Typing effect for hero section
const heroText = document.querySelector('.hero-heading');
const originalText = heroText.textContent;
heroText.textContent = '';

function typeText(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeText(element, text, i + 1), 100);
    }
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        typeText(heroText, originalText);
    }, 2000);
});

// Simple skill bar animation
const skillBars = document.querySelectorAll('.skillbar');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const percentage = entry.target.parentElement.querySelector('.skill-percent').textContent;
            entry.target.style.width = percentage;
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

skillBars.forEach(bar => observer.observe(bar));

// Initialize skill bars
document.addEventListener('DOMContentLoaded', function() {
    const skillFills = document.querySelectorAll('.skill-fill');
    
    skillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.setProperty('--width', width);
    });
});

// Handle flash messages
function showFlashMessage(message, type) {
    const flashDiv = document.createElement('div');
    flashDiv.className = `flash-message flash-${type}`;
    flashDiv.textContent = message;
    document.body.appendChild(flashDiv);

    setTimeout(() => {
        flashDiv.remove();
    }, 5000);
}
