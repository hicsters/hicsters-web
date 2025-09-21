(() => {
  const frameEl   = document.getElementById('frame');
  const bgEl      = document.querySelector('main');      // semantic 태그 선택자로 변경
  const totalFrames = 101;                               // 000~100 → 101장
  const vhUnit      = window.innerHeight / 100;          // 1vh 당 픽셀 수
  let lastIdx      = -1;

  const startScroll = (100 * 2) / 3;  // 66.6667vh
  const endScroll   = 100;            // 100vh

  const startRGB = { r: 0x1a, g: 0x1a, b: 0x1a };
  const endRGB   = { r: 0xff, g: 0xff, b: 0xff };

  window.addEventListener('scroll', () => {
    const vhScrolled = window.scrollY / vhUnit;  // 0~100

    // 1) 프레임 전환
    const idx = Math.min(totalFrames - 1, Math.floor(vhScrolled));
    if (idx !== lastIdx) {
      lastIdx = idx;
      const fileName = String(idx).padStart(3, '0');
      frameEl.src = `/images/logo/ScrollAnim/${fileName}.avif`;
    }

    // 2) 배경색 보간 (66.7vh→100vh 구간) - 메뉴가 열려있지 않을 때만
    if (!document.querySelector('nav.open')) {  // nav에 open 클래스가 없을 때만 실행
      let t = (vhScrolled - startScroll) / (endScroll - startScroll);
      t = Math.min(1, Math.max(0, t));
      const r = Math.round(startRGB.r + t * (endRGB.r - startRGB.r));
      const g = Math.round(startRGB.g + t * (endRGB.g - startRGB.g));
      const b = Math.round(startRGB.b + t * (endRGB.b - startRGB.b));
      bgEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
  });

  const riveInstance = new rive.Rive({
    src: '/images/riv/about-rolling.riv',                  
    canvas: document.getElementById('rolling'),
    autoplay: true,
    layout: new rive.Layout({
      fit: rive.Fit.cover,                     
      alignment: rive.Alignment.center         
    }),
    onLoad: () => riveInstance.resizeDrawingSurfaceToCanvas()
  });

})();

