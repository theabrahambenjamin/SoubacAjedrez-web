/* ==================================================
   SOUBAC AJEDREZ — JAVASCRIPT PRINCIPAL
   Firebase Authentication + Biblioteca protegida
================================================== */


/* ==================================================
   FIREBASE
================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCOmb0ZFxGPCz9h7ZYwBhdI1TpZrzZT4jN8",
    authDomain: "soubac-ajedrez.firebaseapp.com",
    projectId: "soubac-ajedrez",
    storageBucket: "soubac-ajedrez.firebasestorage.app",
    messagingSenderId: "795119435641",
    appId: "1:795119435641:web:5f2174e3e80a19e97079a8",
    measurementId: "G-C6SKT2392Q"
};


/* ==================================================
   INICIALIZAR FIREBASE
================================================== */

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();


/* ==================================================
   PERSISTENCIA DE SESIÓN
================================================== */

auth.setPersistence(
    firebase.auth.Auth.Persistence.LOCAL
).catch((error) => {

    console.error(
        "Error al configurar la sesión:",
        error
    );

});


/* ==================================================
   BIBLIOTECA
================================================== */

let libroPendiente = null;


/* ==================================================
   INICIO
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ==============================
           PANTALLA DE CARGA
        ============================== */

        const pantallaCarga =
            document.getElementById(
                "pantalla-carga"
            );

        if (pantallaCarga) {

            pantallaCarga.style.opacity = "0";
            pantallaCarga.style.pointerEvents = "none";

            setTimeout(() => {

                if (
                    pantallaCarga &&
                    pantallaCarga.parentNode
                ) {
                    pantallaCarga.remove();
                }

            }, 300);
        }


        /* ==============================
           CARRITO
        ============================== */

        actualizarCarrito();


        /* ==============================
           BOTÓN CARRITO
        ============================== */

        const seccionActiva =
            document.querySelector(
                ".seccion.activa"
            );

        controlarBotonCarrito(
            seccionActiva
                ? seccionActiva.id
                : "inicio"
        );


        /* ==============================
           BIBLIOTECA
        ============================== */

        configurarBiblioteca();


        /* ==============================
           VISOR
        ============================== */

        configurarVisorProducto();

    }
);


/* ==================================================
   MENÚ
================================================== */

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
            String(abierto)
        );

    }
}


/* ==================================================
   MOSTRAR SECCIONES
================================================== */

function mostrar(idSeccion) {

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


/* ==================================================
   BIBLIOTECA
================================================== */

function abrirLibro(evento, url) {

    if (evento) {
        evento.preventDefault();
    }

    if (!url) {
        return;
    }

    libroPendiente = url;


    if (auth.currentUser) {

        abrirLibroEnNuevaPestana(
            url
        );

        libroPendiente = null;

        return;
    }


    abrirLoginBiblioteca();

}


/* ==================================================
   ABRIR LIBRO
================================================== */

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

    return nuevaVentana;
}


/* ==================================================
   ABRIR LOGIN
================================================== */

function abrirLoginBiblioteca() {

    const modal =
        document.getElementById(
            "modalLoginBiblioteca"
        );

    const email =
        document.getElementById(
            "emailBiblioteca"
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
            "No existe el modal de Biblioteca."
        );

        return;
    }

    if (error) {
        error.textContent = "";
    }

    if (email) {
        email.value = "";
    }

    if (password) {
        password.value = "";
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


    setTimeout(() => {

        if (email) {
            email.focus();
        }

    }, 150);
}


/* ==================================================
   CERRAR LOGIN
================================================== */

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
        !carritoAbierto &&
        !visorAbierto
    ) {

        document.body.style.overflow =
            "";

    }

}


/* ==================================================
   INICIAR SESIÓN
================================================== */

