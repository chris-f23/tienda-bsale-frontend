// #region Constantes y Variables

// Plantillas para card de producto y link de paginacion.
const PLANTILLA_PRODUCTO = document.getElementById('product_template');
const PLANTILLA_LINK_CATEGORIA = document.getElementById('category_link_template');
const PLANTILLA_LINK_PAGINACION = document.getElementById('page_link_template');

// Elementos de la pagina.
let contenedorProductos = document.getElementById('products_container');
let inputBusqueda = document.getElementById('input_search');
let contenedorLinkPaginas = document.getElementById('pagination');
let selectCantProductos = document.getElementById('select_cant_products');
let dropdownCategorias = document.getElementById('dropdown_categories');

// Estado de la app.
let App = {
  search: undefined,
  category: undefined,
  pagination: {
    results_per_page: 6,
    total_results: undefined,
    current_page: 1,
  }
}

// #endregion

// #region Listeners

/**
 * Al cargar la pagina:
 * - Obtiene todas las categorias y cargarlas en el dropdown de categorias.
 * - Usando el estado inicial, obtiene los productos desde el backend y crear un card por cada producto.
 */
document.addEventListener("DOMContentLoaded", async (e) => {
  const categorias = await obtenerCategorias();
  let linkCategoriaTodos = PLANTILLA_LINK_CATEGORIA.cloneNode(true).content;
  linkCategoriaTodos.querySelector("a").innerHTML = "Todos";
  linkCategoriaTodos.querySelector("a").setAttribute('onclick', `actualizarEstado({ categoria: null})`)
  dropdownCategorias.appendChild(linkCategoriaTodos);

  for (const categoria of categorias.rows) {
    let linkCategoria = PLANTILLA_LINK_CATEGORIA.cloneNode(true).content;
    linkCategoria.querySelector("a").innerHTML = categoria.name;
    linkCategoria.querySelector("a").setAttribute('onclick', `actualizarEstado({ categoria: '${categoria.name}' })`)
    dropdownCategorias.appendChild(linkCategoria);
  }

  await actualizarEstado({});
});

/**
 * Al presionar el boton 'buscar' o enter dentro del input de busqueda,
 * actualiza el valor de busqueda en el estado de la aplicacion.
 */
document.getElementById("search_form").addEventListener('submit', async (e) => {
  e.preventDefault();
  await actualizarEstado({});
});

inputBusqueda.addEventListener('input', async (e) => {
  if (!inputBusqueda.value) {
    await actualizarEstado({});
  }
});

/**
 * Al seleccionar una cantidad,
 * actualiza el valor de productos por pagina en el estado de la aplicacion.
 */
selectCantProductos.addEventListener('change', async (e) => {
  if (selectCantProductos.value) {
    await actualizarEstado({ resultadosPorPagina: selectCantProductos.value});
  }
});

// #endregion

// #region Metodos

/**
 * Actualiza los atributos del estado de la aplicación.
 * @param {Object} atributos - Los nuevos valores de los atributos del estado.
 * @param {number} atributos.paginaActual - La nueva pagina actual.
 * @param {string} atributos.categoria - La nueva categoria.
 * @param {number} atributos.resultadosPorPagina - La nueva cantidad de resultados por pagina.
 * @param {string} atributos.busqueda - La nueva busqueda.
 */
async function actualizarEstado({
  paginaActual,
  categoria,
  resultadosPorPagina,
}) {
  App.pagination.current_page = (paginaActual && paginaActual != null) ? paginaActual : 1;

  if (categoria !== undefined) {
    if (categoria === '') {
      App.category = undefined;
    } else {
      App.category = categoria;
    }
  }
  App.pagination.results_per_page = (resultadosPorPagina && resultadosPorPagina != null) ? resultadosPorPagina : 6;
  App.search = inputBusqueda.value;
  
  const productos = await obtenerProductos({
    cantidad: App.pagination.results_per_page,
    pagina: App.pagination.current_page,
    busqueda: App.search,
    categoria: App.category
  });

  actualizarTituloPagina();
  renderizarProductos(productos.rows);
  actualizarPaginacion(productos.count);
}

