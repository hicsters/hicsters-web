document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res       = await fetch('/components/hicster-contact/hicster-contact.html');
        const template  = await res.text();
        const container = document.getElementById('hicster-contact');
        if (!container) throw new Error('#hicster-contact 엘리먼트를 찾을 수 없습니다.');
        container.innerHTML = template;

        // SVG 로더 실행
        await loadSvgElements(container);

        const contactData = {
            "hicster-01": {
                name:  "고나",
                intro: "고나의 간단한 소개",
                email: "hurungkk@naver.com",
                image: "/images/profiles/img-profile-01.png"
            },
            "hicster-02": {
                name:  "김금진",
                intro: "김금진의 간단한 소개",
                email: "jinnn1122@naver.com",
                image: "/images/profiles/img-profile-02.png"
            },
            "hicster-03": {
                name:  "김씨",
                intro: "김씨의 간단한 소개",
                email: "sh2553@naver.com",
                image: "/images/profiles/img-profile-03.png"
            },
            "hicster-04": {
                name:  "김윤희",
                intro: "김윤희의 간단한 소개",
                email: "3948872@gmail.com",
                image: "/images/profiles/img-profile-04.png"
            },
            "hicster-05": {
                name:  "노나",
                intro: "노나의 간단한 소개",
                email: "tladhgks@gmail.com",
                image: "/images/profiles/img-profile-05.png"
            },
            "hicster-06": {
                name:  "도나",
                intro: "도나의 간단한 소개",
                email: "sehyeon94@gmail.com",
                image: "/images/profiles/img-profile-06.png"
            },
            "hicster-07": {
                name:  "라근",
                intro: "라근의 간단한 소개",
                email: "ragnn96@gmail.com",
                image: "/images/profiles/img-profile-07.png"
            },
            "hicster-08": {
                name:  "세세",
                intro: "세세의 간단한 소개",
                email: "seed611@daum.net",
                image: "/images/profiles/img-profile-08.png"
            },
            "hicster-09": {
                name:  "채다정",
                intro: "채다정의 간단한 소개",
                email: "chae_da@naver.com",
                image: "/images/profiles/img-profile-09.png"
            }
        };

        let key = Object.keys(contactData)[0];
        const override = container.dataset.id;
        if (override && contactData[override]) {
            key = override;
        } else {
            const match = window.location.pathname.match(/\/contents\/contents-(\d{3})\.html$/);
            if (match && window.cardData) {
                const id     = match[1];
                const writer = window.cardData[id]?.writer;
                const foundKey = Object.keys(contactData).find(k => contactData[k].name === writer);
                if (foundKey) key = foundKey;
            }
        }
        const data = contactData[key];

        // ④ 템플릿 내 요소에 데이터 주입
        const nameEl  = container.querySelector('.hicster-name p');
        const introEl = container.querySelector('.hicster-copy p');
        const linkEl  = container.querySelector('.contact-btn a');
        const imgEl   = container.querySelector('.profile image');
        const mailIconEl = container.querySelector('[data-svg="icons/icon-mail"]');

        if (nameEl)  {
            nameEl.textContent = data.name;
            nameEl.setAttribute('aria-label', `작성자 이름: ${data.name}`);
        }
        if (introEl) {
            introEl.textContent = data.intro;
            introEl.setAttribute('aria-label', `작성자 소개: ${data.intro}`);
        }
        if (linkEl) {
            linkEl.setAttribute('aria-label', `${data.name}에게 이메일 보내기`);
            // 메일 버튼 클릭 시 페이지 스크롤 방지 및 메일 클라이언트 열기
            linkEl.addEventListener('click', e => {
                e.preventDefault();
                window.open(`mailto:${data.email}`);
            });
        }
        if (imgEl) {
            imgEl.setAttribute('href', data.image);
            imgEl.setAttribute('aria-label', `${data.name}의 프로필 이미지`);
        }
        if (mailIconEl) {
            mailIconEl.setAttribute('role', 'img');
            mailIconEl.setAttribute('aria-label', '이메일 아이콘');
        }
    } catch (err) {
        console.error('hicster-contact 로딩 에러:', err);
    }
});
