// main.js
// 탭 클릭 시 카드 리스트 필터링 및 스크롤 처리

document.addEventListener("DOMContentLoaded", async () => {
  // 1. 초기 데이터 설정 - 페이지 로드 시 한 번만 실행
  const allContentIds = Object.keys(window.cardData);
  const shuffledIds = shuffleArray([...allContentIds]);  // 초기 랜덤 순서
  const sortedIds = [...allContentIds].sort((a, b) => Number(b) - Number(a));  // 정렬된 순서

  // 2. 탭 요소 가져오기
  const tabs = document.querySelectorAll("li.tab-item");

  // 3. 초기 카드 생성 (랜덤 순서)
  await renderCards(shuffledIds);

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

      // 4-3. 필터링 (랜덤 순서 없이)
      let filteredIds;
      if (filterKey === "all") {
        filteredIds = shuffledIds;  // 초기 랜덤 순서 유지
      } else {
        filteredIds = sortedIds.filter(id => window.cardData[id].type === filterKey);
      }

      // 4-4. 카드 재렌더링
      await renderCards(filteredIds);

      // 4-5. 스크롤 상단으로
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});

// 카드 렌더링 함수
async function renderCards(ids) {
  const container = document.querySelector(".contects-list");
  container.innerHTML = '';

  for (const id of ids) {
    const data = window.cardData[id];
    
    const div = document.createElement('div');
    div.setAttribute('data-id', id);
    div.setAttribute('role', 'gridcell');
    div.setAttribute('aria-label', data.type === 'others' ? `기타 콘텐츠 ${id}` : `앤솔로지 ${id}`);
    
    div.innerHTML = await fetchTemplate();
    
    if (data) {
      // series-num 요소 처리 추가
      const seriesLi = div.querySelector('li.series-num');
      if (seriesLi && data.type !== 'series') {
        seriesLi.remove();  // series 타입이 아닌 경우 요소 제거
      }

      const elements = {
        '.quote': data.quote,
        '.title.value': data.title,
        '.writer.value': data.writer,
        '.theme.value': data.theme,
        '.series-num.value': data.seriesNum
      };

      Object.entries(elements).forEach(([selector, value]) => {
        const el = div.querySelector(selector);
        if (el && value) el.textContent = value;
      });

      const thumb = div.querySelector('.thumb');
      if (thumb) {
        thumb.style.backgroundImage = `url("/images/thumb/thumb-${id}.png")`;
        thumb.style.backgroundColor = data.bgColor || '#ffffff';
        thumb.style.color = data.textColor || '#1a1a1a';
        thumb.setAttribute('role', 'img');
        thumb.setAttribute('aria-label', `콘텐츠 ${id} 썸네일`);
      }
    }

    div.addEventListener('click', () => {
      window.location.href = `/contents/contents-${id}.html`;
    });

    container.appendChild(div);
  }
}

// 템플릿 가져오기 함수
async function fetchTemplate() {
  const res = await fetch('/components/card/card.html');
  return await res.text();
}

// 유틸리티 함수: 배열 랜덤 셔플
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
