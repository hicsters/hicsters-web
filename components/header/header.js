document.addEventListener("DOMContentLoaded", function () {
    // header load
    fetch('components/header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // 요소 가져오기
            const menuButton = document.querySelector(".btn-menu img");
            const logo = document.querySelector(".logo img");
            const nav = document.querySelector("nav");
            const body = document.querySelector("body");
            const header = document.querySelector("header");

            // 페이지 구분: 어바웃 페이지와 콘택트 페이지 확인
            const isAboutPage = window.location.pathname.includes('about.html');
            const isContactPage = window.location.pathname.includes('contact.html');

            if (!menuButton || !logo || !nav || !header) return;

            // 메뉴 버튼 초기화 (about 페이지 진입 시 menu-wt로 설정)
            if (isAboutPage) {
                menuButton.src = menuButton.src.replace("menu-bk", "menu-wt");
            }

            const updateHeaderBg = () => {
                const isScrolled = window.scrollY >= window.innerHeight;
                if (isScrolled) {
                    header.classList.add("bg");
                    header.classList.remove("hideLogo");
                    menuButton.src = menuButton.src.replace("menu-wt", "menu-bk");
                } else {
                    header.classList.remove("bg");
                    header.classList.add("hideLogo");
                    menuButton.src = menuButton.src.replace("menu-bk", "menu-wt");
                }
            };

            // 공통 메뉴 버튼 클릭 이벤트
            menuButton.addEventListener("click", function () {
                // 로고 색상 변경
                logo.src = logo.src.includes("-bk")
                    ? logo.src.replace("-bk", "-wt")
                    : logo.src.replace("-wt", "-bk");

                // 네비게이션 토글
                nav.classList.toggle("close");

                // 메뉴가 열릴 때 body 스크롤 방지
                body.style.overflow = nav.classList.contains("close") ? "auto" : "hidden";

                // contact.html, about.html에서 hideLogo 토글
                if (isContactPage) {
                    header.classList.toggle('hideLogo');
                }

                if (isAboutPage) {
                    header.classList.toggle("bg");
                    const isScrolled = window.scrollY >= window.innerHeight;
                    if (isScrolled) { 
                        menuButton.src = menuButton.src.replace("menu-wt", "menu-bk");
                    } else {
                        header.classList.toggle("bg");
                        header.classList.toggle("hideLogo");
                        menuButton.src = menuButton.src.replace("menu-bk", "menu-wt");
                    }

                    if (menuButton.src.includes("menu-bk")) {
                        menuButton.src = menuButton.src.replace("menu-bk", "close-wt");
                    } else if (menuButton.src.includes("menu-wt")) {
                        menuButton.src = menuButton.src.replace("menu-wt", "close-wt");
                    } else if (menuButton.src.includes("close-wt")) {
                        menuButton.src = menuButton.src.replace("close-wt", "menu-bk");
                    }

                    // 메뉴 닫을 때 스크롤 위치 확인하여 상태 업데이트
                    if (nav.classList.contains("close")) {
                        updateHeaderBg();
                    }
                } else {
                    // menu-bk와 close-wt 토글 추가
                    if (menuButton.src.includes("menu-bk")) {
                        menuButton.src = menuButton.src.replace("menu-bk", "close-wt");
                    } else if (menuButton.src.includes("menu-wt")) {
                        menuButton.src = menuButton.src.replace("menu-wt", "close-wt");
                    } else if (menuButton.src.includes("close-wt")) {
                        menuButton.src = menuButton.src.replace("close-wt", "menu-bk");
                    }
                }

            });

            // 초기 상태 설정 (about, contact 페이지라면 hideLogo 추가)
            if (isContactPage || isAboutPage) {
                header.classList.add('hideLogo');
            }

            // ✅ 스크롤 이벤트 (about 페이지 전용)
            if (isAboutPage) {
                window.addEventListener("scroll", updateHeaderBg);
            }
        })
        .catch(error => {
            console.error("Header loading error:", error);
        });
});
