document.addEventListener("DOMContentLoaded", function () {
    fetch("/components/footer/footer.html")
      .then(res => res.text())
      .then(async html => {
        const footerEl = document.getElementById("footer");
        footerEl.innerHTML = html;
        
        // SVG 로더 실행
        await loadSvgElements(footerEl);
      })
      .catch(err => console.error("Footer loading failed:", err));
});
