/**
 * Скрипт для страницы проектов
 * Реализует фильтрацию и модальные окна
 */

document.addEventListener('DOMContentLoaded', function() {
    initProjectFilters();
    initProjectModals();
    initContainerQueries();
});

/**
 * Инициализация фильтров проектов
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновляем состояние кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            // Фильтруем проекты
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    
                    // Анимация появления
                    requestAnimationFrame(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    });
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Объявляем изменение для скринридера
            if (window.announceToScreenReader) {
                const filterNames = {
                    'all': 'Все проекты',
                    'html': 'HTML проекты',
                    'js': 'JavaScript проекты',
                    'react': 'React проекты'
                };
                window.announceToScreenReader(`Показаны ${filterNames[filter] || filter} проекты`);
            }
        });
        
        // Обработка клавиатуры для фильтров
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Инициализация модальных окон проектов
 */
function initProjectModals() {
    const detailButtons = document.querySelectorAll('.view-details');
    const modal = document.getElementById('project-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-modal');
    
    // Данные проектов
    const projectsData = {
        1: {
            title: 'Личный сайт',
            description: 'Адаптивный личный сайт с современным дизайном и семантической разметкой. Проект включает главную страницу, портфолио, блог и контакты. Реализована полная доступность (A11y), поддержка темной темы и оптимизация производительности.',
            tech: 'HTML, CSS, JavaScript',
            liveLink: 'https://example.com/project1',
            codeLink: 'https://github.com/username/project1'
        },
        2: {
            title: 'Todo-приложение',
            description: 'Интерактивное приложение для управления задачами с локальным хранилищем. Возможности: добавление, редактирование, удаление задач, фильтрация по статусу, сортировка по дате. Реализована валидация форм и уведомления.',
            tech: 'JavaScript, LocalStorage',
            liveLink: 'https://example.com/project2',
            codeLink: 'https://github.com/username/project2'
        },
        3: {
            title: 'Интернет-магазин',
            description: 'Полнофункциональный интернет-магазин с корзиной покупок и фильтрацией товаров. Включает каталог товаров, систему отзывов, панель администратора. Использованы современные практики React (хуки, контекст, маршрутизация).',
            tech: 'React, Node.js, MongoDB',
            liveLink: 'https://example.com/project3',
            codeLink: 'https://github.com/username/project3'
        },
        4: {
            title: 'Портфолио на Bootstrap',
            description: 'Адаптивное портфолио с использованием Bootstrap 5 и кастомных стилей. Включает анимации на Scroll, модальные окна, форму обратной связи с валидацией. Оптимизировано для SEO и доступности.',
            tech: 'Bootstrap 5, JavaScript',
            liveLink: 'https://example.com/project4',
            codeLink: 'https://github.com/username/project4'
        }
    };
    
    // Обработчик открытия модального окна
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projectsData[projectId];
            
            if (!project) return;
            
            // Заполняем модальное окно данными
            document.getElementById('modal-title').textContent = project.title;
            document.getElementById('modal-description').textContent = project.description;
            document.getElementById('modal-tech').textContent = project.tech;
            
            const liveLink = document.getElementById('modal-live-link');
            const codeLink = document.getElementById('modal-code-link');
            
            liveLink.href = project.liveLink;
            codeLink.href = project.codeLink;
            
            // Открываем модальное окно
            openProjectModal();
        });
        
        // Поддержка клавиатуры
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Функция открытия модального окна
    function openProjectModal() {
        if (!modal || !overlay) return;
        
        // Сохраняем текущий активный элемент
        const previousActiveElement = document.activeElement;
        
        // Показываем модальное окно и overlay
        modal.removeAttribute('hidden');
        modal.style.display = 'block';
        overlay.style.display = 'block';
        overlay.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'false');
        
        // Устанавливаем фокус на модальное окно
        modal.setAttribute('tabindex', '-1');
        modal.focus();
        
        // Блокируем скролл заднего плана
        document.body.style.overflow = 'hidden';
        
        // Скрываем контент за модальным окном от скринридеров
        const mainContent = document.querySelectorAll('body > *:not(.modal):not(.overlay)');
        mainContent.forEach(el => {
            el.setAttribute('aria-hidden', 'true');
        });
        
        // Обработчик Escape
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        }
        
        // Обработчик для захвата фокуса внутри модального окна
        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
        
        // Закрытие по клику на overlay
        overlay.addEventListener('click', closeProjectModal);
        
        // Закрытие по кнопке
        if (closeButton) {
            closeButton.addEventListener('click', closeProjectModal);
        }
        
        // Добавляем обработчики клавиатуры
        document.addEventListener('keydown', handleEscape);
        modal.addEventListener('keydown', trapFocus);
        
        // Функция закрытия модального окна
        function closeProjectModal() {
            modal.setAttribute('hidden', 'true');
            modal.style.display = 'none';
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-hidden', 'true');
            
            // Возвращаем видимость основному контенту
            mainContent.forEach(el => {
                el.removeAttribute('aria-hidden');
            });
            
            // Возвращаем фокус
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
            
            // Разблокируем скролл
            document.body.style.overflow = '';
            
            // Удаляем обработчики
            document.removeEventListener('keydown', handleEscape);
            modal.removeEventListener('keydown', trapFocus);
            overlay.removeEventListener('click', closeProjectModal);
            if (closeButton) {
                closeButton.removeEventListener('click', closeProjectModal);
            }
        }
        
        // Сохраняем функцию закрытия для глобального доступа
        window.closeProjectModal = closeProjectModal;
        
        // Объявление для скринридера
        if (window.announceToScreenReader) {
            const title = document.getElementById('modal-title').textContent;
            window.announceToScreenReader(`Открыто модальное окно: ${title}`, 'assertive');
        }
    }
    
    // Обработчик для кнопки закрытия
    if (closeButton) {
        closeButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (window.closeProjectModal) {
                    window.closeProjectModal();
                }
            }
        });
    }
}

