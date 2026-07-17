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
   VISOR PROFESIONAL DE PRODUCTOS
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const visor = document.getElementById("visor-producto");
    const imagenAmpliada = document.getElementById(
        "imagen-producto-ampliada"
    );
    const nombreAmpliado = document.getElementById(
        "nombre-producto-ampliado"
    );
    const precioAmpliado = document.getElementById(
        "precio-producto-ampliado"
    );
    const botonCerrar = document.getElementById(
        "cerrar-visor-producto"
    );

    if (
        !visor ||
        !imagenAmpliada ||
        !nombreAmpliado ||
        !precioAmpliado ||
        !botonCerrar
    ) {
        console.error(
            "Faltan elementos del visor de productos en el HTML."
        );
        return;
    }

    function abrirProducto(producto) {
        const imagen = producto.querySelector(".img-producto");
        const nombre = producto.querySelector("h3");
        const precio =
            producto.querySelector(".precio-actual") ||
            producto.querySelector("p");

        if (!imagen) {
            console.error("El producto no contiene una imagen.");
            return;
        }

        imagenAmpliada.src =
            imagen.currentSrc ||
            imagen.src;

        imagenAmpliada.alt =
            imagen.alt ||
            "Producto ampliado";

        nombreAmpliado.textContent =
            nombre?.textContent.trim() ||
            imagen.alt ||
            "Producto";

        precioAmpliado.textContent =
            precio?.textContent.trim() ||
            "";

        visor.classList.add("activo");
        document.body.classList.add(
            "visor-producto-abierto"
        );

        visor.setAttribute("aria-hidden", "false");

        botonCerrar.focus();
    }

    function cerrarProducto() {
        visor.classList.remove("activo");

        document.body.classList.remove(
            "visor-producto-abierto"
        );

        visor.setAttribute("aria-hidden", "true");

        setTimeout(() => {
            imagenAmpliada.src = "";
            imagenAmpliada.alt = "";
            nombreAmpliado.textContent = "";
            precioAmpliado.textContent = "";
        }, 300);
    }

    document.querySelectorAll(".producto").forEach((producto) => {
        const contenedorImagen =
            producto.querySelector(".producto-imagen");

        if (!contenedorImagen) {
            return;
        }

        contenedorImagen.setAttribute("role", "button");
        contenedorImagen.setAttribute("tabindex", "0");
        contenedorImagen.setAttribute(
            "aria-label",
            "Ver producto ampliado"
        );

        contenedorImagen.addEventListener("click", () => {
            abrirProducto(producto);
        });

        contenedorImagen.addEventListener(
            "keydown",
            (evento) => {
                if (
                    evento.key === "Enter" ||
                    evento.key === " "
                ) {
                    evento.preventDefault();
                    abrirProducto(producto);
                }
            }
        );
    });

    botonCerrar.addEventListener("click", cerrarProducto);

    visor.addEventListener("click", (evento) => {
        if (evento.target === visor) {
            cerrarProducto();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (
            evento.key === "Escape" &&
            visor.classList.contains("activo")
        ) {
            cerrarProducto();
        }
    });
});
