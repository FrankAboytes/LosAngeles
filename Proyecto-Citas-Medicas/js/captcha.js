// Habilitar botón de envío cuando el CAPTCHA se complete correctamente
function enableSubmitButton() {
    document.getElementById('submitButton').disabled = false;
    document.getElementById('captchaError').textContent = '';
}
// Validar el formulario antes de enviar
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar que el CAPTCHA se haya completado
            const response = grecaptcha.getResponse();
            if (!response) {
                document.getElementById('captchaError').textContent = 'Por favor, complete el CAPTCHA para continuar';
                return;
            }
            
            // Si el CAPTCHA es válido, proceder con el envío del formulario
            submitForm();
        });
    }
});
// Función para enviar el formulario (simulada)
function submitForm() {
    // Aquí iría la lógica para enviar los datos del formulario al servidor
    // Por ahora, solo mostraremos el modal de confirmación
    
    // Obtener los datos de fecha y hora seleccionados
    const date = document.getElementById('appointmentDate').value;
    const time = document.querySelector('.time-slot.selected').dataset.time;
    
    // Formatear la fecha para mostrarla
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    // Mostrar la confirmación
    document.getElementById('confirmedDate').textContent = formattedDate;
    document.getElementById('confirmedTime').textContent = time;
    document.getElementById('confirmationModal').style.display = 'flex';
    
    // Limpiar el CAPTCHA
    grecaptcha.reset();
    document.getElementById('submitButton').disabled = true;
}