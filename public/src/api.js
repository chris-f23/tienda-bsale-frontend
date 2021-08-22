const URL_DESARROLLO = "http://localhost:5000/api"
const URL_DESPLIEGUE = "https://chris-f23-bsale-backend.herokuapp.com/api"

const urlBase = URL_DESARROLLO;

/**
 * Obtiene los productos desde el backend y retorna el objeto que contiene los productos y la cantidad de estos.
 * @param {Object} parametros - Los parametros a utilizar en la petición.
 * @param {number} parametros.cantidad - La cantidad de prodctos a obtener.
 * @param {number} parametros.pagina - El numero de la pagina a obtener.
 * @param {string} parametros.busqueda - El texto a buscar.
 * @param {string} parametros.categoria - La categoria de los productos a obtener.
 * @returns {Object} - La respuesta que contiene los productos y la cantidad de estos.
 */
async function obtenerProductos({
  cantidad,
  pagina,
  busqueda,
  categoria
}) {
  let url = new URL(`${urlBase}/products`);
  let params = {};

  // Agregar parametros
  if (cantidad) params.limit = cantidad;
  if (pagina) params.page = pagina;
  if (busqueda) params.search = busqueda;
  if (categoria) params.category = categoria;
  url.search = new URLSearchParams(params).toString();
  
  url = url.toString();
  console.log("Obteniendo productos...\n", url);
  
  const res = await fetch(url);
  return res.json();
}

/**
 * Obtiene las categorias desde el backend y retorna el objeto que contiene las categorias y la cantidad de estas.
 * @returns {Object} - La respuesta que contiene las categorias y la cantidad de estas.
 */
async function obtenerCategorias() {
  let url = new URL(`${urlBase}/categories`);
  url = url.toString();

  console.log("Obteniendo categorias...\n", url);

  const res = await fetch(url);
  return res.json();
}
