if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

// SVG 로더 함수
async function loadSvgElements(container = document) {
    // data-svg 속성을 가진 모든 요소를 찾습니다
    const svgContainers = container.querySelectorAll('[data-svg]');

    // 각 컨테이너에 대해 SVG를 로드하고 삽입합니다
    for (const container of svgContainers) {
        const svgName = container.dataset.svg; // data-svg 속성값을 가져옵니다
        
        try {
            // SVG 파일을 fetch로 가져옵니다
            const response = await fetch(`/images/${svgName}.svg`);
            
            if (!response.ok) {
                throw new Error(`SVG 로드 실패: ${svgName}`);
            }

            const svgText = await response.text();
            
            // SVG 텍스트를 파싱하여 DOM 요소로 변환합니다
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;
            
            // 기존 속성 복사
            Array.from(container.attributes).forEach(attr => {
                try {
                    if (attr.name === 'class') {
                        svgElement.className.baseVal = attr.value;
                    } else {
                        svgElement.setAttribute(attr.name, attr.value);
                    }
                } catch (e) {
                    console.warn(`속성 복사 실패: ${attr.name}`, e);
                }
            });

            // 내용 교체
            container.innerHTML = '';
            container.appendChild(svgElement);

        } catch (error) {
            console.error(`SVG 로드 중 오류 발생: ${svgName}`, error);
            container.innerHTML = `SVG 로드 실패: ${svgName}`;
        }
    }
}

// 페이지 로드 시 SVG 로더 실행
document.addEventListener('DOMContentLoaded', () => {
    loadSvgElements();
});