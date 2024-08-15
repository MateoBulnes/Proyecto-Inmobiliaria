const API_KEY = 'de8bf11f2f631662a2b561aa688c0efa1764a6ff';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'API_KEY'
    }
};


const id_zona_norte = 147;

var pagina_actual = window.location.pathname.split('/').pop();
var ultimos_ingresos;
var propiedades;
var localidades;
var emprendimientos;
var detalle_prop;
var n_img_detalle_actual;
var cant_total_prop;
var resultados_busqueda;
var cant_resultados_busqueda;