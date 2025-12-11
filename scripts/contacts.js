/**
 * Скрипт для страницы контактов
 * Реализует валидацию формы и доступность
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initKeyboardNavigation();
    initA11yFeatures();
});

/**
 * Инициализация формы контактов
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Устанавливаем начальные ARIA-атрибуты
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');
        
        if (input && label) {
            const labelFor = label.getAttribute('for');
            const inputId = input.getAttribute('id');
            
            // Убедимся, что label и input связаны
            if (labelFor && inputId && labelFor !== inputId) {
                label.setAttribute('for', inputId);
            } else if (!inputId) {
                // Генерируем ID если его нет
                const generatedId = `input-${Math.random().toString(36).substr(2, 9)}`;
                input.setAttribute('id', generatedId);
                label.setAttribute('for', generatedId);
            }
        }
    });
    
    // Добавляем обработчик отправки формы
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Инициализация валидации формы
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        // Добавляем ARIA-атрибуты для обязательных полей
        input.setAttribute('aria-required', 'true');
        
        // Валидация при потере фокуса
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Очистка ошибок при вводе
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
        
        // Валидация в реальном времени для email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                if (this.value && !isValidEmail(this.value)) {
                    showFieldError(this, 'Пожалуйста, введите корректный email адрес');
                } else if (this.value) {
                    clearFieldError(this);
                }
            });
        }
    });
}

/**
 * Валидация отдельного поля
 */
