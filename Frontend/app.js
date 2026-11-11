
document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. MENU MOBILE
    // =====================================

    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');

    function closeMenu() {
        navbar?.classList.remove('active');
        menuToggle?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }

    menuToggle?.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('active');

        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao selecionar uma secção
    navbar?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', event => {
        if (
            navbar &&
            menuToggle &&
            !navbar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });


    // =====================================
    // 2. ALTERNÂNCIA DE TEMA
    // =====================================

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    const savedTheme = localStorage.getItem('rc-theme');

    function applyTheme(theme) {
        const isDark = theme === 'dark';

        document.documentElement.dataset.theme = theme;

        // Variáveis principais do tema
        document.documentElement.style.setProperty(
            '--background',
            isDark ? '#111111' : '#ffffff'
        );

        document.documentElement.style.setProperty(
            '--foreground',
            isDark ? '#ffffff' : '#000000'
        );

        document.documentElement.style.setProperty(
            '--border',
            isDark ? '#333333' : '#e5e5e5'
        );

        document.documentElement.style.setProperty(
            '--light-blue',
            isDark ? '#17243a' : '#eaf1ff'
        );

        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀' : '◐';
        }

        themeToggle?.setAttribute(
            'aria-label',
            isDark ? 'Ativar tema claro' : 'Ativar tema escuro'
        );
    }

    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('rc-theme', newTheme);
    });


    // =====================================
    // 3. NAVEGAÇÃO SUAVE
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');

            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            history.replaceState(null, '', targetId);
        });
    });


  
    // =====================================
    // 4. FORMULÁRIO DE CONTACTO
    // =====================================

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    contactForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.textContent = 'A enviar...';

        formStatus.textContent = '';
        formStatus.className = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.textContent =
                    'Mensagem enviada com sucesso! Obrigado pelo contacto.';

                formStatus.className = 'form-success';

                contactForm.reset();
            } else {
                throw new Error(
                    result.errors?.map(error => error.message).join(', ') ||
                    'Não foi possível enviar a mensagem.'
                );
            }

        } catch (error) {
            formStatus.textContent =
                error.message || 'Erro ao enviar. Tenta novamente.';

            formStatus.className = 'form-error';

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });



    // =====================================
    // 5. ANO AUTOMÁTICO NO RODAPÉ
    // =====================================

    const footerYear = document.querySelector('.footer > span');

    if (footerYear) {
        footerYear.textContent =
            `© ${new Date().getFullYear()} RC. TODOS OS DIREITOS RESERVADOS.`;
    }

});
