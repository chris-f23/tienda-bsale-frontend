# tienda-bsale-frontend
Ejercicio para postular al cargo de Desarrollador en Bsale

Repositorios:
[Backend - API REST](https://github.com/chris-f23/tienda-bsale-backend)
[Frontend - Aplicación cliente (SPA)](https://github.com/chris-f23/tienda-bsale-frontend)

## Ejercicio
El ejercicio consiste en construir una tienda online que despliegue un catalogo de productos teniendo las siguientes consideraciones:
- Los productos se encuentran alojados en una base de datos privada

- Se debe desarrollar una API REST (Backend), en el lenguaje y framework(s) deseado(s), que recupere los productos y los sirva en endpoints específicos
- La API debe permitir entregar los productos agrupados por categoría, y permitir buscar un producto mediante ciertos filtros

- Además, se debe desarrollar una aplicación de cliente (Frontend) en javascript, la cual consuma la API anterior
- La aplicación de cliente debe ser desarrollada sin ningún framework, pero pueden integrarse librerías de terceros mediante links y scripts en el encabezado (jQuery, Bootstrap, Material Design, etc)

- Finalmente, se debe disponibilidad el repositorio y desplegar la aplicación en una plataforma como Heroku, Netlify u otro

## Soluciones
### Backend
Se desarrolló una API REST utilizando Node.js con los siguientes módulos:

- express : Framework servidor
- cors : Para habilitar CORS
- dotenv : Para leer las variables de entorno
- moment : Para el logging de solicitudes
- sequelize : ORM para interactuar con bases de datos
- mysql2, slite : Drivers requeridos por sequelize

La API REST expone los siguientes endpoints:

**```GET /api/categories```**

**Descripción**: Obtiene todas las categorías desde la base de datos.

**```GET /api/products```**

**Descripción**: Obtiene una cantidad limitada de productos desde la base de datos, respetando ciertos parámetros.

**parámetros**:
  * `'limit=NUMBER'`: Cantidad de productos a obtener. El valor mínimo es 5.
  El valor máximo es 100. Si no se utiliza este parámetro, entonces se usa el valor por defecto (20).
  Si el valor no está dentro del rango permitido, se usa el mínimo o máximo según corresponda.

  * `'page=NUMBER'`: El numero de la página de resultados.
  El valor mínimo es 1. Si no se especifica un valor, entonces se usa el valor por defecto (1). Si el valor supera la ultima página, se obtiene una lista vacía.
  
Los siguientes parámetros sirven para filtrar los resultados.
  * `'search=STRING'`: Texto a coincidir con el nombre de uno o varios productos.
  El valor debe tener un mínimo de 1 carácter y un máximo de 20 caracteres. Si el texto excede el máximo, se ignoran los caracteres restantes.

  * `'category=STRING'`: Texto que indica el nombre de la categoría de los productos a obtener. Si el nombre de la categoría no existe, entonces no se devuelven resultados.

### Frontend
Se desarrolló una SPA (Single Page Application) que consume la API anterior utilizando las siguientes tecnologías y librerías:

- JavaScript (vanilla)
- HTML
- Bootstrap 5.1

## Despliegue
Ambas aplicaciones se encuentran disponibles en Heroku, en los siguientes enlaces:

[Backend - API REST](https://chris-f23-bsale-backend.herokuapp.com/api/) (ver endpoints)
[Frontend - Aplicación cliente (SPA)](https://chris-f23-bsale-frontend.herokuapp.com/)