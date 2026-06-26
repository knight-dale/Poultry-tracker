document.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.getElementById('pageLoader');
    const mainNav = document.getElementById('mainNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const backToTopBtn = document.getElementById('backToTop');
    const heroBg = document.getElementById('heroBg');
    const downloadLink = document.getElementById('downloadLink');

    const versionNumber = document.getElementById('versionNumber');
    const currentVersion = document.getElementById('currentVersion');
    const downloadVersion = document.getElementById('downloadVersion');
    const updateStatus = document.getElementById('updateStatus');
    const releaseDate = document.getElementById('releaseDate');
    const releaseNotes = document.getElementById('releaseNotes');
    const lastUpdated = document.getElementById('lastUpdated');

    let currentModal = null;

    initPage();
    setupEventListeners();
    loadVersionData();

    function initPage() {
        setTimeout(() => {
            if (pageLoader) {
                pageLoader.style.opacity = '0';
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                }, 500);
            }
        }, 600);

        setActiveNavLink();
        initScrollAnimations();
        setupImageModals();

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.textContent = '☰';
                });
            });
        }
    }

    function setupEventListeners() {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (mainNav) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    mainNav.classList.add('hidden');
                } else {
                    mainNav.classList.remove('hidden');
                }
            }
            lastScrollTop = scrollTop;

            if (backToTopBtn) {
                if (scrollTop > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            if (heroBg) {
                heroBg.style.transform = `scale(${1.1 + scrollTop * 0.0001})`;
            }

            updateActiveNavLinkOnScroll();
        });

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
                if (versionNumber) versionNumber.textContent = data.version;
                if (currentVersion) currentVersion.textContent = data.version;
                if (downloadVersion) downloadVersion.textContent = data.version;

                if (updateStatus) {
                    if (data.mandatory) {
                        updateStatus.textContent = '🔄 Mandatory Update Required';
                        updateStatus.style.backgroundColor = 'var(--danger-soft)';
                        updateStatus.style.color = 'var(--danger)';
                    } else {
                        updateStatus.textContent = '✅ Latest Version Available';
                        updateStatus.style.backgroundColor = 'var(--success-soft)';
                        updateStatus.style.color = 'var(--success)';
                    }
                }

                if (releaseNotes) {
                    releaseNotes.innerHTML = data.release_notes.replace(/\n/g, '<br>');
                }

                const date = new Date(data.timestamp);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                if (releaseDate) releaseDate.textContent = formattedDate;
                if (lastUpdated) lastUpdated.textContent = formattedDate;

                if (downloadLink) {
                    downloadLink.href = data.url;
                    downloadLink.download = `PoultryTracker_v${data.version}.apk`;
                }
            })
            .catch(() => {
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
                    updateStatus.style.backgroundColor = 'var(--gold-soft)';
                    updateStatus.style.color = 'var(--soil)';
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
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        navLinkElements.forEach(link => {
            link.classList.remove('active');

            if (currentPath.includes('privacy') && link.getAttribute('href') === 'privacy.html') {
                link.classList.add('active');
            } else if (currentPath.includes('delete-account') && link.getAttribute('href') === 'delete-account.html') {
                link.classList.add('active');
            } else if (currentHash && link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else if (!currentHash && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
    }

    function updateActiveNavLinkOnScroll() {
        if (window.location.pathname.includes('privacy') || window.location.pathname.includes('delete-account')) {
            return;
        }

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

                if (currentModal) {
                    document.body.removeChild(currentModal);
                }

                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(46,42,31,0.95)';
                modal.style.display = 'flex';
                modal.style.flexDirection = 'column';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '2000';
                modal.style.cursor = 'pointer';
                modal.style.padding = '20px';

                const modalImg = document.createElement('img');
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modalImg.style.maxWidth = '90%';
                modalImg.style.maxHeight = '70%';
                modalImg.style.borderRadius = '14px';
                modalImg.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
                modalImg.style.objectFit = 'contain';

                const caption = this.querySelector('.screenshot-caption');
                const modalCaption = document.createElement('div');
                modalCaption.textContent = caption ? caption.textContent : img.alt;
                modalCaption.style.color = '#F1ECDC';
                modalCaption.style.marginTop = '20px';
                modalCaption.style.fontSize = '1.2rem';
                modalCaption.style.textAlign = 'center';
                modalCaption.style.maxWidth = '600px';

                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✕';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '20px';
                closeBtn.style.right = '30px';
                closeBtn.style.background = 'rgba(241,236,220,0.2)';
                closeBtn.style.color = '#F1ECDC';
                closeBtn.style.border = 'none';
                closeBtn.style.width = '50px';
                closeBtn.style.height = '50px';
                closeBtn.style.borderRadius = '50%';
                closeBtn.style.fontSize = '1.5rem';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.transition = 'background 0.3s';

                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.background = 'rgba(241,236,220,0.3)';
                });

                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.background = 'rgba(241,236,220,0.2)';
                });

                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.body.removeChild(modal);
                    currentModal = null;
                });

                modal.appendChild(closeBtn);
                modal.appendChild(modalImg);
                modal.appendChild(modalCaption);

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        currentModal = null;
                    }
                });

                document.body.appendChild(modal);
                currentModal = modal;
                document.body.style.overflow = 'hidden';

                const cleanup = () => {
                    document.body.style.overflow = '';
                };

                modal.addEventListener('click', cleanup, { once: true });
            });
        });
    }
});