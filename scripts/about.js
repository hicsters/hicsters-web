document.addEventListener("DOMContentLoaded", () => {
  const frameEl = document.getElementById('frame');
  const bgEl = document.querySelector('main');
  const rollingCanvas = document.getElementById('rolling');
  
  // 필수 요소 확인
  if (!frameEl) {
    console.error('❌ frame 요소를 찾을 수 없습니다.');
    return;
  }
  
  if (!bgEl) {
    console.error('❌ main 요소를 찾을 수 없습니다.');
    return;
  }

  const totalFrames = 101;  // 000~100 → 101장
  const vhUnit = window.innerHeight / 100;  // 1vh 당 픽셀 수
  let lastIdx = -1;

  const startScroll = (100 * 2) / 3;  // 66.6667vh
  const endScroll = 100;  // 100vh

  const startRGB = { r: 0x1a, g: 0x1a, b: 0x1a };
  const endRGB = { r: 0xff, g: 0xff, b: 0xff };

  // 이미지 프리로드 함수
  const preloadImages = () => {
    const images = [];
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const fileName = String(i).padStart(3, '0');
      img.src = `/images/logo/ScrollAnim/${fileName}.avif`;
      images.push(img);
    }
    return Promise.all(images.map(img => {
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = resolve; // 에러가 나도 계속 진행
      });
    }));
  };

  // 초기 이미지 설정
  frameEl.src = `/images/logo/ScrollAnim/000.avif`;
  
  // 스크롤 이벤트 핸들러 (디바운싱 적용)
  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    
    ticking = true;
    window.requestAnimationFrame(() => {
      const vhScrolled = window.scrollY / vhUnit;  // 0~100

      // 1) 프레임 전환
      const idx = Math.min(totalFrames - 1, Math.max(0, Math.floor(vhScrolled)));
      if (idx !== lastIdx && frameEl) {
        lastIdx = idx;
        const fileName = String(idx).padStart(3, '0');
        const newSrc = `/images/logo/ScrollAnim/${fileName}.avif`;
        // 현재 src에서 파일명 추출하여 비교
        const currentSrc = frameEl.src || frameEl.getAttribute('src') || '';
        if (!currentSrc.includes(fileName)) {
          frameEl.src = newSrc;
        }
      }

      // 2) 배경색 보간 (66.7vh→100vh 구간) - 메뉴가 열려있지 않을 때만
      if (!document.querySelector('nav.open')) {
        let t = (vhScrolled - startScroll) / (endScroll - startScroll);
        t = Math.min(1, Math.max(0, t));
        const r = Math.round(startRGB.r + t * (endRGB.r - startRGB.r));
        const g = Math.round(startRGB.g + t * (endRGB.g - startRGB.g));
        const b = Math.round(startRGB.b + t * (endRGB.b - startRGB.b));
        if (bgEl) {
          bgEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
      }
      
      ticking = false;
    });
  };

  // 초기 스크롤 상태 적용
  handleScroll();
  
  // 스크롤 이벤트 리스너 등록
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 이미지 프리로드 (백그라운드에서)
  preloadImages().then(() => {
    console.log('✅ 스크롤 애니메이션 이미지 프리로드 완료');
  }).catch(err => {
    console.warn('⚠️ 이미지 프리로드 중 일부 실패:', err);
  });

  // Rive 애니메이션 초기화
  if (rollingCanvas && typeof rive !== 'undefined') {
    try {
      const riveInstance = new rive.Rive({
        src: '/images/riv/about-rolling.riv',
        canvas: rollingCanvas,
        autoplay: true,
        layout: new rive.Layout({
          fit: rive.Fit.cover,
          alignment: rive.Alignment.center
        }),
        onLoad: () => {
          if (riveInstance) {
            riveInstance.resizeDrawingSurfaceToCanvas();
          }
        },
        onLoadError: (err) => {
          console.warn('⚠️ Rive 애니메이션 로드 실패:', err);
        }
      });
    } catch (err) {
      console.warn('⚠️ Rive 초기화 실패:', err);
    }
  } else if (!rollingCanvas) {
    console.warn('⚠️ rolling canvas 요소를 찾을 수 없습니다.');
  } else {
    console.warn('⚠️ Rive 라이브러리가 로드되지 않았습니다.');
  }
});

