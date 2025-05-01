document.addEventListener("DOMContentLoaded", () => {
  // 1. 탭 요소, 카드 링크 컨테이너 가져오기
  const tabs  = document.querySelectorAll("li.tab-item");
  const cards = document.querySelectorAll(".contects-list > a");

  // 2. 탭 클릭 핸들러 등록
  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();  // <a> 기본 이동 막기

      // 2-1. .active 클래스 토글
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // 2-2. 필터 키 결정
      let filterKey;
      if    (tab.classList.contains("all"))        filterKey = "all";
      else if (tab.classList.contains("anthology")) filterKey = "card-anthology";
      else if (tab.classList.contains("series"))    filterKey = "card-series";
      else if (tab.classList.contains("others"))    filterKey = "card-others";

      // 3. 카드 노출/숨김 로직
      cards.forEach(link => {
        const cardDiv = link.querySelector("div");
        const show = (filterKey === "all") || cardDiv.classList.contains(filterKey);
        link.style.display = show ? "" : "none";
      });

      // 4. 부드럽게 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
