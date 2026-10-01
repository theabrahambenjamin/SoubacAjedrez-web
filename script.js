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

const DOMINIO_USUARIOS =
    "@usuarios.soubac.com";


/*
   El alumno escribe únicamente su usuario.
   Firebase utiliza internamente un identificador
   de correo técnico que el alumno nunca ve.

   Ejemplo:
   AbrahamBobadilla
   -> abrahambobadilla@usuarios.soubac.com
*/

function usuarioAFirebaseEmail(usuario) {

    const valor = String(usuario || "")
        .trim()
        .toLowerCase();

    // El alumno normalmente escribe solo su usuario.
    // Si por error pega el correo interno, también lo aceptamos.
    if (valor.includes("@")) {
        return valor;
    }

    return (
        valor.replace(/\s+/g, "") +
        DOMINIO_USUARIOS
    );

}


/* ==================================================
   INICIO
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Pantalla de carga */

        const pantallaCarga =
            document.getElementById(
                "pantalla-carga"
            );


        if (pantallaCarga) {

            /* Ocultar la pantalla de carga inmediatamente
               al estar listo el DOM. No bloquear la web. */
            pantallaCarga.style.opacity = "0";
            pantallaCarga.style.pointerEvents = "none";

            setTimeout(() => {
                if (pantallaCarga && pantallaCarga.parentNode) {
                    pantallaCarga.remove();
                }
            }, 300);

        }


        /* Carrito */

        actualizarCarrito();


        /* Botón carrito */

        const seccionActiva =
            document.querySelector(
                ".seccion.activa"
            );


        controlarBotonCarrito(
            seccionActiva
                ? seccionActiva.id
                : "inicio"
        );


        /* Biblioteca */

        configurarBiblioteca();


        /* Visor */

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
   IMPORTANTE:
   EL LOGIN SOLO APARECE AL HACER CLIC
   EN UNA TARJETA.
================================================== */

function abrirLibro(evento, url) {

    if (evento) {

        evento.preventDefault();

    }


    if (!url) {

        return;

    }


    /*
       Guardamos el libro seleccionado.
    */

    libroPendiente = url;


    /*
       Si ya existe una sesión,
       abrimos directamente el libro.
    */

    if (auth.currentUser) {

        abrirLibroEnNuevaPestana(
            url
        );


        libroPendiente = null;

        return;

    }


    /*
       Si NO existe sesión,
       recién aquí aparece el modal.
    */

    abrirLoginBiblioteca();

}


/* ==================================================
   ABRIR LIBRO
================================================== */

function abrirLibroEnNuevaPestana(url, ventana = null) {

    if (!url) {

        return null;

    }

    // Si ya tenemos una pestaña abierta por el gesto del usuario,
    // reutilizamos esa pestaña para evitar bloqueadores de ventanas.
    if (ventana && !ventana.closed) {

        ventana.location.href = url;
        return ventana;

    }

    const nuevaVentana = window.open(
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
            "No existe el modal de Biblioteca."
        );

        return;

    }


    if (error) {

        error.textContent = "";

    }


    if (password) {

        password.value = "";

    }


    /*
       MUY IMPORTANTE:

       El modal inicia oculto mediante CSS.

       Solo aquí agregamos .activo.
    */

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

        if (usuario) {

            usuario.focus();

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


    /*
       Si no hay otro elemento modal abierto,
       recuperamos el scroll.
    */

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

async function iniciarSesionBiblioteca(
    evento
) {

    evento.preventDefault();


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


    // Se abre durante el gesto del usuario para evitar bloqueadores de popups.
    let ventanaLibro = null;


    const usuario =
        usuarioInput
            ? usuarioInput.value.trim()
            : "";

    const usuarioNormalizado =
        usuario.toLowerCase().replace(/\s+/g, "");


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (error) {

        error.textContent = "";

    }


    if (!usuarioNormalizado || !password) {

        if (error) {

            error.textContent =
                "Completa tu usuario y contraseña.";

        }

        return;

    }


    if (boton) {

        boton.disabled = true;

        boton.textContent =
            "Verificando...";

    }


    try {

        /*
           Abrimos una pestaña vacía mientras todavía existe
           el gesto del usuario. Así el navegador no bloqueará
           la apertura del libro después de autenticar.
        */
        if (libroPendiente) {
            ventanaLibro = window.open(
                "about:blank",
                "_blank"
            );
        }

        /*
           Convertimos el usuario al correo
           interno utilizado por Firebase.
        */

        const emailFirebase =
            usuarioAFirebaseEmail(
                usuarioNormalizado
            );


        /*
           AUTENTICACIÓN
        */

        await auth.signInWithEmailAndPassword(
            emailFirebase,
            password
        );


        /*
           Cerramos el modal.
        */

        cerrarLoginBiblioteca();


        /*
           Abrimos exactamente el libro
           que el alumno seleccionó.
        */

        if (libroPendiente) {

            const url =
                libroPendiente;


            libroPendiente = null;


            if (ventanaLibro && !ventanaLibro.closed) {
                abrirLibroEnNuevaPestana(
                    url,
                    ventanaLibro
                );
            } else {
                abrirLibroEnNuevaPestana(
                    url
                );
            }

        }

    }

    catch (errorFirebase) {

        console.error(
            "Error de autenticación:",
            errorFirebase.code,
            errorFirebase.message,
            errorFirebase
        );

        if (ventanaLibro && !ventanaLibro.closed) {
            ventanaLibro.close();
            ventanaLibro = null;
        }


        if (error) {

            switch (errorFirebase.code) {

                case "auth/invalid-credential":
                case "auth/invalid-login-credentials":
                case "auth/user-not-found":
                case "auth/wrong-password":
                    error.textContent =
                        "Usuario o contraseña incorrectos.";
                    break;

                case "auth/invalid-email":
                    error.textContent =
                        "El usuario no tiene un formato válido.";
                    break;

                case "auth/operation-not-allowed":
                    error.textContent =
                        "El acceso con correo y contraseña no está habilitado en Firebase.";
                    break;

                case "auth/unauthorized-domain":
                    error.textContent =
                        "Este dominio no está autorizado en Firebase Authentication.";
                    break;

                case "auth/network-request-failed":
                    error.textContent =
                        "No se pudo conectar con Firebase. Revisa tu conexión.";
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
                        "No se pudo iniciar sesión. Revisa la consola del navegador para ver el código de Firebase.";
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


    /*
       Formulario de login.
    */

    if (formulario && !formulario.dataset.firebaseConfigured) {

        formulario.addEventListener(
            "submit",
            iniciarSesionBiblioteca
        );

        formulario.dataset.firebaseConfigured = "true";

    }


    /*
       Clic fuera de la tarjeta
       para cerrar el modal.
    */

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


    /*
       Firebase mantiene la sesión.
    */

    auth.onAuthStateChanged(
        (usuario) => {

            if (usuario) {

                console.log(
                    "Sesión de Biblioteca activa."
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
