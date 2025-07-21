let formTouched = false;

// Mapeos
const especieMap = {
    "Perro": 1, "Gato": 2, "Hamster": 3, "Tortuga": 4,
    "Pájaro": 5, "Conejo": 6, "Reptil": 7
};
const tamanoMap = { "Pequeño": 1, "Mediano": 2, "Grande": 3 };
const vacunasMap = {
    "Moquillo": 1, "Parvovirus": 2, "Hepatitis": 3, "Rabia": 4,
    "Triple felina": 5, "Panleucopenia": 6, "Virus de inmunodeficiencia felina (FIV)": 7,
    "Enfermedad vírica hemorrágica": 8
};

// Configuración de campos
["nombre", "condiciones", "enfermedades", "descripcion-mascota"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("maxlength", "255");
});

const inputs = ['nombre', 'especie', 'tamano', 'peso', 'sexo', 'condiciones', 'esterilizada', 'desparacitada', 'enfermedades', 'descripcion-mascota'];

// Funciones de validación
function validarCampo(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    if (el.type === 'file') return true;
    if (el.tagName === 'SELECT') return el.value !== "";
    return el.value.trim().length > 0;
}

function validarPeso() {
    const peso = document.getElementById('peso');
    const val = peso.value.trim();
    return val !== "" && !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
}

function validarForm() {
    let valido = true;
    for (const id of inputs) {
        if (id === 'peso') {
            if (!validarPeso()) valido = false;
            continue;
        }
        if (!validarCampo(id)) valido = false;
    }
    mostrarErrores(valido);
    return valido;
}

function mostrarErrores(valido) {
    let errorDiv = document.getElementById('errores-form');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errores-form';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '18px';
        errorDiv.style.marginTop = '10px';
        document.querySelector('.registrar-boton').appendChild(errorDiv);
    }
    if (!valido && formTouched) {
        errorDiv.textContent = 'Por favor, completa todos los campos obligatorios.';
    } else {
        errorDiv.textContent = '';
    }
}

// Event listeners para validación
inputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'file') {
        el.addEventListener('change', () => {
            formTouched = true;
            validarForm();
        });
    } else {
        el.addEventListener('input', () => {
            formTouched = true;
            validarForm();
        });
        el.addEventListener('change', () => {
            formTouched = true;
            validarForm();
        });
    }
});

document.getElementById('vacunas-select').addEventListener('click', () => {
    formTouched = true;
    validarForm();
});

validarForm();

// Enviar formulario como FormData
document.getElementById('enviarForm').addEventListener('click', function () {
    formTouched = true;
    if (!validarForm()) return;

    // Crear objeto FormData
    const formData = new FormData();

    // Agregar campos de texto según el modelo del backend
    formData.append('nombre_mascotas', document.getElementById('nombre').value.trim());
    formData.append('codigo_especie', especieMap[document.getElementById('especie').value] || '');
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('peso', document.getElementById('peso').value.trim());
    formData.append('codigo_tamaño', tamanoMap[document.getElementById('tamano').value] || '');
    formData.append('raza', document.getElementById('raza').value.trim());
    formData.append('esterilizado', document.getElementById('esterilizada').value);
    formData.append('desparasitado', document.getElementById('desparacitada').value);
    formData.append('discapacitado', document.getElementById('condiciones').value.trim());
    formData.append('enfermedades', document.getElementById('enfermedades').value.trim());
    formData.append('descripcion', document.getElementById('descripcion-mascota').value.trim());
    
    // Agregar vacunas seleccionadas (códigos)
    const vacunasCheckboxes = document.querySelectorAll('#vacunas-dropdown input[type="checkbox"]:checked');
    if (vacunasCheckboxes.length > 0) {
        // Tomar solo la primera vacuna seleccionada (según el modelo que solo acepta un código)
        const primeraVacuna = vacunasCheckboxes[0].value;
        formData.append('codigo_vacunas', vacunasMap[primeraVacuna] || '');
    } else {
        formData.append('codigo_vacunas', ''); // O el valor por defecto que espera el backend
    }

    // Agregar archivos de imágenes
    for (let i = 1; i <= 3; i++) {
        const fileInput = document.getElementById('file' + i);
        if (fileInput && fileInput.files[0]) {
            formData.append('fotos', fileInput.files[0]);
        }
    }

    // Agregar id_Cedente si es necesario (deberías obtenerlo de alguna parte)
    // formData.append('id_Cedente', valorIdCedente);

    // Depuración: Mostrar los datos que se enviarán
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    // Enviar FormData
    fetch('http://44.208.231.53:7078/mascotas', {
        method: 'POST',
        body: formData
        // No establezcas el header 'Content-Type', el navegador lo hará automáticamente
        // con el boundary correcto para FormData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        alert('✅ Mascota registrada correctamente');
        // Redirigir o limpiar el formulario
        window.location.href = '/administrador/html/lista_mascotas.html'; // Ajusta la ruta según tu estructura
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error al registrar la mascota: ' + error.message);
    });
});