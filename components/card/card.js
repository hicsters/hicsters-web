document.addEventListener("DOMContentLoaded", function () {
    fetch('components/card/card.html')
        .then(response => response.text())
        .then(data => {
            const cards = document.getElementsByClassName('card');
            Array.from(cards).forEach(card => {
                card.innerHTML = data;
            });
        })
        .catch(error => {
            console.error("Card loading error:", error);
        });
});
