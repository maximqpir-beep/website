/**
 * Основной скрипт для сайта портфолио
 * Реализует базовую функциональность и доступность
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    initNavigation();
    initSkipLink();
    initFocusManagement();
    initA11yFeatures();
    
    console.log('Портфолио студента загружено');
});

/**
 * Инициализация навигации
 */
function initNavigation() {
    // Установка активного пункта меню
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Удаляем предыдущее состояние
        link.removeAttribute('aria-current');
        
        // Проверяем, является ли ссылка текущей страницей
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === '../index.html')) {
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Обработка клавиатурной навигации для меню
    const menuItems = document.querySelectorAll('.nav-link');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (index + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
                    menuItems[prevIndex].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    menuItems[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                    break;
            }
        });
    });
}

/**
 * Инициализация skip-link
 */
function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Прокрутка с плавностью, если пользователь не предпочитает reduced motion
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    targetElement.scrollIntoView();
                }
            }
        });
    }
}

/**
 * Управление фокусом
 */
function initFocusManagement() {
    // Добавляем tabindex для фокусируемых элементов, если его нет
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = document.querySelectorAll(focusableElements);
    
    elements.forEach(el => {
        if (!el.hasAttribute('tabindex') && el.tabIndex === -1) {
            el.setAttribute('tabindex', '0');
        }
    });
    
    // Улучшенный :focus-visible полифил
    document.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
    
    // Стили для фокуса при навигации с клавиатуры
    const style = document.createElement('style');
    style.textContent = `
        .using-mouse :focus:not(:focus-visible) {
            outline: none;
        }
        
        :focus-visible {
            outline: 3px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Функции доступности
 */
function initA11yFeatures() {
    // Динамическое обновление live regions
    initLiveRegions();
    
    // Обработка отключенной анимации
    handleReducedMotion();
    
    // Обработка высокого контраста
    handleHighContrast();
}

/**
 * Инициализация живых регионов
 */
function initLiveRegions() {
    // Создаем скрытый live region для системных сообщений
    let liveRegion = document.getElementById('a11y-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    window.announceToScreenReader = function(message, priority = 'polite') {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        
        // Очищаем сообщение после произнесения
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

/**
 * Обработка prefers-reduced-motion
 */
function handleReducedMotion() {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function updateMotionPreferences(e) {
        if (e.matches) {
            document.documentElement.classList.add('reduced-motion');
            // Отключаем плавные переходы
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.transition !== 'none') {
                    el.style.transition = 'none';
                }
            });
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }
    }
    
    // Инициализация и отслеживание изменений
    updateMotionPreferences(reducedMotionQuery);
    reducedMotionQuery.addEventListener('change', updateMotionPreferences);
}

/**
 * Обработка prefers-contrast
 */
function handleHighContrast() {
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    
    function updateContrastPreferences(e) {
        if (e.matches) {
            document.documentElement.classList.add('high-contrast');
            // Добавляем дополнительные стили для высокого контраста
            const style = document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                .high-contrast {
                    --primary-color: #0056cc;
                    --text-color: #000000;
                    --border-color: #000000;
                }
                
                .high-contrast .btn,
                .high-contrast .nav-link {
                    border: 2px solid currentColor !important;
                }
                
                .high-contrast img {
                    filter: contrast(1.2) !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.documentElement.classList.remove('high-contrast');
            const existingStyle = document.getElementById('high-contrast-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
        }
    }
    
    updateContrastPreferences(highContrastQuery);
    highContrastQuery.addEventListener('change', updateContrastPreferences);
}

/**
 * Утилиты для работы с формами
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(element, message) {
    const errorElement = document.getElementById(`${element.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        element.setAttribute('aria-invalid', 'true');
        element.classList.add('error');
    }
}

function clearError(element) {
    const errorElement = document.getElementById(`${element.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        element.removeAttribute('aria-invalid');
        element.classList.remove('error');
    }
}

/**
 * Управление модальными окнами (базовые функции)
 */
window.modalManager = {
    currentModal: null,
    previousFocus: null,
    
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        this.currentModal = modal;
        this.previousFocus = document.activeElement;
        
        // Показываем модальное окно
        modal.removeAttribute('hidden');
        modal.style.display = 'block';
        
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.setAttribute('aria-hidden', 'false');
        }
        
        // Устанавливаем фокус на модальное окно
        modal.setAttribute('aria-hidden', 'false');
        modal.focus();
        
        // Блокируем скролл на заднем плане
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчик Escape
        this.escapeHandler = this.handleEscape.bind(this);
        document.addEventListener('keydown', this.escapeHandler);
        
        // Объявляем для скринридера
        if (window.announceToScreenReader) {
            const modalTitle = modal.querySelector('[id*="modal-title"], .modal-title, h2');
            const titleText = modalTitle ? modalTitle.textContent : 'Модальное окно открыто';
            window.announceToScreenReader(titleText, 'assertive');
        }
    },
    
    closeModal: function() {
        if (!this.currentModal) return;
        
        // Скрываем модальное окно
        this.currentModal.setAttribute('hidden', 'true');
        this.currentModal.style.display = 'none';
        
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }
        
        // Возвращаем фокус
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
        
        // Разблокируем скролл
        document.body.style.overflow = '';
        
        // Удаляем обработчик Escape
        document.removeEventListener('keydown', this.escapeHandler);
        
        this.currentModal = null;
        this.previousFocus = null;
    },
    
    handleEscape: function(event) {
        if (event.key === 'Escape') {
            this.closeModal();
        }
    },
    
    trapFocus: function(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function(event) {
            if (event.key !== 'Tab') return;
            
            if (event.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
};

// Экспортируем функции для использования в других модулях
window.utils = {
    validateEmail,
    showError,
    clearError
};