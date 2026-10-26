// UT 설정 — 이 파일만 고치면 됩니다.
window.UT_CONFIG = {
  // 연구 버전 이름. 프로토타입을 크게 바꾸면 v3, v4…로 올려 두면 기록 파일에서 구분돼요.
  STUDY_ID: 'gemini-privacy-ut-v28',

  // (선택) 기록 자동 전송 주소. 비워 두면 전송하지 않고, 진행자가 파일로 내려받습니다.
  // Google Sheets(Apps Script 웹 앱) 등 POST를 받는 주소를 넣으면, 세션 종료 시 기록 전체(JSON)가 자동 전송돼요.
  // 설정 방법은 README.md의 "기록 자동 수집" 참고.
  LOG_ENDPOINT: '',

  // (선택) 참가자 화면 실시간 보기 — Firebase Realtime Database 설정값.
  // 비워 두면(null) 꺼져 있어요. 설정 방법은 README.md의 "참가자 화면 실시간 보기" 참고.
  // 예) FIREBASE: { apiKey: '...', authDomain: '...', databaseURL: 'https://...firebasedatabase.app', projectId: '...', appId: '...' },
  FIREBASE: {
    apiKey: 'AIzaSyA1MM2dMqucJ1VjY0XZvySRFDgN2Ar4clE',
    authDomain: 'gemini-privacy-cae40.firebaseapp.com',
    databaseURL: 'https://gemini-privacy-cae40-default-rtdb.firebaseio.com',
    projectId: 'gemini-privacy-cae40',
    appId: '1:125193431150:web:26e091e502416492835e7f',
  },
};
