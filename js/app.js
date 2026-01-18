// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pageLoader = document.getElementById('pageLoader');
    const mainNav = document.getElementById('mainNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTopBtn = document.getElementById('backToTop');
    const heroBg = document.getElementById('heroBg');
    const downloadLink = document.getElementById('downloadLink');
    
    // Version data
    const versionNumber = document.getElementById('versionNumber');
    const currentVersion = document.getElementById('currentVersion');
    const downloadVersion = document.getElementById('downloadVersion');
    const updateStatus = document.getElementById('updateStatus');
    const releaseDate = document.getElementById('releaseDate');
    const releaseNotes = document.getElementById('releaseNotes');
    const lastUpdated = document.getElementById('lastUpdated');
    
    // Screenshot modal
    let currentModal = null;
    
    // Initialize
    initPage();
    setupEventListeners();
    loadVersionData();
    
    function initPage() {
        // Hide loader after 1 second
        setTimeout(() => {
            if (pageLoader) {
                pageLoader.style.opacity = '0';
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                }, 500);
            }
        }, 1000);
        
        // Set active nav link based on current page
        setActiveNavLink();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Set up image modals
        setupImageModals();
        
        // Set up mobile menu
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });
            
            // Close menu when clicking a link
            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                });
            });
        }
    }
    
    function setupEventListeners() {
        // Nav scroll behavior
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show nav on scroll
            if (mainNav) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    mainNav.classList.add('hidden');
                } else {
                    mainNav.classList.remove('hidden');
                }
            }
            lastScrollTop = scrollTop;
            
            // Back to top button
            if (backToTopBtn) {
                if (scrollTop > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
            
            // Parallax effect for hero background
            if (heroBg) {
                heroBg.style.transform = `scale(${1.1 + scrollTop * 0.0001})`;
            }
            
            // Update active nav link on scroll
            updateActiveNavLinkOnScroll();
        });
        
        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    function loadVersionData() {
        fetch('./version.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Version data loaded:', data);
                
                // Update all version displays
                if (versionNumber) versionNumber.textContent = data.version;
                if (currentVersion) currentVersion.textContent = data.version;
                if (downloadVersion) downloadVersion.textContent = data.version;
                
                // Update status with color coding
                if (updateStatus) {
                    if (data.mandatory) {
                        updateStatus.textContent = '🔄 Mandatory Update Required';
                        updateStatus.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
                        updateStatus.style.color = '#ff6b6b';
                    } else {
                        updateStatus.textContent = '✅ Latest Version Available';
                        updateStatus.style.backgroundColor = 'rgba(81, 207, 102, 0.3)';
                        updateStatus.style.color = '#51cf66';
                    }
                }
                
                // Format and display release notes
                if (releaseNotes) {
                    releaseNotes.innerHTML = data.release_notes.replace(/\n/g, '<br>');
                }
                
                // Format dates
                const date = new Date(data.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                if (releaseDate) releaseDate.textContent = formattedDate;
                if (lastUpdated) lastUpdated.textContent = formattedDate;
                
                // Update download link
                if (downloadLink) {
                    downloadLink.href = data.url;
                    downloadLink.download = `PoultryTracker_v${data.version}.apk`;
                }
            })
            .catch(error => {
                console.error('Error fetching version:', error);
                
                // Fallback values
                const fallbackVersion = '1.2.1';
                const fallbackDate = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                if (versionNumber) versionNumber.textContent = fallbackVersion;
                if (currentVersion) currentVersion.textContent = fallbackVersion;
                if (downloadVersion) downloadVersion.textContent = fallbackVersion;
                if (updateStatus) {
                    updateStatus.textContent = '⚠️ Check updates in app';
                    updateStatus.style.backgroundColor = 'rgba(255, 204, 0, 0.3)';
                    updateStatus.style.color = '#ffcc00';
                }
                if (releaseNotes) releaseNotes.textContent = 'Initial release with flock tracking features';
                if (releaseDate) releaseDate.textContent = fallbackDate;
                if (lastUpdated) lastUpdated.textContent = fallbackDate;
                
                if (downloadLink) {
                    downloadLink.href = './download/poultry-tracker.apk';
                    downloadLink.download = `PoultryTracker_v${fallbackVersion}.apk`;
                }
            });
    }
    
    function setActiveNavLink() {
        // Get current page or hash
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        navLinkElements.forEach(link => {
            link.classList.remove('active');
            
            if (currentPath.includes('privacy') && link.getAttribute('href') === '/privacy') {
                link.classList.add('active');
            } else if (currentHash && link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else if (!currentHash && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
    }
    
    function updateActiveNavLinkOnScroll() {
        if (window.location.pathname.includes('privacy')) return;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinkElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // If at top, set home as active
        if (window.scrollY < 100) {
            navLinkElements.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    function initScrollAnimations() {
        // Intersection Observer for section animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    function setupImageModals() {
        document.querySelectorAll('.screenshot-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (!img) return;
                
                // Close existing modal
                if (currentModal) {
                    document.body.removeChild(currentModal);
                }
                
                // Create modal
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.95)';
                modal.style.display = 'flex';
                modal.style.flexDirection = 'column';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '2000';
                modal.style.cursor = 'pointer';
                modal.style.padding = '20px';
                
                // Create image
                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '70%';
                modalImg.style.borderRadius = '12px';
                modalImg.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
                modalImg.style.objectFit = 'contain';
                
                // Create caption
                const caption = this.querySelector('.screenshot-caption');
                const modalCaption = document.createElement('div');
                modalCaption.textContent = caption ? caption.textContent : img.alt;
                modalCaption.style.color = 'white';
                modalCaption.style.marginTop = '20px';
                modalCaption.style.fontSize = '1.2rem';
                modalCaption.style.textAlign = 'center';
                modalCaption.style.maxWidth = '600px';
                
                // Create close button
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✕';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '20px';
                closeBtn.style.right = '30px';
                closeBtn.style.background = 'rgba(255,255,255,0.2)';
                closeBtn.style.color = 'white';
                closeBtn.style.border = 'none';
                closeBtn.style.width = '50px';
                closeBtn.style.height = '50px';
                closeBtn.style.borderRadius = '50%';
                closeBtn.style.fontSize = '1.5rem';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.transition = 'background 0.3s';
                
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(255,255,255,0.3)';
                });
                
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'rgba(255,255,255,0.2)';
                });
                
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.body.removeChild(modal);
                    currentModal = null;
                });
                
                // Add elements to modal
                modal.appendChild(closeBtn);
                modal.appendChild(modalImg);
                modal.appendChild(modalCaption);
                
                // Close modal on click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        currentModal = null;
                    }
                });
                
                // Add to body
                document.body.appendChild(modal);
                currentModal = modal;
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Cleanup on close
                const cleanup = () => {
                    document.body.style.overflow = '';
                };
                
                modal.addEventListener('click', cleanup, { once: true });
            });
        });
    }
});