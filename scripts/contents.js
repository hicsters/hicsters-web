// main.js (or contents.js – 동일 스크립트 한 파일로 사용 가능)
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  // — Font Toggle —
  const fontWrapper = document.querySelector('div.font.value');
  if (fontWrapper) {
    const fontLabel = fontWrapper.querySelector('.font-type');
    const currentFontFamily = getComputedStyle(root)
      .getPropertyValue('--font-family')
      .replace(/['"]/g, '').trim();

    if (currentFontFamily === 'Maruburi, serif') {
      fontLabel.textContent = 'Serif';
      fontWrapper.classList.add('on');
    } else {
      fontLabel.textContent = 'San-Serif';
      fontWrapper.classList.remove('on');
    }

    fontWrapper.addEventListener('click', () => {
      const isOn = fontWrapper.classList.toggle('on');
      fontLabel.textContent = isOn ? 'Serif' : 'San-Serif';
      root.style.setProperty(
        '--font-family',
        isOn
          ? "'Maruburi', serif"
          : "'Pretendard Variable', sans-serif"
      );
    });
  }

  // — Scroll Progress UI —
  const scrollBar   = document.querySelector('.scroll-bar');
  const scrollTrack = document.querySelector('.scroll-track');
  const infoSection = document.querySelector('div.info');
  if (scrollBar && scrollTrack) {
    const updateScrollUI = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      const percent   = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      scrollBar.style.width = `${percent}%`;

      const infoHeight = infoSection ? infoSection.offsetHeight : 0;
      const threshold = winHeight - (infoHeight + 64);
      scrollTrack.style.display = scrollTop >= threshold ? 'block' : 'none';
    };
    window.addEventListener('scroll', updateScrollUI);
    updateScrollUI();
  }

  // — Content Page Data Injection & Style —
  const pathMatch = window.location.pathname.match(/\/contents\/contents-(\d{6}|\d{3})\.html$/);
  if (pathMatch && window.cardData) {
    const id   = pathMatch[1];
    const data = window.cardData[id];
    if (data) {
      // a) CSS 변수로 배경색 & 텍스트 색상 & 폰트 패밀리 설정
      if (data.bgColor)    root.style.setProperty('--bg-color', data.bgColor);
      if (data.textColor)  root.style.setProperty('--text-color', data.textColor);
      if (data.fontFamily) root.style.setProperty('--font-family', data.fontFamily);

      // b) 문서 제목 설정
      document.title = `Hicsters: ${data.title}`;

      // c) 썸네일 설정
      const thumbEl = document.querySelector('.thumb');
      if (thumbEl) thumbEl.style.backgroundImage = `url("/images/thumb/thumb-${id}.png")`;

      // d) 텍스트 맵핑 및 주입
      const mappings = {
        '.quote':           data.quote,
        '.contents-title>p':     data.title,
        '.writer.value':    data.writer,
        '.theme.value':     data.theme,
        '.format.value':    data.format,
        '.date.value':      data.date,
        '.font-type':       data.fontType
      };
      Object.entries(mappings).forEach(([selector, text]) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
      });

      // e) Info-section 폰트 토글 UI 반영
      const contentFontWrapper = document.querySelector('li.info-value .font.value');
      const contentFontLabel   = contentFontWrapper?.querySelector('.font-type');
      if (contentFontWrapper && contentFontLabel) {
        const ff = data.fontFamily || '';
        const isSerif = ff.includes('serif');
        contentFontLabel.textContent = isSerif ? 'Serif' : 'San-Serif';
        contentFontWrapper.classList.toggle('on', isSerif);
      }

      // 시리즈 드롭다운 초기화 (Refactored)
      console.log('🚀 Initializing dropdown for content:', id);
      const dropdown = document.getElementById('customDropdown');
      console.log('📍 Found dropdown element:', dropdown);
      
      if (dropdown) {
        // Remove any existing event listeners
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
        
        const toggle = newDropdown.querySelector('.dropdown-toggle');
        const optionsContainer = newDropdown.querySelector('.dropdown-options');
        console.log('🔍 Toggle element:', toggle);
        console.log('🔍 Options container:', optionsContainer);
        
        // Set current number
        const seriesPrefix = id.substring(0, 3);
        const currentNumber = id.substring(4, 6);
        if (toggle) {
          toggle.textContent = currentNumber;
          console.log('✏️ Set toggle text to:', currentNumber);
          
          // Add toggle click event
          toggle.addEventListener('click', (e) => {
            console.log('🖱️ Toggle clicked');
            e.stopPropagation();
            const isOpen = newDropdown.classList.toggle('open');
            console.log('🔓 Dropdown is now:', isOpen ? 'open' : 'closed');
          });
        }
        
        // Generate options
        if (optionsContainer) {
          optionsContainer.innerHTML = '';
          const seriesPages = Object.keys(window.cardData)
            .filter(pageId => pageId.startsWith(seriesPrefix))
            .sort();
          
          seriesPages.forEach(pageId => {
            const pageNumber = pageId.substring(4, 6);
            const option = document.createElement('div');
            option.textContent = pageNumber;
            option.setAttribute('data-url', `/contents/contents-${pageId}.html`);
            optionsContainer.appendChild(option);
            
            // Add click event to option
            option.addEventListener('click', (e) => {
              e.stopPropagation();
              const targetUrl = option.getAttribute('data-url');
              if (targetUrl && pageId !== id) {
                window.location.href = targetUrl;
              }
              newDropdown.classList.remove('open');
            });
          });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!newDropdown.contains(e.target)) {
            newDropdown.classList.remove('open');
          }
        });
      }
    }
  }
});
