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

/* ===========================
   VISOR UNIVERSAL DE IMÁGENES
=========================== */

function abrirImagen(src, alt = "") {

    const visor = document.getElementById("visor-imagen");
    const imagen = document.getElementById("imagen-grande");

    imagen.src = src;
    imagen.alt = alt;

    visor.classList.add("activo");

    document.body.style.overflow = "hidden";
}


function cerrarImagen() {

    const visor = document.getElementById("visor-imagen");

    visor.classList.remove("activo");

    document.body.style.overflow = "auto";
}


/* Cerrar haciendo clic en el fondo */

document.getElementById("visor-imagen").addEventListener("click", function(e){

    if(e.target.id === "visor-imagen"){

        cerrarImagen();

    }

});


/* Evita cerrar al hacer clic sobre la imagen */

document.getElementById("imagen-grande").addEventListener("click", function(e){

    e.stopPropagation();

});


/* Botón X */

document.getElementById("boton-cerrar-imagen").addEventListener("click", function(e){

    e.stopPropagation();

    cerrarImagen();

});


/* Tecla ESC */

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        cerrarImagen();

    }

});
