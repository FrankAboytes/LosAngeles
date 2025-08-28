document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha mínima como hoy
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    if (document.getElementById('appointmentDate')) {
        document.getElementById('appointmentDate').setAttribute('min', todayStr);
    }
    
    // Cargar datos desde cookies si existen
    if (document.cookie) {
        const cookies = document.cookie.split(';');
        const data = {};
        
        cookies.forEach(cookie => {
            const [key, value] = cookie.split('=');
            data[key.trim()] = decodeURIComponent(value);
        });
        
        // Rellenar formulario con datos de las cookies
        if (document.getElementById('firstName')) {
            document.getElementById('firstName').value = data.firstName || '';
            document.getElementById('lastName').value = data.lastName || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('birthdate').value = data.birthdate || '';
            document.getElementById('idNumber').value = data.idNumber || '';
        }
    }
    
    // Funcionalidad de la tarjeta del doctor
    const doctorCard = document.getElementById('doctorCard');
    const contactBtn = document.getElementById('contactBtn');
    
    if (doctorCard) {
        doctorCard.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (doctorCard) {
                doctorCard.classList.add('flipped');
                
                // Scroll suave hacia la tarjeta del doctor
                doctorCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Obtener citas existentes del localStorage
    let existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Función para generar horarios disponibles
    function generateTimeSlots(selectedDate) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        // Horarios de trabajo: 8:00 AM to 12:00 PM y 2:00 PM to 5:00 PM
        const timeSlots = [
            '08:00', '09:00', '10:00', '11:00', 
            '14:00', '15:00', '16:00', '17:00'
        ];
        
        // Verificar si la fecha seleccionada es hoy
        const now = new Date();
        const isToday = selectedDate === todayStr;
        
        timeSlots.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot', 'clickable');
            timeSlot.textContent = time;
            timeSlot.dataset.time = time;
            
            // Verificar si el horario ya está ocupado
            const isBooked = existingAppointments.some(app => 
                app.date === selectedDate && app.time === time
            );
            
            // Si es hoy, verificar si el horario ya pasó
            let isPast = false;
            if (isToday) {
                const [hours, minutes] = time.split(':').map(Number);
                const slotTime = new Date();
                slotTime.setHours(hours, minutes, 0, 0);
                isPast = now > slotTime;
            }
            
            if (isBooked || isPast) {
                timeSlot.classList.add('unavailable');
                timeSlot.title = isBooked ? 'Horario no disponible' : 'Horario ya pasó';
            } else {
                timeSlot.classList.add('available');
                timeSlot.addEventListener('click', function() {
                    // Deseleccionar cualquier otro horario seleccionado
                    document.querySelectorAll('.time-slot.selected').forEach(slot => {
                        slot.classList.remove('selected');
                    });
                    
                    // Seleccionar este horario
                    this.classList.add('selected');
                    document.querySelector('.availability-info').innerHTML = 
                        `<p>Horario seleccionado: <strong>${time}</strong></p>`;
                });
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }
    
    // Evento para cambiar la fecha
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        appointmentDateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            document.querySelector('.availability-info').innerHTML = 
                `<p>Horarios disponibles para el ${formatDate(selectedDate)}</p>`;
            generateTimeSlots(selectedDate);
        });
    }
    
    // Formatear fecha para mostrar
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    }
    
    // Cerrar modal
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            document.getElementById('confirmationModal').style.display = 'none';
            
            // Recargar horarios disponibles
            const selectedDate = document.getElementById('appointmentDate').value;
            if (selectedDate) {
                generateTimeSlots(selectedDate);
            }
            
            // Limpiar formulario
            document.getElementById('reason').value = '';
            document.querySelectorAll('.time-slot.selected').forEach(slot => {
                slot.classList.remove('selected');
            });
        });
    }
    
    // Añadir efecto de clic a todos los elementos con la clase "clickable"
    const clickableElements = document.querySelectorAll('.clickable');
    clickableElements.forEach(element => {
        element.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        element.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});