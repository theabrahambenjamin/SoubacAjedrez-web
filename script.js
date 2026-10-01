/* =========================================================
   SOUBAC AJEDREZ
   JAVASCRIPT PRINCIPAL
   Firebase Authentication + Biblioteca + Tienda
========================================================= */


/* =========================================================
   FIREBASE MODULAR
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from
    "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


/* =========================================================
   CONFIGURACIÓN FIREBASE
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyCOmb0ZFxGPCz9h7ZYwBhdI1TpZrzZT4jN8",

    authDomain:
        "soubac-ajedrez.firebaseapp.com",

    projectId:
        "soubac-ajedrez",

    storageBucket:
        "soubac-ajedrez.firebasestorage.app",

    messagingSenderId:
        "795119435641",

    appId:
        "1:795119435641:web:5f2174e3e80a19e97079a8",

    measurementId:
        "G-C6SKT2392Q"

};


/* =========================================================
   INICIALIZAR FIREBASE
========================================================= */

const app =
    initializeApp(
        firebaseConfig
    );


/* =========================================================
   FIREBASE AUTH
========================================================= */

const auth =
    getAuth(app);


/* =========================================================
   PERSISTENCIA DE SESIÓN
========================================================= */

setPersistence(
    auth,
    browserLocalPersistence
)
.catch(
    (error) => {

        console.error(
            "Error configurando la persistencia:",
            error
        );

    }
);


/* =========================================================
   CONFIGURACIÓN DE USUARIOS
========================================================= */

/*
   El estudiante escribe:

   AbrahamBobadillaa

   El sistema convierte internamente:

   abrahambobadillaa@usuarios.soubac.com

   El estudiante NUNCA necesita escribir
   el correo interno.
*/

const DOMINIO_USUARIOS =
    "@usuarios.soubac.com";


/* =========================================================
   VARIABLES GLOBALES
========================================================= */

let libroPendiente = null;

let carrito = [];


/* =========================================================
   RECUPERAR CARRITO
========================================================= */

try {

    const carritoGuardado =
        localStorage.getItem(
            "carritoSoubac"
        );


    if (carritoGuardado) {

        const datos =
            JSON.parse(
                carritoGuardado
            );


        if (
            Array.isArray(datos)
        ) {

            carrito =
                datos;

        }

    }

}
catch (error) {

    console.error(
        "No se pudo recuperar el carrito:",
        error
    );

    carrito = [];

}


/* =========================================================
   CONVERTIR USUARIO A IDENTIFICADOR FIREBASE
========================================================= */

function usuarioAFirebaseEmail(
    usuario
) {

    let valor =
        String(
            usuario || ""
        )
        .trim()
        .toLowerCase();


    /*
       Eliminar espacios.
    */

    valor =
        valor.replace(
            /\s+/g,
            ""
        );


    /*
       Si ya contiene @,
       se respeta.
    */

    if (
        valor.includes("@")
    ) {

        return valor;

    }


    return (
        valor +
        DOMINIO_USUARIOS
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        iniciarPagina();

    }
);


/* =========================================================
   INICIAR PÁGINA
========================================================= */

function iniciarPagina() {

    /* -----------------------------------------------
       Pantalla de carga
    ----------------------------------------------- */

    const pantallaCarga =
        document.getElementById(
            "pantalla-carga"
        );


    if (pantallaCarga) {

        setTimeout(
            () => {

                pantallaCarga.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        if (
                            pantallaCarga &&
                            pantallaCarga.parentNode
                        ) {

                            pantallaCarga.remove();

                        }

                    },
                    700
                );

            },
            500
        );

    }


    /* -----------------------------------------------
       Carrito
    ----------------------------------------------- */

    actualizarCarrito();


    /* -----------------------------------------------
       Sección activa
    ----------------------------------------------- */

    const seccionActiva =
        document.querySelector(
            ".seccion.activa"
        );


    controlarBotonCarrito(

        seccionActiva
            ? seccionActiva.id
            : "inicio"

    );


    /* -----------------------------------------------
       Biblioteca
    ----------------------------------------------- */

    configurarBiblioteca();


    /* -----------------------------------------------
       Visor
    ----------------------------------------------- */

    configurarVisorProducto();

}


/* =========================================================
   MENÚ
========================================================= */

function abrirMenu() {

    const menu =
        document.getElementById(
            "opcionesMenu"
        );


    const boton =
        document.querySelector(
            ".boton-menu"
        );


    if (!menu) {

        return;

    }


    const abierto =
        menu.classList.toggle(
            "mostrar"
        );


    if (boton) {

        boton.setAttribute(
            "aria-expanded",
            String(
                abierto
            )
        );

    }

}


