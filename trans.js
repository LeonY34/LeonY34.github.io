function GoToCps() {
    window.location.href = 'https://leony34.github.io/cps';
}

function GoToBlog() {
    window.location.href = 'https://leony34.github.io/blog';
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
