document.addEventListener("DOMContentLoaded", function () {
    fetch('/components/footer/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => {
            console.error("Footer loading error:", error);
        });
});
