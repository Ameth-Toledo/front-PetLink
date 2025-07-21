// Opciones de vacunas según especie
const vacunasPorEspecie = {
    Perro: ["Moquillo", "Parvovirus", "Hepatitis", "Rabia"],
    Gato: ["Triple felina", "Panleucopenia", "Virus de inmunodeficiencia felina (FIV)", "Rabia"],
    Conejo: ["Enfermedad vírica hemorrágica"]
};

document.addEventListener('DOMContentLoaded', function() {
    const especieSelect = document.getElementById('especie');
    const vacunasSelect = document.getElementById('vacunas-select');
    const vacunasDropdown = document.getElementById('vacunas-dropdown');
    const vacunasPlaceholder = document.getElementById('vacunas-placeholder');
    let vacunasSeleccionadas = [];

    // Mostrar/ocultar dropdown
    vacunasSelect.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        vacunasDropdown.style.display = this.classList.contains('active') ? 'flex' : 'none';
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function() {
        vacunasSelect.classList.remove('active');
        vacunasDropdown.style.display = 'none';
    });

    // Evitar que el dropdown se cierre al hacer click dentro
    vacunasDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Actualizar opciones al cambiar especie
    especieSelect.addEventListener('change', function() {
        const especie = this.value;
        vacunasDropdown.innerHTML = '';
        vacunasSeleccionadas = [];
        actualizarPlaceholder();

        if(vacunasPorEspecie[especie]) {
            vacunasPorEspecie[especie].forEach(vacuna => {
                const option = document.createElement('label');
                option.innerHTML = `
                    <input type="checkbox" value="${vacuna}">
                    ${vacuna}
                `;
                vacunasDropdown.appendChild(option);

                const checkbox = option.querySelector('input');
                checkbox.addEventListener('change', function() {
                    if(this.checked) {
                        vacunasSeleccionadas.push(this.value);
                    } else {
                        vacunasSeleccionadas = vacunasSeleccionadas.filter(v => v !== this.value);
                    }
                    actualizarPlaceholder();
                });
            });
            vacunasSelect.style.pointerEvents = 'auto';
            vacunasSelect.style.opacity = '1';
        } else {
            vacunasSelect.style.pointerEvents = 'none';
            vacunasSelect.style.opacity = '0.7';
            vacunasPlaceholder.textContent = "No hay opciones";
        }
    });

    function actualizarPlaceholder() {
        if(vacunasSeleccionadas.length > 0) {
            const displayVacunas = vacunasSeleccionadas.map(nombre => 
                nombre === "Virus de inmunodeficiencia felina (FIV)" ? "FIV" : nombre
            );
            vacunasPlaceholder.textContent = displayVacunas.join(', ');
            vacunasPlaceholder.style.color = "#F08224";
            vacunasPlaceholder.style.textAlign = "left";
        } else {
            vacunasPlaceholder.textContent = "Selecciona una o más";
            vacunasPlaceholder.style.color = "#FEE2C2";
            vacunasPlaceholder.style.textAlign = "center";
        }
    }
});