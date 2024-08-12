const API_KEY = 'de8bf11f2f631662a2b561aa688c0efa1764a6ff';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'API_KEY'
    }
};

/*class Propiedad {
    constructor(id, titu)
}*/

var pagina_actual = window.location.pathname.split('/').pop();
var ultimos_ingresos;
var propiedades;