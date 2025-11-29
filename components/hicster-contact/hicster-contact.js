document.addEventListener("DOMContentLoaded", async () => {
    // 초기화 함수 정의
    async function initialize() {
        try {
            const container = document.getElementById('hicster-contact');
            if (!container) {
                console.log('Waiting for hicster-contact element...');
                return;
            }

            const res = await fetch('/components/hicster-contact/hicster-contact.html');
            const template = await res.text();
            container.innerHTML = template;

            // SVG 로더 실행
            await loadSvgElements(container);

            const contactData = {
                "hicster-01": {
                    name:  "고나",
                    intro: "레슨비 벌러 출근합니다",
                    email: "hurungkk@naver.com",
                    image: "/images/profiles/img-profile-01.avif"
                },
                "hicster-02": {
                    name:  "김금진",
                    intro: "뭐든 잘할거야. 근데 뭘해야하지?",
                    email: "jinnn1122@naver.com",
                    image: "/images/profiles/img-profile-02.avif"
                },
                "hicster-03": {
                    name:  "김씨",
                    intro: "시트콤같은 인생을 살아가는 김씨",
                    email: "sh2553@naver.com",
                    image: "/images/profiles/img-profile-03.avif"
                },
                "hicster-04": {
                    name:  "김윤희",
                    intro: "김윤희의 간단한 소개",
                    email: "3948872@gmail.com",
                    image: "/images/profiles/img-profile-04.avif"
                },
                "hicster-05": {
                    name:  "노나",
                    intro: "카페인, 고양이, 부대찌개",
                    email: "tladhgks@gmail.com",
                    image: "/images/profiles/img-profile-05.avif"
                },
                "hicster-06": {
                    name:  "도나",
                    intro: "호기심 과잉 맥시멀리스트",
                    email: "sehyeon94@gmail.com",
                    image: "/images/profiles/img-profile-06.avif"
                },
                "hicster-07": {
                    name:  "라근",
                    intro: "나의 하늘을 보아",
                    email: "ragnn96@gmail.com",
                    image: "/images/profiles/img-profile-07.avif"
                },
                "hicster-08": {
                    name:  "세세",
                    intro: "글쓰기가 힘든 카피라이터",
                    email: "seed611@daum.net",
                    image: "/images/profiles/img-profile-08.avif"
                },
                "hicster-09": {
                    name:  "채다정",
                    intro: "침대 위 부스러기 모음",
                    email: "chae_da@naver.com",
                    image: "/images/profiles/img-profile-09.avif"
                }
            };

            let key = container.getAttribute('data-id');
            
            if (!key) {
                const match = window.location.pathname.match(/\/contents\/contents-(\d{6}|\d{3})\.html$/);
                console.log('URL match:', match); // URL 매칭 결과 확인
                
                if (match && window.cardData) {
                    const id = match[1];
                    console.log('Content ID:', id); // 추출된 ID 확인
                    console.log('Card Data:', window.cardData); // 전체 카드 데이터 확인
                    console.log('Current Card:', window.cardData[id]); // 현재 카드 데이터 확인
                    
                    const writer = window.cardData[id]?.writer;
                    console.log('Writer:', writer); // 작성자 정보 확인
                    
                    const foundKey = Object.entries(contactData).find(([k, v]) => {
                        console.log('Checking:', k, v.name, 'against writer:', writer);
                        return v.name === writer;
                    })?.[0];
                    console.log('Found hicster key:', foundKey); // 찾은 키 확인
                    
                    if (foundKey) key = foundKey;
                }
            }

            if (key && contactData[key]) {
                const data = contactData[key];
                
                // DOM 요소들을 한 번에 선택
                const elements = {
                    name: container.querySelector('.hicster-name p'),
                    intro: container.querySelector('.hicster-copy p'),
                    email: container.querySelector('.contact-btn a'),
                    image: container.querySelector('.profile image')
                };

                // 데이터 주입
                if (elements.name) elements.name.textContent = data.name;
                if (elements.intro) elements.intro.textContent = data.intro;
                if (elements.email) elements.email.href = `mailto:${data.email}`;
                if (elements.image) elements.image.setAttribute('href', data.image);
            }

        } catch (err) {
            console.error('작성자 정보 로드 실패:', err);
        }
    }

    // 첫 번째 시도
    await initialize();

    // DOM이 완전히 로드되지 않았을 경우를 위한 재시도
    if (!document.getElementById('hicster-contact')) {
        setTimeout(initialize, 500);
    }
});
