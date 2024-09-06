const API_KEY = 'de8bf11f2f631662a2b561aa688c0efa1764a6ff';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        //Authorization: 'API_KEY'
    }
};


const id_zona_norte = 147;
const id_capital_federal = 146;
const limite_ultimos_ingresos = 6;
const todas_localidades = "24820,256038,24759,25620,25127,25852";
const MAX_PRECIO = '50000000';
const localidades_fuera_tokko = [
    "BENAVIDEZ",
    "ING. MASCHWITZ",
    "PACHECO",
    "DIQUE LUJAN",
    "GARIN"];


var pagina_actual = document.querySelector('.pagina_actual').value;
var ultimos_ingresos;
var propiedades;
var localidades;
var localidades_cf;
var emprendimientos;
var detalle_prop;
var n_img_detalle_actual;
var cant_total_prop;
var resultados_busqueda;
var cant_resultados_busqueda;
var cant_prop_cargadas = 0;