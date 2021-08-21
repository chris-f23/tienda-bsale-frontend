const plantilla = document.getElementById('product_template');
let contenedorProductos = document.getElementById('products_container');
let inputBusqueda = document.getElementById('input_search');

document.getElementById('search_form').addEventListener('submit', (e) => {
  e.preventDefault();
})

document.getElementById("btn_buscar").addEventListener('click', async (e) => {
  if (inputBusqueda.value && inputBusqueda.value.length > 0) {
    const productos = await obtenerProductos({ cantidad: 5, busqueda: inputBusqueda.value });
    renderizarProductos(productos)
  }
});

function renderizarProductos(productos) {
  // Eliminar cards antiguos.
  while (contenedorProductos.firstChild) contenedorProductos.removeChild(contenedorProductos.firstChild);

  // Crear cards nuevos.
  for (const producto of productos) {
    const plantillaProducto = plantilla.cloneNode(true);
    let cardProducto = plantillaProducto.content;

    // Propiedades de un producto
    let descuento = producto.discount;
    let precioVenta = (producto.price + 0).toFixed(2);
    let precioAnterior = (precioVenta / ((100 - descuento)/100)).toFixed(2);
    // Escribir propiedades del producto en el nuevo card.
    cardProducto.querySelector("[name='name']").innerHTML = producto.name;
    cardProducto.querySelector("[name='price']").innerHTML = "$ " + precioVenta;
    cardProducto.querySelector("[name='discount']").innerHTML = descuento + "% de descuento";
    cardProducto.querySelector("[name='prev_price']").innerHTML = "$ " + precioAnterior;
    cardProducto.querySelector("[name='url_image']").src = producto.url_image;

    // Agregar card al contenedor.
    contenedorProductos.appendChild(cardProducto);
  }
}

// Al cargar la pagina, obtener 5 productos desde el backend y crear un card por cada producto.
document.addEventListener("DOMContentLoaded", async (e) => {
  const productos = await obtenerProductos({ cantidad: 5 });
  renderizarProductos(productos);
});