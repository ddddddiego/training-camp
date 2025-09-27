function includeHTML(file, targetElementId) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById(targetElementId).innerHTML = this.responseText;
        }
    };
    // Esta ruta debe ser correcta desde la página actual hasta sidebar.html
    xhr.open("GET", file, true); 
    xhr.send();
}