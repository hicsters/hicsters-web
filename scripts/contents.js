// main.js (or contents.js – 동일 스크립트 한 파일로 사용)
// 작가 정보 매핑 객체 추가
const writerToHicsterId = {
    '고나': 'hicster-01',
    '김금진': 'hicster-02',
    '김씨': 'hicster-03',
    '김윤희': 'hicster-04',
    '노나': 'hicster-05',
    '도나': 'hicster-06',
    '라근': 'hicster-07',
    '세세': 'hicster-08',
    '채다정': 'hicster-09'
};

// 메타태그 동적 업데이트 함수
function updateMetaTags(data, id) {
    const baseUrl = 'https://hicsters.com';
    const currentUrl = `${baseUrl}/contents/${id}`;
    const description = `${data.writer}: ${data.title}`;
    const imageUrl = `${baseUrl}/images/thumb/thumb-${id}.avif`;
    
    // 기존 메타태그 업데이트 또는 새로 생성
    const metaTags = {
        'description': { name: 'description', content: description },
        'og:title': { property: 'og:title', content: `Hicsters: ${data.title}` },
        'og:description': { property: 'og:description', content: description },
        'og:url': { property: 'og:url', content: currentUrl },
        'og:image': { property: 'og:image', content: imageUrl },
        'og:image:alt': { property: 'og:image:alt', content: `${data.title} 썸네일` },
        'twitter:title': { name: 'twitter:title', content: `Hicsters: ${data.title}` },
        'twitter:description': { name: 'twitter:description', content: description },
        'twitter:image': { name: 'twitter:image', content: imageUrl }
    };
    
    Object.entries(metaTags).forEach(([key, tag]) => {
        let element;
        
        if (tag.name) {
            element = document.querySelector(`meta[name="${tag.name}"]`);
        } else if (tag.property) {
            element = document.querySelector(`meta[property="${tag.property}"]`);
        }
        
        if (element) {
            element.setAttribute('content', tag.content);
        } else {
            // 메타태그가 없으면 새로 생성
            const newElement = document.createElement('meta');
            if (tag.name) {
                newElement.setAttribute('name', tag.name);
            } else if (tag.property) {
                newElement.setAttribute('property', tag.property);
            }
            newElement.setAttribute('content', tag.content);
            document.head.appendChild(newElement);
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const root = document.documentElement;
    console.log('🚀 Starting page load');

    function setInfoHeightVar(){
        const infoEl = document.querySelector('div.info');
        if (infoEl){
            const h = infoEl.offsetHeight;
            root.style.setProperty('--info-height', h + 'px');
        }
    }

    const pathMatch = window.location.pathname.match(/\/contents\/(\d+)$/);
    if (!pathMatch || !window.cardData) {
        console.error('❌ Invalid URL or missing cardData');
        return;
    }

    const id = pathMatch[1];
    const data = window.cardData[id];
    
    try {
        // 1. 콘텐츠 로드
        const contentRes = await fetch(`/contents/bodies/${id}.html`);
        if (!contentRes.ok) throw new Error('콘텐츠 로드 실패');
        
        // 2. 데이터 주입
        if (data) {
            // CSS 변수 설정
            if (data.bgColor)    root.style.setProperty('--bg-color', data.bgColor);
            if (data.textColor)  root.style.setProperty('--text-color', data.textColor);
            if (data.fontFamily) root.style.setProperty('--font-family', data.fontFamily);

            document.title = `Hicsters: ${data.title}`;

            // 메타태그 동적 업데이트
            updateMetaTags(data, id);

            // 시리즈 정보 처리
            const seriesNumEl = document.querySelector('li.series-num');
            if (seriesNumEl && data.type === 'series') {
                // 현재 시리즈 번호 설정 (001 -> 01 형식으로 변환)
                const currentNumber = id.substring(3).replace(/^0+/, '').padStart(2, '0');
                const seriesPrefix = id.substring(0, 3);
                
                // 드롭다운 옵션 생성
                const optionsContainer = document.querySelector('.dropdown-options');
                if (optionsContainer) {
                    optionsContainer.innerHTML = '';
                    const seriesPages = Object.keys(window.cardData)
                        .filter(pageId => pageId.startsWith(seriesPrefix))
                        .sort();
                    
                    seriesPages.forEach(pageId => {
                        const pageNumber = pageId.substring(3).replace(/^0+/, '').padStart(2, '0');
                        const option = document.createElement('div');
                        option.textContent = pageNumber;
                        option.setAttribute('data-url', `/contents/${pageId}`);
                        
                        // 현재 페이지와 일치하는 옵션에 data-current 속성 추가
                        if (pageId === id) {
                            option.setAttribute('data-current', 'true');
                        }
                        
                        optionsContainer.appendChild(option);
                        
                        // 클릭 이벤트 추가
                        option.addEventListener('click', () => {
                            window.location.href = `/contents/${pageId}`;
                        });
                    });
                }

                // 드롭다운 토글 버튼 텍스트 설정
                const toggle = document.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.textContent = currentNumber;
                }
            } else if (seriesNumEl) {
                seriesNumEl.remove();
            }

            // 데이터 매핑
            const mappings = {
                '.contents-title>p': data.title,
                '.writer.value':    data.writer,
                '.theme.value':     data.theme,
                '.format.value':    data.format,
                '.date.value':      data.date,
                '.font-type':       data.fontType
            };

            Object.entries(mappings).forEach(([selector, text]) => {
                const el = document.querySelector(selector);
                if (el) el.textContent = text;
            });
        }

        // 3. 썸네일 설정
        const thumbEl = document.querySelector('.thumb');
        if (thumbEl) {
            thumbEl.style.backgroundImage = `url("/images/thumb/thumb-${id}.avif")`;
        }

        // 4. 콘텐츠 주입
        const bodyContainer = document.querySelector('.body');
        if (bodyContainer) {
            // hicster-contact div 임시 저장
            const contactDiv = bodyContainer.querySelector('#hicster-contact');
            
            // 콘텐츠 주입
            bodyContainer.innerHTML = await contentRes.text();

            // (제거됨) Notion 텍스트 자동 변환 로직

            // (유지) 동적으로 삽입된 콘텐츠에 대해 SVG 로더 실행
            if (typeof loadSvgElements === 'function') {
                loadSvgElements(bodyContainer);
            }

            // hicster-contact div 다시 추가
            if (contactDiv) {
                bodyContainer.appendChild(contactDiv);
            }
            
            // 작가 정보 자동 설정
            const contentData = window.cardData[id];
            if (contentData) {
                const writerContact = document.getElementById('hicster-contact');
                if (writerContact) {
                    const hicsterId = writerToHicsterId[contentData.writer];
                    if (hicsterId) {
                        writerContact.setAttribute('data-id', hicsterId);
                        console.log('✅ Writer contact set:', contentData.writer, '->', hicsterId);
                    } else {
                        console.warn('⚠️ No hicster ID found for writer:', contentData.writer);
                    }
                }
            }
        }

        // info 높이 변수 설정 (주입 후 계산)
        setInfoHeightVar();
        window.addEventListener('resize', setInfoHeightVar);

        // 5. 시리즈 드롭다운 초기화
        console.log('🚀 Initializing dropdown for content:', id);
        const dropdown = document.getElementById('customDropdown');
        
        if (dropdown) {
            // 이벤트 리스너 초기화를 위한 엘리먼트 복제
            const newDropdown = dropdown.cloneNode(true);
            dropdown.parentNode.replaceChild(newDropdown, dropdown);
            
            const toggle = newDropdown.querySelector('.dropdown-toggle');
            const optionsContainer = newDropdown.querySelector('.dropdown-options');
            
            // 현재 시리즈 번호 설정
            const seriesPrefix = id.substring(0, 3);
            const currentNumber = id.substring(3).replace(/^0+/, '');  // 앞의 0 제거
            
            if (toggle) {
                toggle.textContent = currentNumber.padStart(2, '0');  // 2자리로 패딩
                
                // 토글 클릭 이벤트
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newDropdown.classList.toggle('open');
                });
            }
            
            // 드롭다운 옵션 생성
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
                const seriesPages = Object.keys(window.cardData)
                    .filter(pageId => pageId.startsWith(seriesPrefix))
                    .sort();
                
                seriesPages.forEach(pageId => {
                    const pageNumber = pageId.substring(3).replace(/^0+/, '');  // 앞의 0 제거
                    const option = document.createElement('div');
                    option.textContent = pageNumber.padStart(2, '0');  // 2자리로 패딩
                    option.setAttribute('data-url', `/contents/${pageId}`);
                    optionsContainer.appendChild(option);
                    
                    // 옵션 클릭 이벤트
                    option.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const targetUrl = option.getAttribute('data-url');
                        if (targetUrl && pageId !== id) {
                            window.location.href = targetUrl;
                        }
                        newDropdown.classList.remove('open');
                    });
                });
            }

            // 외부 클릭시 드롭다운 닫기
            document.addEventListener('click', (e) => {
                if (!newDropdown.contains(e.target)) {
                    newDropdown.classList.remove('open');
                }
            });
        }

        // 6. 폰트 토글 설정
        const fontWrapper = document.querySelector('div.font.value');
        if (fontWrapper && data) {
            const fontLabel = fontWrapper.querySelector('.font-type');
            const titleText = document.querySelector('.info .contents-title p');
            const infoTexts = document.querySelectorAll('li.info-value p');
            
            // contents-data의 초기값 사용 (명시적으로 serif인 경우만 true)
            const isSerif = data.fontFamily && data.fontFamily.includes('serif');
            
            // 초기 상태 설정 - Sans-serif가 기본값
            fontLabel.textContent = isSerif ? 'Serif' : 'San-Serif';
            if (isSerif) {
                fontWrapper.classList.add('on');
                // 초기 serif일 때 텍스트 굵기 설정
                if (titleText) titleText.style.fontWeight = '800';
                infoTexts.forEach(text => text.style.fontWeight = '800');
            } else {
                fontWrapper.classList.remove('on');
                // 초기 sans-serif일 때 텍스트 굵기 설정
                if (titleText) titleText.style.fontWeight = '600';
                infoTexts.forEach(text => text.style.fontWeight = '600');
            }
            
            // 초기 폰트 설정 (데이터에서 지정된 값 사용)
            root.style.setProperty('--font-family', data.fontFamily || "'Pretendard Variable', sans-serif");

            // 클릭 이벤트
            fontWrapper.addEventListener('click', () => {
                const isOn = fontWrapper.classList.toggle('on');
                fontLabel.textContent = isOn ? 'Serif' : 'San-Serif';
                
                // 폰트 패밀리 설정
                root.style.setProperty(
                    '--font-family',
                    isOn
                        ? "'Maruburi', serif" 
                        : "'Pretendard Variable', sans-serif"
                );
                
                // 폰트 굵기 설정
                if (titleText) titleText.style.fontWeight = isOn ? '800' : '600';
                infoTexts.forEach(text => text.style.fontWeight = isOn ? '800' : '600');
            });
        }

        // 7. 스크롤 인터랙션 설정
        const scrollTrack = document.querySelector('.scroll-track');
        const scrollBar = document.querySelector('.scroll-bar');
        const infoSection = document.querySelector('div.info');
        
        function updateScrollBar() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollBar.style.width = `${scrollPercent}%`;

            // 스크롤바 표시/숨김 처리
            const infoHeight = infoSection ? infoSection.offsetHeight : 0;
            const threshold = window.innerHeight - (infoHeight + 64);
            scrollTrack.style.display = window.scrollY >= threshold ? 'block' : 'none';
        }

        // 초기 스크롤바 상태 설정
        updateScrollBar();

        // 스크롤 및 리사이즈 이벤트 리스너
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);

        // 8. 기타 인터랙션
        const dropdownButton = document.querySelector('.dropdown-button');
        
        if (dropdownButton && infoSection) {
            dropdownButton.addEventListener('click', () => {
                infoSection.classList.toggle('show');
                dropdownButton.classList.toggle('active');
            });
        }

        console.log('✅ Page load and interactions setup complete');

    } catch (err) {
        console.error('❌ Page load failed:', err);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const currentId = location.pathname.match(/\/contents\/(\d+)$/)?.[1];
    
    // 드롭다운 옵션 생성 및 현재 페이지 표시
    const optionsContainer = document.querySelector('.dropdown-options');
    if (optionsContainer && currentId) {
        const seriesPrefix = currentId.substring(0, 3);
        const currentNumber = currentId.substring(3).replace(/^0+/, '').padStart(2, '0');
        
        // 시리즈 페이지 필터링 및 정렬
        const seriesPages = Object.keys(window.cardData)
            .filter(pageId => pageId.startsWith(seriesPrefix))
            .sort();
            
        // 옵션 생성
        seriesPages.forEach(pageId => {
            const pageNumber = pageId.substring(3).replace(/^0+/, '').padStart(2, '0');
            const option = document.createElement('div');
            option.textContent = pageNumber;
            
            // 현재 페이지 확인 및 data-current 속성 설정
            if (pageId === currentId) {
                option.setAttribute('data-current', 'true');
                console.log('Current page marked:', pageId); // 디버깅용
            }
            
            option.addEventListener('click', () => {
                window.location.href = `/contents/${pageId}`;
            });
            
            optionsContainer.appendChild(option);
        });

        // 드롭다운 토글 텍스트 설정
        const toggle = document.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.textContent = currentNumber;
        }
    }
});
