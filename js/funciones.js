//FUNCIÓN QUE MUESTRA LOS RESULTADOS DE LA FUNCIÓN 
function buscadorHTML(lista) {
    resultados.innerHTML = "";
    for (const buscador of lista) {

        let titulosProductos = document.createElement('div');
        titulosProductos.classList.add('search__container');
        titulosProductos.classList.add('container');

        titulosProductos.innerHTML = `
        <a href="#" class="searchbar__result">
        <img class="searchbar__img" src="${buscador.img}" alt="Imagen del producto seleccionado">
        <div class="searchbar__texts">
          <p class="searchbar__title">${buscador.nombre}</p>
          <p class="searchbar__paragraph">${buscador.descripcion}</p>
          <p class="searchbar__paragraph">$${buscador.sumarIva(parseInt(0.21))}</p>
          </div>
      </a>
      `

        resultados.append(titulosProductos);
    }
}

buscadorProductos.oninput = (e) => {
    e.preventDefault();

    let hijos = buscadorProductos.children;
    //-------------------------------
    const filtrados = productos.filter(producto => producto.nombre.includes(buscadorProductos[0].value.toUpperCase()));
    console.log(filtrados);
    buscadorHTML(filtrados);

    //pasa del array a texto plano
    localStorage.setItem('Buscador', JSON.stringify(filtrados));

    if (e.target.value == "") {
        resultados.innerHTML = "";
    }
}

//--------------------------------------------------------------------------------------------- 

//PRODUCTOS !!!!!!
//FUNCIÓN QUE MUESTRAN LOS PRODUCTOS EN PANTALLA
function productosUI(productos) {
    productosRender.innerHTML = "";

    for (const producto of productos) {
        let divProducto = document.createElement('div');
        divProducto.classList.add('card__container');
        divProducto.classList.add('container');

        divProducto.innerHTML = `<article class="card__item">
    <div class="card__content">
    <figure class="card__picture">
        <img src="${producto.img}" class="card__img" alt="Imagen del producto" />
    </figure>

    <div class="card__texts">
        <h2 class="card__title">${producto.nombre}</h2>
            <p class="card__paragraph">
            ${producto.descripcion}
            </p>
            <p class="card__price"> $${producto.sumarIva(parseInt(0.21))} 
            </p>
            <button id="${producto.id}" class="card__btn">Añadir al Carrito</button>
    </div>
    </div>
    </article>`

        productosRender.append(divProducto);
    }
    seleccionarProducto();

}

//FUNCIÓN CUANDO SE HACE CLICK EN EL BOTON "AGREGAR AL CARRITO"

function seleccionarProducto() {
    let botones = document.getElementsByClassName('card__btn');

    for (const boton of botones) {
        boton.addEventListener('click', function () {

            let seleccion = carrito.find(producto => producto.id == this.id);

            if (seleccion) {
                seleccion.agregarCantidad();
            } else {
                seleccion = productos.find(producto => producto.id == this.id);
                carrito.push(seleccion);
            }
            localStorage.setItem('Carrito', JSON.stringify(carrito));
            carritoUI(carrito);
            Toastify({
                text: `Se ha agregado el producto ${seleccion.nombre}`,
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "#004526",
                    opacity: "25 %"
                },
            }).showToast();
        })
    }
}

//FUNCIÓN QUE MUESTRA EL PRIMER MODAL EN PANTALLA
function carritoUI(lista) {
    cantidadCarrito.innerHTML = lista.length;
    productosCarrito.innerHTML = "";

    for (const producto of lista) {
        let modalProducto = document.createElement('div');
        modalProducto.classList.add('modal__container');

        cambiarTitulo("Carrito de compras");

        modalProducto.innerHTML = `
        <img class="modal__img" src="${producto.img}" alt="Imagen del producto seleccionado">
        <div class="modal__texts">
        <h3 class="modal__title"> ${producto.nombre}</h3> 
        <p class="modal__paragraph">$${producto.precio} X ${producto.cantidad} <span class="modal__paragraph--bold"> $${producto.subTotal()}</span> </p>
        </div>
        <a href="#" class="modal__icon" id="${producto.id}">
        <img class="modal__icon--img" src="/img/bxs-trash.svg" alt="Icono de tacho de basura">
        </a>`

        productosCarrito.append(modalProducto);
    }
    document.querySelectorAll('.modal__icon').forEach(boton => boton.onclick = borrarProducto);
    totalCarrito();

}

