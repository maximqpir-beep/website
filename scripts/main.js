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
});
// Обработка ошибок загрузки изображений проектов
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image');
    
    projectImages.forEach(img => {
        img.addEventListener('error', function() {
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
});