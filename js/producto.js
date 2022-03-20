class Indumentaria {
    constructor(id, nombre, descripcion, precio, tag, talle, img, cantidad) {
        this.id = parseInt(id);
        this.nombre = nombre.toUpperCase();
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.tag = tag;
        this.talle = talle;
        this.img = img;
        this.cantidad = cantidad || 1;
    }
    sumarIva(impuesto) {
        return this.precio += (this.precio * impuesto);
    }
    agregarCantidad() {
        this.cantidad++;
    }
    eliminarCantidad(valor) {
        this.cantidad -= valor;
    }
    subTotal() {
        return this.precio * this.cantidad;
    }
}