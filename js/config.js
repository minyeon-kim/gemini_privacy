// UT 설정 — 이 파일만 고치면 됩니다.
window.UT_CONFIG = {
  // 연구 버전 이름. 프로토타입을 크게 바꾸면 v3, v4…로 올려 두면 기록 파일에서 구분돼요.
  STUDY_ID: 'gemini-privacy-ut-v2',

  // (선택) 기록 자동 전송 주소. 비워 두면 전송하지 않고, 진행자가 파일로 내려받습니다.
  // Google Sheets(Apps Script 웹 앱) 등 POST를 받는 주소를 넣으면, 세션 종료 시 기록 전체(JSON)가 자동 전송돼요.
  // 설정 방법은 README.md의 "기록 자동 수집" 참고.
  LOG_ENDPOINT: '',
};
