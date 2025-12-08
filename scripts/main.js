document.addEventListener('DOMContentLoaded', () => {
    // 🎯 ПРОГРЕСС-БАРЫ (все страницы)
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.dataset.percent;
                if (percent) {
                    bar.style.width = percent + '%';
                }
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    progressBars.forEach(bar => observer.observe(bar));
    
    // 🎯 АКТИВНАЯ НАВИГАЦИЯ
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.background = 'rgba(255,255,255,0.2)';
        }
    });
    
    // 🎯 СКАЧИВАНИЕ ПОРТФОЛИО
    window.downloadPortfolio = function() {
        const link = document.createElement('a');
        link.href = 'assets/resume.pdf';
        link.download = 'портфолио.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Эффект кнопки
        const btn = event.target.closest('.download-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅ Скачано!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    };
    
    // 🎯 СКИП-ЛИНК ФОКУС
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('focus', () => {
            skipLink.classList.add('focus-visible');
        });
        skipLink.addEventListener('blur', () => {
            skipLink.classList.remove('focus-visible');
        });
    }
    
    // 🎯 ФОРМА КОНТАКТОВ
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✅ Отправлено!';
            button.style.background = '#10b981';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 3000);
        });
    }
});

// 🎯 SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
