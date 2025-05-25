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

    // c) 클릭 시 페이지 이동
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      window.location.href = `/contents/contents-${id}.html`;
    });

    // d) 썸네일 배경 설정
    const thumb = div.querySelector('.thumb');
    if (thumb) thumb.style.backgroundImage = `url("/images/thumb/thumb-${id}.png")`;

    // e) .card-series 아닌 경우 series-num li 숨김
    if (!div.classList.contains('card-series')) {
      const seriesLabel = div.querySelector('.series-num.lable');
      if (seriesLabel) {
        const seriesLi = seriesLabel.closest('li.contents-detail');
        if (seriesLi) seriesLi.style.display = 'none';
      }
    }

    // f) contents-data.js의 데이터 참조하여 텍스트 삽입
    const data = window.cardData[id];
    if (data) {
      const mappings = {
        '.quote':            data.quote,
        '.title.value':      data.title,
        '.writer.value':     data.writer,
        '.theme.value':      data.theme,
        '.series-num.value': data.seriesValue
      };
      Object.entries(mappings).forEach(([selector, text]) => {
        const el = div.querySelector(selector);
        if (el && text != null) el.textContent = text;
      });
    }
  }
});