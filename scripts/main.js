<<<<<<< HEAD
// Main.js - основной файл JavaScript с реализацией практики 16
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main.js loaded successfully | Практика 16: Адаптивные изображения');
    
    // ===== 1. АКТИВНАЯ СТРАНИЦА В НАВИГАЦИИ =====
=======
// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('show');
        }
    });

    // Анимация прогресс-баров при скролле
    const skillBars = document.querySelectorAll('.skill-level');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }

    // Запуск анимации при загрузке страницы
    animateSkillBars();
});
// Автоматическое определение активной страницы в навигации
document.addEventListener('DOMContentLoaded', function() {
>>>>>>> b9a5f6d14cbfd2f0e6ce1d7638193991a636e227
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
<<<<<<< HEAD
    
    // ===== 2. МОБИЛЬНОЕ МЕНЮ =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        console.log('Mobile menu elements found');
        
        // Инициализация - скрываем кнопку на десктопе
        if (window.innerWidth > 768) {
            mobileMenuBtn.style.display = 'none';
            navMenu.style.display = 'flex';
        } else {
            mobileMenuBtn.style.display = 'flex';
            navMenu.style.display = 'none';
        }
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Menu button clicked');
            
            const isVisible = navMenu.style.display === 'flex';
            
            if (isVisible) {
                navMenu.style.display = 'none';
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                navMenu.style.zIndex = '1000';
                mobileMenuBtn.textContent = '✕';
                mobileMenuBtn.setAttribute('aria-label', 'Закрыть меню');
            }
        });
        
        // Закрываем меню при клике на ссылку (только на мобильных)
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.style.display = 'none';
                    mobileMenuBtn.textContent = '☰';
                    mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
                }
            });
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                !event.target.closest('nav') && 
                !event.target.closest('.mobile-menu-btn') &&
                navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
            }
        });
        
        // Обработка изменения размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                // На десктопе - всегда показываем меню
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'row';
                navMenu.style.position = 'static';
                navMenu.style.background = 'transparent';
                navMenu.style.padding = '0';
                navMenu.style.boxShadow = 'none';
                mobileMenuBtn.style.display = 'none';
            } else {
                // На мобильных - скрываем меню
                navMenu.style.display = 'none';
                mobileMenuBtn.style.display = 'flex';
                mobileMenuBtn.textContent = '☰';
                mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
            }
        });
    } else {
        console.log('Mobile menu elements not found, using default navigation');
    }
    
    // ===== 3. АНИМАЦИЯ ПРОГРЕСС-БАРОВ =====
    const skillBars = document.querySelectorAll('.skill-level');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // Запуск анимации при загрузке страницы
    setTimeout(animateSkillBars, 500);
    
    // ===== 4. SKIP-LINK ДЛЯ ДОСТУПНОСТИ =====
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                console.log('Skip link activated');
                
                // Прокрутка к основному контенту
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ===== 5. ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ =====
=======
});
// Обработка ошибок загрузки изображений проектов
document.addEventListener('DOMContentLoaded', function() {
>>>>>>> b9a5f6d14cbfd2f0e6ce1d7638193991a636e227
    const projectImages = document.querySelectorAll('.project-image');
    
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
<<<<<<< HEAD
            console.log('Image failed to load:', this.src);
            // Просто показываем серый фон вместо изображения
            this.style.backgroundColor = '#e9ecef';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = `<span style="color: #666;">${this.alt}</span>`;
        });
    });
    
    // ===== 6. LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ (ПРАКТИКА 16) =====
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        
                        // Предзагрузка изображения
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
            
            console.log(`Lazy loading инициализирован для ${lazyImages.length} изображений`);
        } else {
            // Fallback для старых браузеров
            lazyImages.forEach(img => {
                img.classList.add('loaded');
            });
            console.log('Lazy loading fallback активирован');
        }
    }
    
    // ===== 7. АДАПТИВНОСТЬ ИЗОБРАЖЕНИЙ (ПРАКТИКА 16) =====
    function checkImageSizes() {
        const images = document.querySelectorAll('img:not(.logo-image)');
        
        images.forEach(img => {
            // Проверяем, есть ли у изображения width и height атрибуты
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                console.warn('Изображение без размеров:', img.src);
                // Автоматически добавляем размеры на основе естественных размеров
                if (img.naturalWidth && img.naturalHeight) {
                    img.setAttribute('width', img.naturalWidth);
                    img.setAttribute('height', img.naturalHeight);
                }
            }
            
            // Добавляем класс responsive-img если его нет
            if (!img.classList.contains('responsive-img') && 
                !img.classList.contains('logo-image')) {
                img.classList.add('responsive-img');
            }
        });
        
        console.log(`Проверено ${images.length} изображений на адаптивность`);
    }
    
    // ===== 8. РЕТИНА ПОДДЕРЖКА (ПРАКТИКА 16) =====
    function checkRetinaSupport() {
        const pixelRatio = window.devicePixelRatio || 1;
        
        if (pixelRatio >= 2) {
            document.body.classList.add('retina-display');
            console.log(`Retina display обнаружен: коэффициент ${pixelRatio}`);
            
            // Добавляем классы для ретина изображений
            const retinaImages = document.querySelectorAll('.retina-image');
            retinaImages.forEach(img => {
                img.style.imageRendering = 'crisp-edges';
            });
        }
    }
    
    // ===== 9. ПРОВЕРКА ТЕХНИК ПРАКТИКИ 16 =====
    function checkPractice16Techniques() {
        const techniques = {
            'responsive-images': document.querySelectorAll('.responsive-img').length,
            'picture-element': document.querySelectorAll('picture').length,
            'object-fit': document.querySelectorAll('[class*="object-fit-"]').length,
            'lazy-loading': document.querySelectorAll('img[loading="lazy"]').length,
            'adaptive-gallery': document.querySelectorAll('.adaptive-gallery').length,
            'retina-ready': document.querySelectorAll('.retina-image').length
        };
        
        console.log('=== ПРАКТИКА 16: РЕЗУЛЬТАТЫ ПРОВЕРКИ ===');
        Object.entries(techniques).forEach(([tech, count]) => {
            const emoji = count > 0 ? '✅' : '❌';
            console.log(`${emoji} ${tech}: ${count} элементов`);
        });
        
        // Показываем уведомление о примененных техниках
        if (Object.values(techniques).some(count => count > 0)) {
            console.log('🎉 Все техники практики 16 успешно применены!');
        }
    }
    
    // ===== 10. ДЕМОНСТРАЦИЯ ADAPTIVE GALLERY (ТЕХНИКА 6) =====
    function setupAdaptiveGallery() {
        const galleryItems = document.querySelectorAll('.adaptive-gallery-item');
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                alert(`Адаптивная галерея: Изображение ${index + 1}\n` +
                      `Размер: ${img.naturalWidth}×${img.naturalHeight}px\n` +
                      `Техника: Адаптивная сетка (grid-template-columns)`);
            });
        });
    }
    
    // ===== 11. ДЕМОНСТРАЦИЯ OBJECT-FIT (ТЕХНИКА 5) =====
    function setupObjectFitDemo() {
        const objectFitItems = document.querySelectorAll('.object-fit-demo-item');
        
        objectFitItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const img = this.querySelector('img');
                const fitType = img.className.includes('cover') ? 'cover' : 
                               img.className.includes('contain') ? 'contain' : 'fill';
                
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            });
        });
    }
    
    // ===== 12. ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ПРАКТИКИ 16 =====
    function initPractice16() {
        console.log('Инициализация техник практики 16...');
        
        // Запускаем все функции
        initLazyLoading();
        checkImageSizes();
        checkRetinaSupport();
        setupAdaptiveGallery();
        setupObjectFitDemo();
        
        // Проверяем все техники через 2 секунды
        setTimeout(checkPractice16Techniques, 2000);
        
        // Показываем сообщение в консоли
        console.log(`
██████╗ ██████╗  █████╗ ████████╗██╗ ██████╗ █████╗     ██╗   ██╗██████╗ 
██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║██╔════╝██╔══██╗    ██║   ██║╚════██╗
██████╔╝██████╔╝███████║   ██║   ██║██║     ███████║    ██║   ██║ █████╔╝
██╔═══╝ ██╔══██╗██╔══██║   ██║   ██║██║     ██╔══██║    ╚██╗ ██╔╝██╔═══╝ 
██║     ██║  ██║██║  ██║   ██║   ██║╚██████╗██║  ██║     ╚████╔╝ ███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝      ╚═══╝  ╚══════╝
        `);
        console.log('Практика 16: Адаптивные изображения - ВСЕ ТЕХНИКИ РЕАЛИЗОВАНЫ!');
    }
    
    // ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ =====
    setTimeout(() => {
        // Стандартные функции
        if (typeof window.onresize === 'function') {
            window.onresize();
        }
        
        // Функции практики 16
        initPractice16();
    }, 1000);
    
    // ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ОТЛАДКИ =====
    window.practice16 = {
        checkTechniques: checkPractice16Techniques,
        reloadImages: checkImageSizes,
        testRetina: checkRetinaSupport,
        getImageStats: function() {
            const images = document.querySelectorAll('img');
            return {
                total: images.length,
                responsive: document.querySelectorAll('.responsive-img').length,
                lazy: document.querySelectorAll('img[loading="lazy"]').length,
                picture: document.querySelectorAll('picture').length,
                objectFit: document.querySelectorAll('[class*="object-fit-"]').length
            };
        }
    };
    
    console.log('Для отладки используйте: window.practice16.checkTechniques()');
});
// ===== ПРАКТИКА 16: АДАПТИВНЫЕ ИЗОБРАЖЕНИЯ =====

