/*LLAMADAS A LA API*/
const obtener_ultimos_ingresos = async () => {
    console.log('haciendo la llamada')
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=3&order_by=deleted_at`;
    const resp = await fetch(url);

    const data = await resp.json();

    ultimos_ingresos = data.objects;
}

const obtener_propiedades = async (offset = 0, limite = 9) => {
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=${limite}&order_by=deleted_at&offset=${offset}`;
    const resp = await fetch(url);

    const data = await resp.json();
    cant_total_prop = data.meta.total_count;
    propiedades = data.objects;
}

const obtener_localidades = async () => {
    const url = `https://www.tokkobroker.com/api/v1/state/${id_zona_norte}/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url);

    const data = await resp.json();
    localidades = data.divisions;
}

const obtener_emprendimientos = async () => {
    const url = `https://www.tokkobroker.com/api/v1/development/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url);
    const data = await resp.json();

    emprendimientos = data.objects;
}

const obtener_detalle_prop = async (id_prop) => {
    const url = `https://www.tokkobroker.com/api/v1/property/${id_prop}/?key=${API_KEY}&lang=es_ar&format=json`;

    const resp = await fetch(url);
    const data = await resp.json();

    detalle_prop = data;
}

const obtener_filtros = () => {
    let tipo_oper_ing = document.querySelector('#tipo_oper_filtro').value;
    if (tipo_oper_ing == 'Todas') { tipo_oper_ing = '1,2,3' };

    let tipo_prop_ing = document.querySelector('#tipo_prop_filtro').value;
    if (tipo_prop_ing == 'Todas') { tipo_prop_ing = '1,2,3,5,7,13' };

    let localidad_ing = document.querySelector('#localidad_filtro').value;
    if (localidad_ing == 'Todas') { localidad_ing = localidades.map(localidad => localidad.id).join(',') }

    let precio_ing = document.querySelector('#precio_filtro').value;
    if (precio_ing == 'Todos') { precio_ing = '5000000' };

    let emprendimiento_ing = document.querySelector('#emprendimiento_filtro').value;
    if (emprendimiento_ing == 'Todos') {
        emprendimiento_ing = ''
    } else {
        emprendimiento_ing = `["development__id","op","${emprendimiento_ing}"]`;
    };

    let moneda_ing;
    document.querySelectorAll('#main_propiedades #container_filtros .btn-check').forEach(b => {
        if (b.checked) {
            moneda_ing = b.value;
        }
    });

    return {
        tipo_oper: tipo_oper_ing,
        tipo_prop: tipo_prop_ing,
        localidad: localidad_ing,
        emprendimiento: emprendimiento_ing,
        moneda: moneda_ing,
        precio: precio_ing
    }
}

const filtrar_propiedades = async ({ tipo_oper, tipo_prop, localidad, emprendimiento, moneda, precio }) => {
    const data_filtros = `{"current_localization_id": [${localidad}],"current_localization_type": "division","price_from": 0,"price_to": ${precio},"operation_types": [${tipo_oper}],"property_types": [${tipo_prop}],"currency": "${moneda}","filters":[${emprendimiento}]}`;

    console.log(data_filtros);

    const url = `https://www.tokkobroker.com/api/v1/property/search?&lang=es_ar&format=json&limit=40&data=${data_filtros}&key=${API_KEY}`;

    const resp = await fetch(url, options);

    const data = await resp.json();
    resultados_busqueda = data.objects;
    cant_resultados_busqueda = data.meta.total_count;
}


const mostrar_pantalla_carga = () => {
    let loader = document.querySelector('.cargador_hidden');

    if (loader) {
        loader.classList.remove('cargador_hidden');
        loader.classList.add('cargador');
    }
}

const ocultar_pantalla_carga = () => {
    let loader = document.querySelector('.cargador');

    if (loader) {
        loader.classList.remove('cargador');
        loader.classList.add('cargador_hidden');
    }
}

/*CREACION DE ELEMENTOS*/

