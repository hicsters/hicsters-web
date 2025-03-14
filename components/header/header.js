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
            const isAboutPage = window.location.pathname.includes('about.html');

            if (!menuButton || !logo || !nav || !header) return;

            // 메뉴 버튼 초기화 (about 페이지 진입 시 menu-wt로 설정)
            if (isAboutPage) {
                menuButton.src = menuButton.src.replace("menu-bk", "menu-wt").replace("close-wt", "menu-wt");
            }

            // 메뉴 버튼 클릭 이벤트
            menuButton.addEventListener("click", function () {
                if (isAboutPage) {
                    // about 페이지에서는 menu-wt <-> close-wt 변경
                    if (menuButton.src.includes("menu-wt")) {
                        menuButton.src = menuButton.src.replace("menu-wt", "close-wt");
                    } else {
                        menuButton.src = menuButton.src.replace("close-wt", "menu-wt");
                    }
                } else {
                    // 다른 페이지에서는 menu-bk <-> close-wt 변경
                    if (menuButton.src.includes("menu-bk")) {
                        menuButton.src = menuButton.src.replace("menu-bk", "close-wt");
                    } else {
                        menuButton.src = menuButton.src.replace("close-wt", "menu-bk");
                    }
                }

                // 로고 색상 변경
                if (logo.src.includes("-bk")) {
                    logo.src = logo.src.replace("-bk", "-wt");
                } else {
                    logo.src = logo.src.replace("-wt", "-bk");
                }

                // 네비게이션 토글
                nav.classList.toggle("close");

                // 메뉴가 열릴 때 body 스크롤 방지
                body.style.overflow = nav.classList.contains("close") ? "auto" : "hidden";

                // contact.html, about.html에서 hideLogo 토글
                if (window.location.pathname.includes('contact.html') || isAboutPage) {
                    header.classList.toggle('hideLogo');
                }
            });

            // 초기 상태 설정 (about, contact 페이지라면 hideLogo 추가)
            if (window.location.pathname.includes('contact.html') || isAboutPage) {
                header.classList.add('hideLogo');
            }

            // ✅ 스크롤 이벤트 (about 페이지 전용)
            if (isAboutPage) {
                window.addEventListener("scroll", function () {
                    const isScrolled = window.scrollY >= window.innerHeight; // vh 이상 스크롤 여부

                    if (isScrolled) {
                        header.classList.remove("hideLogo");
                        menuButton.src = menuButton.src.replace("menu-wt", "menu-bk").replace("close-wt", "menu-bk");
                    } else {
                        header.classList.add("hideLogo");
                        menuButton.src = menuButton.src.replace("menu-bk", "menu-wt").replace("close-wt", "menu-wt");
                    }
                });
            }
        })
        .catch(error => {
            console.error("Header loading error:", error);
        });
});
