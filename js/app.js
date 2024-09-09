const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))


window.addEventListener("scroll", () => {
    let navbar = document.querySelector('#navbar');
    let logo_base = document.querySelector('#navbar .logo_base');
    let logo_scroll = document.querySelector('#navbar .logo_scroll');

    if (pagina_actual == 'index') {
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
        case 'index':
            document.querySelector('#btn_buscar_rapido').addEventListener('click', buscar);

            await obtener_ultimos_ingresos();

            cargar_propiedades(ultimos_ingresos, 'cartas_ultimos_ingresos');

            await obtener_emprendimientos();
            crear_filtro('emprendimiento');

            /*await obtener_localidades();
            crear_filtro('localidad');*/

            ocultar_pantalla_carga();

            break;

        case 'propiedades':
            const params_busqueda = new URLSearchParams(window.location.search);

            document.querySelector('#btn_aplicar_filtros').addEventListener('click', aplicar_filtros);
            document.querySelector('#btn_limpiar_filtros').addEventListener('click', limpiar_filtros);

            const inputs_precio = document.querySelectorAll('.input_precio');

            inputs_precio.forEach((input) => {
                input.addEventListener('input', formatear_precio);
            });

            await obtener_localidades_cf();

            const ids = localidades_cf.map(l => l.id).join(',');
            let opcion_cf = document.querySelector('#opcion_cf');
            opcion_cf.value = ids;

            await obtener_emprendimientos();
            crear_filtro('emprendimiento', 'propiedades');


            if (params_busqueda.size <= 0) {
                await obtener_propiedades();

                document.querySelector('#tag_cant_resultados').innerText = `${cant_total_prop} resultados encontrados`;

                cargar_propiedades(propiedades, 'container_propiedades');
                cant_prop_cargadas = 9;
                crear_btn_ver_mas();

                ocultar_pantalla_carga();
            } else {
                cargar_filtros_busqueda();
                ocultar_pantalla_carga();
            }
            break;

        case 'nosotros':
            ocultar_pantalla_carga();
            let video = document.getElementById("video_nosotros");
            video.play();
            break;

        case 'emprendimientos':
            await obtener_emprendimientos();

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