/* =========================================================
   MOSTRAR SECCIÓN
========================================================= */

function mostrar(
    idSeccion
) {

    const seccion =
        document.getElementById(
            idSeccion
        );


    if (!seccion) {

        console.error(
            "No existe la sección:",
            idSeccion
        );

        return;

    }


    const secciones =
        document.querySelectorAll(
            ".seccion"
        );


    secciones.forEach(
        (elemento) => {

            elemento.classList.remove(
                "activa"
            );

        }
    );


    seccion.classList.add(
        "activa"
    );


    const menu =
        document.getElementById(
            "opcionesMenu"
        );


    const botonMenu =
        document.querySelector(
            ".boton-menu"
        );


    if (menu) {

        menu.classList.remove(
            "mostrar"
        );

    }


    if (botonMenu) {

        botonMenu.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    controlarBotonCarrito(
        idSeccion
    );


    cerrarCarrito();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   BIBLIOTECA
========================================================= */

function abrirLibro(
    evento,
    url
) {

    if (evento) {

        evento.preventDefault();

    }


    if (!url) {

        console.error(
            "No se proporcionó URL del libro."
        );

        return;

    }


    libroPendiente =
        url;


    /*
       Si ya existe sesión,
       abrimos directamente.
    */

    if (auth.currentUser) {

        abrirLibroEnNuevaPestana(
            url
        );


        libroPendiente =
            null;


        return;

    }


    /*
       Si no existe sesión,
       mostramos el login.
    */

    abrirLoginBiblioteca();

}


/* =========================================================
   ABRIR LIBRO
========================================================= */

function abrirLibroEnNuevaPestana(
    url,
    ventana = null
) {

    if (!url) {

        return null;

    }


    if (
        ventana &&
        !ventana.closed
    ) {

        ventana.location.href =
            url;


        return ventana;

    }


    const nuevaVentana =
        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );


    if (!nuevaVentana) {

        console.warn(
            "El navegador bloqueó la nueva ventana."
        );

    }


    return nuevaVentana;

}


/* =========================================================
   ABRIR LOGIN
========================================================= */

function abrirLoginBiblioteca() {

    const modal =
        document.getElementById(
            "modalLoginBiblioteca"
        );


    const usuario =
        document.getElementById(
            "usuarioBiblioteca"
        );


    const password =
        document.getElementById(
            "passwordBiblioteca"
        );


    const error =
        document.getElementById(
            "errorLoginBiblioteca"
        );


    if (!modal) {

        console.error(
            "No existe #modalLoginBiblioteca."
        );

        return;

    }


    if (error) {

        error.textContent =
            "";

    }


    if (password) {

        password.value =
            "";

    }


    modal.classList.add(
        "activo"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            if (usuario) {

                usuario.focus();

            }

        },
        100
    );

}


/* =========================================================
   CERRAR LOGIN
========================================================= */