//FUNCIÓN QUE HACE QUE DESAPAREZCA DEL CARRITO
function eliminarCarrito() {
    let posicion = carrito.findIndex(producto => producto.id == this.id);
    carrito.splice(posicion, 1);
    carritoUI(carrito);
    localStorage.setItem('Carrito', JSON.stringify(carrito));
}

//FUNCIÓN QUE BORRA EL PRODUCTO SELECCIONADO 
function borrarProducto() {
    let producto = carrito.find(p => p.id == this.id);

    if (producto.cantidad > 1) {
        producto.eliminarCantidad(1);
        carritoUI(carrito);
        totalCarrito();
        localStorage.setItem('Carrito', JSON.stringify(carrito));
    } else {
        eliminarCarrito();
    }
}


//FUNCION QUE MUESTRA EL SELECTOR DE FILTRADO
function filtroUI(productos) {
    filtro.innerHTML = "";

    const filtradoCategorias = productos.map(producto => producto.tag);
    const filtradoTalles = ['S', 'M', 'L', 'XL', 'XXL'];

    crearSelector(arraySinDuplicados(filtradoCategorias), "tag", "Categorias");
    crearSelector(arraySinDuplicados(filtradoTalles), "talle", "Talles");
}

//FUNCION QUE CREA EL SELECTOR 
function crearSelector(lista2, clave, titulo) {
    let nuevoSelector = document.createElement('select');
    nuevoSelector.classList.add('filter__container');
    nuevoSelector.classList.add('btn');
    nuevoSelector.setAttribute('name', 'indumentaria');

    nuevoSelector.innerHTML = `
    <option selected disabled class="filter__item">${titulo}</option>
   <option class="filter__item">${lista2.join('</option><option class="filter__item">')}</option>
  `

    nuevoSelector.addEventListener('change', function () {
        const filtradosHTML = productos.filter(producto => producto[clave].includes(this.value));
        productosUI(filtradosHTML);
    })
    filtro.append(nuevoSelector);
}

//FUNCION PARA QUE NO SE DUPLIQUEN LAS OPCIONES DEL SELECT

function arraySinDuplicados(lista2) {
    let unicos = [];
    lista2.forEach(producto => {
        if (!unicos.includes(producto)) {
            unicos.push(producto);
        }
    })
    return unicos;
}

//FUNCION DE PROMESAS 
function promesaCompra(saldo) {
    return new Promise(function (aceptado, rechazada) {
        if (saldo > 0) {
            aceptado('Compra aceptada');
        } else {
            rechazada('Compra rechazada');
        }
    })
}

//FUNCIÓN DEL PRECIO TOTAL DEL CARRITO
function totalCarrito() {
    let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
    totalCarritoInterfaz.innerHTML = `Total: <span class="modal__paragraph--bold">$${total}</span>`;
    return total;
}

function vaciarCarrito() {
    localStorage.clear();
    carrito.splice(0, carrito.length);
    carritoUI(carrito);
    productosCarrito.innerHTML = `<h6 class="text-center"><span class="modal__paragraph--bold">Tu carrito está vacío</span></h6>`
    totalCarritoInterfaz.innerHTML = `Total: <span class="modal__paragraph--bold">$0</span>`;
}

//FUNCION GENERADORA DE ALERTAS 

function alertaEstado(mensaje, tipo) {
    swal(
        'Estado de compra',
        mensaje,
        tipo
    )
}

function agregarSpinner() {
    productosCarrito.innerHTML = `<div class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`
}

function cambiarTitulo(titulo) {
    modalHeader.innerHTML = `<h5 class="modal-title modal__title" id="staticBackdropLabel"> ${titulo}
    </h5>`
}


function mostrarProvincias() {

    cambiarTitulo("¿Cómo quieres recibir la compra?");

    productosCarrito.innerHTML = `
    <div class="delivery__container container">
    <h4 class="delivery__title">Provincia</h4>
     <select id="provFiltro" name="delivery__provincias">
    </select>
    <h4 class="delivery__title">Municipio</h4>
    <select id="muniFiltro" name="delivery__municipios">
    </select>

    <h4 class="delivery__subtitle">Opciones de envío</h4>
    <div class="line"></div>
    <div class="delivery__items">
    <label><input type="checkbox" id="cbox1" value="first_checkbox"> Llega el 23 de marzo</label>
    <h5 class="delivery__paragraph">Gratis</h5>
    </div>
    <div class="delivery__items">
    <label><input type="checkbox" id="cbox1" value="first_checkbox"> Llega el 4 de abril</label>
    <h5 class="">Gratis</h5>
    </div>
    </div> `
}

function comparar(a, b) {
    return a - b;
}