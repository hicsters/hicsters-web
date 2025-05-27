async function loadPartial(selector, url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      document.querySelector(selector).insertAdjacentHTML('beforeend', html);
    } catch (e) {
      console.error(`❌ ${url} 로드 실패:`, e);
    }
  }
  
  // 1) <head> 공통 태그 삽입
  fetch('/components/head/head.html')
    .then(r => r.text())
    .then(html => document.head.insertAdjacentHTML('beforeend', html))
    .catch(console.error);
  