const URL_GOOGLE =
    "https://script.google.com/macros/s/AKfycbx7X7rhbSBe9T4Bg5RJlRd1LnXiHMP-nthbIVJZex5pHP0Xdv8YuPB_Xb6zovOo_ai3/exec";

const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const carrera = document.getElementById("carrera");
const programas = document.querySelector(".programas");

const botonEnviar =
    formulario.querySelector('button[type="submit"]');

function llenarProgramas(lista) {

    programas.innerHTML = "";

    carrera.innerHTML =
        '<option value="">Selecciona un programa</option>';

    lista.forEach(function (programa) {

        const opcion = document.createElement("option");

        opcion.value = programa.nombre;
        opcion.textContent = programa.nombre;

        carrera.appendChild(opcion);

        const tarjeta =
            document.createElement("article");

        tarjeta.className = "tarjeta";

        const imagen =
            document.createElement("div");

        imagen.className = "tarjeta-img";

        if (programa.imagen) {

            imagen.style.backgroundImage =
                `url("${programa.imagen}")`;

        } else {

            imagen.style.background =
                "linear-gradient(135deg, #1a62f0, #17294a)";
        }

        imagen.setAttribute(
            "role",
            "img"
        );

        imagen.setAttribute(
            "aria-label",
            programa.nombre
        );

        const cuerpo =
            document.createElement("div");

        cuerpo.className =
            "tarjeta-cuerpo";

        const titulo =
            document.createElement("h3");

        titulo.textContent =
            programa.nombre;

        const descripcion =
            document.createElement("p");

        descripcion.textContent =
            programa.descripcion;

        const boton =
            document.createElement("a");

        boton.href = "#registro";

        boton.className =
            "btn btn-azul btn-chico";

        boton.textContent =
            "Más información";

        boton.dataset.programa =
            programa.nombre;

        boton.addEventListener(
            "click",
            function () {

                carrera.value =
                    programa.nombre;

            }
        );

        cuerpo.appendChild(titulo);
        cuerpo.appendChild(descripcion);
        cuerpo.appendChild(boton);

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(cuerpo);

        programas.appendChild(tarjeta);

    });
}

async function cargarCarreras() {

    programas.innerHTML =
        "<p>Cargando programas...</p>";

    carrera.innerHTML =
        '<option value="">Cargando programas...</option>';

    try {

        const respuesta =
            await fetch(
                URL_GOOGLE + "?accion=carreras"
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo conectar con Google Sheets"
            );
        }

        const datos =
            await respuesta.json();

        if (datos.error) {

            throw new Error(
                datos.error
            );
        }

        llenarProgramas(datos);

    } catch (error) {

        console.error(error);

        programas.innerHTML =
            "<p>No se pudieron cargar los programas.</p>";

        carrera.innerHTML =
            '<option value="">No disponible</option>';
    }
}

cargarCarreras();

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const datos = {

            nombre:
                document.getElementById("nombre").value,

            correo:
                document.getElementById("correo").value,

            telefono:
                document.getElementById("telefono").value,

            carrera:
                carrera.value,

            acepto:
                document.getElementById("acepto").checked
        };

        mensaje.textContent =
            "Enviando...";

        mensaje.style.color =
            "#1a62f0";

        botonEnviar.disabled =
            true;

        try {

            const respuesta =
                await fetch(
                    URL_GOOGLE,
                    {
                        method: "POST",
                        body: JSON.stringify(datos)
                    }
                );

            if (!respuesta.ok) {

                throw new Error(
                    "Error al enviar los datos"
                );
            }

            mensaje.textContent =
                "¡Registro enviado! Pronto te contactaremos.";

            mensaje.style.color =
                "#12a150";

            formulario.reset();

            mostrarExito();

        } catch (error) {

            console.error(error);

            mensaje.textContent =
                "No se pudo enviar el registro. Inténtalo de nuevo.";

            mensaje.style.color =
                "#d32f2f";

        } finally {

            botonEnviar.disabled =
                false;
        }
    }
);


// ==========================================
// VENTANA DE ÉXITO
// ==========================================

const modalExito = document.getElementById("modalExito");
const cerrarModal = document.getElementById("cerrarModal");

function mostrarExito() {
    modalExito.classList.add("activo");
    modalExito.setAttribute("aria-hidden", "false");
    cerrarModal.focus();
}

function ocultarExito() {
    modalExito.classList.remove("activo");
    modalExito.setAttribute("aria-hidden", "true");
}

cerrarModal.addEventListener("click", ocultarExito);

modalExito.addEventListener("click", function (e) {
    if (e.target === modalExito) {
        ocultarExito();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        ocultarExito();
    }
});