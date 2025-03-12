document.addEventListener("DOMContentLoaded", function () {
    // header load
    fetch('components/header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // header에서 menu 버튼과 로고 이미지 이벤트 리스너 추가
            const menuButton = document.querySelector(".btn-menu img");
            const logo = document.querySelector(".logo img");
            const nav = document.querySelector("nav"); 
            const body = document.querySelector("body"); // body 요소 추가

            if (menuButton && logo && nav) { // nav.menu가 있는지 확인
                menuButton.addEventListener("click", function () {
                    // 메뉴 아이콘 색상 변경
                    if (menuButton.src.includes("menu-bk")) {
                        menuButton.src = menuButton.src.replace("menu-bk", "close-wt");
                    } else {
                        menuButton.src = menuButton.src.replace("close-wt", "menu-bk");
                    }

                    if (logo.src.includes("-bk")) {
                        logo.src = logo.src.replace("-bk", "-wt");
                    } else {
                        logo.src = logo.src.replace("-wt", "-bk");
                    }

                    // nav 토글
                    nav.classList.toggle("close"); 

                    // 메뉴가 열릴 때 body에 스크롤 비활성화
                    if (nav.classList.contains("close")) {
                        body.style.overflow = "auto"; // 스크롤 비활성화
                    } else {
                        body.style.overflow = "hidden"; // 스크롤 활성화
                    }

                    // 만약 현재 페이지가 contact.html일 때만 hideLogo 클래스 토글
                    if (window.location.pathname.includes('contact.html')) {
                        const header = document.querySelector('header');
                        if (header) {
                            header.classList.toggle('hideLogo');
                        }
                    }
                });
            }

            // 만약 현재 페이지가 contact.html이라면 header에 .hideLogo 클래스 추가
            if (window.location.pathname.includes('contact.html')) {
                const header = document.querySelector('header');
                if (header) {
                    header.classList.add('hideLogo');
                }
            }

        })
        .catch(error => {
            console.error("Header loading error:", error);
        });
});
