class Indumentaria {
    constructor(id, nombre, descripcion, precio, tag, talle, img) {
        this.id = parseInt(id);
        this.nombre = nombre.toUpperCase();
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.tag = tag;
        this.talle = talle;
        this.img = img;
        this.cantidad = 1;
    }
    // acá van MÉTODOS DEL OBJETO !!!!!!!! no hace falta que le agregue la palabra reservada función - tiene que ir fuera del constructor pero dentro de la clase 
    sumarIva(impuesto) {
        return this.precio += (this.precio * impuesto);
    }
    agregarCantidad() {
        this.cantidad++;
    }
    eliminarCantidad() {
        this.cantidad--;
    }
    subTotal() {
        return this.precio * this.cantidad;
    }
}