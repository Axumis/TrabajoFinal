//Definimos item del producto
let productos=[]
//Definimos carrito de compra vacio
let carrito =[]

//Asignamos variables para realizar el DOM en Js
const contenedor = document.getElementById('ropas')
const select = document.getElementById("ropasSelect")
const precio = document.getElementById("precio")
const cantidad = document.getElementById("cantidad")
const subtotal = document.getElementById("subtotal")
const boton = document.getElementById("boton")

//Comprobamos si el carro esta vacio al guardar en localStorage
let carritoViejo = localStorage.getItem('savedcarrito')

if (carritoViejo !== null) {
    carrito = JSON.parse(carritoViejo)
    mostrarCarrito(carrito)
}

//Asigna un evento que actualiza las entradas del formulario
select.addEventListener('change',actualizarPrecio)
cantidad.addEventListener('input', actualizarCantidad)

//Otro evento que escucha al boton cuando se presiona agregar
boton.addEventListener('click', (e) => {e.preventDefault(); agregarItem(productos.find(pr => pr.id == parseInt(select.value)))});

//Se muestra los productos desde la pagina y se guarda los datos en un array
fetch('./JS/productos.json')
.then(response =>response.json())
.then(data=>{

    //Almaceno los datos del JSON en un array llamado productos
    productos=data

    data.forEach(producto =>{
    
    //Un contenedor para las ropas
    const div = document.createElement('div')

    //Se crea un elemento option para seleccionar las ropas
    const selectOption = document.createElement("option");
    selectOption.setAttribute('value', producto.id);
    selectOption.innerText = producto.nombre;

    //Mostramos los diferentes tipos de ropas
    div.innerHTML=
        `<div class='card m-2'>
            <div class='card-title'>
                <h2 class="text-center">${producto.nombre}</h2>
            </div>
            <div class='card-body d-flex justify-content-center'>
                <img class='imagen' src='./Imagenes/${producto.img}'>
            </div>
            <div class='card-footer d-flex justify-content-center flex-column'>
                <div class='precio'>
                    <span>$ARS ${producto.precio}<span>
                </div>
                <div>
                <button id='boton' class='add'>Agregar indumentaria</button>
                </div>
            </div>
        </div>`

        //Un evento que escucha al hacer click al boton 'Agregar indumentaria'
        div.querySelector('button.add').addEventListener('click', () => {seleccionarRopa(producto.id)})

        //Agregamos al HTML
        contenedor.append(div)
        select.append(selectOption)
})
});

//-------------------------------------------FUNCIONES-----------------------------------------------------

//Al presionar el boton 'Agregar indumentaria' redirije la pagina hacia el formulario 
function seleccionarRopa(productoId){
    let form = document.getElementById('form')
    form.scrollIntoView({behavior: 'smooth'})
    const option= document.getElementById("ropasSelect")
    option.value=productoId
    actualizarPrecio()
}

//Funcion que automaticamente actualiza las entradas del formulario
function actualizarPrecio(){
    const producto = productos.find(pr => pr.id == parseInt(select.value))
    cantidad.value=producto.cantidad
    precio.value=producto.precio
    subtotal.value=parseInt(cantidad.value)*parseInt(precio.value)
}

//Funcion que actualiza el subtotal del precio
function actualizarCantidad(evt){
    const producto = productos.find(pr=> pr.id == parseInt(select.value))
    producto.cantidad = parseInt(evt.target.value)
    subtotal.value = producto.cantidad * parseInt(producto.precio)
}

//Funcion agregar producto por el usuario
function agregarItem(producto) {
    let index = carrito.findIndex((p) => p.id == producto.id)
    if (index >= 0) carrito[index].cantidad++
    else carrito.push(producto)
    guardar(carrito)
    mostrarCarrito(carrito)
}

//Funcion quitar el producto por el usuario
function quitarItem(producto) {
    let index = carrito.findIndex((p) => p.id == producto.id);
    if (index >= 0) carrito.splice(index, 1);
    guardar(carrito);
    mostrarCarrito(carrito);
}

//Guarda en memoria localStorage
function guardar(carroNuevo) {
    localStorage.setItem('savedcarrito', JSON.stringify(carroNuevo));
}

//Mostrar el carrito del usuario desde la pagina
function mostrarCarrito(carro) {
    const elemento = document.getElementById('carrito')
    elemento.innerHTML = ''
        let total=0
    carro.forEach((producto) => {
        total +=producto.precio*producto.cantidad
        const p = document.createElement('p');
        p.innerHTML = `
        ${producto.id} | ${producto.nombre} | Cantidad: ${
            producto.cantidad
        } | Precio: $${producto.precio} | Subtotal: $${
            producto.precio * producto.cantidad 
        } | Total: $${total} | <button id="quitar-${producto.id}">Quitar</button>
      `
        p.querySelector(`#quitar-${producto.id}`).addEventListener(
            'click',
            () => quitarItem(producto)
        )
        elemento.append(p)
    })
}