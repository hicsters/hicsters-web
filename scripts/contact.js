document.getElementById('sendEmail').addEventListener('click', function(e) {
    e.preventDefault(); // 기본 동작을 막기 (링크 이동 방지)
  
    const email = "marooenads@gmail.com"; // 이메일 주소
    const subject = "이메일 제목을 적어주세요"; // 이메일 제목
    const body = "힉스터즈에게 문의하고싶은 내용을 적어주세요"; // 이메일 내용
  
    // mailto 링크 생성
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    // 메일 작성 창 띄우기
    window.location.href = mailtoLink;
  });

document.getElementById('copyEmail').addEventListener('click', function(e) {
    e.preventDefault(); // 기본 동작을 막기 (링크 이동 방지)
  
    const email = "marooenads@gmail.com"; // 복사할 이메일
  
    // 임시 텍스트 영역 생성
    const textarea = document.createElement('textarea');
    textarea.value = email;
    document.body.appendChild(textarea);
  
    // 텍스트 영역 선택
    textarea.select();
    textarea.setSelectionRange(0, 99999); // 모바일에서 선택 범위 설정
  
    // 클립보드에 복사
    document.execCommand('copy');
  
    // 임시 텍스트 영역 제거
    document.body.removeChild(textarea);
  
    alert('이메일을 복사했어요'); // 복사 완료 알림
  });
  