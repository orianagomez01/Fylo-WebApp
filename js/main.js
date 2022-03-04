productos.push(new Indumentaria(1, "Portsaid", "Top PORTSAID Verde con Flores Rosas", 1490, "Camisetas", [
    'XS',
    'S',
    'L'
], "/img/catalogo__remeras.webp"));
productos.push(new Indumentaria(2, "Lacoste", "Top LACOSTE Color Beige", 8000, "Camisetas", [
    'XS',
    'S',
    'M',
    'XXL'
], "/img/catalogo__remeras2.webp"));
productos.push(new Indumentaria(3, "Skanda", "Camiseta SKANDA de San Diego, Surf Club", 999, "Camisetas", [
    'XS',
    'M'
], "/img/catalogo__remeras4.webp"));
productos.push(new Indumentaria(4, "47 Street", "Camiseta 47 STREET Luna y Sol", 3199, "Camisetas", [
    'S',
    'XXL'
], "/img/catalogo__remeras5.webp"));
productos.push(new Indumentaria(5, "Laile", "Camisa LAILE de Colores Ocre", 8000, "Camisetas", [
    'S',
    'XL'
], "/img/catalogo__remeras6.webp"));
productos.push(new Indumentaria(6, "Prussia", "Pantalón PRUSSIA con Lino", 8252, "Jeans", [
    'S',
    'L',
    'XXL'
], "/img/catalogo__jeans.webp"));
productos.push(new Indumentaria(7, "EcoSistema", "Pantalón ECOSISTEMA con Cierre", 4499, "Jeans",
    [
        'XS',
        'M',
        'L',
        'XL'
    ], "/img/catalogo__jeans2.webp"));
productos.push(new Indumentaria(8, "System", "Pantalón Jean SYSTEM Tiro Alto", 4794, "Jeans", [
    'XS',
    'S',
    'XL'
], "/img/catalogo__jeans3.webp"));
productos.push(new Indumentaria(9, "Wanama", "Pantalón Jean WANAMA Negro", 8290, "Jeans", [
    'XS',
    'S',
    'M'
], "/img/catalogo__jeans4.webp"));
productos.push(new Indumentaria(10, "Mistral", "Pantalón Jean MISTRAL Tobillero", 6500, "Jeans", [
    'S',
    'M',
    'L'
], "/img/catalogo__jeans5.webp"));
productos.push(new Indumentaria(11, "Step Back", "Pantalón Jean STEP BACK Tiro Alto", 7200, "Jeans", [
    'XS',
    'XL'
], "/img/catalogo__jeans6.webp"));
productos.push(new Indumentaria(12, "Maryland", "Buzo MARYLAND West Virginia", 3400, "Camisetas", [
    'S',
    'L'
], "/img/catalogo__remeras7.webp"));


productosUI(productos);
filtroUI(productos);

if ('Buscador' in localStorage) {
    //pasa de JSON a objeto individual 
    const guardados = JSON.parse(localStorage.getItem('Buscador'));
    console.log(guardados);
    if (buscadorProductos.onclick) {
        buscadorHTML(productos);
    }
}

if ('Carrito' in localStorage) {
    const guardarCarrito = JSON.parse(localStorage.getItem('Carrito'));
    console.log(guardarCarrito);
}


confirmar.onclick = () => {
    // localStorage.clear();
    // carrito.splice(0, carrito.length);
    // carritoUI(carrito);

    // let total = totalCarrito();
    // saldoCliente -= total;

    promesaCompra(saldoCliente).then((mensaje) => {

        // AGREGAR SPINNER HACIA LA SIGUIENTE PANTALLA 
        agregarSpinner();
        //LLAMAR A LA API
        fetch('https://apis.datos.gob.ar/georef/api/provincias')
            .then((respuesta) => {
                //json.parse sirve cuando tengo un JSON puro, este es un objeto response que tiene JSON en algún lado. Por eso utilizamos este método
                return respuesta.json()
            }).then((datos) => {
                //VISUALIZAR LOS DATOS

                mostrarProvincias();
                const provFiltro = document.getElementById('provFiltro');

                for (const provincia of datos.provincias) {
                    // provincia.sort(comparar);
                    provFiltro.innerHTML += `<option value="${provincia.id}">
                    ${provincia.nombre}
                    </option>`
                }

                provFiltro.onchange = () => {
                    let idProvincia = provFiltro.value;
                    let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`

                    fetch(rutaBusqueda)
                        .then(respuesta =>
                            respuesta.json())
                        .then(datos => {
                            console.log(datos);

                            const munFiltro = document.getElementById('muniFiltro');

                            for (const municipio of datos.municipios) {
                                munFiltro.innerHTML += `<option value="${municipio.id}">
                                ${municipio.nombre}
                                </option>`
                            }

                            confirmar.onclick = () => {
                                const mapeoCarrito = productos.map(producto => producto.id == producto.id);

                                //TOMAR LOS DATOS DE LA COMPRA !
                                fetch('https://jsonplaceholder.typicode.com/posts', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            carrito: mapeoCarrito,
                                            idProvincia: idProvincia,
                                            idMunicipio: munFiltro.value
                                        }),
                                        headers: {
                                            'Content-type': 'application/json; charset=UTF-8',
                                        },
                                    }).then(respuesta => respuesta.json())
                                    .then(data => {

                                        Swal.fire(
                                            'Compra realizada',
                                            `Se ha realizado la compra del ${data.id}`,
                                            'success'
                                        )
                                        // productosCarrito.innerHTML = ``
                                        vaciarCarrito();
                                    })
                            }
                        })
                }
            })
            .catch((mensaje) => {
                console.log(mensaje);
            })




        // alertaEstado(mensaje, "success")
    }).catch((mensaje) => {
        alertaEstado(mensaje, "error")
    })
    // vaciarCarrito();


};