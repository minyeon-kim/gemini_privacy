# Gemini 프라이버시 컨트롤 — 리디자인 UT 프로토타입

LLM 프라이버시 UX 리서치용 **재디자인 컨셉 프로토타입**입니다. Google의 실제 제품이나 공식 화면이 아니며, 화면 속 데이터는 모두 가상입니다.

- A (A1–A4): 답변 속 "출처 확인" → 인라인 데이터 관리 (참조 차단 / 메모리 삭제)
- B (B1–B5): 채팅에 자연어로 요청해서 지우기 (B1 자유 입력 → B4에서 처리 결과 확인 → B5 채팅으로 복귀)
- 과제 순서는 기본 A→B이고, 주소 끝에 `?order=ba`를 붙이면 B→A로 진행해요(참가자 모드는 `?mode=participant&order=ba`). 참가자마다 번갈아 쓰면 순서 효과를 줄일 수 있어요.

## 링크

| 용도 | 주소 |
|---|---|
| 진행자 모드 (휴대폰 화면 + 진행자 패널) | `https://minyeon-kim.github.io/gemini_privacy/` |
| 참가자 모드 (참가자 본인 기기용, 패널 없음) | `https://minyeon-kim.github.io/gemini_privacy/?mode=participant` |

## UT 진행 방법

**진행자 화면 공유 방식 (기본)**
1. 진행자 모드 링크를 열고 참가자 코드(P01…)를 입력해 시작합니다.
2. 줌 등에서는 휴대폰 화면만 공유합니다. 우측 상단 버튼으로 패널을 숨길 수 있어요.
3. 패널의 스크립트를 보며 진행하고, "다음 단계 진행"이나 "단계 바로가기"로 흐름을 제어합니다.
4. 끝나면 패널에서 **JSON 받기 / CSV 받기**를 누르고, **새 참가자로 시작**을 누르세요. 이전 기록은 이 브라우저의 "보관된 세션"에도 남아요.

**참가자 본인 기기 방식**
1. 참가자에게 `?mode=participant` 링크를 보냅니다. 상단의 과제 바와 "과제 완료" 버튼으로 스스로 진행해요.
2. 마지막 화면에서 참가자가 "기록 파일 받기"나 "기록 복사하기"로 진행자에게 보냅니다. 아래의 자동 수집을 설정하면 자동 전송돼요.
3. 아래의 **참가자 화면 실시간 보기**를 설정하면, 진행자는 진행자 모드 링크의 패널에서 참가자 화면을 실시간으로 따라 볼 수 있어요.

## 기록되는 것

| 이벤트 | 내용 |
|---|---|
| `step` | 단계 이동 (이전 단계 체류 시간, 이동 경로) |
| `click` | 클릭한 요소 이름(`data-tag`)과 휴대폰 화면 기준 좌표 |
| `misclick` | 클릭할 수 없는 곳을 누른 경우 |
| `expand` / `toggle` / `check` | 펼치기, 참조 토글, B2 체크 |
| `delete` / `undo` | 메모리 삭제 (`used` = 이 답변에 쓰인 2건, `all` = 전체), 실행취소 |
| `b1_request` | B1에서 참가자가 직접 입력해 보낸 요청 문장 |
| `b2_process` / `b3_cancel` | B2에서 처리한 항목, B3 취소 |
| `task_done` | 과제 완료 (과제 소요 시간) |

JSON 파일의 `summary`에 핵심 지표가 정리됩니다: 출처 확인 배지 발견 여부와 시간, 메모리 삭제 범위, 최종 참조 상태, B1 요청 문장, B2 처리 항목, "지금 확인하기"를 눌렀는지와 걸린 시간, 단계별 오클릭과 체류 시간.

## 파일 구조

```
index.html        화면 마크업 (A/B 시나리오, 시작·안내·종료 화면, 진행자 패널)
css/style.css     스타일
js/config.js      연구 버전 이름, 자동 수집 주소  ← 설정은 여기만
js/logger.js      기록·저장·내보내기
js/app.js         화면 동작, 진행자 스크립트(STEPS), 지표 계산
js/live.js        참가자 화면 실시간 보기 (Firebase)
assets/           로고 이미지
```

- 진행자 스크립트 문구는 `js/app.js`의 `STEPS`에서 고칩니다.
- 화면 문구와 데이터는 `index.html`에서 고칩니다. 클릭 기록 이름은 각 요소의 `data-tag`예요.
- 프로토타입을 크게 바꾸면 `js/config.js`의 `STUDY_ID`를 올려서 버전별 기록을 구분하세요.

## 기록 자동 수집 (선택)

Google Sheets에 세션 기록을 자동으로 쌓으려면:
1. 새 Google Sheet → 확장 프로그램 → Apps Script에 아래 코드를 붙여 넣습니다.
   ```js
   function doPost(e) {
     const s = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
       .appendRow([new Date(), s.meta.participant, s.meta.mode, JSON.stringify(s.summary), e.postData.contents]);
     return ContentService.createTextOutput('ok');
   }
   ```
2. 배포 → 새 배포 → 웹 앱, 액세스 권한 "모든 사용자"로 배포하고 URL을 복사합니다.
3. `js/config.js`의 `LOG_ENDPOINT`에 그 URL을 넣고 커밋합니다.

