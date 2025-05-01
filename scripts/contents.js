document.addEventListener("DOMContentLoaded", function () {
  // — Dropdown & Font Toggle —
  const dropdown    = document.getElementById('customDropdown');
  const toggle      = dropdown.querySelector('.dropdown-toggle');
  const options     = dropdown.querySelectorAll('.dropdown-options div');

  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const selectedText = option.textContent;
      const targetUrl    = option.getAttribute('data-url');
      toggle.textContent = selectedText;
      dropdown.classList.remove('open');
      if (targetUrl) window.location.href = targetUrl;
    });
  });

  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  const fontWrapper = document.querySelector('div.font.value');
  const fontLabel   = fontWrapper.querySelector('.font-type');
  const root        = document.documentElement;

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

  const scrollBar   = document.querySelector('.scroll-bar');
  const scrollTrack = document.querySelector('.scroll-track');
  const infoSection = document.querySelector('div.info');

  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;

    const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    scrollBar.style.width = `${percent}%`;

    const infoHeight = infoSection ? infoSection.offsetHeight : 0;
    const threshold = infoHeight - 64;
    if (scrollTop > threshold) {
      scrollTrack.style.display = 'block';
    } else {
      scrollTrack.style.display = 'none';
    }
  };

  window.addEventListener('scroll', updateScrollUI);
  updateScrollUI(); 
});
