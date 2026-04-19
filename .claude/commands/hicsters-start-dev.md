# 개발 서버 시작 (힉스터즈)

로컬 개발 서버를 시작하고 Chrome으로 미리보기를 연다.  
인자로 경로를 넘기면 해당 페이지를 바로 연다. (예: `/start-dev contents/035001`)

---

## Step 1: 현재 프로젝트 경로 확인

`pwd`로 현재 워킹 디렉토리를 확인한다.

## Step 2: 포트 확인

`dev-server.js`에서 PORT 값을 읽는다:

```bash
grep "const PORT" dev-server.js
```

## Step 3: 기존 서버 종료

```bash
pkill -f "node dev-server.js" 2>/dev/null; sleep 1
```

## Step 4: 서버 백그라운드 실행

`node dev-server.js`를 백그라운드(`&`)로 직접 실행한다.  
경로에 아포스트로피 등 특수문자가 포함될 수 있으므로 osascript 대신 직접 실행한다.

```bash
node dev-server.js &
sleep 2
```

서버가 정상 기동됐는지 포트로 확인한다:

```bash
lsof -i :{PORT}
```

## Step 5: Chrome 열기

인자로 경로가 주어진 경우: `http://localhost:{PORT}/{경로}`  
인자가 없는 경우: `http://localhost:{PORT}/`

```bash
open -a "Google Chrome" "http://localhost:{PORT}/{경로}"
```

## Step 6: 완료 메시지

```
✅ 서버 시작!
→ http://localhost:{PORT}/{경로}
```
