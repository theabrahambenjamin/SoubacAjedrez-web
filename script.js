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

const persistenciaFirebase =
    auth.setPersistence(
        firebase.auth.Auth.Persistence.LOCAL
    ).then(() => {

        console.log(
            "Sesión configurada para mantenerse guardada."
        );

    }).catch((error) => {

        console.error(
            "Error al configurar la sesión:",
            error
        );

    });


/* ==================================================
   ESPERAR A QUE FIREBASE RECUPERE LA SESIÓN
================================================== */

const firebaseAuthInicializado =
    new Promise((resolve) => {

        const cancelarEscucha =
            auth.onAuthStateChanged(
                (usuario) => {

                    cancelarEscucha();

                    console.log(
                        "Estado inicial de Firebase:",
                        usuario
                            ? usuario.email
                            : "sin sesión"
                    );

                    resolve(usuario);

                }
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

async function abrirLibro(evento, url) {

    if (evento) {
        evento.preventDefault();
    }

    if (!url) {
        return;
    }


    /* ==============================
       GUARDAR LIBRO PENDIENTE
    ============================== */

    libroPendiente = url;


    /* ==============================
       ESPERAR A FIREBASE
    ============================== */

    await persistenciaFirebase;

    await firebaseAuthInicializado;


    /* ==============================
       COMPROBAR SESIÓN
    ============================== */

    if (auth.currentUser) {

        abrirLibroEnNuevaPestana(
            url
        );

        libroPendiente = null;

        return;
    }


    /* ==============================
       NO HAY SESIÓN
    ============================== */

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


    const email =
        emailInput
            ? emailInput.value.trim().toLowerCase()
            : "";

    const password =
        passwordInput
            ? passwordInput.value
            : "";


    /* ==============================
       LIMPIAR ERROR
    ============================== */

    if (error) {
        error.textContent = "";
    }


    /* ==============================
       VALIDAR CAMPOS
    ============================== */

    if (!email || !password) {

        if (error) {

            error.textContent =
                "Completa tu correo de acceso y contraseña.";

        }

        return;
    }


    /* ==============================
       DESACTIVAR BOTÓN
    ============================== */

    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "Verificando...";

    }


    try {

        console.log(
            "Intentando iniciar sesión con:",
            email
        );


        /* ==============================
           ASEGURAR PERSISTENCIA LOCAL
        ============================== */

        await persistenciaFirebase;

        /* ==============================
           AUTENTICAR CON FIREBASE
        ============================== */

        await auth.signInWithEmailAndPassword(
            email,
            password
        );


        console.log(
            "Inicio de sesión correcto."
        );


        /* ==============================
           GUARDAR URL DEL LIBRO
        ============================== */

        const url =
            libroPendiente;


        libroPendiente =
            null;


        /* ==============================
           CERRAR LOGIN
        ============================== */

        cerrarLoginBiblioteca();


        /* ==============================
           ABRIR LIBRO EN NUEVA PESTAÑA
        ============================== */

        if (url) {

            abrirLibroEnNuevaPestana(
                url
            );

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
                        "Firebase está rechazando la API Key. Debemos actualizar la configuración de Firebase.";

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
