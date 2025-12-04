document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        {
            id: 1,
            title: "Личный сайт",
            category: "html",
            technologies: "HTML, CSS, JavaScript",
            description: "Полностью адаптивный личный сайт-портфолио с современным дизайном и интерактивными элементами.",
            images: ["скриншот1", "скриншот2", "скриншот3"],
            liveLink: "https://example.com",
            codeLink: "https://github.com/username/project1"
        },
        {
            id: 2,
            title: "Todo-приложение",
            category: "js",
            technologies: "JavaScript, LocalStorage",
            description: "Интерактивное приложение для управления задачами с возможностью добавления, удаления и фильтрации.",
            images: ["скриншот1", "скриншот2"],
            liveLink: "https://example.com/todo",
            codeLink: "https://github.com/username/todo-app"
        },
        {
            id: 3,
            title: "Интернет-магазин",
            category: "react",
            technologies: "React, Node.js, MongoDB",
            description: "Полнофункциональный интернет-магазин с корзиной покупок, системой оплаты и панелью администратора.",
            images: ["скриншот1", "скриншот2", "скриншот3", "скриншот4"],
            liveLink: "https://example.com/shop",
            codeLink: "https://github.com/username/ecommerce"
        },
        {
            id: 4,
            title: "Портфолио",
            category: "bootstrap",
            technologies: "Bootstrap, jQuery",
            description: "Адаптивное портфолио на Bootstrap с анимациями и интерактивными элементами.",
            images: ["скриншот1", "скриншот2"],
            liveLink: "https://example.com/portfolio",
            codeLink: "https://github.com/username/bootstrap-portfolio"
        },
        {
            id: 5,
            title: "Погодное приложение",
            category: "js",
            technologies: "JavaScript, API",
            description: "Приложение для просмотра погоды с использованием стороннего API и геолокации.",
            images: ["скриншот1", "скриншот2"],
            liveLink: "https://example.com/weather",
            codeLink: "https://github.com/username/weather-app"
        },
        {
            id: 6,
            title: "Социальная сеть",
            category: "react",
            technologies: "React, Firebase, Redux",
            description: "Мини-социальная сеть с авторизацией, лентой постов и системой комментариев.",
            images: ["скриншот1", "скриншот2", "скриншот3"],
            liveLink: "https://example.com/social",
            codeLink: "https://github.com/username/social-app"
        }
    ];

    const projectsContainer = document.getElementById('projectsContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    // Отображение проектов
    function displayProjects(filter = 'all') {
        projectsContainer.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = `project-card ${project.category}`;
            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.technologies}</p>
                <div class="project-preview">[Превью]</div>
            `;
            
            projectCard.addEventListener('click', () => openModal(project));
            projectsContainer.appendChild(projectCard);
        });
    }

    // Открытие модального окна
    function openModal(project) {
        modalContent.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Технологии:</strong> ${project.technologies}</p>
            <p><strong>Описание:</strong> ${project.description}</p>
            
            <div class="modal-images">
                ${project.images.map(img => 
                    `<div class="modal-image">${img}</div>`
                ).join('')}
            </div>
            
            <div class="modal-links">
                <a href="${project.liveLink}" target="_blank" class="btn">Посмотреть онлайн</a>
                <a href="${project.codeLink}" target="_blank" class="btn">Исходный код</a>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Закрытие модального окна
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Обработчики событий для фильтрации
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Фильтруем проекты
            displayProjects(this.dataset.filter);
        });
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // Закрытие модального окна клавишей ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModalFunc();
        }
    });

    // Инициализация
    displayProjects();
});