// main.js (헤더 로드 & 초기화 스크립트)
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // 페이지 타입에 따른 body 클래스 설정
        const path = location.pathname;
        // 경로 정규화: /about, /about.html, /about/ 모두 매칭
        const isHome = path === "/" || path === "/index.html" || path.includes("/index.html");
        const isAbout = /\/about(\/|\.html)?$/.test(path) || path.includes('/about');
        const isContact = /\/contact(\/|\.html)?$/.test(path) || path.includes('/contact');
        const isContents = path.includes("contents");
        
        if (isAbout) {
            document.body.classList.add('about');
        } else if (isContact) {
            document.body.classList.add('contact');
        } else if (isContents) {
            const contentId = location.pathname.match(/\/contents\/(\d+)$/)?.[1];
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
  
        // requestAnimationFrame을 사용한 스크롤 최적화
        let ticking = false;
        let lastScrollY = 0;
        // about.js와 일치: 100vh (100vh)에서 헤더 변경
        const scrollThreshold = window.innerHeight * 1.0; // 100vh

        const applyAboutScrollState = () => {
            const currentScrollY = window.scrollY;
            
            // 스크롤 위치가 threshold를 넘었는지 확인
            const scrolled = currentScrollY >= scrollThreshold;
            
            // 상태가 변경될 때만 클래스 토글
            const hasBg = header.classList.contains("bg");
            const hasShowLogo = header.classList.contains("show-logo");
            
            if (scrolled && (!hasBg || !hasShowLogo)) {
                header.classList.add("bg");
                header.classList.add("show-logo");
            } else if (!scrolled && (hasBg || hasShowLogo)) {
                header.classList.remove("bg");
                header.classList.remove("show-logo");
            }
            
            lastScrollY = currentScrollY;
        };

        // 스크롤 이벤트 디바운싱
        if (isAbout) {
            header.classList.remove("show-logo");
            setMenuIcon("white");
            applyAboutScrollState();
            
            let scrollTimeout;
            window.addEventListener("scroll", () => {
                if (isMenuOpen) return;
                
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (scrollTimeout) clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => {
                            applyAboutScrollState();
                            ticking = false;
                        }, 10);
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
  
        const applyContentsScrollState = () => {
            const infoSection = document.querySelector("div.info");
            const infoHeight = infoSection ? infoSection.offsetHeight : 0;
            const threshold = window.innerHeight - (infoHeight + 64);
            const scrolled = window.scrollY >= threshold;

            if (window.cardData) {
                // URL 패턴 수정
                const contentId = location.pathname.match(/\/contents\/(\d+)$/)?.[1];
                if (contentId && window.cardData[contentId]) {
                    const { bgColor, textColor } = window.cardData[contentId];
                    
                    if (scrolled) {
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
        menuBtn.addEventListener("click", () => {  // async 제거
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // 모든 UI 변경을 동시에 처리
                nav.classList.add("open");
                menuBtn.setAttribute('aria-expanded', 'true');
                nav.setAttribute('aria-hidden', 'false');
                
                const svgContainer = menuBtn.querySelector('[data-svg]');
                if (svgContainer) {
                    svgContainer.dataset.svg = "icons/icon-close";
                    svgContainer.setAttribute('aria-label', '메뉴 닫기');
                }

                // 스크롤 처리와 상태 변경
                scrollY = window.scrollY;
                body.style.position = "fixed";
                body.style.top = `-${scrollY}px`;
                body.style.width = "100%";
                body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;

                previousState = captureState();
                header.classList.remove("bg");
                header.classList.add("show-logo");
                setLogo("white");
                setMenuIcon("white");

                // SVG 로드는 백그라운드에서 처리
                loadSvgElements(menuBtn);
                
            } else {
                // 모든 UI 변경을 동시에 처리
                nav.classList.remove("open");
                menuBtn.setAttribute('aria-expanded', 'false');
                nav.setAttribute('aria-hidden', 'true');
                
                const svgContainer = menuBtn.querySelector('[data-svg]');
                if (svgContainer) {
                    svgContainer.dataset.svg = "icons/icon-menu";
                    svgContainer.setAttribute('aria-label', '메뉴 열기');
                }

                restoreState(previousState);
                
                body.style.position = "";
                body.style.top = "";
                body.style.width = "";
                body.style.paddingRight = "";
                window.scrollTo(0, scrollY);

                // SVG 로드는 백그라운드에서 처리
                loadSvgElements(menuBtn);
            }
        });
  
        if (isHome) {
            header.classList.remove("bg");
            header.classList.remove("show-logo");
            setMenuIcon("black");
            setLogo("black");
        } else if (isAbout) {
            // 초기 상태 설정 (이미 위에서 스크롤 이벤트 리스너가 등록됨)
            header.classList.remove("show-logo");
            setMenuIcon("white");
            applyAboutScrollState();
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
              // URL 패턴 수정
              window.location.href = `/contents/${randomId}`;
            });
          });
        }
    } catch (err) {
        console.error("Header loading failed:", err);
    }
});
