

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

            await obtener_emprendimientos();
            crear_filtro('emprendimiento_busqueda');

            await obtener_localidades();
            crear_filtro('localidad_busqueda');

            break;

        case 'propiedades.html':
            await obtener_propiedades();

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

            break;

        case 'nosotros.html':
            let video = document.getElementById("video_nosotros");
            video.play();
            break;

        default: //detalle
            const params = new URLSearchParams(window.location.search);
            let id_prop = params.get('id');

            if(id_prop){
                await obtener_detalle_prop(id_prop);
                console.log(detalle_prop);
                llenar_detalle_prop();
            }

            break;
    }
});