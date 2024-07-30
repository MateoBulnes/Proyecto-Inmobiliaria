const preloadImages = (sources) => {
    sources.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
};

preloadImages(['/media/Logo_PGP-04.png', '/media/Logo_PGP-03.png']);

window.addEventListener("scroll", () => {
    let navbar = document.querySelector('#navbar');
    let logo_base = document.querySelector('#navbar .logo_base');
    let logo_scroll = document.querySelector('#navbar .logo_scroll');

    if (window.scrollY > 0) {
        logo_base.style.display = 'none';
        logo_scroll.style.display = '';
    } else {
        logo_base.style.display = '';
        logo_scroll.style.display = 'none';
    }

    navbar.classList.toggle('fondo_navbar', window.scrollY > 0);
});

document.addEventListener("DOMContentLoaded", function () {
    let video = document.getElementById("video_nosotros");
    video.play();
});