// URL de Google Apps Script
const URL_GOOGLE =
    "https://script.google.com/macros/s/AKfycbx0ZEpEHIICHmt-6WpTTnl6pPnPLD_OFbCQO_uXw7WJMr6OVe6LjaEJcq-e2ncMSFFO/exec";

// Programas que se muestran si no se puede leer Google Sheets
const PROGRAMAS_RESPALDO = [
    "Desarrollo de Software",
    "Administración de Empresas",
    "Redes y Telecomunicaciones"
];

const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const carrera = document.getElementById("carrera");
const botonEnviar = formulario.querySelector('button[type="submit"]');


// ==========================================
// CARGAR PROGRAMAS (Google Sheets)
// ==========================================

function llenarProgramas(lista) {
    carrera.innerHTML = '<option value="">Selecciona un programa</option>';

    lista.forEach(function (nombre) {
        const opcion = document.createElement("option");
        opcion.value = nombre;
        opcion.textContent = nombre;
        carrera.appendChild(opcion);
    });
}

async function cargarCarreras() {
    carrera.innerHTML = '<option value="">Cargando programas...</option>';

    try {
        const respuesta = await fetch(URL_GOOGLE + "?accion=carreras");

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con Google Sheets");
        }

        const carreras = await respuesta.json();
        llenarProgramas(carreras);

    } catch (error) {
        console.error("Error:", error);
        llenarProgramas(PROGRAMAS_RESPALDO);
    }
}

cargarCarreras();


// ==========================================
// BOTONES "MÁS INFORMACIÓN": preseleccionan el programa
// ==========================================

document.querySelectorAll("[data-programa]").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        const programa = enlace.dataset.programa;
        const existe = Array.from(carrera.options).some(function (op) {
            return op.value === programa;
        });

        if (existe) {
            carrera.value = programa;
        }
    });
});


// ==========================================
// ENVIAR FORMULARIO
// ==========================================

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        carrera: carrera.value,
        acepto: document.getElementById("acepto").checked,

        // Campos del formulario anterior, por compatibilidad con la hoja
        clave: "",
        fecha: "",
        genero: "",
        comentario: ""
    };

    mensaje.textContent = "Enviando...";
    mensaje.style.color = "#1a62f0";
    botonEnviar.disabled = true;

    try {
        const respuesta = await fetch(URL_GOOGLE, {
            method: "POST",
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error("Error al enviar los datos");
        }

        mensaje.textContent = "¡Registro enviado! Pronto te contactaremos.";
        mensaje.style.color = "#12a150";

        formulario.reset();

    } catch (error) {
        console.error("Error:", error);
        mensaje.textContent = "No se pudo enviar el registro. Inténtalo de nuevo.";
        mensaje.style.color = "#d32f2f";

    } finally {
        botonEnviar.disabled = false;
    }
});