/**
 * Renderiza un card por cada producto obtenido.
 * @param {array} productos - La lista de productos.
 */
function renderizarProductos(productos) {
  // Eliminar cards antiguos.
  while (contenedorProductos.firstChild) contenedorProductos.removeChild(contenedorProductos.firstChild);

  // Crear cards nuevos.
  for (const producto of productos) {
    let cardProducto = PLANTILLA_PRODUCTO.cloneNode(true).content;

    // Propiedades de un producto.
    let descuento = producto.discount;
    let precioVenta = (producto.price + 0).toFixed(2);
    let precioAnterior = (precioVenta / ((100 - descuento)/100)).toFixed(2);

    // Imagen placeholder en caso de no tener imagen.
    let urlImagen = producto.url_image;
    if (!urlImagen || urlImagen === null) {
      urlImagen = "./imagen_no_disponible.png";
    }

    // Escribir propiedades del producto en el nuevo card.
    cardProducto.querySelector("[name='name']").innerHTML = producto.name;
    cardProducto.querySelector("[name='price']").innerHTML = "$ " + precioVenta;

    // Aplicar descuento solo si es distinto a 0.
    cardProducto.querySelector("[name='discount']").innerHTML = (descuento > 0) ? descuento + "% de descuento" : " ";
    cardProducto.querySelector("[name='prev_price']").innerHTML = (descuento > 0) ? "$ " + precioAnterior : " ";  

    cardProducto.querySelector("[name='url_image']").src = urlImagen;

    // Agregar card al contenedor.
    contenedorProductos.appendChild(cardProducto);
  }
}

/**
 * Actualiza los links de paginación.
 * Utiliza el estado de la aplicación y la cantidad total de productos
 * para determinar la forma en la que se muestran los links.
 * @param {number} cantidadTotalProductos - La cantidad total de productos.
 */
function actualizarPaginacion(cantidadTotalProductos) {
  App.pagination.total_results = cantidadTotalProductos;

  // Eliminar links antiguos.
  while (contenedorLinkPaginas.firstChild) contenedorLinkPaginas.removeChild(contenedorLinkPaginas.firstChild);

  // Si no existen productos, no mostrar links.
  if (cantidadTotalProductos === 0) {
    return;
  }

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
    linkPagina.querySelector("a").setAttribute('onclick', `actualizarEstado({ paginaActual: 1 })`)
    contenedorLinkPaginas.appendChild(linkPagina);
  }
  if (App.pagination.current_page > cantPaginas - 2) {
    offsetInicio = cantPaginas - 5;
  }

  // Links de las paginas intermedias.
  for (let index = 1; index <= 5; index++) {
    let linkPagina = PLANTILLA_LINK_PAGINACION.cloneNode(true).content;
    linkPagina.querySelector("a").innerHTML = index + offsetInicio;
    linkPagina.querySelector("a").setAttribute('onclick', `actualizarEstado({ paginaActual: ${index + offsetInicio} })`)

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
    linkPagina.querySelector("a").setAttribute('onclick', `actualizarEstado({ paginaActual: ${cantPaginas})`)
    contenedorLinkPaginas.appendChild(linkPagina);
  }
}

function actualizarTituloPagina() {
  let tituloPagina = document.getElementById('page_title');
  let tituloResultadosPara = document.getElementById('results_for');

  if (App.category && App.category != null) {
    tituloPagina.innerHTML = "Categoria: " + App.category;
  } else {
    tituloPagina.innerHTML = "Inicio";
  }

  // Eliminar "Resultados para..."
  if (tituloResultadosPara.children.length > 0) {
    tituloResultadosPara.firstChild.remove();
    tituloResultadosPara.innerHTML = null;
  }

  // Escribir "Resultados para..." solo si existe texto que buscar.
  if (App.search && App.search != null) {
    tituloResultadosPara.innerHTML = "Resultados para ";
    let textoBusqueda = document.createElement("text-primary");
    textoBusqueda.className = "text-primary";
    textoBusqueda.innerHTML = `"${App.search}"`;

    tituloResultadosPara.appendChild(textoBusqueda);
  }
}

// #endregion