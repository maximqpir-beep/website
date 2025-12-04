document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Создаем элемент для успешного сообщения
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = '✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.';
    contactForm.insertBefore(successMessage, contactForm.firstChild);

    // Валидация имени
    function validateName() {
        const name = nameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (!name) {
            showError(nameInput, nameError, 'Имя обязательно для заполнения');
            return false;
        } else if (name.length < 2) {
            showError(nameInput, nameError, 'Имя должно содержать минимум 2 символа');
            return false;
        } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name)) {
            showError(nameInput, nameError, 'Имя может содержать только буквы, пробелы и дефисы');
            return false;
        } else {
            hideError(nameInput, nameError);
            return true;
        }
    }

    // Валидация email
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showError(emailInput, emailError, 'Email обязателен для заполнения');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'Введите корректный email адрес');
            return false;
        } else {
            hideError(emailInput, emailError);
            return true;
        }
    }

    // Валидация сообщения
    function validateMessage() {
        const message = messageInput.value.trim();
        const messageError = document.getElementById('messageError');
        
        if (!message) {
            showError(messageInput, messageError, 'Сообщение обязательно для заполнения');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, messageError, 'Сообщение должно содержать минимум 10 символов');
            return false;
        } else if (message.length > 1000) {
            showError(messageInput, messageError, 'Сообщение не должно превышать 1000 символов');
            return false;
        } else {
            hideError(messageInput, messageError);
            return true;
        }
    }

    // Показать ошибку
    function showError(input, errorElement, message) {
        input.parentElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.focus();
    }

    // Скрыть ошибку
    function hideError(input, errorElement) {
        input.parentElement.classList.remove('error');
        errorElement.style.display = 'none';
    }

    // Очистка всех ошибок
    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const formGroups = document.querySelectorAll('.form-group');
        
        errorElements.forEach(error => error.style.display = 'none');
        formGroups.forEach(group => group.classList.remove('error'));
    }

    // Реальная валидация email через API (опционально)
    async function validateEmailReal(email) {
        try {
            // Здесь можно подключить реальный API для валидации email
            // Например: https://emailvalidation.io/
            const response = await fetch(`https://api.emailvalidation.io/v1/info?apikey=your_api_key&email=${email}`);
            const data = await response.json();
            return data.is_valid;
        } catch (error) {
            console.log('Email validation API error:', error);
            return true; // Если API не работает, возвращаем true
        }
    }

    // Обработчики событий для реальной валидации
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    // Обработчик отправки формы
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Сначала очищаем предыдущие ошибки
        clearAllErrors();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Показываем loading state
            const submitBtn = contactForm.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // Имитация отправки данных на сервер
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Показываем успешное сообщение
                successMessage.classList.add('show');
                
                // Очищаем форму
                contactForm.reset();
                
                // Скрываем успешное сообщение через 5 секунд
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
                
            } catch (error) {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
                console.error('Form submission error:', error);
            } finally {
                // Восстанавливаем кнопку
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        } else {
            // Прокручиваем к первой ошибке
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });

    // Дебаунс для оптимизации валидации
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Применяем дебаунс к валидации email
    emailInput.addEventListener('input', debounce(validateEmail, 500));

    // Очистка ошибок при фокусе на поле
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('focus', function() {
            const formGroup = this.parentElement;
            if (formGroup.classList.contains('error')) {
                formGroup.classList.remove('error');
                const errorElement = formGroup.querySelector('.error-message');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
    });

    // Добавляем красивый разделитель
    const divider = document.querySelector('.divider hr');
    if (divider) {
        // Анимация появления разделителя
        setTimeout(() => {
            divider.style.width = '100%';
            divider.style.transition = 'width 1s ease';
        }, 500);
    }
});