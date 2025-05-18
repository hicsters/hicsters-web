// main.js
// 탭 클릭 시 카드 리스트 필터링 및 스크롤 처리

document.addEventListener("DOMContentLoaded", () => {
  // 1. 탭 요소와 카드 요소 가져오기
  const tabs  = document.querySelectorAll("li.tab-item");
  const cards = document.querySelectorAll(".contects-list > div");

  // 2. 각 탭에 클릭 이벤트 바인딩
  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault(); // 링크 기본 동작 방지

      // 2-1. 활성 탭 표시
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // 2-2. 필터 키 결정
      let filterKey;
      if      (tab.classList.contains("all"))        filterKey = "all";
      else if (tab.classList.contains("anthology")) filterKey = "card-anthology";
      else if (tab.classList.contains("series"))    filterKey = "card-series";
      else if (tab.classList.contains("others"))    filterKey = "card-others";

      // 3. 카드 표시 여부 판단 및 토글
      cards.forEach(card => {
        const show = (filterKey === "all") || card.classList.contains(filterKey);
        card.style.display = show ? "" : "none";
      });

      // 4. 부드럽게 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