function cerrarLoginBiblioteca() {

    const modal =
        document.getElementById(
            "modalLoginBiblioteca"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "activo"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    restaurarScroll();

}


/* =========================================================
   RESTAURAR SCROLL
========================================================= */

function restaurarScroll() {

    const loginAbierto =
        document
            .getElementById(
                "modalLoginBiblioteca"
            )
            ?.classList.contains(
                "activo"
            );


    const carritoAbierto =
        document
            .getElementById(
                "panelCarrito"
            )
            ?.classList.contains(
                "activo"
            );


    const visorAbierto =
        document
            .getElementById(
                "visorProducto"
            )
            ?.classList.contains(
                "activo"
            );


    if (
        !loginAbierto &&
        !carritoAbierto &&
        !visorAbierto
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   INICIAR SESIÓN EN BIBLIOTECA
========================================================= */

async function iniciarSesionBiblioteca(
    evento
) {

    if (evento) {

        evento.preventDefault();

    }


    const usuarioInput =
        document.getElementById(
            "usuarioBiblioteca"
        );


    const passwordInput =
        document.getElementById(
            "passwordBiblioteca"
        );


    const error =
        document.getElementById(
            "errorLoginBiblioteca"
        );


    const boton =
        document.getElementById(
            "btnLoginBiblioteca"
        );


    const usuario =
        usuarioInput
            ? usuarioInput.value.trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    /* -----------------------------------------------
       Limpiar error
    ----------------------------------------------- */

    if (error) {

        error.textContent =
            "";

    }


    /* -----------------------------------------------
       Validación
    ----------------------------------------------- */

    if (
        !usuario ||
        !password
    ) {

        if (error) {

            error.textContent =
                "Completa tu usuario y contraseña.";

        }

        return;

    }


    /* -----------------------------------------------
       Estado del botón
    ----------------------------------------------- */

    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "Verificando...";

    }


    try {

        /*
           Convertimos:

           AbrahamBobadillaa

           en:

           abrahambobadillaa@usuarios.soubac.com
        */

        const emailFirebase =
            usuarioAFirebaseEmail(
                usuario
            );


        console.log(
            "===================================="
        );

        console.log(
            "SOUBAC AJEDREZ - FIREBASE LOGIN"
        );

        console.log(
            "Usuario:",
            usuario
        );

        console.log(
            "Identificador Firebase:",
            emailFirebase
        );


        /*
           AUTENTICACIÓN MODULAR
        */

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                emailFirebase,
                password
            );


        console.log(
            "LOGIN CORRECTO"
        );

        console.log(
            "UID:",
            resultado.user.uid
        );

        console.log(
            "Usuario Firebase:",
            resultado.user.email
        );


        /*
           Cerrar login
        */

        cerrarLoginBiblioteca();


        /*
           Abrir libro pendiente
        */

        if (libroPendiente) {

            const url =
                libroPendiente;


            libroPendiente =
                null;


            setTimeout(
                () => {

                    abrirLibroEnNuevaPestana(
                        url
                    );

                },
                100
            );

        }

    }

    catch (
        errorFirebase
    ) {

        console.error(
            "===================================="
        );

        console.error(
            "ERROR REAL DE FIREBASE"
        );

        console.error(
            "Código:",
            errorFirebase.code
        );

        console.error(
            "Mensaje:",
            errorFirebase.message
        );


        if (error) {

            switch (
                errorFirebase.code
            ) {

                case "auth/invalid-credential":

                case "auth/invalid-login-credentials":

                case "auth/wrong-password":

                case "auth/user-not-found":

                    error.textContent =
                        "Usuario o contraseña incorrectos.";

                    break;


                case "auth/user-disabled":

                    error.textContent =
                        "Esta cuenta está deshabilitada.";

                    break;


                case "auth/operation-not-allowed":

                    error.textContent =
                        "El acceso con usuario y contraseña no está habilitado en Firebase.";

                    break;


                case "auth/too-many-requests":

                    error.textContent =
                        "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.";

                    break;


                case "auth/network-request-failed":

                    error.textContent =
                        "No hay conexión con Firebase. Revisa tu conexión a Internet.";

                    break;


                case "auth/invalid-email":

                    error.textContent =
                        "El identificador del usuario no es válido.";

                    break;


                case "auth/api-key-not-valid":

                case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":

                    error.textContent =
                        "La configuración de Firebase no es válida. Verifica la API Key.";

                    break;


                default:

                    /*
                       Durante la configuración mostramos
                       el código real para poder localizar
                       cualquier problema.
                    */

                    error.textContent =
                        "Error Firebase: " +
                        (
                            errorFirebase.code ||
                            "desconocido"
                        );

                    break;

            }

        }

    }

    finally {

        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                "Iniciar sesión";

        }

    }

}


/* =========================================================
   CONFIGURAR BIBLIOTECA
========================================================= */

function configurarBiblioteca() {

    const formulario =
        document.getElementById(
            "formLoginBiblioteca"
        );


    const modal =
        document.getElementById(
            "modalLoginBiblioteca"
        );


    /*
       Formulario
    */

    if (formulario) {

        if (
            formulario.dataset.configurado !==
            "true"
        ) {

            formulario.addEventListener(
                "submit",
                iniciarSesionBiblioteca
            );


            formulario.dataset.configurado =
                "true";

        }

    }


    /*
       Cerrar al hacer clic
       fuera de la tarjeta.
    */

    if (modal) {

        if (
            modal.dataset.configurado !==
            "true"
        ) {

            modal.addEventListener(
                "click",
                (evento) => {

                    if (
                        evento.target ===
                        modal
                    ) {

                        cerrarLoginBiblioteca();

                    }

                }
            );


            modal.dataset.configurado =
                "true";

        }

    }


    /*
       Estado de autenticación.
    */

    onAuthStateChanged(
        auth,
        (usuario) => {

            if (usuario) {

                console.log(
                    "Sesión activa en Biblioteca:",
                    usuario.email
                );

            }
            else {

                console.log(
                    "No existe sesión activa."
                );

            }

        }
    );

}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

async function cerrarSesionBiblioteca() {

    try {

        await signOut(
            auth
        );


        console.log(
            "Sesión cerrada correctamente."
        );

    }

    catch (error) {

        console.error(
            "No se pudo cerrar la sesión:",
            error
        );

    }

}


