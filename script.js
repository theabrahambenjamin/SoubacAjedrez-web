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

    carrito.push({
        nombre: nombre,
        precio: Number(precio)
    });


    // Guarda el carrito sin abrir el panel
    localStorage.setItem(
        "carritoSoubac",
        JSON.stringify(carrito)
    );

    // Pequeña animación en el botón flotante
    const botonCarrito =
        document.querySelector(".btn-carrito");

    if (botonCarrito) {

        botonCarrito.classList.remove("producto-agregado");

        void botonCarrito.offsetWidth;

        botonCarrito.classList.add("producto-agregado");

        setTimeout(() => {
            botonCarrito.classList.remove(
                "producto-agregado"
            );
        }, 500);
    }
}
function abrirCarrito() {

    const panel =
        document.getElementById("panelCarrito");

    const overlay =
        document.getElementById("overlayCarrito");

    if (panel) {
        panel.classList.add("activo");
    }

    if (overlay) {
        overlay.classList.add("activo");
    }

    document.body.classList.add(
        "carrito-abierto"
    );
}
function cerrarCarrito() {

    const panel =
        document.getElementById("panelCarrito");

    const overlay =
        document.getElementById("overlayCarrito");

    if (panel) {
        panel.classList.remove("activo");
    }

    if (overlay) {
        overlay.classList.remove("activo");
    }

    document.body.classList.remove(
        "carrito-abierto"
    );
}
function abrirProducto(src){

    document.getElementById(
        "imagenProductoGrande"
    ).src = src;

    document
        .getElementById("visorProducto")
        .classList.add("activo");

    document.body.style.overflow="hidden";

}

function cerrarProducto(){

    document
        .getElementById("visorProducto")
        .classList.remove("activo");

    document.body.style.overflow="auto";

}
document
.getElementById("visorProducto")
.addEventListener("click",function(e){

    if(e.target===this){

        cerrarProducto();

    }

});
document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        cerrarProducto();

    }

});
