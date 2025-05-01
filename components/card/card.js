document.addEventListener("DOMContentLoaded", () => {
    // 카드 컨테이너 div를 모두 찾습니다
    const cardDivs = document.querySelectorAll(".contects-list > a > div[class^='card-']");
    const templateCache = {};
  
    cardDivs.forEach(div => {
      // 'card-xxx' 형태의 클래스 이름을 찾아내고
      const cardClass = Array.from(div.classList)
        .find(c => c.startsWith("card-"));
      if (!cardClass) return;
  
      // URL을 동적으로 생성 (components/card/card-xxx.html)
      const url = `components/card/${cardClass}.html`;
  
      // 한 번만 fetch 하고 결과를 재사용하기 위해 캐싱
      if (!templateCache[url]) {
        templateCache[url] = fetch(url)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
            return res.text();
          })
          .catch(err => {
            console.error(`Error loading ${url}:`, err);
            return "";
          });
      }
  
      // 가져온 HTML을 div에 삽입
      templateCache[url].then(html => {
        div.innerHTML = html;
      });
    });
  });
  