## 참가자 화면 실시간 보기 (선택)

참가자가 자기 기기에서 `?mode=participant`로 진행하는 화면을, 진행자 패널에서 그대로 따라 볼 수 있어요.
화면 영상을 보내는 게 아니라 **현재 단계·토글·삭제·체크·펼침·스크롤 상태**만 보내고, 진행자 쪽에서 같은 화면을 다시 그립니다.

- 진행자 패널의 **"참가자 화면 실시간 보기"** 목록에 최근 12시간 동안의 참가자 세션이 나타나요. **보기**를 누르면 휴대폰 화면이 참가자 화면을 따라가요.
- 참가자가 누른 버튼은 노란 테두리로, 클릭할 수 없는 곳을 누르면(오클릭) 빨간 점으로 잠깐 표시돼요. 점 위치는 기기 화면 크기에 맞춰 환산한 대략적인 위치예요.
- 보는 동안 휴대폰 화면은 조작할 수 없고, 진행 버튼(다음 단계·바로가기·초기화)은 숨겨져요. 패널의 지표·이벤트 기록은 참가자 것으로 바뀌고, **JSON 받기 / CSV 받기**로 참가자 기록을 바로 내려받을 수 있어요.
- 이 브라우저에서 진행 중이던 세션이 있으면 보관함에 저장한 뒤 전환돼요. **그만 보기**를 누르면 시작 화면으로 돌아와요.
- Firebase가 연결되지 않아도 프로토타입과 기록 기능은 기존처럼 동작해요.

**설정 방법 (무료 Spark 요금제로 충분해요)**
1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트를 만듭니다. Google 애널리틱스는 꺼도 돼요.
2. 빌드 → **Realtime Database** → 데이터베이스 만들기. 위치는 아무 곳이나 괜찮고, "잠금 모드"로 시작해요.
3. Realtime Database의 **규칙** 탭에 아래 내용을 붙여 넣고 게시합니다.
   ```json
   {
     "rules": {
       "live":      { ".read": true, ".write": true },
       "liveIndex": { ".read": true, ".write": true, ".indexOn": ["updatedAt"] }
     }
   }
   ```
4. 프로젝트 설정(톱니바퀴) → 일반 → 내 앱 → **웹 앱(</>) 추가**. 표시되는 `firebaseConfig` 값을 `js/config.js`의 `FIREBASE`에 넣고 커밋합니다. `databaseURL`이 꼭 들어 있어야 해요(없으면 Realtime Database 화면 상단의 주소를 복사해 넣으세요).
   ```js
   FIREBASE: {
     apiKey: '...',
     authDomain: '...firebaseapp.com',
     databaseURL: 'https://...firebasedatabase.app',
     projectId: '...',
     appId: '...',
   },
   ```

**주의**
- 위 규칙은 주소를 아는 누구나 읽고 쓸 수 있는 설정이에요. 기록에는 참가자 코드(P01 등)와 화면 조작 내역만 들어가니, 참가자 실명 같은 개인정보를 코드로 쓰지 마세요.
- 연구가 끝나면 Realtime Database의 데이터 탭에서 `live`, `liveIndex`를 삭제하고, 규칙의 `true`를 `false`로 바꿔 닫아 두세요.

### 언어 전환

기본 언어는 한국어입니다. 화면 상단의 **언어 / Language**에서 English로 바꿀 수 있으며, 선택은 브라우저에 저장됩니다. 참가자 화면과 진행자 안내, 처리 결과 및 알림에 적용됩니다. `?lang=en` 또는 `?mode=participant&lang=en`으로 영어 화면을 바로 열 수 있습니다(`lang=ko`는 한국어). 세션 시작 시 선택한 언어와 이후 언어 변경 이벤트도 기록됩니다.

### Gemini 로고

화면의 Gemini 심볼은 [공식 Gemini 웹사이트](https://gemini.google.com/)에서 사용하는 [SVG 원본](https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg)을 `assets/gemini-logo.svg`에 저장해 사용합니다.

### 인터랙션

- 답변은 지도·레스토랑 카드·본문 순서로 표시되며 생성 중지/계속을 지원합니다. 출처 발견 시간은 마지막 내용이 표시된 후부터 측정합니다.
- 응답 복사, 공유(지원하지 않으면 복사), 읽어주기(브라우저 지원 시), 좋아요/싫어요 및 세션 내 레스토랑 저장이 동작합니다.
- 출처 시트는 상단 핸들을 아래로 드래그하거나 Esc로 닫습니다. 시트 안에서 키보드 포커스가 이동하고, 닫으면 출처 버튼으로 돌아갑니다.
- 선택 건수와 부분 선택 상태를 표시하고, 처리 중 선택 변경 및 중복 처리를 방지합니다. 초기화하거나 다른 화면으로 이동하면 대기 중 처리가 취소됩니다.
- 버튼·토글·체크박스·완료 카드에 피드백을 추가했으며 `prefers-reduced-motion` 설정을 존중합니다. 실제 AI 호출 없이 기존 연구용 시나리오로 동작합니다.
