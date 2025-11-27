document.addEventListener('DOMContentLoaded', function() {
    const diaryEntries = document.getElementById('diaryEntries');
    const addEntryBtn = document.getElementById('addEntryBtn');
    const addEntryForm = document.getElementById('addEntryForm');
    const newEntryForm = document.getElementById('newEntryForm');
    const cancelEntryBtn = document.getElementById('cancelEntryBtn');

    // Начальные данные дневника
    let entries = [
        {
            id: 1,
            date: '2024-12-15',
            title: 'Верстка макета сайта',
            status: 'completed',
            description: 'Завершена верстка главной страницы портфолио с адаптивным дизайном'
        },
        {
            id: 2,
            date: '2024-12-10',
            title: 'JavaScript основы',
            status: 'completed',
            description: 'Изучены основные концепции JavaScript: переменные, функции, DOM-манипуляции'
        },
        {
            id: 3,
            date: '2024-12-05',
            title: 'Работа с формами',
            status: 'in-progress',
            description: 'Реализация валидации форм и обработки пользовательского ввода'
        },
        {
            id: 4,
            date: '2024-12-01',
            title: 'Адаптивный дизайн',
            status: 'in-progress',
            description: 'Изучение медиа-запросов и создание mobile-first дизайна'
        }
    ];

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'short' });
        return `${day} ${month}`;
    }

    // Получение статуса в читаемом формате
    function getStatusText(status) {
        const statusMap = {
            'completed': { text: '✓', class: 'status-completed' },
            'in-progress': { text: 'in progress', class: 'status-in-progress' },
            'planned': { text: 'planned', class: 'status-planned' }
        };
        return statusMap[status] || statusMap['planned'];
    }

    // Отображение записей дневника
    function displayEntries() {
        diaryEntries.innerHTML = '';

        if (entries.length === 0) {
            diaryEntries.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📚</div>
                    <h3>Записей пока нет</h3>
                    <p>Добавьте первую запись о вашем учебном прогрессе</p>
                </div>
            `;
            return;
        }

        // Сортировка записей по дате (новые сверху)
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedEntries.forEach(entry => {
            const status = getStatusText(entry.status);
            const entryElement = document.createElement('div');
            entryElement.className = 'diary-entry';
            entryElement.innerHTML = `
                <div class="entry-content">
                    <div class="entry-date">${formatDate(entry.date)} - ${entry.title}</div>
                    ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
                </div>
                <div class="entry-status ${status.class}">
                    <span class="status-icon">${status.text === '✓' ? '✓' : '⏳'}</span>
                    <span class="status-text">${status.text}</span>
                </div>
            `;
            diaryEntries.appendChild(entryElement);
        });
    }

    // Показать/скрыть форму добавления записи
    addEntryBtn.addEventListener('click', function() {
        addEntryForm.style.display = addEntryForm.style.display === 'none' ? 'block' : 'none';
        addEntryBtn.textContent = addEntryForm.style.display === 'block' ? 'Скрыть форму' : 'Добавить запись';
        
        // Установить сегодняшнюю дату по умолчанию
        if (addEntryForm.style.display === 'block') {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('entryDate').value = today;
        }
    });

    cancelEntryBtn.addEventListener('click', function() {
        addEntryForm.style.display = 'none';
        addEntryBtn.textContent = 'Добавить запись';
        newEntryForm.reset();
    });

    // Обработка добавления новой записи
    newEntryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(newEntryForm);
        const newEntry = {
            id: Date.now(), // Простой ID на основе времени
            date: formData.get('entryDate'),
            title: formData.get('entryTitle'),
            status: formData.get('entryStatus'),
            description: formData.get('entryDescription')
        };

        entries.push(newEntry);
        displayEntries();
        
        // Сброс формы и скрытие
        newEntryForm.reset();
        addEntryForm.style.display = 'none';
        addEntryBtn.textContent = 'Добавить запись';

        // Показать уведомление
        showNotification('Запись успешно добавлена!', 'success');
    });

    // Анимация прогресс-баров курсов
    function animateProgressBars() {
        const progressFills = document.querySelectorAll('.progress-fill');
        
        progressFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // Показать уведомление
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Добавляем стили для анимации уведомлений
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Инициализация
    displayEntries();
    animateProgressBars();

    // Обновление прогресса курсов при загрузке страницы
    window.addEventListener('load', function() {
        const courseItems = document.querySelectorAll('.course-item');
        courseItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
});