/* =========================================================
   CARRITO
========================================================= */

function agregarCarrito(
    nombre,
    precio
) {

    carrito.push({

        nombre:
            String(
                nombre || ""
            ),

        precio:
            Number(
                precio
            ) || 0

    });


    actualizarCarrito();


    abrirCarrito();

}


/* =========================================================
   ACTUALIZAR CARRITO
========================================================= */

function actualizarCarrito() {

    const lista =
        document.getElementById(
            "listaCarrito"
        );


    const total =
        document.getElementById(
            "total"
        );


    const contador =
        document.getElementById(
            "contadorCarrito"
        );


    /*
       Si estos elementos no existen
       todavía, simplemente guardamos.
    */

    if (
        !lista ||
        !total ||
        !contador
    ) {

        guardarCarrito();

        return;

    }


    lista.innerHTML =
        "";


    let suma =
        0;


    /*
       Carrito vacío
    */

    if (
        carrito.length === 0
    ) {

        lista.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

    }

    else {

        carrito.forEach(
            (
                producto,
                indice
            ) => {

                const precio =
                    Number(
                        producto.precio
                    ) || 0;


                suma +=
                    precio;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-carrito";


                const informacion =
                    document.createElement(
                        "div"
                    );


                informacion.className =
                    "item-carrito-info";


                const nombre =
                    document.createElement(
                        "span"
                    );


                nombre.textContent =
                    producto.nombre;


                const precioProducto =
                    document.createElement(
                        "strong"
                    );


                precioProducto.textContent =
                    precio === 0
                        ? "Gratis"
                        : `S/ ${precio.toFixed(2)}`;


                const botonEliminar =
                    document.createElement(
                        "button"
                    );


                botonEliminar.type =
                    "button";


                botonEliminar.className =
                    "btn-eliminar";


                botonEliminar.setAttribute(
                    "aria-label",
                    `Eliminar ${producto.nombre}`
                );


                botonEliminar.textContent =
                    "🗑";


                botonEliminar.addEventListener(
                    "click",
                    () => {

                        eliminarProducto(
                            indice
                        );

                    }
                );


                informacion.appendChild(
                    nombre
                );


                informacion.appendChild(
                    precioProducto
                );


                item.appendChild(
                    informacion
                );


                item.appendChild(
                    botonEliminar
                );


                lista.appendChild(
                    item
                );

            }
        );

    }


    total.textContent =
        suma.toFixed(2);


    contador.textContent =
        carrito.length;


    guardarCarrito();

}


/* =========================================================
   GUARDAR CARRITO
========================================================= */

function guardarCarrito() {

    try {

        localStorage.setItem(
            "carritoSoubac",
            JSON.stringify(
                carrito
            )
        );

    }

    catch (error) {

        console.error(
            "No se pudo guardar el carrito:",
            error
        );

    }

}


/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

function eliminarProducto(
    indice
) {

    if (
        indice < 0 ||
        indice >= carrito.length
    ) {

        return;

    }


    carrito.splice(
        indice,
        1
    );


    actualizarCarrito();

}


/* =========================================================
   VACIAR CARRITO
========================================================= */

function vaciarCarrito() {

    if (
        carrito.length === 0
    ) {

        return;

    }


    const confirmar =
        window.confirm(
            "¿Deseas vaciar todo el carrito?"
        );


    if (!confirmar) {

        return;

    }


    carrito =
        [];


    actualizarCarrito();

}


/* =========================================================
   ABRIR CARRITO
========================================================= */

