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

/* =========================
   VISOR DE PRODUCTOS
========================= */

function abrirProducto(src) {
    const visorProducto = document.getElementById("visorProducto");
    const imagenProducto = document.getElementById("imagenProductoGrande");

    if (!visorProducto || !imagenProducto) {
        console.error("No se encontró el visor del producto.");
        return;
    }

    imagenProducto.src = src;
    visorProducto.classList.add("visible");
    document.body.style.overflow = "hidden";
}

function cerrarProducto() {
    const visorProducto = document.getElementById("visorProducto");

    if (!visorProducto) return;

    visorProducto.classList.remove("visible");
    document.body.style.overflow = "";
}

/* =========================
   VISOR DE GALERÍA
========================= */

function abrirImagen(src, alt = "Imagen ampliada") {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor || !imagenGrande) {
        console.error(
            'No se encontró #visor-imagen o #imagen-grande en el HTML.'
        );
        return;
    }

    imagenGrande.src = src;
    imagenGrande.alt = alt;

    visor.classList.add("visible");
    visor.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function cerrarImagen() {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor) return;

    visor.classList.remove("visible");
    visor.setAttribute("aria-hidden", "true");

    if (imagenGrande) {
        imagenGrande.src = "";
    }

    document.body.style.overflow = "";
}

/* Cerrar únicamente al tocar el fondo oscuro */
document.addEventListener("DOMContentLoaded", () => {
    const visor = document.getElementById("visor-imagen");

    if (visor) {
        visor.addEventListener("click", (evento) => {
            if (evento.target === visor) {
                cerrarImagen();
            }
        });
    }
});

/* Cerrar con la tecla Escape */
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarImagen();
        cerrarProducto();
    }
});

function cerrarImagen() {
    document.getElementById("visor-imagen").style.display = "none";
    document.body.style.overflow = "auto";
}
