function mostrarSeccion(id) {
    const secciones = document.querySelectorAll(".seccion");
    const seccionSeleccionada = document.getElementById(id);

    secciones.forEach((seccion) => {
        seccion.classList.remove("activa");
    });

    if (seccionSeleccionada) {
        seccionSeleccionada.classList.add("activa");
    }
}

/* =========================
   CARRITO
========================= */

let carrito = [];

function agregarCarrito(nombre, precio) {
    carrito.push({
        nombre: nombre,
        precio: Number(precio)
    });

    mostrarCarrito();
}

function mostrarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalElemento = document.getElementById("total");

    if (!lista || !totalElemento) {
        console.error("No se encontró listaCarrito o total.");
        return;
    }

    let total = 0;
    lista.innerHTML = "";

    carrito.forEach((producto) => {
        lista.innerHTML += `
            <p>
                ${producto.nombre} - S/ ${producto.precio.toFixed(2)}
            </p>
        `;

        total += producto.precio;
    });

    totalElemento.textContent = total.toFixed(2);
}

function comprarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "Hola, quiero comprar:\n";

    carrito.forEach((producto) => {
        mensaje += `- ${producto.nombre} S/ ${producto.precio.toFixed(2)}\n`;
    });

    const total = document.getElementById("total")?.textContent || "0.00";

    mensaje += `\nTotal: S/ ${total}`;

    const url =
        "https://wa.me/51973265025?text=" +
        encodeURIComponent(mensaje);

    window.open(url, "_blank");
}

/* ======================================
   VISOR UNIVERSAL DE IMÁGENES
====================================== */

function abrirImagen(src, alt = "Imagen ampliada") {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor || !imagenGrande) {
        console.error(
            "No se encontró #visor-imagen o #imagen-grande."
        );
        return;
    }

    imagenGrande.src = src;
    imagenGrande.alt = alt || "Imagen ampliada";

    visor.classList.add("activo");
    visor.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


function cerrarImagen() {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor) {
        return;
    }

    visor.classList.remove("activo");
    visor.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    setTimeout(() => {
        if (imagenGrande && !visor.classList.contains("activo")) {
            imagenGrande.src = "";
        }
    }, 280);
}


document.addEventListener("DOMContentLoaded", function () {
    const visor = document.getElementById("visor-imagen");
    const botonCerrar = document.getElementById(
        "boton-cerrar-imagen"
    );
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor || !botonCerrar || !imagenGrande) {
        console.error("El visor de imágenes no está completo.");
        return;
    }

    /* Cerrar con la X */

    botonCerrar.addEventListener("click", function (evento) {
        evento.stopPropagation();
        cerrarImagen();
    });


    /* Cerrar haciendo clic en el fondo negro */

    visor.addEventListener("click", function (evento) {
        if (
            evento.target === visor ||
            evento.target.classList.contains("visor-contenido")
        ) {
            cerrarImagen();
        }
    });


    /* No cerrar al hacer clic sobre la imagen */

    imagenGrande.addEventListener("click", function (evento) {
        evento.stopPropagation();
    });
});


/* Cerrar con Escape */

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        cerrarImagen();
    }
});
