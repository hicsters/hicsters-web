# 콘텐츠 내용 작성 (힉스터즈)

기존에 등록된 콘텐츠 ID를 받아, 노션에서 복사한 텍스트를 HTML로 변환하여 `contents/bodies/{id}.html`에 반영한다.  
변환 후 해당 콘텐츠 페이지에서 정상 노출되는지까지 확인한다.

---

## Step 1: 콘텐츠 ID 확인

사용자에게 ID를 묻는다:
```
어떤 콘텐츠에 내용을 작성할까요? (ID 입력, 예: 035)
```

`scripts/contents-data.js`에서 해당 ID의 메타데이터를 조회하여 확인:
```
[035] 열매와 농약 — 김윤희 (Essay)
이 콘텐츠에 내용을 작성합니다.
```

ID가 존재하지 않으면 오류 안내 후 종료.

---

## Step 2: 노션 텍스트 수집

```
노션에서 복사한 텍스트를 붙여넣어 주세요.
```

---

## Step 3: 노션 텍스트 → HTML 변환

아래 규칙을 **우선순위 순서대로** 적용하여 각 줄을 처리한다.  
결과 전체를 `<ul class="writing">...</ul>`로 감싼다.

### 전처리
- 연속 공백 2개 이상 → 공백 1개로 치환

### 규칙 1. [캡션](미디어URL) 형식 — 최우선
- `[캡션텍스트](url.jpg|jpeg|png|gif|webp|mp4)` 형태이면:
  - 미디어 경로 → `/images/contents/{id}-{seq}.확장자` 플레이스홀더 (seq는 001부터)
  - 다음 의미있는 줄이 캡션과 동일 텍스트이면 소비(중복 방지)
  - mp4 → `<video controls playsinline>`, 나머지 → `<img>`
```html
<li class="image"><div class="image-container"><img src="/images/contents/{id}-001.jpg" alt=""></div><div class="caption">캡션텍스트</div></li>
```

### 규칙 2. 멀티라인 이미지 블록
- 줄이 `![`로 시작하면:
  - 이후 줄에서 `](url)` 패턴을 찾아 URL 추출 (빈 줄 건너뜀)
  - 미디어 경로 → `/images/contents/{id}-{seq}.확장자` 플레이스홀더
  - 블록 이후 다음 의미있는 줄이 캡션 조건이고 특수 블록이 아니면 캡션으로 처리
  - mp4 → `<video>`, 나머지 → `<img>`

### 규칙 3. 빈 줄
- 누적된 텍스트 단락이 있으면 `<li class="text">`로 닫고 새 단락 시작

### 규칙 4. 구분선
- `***` 또는 `---`:
```html
<li class="asterisk">
    <div data-svg="icons/icon-asterisk" alt="구분점"></div>
    <div data-svg="icons/icon-asterisk" alt="구분점"></div>
    <div data-svg="icons/icon-asterisk" alt="구분점"></div>
</li>
```

### 규칙 5. 헤딩
- `### 텍스트`:
```html
<li class="heading"><h3>텍스트</h3></li>
```

### 규칙 6. 각주
- `*`로 시작 (`**` 볼드 제외):
```html
<li class="footnote"><p>텍스트</p></li>
```

### 규칙 7. 인용구
- `>`로 시작 (`>>`는 제외):
  - 이후 `>`만 있는 닫는 줄까지 블록으로 묶음
  - 닫는 줄 없으면 단일 줄 처리
  - 줄바꿈 → `<br>`
```html
<li class="quote"><blockquote>내용<br>내용</blockquote></li>
```

### 규칙 8. 인라인 이미지/동영상
- `![alt](url)` 또는 단독 미디어 URL 줄:
  - 미디어 경로 → `/images/contents/{id}-{seq}.확장자` 플레이스홀더
  - 다음 의미있는 줄이 캡션 조건(64자 이하 or 따옴표로 시작/끝)이면 캡션으로 처리
  - 특수 블록(`>`, `***`, `*`, `<aside>`, `![`, `###`)이면 캡션으로 쓰지 않음

### 규칙 9. 콜아웃
- `<aside>` ~ `</aside>` 블록:
  - 첫 줄이 이모지 → 아이콘으로 사용, 나머지가 내용
  - 이모지 없으면 기본 아이콘 `💭`
  - 줄바꿈 → `<br>`
```html
<li class="callout"><div class="callout"><span class="callout-emoji">💭</span><div class="callout-content">내용</div></div></li>
```

### 규칙 10. 인라인 스타일
- `**텍스트**` → `<strong>텍스트</strong>` (모든 블록에 적용)

### 규칙 11. 일반 텍스트
- 위 어느 것도 해당 안 되면 현재 단락에 누적
- 단락 닫힐 때 (빈 줄 또는 파일 끝):
```html
<li class="text">
    <p>텍스트</p>
</li>
```
- 한 단락 안 여러 줄은 각각 별도 `<p>` 태그

---

## Step 4: 파일 저장

변환된 HTML을 `contents/bodies/{id}.html`에 저장한다.  
`<ul class="writing">`으로 시작해서 `</ul>`로 끝나는 내용만 저장.

---

## Step 5: 노출 확인

미리보기 서버(localhost:3000)에서 해당 콘텐츠 페이지(`/contents/{id}`)를 열어 내용이 정상적으로 렌더링되는지 스크린샷으로 확인한다.

---

## Step 6: 완료 메시지 출력

```
완료! contents/bodies/{id}.html 이 업데이트되었습니다.

이미지가 포함된 경우 플레이스홀더를 실제 이미지로 교체해주세요:
→ /images/contents/{id}-001.확장자
```
