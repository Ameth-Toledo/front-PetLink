// formulario_mascota.js

document.addEventListener('DOMContentLoaded', function() {
    // Mapeo de especies a códigos (ajusta según tu base de datos)
    const especiesMap = {
        'Perro': 1,
        'Gato': 2,
        'Hamster': 3,
        'Tortuga': 4,
        'Pájaro': 5,
        'Conejo': 6,
        'Reptil': 7
    };

    // Mapeo de tamaños a códigos
    const tamanosMap = {
        'Pequeño': 1,
        'Mediano': 2,
        'Grande': 3
    };

    // Función para obtener el código de la vacuna seleccionada
    function getCodigoVacuna() {
        const checkboxes = document.querySelectorAll('#vacunas-dropdown input[type="checkbox"]:checked');
        if (checkboxes.length > 0) {
            const vacunaNombre = checkboxes[0].value;
            // Asume que vacunasMap está definido en vacunas.js
            return window.vacunasMap ? window.vacunasMap[vacunaNombre] : 1; // Default 1 si no existe el map
        }
        return 0; // Si no hay vacunas seleccionadas
    }

    // Validación del formulario
    function validarFormulario() {
        const camposRequeridos = [
            {id: 'nombre', nombre: 'Nombre'},
            {id: 'especie', nombre: 'Especie'},
            {id: 'tamano', nombre: 'Tamaño'},
            {id: 'peso', nombre: 'Peso'},
            {id: 'sexo', nombre: 'Sexo'},
            {id: 'raza', nombre: 'Raza'}
        ];

        for (let campo of camposRequeridos) {
            const elemento = document.getElementById(campo.id);
            if (!elemento || !elemento.value.trim()) {
                alert(`Por favor complete el campo: ${campo.nombre}`);
                return false;
            }
        }

        // Validar peso positivo
        const peso = parseFloat(document.getElementById('peso').value);
        if (isNaN(peso)) {
            alert('El peso debe ser un número válido');
            return false;
        }

        // Validar fotos (mínimo 3)
        const fotos = [
            document.getElementById('file1').files[0],
            document.getElementById('file2').files[0],
            document.getElementById('file3').files[0]
        ].filter(Boolean);

        if (fotos.length < 3) {
            alert('Debe subir al menos 3 fotos de la mascota');
            return false;
        }

        return true;
    }

    // Preparar los datos para enviar
    function prepararDatosMascota() {
        return {
            nombre_mascotas: document.getElementById('nombre').value.trim(),
            codigo_especie: especiesMap[document.getElementById('especie').value],
            sexo: document.getElementById('sexo').value,
            peso: parseFloat(document.getElementById('peso').value),
            codigo_tamaño: tamanosMap[document.getElementById('tamano').value],
            raza: document.getElementById('raza').value.trim(),
            esterilizado: document.getElementById('esterilizada').value === 'Sí' ? 'S' : 'N',
            desparasitado: document.getElementById('desparacitada').value === 'Sí' ? 'S' : 'N',
            discapacitado: document.getElementById('condiciones').value.trim() || 'Ninguna',
            enfermedades: document.getElementById('enfermedades').value.trim() || 'Ninguna',
            codigo_vacunas: getCodigoVacuna(),
            descripcion: document.getElementById('descripcion-mascota').value.trim(),
            id_Cedente: obtenerIdCedente() // Debes implementar esta función
        };
    }

    // Función para obtener el ID del cedente (implementa según tu autenticación)
    function obtenerIdCedente() {
        // Ejemplo: obtener de sessionStorage
        return sessionStorage.getItem('userId') || 3; // Default 1 para pruebas
    }

    // Función para enviar las fotos por separado
    async function enviarFotos(idMascota) {
        const fotos = [
            document.getElementById('file1').files[0],
            document.getElementById('file2').files[0],
            document.getElementById('file3').files[0]
        ];

        for (let i = 0; i < fotos.length; i++) {
            if (fotos[i]) {
                const fotoData = new FormData();
                fotoData.append('mascotaId', idMascota);
                fotoData.append('foto', fotos[i]);
                fotoData.append('orden', i + 1);

                try {
                    await fetch('http://44.208.231.53:7078/solicitudes-cedente', {
                        method: 'POST',
                        body: fotoData
                    });
                } catch (error) {
                    console.error(`Error subiendo foto ${i + 1}:`, error);
                }
            }
        }
    }

    // Enviar datos al backend
    async function registrarMascota() {
        if (!validarFormulario()) return;

        const datosMascota = prepararDatosMascota();

        try {
            // 1. Registrar los datos básicos de la mascota
            const response = await fetch('http://44.208.231.53:7078/solicitudes-cedente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosMascota)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const mascotaRegistrada = await response.json();
            console.log('Mascota registrada:', mascotaRegistrada);

            // 2. Subir las fotos asociadas
            if (mascotaRegistrada.id_mascotas) {
                await enviarFotos(mascotaRegistrada.id_mascotas);
            }

            alert('Mascota registrada exitosamente!');
            // Redirigir o limpiar formulario
            window.location.href = '/mascotas-registradas.html';

        } catch (error) {
            console.error('Error al registrar mascota:', error);
            alert('Error al registrar la mascota: ' + error.message);
        }
    }

    // Event Listeners
    document.querySelector('.btn-aceptar-status').addEventListener('click', registrarMascota);
    
    document.querySelector('.btn-rechazar-status').addEventListener('click', function() {
        if (confirm('¿Cancelar registro? Se perderán los datos ingresados.')) {
            document.querySelector('form').reset();
        }
    });
});