// main.js (헤더 로드 & 초기화 스크립트)
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // 페이지 타입에 따른 body 클래스 설정
        const path = location.pathname;
        const isHome = path === "/" || path.includes("index.html");
        const isAbout = path.includes('about.html');
        const isContact = path.includes('contact.html');
        const isContents = path.includes("contents");
        
        if (isAbout) {
            document.body.classList.add('about');
        } else if (isContact) {
            document.body.classList.add('contact');
        } else if (isContents) {
            const contentId = location.pathname.match(/contents-(\d+)\.html/)?.[1];
            if (contentId) {
                document.body.classList.add(`contents-${contentId}`);
            }
        }

        // contents-data.js 동적 로드 (아직 로드되지 않은 경우에만)
        if (!window.cardData && !document.querySelector('script[src="/scripts/contents-data.js"]')) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = '/scripts/contents-data.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        const response = await fetch("/components/header/header.html");
        const html = await response.text();
        
        const headerEl = document.getElementById("header");
        if (!headerEl) {
            console.error("헤더 요소를 찾을 수 없습니다.");
            return;
        }
        
        headerEl.innerHTML = html;
        
        // SVG 로더 실행 및 완료 대기
        await loadSvgElements(headerEl);
        
        // 약간의 지연을 주어 SVG 요소들이 완전히 로드되도록 함
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // SVG 로드 완료 후 요소 선택
        const header = document.querySelector("header");
        const nav = document.querySelector("nav");
        const logo = document.querySelector(".logo svg");
        const menuBtn = document.querySelector(".btn-menu");
        const menuBtnIcon = menuBtn.querySelector("svg");
        const body = document.body;

        // 요소가 모두 존재하는지 확인
        if (!header || !nav || !logo || !menuBtn || !menuBtnIcon) {
            console.error("필수 요소를 찾을 수 없습니다:", {
                header: !!header,
                nav: !!nav,
                logo: !!logo,
                menuBtn: !!menuBtn,
                menuBtnIcon: !!menuBtnIcon
            });
            return;
        }

        let isMenuOpen = false;
        let previousState = {};
        let scrollY = 0;
  
        const captureState = () => ({
            headerBg: header.classList.contains("bg"),
            headerShowLogo: header.classList.contains("show-logo"),
            logoWhite: document.querySelector(".logo").classList.contains("white"),
            menuWhite: menuBtn.classList.contains("white")
        });
  
        const restoreState = (state) => {
            header.classList.toggle("bg", state.headerBg);
            header.classList.toggle("show-logo", state.headerShowLogo);
            const logoContainer = document.querySelector(".logo");
            if (logoContainer) {
                logoContainer.classList.toggle("white", state.logoWhite);
            }
            menuBtn.classList.toggle("white", state.menuWhite);
        };
  
        const setLogo = (type) => {
            const logoContainer = document.querySelector(".logo");
            if (logoContainer) {
                logoContainer.classList.toggle("white", type === "white");
                logoContainer.classList.toggle("black", type === "black");
                logoContainer.classList.toggle("custom", type === "custom");
            }
        };
  
        const setMenuIcon = (type) => {
            menuBtn.classList.toggle("white", type === "white");
            menuBtn.classList.toggle("black", type === "black");
            menuBtn.classList.toggle("custom", type === "custom");
        };
  
        const applyAboutScrollState = () => {
            const scrolled = window.scrollY >= window.innerHeight * 1.5;  
            header.classList.toggle("bg", scrolled);
            header.classList.toggle("show-logo", scrolled);
        };
  
        const applyContentsScrollState = () => {
            const infoSection = document.querySelector("div.info");
            const infoHeight = infoSection ? infoSection.offsetHeight : 0;
            const threshold = window.innerHeight - (infoHeight + 64);
            const scrolled = window.scrollY >= threshold;
  
            // contents 페이지에서 cardData의 색상 가져오기
            if (window.cardData) {
                const contentId = location.pathname.match(/contents-(\d+)\.html/)?.[1];
                if (contentId && window.cardData[contentId]) {
                    const { bgColor, textColor } = window.cardData[contentId];
                    
                    if (scrolled) {
                        // 스크롤 시 CSS 변수 업데이트
                        document.documentElement.style.setProperty('--bg-color', bgColor);
                        document.documentElement.style.setProperty('--text-color', textColor);
                        header.classList.add("bg");
                    } else {
                        header.classList.remove("bg");
                    }
                }
            }
        };
  
        // 메뉴 버튼 핸들러
        menuBtn.addEventListener("click", async () => {
            isMenuOpen = !isMenuOpen;

            if (isMenuOpen) {
                scrollY = window.scrollY;
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                body.style.overflow = "hidden";
                body.style.paddingRight = `${scrollbarWidth}px`;
                body.style.position = "fixed";
                body.style.width = "100%";
                body.style.top = `-${scrollY}px`;

                // ARIA 상태 업데이트
                menuBtn.setAttribute('aria-expanded', 'true');
                nav.setAttribute('aria-hidden', 'false');

                // 현재 상태 저장
                previousState = captureState();
                
                // 먼저 클래스 변경
                header.classList.remove("bg");
                header.classList.add("show-logo");
                setLogo("white");
                setMenuIcon("white");
                
                // 메뉴 버튼 내부의 SVG 컨테이너 찾기
                const svgContainer = menuBtn.querySelector('[data-svg]');
                if (svgContainer) {
                    // data-svg 속성 변경
                    svgContainer.dataset.svg = "icons/icon-close";
                    // SVG 다시 로드
                    await loadSvgElements(menuBtn);
                    // 아이콘 변경 시 ARIA 레이블 업데이트
                    svgContainer.setAttribute('aria-label', '메뉴 닫기');
                }
                
                // 마지막으로 메뉴 표시
                nav.classList.add("open");
            } else {
                // ARIA 상태 업데이트
                menuBtn.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');

                // 먼저 메뉴 숨기기
                nav.classList.remove("open");
                
                // 메뉴 버튼 내부의 SVG 컨테이너 찾기
                const svgContainer = menuBtn.querySelector('[data-svg]');
                if (svgContainer) {
                    // data-svg 속성 변경
                    svgContainer.dataset.svg = "icons/icon-menu";
                    // SVG 다시 로드
                    await loadSvgElements(menuBtn);
                    // 아이콘 변경 시 ARIA 레이블 업데이트
                    svgContainer.setAttribute('aria-label', '메뉴 열기');
                }
                
                // 이전 상태로 복원
                restoreState(previousState);
                
                body.style.overflow = "";
                body.style.paddingRight = "";
                body.style.position = "";
                body.style.width = "";
                body.style.top = "";
                window.scrollTo(0, scrollY);
            }
        });
  
        if (isHome) {
            header.classList.remove("bg");
            header.classList.remove("show-logo");
            setMenuIcon("black");
            setLogo("black");
        } else if (isAbout) {
            header.classList.remove("show-logo");
            setMenuIcon("white");
            applyAboutScrollState();
            window.addEventListener("scroll", () => {
                if (!isMenuOpen) applyAboutScrollState();
            });
        } else if (isContact) {
            header.classList.remove("show-logo");
            setMenuIcon("black");
        } else if (isContents) {
            applyContentsScrollState();
            window.addEventListener("scroll", () => {
                if (!isMenuOpen) applyContentsScrollState();
            });
        } else {
            header.classList.add("bg");
            header.classList.add("show-logo");
            setMenuIcon("black");
            setLogo("black");
        }
  
        // ⭐️ Archive 카운트 업데이트 ⭐️
        // contents-data.js가 로드될 때까지 대기
        const updateArchiveCount = () => {
            if (window.cardData) {
                const count = Object.keys(window.cardData).length;
                const cntEl = nav.querySelector(".contents-num p");
                if (cntEl) {
                    cntEl.textContent = count;
                }
            } else {
                setTimeout(updateArchiveCount, 100);
            }
        };
        updateArchiveCount();
  
        // ⭐️ 랜덤 가챠 버튼 (아이콘 회전 후 랜덤 콘텐츠 이동) ⭐️
        const randomGacha = document.querySelector("#random-gacha");
        const gachaIcon = document.querySelector("#gacha-icon");
  
        if (randomGacha && gachaIcon && window.cardData) {
          randomGacha.addEventListener('click', (e) => {
            e.preventDefault();
            gachaIcon.classList.remove("spin");
            void gachaIcon.offsetWidth;
            gachaIcon.classList.add("spin");
  
            gachaIcon.addEventListener('transitionend', function handleAnimationEnd() {
              gachaIcon.removeEventListener('transitionend', handleAnimationEnd);
              const keys = Object.keys(window.cardData);
              const randomIdx = Math.floor(Math.random() * keys.length);
              const randomId = keys[randomIdx];
              window.location.href = `/contents/contents-${randomId}.html`;
            });
          });
        }
    } catch (err) {
        console.error("Header loading failed:", err);
    }
});
  