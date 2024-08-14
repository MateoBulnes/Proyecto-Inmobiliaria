/*LLAMADAS A LA API*/
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

const obtener_localidades = async () => {
    const url = `https://www.tokkobroker.com/api/v1/state/${id_zona_norte}/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url, options);

    const data = await resp.json();
    localidades = data.divisions;
}

const obtener_emprendimientos = async () => {
    const url = `https://www.tokkobroker.com/api/v1/development/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url, options);
    const data = await resp.json();

    emprendimientos = data.objects;
}

const obtener_detalle_prop = async (id_prop) => {
    const url = `https://www.tokkobroker.com/api/v1/property/${id_prop}/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url, options);
    const data = await resp.json();

    detalle_prop = data;
}

/*CREACION DE ELEMENTOS*/

const crear_tarjeta_propiedad = (propiedad, fila) => {
    let id_prop = propiedad.id;
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
        <div class="tarjeta_container" data-id="${id_prop}">
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

    if (pagina_actual == 'index.html') {
        document.querySelector('#cartas_ultimos_ingresos .row').append(tarjeta);
    } else {
        document.querySelector(`#container_propiedades #fila_prop_${fila}`).append(tarjeta);
    }
}

const crear_filtro = (nombre_filtro) => {
    let select = document.querySelector(`#${nombre_filtro}`);

    if (nombre_filtro == 'emprendimiento_busqueda') {
        emprendimientos.forEach(e => {
            const option = document.createElement('option');
            option.value = e.name;
            option.innerText = e.name.toLowerCase();
            select.append(option);
        });
    }
    else if (nombre_filtro == 'localidad_busqueda') {
        localidades.forEach(l => {
            const option = document.createElement('option');
            option.value = l.name;
            option.innerText = l.name.toLowerCase();
            select.append(option);
        })
    }
}

const crear_mapa = () => {
    var map = L.map('map').setView([detalle_prop.geo_lat, detalle_prop.geo_long], 15);
    var marker = L.marker([detalle_prop.geo_lat, detalle_prop.geo_long]).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

const cargar_imgs_detalle = () => {
    const imagenes = detalle_prop.photos;
    const imagen_actual = document.querySelector('#container_img_slider');

    imagen_actual.style.backgroundImage = `url(${imagenes[0].image})`;
    imagen_actual.style.backgroundSize = 'cover';
    imagen_actual.style.backgroundPosition = 'center center';

    n_img_detalle_actual = 0;
}

const cargar_caracteristicas = () => {
    document.querySelector('#main_detalle h1').innerText = detalle_prop.publication_title;
    document.querySelector('#precio_detalle').innerText = `${detalle_prop.operations[0].prices[0].currency} ${detalle_prop.operations[0].prices[0].price.toLocaleString('es-ES')}`;
    document.querySelector('#tipo_oper_detalle').innerText = detalle_prop.operations[0].operation_type;
    document.querySelector('#dormitorios_detalle').innerText = detalle_prop.room_amount;
    document.querySelector('#banios_detalle').innerText = detalle_prop.bathroom_amount;
    document.querySelector('#superficie_detalle').innerHTML = `${detalle_prop.surface} m<sup>2</sup>`;
    document.querySelector('#descripcion_detalle').innerHTML = detalle_prop.rich_description;

    document.querySelector('#dormitorios_caract').innerText = `Dormitorios: ${detalle_prop.room_amount}`;
    document.querySelector('#banios_caract').innerText = `Baños: ${detalle_prop.bathroom_amount}`;
    document.querySelector('#sup_cubierta_caract').innerHTML = `Superficie Cubierta: ${detalle_prop.roofed_surface} m<sup>2</sup>`;
    document.querySelector('#sup_total_caract').innerHTML = `Superficie Total: ${detalle_prop.surface} m<sup>2</sup>`;
    document.querySelector('#precio_caract').innerText = `Precio: ${detalle_prop.operations[0].prices[0].currency} ${detalle_prop.operations[0].prices[0].price}`;
    document.querySelector('#ubicacion_caract').innerText = `Ubicación: ${detalle_prop.location.short_location}`;
}


const cargar_servicios = () => {
    const totalServicios = detalle_prop.tags.length;
    const serviciosPorLista = Math.ceil(totalServicios / 3); 
    let listaIndex = 1;
    let cant_servicios = 0;

    detalle_prop.tags.forEach((s, index) => {
        let li = document.createElement('li');
        li.innerText = s.name;

        if (index > 0 && index % serviciosPorLista === 0) {
            listaIndex++;
        }

        let ul = document.querySelector(`#lista_servicios_${listaIndex}`);
        ul.append(li);
        cant_servicios++;
    });
}

const llenar_detalle_prop = () => {
    cargar_caracteristicas();
    cargar_servicios()
    crear_mapa();
    cargar_imgs_detalle();
}


const siguiente_img = () => {
    let orden_nueva_img = n_img_detalle_actual + 1;
    if (orden_nueva_img <= detalle_prop.photos.length - 1) {
        let nueva_img = detalle_prop.photos.find(p => p.order == orden_nueva_img);

        const container_img = document.querySelector('#container_img_slider');

        if (nueva_img) { container_img.style.backgroundImage = `url(${nueva_img.image})`; }
        n_img_detalle_actual = orden_nueva_img;
    }
}

const anterior_img = () => {
    let orden_nueva_img = n_img_detalle_actual - 1;

    if (orden_nueva_img >= 0) {
        let nueva_img = detalle_prop.photos.find(p => p.order == orden_nueva_img);

        const container_img = document.querySelector('#container_img_slider');

        container_img.style.backgroundImage = `url(${nueva_img.image})`;
        n_img_detalle_actual = orden_nueva_img;
    }
}

