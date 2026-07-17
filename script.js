"use strict";

/* ==================================================
   CAMBIO DE SECCIONES
================================================== */

function mostrarSeccion(id) {
    const secciones = document.querySelectorAll(".seccion");
    const seccionSeleccionada = document.getElementById(id);

    secciones.forEach((seccion) => {
        seccion.classList.remove("activa");
    });

    if (!seccionSeleccionada) {
        console.error(`No existe una sección con el id: ${id}`);
        return;
    }

    seccionSeleccionada.classList.add("activa");

    /* Cierra el menú desplegable, en caso de estar abierto */
    const menuOpciones = document.querySelector(".opciones-menu");
    menuOpciones?.classList.remove("mostrar");

    /* Lleva al usuario al inicio de la sección */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==================================================
   CARRITO DE COMPRAS
================================================== */

let carrito = [];


/* Agregar producto */

function agregarCarrito(nombre, precio) {
    const precioNumerico = Number(precio);

    if (!nombre || Number.isNaN(precioNumerico)) {
        console.error("Los datos del producto no son válidos.");
        return;
    }

    carrito.push({
        nombre: nombre,
        precio: precioNumerico
    });

    mostrarCarrito();
}


/* Mostrar productos agregados */

function mostrarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalElemento = document.getElementById("total");
    const contador = document.getElementById("contadorCarrito");
    const botonCarrito = document.querySelector(".btn-carrito");

    if (!lista || !totalElemento) {
        console.error("No se encontró #listaCarrito o #total.");
        return;
    }

    lista.innerHTML = "";

    let total = 0;

    carrito.forEach((producto, indice) => {
        total += producto.precio;

        const item = document.createElement("div");
        item.className = "item-carrito";

        const nombreProducto = document.createElement("span");
        nombreProducto.textContent = producto.nombre;

        const precioProducto = document.createElement("strong");
        precioProducto.textContent =
            producto.precio === 0
                ? "Gratis"
                : `S/ ${producto.precio.toFixed(2)}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.className = "btn-eliminar";
        botonEliminar.setAttribute(
            "aria-label",
            `Eliminar ${producto.nombre}`
        );
        botonEliminar.textContent = "×";

        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(indice);
        });

        item.append(
            nombreProducto,
            precioProducto,
            botonEliminar
        );

        lista.appendChild(item);
    });

    totalElemento.textContent = total.toFixed(2);

    if (contador) {
        contador.textContent = carrito.length;
    }

    if (botonCarrito) {
        botonCarrito.style.display =
            carrito.length > 0 ? "flex" : "none";
    }
}


/* Eliminar producto */

function eliminarDelCarrito(indice) {
    if (indice < 0 || indice >= carrito.length) {
        return;
    }

    carrito.splice(indice, 1);
    mostrarCarrito();
}


/* Vaciar carrito */

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}


/* Abrir panel del carrito */

function abrirCarrito() {
    const panel = document.querySelector(".panel-carrito");

    if (!panel) {
        console.error("No se encontró .panel-carrito.");
        return;
    }

    panel.classList.add("activo");
    document.body.classList.add("carrito-abierto");
}


/* Cerrar panel del carrito */

function cerrarCarrito() {
    const panel = document.querySelector(".panel-carrito");

    if (!panel) return;

    panel.classList.remove("activo");
    document.body.classList.remove("carrito-abierto");
}


/* Comprar mediante WhatsApp */

function comprarWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "Hola, Academia Soubac Ajedrez. Quiero solicitar:\n\n";

    carrito.forEach((producto, indice) => {
        const precioTexto =
            producto.precio === 0
                ? "Gratis"
                : `S/ ${producto.precio.toFixed(2)}`;

        mensaje += `${indice + 1}. ${producto.nombre} — ${precioTexto}\n`;
    });

    const total = carrito.reduce(
        (acumulado, producto) => acumulado + producto.precio,
        0
    );

    mensaje += `\nTotal: S/ ${total.toFixed(2)}`;
    mensaje += "\n\nAgradeceré que me brinden más información.";

    const url =
        "https://wa.me/51973265025?text=" +
        encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
}


/* ==================================================
   VISOR UNIVERSAL DE IMÁGENES
================================================== */

function abrirImagen(src, alt = "Imagen ampliada") {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor || !imagenGrande) {
        console.error(
            "No se encontró #visor-imagen o #imagen-grande en el HTML."
        );
        return;
    }

    if (!src) {
        console.error("La imagen no tiene una ruta válida.");
        return;
    }

    imagenGrande.src = src;
    imagenGrande.alt = alt || "Imagen ampliada";

    visor.classList.add("activo");
    visor.setAttribute("aria-hidden", "false");

    document.body.classList.add("visor-abierto");

    const botonCerrar = document.getElementById(
        "boton-cerrar-imagen"
    );

    botonCerrar?.focus();
}


function cerrarImagen() {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");

    if (!visor) return;

    visor.classList.remove("activo");
    visor.setAttribute("aria-hidden", "true");

    document.body.classList.remove("visor-abierto");

    window.setTimeout(() => {
        if (
            imagenGrande &&
            !visor.classList.contains("activo")
        ) {
            imagenGrande.src = "";
        }
    }, 280);
}


/* ==================================================
   CONFIGURACIÓN INICIAL
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const visor = document.getElementById("visor-imagen");
    const imagenGrande = document.getElementById("imagen-grande");
    const botonCerrarImagen = document.getElementById(
        "boton-cerrar-imagen"
    );

    /*
     * Esta parte permite ampliar imágenes aunque olvides
     * escribir onclick en una imagen nueva.
     */

    const imagenesAmpliables = document.querySelectorAll(
        ".card-galeria img, .producto .img-producto, .imagen-ampliable"
    );

    imagenesAmpliables.forEach((imagen) => {
        imagen.style.cursor = "zoom-in";

        /*
         * Solo agrega el evento automático cuando la imagen
         * no tiene ya un onclick declarado.
         */

        if (!imagen.hasAttribute("onclick")) {
            imagen.addEventListener("click", () => {
                abrirImagen(imagen.currentSrc || imagen.src, imagen.alt);
            });
        }
    });


    /* Botón X */

    botonCerrarImagen?.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        cerrarImagen();
    });


    /* Cerrar al pulsar el fondo oscuro */

    visor?.addEventListener("click", (evento) => {
        const hizoClicEnFondo =
            evento.target === visor ||
            evento.target.classList.contains("visor-contenido");

        if (hizoClicEnFondo) {
            cerrarImagen();
        }
    });


    /* Evitar que un clic en la foto la cierre */

    imagenGrande?.addEventListener("click", (evento) => {
        evento.stopPropagation();
    });


    /* Mostrar inicialmente el carrito */

    mostrarCarrito();
});


/* ==================================================
   EVENTOS DEL TECLADO
================================================== */

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarImagen();
        cerrarCarrito();
    }
});
/* ==================================================
   VISOR PROFESIONAL PARA PRODUCTOS
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* Crear el visor automáticamente */
    const visor = document.createElement("div");
    visor.id = "visor-producto";
    visor.className = "visor-producto";
    visor.setAttribute("aria-hidden", "true");

    visor.innerHTML = `
        <div class="visor-producto-contenido">

            <button
                type="button"
                class="cerrar-visor-producto"
                aria-label="Cerrar imagen"
            >
                &times;
            </button>

            <img
                id="imagen-producto-ampliada"
                src=""
                alt="Producto ampliado"
            >

            <h3 id="nombre-producto-ampliado"></h3>

        </div>
    `;

    document.body.appendChild(visor);

    const imagenAmpliada = document.getElementById(
        "imagen-producto-ampliada"
    );

    const nombreAmpliado = document.getElementById(
        "nombre-producto-ampliado"
    );

    const botonCerrar = visor.querySelector(
        ".cerrar-visor-producto"
    );


    /* Abrir al presionar una tarjeta de producto */
    document.querySelectorAll(".producto").forEach(function (producto) {

        producto.setAttribute("tabindex", "0");
        producto.setAttribute("role", "button");

        producto.addEventListener("click", function (evento) {

            /*
             * No abrir la imagen cuando se presiona
             * el botón Agregar al carrito.
             */
            if (evento.target.closest("button")) {
                return;
            }

            const imagen = producto.querySelector("img");
            const titulo = producto.querySelector("h3");

            if (!imagen) {
                return;
            }

            imagenAmpliada.src =
                imagen.currentSrc || imagen.src;

            imagenAmpliada.alt =
                imagen.alt || "Producto ampliado";

            nombreAmpliado.textContent =
                titulo?.textContent.trim() || "";

            visor.classList.add("activo");
            visor.setAttribute("aria-hidden", "false");

            document.body.classList.add("visor-producto-abierto");
        });


        /* También abrir usando Enter */
        producto.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" &&
                !evento.target.closest("button")
            ) {
                evento.preventDefault();
                producto.click();
            }

        });

    });


    function cerrarVisorProducto() {
        visor.classList.remove("activo");
        visor.setAttribute("aria-hidden", "true");

        document.body.classList.remove(
            "visor-producto-abierto"
        );

        window.setTimeout(function () {

            if (!visor.classList.contains("activo")) {
                imagenAmpliada.src = "";
                nombreAmpliado.textContent = "";
            }

        }, 250);
    }


    /* Cerrar con la X */
    botonCerrar.addEventListener("click", function (evento) {
        evento.stopPropagation();
        cerrarVisorProducto();
    });


    /* Cerrar presionando el fondo oscuro */
    visor.addEventListener("click", function (evento) {

        if (evento.target === visor) {
            cerrarVisorProducto();
        }

    });


    /* Cerrar con Escape */
    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape") {
            cerrarVisorProducto();
        }

    });

});