/**
 * Инициализация контейнерных запросов
 */
function initContainerQueries() {
    // Проверяем поддержку контейнерных запросов
    if (!CSS.supports('container-type', 'inline-size')) {
        console.log('Контейнерные запросы не поддерживаются, используем медиазапросы');
        
        // Фолбэк на медиазапросы
        function updateGridLayout() {
            const projectsList = document.querySelector('.projects-list');
            if (!projectsList) return;
            
            const width = window.innerWidth;
            
            if (width >= 960) {
                projectsList.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else if (width >= 640) {
                projectsList.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                projectsList.style.gridTemplateColumns = '1fr';
            }
        }
        
        // Инициализация и отслеживание изменений размера
        updateGridLayout();
        window.addEventListener('resize', updateGridLayout);
    } else {
        console.log('Контейнерные запросы поддерживаются');
    }
}

/**
 * Полифил для контейнерных запросов (если нужно)
 */
if (!CSS.supports('container-type', 'inline-size')) {
    // Простой полифил через ResizeObserver
    const containerQueriesPolyfill = () => {
        const containers = document.querySelectorAll('[data-container]');
        
        if (!containers.length || !window.ResizeObserver) return;
        
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const container = entry.target;
                const width = entry.contentRect.width;
                const containerName = container.getAttribute('data-container');
                
                // Применяем стили в зависимости от ширины
                if (containerName === 'projects') {
                    const projectsList = container.querySelector('.projects-list');
                    if (!projectsList) return;
                    
                    if (width >= 960) {
                        projectsList.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    } else if (width >= 640) {
                        projectsList.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    } else {
                        projectsList.style.gridTemplateColumns = '1fr';
                    }
                }
            });
        });
        
        containers.forEach(container => {
            observer.observe(container);
        });
    };
    
    // Запускаем полифил после загрузки DOM
    document.addEventListener('DOMContentLoaded', containerQueriesPolyfill);
}