if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });