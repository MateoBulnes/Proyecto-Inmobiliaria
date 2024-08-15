const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))


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
    mostrar_pantalla_carga();
    switch (pagina_actual) {
        case 'index.html':
            await obtener_ultimos_ingresos();

            ultimos_ingresos.forEach(prop => {
                crear_tarjeta_propiedad(prop);
            });

            var tarjetas_ult_ing = document.querySelectorAll("#cartas_ultimos_ingresos .tarjeta_container");

            tarjetas_ult_ing.forEach(function (tarjeta) {
                tarjeta.addEventListener("click", function () {
                    const id_prop = this.getAttribute('data-id');
                    window.location.href = `/pages/detalle.html?id=${id_prop}`;
                });
            });

            await obtener_emprendimientos();
            crear_filtro('emprendimiento');

            await obtener_localidades();
            crear_filtro('localidad');

            ocultar_pantalla_carga();

            break;

        case 'propiedades.html':
            await obtener_propiedades();

            document.querySelector('#tag_cant_resultados').innerText = `${cant_total_prop} resultados encontrados`;

            for (let i = 0; i < propiedades.length; i++) {
                let fila = Math.floor(i / 3);
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

            let btn_ver_mas = document.createElement('button');
            btn_ver_mas.classList.add('btn');
            btn_ver_mas.id = 'btn_ver_mas';
            btn_ver_mas.innerText = 'Ver Más';
            document.querySelector('#container_propiedades').append(btn_ver_mas);

            await obtener_emprendimientos();
            crear_filtro('emprendimiento', 'propiedades');

            await obtener_localidades();
            crear_filtro('localidad', 'propiedades');

            ocultar_pantalla_carga();
            break;

        case 'nosotros.html':
            ocultar_pantalla_carga();
            let video = document.getElementById("video_nosotros");
            video.play();
            break;

        case 'emprendimientos.html':
            await obtener_emprendimientos();
            console.log(emprendimientos);

            crear_emprendimientos()

            ocultar_pantalla_carga();
            break;

        default: //detalle
            ocultar_pantalla_carga();
            const params = new URLSearchParams(window.location.search);
            let id_prop = params.get('id');

            if (id_prop) {
                mostrar_pantalla_carga();
                await obtener_detalle_prop(id_prop);
                llenar_detalle_prop();
                ocultar_pantalla_carga();
            }

            break;
    }
});

document.querySelector('#btn_mail_footer').addEventListener('click', function () {
    const mail = "info@perezguerreropropiedades.com.ar";

    navigator.clipboard.writeText(mail).then(function () {

    }).catch(function (error) {
        console.error('Error al copiar el texto: ', error);
    });
})

document.querySelector('#btn_aplicar_filtros').addEventListener('click', async () => {
    mostrar_pantalla_carga();

    const filtros = obtener_filtros();

    await filtrar_propiedades(filtros);
    ocultar_pantalla_carga();
    document.querySelector('#container_propiedades').innerHTML = '';

    document.querySelector('#tag_cant_resultados').innerText = `${cant_resultados_busqueda} resultados encontrados`;

    if (cant_resultados_busqueda > 0) {
        document.querySelector('.container_sin_resultados').style.display = "none";
        for (let i = 0; i < resultados_busqueda.length; i++) {
            let fila = Math.floor(i / 3);
            let div_row = document.getElementById(`fila_prop_${fila}`);

            if (!div_row) {
                div_row = document.createElement('div');
                div_row.classList.add('row');
                div_row.id = `fila_prop_${fila}`;
                document.querySelector('#container_propiedades').append(div_row);
            }
            crear_tarjeta_propiedad(resultados_busqueda[i], fila);
        }

        var tarjetas = document.querySelectorAll(".tarjeta_container");

        tarjetas.forEach(function (tarjeta) {
            tarjeta.addEventListener("click", function () {
                const id_prop = this.getAttribute('data-id');
                window.location.href = `detalle.html?id=${id_prop}`;
            });
        });
    } else {
        document.querySelector('.container_sin_resultados').style.display = "";
    }
})