async function iniciarSesionBiblioteca(evento) {

    evento.preventDefault();

    const emailInput =
        document.getElementById(
            "emailBiblioteca"
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

    let ventanaLibro = null;


    const email =
        emailInput
            ? emailInput.value.trim().toLowerCase()
            : "";

    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (error) {
        error.textContent = "";
    }


    if (!email || !password) {

        if (error) {

            error.textContent =
                "Completa tu correo de acceso y contraseña.";

        }

        return;
    }


    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "Verificando...";

    }


    try {

        if (libroPendiente) {

            ventanaLibro =
                window.open(
                    "about:blank",
                    "_blank"
                );

        }


        console.log(
            "Intentando iniciar sesión con:",
            email
        );


        await auth.signInWithEmailAndPassword(
            email,
            password
        );


        console.log(
            "Inicio de sesión correcto."
        );


        cerrarLoginBiblioteca();


        if (libroPendiente) {

            const url =
                libroPendiente;

            libroPendiente = null;


            if (
                ventanaLibro &&
                !ventanaLibro.closed
            ) {

                abrirLibroEnNuevaPestana(
                    url,
                    ventanaLibro
                );

            }

            else {

                abrirLibroEnNuevaPestana(
                    url
                );

            }

        }

    }

    catch (errorFirebase) {

        console.error(
            "ERROR COMPLETO DE FIREBASE:",
            errorFirebase
        );

        console.error(
            "Código Firebase:",
            errorFirebase.code
        );

        console.error(
            "Mensaje Firebase:",
            errorFirebase.message
        );


        if (
            ventanaLibro &&
            !ventanaLibro.closed
        ) {

            ventanaLibro.close();

            ventanaLibro = null;

        }


        if (error) {

            switch (
                errorFirebase.code
            ) {

                case "auth/invalid-credential":

                case "auth/invalid-login-credentials":

                case "auth/user-not-found":

                case "auth/wrong-password":

                    error.textContent =
                        "Correo o contraseña incorrectos.";

                    break;


                case "auth/invalid-email":

                    error.textContent =
                        "El correo de acceso no tiene un formato válido.";

                    break;


                case "auth/operation-not-allowed":

                    error.textContent =
                        "El acceso con correo y contraseña no está habilitado en Firebase.";

                    break;


                case "auth/unauthorized-domain":

                    error.textContent =
                        "Este dominio no está autorizado en Firebase Authentication.";

                    break;


                case "auth/api-key-not-valid":

                    error.textContent =
                        "La configuración de Firebase no es válida. Revisa la API Key.";

                    break;


                case "auth/network-request-failed":

                    error.textContent =
                        "No se pudo conectar con Firebase. Revisa tu conexión a Internet.";

                    break;


                case "auth/too-many-requests":

                    error.textContent =
                        "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.";

                    break;


                case "auth/user-disabled":

                    error.textContent =
                        "Esta cuenta está deshabilitada. Comunícate con Soubac.";

                    break;


                default:

                    error.textContent =
                        "Error de Firebase: " +
                        (
                            errorFirebase.code ||
                            "código desconocido"
                        );

                    break;

            }

        }

    }

    finally {

        if (boton) {

            boton.disabled = false;

            boton.textContent =
                "Iniciar sesión";

        }

    }

}


/* ==================================================
   CONFIGURAR BIBLIOTECA
================================================== */

function configurarBiblioteca() {

    const formulario =
        document.getElementById(
            "formLoginBiblioteca"
        );


    const modal =
        document.getElementById(
            "modalLoginBiblioteca"
        );


    if (
        formulario &&
        !formulario.dataset.firebaseConfigured
    ) {

        formulario.addEventListener(
            "submit",
            iniciarSesionBiblioteca
        );


        formulario.dataset.firebaseConfigured =
            "true";

    }


    if (modal) {

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

    }


    auth.onAuthStateChanged(
        (usuario) => {

            if (usuario) {

                console.log(
                    "Sesión de Biblioteca activa:",
                    usuario.email
                );

            }

            else {

                console.log(
                    "No hay sesión activa en Biblioteca."
                );

            }

        }
    );

}


/* ==================================================
   CERRAR SESIÓN
================================================== */

