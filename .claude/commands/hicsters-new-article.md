# 콘텐츠 기본 정보 추가 (힉스터즈)

힉스터즈 웹사이트에 새 콘텐츠의 **기본 정보**를 추가한다.  
여러 콘텐츠를 한 번에 등록하고, `contents-data.js` 업데이트 + 더미 body 파일 생성 + 메인 리스트 노출 확인까지 처리한다.

---

## Step 1: 다음 ID 자동 감지

`scripts/contents-data.js`를 읽어 현재 가장 높은 숫자 ID를 파악한다 (주석 처리된 항목 제외).  
다음 ID = 현재 최고 ID + 1, 3자리 zero-padding (예: 034 → **035**).

감지한 시작 ID를 사용자에게 알린다:
```
현재 마지막 ID: 034
새 콘텐츠는 035부터 시작됩니다.
몇 개의 콘텐츠를 추가할까요?
```

---

## Step 2: 메타데이터 수집

추가할 콘텐츠 수를 확인한 뒤, **콘텐츠마다** 아래 항목을 한 번에 입력받는다.  
여러 개일 경우 한 콘텐츠 입력 완료 후 다음 콘텐츠로 진행한다.

```
[{id}] 콘텐츠 정보를 입력해주세요:

1. 제목 (title)
2. 대표 인용구 (quote) — 메인 카드에 노출되는 문장
3. 작가 (writer) — 고나 / 김금진 / 김씨 / 김윤희 / 노나 / 도나 / 라근 / 세세 / 채다정
4. 주제 (theme) — 예: "8th: 시험" 또는 자유 주제
5. 형식 (format) — Essay / Fiction / Poetry / Story / Research
6. 날짜 (date) — YYYY-MM-DD
7. 타입 (type) — anthology / others / series
8. 배경색 (bgColor) — hex 코드, 기본값 #ffffff
9. 텍스트색 (textColor) — hex 코드, 기본값 #1a1a1a
10. 폰트 (fontFamily) — serif 원할 시 "'Maruburi', serif" 입력, 아니면 엔터
11. 시리즈 번호 (seriesNum) — 시리즈면 "01/05" 형식, 아니면 엔터 (빈값)
```

---

## Step 3: 파일 생성 및 업데이트

모든 콘텐츠 정보 수집 완료 후 한 번에 처리한다.

### 3-1. `scripts/contents-data.js` 업데이트

마지막 활성 항목(주석 아닌 것) 바로 뒤, 주석 처리된 블록 앞에 새 항목들을 순서대로 삽입한다.

포맷:
```javascript
    "{id}": {
        title:       "{title}",
        quote:       "{quote}",
        writer:      "{writer}",
        theme:       "{theme}",
        seriesNum:   "{seriesNum}",
        format:      "{format}",
        date:        "{date}",
        bgColor:     "{bgColor}",
        textColor:   "{textColor}",
        // fontFamily:  "'Maruburi', serif",
        type:        "{type}"
    },
```
- `fontFamily` 입력한 경우: 해당 줄의 `//` 주석 제거하고 값 반영
- `seriesNum` 비어 있으면: `""`

### 3-2. `contents/bodies/{id}.html` 더미 생성

내용이 없는 최소한의 더미 파일을 생성한다:
```html
<ul class="writing">
</ul>
```

---

## Step 4: 메인 리스트 노출 확인

미리보기 서버(localhost:3000)에서 메인 페이지를 열어 새로 추가된 콘텐츠 카드가 정상적으로 노출되는지 스크린샷으로 확인한다.

---

## Step 5: 완료 메시지 출력

```
완료! 다음 파일이 생성/수정되었습니다:

- scripts/contents-data.js (업데이트)
- contents/bodies/{id}.html (더미 생성) × N개

썸네일 이미지를 추가해주세요:
→ images/thumb/thumb-{id}.avif (각 콘텐츠마다)

콘텐츠 내용은 /write-content 스킬로 추가할 수 있습니다.
```
