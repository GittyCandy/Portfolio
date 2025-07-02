document.addEventListener('DOMContentLoaded', function() {
  // Remove loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 1000);

  // Initialize Vanta.js background
  let vantaEffect;
  function initVanta() {
    if (window.VANTA) {
      vantaEffect = window.VANTA.NET({
        el: "#threejs-canvas",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color'),
        points: 10,
        maxDistance: 0,
        spacing: 18
      });
    }
  }

  // Dark Mode Functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Initialize Vanta after theme is set
    initVanta();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update Vanta.js colors
    if (vantaEffect) {
      vantaEffect.setOptions({
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color')
      });
    }
  }

  // Initialize theme on load
  initializeTheme();

  // Add event listener
  themeToggle.addEventListener('click', toggleTheme);

  // Watch for system theme changes
  prefersDarkScheme.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.innerHTML = mobileMenu.classList.contains('active') ?
      '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animate skill bars on scroll
  function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible && !bar.classList.contains('animated')) {
        bar.classList.add('animated');
        bar.style.width = bar.style.width; // Retrigger animation
      }
    });
  }

  // Animate counter numbers
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const speed = 2000; // Animation duration in ms
      const increment = target / (speed / 16); // Roughly 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      const rect = counter.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible && !counter.classList.contains('animated')) {
        counter.classList.add('animated');
        updateCounter();
      }
    });
  }

  // Run on load and scroll
  window.addEventListener('load', () => {
    animateSkills();
    animateCounters();
    hljs.highlightAll(); // Syntax highlighting for code blocks
  });

  window.addEventListener('scroll', () => {
    animateSkills();
    animateCounters();
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });

  // Form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Form validation
      const name = this.querySelector('#name').value.trim();
      const email = this.querySelector('#email').value.trim();
      const subject = this.querySelector('#subject').value.trim();
      const message = this.querySelector('#message').value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }

      // Here you would typically send the form data to a server
      // For demo purposes, we'll just show an alert
      alert(`Thank you for your message, ${name}! I will get back to you soon.`);
      this.reset();
    });
  }

  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

   const copyButton = document.querySelector('.copy-button');
  const codeContent = document.querySelector('.code-content code');

  copyButton.addEventListener('click', function() {
    // Get the text content including the hidden easter egg
    const textToCopy = codeContent.textContent;

    // Use the Clipboard API to copy text
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Visual feedback
      copyButton.textContent = 'Copied!';
      copyButton.classList.add('copied');

      // Reset after 2 seconds
      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      copyButton.textContent = 'Error';
    });
  });

  		const swiper = new Swiper('.swiper', {
			autoHeight: true,
			loop: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
		});
const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const showMoreBtn = document.getElementById('show-more-btn');
  const allProjects = Array.from(document.querySelectorAll('.project-card'));

  // Initially show only first 3 projects
  const initialVisibleProjects = 4;
  let currentlyVisible = initialVisibleProjects;

  function updateVisibleProjects() {
    allProjects.forEach((project, index) => {
      if (index < currentlyVisible) {
        project.classList.remove('hidden');
      } else {
        project.classList.add('hidden');
      }
    });

    // Update button text
    if (currentlyVisible >= allProjects.length) {
      showMoreBtn.innerHTML = '<span>Show Less</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 15L12 8L19 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      showMoreBtn.innerHTML = '<span>Show More</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  // Filter projects based on tags
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Update active state of buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Reset visible projects count when filtering
      currentlyVisible = initialVisibleProjects;

      projectCards.forEach(card => {
        const tags = card.dataset.tags.split(',');

        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      updateVisibleProjects();
    });
  });

  // Show more/less functionality
  showMoreBtn.addEventListener('click', () => {
    if (currentlyVisible >= allProjects.length) {
      // Show less
      currentlyVisible = initialVisibleProjects;
    } else {
      // Show more
      currentlyVisible = allProjects.length;
    }

    updateVisibleProjects();
  });

  // Initialize
  updateVisibleProjects();
});



document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const messageInput = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const sendButton = document.getElementById('sendButton');
  const emailInput = document.getElementById('email');
  const signatureText = document.getElementById('signatureText');
  const senderName = document.getElementById('senderName');

  // Character counter
  messageInput.addEventListener('input', function() {
    charCount.textContent = this.value.length;
  });

  // Extract name from email and update signature
  emailInput.addEventListener('blur', function() {
    if (this.value) {
      const namePart = this.value.split('@')[0];
      const formattedName = namePart.split('.')[0]; // Get first part before dot
      const displayName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
      senderName.textContent = displayName;

      // Set default signature if not modified
      if (signatureText.textContent.trim() === "Best regards,[Your Name]") {
        signatureText.innerHTML = `<p>Best regards,</p><p>${displayName}</p>`;
      }
    }
  });

  // Form submission
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    contactForm.classList.add('sending');
    sendButton.innerHTML = '<i class="fas fa-circle-notch"></i> Sending...';

    setTimeout(() => {
      contactForm.classList.remove('sending');
      sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
      contactForm.classList.add('sent');

      setTimeout(() => {
        contactForm.reset();
        contactForm.classList.remove('sent');
        charCount.textContent = '0';
        signatureText.innerHTML = '<p>Best regards,</p><p id="senderName">[Your Name]</p>';
      }, 500);

      alert('Message sent successfully!');
    }, 1500);
  });
});