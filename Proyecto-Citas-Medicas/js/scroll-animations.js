// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.3 && // 1.3 para que se active un poco antes
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para verificar los elementos y agregar la clase 'visible'
    function checkElements() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Verificar elementos al cargar la página y al hacer scroll
    checkElements();
    window.addEventListener('scroll', checkElements);
});