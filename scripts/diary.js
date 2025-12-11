/**
 * Скрипт для страницы учебного дневника
 */

document.addEventListener('DOMContentLoaded', function() {
    initTimeline();
    initProgressBars();
    initAddEntry();
    initCourseProgress();
});

/**
 * Инициализация временной шкалы
 */
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        // Добавляем ARIA-атрибуты для элементов временной шкалы
        const date = item.querySelector('.timeline-date');
        const title = item.querySelector('h3');
        const status = item.querySelector('.timeline-status');
        
        if (date && title && status) {
            const statusText = status.textContent.trim();
            const isCompleted = item.classList.contains('completed');
            
            item.setAttribute('role', 'listitem');
            item.setAttribute('aria-label', `${date.textContent}: ${title.textContent} - ${statusText}`);
            
            if (isCompleted) {
                item.setAttribute('aria-describedby', 'completed-status');
            } else {
                item.setAttribute('aria-describedby', 'in-progress-status');
            }
        }
    });
    
    // Анимация появления элементов
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }
}

/**
 * Инициализация прогресс-баров
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .skill-progress');
    
    // Анимация заполнения прогресс-баров
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Сбрасываем ширину для анимации
                progressBar.style.width = '0%';
                
                // Запускаем анимацию
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-in-out';
                    progressBar.style.width = width;
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * Инициализация кнопки добавления записи
 */
function initAddEntry() {
    const addButton = document.querySelector('.add-entry');
    if (!addButton) return;
    
    addButton.addEventListener('click', function() {
        // Создаем модальное окно для добавления записи
        createAddEntryModal();
    });
    
    // Поддержка клавиатуры
    addButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

/**
 * Создание модального окна для добавления записи
 */
function createAddEntryModal() {
    // Проверяем, нет ли уже открытого модального окна
    if (document.getElementById('add-entry-modal')) {
        return;
    }
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'add-entry-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('tabindex', '-1');
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'add-entry-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'add-entry-title');
    modal.setAttribute('tabindex', '-1');
    
    // Содержимое модального окна
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn" aria-label="Закрыть форму добавления записи">
                <i class="fas fa-times" aria-hidden="true"></i>
                <span class="sr-only">Закрыть</span>
            </button>
            
            <h2 id="add-entry-title">Добавить новую запись</h2>
            
            <form id="entry-form" class="entry-form">
                <div class="form-group">
                    <label for="entry-date">
                        Дата <span class="required" aria-hidden="true">*</span>
                        <span class="sr-only">Обязательное поле</span>
                    </label>
                    <input type="date" 
                           id="entry-date" 
                           name="date" 
                           required 
                           aria-required="true"
                           aria-describedby="date-error"
                           value="${new Date().toISOString().split('T')[0]}">
                    <div id="date-error" class="error-message" role="alert" aria-live="polite"></div>
                </div>
                
                <div class="form-group">
                    <label for="entry-title">
                        Заголовок <span class="required" aria-hidden="true">*</span>
                        <span class="sr-only">Обязательное поле</span>
                    </label>
                    <input type="text" 
                           id="entry-title" 
                           name="title" 
                           required 
                           aria-required="true"
                           aria-describedby="title-error"
                           placeholder="Например: Изучение React hooks">
                    <div id="title-error" class="error-message" role="alert" aria-live="polite"></div>
                </div>
                
                <div class="form-group">
                    <label for="entry-description">
                        Описание
                    </label>
                    <textarea id="entry-description" 
                              name="description" 
                              rows="4"
                              aria-describedby="description-hint"
                              placeholder="Опишите, что вы изучили или сделали..."></textarea>
                    <div id="description-hint" class="hint-text">
                        Можно добавить ссылки на материалы или код
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Статус</label>
                    <div class="radio-group" role="radiogroup" aria-labelledby="status-label">
                        <div class="radio-option">
                            <input type="radio" 
                                   id="status-in-progress" 
                                   name="status" 
                                   value="in-progress" 
                                   checked
                                   aria-checked="true">
                            <label for="status-in-progress">
                                <i class="fas fa-spinner" aria-hidden="true"></i>
                                В процессе
                            </label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" 
                                   id="status-completed" 
                                   name="status" 
                                   value="completed"
                                   aria-checked="false">
                            <label for="status-completed">
                                <i class="fas fa-check-circle" aria-hidden="true"></i>
                                Завершено
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary cancel-btn">Отмена</button>
                    <button type="submit" class="btn btn-primary">Добавить запись</button>
                </div>
            </form>
        </div>
    `;
    
    // Добавляем на страницу
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // Показываем модальное окно
    setTimeout(() => {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        overlay.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-hidden', 'false');
        
        // Устанавливаем фокус
        modal.focus();
        
        // Блокируем скролл
        document.body.style.overflow = 'hidden';
    }, 10);
    
    // Инициализируем модальное окно
    initAddEntryModalHandlers(modal, overlay);
}

/**
 * Инициализация обработчиков модального окна добавления записи
 */
function initAddEntryModalHandlers(modal, overlay) {
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#entry-form');
    const dateInput = modal.querySelector('#entry-date');
    const titleInput = modal.querySelector('#entry-title');
    const statusRadios = modal.querySelectorAll('input[name="status"]');
    
    // Функция закрытия модального окна
    function closeModal() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Разблокируем скролл
        document.body.style.overflow = '';
        
        // Удаляем элементы из DOM
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
    
    // Обработчики закрытия
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeModal();
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    overlay.addEventListener('click', closeModal);
    
    // Обработчик Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }
    
    document.addEventListener('keydown', handleEscape);
    
    // Управление фокусом внутри модального окна
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
    
    modal.addEventListener('keydown', trapFocus);
    
    // Обработка радиокнопок
    statusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            statusRadios.forEach(r => {
                r.setAttribute('aria-checked', 'false');
            });
            this.setAttribute('aria-checked', 'true');
        });
        
        radio.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextRadio = this.nextElementSibling?.querySelector('input[type="radio"]');
                if (nextRadio) {
                    nextRadio.checked = true;
                    nextRadio.dispatchEvent(new Event('change'));
                    nextRadio.focus();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevRadio = this.previousElementSibling?.querySelector('input[type="radio"]');
                if (prevRadio) {
                    prevRadio.checked = true;
                    prevRadio.dispatchEvent(new Event('change'));
                    prevRadio.focus();
                }
            }
        });
    });
    
    // Валидация формы
    function validateForm() {
        let isValid = true;
        
        // Валидация даты
        if (!dateInput.value) {
            showError(dateInput, 'Пожалуйста, укажите дату');
            isValid = false;
        } else {
            clearError(dateInput);
        }
        
        // Валидация заголовка
        if (!titleInput.value.trim()) {
            showError(titleInput, 'Пожалуйста, введите заголовок');
            isValid = false;
        } else if (titleInput.value.trim().length < 3) {
            showError(titleInput, 'Заголовок должен содержать минимум 3 символа');
            isValid = false;
        } else {
            clearError(titleInput);
        }
        
        return isValid;
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Получаем данные формы
        const formData = {
            date: dateInput.value,
            title: titleInput.value.trim(),
            description: document.querySelector('#entry-description').value.trim(),
            status: document.querySelector('input[name="status"]:checked').value
        };
        
        // Добавляем запись на временную шкалу
        addTimelineEntry(formData);
        
        // Закрываем модальное окно
        closeModal();
        
        // Показываем уведомление об успехе
        showSuccessNotification('Запись успешно добавлена в дневник!');
    });
    
    // Валидация в реальном времени
    titleInput.addEventListener('input', function() {
        if (this.value.trim().length >= 3) {
            clearError(this);
        }
    });
    
    dateInput.addEventListener('change', function() {
        if (this.value) {
            clearError(this);
        }
    });
}

/**
 * Добавление записи на временную шкалу
 */
function addTimelineEntry(data) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // Форматируем дату
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });
    
    // Определяем иконку и текст статуса
    const isCompleted = data.status === 'completed';
    const statusIcon = isCompleted ? 'fa-check-circle' : 'fa-spinner fa-spin';
    const statusText = isCompleted ? 'Выполнено' : 'В процессе';
    const statusClass = isCompleted ? 'completed' : 'in-progress';
    
    // Создаем элемент временной шкалы
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${statusClass}`;
    timelineItem.setAttribute('role', 'listitem');
    
    timelineItem.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">
            <h3>${data.title}</h3>
            ${data.description ? `<p class="timeline-description">${data.description}</p>` : ''}
            <div class="timeline-status">
                <i class="fas ${statusIcon}" aria-hidden="true"></i>
                <span class="sr-only">${statusText}</span>
                <span>${statusText}</span>
            </div>
        </div>
    `;
    
    // Добавляем анимацию
    timelineItem.style.opacity = '0';
    timelineItem.style.transform = 'translateY(20px)';
    
    // Вставляем в начало временной шкалы
    timeline.insertBefore(timelineItem, timeline.firstChild);
    
    // Запускаем анимацию
    requestAnimationFrame(() => {
        timelineItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        timelineItem.style.opacity = '1';
        timelineItem.style.transform = 'translateY(0)';
    });
    
    // Объявляем для скринридера
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Добавлена новая запись: ${data.title}`, 'polite');
    }
}