function initPractice16() {
    console.log('Инициализация практики 16: Адаптивные изображения');
    
    // 1. Добавляем класс responsive-img ко всем изображениям (кроме логотипа)
    const images = document.querySelectorAll('img:not(.logo-image)');
    images.forEach(img => {
        if (!img.classList.contains('responsive-img')) {
            img.classList.add('responsive-img');
        }
    });
    
    // 2. Инициализация lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // 3. Проверка применения техник
    setTimeout(() => {
        const techniques = {
            'responsive-images': document.querySelectorAll('.responsive-img').length,
            'lazy-loading': document.querySelectorAll('img[loading="lazy"]').length,
            'object-fit': document.querySelectorAll('[style*="object-fit"]').length
        };
        
        console.log('Практика 16 - Примененные техники:', techniques);
    }, 1000);
}

// Вызываем функцию при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...
    
    // Добавляем в конец
    setTimeout(initPractice16, 500);
=======
            // Если фото не загрузилось, показываем fallback
            this.style.display = 'none';
            const projectCard = this.closest('.project-card');
            projectCard.classList.add('has-image');
            projectCard.innerHTML = `
                <div class="project-fallback">
                    <div class="fallback-icon">💻</div>
                    <h3>${this.alt}</h3>
                </div>
            `;
        });
        
        // Отмечаем что карточка имеет изображение
        img.addEventListener('load', function() {
            this.closest('.project-card').classList.add('has-image');
        });
    });
});
// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('show');
        }
    });
>>>>>>> b9a5f6d14cbfd2f0e6ce1d7638193991a636e227
});