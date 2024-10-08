/*LLAMADAS A LA API*/
const obtener_ultimos_ingresos = async () => {
    const url = `https://www.tokkobroker.com/api/v1/property/?key=${API_KEY}&lang=es_ar&format=json&limit=${limite_ultimos_ingresos}&order_by=deleted_at`;
    const resp = await fetch(url);

    const data = await resp.json();

    ultimos_ingresos = data.objects;
}

const obtener_localidades_cf = async () => {
    const url = `https://www.tokkobroker.com/api/v1/state/${id_capital_federal}/?lang=es_ar&format=json&key=${API_KEY}`;
    const resp = await fetch(url);

    const data = await resp.json();
    localidades_cf = data.divisions;
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

const filtrar_propiedades = async ({ tipo_oper, tipo_prop, localidad, emprendimiento, moneda, precio_desde, precio_hasta, localidad_por_nombre }) => {
    const data_filtros = `{"current_localization_id": [${localidad}],"current_localization_type": "division","price_from": ${precio_desde},"price_to": ${precio_hasta},"operation_types": [${tipo_oper}],"property_types": [${tipo_prop}],"currency": "${moneda}","filters":[${emprendimiento}]}`;

    const url = `https://www.tokkobroker.com/api/v1/property/search?&lang=es_ar&format=json&limit=40&data=${data_filtros}&key=${API_KEY}`;

    const resp = await fetch(url, options);
    const data = await resp.json();

    resultados_busqueda = data.objects;
    cant_resultados_busqueda = data.meta.total_count;

    if (localidad_por_nombre) {
        resultados_busqueda = resultados_busqueda.filter(prop => prop.location.full_location.toUpperCase().includes(localidad_por_nombre.toUpperCase()));
        cant_resultados_busqueda = resultados_busqueda.length;
    }
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

const crear_tarjeta_propiedad = (propiedad, fila, container) => {
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

    (pagina_actual == 'index') ? tarjeta.classList.add('col-sm-12', 'col-md-6', 'col-lg-4') : tarjeta.classList.add('col-sm-10', 'col-md-6', 'col-lg-4');

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

    document.querySelector(`#${container} #fila_prop_${fila}`).append(tarjeta);
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

const cargar_propiedades = (propiedades, container) => {
    for (let i = 0; i < propiedades.length; i++) {
        let fila = Math.floor(cant_prop_cargadas + i / 3);
        let div_row = document.getElementById(`fila_prop_${fila}`);

        if (!div_row) {
            div_row = document.createElement('div');
            div_row.classList.add('row');
            div_row.id = `fila_prop_${fila}`;
            document.querySelector(`#${container}`).append(div_row);
        }
        crear_tarjeta_propiedad(propiedades[i], fila, container);
    }

    var tarjetas = document.querySelectorAll(".tarjeta_container");

    tarjetas.forEach(function (tarjeta) {
        tarjeta.addEventListener("click", function () {
            const id_prop = this.getAttribute('data-id');
            window.location.href = `../pages/detalle.html?id=${id_prop}`;
        });
    });
}

const definir_busqueda_localidad = (localidad_seleccionada) => {
    return localidades_fuera_tokko.find(loc => loc.toUpperCase() == localidad_seleccionada.toUpperCase());
};

const obtener_filtros = () => {
    let tipo_oper = document.querySelector('#tipo_oper_filtro').value;
    if (tipo_oper == 'Todas') { tipo_oper = '1,2,3' };

    let tipo_prop = document.querySelector('#tipo_prop_filtro').value;
    if (tipo_prop == 'Todas') { tipo_prop = '1,2,3,5,7,13' };

    let localidad = document.querySelector('#localidad_filtro').value;
    let texto_localidad = document.querySelector('#localidad_filtro');
    //if (localidad == 'Todas') { localidad = localidades.map(loc => loc.id).join(',') }
    if (localidad == 'Todas') { localidad = todas_localidades }
    let localidad_por_nombre = definir_busqueda_localidad(texto_localidad.options[texto_localidad.selectedIndex].text);

    let precio_desde = document.querySelector('#filtro_precio_desde').value.trim();
    precio_desde = limpiar_formato_precio(precio_desde);
    let precio_hasta = document.querySelector('#filtro_precio_hasta').value.trim();
    precio_hasta = limpiar_formato_precio(precio_hasta);
    if (!precio_desde) { precio_desde = '0' }
    if (!precio_hasta) { precio_hasta = MAX_PRECIO }


    let emprendimiento = document.querySelector('#emprendimiento_filtro').value;
    if (emprendimiento == 'Todos') {
        emprendimiento = ''
    } else {
        emprendimiento = `["development__id","op","${emprendimiento}"]`;
    };

    let moneda;
    document.querySelectorAll('#main_propiedades #container_filtros .btn-check').forEach(b => {
        if (b.checked) {
            moneda = b.value;
        }
    });

    return {
        tipo_oper,
        tipo_prop,
        localidad,
        emprendimiento,
        moneda,
        precio_desde,
        precio_hasta,
        localidad_por_nombre
    }
}

const guardar_filtros = () => {
    let tipo_oper = document.querySelector('#tipo_oper_filtro').value;
    let tipo_prop = document.querySelector('#tipo_prop_filtro').value;
    let localidad = document.querySelector('#localidad_filtro').value;
    let texto_localidad = document.querySelector('#localidad_filtro');
    let localidad_por_nombre = definir_busqueda_localidad(texto_localidad.options[texto_localidad.selectedIndex].text);
    let precio_desde = document.querySelector('#filtro_precio_desde').value.trim();
    precio_desde = limpiar_formato_precio(precio_desde);
    let precio_hasta = document.querySelector('#filtro_precio_hasta').value.trim();
    precio_hasta = limpiar_formato_precio(precio_hasta);
    let emprendimiento = document.querySelector('#emprendimiento_filtro').value;

    let moneda;
    document.querySelectorAll('#main_propiedades #container_filtros .btn-check').forEach(b => {
        if (b.checked) {
            moneda = b.value;
        }
    });

    let url = `${window.location.pathname}?tipo_oper=${encodeURIComponent(tipo_oper)}&tipo_prop=${encodeURIComponent(tipo_prop)}&localidad=${encodeURIComponent(localidad)}&emprendimiento=${encodeURIComponent(emprendimiento)}`;
    precio_desde && (url += `&precio_desde=${encodeURIComponent(precio_desde)}`);
    precio_hasta && (url += `&precio_hasta=${encodeURIComponent(precio_hasta)}`);
    localidad_por_nombre && (nueva_url += `&loc_nombre=${encodeURIComponent(localidad_por_nombre)}`);
    window.history.replaceState({}, '', url);
}

const aplicar_filtros = async () => {
    mostrar_pantalla_carga();

    const filtros = obtener_filtros();

    await filtrar_propiedades(filtros);

    document.querySelector('#container_propiedades').innerHTML = '';

    document.querySelector('#tag_cant_resultados').innerText = `${cant_resultados_busqueda} resultados encontrados`;

    if (cant_resultados_busqueda > 0) {
        document.querySelector('.container_sin_resultados').style.display = "none";
        cargar_propiedades(resultados_busqueda, 'container_propiedades');
        guardar_filtros();
    } else {
        document.querySelector('.container_sin_resultados').style.display = "";
    }
    ocultar_pantalla_carga();
}

const limpiar_filtros = () => {
    document.querySelector('#tipo_prop_filtro').selectedIndex = 0;
    document.querySelector('#tipo_oper_filtro').selectedIndex = 0;
    document.querySelector('#localidad_filtro').selectedIndex = 0;
    document.querySelector('#emprendimiento_filtro').selectedIndex = 0;
    document.querySelector('#filtro_precio_desde').value = null;
    document.querySelector('#filtro_precio_hasta').value = null;
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
}

const redireccionar_pagina = (pagina) => {
    const tipo_oper = document.querySelector('#tipo_oper_busqueda').value;
    const tipo_prop = document.querySelector('#tipo_prop_busqueda').value;
    const localidad = document.querySelector('#localidad_busqueda').value;
    const emprendimiento = document.querySelector('#emprendimiento_busqueda').value;
    let texto_localidad = document.querySelector('#localidad_busqueda');

    const localidad_nombre = texto_localidad.options[texto_localidad.selectedIndex].text

    const url = `/pages/${pagina}.html?tipo_oper=${encodeURIComponent(tipo_oper)}&tipo_prop=${encodeURIComponent(tipo_prop)}&localidad=${encodeURIComponent(localidad)}&emprendimiento=${encodeURIComponent(emprendimiento)}&loc_nombre=${encodeURIComponent(localidad_nombre)}`;

    window.location.href = url;
}

const cargar_filtros_busqueda = () => {
    const params = new URLSearchParams(window.location.search);

    let localidad_nombre = params.get('loc_nombre');
    if (localidad_nombre) {
        let selector_loc = document.querySelector('#localidad_filtro');

        for (let i = 0; i < selector_loc.options.length; i++) {
            if (selector_loc.options[i].text.toUpperCase() == localidad_nombre.toUpperCase()) {
                selector_loc.selectedIndex = i;
                break;
            }
        }
    } else {
        document.querySelector('#localidad_filtro').value = params.get('localidad');
    }

    document.querySelector('#tipo_oper_filtro').value = params.get('tipo_oper');
    document.querySelector('#tipo_prop_filtro').value = params.get('tipo_prop');
    document.querySelector('#emprendimiento_filtro').value = params.get('emprendimiento');
    document.querySelector('#filtro_precio_desde').value = params.get('precio_desde');
    document.querySelector('#filtro_precio_hasta').value = params.get('precio_hasta');

    document.querySelector('#btn_aplicar_filtros').click();
}

const buscar = () => {
    redireccionar_pagina('propiedades');
}

const cargar_mas_propiedades = async () => {
    mostrar_pantalla_carga();
    await obtener_propiedades(cant_prop_cargadas, 9);

    document.querySelector('#btn_ver_mas').remove();
    cargar_propiedades(propiedades, 'container_propiedades');
    crear_btn_ver_mas();
    cant_prop_cargadas += propiedades.length;
    if (cant_prop_cargadas == cant_total_prop) { document.querySelector('#btn_ver_mas').remove() }
    ocultar_pantalla_carga();
}

const validarNumero = (input) => {
    input.value = input.value.replace(/[^0-9]/g, '');
}

const formatear_precio = (event) => {
    const input = event.target;
    // Obtener el valor del campo de entrada y eliminar cualquier carácter no numérico
    let value = input.value.replace(/[^0-9]/g, '');

    // Formatear el número con puntos como separadores de miles
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Establecer el valor formateado en el campo de entrada
    input.value = value;
};

const limpiar_formato_precio = (precio) => {
    const precio_limpio = precio.replace(/\./g, '');

    return precio_limpio;
}

function cambiarLogo() {
    const logo_base = document.querySelector('.logo_base');
    const logo_scroll = document.querySelector('.logo_scroll');
    if (window.matchMedia("(max-width: 376px)").matches) {
        if(logo_base){logo_base.src = "/media/Logo-PGP-08.png";}
        logo_scroll.src = "/media/Logo-PGP-08.png";
    } else {
        if(logo_base){logo_base.src = "/media/Logo_horizontal.png";}
        logo_scroll.src = "/media/Logo_horizontal.png";
    }
  }



