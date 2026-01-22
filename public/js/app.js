// public/js/app.js - Version améliorée

(function() {
    'use strict';

    // Déclaration des variables globales
    let lastScroll = 0;
    let resizeTimeout;

    // Initialisation quand le DOM est chargé
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });

    function init() {
        // Année actuelle dans le footer
        document.getElementById('year').textContent = new Date().getFullYear();

        // Initialiser les composants
        initNavigation();
        initBackToTop();
        initAnimations();
        initAccessibility();

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', handleResize);
    }

    function initNavigation() {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        // Toggle mobile menu
        if (mobileToggle) {
            mobileToggle.addEventListener('click', toggleMobileMenu);
        }

        // Fermer le menu au clic sur un lien (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Ajouter/supprimer la classe scrolled
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Cacher/montrer la navbar au scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 &&
                navMenu.classList.contains('active') &&
                !navMenu.contains(event.target) &&
                !mobileToggle.contains(event.target)) {
                closeMobileMenu();
            }
        });

        // Empêcher le scroll du body quand le menu mobile est ouvert
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (navMenu.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        observer.observe(navMenu, { attributes: true });
    }

    function toggleMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const toggleIcon = document.querySelector('.mobile-toggle i');

        navMenu.classList.toggle('active');

        // Changer l'icône
        if (navMenu.classList.contains('active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-times');
        } else {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
        }
    }

    function closeMobileMenu() {
        const navMenu = document.getElementById('navMenu');
        const toggleIcon = document.querySelector('.mobile-toggle i');

        navMenu.classList.remove('active');
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
    }

    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function initAnimations() {
        // Animation des éléments au scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.fade-in, .animate-on-scroll');

            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;

                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Initialiser les éléments animés
        const animatedElements = document.querySelectorAll('.fade-in, .animate-on-scroll');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        // Écouter le scroll pour l'animation
        window.addEventListener('scroll', animateOnScroll);
        // Déclencher une première fois pour les éléments déjà visibles
        animateOnScroll();

        // Animation au survol des cartes
        const cards = document.querySelectorAll('.card, .value-card, .mission-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    function initAccessibility() {
        // Gestion des touches clavier pour la navigation
        document.addEventListener('keydown', function(e) {
            // Tab key navigation
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to content link
        const skipLink = document.querySelector('.skip-to-content');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => {
                        target.removeAttribute('tabindex');
                    }, 1000);
                }
            });
        }
    }

    function handleResize() {
        // Debounce le redimensionnement
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Fermer le menu mobile si on passe en desktop
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250);
    }

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorer les ancres vides
            if (href === '#' || href === '#!') return;

            // Gérer les ancres internes
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    const navHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Mettre le focus sur l'élément cible pour l'accessibilité
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    setTimeout(() => {
                        targetElement.removeAttribute('tabindex');
                    }, 1000);
                }
            }
        });
    });

    // Page transition
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-transition');
    });

    // Exposer les fonctions globales si nécessaire
    window.toggleMenu = toggleMobileMenu;
})();
