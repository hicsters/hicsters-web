// card.js
// DOMContentLoaded 이벤트 발생 시 단일 템플릿(card.html)로 모든 카드 생성, 데이터 삽입, 클릭 네비게이션

document.addEventListener("DOMContentLoaded", async () => {
  // ① 데이터 및 컨테이너 확인
  if (!window.cardData) {
    console.error('❌ contents-data.js가 로드되지 않았습니다.');
    return;
  }

  const container = document.querySelector(".contects-list");
  if (!container) {
    console.error('❌ .contects-list 요소를 찾을 수 없습니다.');
    return;
  }

  // ② 템플릿 로드
  let templateHtml = "";
  try {
    const res = await fetch("/components/card/card.html");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    templateHtml = await res.text();
    console.log('✅ 템플릿 로드 성공');
  } catch (err) {
    console.error('❌ 템플릿 로드 실패:', err);
    return;
  }

  // ③ SVG 로더 함수
  async function loadSvgElements(container) {
    const svgElements = container.querySelectorAll('object[type="image/svg+xml"]');
    await Promise.all(Array.from(svgElements).map(async obj => 
      new Promise(resolve => {
        obj.onload = () => {
          const svg = obj.contentDocument?.querySelector('svg');
          if (svg) {
            svg.style.width = '100%';
            svg.style.height = '100%';
          }
          resolve();
        };
      })
    ));
    return container;
  }

  // ④ 카드 생성 함수
  async function createCard(id, data) {
    const div = document.createElement('div');
    div.setAttribute('data-id', id);
    div.setAttribute('role', 'gridcell');
    div.innerHTML = templateHtml;

    await loadSvgElements(div);

    const seriesLi = div.querySelector('li.series-num');
    if (seriesLi && data.type !== 'series') {
      seriesLi.remove();
    }

    const mappings = {
      '.quote': { text: data.quote, label: '인용구' },
      '.title.value': { text: data.title, label: '제목' },
      '.writer.value': { text: data.writer, label: '작성자' },
      '.theme.value': { text: data.theme, label: '주제' },
      'p.series-num.value': { text: data.seriesNum, label: '시리즈 번호' }
    };

    Object.entries(mappings).forEach(([selector, { text, label }]) => {
      const el = div.querySelector(selector);
      if (el && text != null) {
        el.textContent = text;
        el.setAttribute('aria-label', `${label}: ${text}`);
      }
    });

    const thumb = div.querySelector('.thumb');
    if (thumb) {
      thumb.style.backgroundImage = `url("/images/thumb/thumb-${id}.png")`;
      thumb.setAttribute('role', 'img');
      thumb.setAttribute('aria-label', `콘텐츠 ${id} 썸네일`);
    }

    div.addEventListener('click', () => {
      window.location.href = `/contents/${id}`;
    });

    return div;
  }

  // ⑤ 카드 렌더링 함수
  async function renderCards(ids) {
    container.innerHTML = '';
    for (const id of ids) {
      const data = window.cardData[id];
      if (!data) continue;
      const card = await createCard(id, data);
      container.appendChild(card);
    }
  }

  // ⑥ 이벤트 리스너 등록
  window.addEventListener('renderCards', (event) => {
    if (!event.detail || !event.detail.ids) {
      console.error('❌ 잘못된 이벤트 데이터:', event);
      return;
    }
    renderCards(event.detail.ids);
  });

  // ⑦ 초기 렌더링
  try {
    const allContentIds = Object.keys(window.cardData);
    console.log('📝 전체 콘텐츠 수:', allContentIds.length);
    const shuffledIds = shuffleArray([...allContentIds]);
    await renderCards(shuffledIds);
    console.log('✅ 초기 렌더링 완료');
  } catch (err) {
    console.error('❌ 초기 렌더링 실패:', err);
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