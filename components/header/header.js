// main.js (헤더 로드 & 초기화 스크립트)
document.addEventListener("DOMContentLoaded", function () {
    fetch("/components/header/header.html")
      .then(res => res.text())
      .then(html => {
        document.getElementById("header").innerHTML = html;
  
        const header     = document.querySelector("header");
        const nav        = document.querySelector("nav");
        const logo       = document.querySelector(".logo img");
        const menuBtn    = document.querySelector(".btn-menu img");
        const body       = document.body;
  
        const path = location.pathname;
        const isHome     = path === "/" || path.includes("index.html");
        const isAbout    = path.includes("about.html");
        const isContact  = path.includes("contact.html");
        const isContents = path.includes("contents");
  
        let isMenuOpen    = false;
        let previousState = {};
        let scrollY       = 0;
  
        const captureState = () => ({
          logoSrc: logo.src,
          menuSrc: menuBtn.src,
          headerBg: header.classList.contains("bg"),
          headerHide: header.classList.contains("hideLogo")
        });
  
        const restoreState = (state) => {
          logo.src = state.logoSrc;
          menuBtn.src = state.menuSrc;
          header.classList.toggle("bg", state.headerBg);
          header.classList.toggle("hideLogo", state.headerHide);
        };
  
        const setLogo = (type) => {
          logo.src = `/images/logo/logo-type-${type}.svg`;
        };
  
        const setMenuIcon = (type) => {
          menuBtn.src = `/images/icons/icon-${type}.svg`;
        };
  
        const applyAboutScrollState = () => {
          const scrolled = window.scrollY >= window.innerHeight;
          header.classList.toggle("bg", scrolled);
          header.classList.toggle("hideLogo", !scrolled);
          setMenuIcon(scrolled ? "menu-bk" : "menu-wt");
        };
  
        const applyContentsScrollState = () => {
          const infoSection = document.querySelector("div.info");
          const infoHeight  = infoSection ? infoSection.offsetHeight : 0;
          const threshold   = window.innerHeight - (infoHeight + 64);
          const scrolled    = window.scrollY >= threshold;
  
          header.classList.toggle("bg", scrolled);
          setLogo(scrolled ? "bk" : "wt");
          setMenuIcon(scrolled ? "menu-bk" : "menu-wt");
        };
  
        // 메뉴 버튼 핸들러
        menuBtn.addEventListener("click", () => {
          isMenuOpen = !isMenuOpen;
          nav.classList.toggle("open", isMenuOpen);
  
          if (isMenuOpen) {
            scrollY = window.scrollY;
            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
  
            previousState = captureState();
            setLogo("wt");
            setMenuIcon("close-wt");
            header.classList.remove("bg", "hideLogo");
          } else {
            body.style.position = "";
            body.style.top = "";
            window.scrollTo(0, scrollY);
            restoreState(previousState);
          }
        });
  
        if (isHome) {
          header.classList.remove("bg");
          header.classList.remove("hideLogo");
          setMenuIcon("menu-bk");
          setLogo("bk");
        } else if (isAbout) {
          header.classList.add("hideLogo");
          setMenuIcon("menu-wt");
          applyAboutScrollState();
          window.addEventListener("scroll", () => {
            if (!isMenuOpen) applyAboutScrollState();
          });
        } else if (isContact) {
          header.classList.add("hideLogo");
          setMenuIcon("menu-bk");
        } else if (isContents) {
          applyContentsScrollState();
          window.addEventListener("scroll", () => {
            if (!isMenuOpen) applyContentsScrollState();
          });
        } else {
          header.classList.add("bg");
          header.classList.remove("hideLogo");
          setMenuIcon("menu-bk");
          setLogo("bk");
        }
  
        // ⭐️ Archive 카운트 업데이트 ⭐️
        // contents-data.js에 정의된 전체 카드 수를 가져와서 .contents-num p에 삽입
        if (window.cardData) {
          const count = Object.keys(window.cardData).length;
          const cntEl = document.querySelector(".contents-num p");
          if (cntEl) cntEl.textContent = count;
        }
  
        // ⭐️ 랜덤 가챠 버튼 (아이콘 회전 후 랜덤 콘텐츠 이동) ⭐️
        const randomGacha = document.querySelector("#random-gacha");
        const gachaIcon   = document.querySelector("#gacha-icon");
  
        if (randomGacha && gachaIcon && window.cardData) {
          randomGacha.addEventListener('click', (e) => {
            e.preventDefault();
            gachaIcon.classList.remove("spin");
            void gachaIcon.offsetWidth;
            gachaIcon.classList.add("spin");
  
            gachaIcon.addEventListener('transitionend', function handleAnimationEnd() {
              gachaIcon.removeEventListener('transitionend', handleAnimationEnd);
              const keys      = Object.keys(window.cardData);
              const randomIdx = Math.floor(Math.random() * keys.length);
              const randomId  = keys[randomIdx];
              window.location.href = `/contents/contents-${randomId}.html`;
            });
          });
        }
      })
      .catch(err => console.error("Header loading failed:", err));
  });
  