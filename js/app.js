/*API*/
//const API_KEY = '5940ea45eb7cfb55228bec0b958ea9c0be151757';
/*const API_KEY = 'de8bf11f2f631662a2b561aa688c0efa1764a6ff';
const categoria = 'location';
var id_propiedad = 24880;
//const url = `https://www.tokkobroker.com/api/v1/${categoria}/${id_propiedad}/?key=${API_KEY}&lang=es_ar&format=json`;
const limite = 3;
const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=${limite}&order_by=deleted_at`;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'API_KEY'
    }
};

fetch(url, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));*/




var pagina_actual = window.location.pathname.split('/').pop();

window.addEventListener("scroll", () => {
    let navbar = document.querySelector('#navbar');
    let logo_base = document.querySelector('#navbar .logo_base');
    let logo_scroll = document.querySelector('#navbar .logo_scroll');

    if (pagina_actual == 'index.html') {
        if (window.scrollY > 0) {
            logo_base.style.display = 'none';
            logo_scroll.style.display = '';
        } else {
            logo_base.style.display = '';
            logo_scroll.style.display = 'none';
        }

        navbar.classList.toggle('fondo_navbar', window.scrollY > 0);
    }
});

document.addEventListener("DOMContentLoaded", async function () {

    switch (pagina_actual) {
        case 'index.html':
            await obtener_ultimos_ingresos();

            ultimos_ingresos.forEach(prop => {
                crear_tarjeta_propiedad(prop);
            });
            break;

        case 'propiedades.html':
            await obtener_propiedades();
            console.log(propiedades);

            let cant_filas = propiedades.length / 3;

            let contador_prop = 0;
            for (let i = 0; i < cant_filas; i++) {
                let row = document.createElement('div');
                row.classList.add('row');
                row.id = `fila_prop_${i+1}`;

                console.log(row)

                document.querySelector('#container_propiedades').append(row);
                //TODO: faltaria agregar las tarjetas dentro de cada row
            }

            break;

        case 'nosotros.html':
            let video = document.getElementById("video_nosotros");
            video.play();
            break;

        default:
            break;
    }
});