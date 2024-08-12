
const obtener_ultimos_ingresos = async () => {
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=3&order_by=deleted_at`;
    const resp = await fetch(url, options);

    const data = await resp.json();

    ultimos_ingresos = data.objects;
}

const obtener_propiedades = async (offset = 0, limite = 9) => {
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=${limite}&order_by=deleted_at&offset=${offset}`;
    const resp = await fetch(url, options);

    const data = await resp.json();
    propiedades = data.objects;
}

const crear_tarjeta_propiedad = (propiedad, fila) => {
    let precio = propiedad.operations[0].prices[0].price;
    let moneda = propiedad.operations[0].prices[0].currency;
    let tipo_oper = propiedad.operations[0].operation_type;
    let cant_dormitorios = propiedad.room_amount;
    let cant_banios = propiedad.bathroom_amount;
    let superficie = propiedad.surface;
    let img_portada = propiedad.photos.find(prop => prop.is_front_cover == true);
    let titulo = propiedad.address;


    let tarjeta = document.createElement('div');

    (pagina_actual == 'index.html') ? tarjeta.classList.add('col-sm-12', 'col-md-6', 'col-lg-4') : tarjeta.classList.add('col-sm-10', 'col-md-6', 'col-lg-4');

    tarjeta.innerHTML = `
        <div class="tarjeta_container">
            <div class="tarjeta_imagen">
                <div class="tarjeta_imagen_info">
                    <h4 class="tarjeta_precio"><span class="badge badge_tarjeta">${moneda} ${precio.toLocaleString('es-ES')}</span></h4>
                    <h5 class="tarjeta_tipo_transaccion"><span class="badge badge_tarjeta">${tipo_oper}</span></h5>
                </div>
            </div>
            <div class="tarjeta_info">
                <h4>${titulo}</h4>
                <div class="tarjeta_info_amenities">
                    <span class="tarjeta_amenitie">${cant_dormitorios} Dormitorios |</span>
                    <span class="tarjeta_amenitie">${cant_banios} baños |</span>
                    <span class="tarjeta_amenitie">${superficie} m<sup>2</sup></span>
                </div>
            </div>
        </div>`

    tarjeta.querySelector('.tarjeta_imagen').style.backgroundImage = `url(${img_portada.image})`;
    tarjeta.querySelector('.tarjeta_imagen').style.backgroundSize = 'cover';
    tarjeta.querySelector('.tarjeta_imagen').style.backgroundPosition = 'center center';

    if(pagina_actual == 'index.html'){
        document.querySelector('#cartas_ultimos_ingresos .row').append(tarjeta);
    } else{
        document.querySelector(`#container_propiedades #fila_prop_${fila}`).append(tarjeta);
    }
}