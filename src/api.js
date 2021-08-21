async function obtenerProductos({
  cantidad,
  pagina,
  busqueda
}) {
  let url = new URL('http://localhost:5000/api/products');
  let params = {};

  // Agregar parametros
  if (cantidad) params.limit = cantidad;
  if (pagina) params.page = pagina;
  if (busqueda) params.search = busqueda;

  url.search = new URLSearchParams(params).toString();
  url = url.toString();
  console.log(`Realizando solicitud a '${url}' ...`);

  const res = await fetch(url);
  return res.json();
}