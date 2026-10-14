# Gemini 프라이버시 컨트롤 — 리디자인 UT 프로토타입

LLM 프라이버시 UX 리서치용 **재디자인 컨셉 프로토타입**입니다. Google의 실제 제품이나 공식 화면이 아니며, 화면 속 데이터는 모두 가상입니다.

- A (A1–A4): 답변 속 "출처 확인" → 인라인 데이터 관리 (참조 차단 / 메모리 삭제)
- B (B1–B4): 채팅에 자연어로 요청해서 지우기

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

## 기록되는 것

| 이벤트 | 내용 |
|---|---|
| `step` | 단계 이동 (이전 단계 체류 시간, 이동 경로) |
| `click` | 클릭한 요소 이름(`data-tag`)과 휴대폰 화면 기준 좌표 |
| `misclick` | 클릭할 수 없는 곳을 누른 경우 |
| `expand` / `toggle` / `check` | 펼치기, 참조 토글, B2 체크 |
| `delete` / `undo` | 메모리 삭제 (`used` = 이 답변에 쓰인 2건, `all` = 전체), 실행취소 |
| `b2_process` / `b3_cancel` | B2에서 처리한 항목, B3 취소 |
| `task_done` | 과제 완료 (과제 소요 시간) |

JSON 파일의 `summary`에 핵심 지표가 정리됩니다: 출처 확인 배지 발견 여부와 시간, 메모리 삭제 범위, 최종 참조 상태, B2 처리 항목, "지금 확인하기"를 눌렀는지와 걸린 시간, 단계별 오클릭과 체류 시간.

## 파일 구조

```
index.html        화면 마크업 (A/B 시나리오, 시작·안내·종료 화면, 진행자 패널)
css/style.css     스타일
js/config.js      연구 버전 이름, 자동 수집 주소  ← 설정은 여기만
js/logger.js      기록·저장·내보내기
js/app.js         화면 동작, 진행자 스크립트(STEPS), 지표 계산
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
