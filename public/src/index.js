// Plantillas.
const PLANTILLA_PRODUCTO = document.getElementById('product_template');
const PLANTILLA_LINK_PAGINACION = document.getElementById('page_link_template');

let contenedorProductos = document.getElementById('products_container');
let inputBusqueda = document.getElementById('input_search');
let contenedorLinkPaginas = document.getElementById('pagination');
let selectCantProductos = document.getElementById('select_cant_products');

// Estado de la app.
let App = {
  search: undefined,
  pagination: {
    results_per_page: 6,
    total_results: undefined,
    current_page: 1,
  }
}

// Al cargar la pagina:
// Obtener X productos desde el backend y crear un card por cada producto.
document.addEventListener("DOMContentLoaded", async (e) => {
  const productos = await obtenerProductos({ cantidad: App.pagination.results_per_page });
  renderizarProductos(productos.rows);
  actualizarPaginacion(productos.count);
});

// Realizar la busqueda:
document.getElementById("search_form").addEventListener('submit', async (e) => {
  e.preventDefault();
  if (inputBusqueda.value && inputBusqueda.value.length > 0) {
    App.search = inputBusqueda.value;
    await buscarProductos();
  }
});

async function buscarProductos(pagina) {
  if (pagina) {
    App.pagination.current_page = pagina;
  } else {
    App.pagination.current_page = 1;
  }
  
  const productos = await obtenerProductos({
    cantidad: App.pagination.results_per_page,
    pagina: App.pagination.current_page,
    busqueda: App.search
  });

  renderizarProductos(productos.rows);
  actualizarPaginacion(productos.count);
}

// Cambiar la cantidad de productos por pagina.
// Al seleccionar una cantidad, volver a la primera pagina para evitar quedar en una pagina vacia.
selectCantProductos.addEventListener('change', async (e) => {
  if (selectCantProductos.value) {
    App.pagination.results_per_page = selectCantProductos.value;
    await buscarProductos()
  }
});

function actualizarPaginacion(cantidadProductos) {
  App.pagination.total_results = cantidadProductos;

  // Eliminar links antiguos.
  while (contenedorLinkPaginas.firstChild) contenedorLinkPaginas.removeChild(contenedorLinkPaginas.firstChild);

  // Crear links nuevos.
  let cantPaginas = Math.ceil(App.pagination.total_results/App.pagination.results_per_page);

  // Mostrar siempre 5 links.
  // los numeros de las paginas cambian dependiendo de la pagina actual.
  let offsetInicio = 0;
  if (App.pagination.current_page > 3) {
    offsetInicio = App.pagination.current_page - 3;

    // Atajo a la primera pagina. Solo se crea si el link a la primera pagina no es visible.
    let linkPagina = PLANTILLA_LINK_PAGINACION.cloneNode(true).content;
    linkPagina.querySelector("a").innerHTML = `&laquo ${1}`;
    linkPagina.querySelector("a").setAttribute('onclick', `buscarProductos(1)`)
    contenedorLinkPaginas.appendChild(linkPagina);
  }
  if (App.pagination.current_page > cantPaginas - 2) {
    offsetInicio = cantPaginas - 5;
  }

  // Links de las paginas intermedias.
  for (let index = 1; index <= 5; index++) {
    let linkPagina = PLANTILLA_LINK_PAGINACION.cloneNode(true).content;
    linkPagina.querySelector("a").innerHTML = index + offsetInicio;
    linkPagina.querySelector("a").setAttribute('onclick', `buscarProductos(${index + offsetInicio})`)

    // Si es la pagina actual, agregar clase 'active'.
    if (App.pagination.current_page === index + offsetInicio) {
      linkPagina.querySelector("li").className += " active";
    }

    contenedorLinkPaginas.appendChild(linkPagina);
  }

  // Atajo a la ultima pagina. Solo se crea si el link a la ultima pagina no es visible.
  if (App.pagination.current_page < cantPaginas - 2) {
    let linkPagina = PLANTILLA_LINK_PAGINACION.cloneNode(true).content;
    linkPagina.querySelector("a").innerHTML = `${cantPaginas} &raquo`;
    linkPagina.querySelector("a").setAttribute('onclick', `buscarProductos(${cantPaginas})`)
    contenedorLinkPaginas.appendChild(linkPagina);
  }
}

function renderizarProductos(productos) {
  // Eliminar cards antiguos.
  while (contenedorProductos.firstChild) contenedorProductos.removeChild(contenedorProductos.firstChild);

  // Crear cards nuevos.
  for (const producto of productos) {
    let cardProducto = PLANTILLA_PRODUCTO.cloneNode(true).content;

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