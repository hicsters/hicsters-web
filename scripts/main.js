// main.js
// 탭 클릭 시 카드 리스트 필터링 및 스크롤 처리

document.addEventListener("DOMContentLoaded", async () => {
  // 1. 초기 데이터 설정
  const allContentIds = Object.keys(window.cardData);
  const shuffledIds = shuffleArray([...allContentIds]);
  
  const sortedIds = [...allContentIds].sort((a, b) => {
    return b.localeCompare(a, undefined, { numeric: true });
  });

  // 2. 탭 요소 가져오기
  const tabs = document.querySelectorAll("li.tab-item");

  // 3. 초기 카드 생성 (랜덤 순서) - card.js의 함수 호출
  window.dispatchEvent(new CustomEvent('renderCards', { detail: { ids: shuffledIds } }));

  // 4. 탭 클릭 이벤트 바인딩
  tabs.forEach(tab => {
    tab.addEventListener("click", async e => {
      e.preventDefault();

      // 4-1. 활성 탭 표시
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // 4-2. 필터 키 결정
      let filterKey;
      if      (tab.classList.contains("all"))       filterKey = "all";
      else if (tab.classList.contains("anthology")) filterKey = "anthology";
      else if (tab.classList.contains("series"))    filterKey = "series";
      else if (tab.classList.contains("others"))    filterKey = "others";

      // 4-3. 필터링
      let filteredIds;
      if (filterKey === "all") {
        filteredIds = shuffledIds;
      } else {
        filteredIds = sortedIds.filter(id => window.cardData[id].type === filterKey);
      }

      // 4-4. 카드 재렌더링 - card.js의 함수 호출
      window.dispatchEvent(new CustomEvent('renderCards', { detail: { ids: filteredIds } }));

      // 4-5. 스크롤 상단으로
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});

// 유틸리티 함수: 배열 랜덤 셔플
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
