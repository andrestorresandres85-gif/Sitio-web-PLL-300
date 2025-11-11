// JavaScript Vanilla Puro - Sin dependencias

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initBackToTop();
    initSmoothScroll();
    highlightActiveNav();
});

// Inicializar Navegación
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link.has-submenu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Toggle submenu
            const submenu = this.nextElementSibling;
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('show');
            }
        });
    });

    // Auto-expandir sección activa
    autoExpandActiveSection();
}

// Auto-expandir sección activa basada en URL
function autoExpandActiveSection() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Encontrar el enlace de la página actual
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.split('#')[0] === currentPage) {
            link.classList.add('active');
            
            // Si tiene submenú, expandirlo
            if (link.classList.contains('has-submenu')) {
                link.classList.add('expanded');
                const submenu = link.nextElementSibling;
                if (submenu) {
                    submenu.classList.add('show');
                }
            }
        }
    });
}

// Botón Volver Arriba
function initBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    // Click para volver arriba
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Suave para Enlaces de Ancla
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar si es solo "#"
            if (href === '#' || !href) return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Resaltar Navegación Activa
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const linkPage = href.split('#')[0];
        const linkHash = href.includes('#') ? '#' + href.split('#')[1] : '';
        
        // Marcar como activo si coincide la página
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
            
            // Si hay hash, resaltar también el enlace del submenú
            if (currentHash && linkHash === currentHash) {
                link.classList.add('active');
            }
        }
    });
}

// Scroll Spy para Submenús
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const submenuLinks = document.querySelectorAll('.submenu a');
    
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        submenuLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes('#' + currentSection)) {
                link.classList.add('active');
            }
        });
    });
}

// Inicializar scroll spy si hay secciones
if (document.querySelectorAll('section[id]').length > 0) {
    initScrollSpy();
}

// Toggle Sidebar en Móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Manejo de Enlaces Externos
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const link = e.target;
        const href = link.getAttribute('href');
        
        // Abrir enlaces externos en nueva pestaña
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            if (!href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }
});

// Copiar Código al Portapapeles
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    }
}

// Inicializar Botones de Copiar Código
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = 'Copiar';
        button.style.position = 'absolute';
        button.style.top = '8px';
        button.style.right = '8px';
        button.style.padding = '4px 12px';
        button.style.fontSize = '12px';
        button.style.backgroundColor = '#6c757d';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', function() {
            const code = block.textContent;
            copyToClipboard(code).then(() => {
                button.textContent = '✓ Copiado';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            }).catch(() => {
                button.textContent = 'Error';
                setTimeout(() => {
                    button.textContent = 'Copiar';
                }, 2000);
            });
        });
    });
}

// Inicializar botones de copiar si hay bloques de código
if (document.querySelectorAll('pre code').length > 0) {
    initCodeCopyButtons();
}

// Modo Oscuro (Opcional)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

// Cargar preferencia de modo oscuro
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'true') {
    document.body.classList.add('dark-mode');
}

// Lazy Loading para Imágenes
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin IntersectionObserver
        images.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// Inicializar lazy loading si hay imágenes
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Función de Impresión
function printPage() {
    window.print();
}

// Detección de Tamaño de Ventana
let windowWidth = window.innerWidth;

window.addEventListener('resize', function() {
    const newWidth = window.innerWidth;
    
    // Si cambia de móvil a desktop o viceversa
    if ((windowWidth <= 768 && newWidth > 768) || (windowWidth > 768 && newWidth <= 768)) {
        windowWidth = newWidth;
        // Recargar comportamiento si es necesario
    }
    
    windowWidth = newWidth;
});

// Prevenir comportamiento por defecto en enlaces vacíos
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});

// Mensaje de Consola
console.log('%c🧪 Planta de Extracción Líquido-Líquido ', 'background: #0d6efd; color: white; font-size: 16px; padding: 8px 12px; border-radius: 4px;');
console.log('%c📚 Manual Técnico SENA - Centro CEAI-ASTIN ', 'background: #212529; color: white; font-size: 12px; padding: 6px 10px; border-radius: 4px;');
console.log('%c✨ HTML, CSS y JavaScript Puro - Sin Frameworks ', 'background: #198754; color: white; font-size: 11px; padding: 4px 8px; border-radius: 4px; margin-top: 4px;');