async function cerrarSesionBiblioteca() {

    try {

        await auth.signOut();

        console.log(
            "Sesión cerrada."
        );

    }

    catch (error) {

        console.error(
            "No se pudo cerrar la sesión:",
            error
        );

    }

}


/* ==================================================
   CARRITO
================================================== */

let carrito = [];


try {

    const carritoGuardado =
        localStorage.getItem(
            "carritoSoubac"
        );


    carrito =
        carritoGuardado
            ? JSON.parse(
                carritoGuardado
            )
            : [];


    if (
        !Array.isArray(carrito)
    ) {

        carrito = [];

    }

}

catch (error) {

    carrito = [];

    console.error(
        "No se pudo recuperar el carrito:",
        error
    );

}


/* ==================================================
   AGREGAR AL CARRITO
================================================== */

function agregarCarrito(
    nombre,
    precio
) {

    carrito.push({

        nombre:
            nombre,

        precio:
            Number(precio)

    });


    actualizarCarrito();

    abrirCarrito();

}


/* ==================================================
   ACTUALIZAR CARRITO
================================================== */

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


    if (
        !lista ||
        !total ||
        !contador
    ) {

        return;

    }


    lista.innerHTML = "";


    let suma = 0;


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


                suma += precio;


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


/* ==================================================
   ELIMINAR PRODUCTO
================================================== */

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


/* ==================================================
   VACIAR CARRITO
================================================== */

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


    carrito = [];

    actualizarCarrito();

}


/* ==================================================
   ABRIR CARRITO
================================================== */

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


/* ==================================================
   CERRAR CARRITO
================================================== */

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


    const modalAbierto =
        document
            .getElementById(
                "modalLoginBiblioteca"
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
        !modalAbierto &&
        !visorAbierto
    ) {

        document.body.style.overflow =
            "";

    }

}


/* ==================================================
   CONTROLAR BOTÓN CARRITO
================================================== */

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


/* ==================================================
   COMPRAR POR WHATSAPP
================================================== */

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


    let suma = 0;


    carrito.forEach(
        (producto) => {

            const precio =
                Number(
                    producto.precio
                ) || 0;


            if (precio === 0) {

                mensaje +=
                    `• ${producto.nombre}: Gratis\n`;

            }

            else {

                mensaje +=
                    `• ${producto.nombre}: S/ ${precio.toFixed(2)}\n`;

            }


            suma += precio;

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


/* ==================================================
   VISOR DE PRODUCTOS
================================================== */

function abrirProducto(src) {

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
        !imagen
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


/* ==================================================
   CERRAR VISOR
================================================== */

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

        imagen.src = "";

    }


    const modalAbierto =
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


    if (
        !modalAbierto &&
        !carritoAbierto
    ) {

        document.body.style.overflow =
            "";

    }

}


/* ==================================================
   CONFIGURAR VISOR
================================================== */

function configurarVisorProducto() {

    const visor =
        document.getElementById(
            "visorProducto"
        );


    if (!visor) {

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

}


/* ==================================================
   TECLA ESCAPE
================================================== */

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


/* ==================================================
   CERRAR MENÚ AL HACER CLIC FUERA
================================================== */

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


/* ==================================================
   EXPONER FUNCIONES AL HTML
================================================== */

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
/* ==================================================
   VISOR DE PRODUCTOS
================================================== */

function abrirProducto(src) {

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
        !imagen
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


/* ==================================================
   CERRAR VISOR
================================================== */

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

        imagen.src = "";

    }


    const modalAbierto =
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


    if (
        !modalAbierto &&
        !carritoAbierto
    ) {

        document.body.style.overflow =
            "";

    }

}


/* ==================================================
   CONFIGURAR VISOR
================================================== */

function configurarVisorProducto() {

    const visor =
        document.getElementById(
            "visorProducto"
        );


    if (!visor) {

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

}


/* ==================================================
   TECLA ESCAPE
================================================== */

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


/* ==================================================
   CERRAR MENÚ AL HACER CLIC FUERA
================================================== */

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


/* ==================================================
   EXPONER FUNCIONES AL HTML
================================================== */

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
