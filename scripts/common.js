document.addEventListener("DOMContentLoaded", function() {
    // header load
    fetch('components/header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => {
            console.error("Header loading error:", error);
        });
    // footer load
    fetch('components/footer/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error("Footer loading error:", error);
        });
});