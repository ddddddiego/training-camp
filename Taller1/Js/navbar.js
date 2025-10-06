document.addEventListener('DOMContentLoaded', function() {
    fetch('/Taller1/navbar.html') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la navbar: ' + response.statusText);
            }
            return response.text(); 
        })
        .then(html => {
            const placeholder = document.getElementById('navbar-placeholder');
            if(placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error("NO se encontro 'navbar-placeholder'.");
            }
        })
        .catch(error => {
            console.error('ERROR AUTODESTRUCCION EN 10... 9...', error);
        });
});