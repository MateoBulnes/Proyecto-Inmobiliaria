const preloadImages = (sources) => {
    sources.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
};

preloadImages(['/media/Logo_PGP-04.png', '/media/Logo_PGP-03.png']);

window.addEventListener("scroll", () => {
    let navbar = document.querySelector('#navbar');
    let logo = document.querySelector('#img_logo_navbar img');

    navbar.classList.toggle('fondo_navbar', window.scrollY > 0);
    //(window.scrollY > 0) ? logo.src = '/media/Logo_PGP-04.png' : logo.src = '/media/Logo_PGP-03.png';
});

document.addEventListener("DOMContentLoaded", function () {
    /*var video = document.getElementById("video_nosotros");
    video.play();*/
});