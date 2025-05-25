// card.js
// DOMContentLoaded 이벤트 발생 시 단일 템플릿(card.html)로 모든 카드 생성, 데이터 삽입, 클릭 네비게이션

document.addEventListener("DOMContentLoaded", async () => {
  // ① 데이터 스크립트 확인
  if (!window.cardData) {
    console.error('contents-data.js가 로드되지 않았습니다.');
    return;
  }

  // ② 컨테이너와 placeholder 요소 선택
  const container = document.querySelector(".contects-list");
  if (!container) return;
  const placeholders = container.querySelectorAll("div[data-id]");

  // ③ 단일 컴포넌트 템플릿 fetch
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

  // ④ 각 placeholder에 컴포넌트, 썸네일, 데이터 삽입 및 클릭 네비게이션
  for (const div of placeholders) {
    const id = div.dataset.id;
    if (!id) continue;

    // a) 컴포넌트 HTML 주입
    div.innerHTML = templateHtml;

    // b) SVG 로더 실행
    await loadSvgElements(div);

    // c) 클릭 시 페이지 이동 및 접근성 속성 추가
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `콘텐츠 ${id} 자세히 보기`);
    
    // 키보드 접근성 추가
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

    // e) .card-series 아닌 경우 series-num li 숨김
    if (!div.classList.contains('card-series')) {
      const seriesLabel = div.querySelector('.series-num.lable');
      if (seriesLabel) {
        const seriesLi = seriesLabel.closest('li.contents-detail');
        if (seriesLi) {
          seriesLi.style.display = 'none';
          seriesLi.setAttribute('aria-hidden', 'true');
        }
      }
    }

    // f) contents-data.js의 데이터 참조하여 텍스트 삽입
    const data = window.cardData[id];
    if (data) {
      const mappings = {
        '.quote': { selector: '.quote', text: data.quote, label: '인용구' },
        '.title.value': { selector: '.title.value', text: data.title, label: '제목' },
        '.writer.value': { selector: '.writer.value', text: data.writer, label: '작성자' },
        '.theme.value': { selector: '.theme.value', text: data.theme, label: '주제' },
        '.series-num.value': { selector: '.series-num.value', text: data.seriesValue, label: '시리즈 번호' }
      };
      
      Object.values(mappings).forEach(({ selector, text, label }) => {
        const el = div.querySelector(selector);
        if (el && text != null) {
          el.textContent = text;
          el.setAttribute('aria-label', `${label}: ${text}`);
        }
      });
    }
  }
});