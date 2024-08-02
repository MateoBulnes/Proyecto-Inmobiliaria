document.addEventListener("DOMContentLoaded", function() {
    var tarjetas = document.querySelectorAll(".tarjeta_container");

    tarjetas.forEach(function(tarjeta) {
        tarjeta.addEventListener("click", function() {
            window.location.href = "detalle.html";
        });
    });
});