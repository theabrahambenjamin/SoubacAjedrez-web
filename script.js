function mostrarSeccion(id) {
  let secciones = document.querySelectorAll(".seccion");

  secciones.forEach((sec) => {
    sec.classList.remove("activa");
  });

  document.getElementById(id).classList.add("activa");
}
