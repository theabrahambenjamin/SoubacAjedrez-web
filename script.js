function mostrarSeccion(id) {
  let secciones = document.querySelectorAll(".seccion");

  secciones.forEach((sec) => {
    sec.classList.remove("activa");
  });

  document.getElementById(id).classList.add("activa");
}
let carrito=[];


function agregarCarrito(nombre,precio){


carrito.push({

nombre:nombre,

precio:precio

});


mostrarCarrito();


}



function mostrarCarrito(){


let lista=document.getElementById("listaCarrito");

let total=0;


lista.innerHTML="";


carrito.forEach(producto=>{


lista.innerHTML += 
`
<p>
${producto.nombre} - S/ ${producto.precio}
</p>
`;


total += producto.precio;


});


document.getElementById("total").innerHTML=total;


}



function comprarWhatsApp(){


let mensaje="Hola, quiero comprar:%0A";


carrito.forEach(producto=>{


mensaje += 
"- "+producto.nombre+
" S/"+producto.precio+
"%0A";


});


mensaje += 
"Total: S/"+document.getElementById("total").innerHTML;



window.open(

"https://api.whatsapp.com/send?phone=51973265025&text="+mensaje,

"_blank"

);



  
}
function abrirProducto(src){

    document
    .getElementById("imagenProductoGrande")
    .src = src;

    document
    .getElementById("visorProducto")
    .style.display = "flex";

    document.body.style.overflow = "hidden";

}

function cerrarProducto(){

    document
    .getElementById("visorProducto")
    .style.display = "none";

    document.body.style.overflow = "auto";

}
