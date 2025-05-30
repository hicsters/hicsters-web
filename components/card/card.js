// card.js
// DOMContentLoaded 이벤트 발생 시 단일 템플릿(card.html)로 모든 카드 생성, 데이터 삽입, 클릭 네비게이션

document.addEventListener("DOMContentLoaded", async () => {
  // ① 데이터 스크립트 확인
  if (!window.cardData) {
    console.error('contents-data.js가 로드되지 않았습니다.');
    return;
  }

  // ② 컨테이너 선택
  const container = document.querySelector(".contects-list");
  if (!container) return;

  // ③ 전체 콘텐츠 ID 배열 생성 및 셔플
  const allContentIds = Object.keys(window.cardData);
  const shuffledIds = shuffleArray([...allContentIds]);

  // ④ 컨테이너 비우기
  container.innerHTML = '';

  // ⑤ 단일 컴포넌트 템플릿 fetch
  const componentUrl = "/components/card/card.html";
  let templateHtml = "";
  try {
    const res = await fetch(componentUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    templateHtml = await res.text();
  } catch (err) {
    console.error(`템플릿 로드 실패: ${componentUrl}`, err);
    return;
  }

  // ⑥ 셔플된 ID로 카드 생성
  for (const id of shuffledIds) {
    const data = window.cardData[id];
    
    // 새로운 div 요소 생성
    const div = document.createElement('div');
    div.setAttribute('data-id', id);
    div.setAttribute('role', 'gridcell');
    div.setAttribute('aria-label', data.type === 'others' ? `기타 콘텐츠 ${id}` : `앤솔로지 ${id}`);
    
    // a) 컴포넌트 HTML 주입
    div.innerHTML = templateHtml;

    // b) SVG 로더 실행
    await loadSvgElements(div);

    // c) 클릭 시 페이지 이동 및 접근성 속성 추가
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `콘텐츠 ${id} 자세히 보기`);
    
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = `/contents/contents-${id}.html`;
      }
    });
    
    div.addEventListener('click', () => {
      window.location.href = `/contents/contents-${id}.html`;
    });

    // d) 썸네일 배경 설정
    const thumb = div.querySelector('.thumb');
    if (thumb) {
      thumb.style.backgroundImage = `url("/images/thumb/thumb-${id}.png")`;
      thumb.setAttribute('role', 'img');
      thumb.setAttribute('aria-label', `콘텐츠 ${id} 썸네일`);
    }

    // e) contents-data.js의 데이터 참조하여 텍스트 삽입
    if (data) {
      // series-num li 요소 처리 - data.type으로 직접 체크
      const seriesLi = div.querySelector('li.series-num');
      if (seriesLi && data.type !== 'series') {  // type이 series가 아닌 경우
        seriesLi.remove();  // li 요소 제거
      }

      // 나머지 요소들 처리
      const mappings = {
        '.quote': { text: data.quote, label: '인용구' },
        '.title.value': { text: data.title, label: '제목' },
        '.writer.value': { text: data.writer, label: '작성자' },
        '.theme.value': { text: data.theme, label: '주제' }
      };
      
      Object.entries(mappings).forEach(([selector, { text, label }]) => {
        const el = div.querySelector(selector);
        if (el && text != null) {
          el.textContent = text;
          el.setAttribute('aria-label', `${label}: ${text}`);
        }
      });
    }

    // 컨테이너에 카드 추가
    container.appendChild(div);
  }
});

// Fisher-Yates 셔플 알고리즘
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}