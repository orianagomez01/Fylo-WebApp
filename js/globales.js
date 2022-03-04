let buscadorProductos = document.getElementById('search');
let resultados = document.getElementById('search__results--container');
let saldoCliente = 20000;

const productosRender = document.getElementById('card');
const filtro = document.getElementById('filter');
const cantidadCarrito = document.getElementById('cantidad');
const productosCarrito = document.getElementById('productosCarrito');
const confirmar = document.getElementById('confirmar');
const botonBorrar = document.getElementById('modal__btn');
const totalCarritoInterfaz = document.getElementById('totalCarrito');
const modalHeader = document.getElementById('modal__header');

const productos = [];
const carrito = [];