const crear_tarjeta_propiedad = (propiedad, fila) => {
    let id_prop = propiedad.id;
    let precio = propiedad.operations[0].prices[0].price;
    let moneda = propiedad.operations[0].prices[0].currency;
    let tipo_oper = propiedad.operations[0].operation_type;
    let cant_dormitorios = propiedad.suite_amount;
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


const crear_filtro = (nombre_filtro, pagina = 'index') => {
    let select = document.querySelector(`#${nombre_filtro}`);

    if (pagina == 'index') { select = document.querySelector(`#${nombre_filtro}_busqueda`) }
    else { select = document.querySelector(`#${nombre_filtro}_filtro`) }

    if (nombre_filtro == 'emprendimiento') {
        emprendimientos.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.innerText = e.name.toLowerCase();
            select.append(option);
        });
    }
    else if (nombre_filtro == 'localidad') {
        localidades.forEach(l => {
            const option = document.createElement('option');
            option.value = l.id;
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

const crear_btn_ver_mas = () => {
    let btn_ver_mas = document.createElement('button');
    btn_ver_mas.classList.add('btn');
    btn_ver_mas.id = 'btn_ver_mas';
    btn_ver_mas.innerText = 'Ver Más';
    document.querySelector('#container_propiedades').append(btn_ver_mas);
    document.querySelector('#btn_ver_mas').addEventListener('click', cargar_mas_propiedades);
}

const acortar_desc_emprendimiento = (emprendimiento) => {
    let index = emprendimiento.description.indexOf("Características");

    if (index !== -1 && index < 400) {
        return emprendimiento.description.substring(0, index).trim();
    } else {
        if (emprendimiento.name == 'NORDELTA') {
            index = emprendimiento.description.indexOf("propios");
            return emprendimiento.description.substring(0, index).trim();
        }
        else if (emprendimiento.name == 'SAN SEBASTIAN') {
            index = emprendimiento.description.indexOf("Barrios");
            return emprendimiento.description.substring(0, index).trim();
        } else {
            return emprendimiento.description;
        }
    }

}

const crear_emprendimientos = () => {
    let n_emp_actual = 0;

    emprendimientos.forEach(emp => {
        console.log(emp.tags)
        let columna;
        if (n_emp_actual % 2 == 0) {
            columna = document.querySelector('#col_1_emp');
        } else {
            columna = document.querySelector('#col_2_emp')
        }

        let fila = document.createElement('div');
        fila.classList.add('row', 'fila_emprendimiento');

        fila.innerHTML = `
            <div class="col-sm-11 info_emprendimiento">
                <div class="header_emprendimiento">
                    <h3>${emp.name}</h3>
                    <h6>${emp.location.short_location}</h6>
                </div>
                <p>${acortar_desc_emprendimiento(emp)}</p>
                <div id="emprendimiento_${n_emp_actual}" class="container_servicios"></div>
            </div>
        `;
        columna.append(fila);

        let container = document.querySelector(`#emprendimiento_${n_emp_actual}`);
        emp.tags.forEach(t => {
            let span = document.createElement('span');
            span.classList.add('badge', 'badge_tarjeta', 'servicio_emp');
            span.innerText = t.name;

            container.append(span);
        });

        n_emp_actual++;
    });
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
    document.querySelector('#dormitorios_detalle').innerText = detalle_prop.suite_amount;
    document.querySelector('#banios_detalle').innerText = detalle_prop.bathroom_amount;
    document.querySelector('#superficie_detalle').innerHTML = `${detalle_prop.surface} m<sup>2</sup>`;
    document.querySelector('#descripcion_detalle').innerHTML = detalle_prop.rich_description;

    document.querySelector('#dormitorios_caract').innerText = `Dormitorios: ${detalle_prop.suite_amount}`;
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

const cargar_propiedades = (propiedades) => {
    for (let i = 0; i < propiedades.length; i++) {
        let fila = Math.floor(cant_prop_cargadas + i / 3);
        let div_row = document.getElementById(`fila_prop_${fila}`);

        if (!div_row) {
            div_row = document.createElement('div');
            div_row.classList.add('row');
            div_row.id = `fila_prop_${fila}`;
            document.querySelector('#container_propiedades').append(div_row);
        }
        crear_tarjeta_propiedad(propiedades[i], fila);
    }

    var tarjetas = document.querySelectorAll(".tarjeta_container");

    tarjetas.forEach(function (tarjeta) {
        tarjeta.addEventListener("click", function () {
            const id_prop = this.getAttribute('data-id');
            window.location.href = `detalle.html?id=${id_prop}`;
        });
    });
}

const aplicar_filtros = async () => {
    mostrar_pantalla_carga();

    const filtros = obtener_filtros();

    await filtrar_propiedades(filtros);

    document.querySelector('#container_propiedades').innerHTML = '';

    document.querySelector('#tag_cant_resultados').innerText = `${cant_resultados_busqueda} resultados encontrados`;

    if (cant_resultados_busqueda > 0) {
        document.querySelector('.container_sin_resultados').style.display = "none";
        cargar_propiedades(resultados_busqueda);
    } else {
        document.querySelector('.container_sin_resultados').style.display = "";
    }
    ocultar_pantalla_carga();
}

const redireccionar_pagina = (pagina) => {
    const tipo_oper = document.querySelector('#tipo_oper_busqueda').value;
    const tipo_prop = document.querySelector('#tipo_prop_busqueda').value;
    const localidad = document.querySelector('#localidad_busqueda').value;
    const emprendimiento = document.querySelector('#emprendimiento_busqueda').value;

    const url = `/pages/${pagina}.html?tipo_oper=${encodeURIComponent(tipo_oper)}&tipo_prop=${encodeURIComponent(tipo_prop)}&localidad=${encodeURIComponent(localidad)}&emprendimiento=${encodeURIComponent(emprendimiento)}`;

    window.location.href = url;
}

const cargar_filtros_busqueda = () => {
    const params = new URLSearchParams(window.location.search);

    document.querySelector('#tipo_oper_filtro').value = params.get('tipo_oper');
    document.querySelector('#tipo_prop_filtro').value = params.get('tipo_prop');
    document.querySelector('#localidad_filtro').value = params.get('localidad');
    document.querySelector('#emprendimiento_filtro').value = params.get('emprendimiento');

    document.querySelector('#btn_aplicar_filtros').click();
}

const buscar = () => {
    redireccionar_pagina('propiedades');
}

const cargar_mas_propiedades = async () => {
    mostrar_pantalla_carga();
    await obtener_propiedades(cant_prop_cargadas, 9);

    document.querySelector('#btn_ver_mas').remove();
    cargar_propiedades(propiedades);
    crear_btn_ver_mas();
    cant_prop_cargadas += propiedades.length;
    if (cant_prop_cargadas == cant_total_prop) { document.querySelector('#btn_ver_mas').remove() }
    ocultar_pantalla_carga();
}



