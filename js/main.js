fetch("../data/productos.json")
    .then(respuesta => respuesta.json())
    .then(data => {
        for (const literal of data) {
            productos.push(new Indumentaria(literal.id, literal.nombre, literal.descripcion, literal.precio, literal.tag, literal.talle, literal.img, literal.cantidad))
        }
        productosUI(productos);
        filtroUI(productos);


    }).catch(mensaje => console.error(mensaje))


if ('Buscador' in localStorage) {
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
    let total = totalCarrito();
    saldoCliente -= total;

    promesaCompra(saldoCliente).then((mensaje) => {

        agregarSpinner();
        fetch('https://apis.datos.gob.ar/georef/api/provincias')
            .then((respuesta) => {
                return respuesta.json()
            }).then((datos) => {
                mostrarProvincias();
                const provFiltro = document.getElementById('provFiltro');

                for (const provincia of datos.provincias) {
                    datos.provincias.sort(ordenar);

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

                            const munFiltro = document.getElementById('muniFiltro');

                            for (const municipio of datos.municipios) {
                                datos.municipios.sort(ordenar);

                                munFiltro.innerHTML += `<option value="${municipio.id}">
                                ${municipio.nombre}
                                </option>`
                            }

                            document.getElementById('confirmar').onclick = () => {
                                const mapeoCarrito = productos.map(producto => producto.id == producto.id);

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

                                        swal("Gracias por su compra!", "Los productos seran enviados en los siguientes 8 días hábiles", "success");

                                        cambiarTitulo("Carrito de compras");
                                        vaciarCarrito();
                                    })
                            }
                        })
                }
            })
            .catch((mensaje) => {
                alertaEstado(mensaje, "error");
            })

    }).catch((mensaje) => {
        alertaEstado(mensaje, "error");
    })
};