/**
 * Инициализация прогресса курсов
 */
function initCourseProgress() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Добавляем ARIA-атрибуты
        const title = card.querySelector('.course-title');
        const progressFill = card.querySelector('.progress-fill');
        
        if (title && progressFill) {
            const progressValue = progressFill.style.width;
            const progressText = progressFill.querySelector('.progress-text')?.textContent || progressValue;
            
            card.setAttribute('aria-label', `${title.textContent}: прогресс ${progressText}`);
            progressFill.setAttribute('role', 'progressbar');
            progressFill.setAttribute('aria-valuetext', progressText);
        }
        
        // Анимация при наведении
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
}

/**
 * Показ уведомления об успехе
 */
function showSuccessNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    notification.setAttribute('aria-atomic', 'true');
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" aria-hidden="true"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Закрыть уведомление">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Обработчик закрытия
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Добавляем CSS анимации
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                margin-left: auto;
                border-radius: 4px;
            }
            
            .notification-close:hover,
            .notification-close:focus {
                background: rgba(255,255,255,0.2);
                outline: 2px solid white;
            }
        `;
        document.head.appendChild(style);
    }
}

// Утилиты для работы с ошибками
function showError(element, message) {
    const errorId = `${element.id}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        element.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    element.setAttribute('aria-invalid', 'true');
    element.classList.add('error');
}

function clearError(element) {
    const errorId = `${element.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    element.removeAttribute('aria-invalid');
    element.classList.remove('error');
}