function validateField(field) {
    const value = field.value.trim();
    
    // Проверка на пустое поле
    if (!value && field.hasAttribute('required')) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
    }
    
    // Специфичная валидация для email
    if (field.type === 'email' && value) {
        if (!isValidEmail(value)) {
            showFieldError(field, 'Пожалуйста, введите корректный email адрес');
            return false;
        }
    }
    
    // Специфичная валидация для текстовых полей
    if ((field.type === 'text' || field.tagName === 'TEXTAREA') && value) {
        if (value.length < 2) {
            showFieldError(field, 'Пожалуйста, введите не менее 2 символов');
            return false;
        }
        
        if (value.length > 1000 && field.tagName === 'TEXTAREA') {
            showFieldError(field, 'Сообщение не должно превышать 1000 символов');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

/**
 * Проверка валидности email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показать ошибку для поля
 */
function showFieldError(field, message) {
    const errorId = `${field.id}-error`;
    let errorElement = document.getElementById(errorId);
    
    // Создаем элемент ошибки если его нет
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = errorId;
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        
        // Вставляем после поля
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('error');
    
    // Объявляем ошибку для скринридера
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Ошибка в поле ${field.previousElementSibling?.textContent || field.name}: ${message}`, 'assertive');
    }
}

/**
 * Очистить ошибку поля
 */
function clearFieldError(field) {
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.removeAttribute('aria-invalid');
    field.classList.remove('error');
}

/**
 * Обработчик отправки формы
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    let isValid = true;
    const firstInvalidField = null;
    
    // Валидируем все поля
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        }
    });
    
    if (!isValid) {
        // Фокусируемся на первом невалидном поле
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        
        // Объявляем общую ошибку
        if (window.announceToScreenReader) {
            window.announceToScreenReader('В форме есть ошибки. Пожалуйста, исправьте их и попробуйте снова.', 'assertive');
        }
        
        return;
    }
    
    // Форма валидна - отправляем данные
    submitForm(form, formData);
}

/**
 * Отправка данных формы
 */
function submitForm(form, formData) {
    const submitButton = form.querySelector('.submit-btn');
    const successMessage = document.getElementById('form-success');
    
    // Показываем состояние загрузки
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Отправка...';
        submitButton.disabled = true;
        submitButton.setAttribute('aria-disabled', 'true');
    }
    
    // Имитация отправки на сервер (в реальном проекте здесь был бы fetch/XMLHttpRequest)
    setTimeout(() => {
        // Скрываем сообщение об успехе если оно было показано ранее
        if (successMessage) {
            successMessage.removeAttribute('hidden');
        }
        
        // Восстанавливаем кнопку
        if (submitButton) {
            submitButton.textContent = 'Отправить сообщение';
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-disabled');
        }
        
        // Очищаем форму
        form.reset();
        
        // Сбрасываем ошибки
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
        });
        
        const invalidInputs = form.querySelectorAll('[aria-invalid="true"]');
        invalidInputs.forEach(input => {
            input.removeAttribute('aria-invalid');
            input.classList.remove('error');
        });
        
        // Показываем сообщение об успехе
        if (successMessage) {
            successMessage.removeAttribute('hidden');
            successMessage.setAttribute('aria-live', 'assertive');
            
            // Фокусируемся на сообщении об успехе
            successMessage.setAttribute('tabindex', '-1');
            successMessage.focus();
            
            // Автоматически скрываем через 5 секунд
            setTimeout(() => {
                successMessage.setAttribute('hidden', 'true');
                successMessage.removeAttribute('tabindex');
                
                // Возвращаем фокус на первую фокусируемую область
                const firstFocusable = form.querySelector('input, button, textarea');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 5000);
        }
        
        // Объявляем успех для скринридера
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'polite');
        }
        
        // Логируем данные формы (в реальном проекте здесь была бы отправка на сервер)
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        console.log('Данные формы:', formObject);
        
    }, 1500); // Имитация задержки сети
}

/**
 * Инициализация клавиатурной навигации
 */
function initKeyboardNavigation() {
    // Навигация по форме с клавиатуры
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const focusableElements = form.querySelectorAll(
        'input, textarea, button, select, [href], [tabindex]:not([tabindex="-1"])'
    );
    
    // Обработка Enter в текстовых полях (отправка формы только по Ctrl+Enter)
    const textInputs = form.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    });
    
    // Обработка навигации с клавиатуры между элементами формы
    form.addEventListener('keydown', function(e) {
        // Обработка Escape - сброс фокуса
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.tagName !== 'BODY') {
                activeElement.blur();
            }
        }
    });
}

/**
 * Инициализация функций доступности
 */
function initA11yFeatures() {
    // Добавляем динамические подсказки для полей
    addFieldInstructions();
    
    // Инициализируем живые регионы для динамического контента
    initDynamicContentAnnouncements();
    
    // Добавляем поддержку высокого контраста
    enhanceHighContrastSupport();
}

/**
 * Добавление инструкций для полей
 */
function addFieldInstructions() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Добавляем инструкции для обязательных полей
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label && !label.querySelector('.required-instruction')) {
            const instruction = document.createElement('span');
            instruction.className = 'required-instruction sr-only';
            instruction.textContent = ' (обязательное поле)';
            label.appendChild(instruction);
        }
    });
    
    // Добавляем инструкции для полей с ограничениями
    const textarea = form.querySelector('textarea');
    if (textarea) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            const maxLength = this.getAttribute('maxlength') || 1000;
            counter.textContent = `${length}/${maxLength} символов`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#dc2626';
                counter.setAttribute('role', 'alert');
            } else {
                counter.style.color = '';
                counter.removeAttribute('role');
            }
        });
        
        // Триггерим событие для начального состояния
        textarea.dispatchEvent(new Event('input'));
    }
}

/**
 * Инициализация объявлений для динамического контента
 */
function initDynamicContentAnnouncements() {
    // Создаем дополнительный live region для формы
    const formLiveRegion = document.createElement('div');
    formLiveRegion.className = 'sr-only';
    formLiveRegion.id = 'form-live-region';
    formLiveRegion.setAttribute('aria-live', 'polite');
    formLiveRegion.setAttribute('aria-atomic', 'true');
    
    const form = document.getElementById('contact-form');
    if (form) {
        form.appendChild(formLiveRegion);
    }
    
    // Функция для объявления изменений формы
    window.announceFormUpdate = function(message, priority = 'polite') {
        if (formLiveRegion) {
            formLiveRegion.setAttribute('aria-live', priority);
            formLiveRegion.textContent = message;
            
            // Очищаем сообщение после произнесения
            setTimeout(() => {
                formLiveRegion.textContent = '';
            }, 1000);
        }
    };
}

/**
 * Улучшение поддержки высокого контраста
 */
function enhanceHighContrastSupport() {
    // Проверяем предпочтения пользователя
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    
    function updateContrastStyles(isHighContrast) {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        if (isHighContrast) {
            // Добавляем дополнительные границы и контуры
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.border = '2px solid currentColor';
                input.style.background = 'transparent';
            });
            
            // Улучшаем видимость кнопок
            const buttons = form.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.border = '3px solid currentColor';
                button.style.outline = 'none';
            });
            
            // Улучшаем видимость сообщений об ошибках
            const errors = form.querySelectorAll('.error-message');
            errors.forEach(error => {
                error.style.border = '2px solid #dc2626';
                error.style.padding = '0.5rem';
                error.style.background = 'white';
                error.style.color = 'black';
            });
        } else {
            // Возвращаем стандартные стили
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.border = '';
                input.style.background = '';
            });
            
            const buttons = form.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.border = '';
                button.style.outline = '';
            });
            
            const errors = form.querySelectorAll('.error-message');
            errors.forEach(error => {
                error.style.border = '';
                error.style.padding = '';
                error.style.background = '';
                error.style.color = '';
            });
        }
    }
    
    // Инициализация и отслеживание изменений
    updateContrastStyles(highContrastQuery.matches);
    highContrastQuery.addEventListener('change', (e) => {
        updateContrastStyles(e.matches);
    });
}

/**
 * Функции для работы с ошибками (совместимость с main.js)
 */
function showError(element, message) {
    showFieldError(element, message);
}

function clearError(element) {
    clearFieldError(element);
}

// Экспортируем функции для тестирования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateField,
        showFieldError,
        clearFieldError,
        handleFormSubmit
    };
}
// Находим элемент плашки
const successMessage = document.getElementById('form-success');

// Функция для показа сообщения
function showSuccessMessage() {
    successMessage.removeAttribute('hidden');
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        successMessage.setAttribute('hidden', 'hidden');
    }, 5000);
}

// Пример обработки отправки формы через fetch
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('send.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Показываем плашку
            showSuccessMessage();
            
            // Очищаем форму
            this.reset();
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
});