function abrirCarrito() {

    const panel =
        document.getElementById(
            "panelCarrito"
        );


    const fondo =
        document.getElementById(
            "fondoCarrito"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );


        panel.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (fondo) {

        fondo.classList.add(
            "activo"
        );


        fondo.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CERRAR CARRITO
========================================================= */

function cerrarCarrito() {

    const panel =
        document.getElementById(
            "panelCarrito"
        );


    const fondo =
        document.getElementById(
            "fondoCarrito"
        );


    if (panel) {

        panel.classList.remove(
            "activo"
        );


        panel.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (fondo) {

        fondo.classList.remove(
            "activo"
        );


        fondo.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    restaurarScroll();

}


/* =========================================================
   CONTROLAR BOTÓN CARRITO
========================================================= */

function controlarBotonCarrito(
    seccionActual = "inicio"
) {

    const botonCarrito =
        document.querySelector(
            ".btn-carrito"
        );


    if (!botonCarrito) {

        return;

    }


    botonCarrito.style.display =
        seccionActual === "tienda"
            ? "flex"
            : "none";

}


/* =========================================================
   COMPRAR POR WHATSAPP
========================================================= */

function comprarWhatsApp() {

    if (
        carrito.length === 0
    ) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    let mensaje =
        "Hola, deseo realizar el siguiente pedido:\n\n";


    let suma =
        0;


    carrito.forEach(
        (producto) => {

            const precio =
                Number(
                    producto.precio
                ) || 0;


            if (
                precio === 0
            ) {

                mensaje +=
                    `• ${producto.nombre}: Gratis\n`;

            }
            else {

                mensaje +=
                    `• ${producto.nombre}: S/ ${precio.toFixed(2)}\n`;

            }


            suma +=
                precio;

        }
    );


    mensaje +=
        `\nTotal: S/ ${suma.toFixed(2)}`;


    const telefono =
        "51973265025";


    const enlace =
        `https://wa.me/${telefono}?text=${encodeURIComponent(
            mensaje
        )}`;


    window.open(
        enlace,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   VISOR DE PRODUCTOS
========================================================= */

function abrirProducto(
    src
) {

    const visor =
        document.getElementById(
            "visorProducto"
        );


    const imagen =
        document.getElementById(
            "imagenProductoGrande"
        );


    if (
        !visor ||
        !imagen ||
        !src
    ) {

        return;

    }


    imagen.src =
        src;


    visor.classList.add(
        "activo"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CERRAR VISOR
========================================================= */

function cerrarProducto() {

    const visor =
        document.getElementById(
            "visorProducto"
        );


    const imagen =
        document.getElementById(
            "imagenProductoGrande"
        );


    if (!visor) {

        return;

    }


    visor.classList.remove(
        "activo"
    );


    if (imagen) {

        imagen.src =
            "";

    }


    restaurarScroll();

}


/* =========================================================
   CONFIGURAR VISOR
========================================================= */

function configurarVisorProducto() {

    const visor =
        document.getElementById(
            "visorProducto"
        );


    if (!visor) {

        return;

    }


    if (
        visor.dataset.configurado ===
        "true"
    ) {

        return;

    }


    visor.addEventListener(
        "click",
        (evento) => {

            if (
                evento.target ===
                visor
            ) {

                cerrarProducto();

            }

        }
    );


    visor.dataset.configurado =
        "true";

}


/* =========================================================
   TECLA ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key !==
            "Escape"
        ) {

            return;

        }


        cerrarCarrito();


        cerrarLoginBiblioteca();


        cerrarProducto();


        const menu =
            document.getElementById(
                "opcionesMenu"
            );


        const boton =
            document.querySelector(
                ".boton-menu"
            );


        if (menu) {

            menu.classList.remove(
                "mostrar"
            );

        }


        if (boton) {

            boton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* =========================================================
   CERRAR MENÚ AL HACER CLIC FUERA
========================================================= */

document.addEventListener(
    "click",
    (evento) => {

        const menu =
            document.getElementById(
                "opcionesMenu"
            );


        const boton =
            document.querySelector(
                ".boton-menu"
            );


        if (
            !menu ||
            !boton
        ) {

            return;

        }


        const clicDentroDelMenu =
            menu.contains(
                evento.target
            );


        const clicEnElBoton =
            boton.contains(
                evento.target
            );


        if (
            !clicDentroDelMenu &&
            !clicEnElBoton
        ) {

            menu.classList.remove(
                "mostrar"
            );


            boton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* =========================================================
   EXPONER FUNCIONES AL HTML
========================================================= */

window.abrirMenu =
    abrirMenu;


window.mostrar =
    mostrar;


window.abrirLibro =
    abrirLibro;


window.abrirLoginBiblioteca =
    abrirLoginBiblioteca;


window.cerrarLoginBiblioteca =
    cerrarLoginBiblioteca;


window.cerrarSesionBiblioteca =
    cerrarSesionBiblioteca;


window.iniciarSesionBiblioteca =
    iniciarSesionBiblioteca;


window.agregarCarrito =
    agregarCarrito;


window.abrirCarrito =
    abrirCarrito;


window.cerrarCarrito =
    cerrarCarrito;


window.vaciarCarrito =
    vaciarCarrito;


window.comprarWhatsApp =
    comprarWhatsApp;


window.abrirProducto =
    abrirProducto;


window.cerrarProducto =
    cerrarProducto;


/* =========================================================
   MENSAJE DE CONTROL
========================================================= */

console.log(
    "♟️ SOUBAC AJEDREZ: JavaScript cargado correctamente."
);

console.log(
    "♟️ Firebase Authentication modular activo."
);
