// Central Korean/English copy. Text nodes are updated without replacing interactive elements.
(function(){
  const messages = {
  "Gemini 프라이버시 컨트롤 프로토타입 — UT": "Gemini Privacy Controls Prototype — UT",
  "진행자 패널 숨기기": "Hide moderator panel",
  "진행자 패널 보이기": "Show moderator panel",
  "과제 완료": "Finish task",
  "UX 리서치 · 사용성 테스트": "UX research · Usability test",
  "Gemini 프라이버시 컨트롤": "Gemini Privacy Controls",
  "Revamp 컨셉 테스트": "Revamp concept test",
  "이 화면은": "This is a",
  "UX 리서치용으로 만든 Revamp 컨셉 프로토타입": "revamp concept prototype for UX research",
  "이며, Google의 실제 제품이나 공식 화면이 아닙니다.": ", and is not an actual Google product or official interface.",
  "화면 속 이름·예약·일정은 모두": "All names, bookings, and events shown are",
  "가상의 데이터": "fictional data",
  "예요. 실제 계정이나 개인정보와 연결되지 않습니다.": ". They are not connected to real accounts or personal information.",
  "테스트 중 화면에서 누른 위치·순서·시간이 연구 목적으로 기록됩니다. 정답은 없으니 평소처럼 편하게 사용해 주세요.": "During the test, click locations, order, and timing are recorded for research. There are no right answers; use it as you normally would.",
  "참가자 코드": "Participant code",
  "예: P03": "e.g. P03",
  "참가자 코드를 입력해 주세요": "Please enter a participant code",
  "시작하기": "Start",
  "상황 1": "Scenario 1",
  "저녁 약속 장소 찾기": "Find a place for dinner",
  "퇴근 후 소파에 앉아, 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요.": "After work, you are sitting on the sofa and open Gemini to find a place for dinner this week.",
  "질문을 보내고 답변을 살펴본 뒤, 답변에 대해 궁금하거나 해 보고 싶은 게 있으면 자유롭게 해 보세요.": "Send the question and review the response. Feel free to explore anything you are curious about or want to try.",
  "생각나는 것을 소리 내어 말하면서 진행해 주세요.": "Please think aloud as you go.",
  "상황 2": "Scenario 2",
  "채팅으로 정보 지우기": "Remove information through chat",
  "앞의 상황과는 별개인 새로운 상황이에요.": "This is a new scenario, separate from the previous one.",
  "Gemini가 '정민'이라는 사람과 관련된 정보를 기억하고 있어요. 이번에는": "Gemini remembers information about someone named Jeongmin. This time,",
  "채팅으로 직접 요청해서": "ask directly in chat",
  "정민 관련 정보를 정리해 보세요.": "to manage information about Jeongmin.",
  "요청 문구는 미리 입력돼 있으니 보내기만 하면 돼요.": "The request is already entered. Just send it.",
  "완료": "Complete",
  "테스트가 끝났어요": "The test is complete",
  "참여해 주셔서 감사합니다. 진행자의 안내에 따라 마무리 질문에 답해 주세요.": "Thank you for participating. Please follow the moderator’s instructions for the final questions.",
  "기록 파일 받기 (JSON)": "Download session log (JSON)",
  "기록 복사하기": "Copy session log",
  "요즘 새로 생긴 이탈리안 레스토랑 추천해줘": "Recommend a recently opened Italian restaurant",
  "한": "English",
  "분위기 좋은 이탈리안 레스토랑을 찾고 계신다면 송도 센트럴파크 인근에 위치한 신상 맛집을 추천해 드립니다.": "If you are looking for an Italian restaurant with a lovely atmosphere, I recommend this new spot near Songdo Central Park.",
  "톨로 비스트로": "Tolo Bistro",
  "🍝 이탈리아 음식점": "🍝 Italian restaurant",
  "— 화이트와 우드톤의 깔끔한 인테리어와 통창으로 탁 트인 센트럴파크 뷰를 즐길 수 있는 감성적인 이탈리안 레스토랑입니다.": "— An Italian restaurant with a clean white and wood interior and panoramic Central Park views through floor-to-ceiling windows.",
  "시그니처 메뉴: 쫄깃한 도우와 향긋한 바질, 탱글한 새우가 어우러진 '바질 새우 피자'": "Signature dish: basil shrimp pizza with chewy dough, fragrant basil, and juicy shrimp",
  "인기 메뉴: 꾸덕한 크림소스에 진한 풍미가 더해진 '트러플 뇨끼'": "Popular dish: truffle gnocchi in a rich, creamy sauce",
  "작년 봄에": "When you visited with",
  "정민": "Jeongmin",
  "씨와 가셨을 때 트러플 리조또 좋아하셨었죠 — 이번에도 비슷한 메뉴 어떠세요?": "last spring, you enjoyed the truffle risotto — how about something similar this time?",
  "출처 확인": "View sources",
  "· 삭제됨": "· Deleted",
  "· 참조 안 함": "· Not used",
  "2025.3.14 대화 — \"정민과 트러플 리조또\" 언급": "Mar 14, 2025 chat — mentioned “truffle risotto with Jeongmin”",
  "2025.2.8 대화 — \"주말 등산 코스\" 언급": "Feb 8, 2025 chat — mentioned “weekend hiking trails”",
  "메모리 전체 삭제": "Delete all memories",
  "토글을 끄면 이 데이터를 답변에서 참조하지 않아요": "Turn off the toggle to stop using this data in responses",
  "[톨로 비스트로] 예약이 확정되었습니다 · 2025.3.15 19:00, 2명": "[Tolo Bistro] Booking confirmed · Mar 15, 2025, 7:00 PM, 2 guests",
  "[대한항공] 예약이 확정되었습니다 · 2025.2.20 인천→제주": "[Korean Air] Booking confirmed · Feb 20, 2025, Incheon → Jeju",
  "2025.3 일정 제목 \"정민과 저녁\"": "Mar 2025 event: “Dinner with Jeongmin”",
  "2025.3.20 일정 제목 \"치과 예약\"": "Mar 20, 2025 event: “Dentist appointment”",
  "이 답변엔 사용되지 않았어요": "Not used in this response",
  "톨로 비스트로 어떠세요? 작년 봄에 정민 씨와…": "How about Tolo Bistro? Last spring, you and Jeongmin…",
  "정민이랑 관련된 정보 다 지워줘": "Delete all information related to Jeongmin",
  "'정민' 관련 정보 6건을 찾았어요": "I found 6 items related to Jeongmin",
  "전체 선택": "Select all",
  "삭제돼요": "Will be deleted",
  "2025.3.14 대화 \"정민과 트러플 리조또\" 언급": "Mar 14, 2025 chat: “truffle risotto with Jeongmin”",
  "2025.1.20 대화 \"정민이 좋아하던 재즈바\" 언급": "Jan 20, 2025 chat: “Jeongmin’s favorite jazz bar”",
  "참조만 차단돼요": "Only use in responses will be blocked",
  "[톨로 비스트로] 예약이 확정되었습니다 · 2025.3.15": "[Tolo Bistro] Booking confirmed · Mar 15, 2025",
  "[스시타로] 오마카세 예약 확인 · 2024.11.2": "[Sushi Taro] Omakase booking confirmed · Nov 2, 2024",
  "2025.3 일정 \"정민과 저녁\"": "Mar 2025 event: “Dinner with Jeongmin”",
  "2024.11 일정 \"정민 생일\"": "Nov 2024 event: “Jeongmin’s birthday”",
  "취소": "Cancel",
  "선택 항목 처리": "Process selected items",
  "요청을 처리했어요": "Your request has been processed",
  "지금 확인하기": "Verify now",
  "✓ 처리 결과를 확인했어요": "✓ Results verified",
  "다른 도움이 필요하시면 언제든 말씀해 주세요.": "Let me know if you need anything else.",
  "'정민' 관련 정보 처리 결과": "Results for information related to Jeongmin",
  "채팅에서 요청한 처리가 실제로 반영됐는지 확인해요": "Check that the changes requested in chat have been applied",
  "채팅으로 돌아가기": "Return to chat",
  "이 답변에 사용된 정보": "Information used in this response",
  "이 답변이 참고한 소스만 표시돼요 · 토글을 끄면 참조하지 않고, 펼치면 상세 데이터를 볼 수 있어요": "Only sources used in this response are shown. Turn off a toggle to stop using a source, or expand it to see details.",
  "[스시타로] 오마카세 예약 확인 · 2024.11.2 20:00, 2명": "[Sushi Taro] Omakase booking confirmed · Nov 2, 2024, 8:00 PM, 2 guests",
  "2025.1.20 대화 — \"정민이 좋아하던 재즈바\" 언급": "Jan 20, 2025 chat — mentioned “Jeongmin’s favorite jazz bar”",
  "이 답변에 쓰인 메모리 2건 삭제": "Delete the 2 memories used in this response",
  "Personal Intelligence에서 전체 관리 →": "Manage everything in Personal Intelligence →",
  "삭제됨": "Deleted",
  "실행취소": "Undo",
  "관찰형 워크스루 · 진행자 패널": "Observational walkthrough · Moderator panel",
  "A(A1~A4, 인라인 데이터 관리)와 B(B1~B4, 채팅 자연어 삭제)는 하나로 이어진 이야기가 아니라 별개의 두 메커니즘 — 각각 독립적으로 시연·관찰합니다.": "A (A1–A4, inline data management) and B (B1–B4, deletion through chat) are separate mechanisms. Demonstrate and observe each independently.",
  "세션 시작 전": "Session not started",
  "다음 단계 진행 →": "Next step →",
  "단계 바로가기 (진행자 전용)": "Jump to step (moderator only)",
  "주석(빨간 점선) 표시": "Show annotations (red dashed outlines)",
  "시나리오 상태 초기화 (A1로)": "Reset scenario (to A1)",
  "실시간 기록": "Live event log",
  "JSON 받기": "Download JSON",
  "CSV 받기": "Download CSV",
  "복사": "Copy",
  "새 참가자로 시작 (현재 기록 저장 후 초기화)": "Start new participant (save current log and reset)",
  "검증 지표": "Evaluation metrics",
  "— ①통제 난이도 ②응답 예측 부합도 ③삭제 성공 여부 ④신뢰·불안 변화(그레이존 인지) ⑤정보량 적절성": "— ① Ease of control ② Response predictability ③ Deletion success ④ Changes in trust and anxiety (awareness of ambiguity) ⑤ Amount of information",
  "참가자에게는 휴대폰 화면만 공유하세요(패널은 우측 상단 버튼으로 숨김 가능). 참가자 본인 기기로 진행할 땐 주소 끝에": "Share only the phone screen with participants (hide the panel using the top-right button). For participants using their own device, append",
  "를 붙인 링크를 보내세요.": "to the URL and send them the link.",
  "기록을 전송하고 있어요…": "Sending session log…",
  "기록이 전송됐어요. 창을 닫으셔도 돼요.": "Session log sent. You can close this window.",
  "전송에 실패했어요. 아래 버튼으로 기록을 받아 진행자에게 보내 주세요.": "Sending failed. Download the log below and send it to the moderator.",
  "메모리 전체 삭제됨": "All memories deleted",
  "이 답변에 쓰인 메모리 2건 삭제됨": "The 2 memories used in this response were deleted",
  "메모리 2건 삭제됨": "2 memories deleted",
  "설정이 바뀌었어요": "Settings updated",
  "다음 답변부터 반영돼요": "Changes apply to future responses",
  "처리 중…": "Processing…",
  "선택한 정보를 삭제했어요": "Selected information deleted",
  "선택한 정보의 참조를 차단했어요": "Use of selected information blocked",
  "그대로 유지됨 — 계속 답변에 참조될 수 있어요": "Unchanged — may still be used in responses",
  "삭제됨 — 더 이상 남아있지 않아요": "Deleted — no longer stored",
  "참조 차단됨 — 앞으로 답변에 사용되지 않아요": "Blocked — will no longer be used in responses",
  "참조 차단": "Use blocked",
  "기록 없음": "No log",
  "아직": "Not yet",
  "없음": "None",
  "A · 출처 확인 배지 발견": "A · Source badge found",
  "A · 메모리 삭제": "A · Memory deletion",
  "A · 참조 끈 앱": "A · Apps disabled",
  "B · 처리한 항목": "B · Processed items",
  "B · 지금 확인하기": "B · Verify now",
  "오클릭 (전체)": "Misclicks (total)",
  "기록된 이벤트": "Recorded events",
  "시작하면 이벤트가 여기에 쌓여요": "Events will appear here after you start",
  "열림": "Expanded",
  "닫힘": "Collapsed",
  "이 브라우저에 보관된 세션": "Sessions saved in this browser",
  "아직 기록된 세션이 없어요.": "No sessions have been recorded yet.",
  "기록을 복사했어요. 진행자에게 붙여 넣어 보내 주세요.": "Log copied. Paste it and send it to the moderator.",
  "기록을 복사했어요.": "Log copied.",
  "복사에 실패했어요. \"기록 파일 받기\"를 이용해 주세요.": "Copy failed. Please use “Download session log”.",
  "현재 세션 기록을 보관함에 저장하고 새 참가자로 시작할까요?": "Save the current session to the archive and start a new participant?",
  "시나리오 상태를 초기화할까요? (기록은 유지돼요)": "Reset the scenario? (The log will be kept.)",
  "참가자 화면 실시간 보기": "Watch participant screen live",
  "참가자가": "When a participant opens the",
  "링크로 시작하면 여기에 나타나요. 누르면 왼쪽 휴대폰 화면이 참가자 화면을 그대로 따라가요.": "link, they appear here. Select a session to mirror their screen on the left.",
  "불러오는 중…": "Loading…",
  "목록을 불러오지 못했어요. Firebase 설정과 보안 규칙을 확인해 주세요.": "Could not load sessions. Check the Firebase configuration and security rules.",
  "진행 중인 참가자 세션이 없어요": "No active participant sessions",
  "종료": "Ended",
  "그만 보기": "Stop watching",
  "보기": "Watch",
  "진행 중인 이 브라우저의 세션은 보관함에 저장하고, 참가자 화면 보기로 전환할까요?": "Archive this browser’s current session and switch to watching the participant?",
  "참가자 화면 보는 중 · 조작 불가": "Watching participant · View only",
  "꺼져 있어요 — js/config.js에 FIREBASE 설정을 넣으면 켜져요 (README 참고).": "Disabled — add FIREBASE settings in js/config.js to enable (see README).",
  "Firebase에 연결하지 못했어요. 인터넷 연결과 config.js 설정을 확인해 주세요.": "Could not connect to Firebase. Check your internet connection and config.js settings.",
  "세션 시작 전 — 참가자 코드를 입력하고 시작하세요": "Enter a participant code to start a session",
  "Phase A · 인라인 데이터 관리": "Phase A · Inline data management",
  "Phase B · 채팅 자연어 삭제": "Phase B · Deletion through chat",
  "Gemini에게 저녁 장소를 물어보고 답변을 살펴보세요. 할 만큼 했다고 느껴지면 '과제 완료'를 눌러 주세요.": "Ask Gemini for a dinner venue and review the response. When you feel finished, select “Finish task”.",
  "채팅으로 '정민' 관련 정보를 정리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.": "Manage information about Jeongmin through chat. When you feel finished, select “Finish task”.",
  "참가자에게 연구 고지를 읽게 하고, 참가자 코드(P01 등)를 입력한 뒤 '시작하기'를 누르세요. 이때부터 기록이 시작됩니다.": "Ask the participant to read the research notice, enter their code (e.g. P01), and select Start. Recording begins then.",
  "클릭 가능 — <b>참가자 코드 입력</b>, <b>시작하기</b>.": "Available: participant code input and Start.",
  "(참가자 모드 전용) 상황 1 안내 카드입니다.": "Scenario 1 introduction, shown only in participant mode.",
  "클릭 가능 — <b>시작하기</b>.": "Available: Start.",
  "퇴근 후 소파에서 저녁 약속 장소를 물어보는 장면입니다. 상황을 읽어준 뒤 참가자가 입력창을 누르게 하세요.": "The participant opens Gemini after work to find a dinner venue. Read the scenario, then let them tap the input.",
  "클릭 가능 — <b>입력창</b>을 누르면 질문이 채워진 화면으로 넘어갑니다.": "Tap the input to open the prefilled question.",
  "정해진 질문이 입력창에 한 글자씩 입력되는 장면입니다(약 1초, 고정 시나리오). 입력이 끝나면 전송 버튼을 누르게 하세요.": "The scripted question is typed automatically. Once typing finishes, ask the participant to send it.",
  "클릭 가능 — <b>전송 버튼</b>만(입력 연출이 끝난 뒤 활성화).": "Only Send is available after typing finishes.",
  "응답을 기다리는 짧은 로딩 장면입니다. 약 1.2초 뒤 자동으로 다음 화면으로 전환됩니다.": "A brief loading screen. It advances automatically after about 1.2 seconds.",
  "클릭 지점 없음 — 자동 전환됩니다.": "No interaction; advances automatically.",
  "관찰 포인트 — 좋아요·싫어요 옆의 <b>파란색 '출처 확인' 배지</b>를 참가자가 스스로 찾아 누르는지가 핵심입니다. 답변은 약 1.6초에 걸쳐 순서대로 나타나고, <b>발견 시간은 답변이 다 표시된 시점부터</b> 자동 기록돼요. A3에서 참조를 끄거나 메모리를 지우고 돌아오면 답변 아래에 변경 안내가 표시됩니다.": "Observe whether they find the blue View sources badge beside the rating icons. The response appears over 1.6 seconds; discovery timing starts after it is fully shown. Changes in A3 appear below the response.",
  "출처 패널이 열렸습니다. 이 답변이 참고한 소스만 표시되어, 펼치면 나오는 데이터도 전부 정민 관련(과거 예약·일정·대화)입니다. '이 정보를 앞으로 어떻게 하고 싶으신가요? 참조만 막고 싶으신가요, 아예 지우고 싶으신가요?'라고 열린 질문을 던지세요.": "The source panel shows only information used in this response, all related to Jeongmin. Ask what they want to do with it: block its use or delete it?",
  "클릭 가능 — 항목 이름을 누르면 <b>구체적 데이터가 펼쳐짐(읽기 전용)</b>, 참조 on/off는 <b>앱 단위 토글</b>. <b>Memory는 펼쳤을 때만</b> 하단에 '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초간 실행취소 토스트). Gmail·Calendar는 연동 데이터라 참조 차단만 가능. 우측 상단 <b>X</b>나 바깥 영역으로 닫기, 하단 <b>'Personal Intelligence에서 전체 관리 →'</b> 링크.": "Expand sources to read details; toggles control each app. Expanding Memory reveals deletion of the 2 memories used here, with 4 seconds to undo. Gmail and Calendar can only be blocked. Close with X or the backdrop, or open Manage everything in Personal Intelligence.",
  "이곳은 이 답변 하나가 아니라 Gemini가 갖고 있는 전체 데이터를 보여주는 화면이라, 항목을 펼치면 정민 관련 데이터 옆에 무관한 데이터(배송 알림·치과 예약 등)도 같이 보입니다. '정민 관련 정보를 어떻게 처리하고 싶으신가요?'라고 물어보세요.": "This page shows all data available to Gemini, including unrelated deliveries and appointments. Ask how they want to handle information about Jeongmin.",
  "클릭 가능 — 이름을 누르면 <b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>Memory는 펼쳤을 때만</b> '메모리 전체 삭제' 링크가 나타남(A3에서 2건을 지웠다면 11→9건으로 반영). ← 로 출처 패널 복귀.": "Expand items to read details. Toggles are shared with A3. Expanding Memory reveals Delete all memories. Deleting 2 in A3 reduces the count from 11 to 9. Back returns to the source panel.",
  "(참가자 모드 전용) 상황 2 안내 카드입니다.": "Scenario 2 introduction, shown only in participant mode.",
  "여기부터는 별개의 상황입니다 — 방금 A에서 본 인라인 관리와는 독립된, '채팅에 말로 요청해서 지우기'라는 다른 방식을 시연합니다. '이번엔 정민 관련 정보를 채팅에 직접 말해서 지워보고 싶다면 어떻게 하시겠어요?' 문구는 이미 입력돼 있으니 전송만 누르면 됩니다(고정 플로우).": "This is a separate scenario demonstrating deletion through chat. Ask how they would request removal of information about Jeongmin. The request is already entered.",
  "클릭 가능 — <b>전송 버튼</b>만.": "Only Send is available.",
  "'이 목록이 기대하신 범위와 같나요, 빠지거나 더 있는 게 있나요?' Memory 그룹과 Connected Apps 그룹으로 나뉘어 있고, 각 그룹 라벨이 '삭제돼요'/'참조만 차단돼요'로 다른 걸 참가자가 알아차리는지 확인하세요.": "Ask whether the list matches their expectations or misses anything. Observe whether they notice that Memory is deleted while connected apps only have their use blocked.",
  "B1에서 전송하면 약 1.2초 응답 대기 후 카드가 나타납니다. 클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 항목별 <b>체크박스</b>, <b>선택 항목 처리/취소</b>. 아무것도 선택하지 않으면 처리 버튼이 비활성화되고, 누르면 약 0.9초 '처리 중' 후 B3로 넘어갑니다.": "The card appears after a 1.2-second wait. Select all, expand items, change checkboxes, process, or cancel. Processing is disabled when nothing is selected and takes about 0.9 seconds.",
  "처리 결과를 참가자가 그대로 믿는지, 확인하고 싶어 하는지 관찰하세요. 먼저 묻지 말고 스스로 버튼을 누르는지 지켜보세요.": "Observe whether the participant trusts the result or wants to verify it. Wait to see whether they select the button without prompting.",
  "클릭 가능 — <b>'지금 확인하기'</b>(관찰 핵심, 누르기까지 시간 자동 기록), <b>'취소'</b>(처리 이전으로 되돌리고 B2로 복귀). 결과 문구는 B2에서 고른 항목에 맞춰 바뀝니다.": "Verify now records time to verification. Cancel restores the previous state and returns to B2. Results reflect the selected items.",
  "출처 패널과 같은 형식으로, 실제로 항목이 처리됐는지 다시 확인합니다. '신뢰가 어떻게 달라졌나요? 이런 방식의 데이터 활용을 원래 알고 계셨나요?'로 마무리하세요.": "Verify the changes in a panel similar to the source panel. Ask how trust has changed and whether they knew their data could be used this way.",
  "클릭 가능 — <b>'채팅으로 돌아가기'</b>(B5로 이동), ← 로 B3 복귀.": "Return to chat opens B5. Back returns to B3.",
  "확인을 마치고 채팅으로 돌아온 장면입니다. 마무리 질문을 하고, 참가자 모드에서는 참가자가 '과제 완료'를 누르면 끝납니다(진행자 모드는 '다음 단계 진행'으로 END).": "The participant has returned to chat after verification. Ask final questions. Participants select Finish task; moderators use Next step to reach END.",
  "클릭 지점 없음 — 처리 결과 카드와 마무리 답변만 표시됩니다.": "No interaction; the result card and final response are displayed.",
  "세션 종료 화면입니다. 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고, 다음 참가자는 '새 참가자로 시작'을 누르세요.": "The session has ended. Save JSON or CSV from the panel, then select Start new participant for the next session.",
  "참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송).": "Participant mode shows download and copy actions; automatic sending is used when configured."
};
  Object.assign(messages, {"선택한 정보": "Selected items", "생성 중지": "Stop generating", "계속 생성": "Continue generating", "답변 복사": "Copy response", "답변 공유": "Share response", "답변 듣기": "Read aloud", "좋아요": "Good response", "싫어요": "Bad response", "아래로 드래그하여 닫기": "Drag down to close", "의견이 반영됐어요": "Feedback saved", "평가를 취소했어요": "Rating removed", "읽어주기를 사용할 수 없어요": "Read aloud is unavailable", "답변을 복사했어요": "Response copied", "복사하지 못했어요. 다시 시도해 주세요": "Could not copy. Please try again.", "레스토랑 저장": "Save restaurant", "이번 세션에 저장했어요": "Saved for this session", "저장을 취소했어요": "Removed from saved items", "삭제": "Deleted"});
  Object.assign(messages, {
    '생성 중지·계속, 복사·공유·듣기·평가 버튼도 사용할 수 있어요.': 'Stop or continue generating, copy, share, read aloud, and rate the response.',
    '시트 상단을 아래로 드래그하거나 Esc를 눌러 닫을 수 있어요.': 'Drag the sheet handle down or press Escape to close.'
  });
  Object.assign(messages, {
  "참가자에게 연구 고지를 읽게 하고 참가자 코드(P01 등)를 입력한 뒤 '시작하기'를 누르세요. 이때부터 기록이 시작됩니다. 시작 전 안내: '디자인을 평가하는 자리지 참가자분을 평가하는 게 아니에요. 정답은 없고, 생각나는 걸 소리 내어 말하면서 진행해 주세요.'": "Ask the participant to read the research notice, enter their code, and select Start. Recording starts then. Explain that the design is being evaluated, not the participant; there are no right answers, and they should think aloud.",
  "클릭 가능 — <b>참가자 코드 입력</b>, <b>시작하기</b>. 순서 교차는 주소 끝에 <b>?order=ba</b>(B→A).": "Available: participant code and Start. Add ?order=ba to run B before A.",
  "(참가자 모드 전용) 상황 1 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.": "Scenario A introduction (participant mode). Let the participant read it and start independently.",
  "클릭 가능 — <b>시작하기</b>.": "Available: Start.",
  "[목표 제시] 상황만 읽어 주세요: '퇴근 후 소파에 앉아 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요. 질문을 보내고 답변을 살펴본 뒤, 해 보고 싶은 게 있으면 자유롭게 해 보세요.' 이후 참가자가 직접 입력창을 누르게 두세요.": "Present only the situation: after work, the participant opens Gemini to find a dinner venue this week. Let them send the question, review the answer, and explore freely. Wait for them to tap the input.",
  "클릭 가능 — <b>입력창</b>을 누르면 질문이 채워진 화면으로 넘어갑니다(질문은 고정).": "Tap the input to open the scripted question.",
  "정해진 질문이 한 글자씩 입력되는 연출입니다(약 1초). 참가자가 전송을 누르게 두세요.": "The scripted question is typed automatically. Let the participant select Send.",
  "클릭 가능 — <b>전송 버튼</b>만(입력 연출이 끝난 뒤 활성화).": "Send becomes available after typing finishes.",
  "응답 대기 연출입니다. 약 1.2초 뒤 자동으로 다음 화면으로 전환됩니다.": "Waiting for a response. Advances automatically after about 1.2 seconds.",
  "클릭 지점 없음 — 자동 전환됩니다.": "Advances automatically; Stop generating can cancel the response.",
  "[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'만 물으세요. 이 답변을 어떻게 하고 싶은지는 참가자가 스스로 행동하게 두고, '출처 확인' 배지 위치는 알려주지 마세요. 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.": "Let the participant explore. The answer unexpectedly includes a past memory involving Jeongmin. After it appears, wait, then ask only: “What do you think of that response?” Do not reveal the source badge location. Surprise is an intended reaction, not a failure. If they are stuck for over 60 seconds, ask: “Is there a way to find out why this response appeared?” If needed, open A3 using the moderator controls and record that help was provided.",
  "관찰 포인트 — 좋아요·싫어요 옆 <b>'출처 확인' 배지</b>를 스스로 찾는지. 발견 시간은 <b>답변이 다 표시된 시점부터</b> 자동 기록돼요. A3에서 참조를 끄거나 메모리를 지우고 돌아오면 답변 아래에 변경 안내가 표시됩니다.": "Observe whether they discover View sources independently. Discovery timing starts after the response is fully shown. Changes made in A3 appear below the answer.",
  "[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면: '이 정보가 앞으로 어떻게 되길 원하세요? 원하는 상태로 만들어 보세요.' (차단·삭제 같은 선택지를 먼저 말하지 마세요.) [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 어떻게 다를까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'": "Let them inspect the panel without prompting. If needed, ask: “What would you like to happen to this information? Try making it that way.” Do not suggest blocking or deletion. After interaction, check understanding without explaining: What changed? Which information does a toggle affect? How does deleting differ from turning off? Can they explain why the response appeared?",
  "클릭 가능 — 항목 이름=<b>데이터 펼치기(읽기 전용)</b>, 참조 on/off는 <b>앱 단위 토글</b>(이 시트엔 2건만 보이지만 끄면 해당 앱 전체 참조가 꺼짐 — 그레이존 핵심 관찰). <b>Memory는 펼쳤을 때만</b> '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초 실행취소). Gmail·Calendar는 참조 차단만 가능. <b>X</b>·바깥 영역으로 닫기, 하단 <b>'Personal Intelligence에서 전체 관리 →'</b> 링크.": "Expand source names to read data. Toggles control use of the entire app, although this panel shows only 2 items. Expanding Memory reveals deletion of the 2 memories used here, with 4 seconds to undo. Gmail and Calendar can only be blocked. Close with X or the backdrop, or manage everything in Personal Intelligence.",
  "참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 이 화면엔 정민 관련 메모리만 골라 지우는 기능이 없고 '메모리 전체 삭제'뿐이에요. 이때의 반응은 디자인 제약에서 나온 발견으로 기록하세요. [Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요.": "Observe only if the participant navigates here independently. Ask what this screen shows and watch their actions. This screen supports deleting all memories, not selectively deleting those about Jeongmin; record reactions to this limitation. When the participant finishes, run the post-task survey on ease, perceived completion, confidence, and amount of information.",
  "클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>Memory는 펼쳤을 때만</b> '메모리 전체 삭제' 링크(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀.": "Expand items to read details. App toggles are shared with A3. Expanding Memory reveals Delete all memories. Deleting 2 in A3 reduces the total from 11 to 9. Back returns to the source panel.",
  "(참가자 모드 전용) 상황 2 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.": "Scenario B introduction (participant mode). Let the participant read it and start independently.",
  "[목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 이번엔 채팅으로 Gemini에게 직접 요청해서 정민 관련 정보를 정리해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 어떤 문장을 보내도 같은 결과 카드가 나오는 프로토타입이며, 입력한 문장은 자동 기록됩니다.": "Present the goal: Gemini remembers information about Jeongmin; ask it directly in chat to manage that information. If A ran first, explain that this is a separate scenario. The input is empty. Let the participant compose their own request (or type exactly what they dictate when screen sharing). Any request produces the same prototype result; the entered request is recorded.",
  "클릭 가능 — <b>입력창</b>(자유 입력), <b>전송 버튼</b>(글자를 입력해야 활성화, Enter로도 전송).": "Free text input. Send activates when text is entered; Enter also sends.",
  "[직접 시도] 먼저 묻지 말고 살펴보며 처리하게 두세요. 기본값이 '전체 선택'이라 바로 처리를 눌러도 삭제·차단 차이를 이해했다는 근거는 아니에요. 항목을 펼쳤는지, 체크를 바꿨는지를 관찰하세요. 처리 전에 멈춰서 고민하면 그때 '이 목록이 생각하신 범위와 비교하면 어떤가요?'": "Observe before asking questions. All items are selected by default, so immediate processing does not prove they understand deletion versus blocking. Observe expansion and selection changes. If they hesitate, ask how this list compares with their expectations.",
  "B1에서 전송하면 약 1.2초 응답 대기 후 카드가 나타납니다. 클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 항목별 <b>체크박스</b>, <b>선택 항목 처리/취소</b>. 그룹 라벨 '삭제돼요'/'참조만 차단돼요'를 알아차리는지가 관찰 포인트. 아무것도 선택하지 않으면 처리 버튼 비활성.": "The card appears after a 1.2-second wait. Select all, expand items, change checkboxes, process, or cancel. Observe whether they notice the deletion and blocking group labels. Processing is disabled when nothing is selected.",
  "[관찰만] 먼저 묻지 마세요. '지금 확인하기'를 누르는지, 그냥 끝내는지가 관찰값입니다(참가자 모드에서는 '과제 완료'로 바로 끝낼 수 있어요). 누르지 않았다고 실패가 아니에요 — 확인 행동은 따로 기록합니다. [이해 확인 — 참가자가 끝났다고 한 뒤] ① '방금 무엇이 처리됐나요?' ② 'Gmail과 Calendar에 있던 정민 관련 정보는 지금 어떤 상태일까요?'": "Observe without prompting whether they verify the result or simply finish. Not verifying is not a failure; record it separately. After they finish, ask what was processed and what state the Gmail and Calendar information is now in.",
  "클릭 가능 — <b>'지금 확인하기'</b>(누르기까지 시간 자동 기록), <b>'취소'</b>(처리 이전으로 되돌리고 B2로 복귀). 결과 문구는 B2에서 고른 항목에 맞춰 바뀝니다.": "Verify now records time to verification. Cancel restores the previous state and returns to B2. Results reflect the selected items.",
  "참가자가 스스로 들어온 경우의 확인 화면입니다. '이 화면에서 무엇을 알 수 있나요?' → '정민 관련 정보 중 아직 남아 있는 건 무엇일까요?' 신뢰에 관한 질문은 여기서 하지 말고 마무리 단계로 미루세요.": "Observe only if the participant navigates here independently. Ask what they can learn from this screen and which information about Jeongmin remains. Save questions about trust for the closing discussion.",
  "클릭 가능 — <b>'채팅으로 돌아가기'</b>(B5로 이동), ← 로 B3 복귀.": "Return to chat opens B5. Back returns to B3.",
  "[Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 두 Phase를 모두 마쳤다면 마무리 질문을 한 번에 하나씩: ① '지금 이런 기능에 대해 어떻게 느끼세요?' ② 'AI가 이렇게 정보를 쓴다는 걸 전에 알고 계셨나요?' ③ '두 방식(답변에서 바로 관리 / 채팅으로 요청) 중 어느 쪽이 나았나요? 왜요?'": "When the participant finishes, run the post-task survey on ease, perceived completion, confidence, and amount of information. After both phases, ask one question at a time: How do they feel about the feature? Did they know AI could use information this way? Which method did they prefer, managing within an answer or requesting changes in chat, and why?",
  "클릭 지점 없음 — 처리 결과 카드와 마무리 답변만 표시됩니다.": "No further task interaction; the result card and final response are displayed.",
  "세션 종료 화면입니다. SUS(선택)를 진행한 뒤 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고, 다음 참가자는 '새 참가자로 시작'을 누르세요.": "The session has ended. Optionally administer SUS, save JSON or CSV from the panel, then start a new participant.",
  "참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송).": "Participant mode offers download and copy; automatic sending is used when configured.",
  "채팅으로 Gemini에게 직접 요청해서": "ask Gemini directly in chat",
  "요청 문장은 평소 말하듯 자유롭게 입력하면 돼요. 생각나는 것을 소리 내어 말하면서 진행해 주세요.": "Type your request in your own words, as you normally would. Please think aloud as you go.",
  "진행자 패널 · 과제 기반 UT": "Moderator panel · Task-based usability test",
  "A(인라인 데이터 관리)와 B(채팅 자연어 삭제)는 별개의 두 메커니즘이에요. 참가자가 직접 조작하고, 진행자는 목표만 제시한 뒤 관찰 → 이해 확인 순서로 진행합니다. 조작 방법·선택지를 먼저 알려주지 마세요.": "A (inline data management) and B (deletion through chat) are separate mechanisms. Present the goal, let the participant interact, then check their understanding. Do not explain controls or suggest options first.",
  "채팅으로 Gemini에게 직접 요청해서 '정민' 관련 정보를 정리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.": "Ask Gemini directly in chat to manage information about Jeongmin. When you feel finished, select “Finish task”."
});
  Object.assign(messages, {
  "[과제 전 질문] 과제를 주기 전에 먼저: '정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?' — 채팅으로 요청하는 방법을 스스로 떠올리는지 기록하세요. [목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 이번엔 채팅으로 Gemini에게 직접 요청해서 정민 관련 정보를 정리해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 요청에 '정민'이나 '그 사람' 같은 대상이 없으면 Gemini가 '어떤 정보를 정리할까요?'라고 되묻고, 대상을 말하면 정리 목록이 나와요. 입력한 문장과 되묻기 횟수는 자동 기록됩니다.": "[Before the task] First ask: “If you wanted Gemini to stop using information about Jeongmin, what would you normally do?” Record whether they think of asking in chat. [Goal] (If A came first: “This is a new scenario, separate from the previous one.”) “Gemini remembers information about someone named Jeongmin. This time, ask Gemini directly in chat to manage that information.” The input is empty; let the participant type (in screen-share sessions, type exactly what they say). If the request names no target such as “Jeongmin” or “that person”, Gemini asks “Which information should I manage?”; once a target is named, the list appears. Requests and clarification counts are logged automatically.",
  "[직접 시도] 먼저 묻지 말고 살펴보며 처리하게 두세요. 목록은 실제처럼 36건(Memory 3 · Gmail 24 · Calendar 9)이고 출처별로 접혀 있어요. 기본값이 '전체 선택'이라 바로 처리를 눌러도 삭제·차단 차이를 이해했다는 근거는 아니에요. 펼쳤는지, '더보기'를 눌렀는지, 체크를 바꿨는지, 양이 많다는 반응이 있는지 관찰하세요. 처리 전에 멈춰서 고민하면 그때 '이 목록이 생각하신 범위와 비교하면 어떤가요?'": "[Try] Let them review and process without asking first. The list is realistic: 36 items (Memory 3 · Gmail 24 · Calendar 9), collapsed by source. Everything is selected by default, so processing immediately is not evidence that they understood delete vs. block. Observe whether they expand groups, use “Show more”, change selections, or react to the volume. If they pause before processing, ask: “How does this list compare with what you expected?”",
  "B1에서 전송하면 약 1.2초 응답 대기 후 카드가 나타납니다. 클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 출처별 <b>체크박스</b>(출처 단위로 선택), 펼친 뒤 <b>'+N건 더보기'</b>, <b>선택 항목 처리/취소</b>. 그룹 라벨 '삭제돼요'/'참조만 차단돼요'를 알아차리는지가 관찰 포인트. 아무것도 선택하지 않으면 처리 버튼 비활성.": "Appears after about 1.2 seconds. Available: Select all, expand by source, per-source checkboxes, “+N more” inside an expanded group, Process selected / Cancel. Watch whether they notice the “Deleted” vs. “Reference blocked” labels. Process is disabled when nothing is selected.",
  "[관찰만] 먼저 묻지 마세요. '지금 확인하기'를 누르는지, 그냥 끝내는지가 관찰값입니다(참가자 모드에서는 '과제 완료'로 바로 끝낼 수 있어요). 누르지 않았다고 실패가 아니에요 — 확인 행동은 따로 기록합니다. [이해 확인 — 참가자가 끝났다고 한 뒤] ① '방금 무엇이 처리됐나요?' ② 'Gmail과 Calendar에 있던 정민 관련 정보는 지금 어떤 상태일까요?' ③ (Memory를 지웠다면) '지운 정보 중 어딘가 남아 있는 게 있을까요?' — 결과 카드의 보관 예외 안내(검토된 대화 사본 최대 3년)를 읽었는지가 이해 판정 기준이에요. '그래도 다 지워졌을지 의심된다'는 반응은 이해 실패가 아니라 신뢰 관찰값으로 따로 기록하세요.": "[Observe only] Do not ask first. Whether they select “Check now” or simply finish is the observation (in participant mode they can finish with “Finish task”). Not selecting it is not a failure; verification is recorded separately. [Comprehension — after they say they are done] ① “What was just processed?” ② “What is the status of the Jeongmin-related information in Gmail and Calendar now?” ③ (If Memory was deleted) “Is anything you deleted still kept somewhere?” — Whether they read the retention notice (reviewed chat copies kept up to 3 years) is the comprehension criterion. Doubt such as “I’m not sure it’s really all gone” is not a comprehension failure; record it separately as a trust observation.",
  "'정민' 관련 정보 36건을 찾았어요": "Found 36 items related to Jeongmin",
  "출처별로 묶었어요 · 펼치면 최근 항목을 볼 수 있어요": "Grouped by source · Expand to see recent items",
  "답변에 쓰인 2건 포함": "Includes 2 used in the response",
  "접기": "Show less",
  "ⓘ 사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요 (Gemini 개인정보 보호 정책)": "ⓘ Copies of chats reviewed by people are kept separately from your account for up to 3 years (Gemini Privacy Notice)",
  "사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요": "Copies of chats reviewed by people are kept separately from your account for up to 3 years",
  "삭제됨 — 답변에 더 이상 쓰이지 않아요": "Deleted — no longer used in responses",
  "어떤 정보를 정리할까요? 사람 이름이나 주제를 함께 알려 주세요. 예: '정민 관련 정보 지워줘'": "Which information should I manage? Tell me a person or topic, for example: “Delete information about Jeongmin.”",
  "외 15건 — 전체 목록은 Personal Intelligence에서 볼 수 있어요": "15 more — see the full list in Personal Intelligence",
  "외 3건 — 전체 목록은 Personal Intelligence에서 볼 수 있어요": "3 more — see the full list in Personal Intelligence",
  "2025.3.14 대화 \"정민과 트러플 리조또\" 언급": "Chat on 2025.3.14 mentioned “truffle risotto with Jeongmin”",
  "2025.1.20 대화 \"정민이 좋아하던 재즈바\" 언급": "Chat on 2025.1.20 mentioned “the jazz bar Jeongmin liked”",
  "2024.12.24 대화 \"정민 선물 고민\" 언급": "Chat on 2024.12.24 mentioned “gift ideas for Jeongmin”",
  "[대한항공] 탑승객 2명 예약 확인 (정민 포함) · 2024.10.8": "[Korean Air] Booking for 2 passengers confirmed (incl. Jeongmin) · 2024.10.8",
  "[CGV] 2인 예매 확인 · 2024.9.21": "[CGV] 2 tickets confirmed · 2024.9.21",
  "[카카오페이] 정민님에게 송금 완료 · 2024.9.3": "[KakaoPay] Transfer to Jeongmin completed · 2024.9.3",
  "[에어비앤비] 공동 게스트: 정민 · 2024.8.12": "[Airbnb] Co-guest: Jeongmin · 2024.8.12",
  "[네이버 예약] 와인바 2명 예약 확정 · 2024.7.6": "[Naver Booking] Wine bar for 2 confirmed · 2024.7.6",
  "[마켓컬리] 선물 배송 완료 (받는 분: 정민) · 2024.6.1": "[Kurly] Gift delivered (recipient: Jeongmin) · 2024.6.1",
  "[인터파크] 공연 예매 2매 · 2024.5.18": "[Interpark] 2 concert tickets · 2024.5.18",
  "2024.10 일정 \"제주 여행 (정민)\"": "Event 2024.10 “Jeju trip (Jeongmin)”",
  "2024.9 일정 \"영화 — 정민\"": "Event 2024.9 “Movie — Jeongmin”",
  "2024.8 일정 \"강릉 1박\"": "Event 2024.8 “Gangneung overnight”",
  "2024.7 일정 \"와인바\"": "Event 2024.7 “Wine bar”"
});
  Object.assign(messages, {
  "[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '이 답변에 정민 이야기가 왜 나왔는지 확인하고, 이 정보를 원하는 대로 처리해 보세요.' 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 과제 바가 이 문구로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.": "[Try] The response includes a past memory involving Jeongmin that the participant never mentioned. When it has fully appeared, first ask “What do you think of that response?” After hearing the first reaction, give the goal: “Find out why Jeongmin came up in this response, and handle this information the way you want.” Do not reveal where or how to do it, or where the source badge is (in participant mode the task bar switches to this goal once the response finishes). Surprise is an intended reaction, not a failure. [Help] If stuck for over 60 seconds, ask: “Is there a way to find out why this response appeared?” If still stuck, open A3 with the moderator controls and record it as “after help”.",
  "[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면: '이 정보가 앞으로 어떻게 되길 원하세요? 원하는 상태로 만들어 보세요.' (차단·삭제 같은 선택지를 먼저 말하지 마세요.) [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 각각 어떻게 될까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'": "[Try] Let them look first without comment. If they do not act on their own: “How would you like this information to be handled from now on? Go ahead and set it up that way.” (Do not mention options such as blocking or deleting.) [Comprehension — after acting, without explanation] ① “What just changed?” ② (If a toggle was turned off) “Which information will this toggle affect?” ③ (If something was deleted) “What happens to what you deleted and to what you turned off?” ④ “Can you explain now why that response appeared?”",
  "[Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 두 Phase를 모두 마쳤다면 마무리 질문을 한 번에 하나씩: ① '지금 이런 기능에 대해 어떻게 느끼세요?' ② 'AI가 이렇게 정보를 쓴다는 걸 전에 알고 계셨나요?' ③ '두 방식(답변에서 바로 관리 / 채팅으로 요청) 중 어느 쪽이 더 나았나요?' ④ (답을 들은 뒤) '왜 그렇게 느끼셨나요?' ⑤ '진행하면서 가장 헷갈리거나 불편했던 순간은 언제였나요?'": "[End of phase] When the participant says they are done (Finish task in participant mode), run the post-task questions (SEQ, perceived completion, confidence, information amount). After both phases, ask the wrap-up questions one at a time: ① “How do you feel about this kind of feature now?” ② “Did you know before that AI could use information like this?” ③ “Which approach worked better for you — managing it from the response, or asking in chat?” ④ (After the answer) “What made you feel that way?” ⑤ “When was the most confusing or frustrating moment during the session?”",
  "Gemini에게 저녁 약속 장소를 물어보고 답변을 살펴보세요.": "Ask Gemini for a dinner venue and review the response.",
  "이 답변에 정민 이야기가 왜 나왔는지 확인하고, 이 정보를 원하는 대로 처리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.": "Find out why Jeongmin came up in this response, and handle this information the way you want. When you feel finished, select “Finish task”.",
  "Revamp 컨셉 테스트": "Revamp concept test",
  "UX 리서치용으로 만든 Revamp 컨셉 프로토타입": "revamp concept prototype for UX research",
  "[관찰만] 먼저 묻지 마세요. '지금 확인하기'를 누르는지, 그냥 끝내는지가 관찰값입니다(참가자 모드에서는 '과제 완료'로 바로 끝낼 수 있어요). 누르지 않았다고 실패가 아니에요 — 확인 행동은 따로 기록합니다. [이해 확인 — 참가자가 끝났다고 한 뒤] ① '방금 무엇이 처리됐나요?' ② 'Gmail과 Calendar에 있던 정민 관련 정보는 지금 어떤 상태일까요?' ③ (Memory를 지웠다면) '지운 정보는 지금 어떻게 됐을까요?' — 결과 카드의 보관 예외 안내(검토된 대화 사본 최대 3년)를 읽었는지가 이해 판정 기준이에요. '그래도 다 지워졌을지 의심된다'는 반응은 이해 실패가 아니라 신뢰 관찰값으로 따로 기록하세요.": "[Observe only] Do not ask first. Whether they select “Check now” or simply finish is the observation (in participant mode they can finish with “Finish task”). Not selecting it is not a failure; verification is recorded separately. [Comprehension — after they say they are done] ① “What was just processed?” ② “What is the status of the Jeongmin-related information in Gmail and Calendar now?” ③ (If Memory was deleted) “What has happened to the information you deleted?” — Whether they read the retention notice (reviewed chat copies kept up to 3 years) is the comprehension criterion. Doubt such as “I’m not sure it’s really all gone” is not a comprehension failure; record it separately as a trust observation."
});
  Object.assign(messages, {
  "[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요.": "[Post-task survey · Dinner scenario] Before showing the survey, ask aloud first: “Of the information about Jeongmin, what is gone now and what remains?” (A-12, recorded by the moderator). Then let the participant answer the 4 on-screen questions and select Next. Do not explain the screen.",
  "클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요.": "Available: answer options, Next (enabled when every question is answered). Answers are saved to the log and Firebase automatically.",
  "[과제 직후 설문 · 채팅 삭제 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(B-09, 진행자 기록) 그다음 참가자가 화면의 설문 5문항에 직접 답하고 '다음'을 누르게 두세요.": "[Post-task survey · Chat deletion scenario] Before showing the survey, ask aloud first: “Of the information about Jeongmin, what is gone now and what remains?” (B-09, recorded by the moderator). Then let the participant answer the 5 on-screen questions and select Next.",
  "[선택 · SUS] 링크에 sus=1이 있을 때만 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요.": "[Optional · SUS] Shown only when the link includes sus=1. Let the participant answer all 10 items. Run the wrap-up questions aloud after this screen.",
  "클릭 가능 — 문항별 1~5, <b>다음</b>(10문항 모두 답하면 활성화).": "Available: 1–5 for each item, Next (enabled when all 10 are answered).",
  "잠깐 설문": "Quick survey",
  "마지막 설문": "Final survey",
  "방금 상황에 대해 알려 주세요": "Tell us about the scenario you just finished",
  "저녁 약속 장소 찾기": "Find a place for dinner",
  "채팅으로 정보 지우기": "Remove information through chat",
  "오늘 사용한 기능 전체에 대해 알려 주세요": "Tell us about the features you used today",
  "각 문장에 얼마나 동의하는지 골라 주세요": "Choose how much you agree with each statement",
  "방금 과제는 전반적으로 얼마나 어렵거나 쉬웠나요?": "Overall, how difficult or easy was the task you just did?",
  "원하시던 상태로 처리를 마쳤다고 느끼시나요?": "Do you feel you finished handling it the way you wanted?",
  "방금 처리한 결과가 생각하신 대로 반영됐다고 얼마나 확신하시나요?": "How confident are you that the result was applied the way you expected?",
  "출처 패널과 전체 관리 화면에서 보여준 정보의 양은 어땠나요?": "How was the amount of information shown in the sources panel and the full management screen?",
  "처리 목록과 처리 결과에서 보여준 정보의 양은 어땠나요?": "How was the amount of information shown in the list and the results?",
  "처리할 항목을 확인하고 고르는 과정이 번거로웠나요?": "Was reviewing and choosing the items to process a hassle?",
  "매우 어려움": "Very difficult",
  "매우 쉬움": "Very easy",
  "전혀 확신하지 않음": "Not at all confident",
  "매우 확신함": "Very confident",
  "너무 적다": "Too little",
  "너무 많다": "Too much",
  "4 = 적절하다": "4 = About right",
  "전혀 번거롭지 않다": "Not a hassle at all",
  "매우 번거롭다": "A big hassle",
  "전혀 동의 안 함": "Strongly disagree",
  "매우 동의함": "Strongly agree",
  "예": "Yes",
  "아니오": "No",
  "모르겠음": "Not sure",
  "다음": "Next",
  "모든 문항에 답하면 '다음'을 누를 수 있어요": "Answer every question to continue",
  "이 기능을 자주 사용하고 싶을 것 같다.": "I think that I would like to use this feature frequently.",
  "이 기능은 불필요하게 복잡하다.": "I found this feature unnecessarily complex.",
  "이 기능은 사용하기 쉽다.": "I thought this feature was easy to use.",
  "이 기능을 사용하려면 기술 지원이 필요할 것 같다.": "I think I would need technical support to use this feature.",
  "이 기능의 여러 부분이 잘 통합되어 있다.": "I found the various parts of this feature well integrated.",
  "이 기능에 불일치나 혼동이 너무 많다.": "I thought there was too much inconsistency in this feature.",
  "대부분의 사람들이 이 기능을 쉽게 배울 수 있을 것 같다.": "I would imagine most people would learn to use this feature quickly.",
  "이 기능은 사용하기 번거롭다.": "I found this feature very cumbersome to use.",
  "이 기능을 사용할 때 자신감이 있다.": "I felt very confident using this feature.",
  "이 기능을 사용하기 전에 많은 것을 배워야 한다.": "I needed to learn a lot of things before I could get going with this feature.",
  "참가자 링크 만들기": "Create participant link",
  "코드": "Code",
  "순서": "Order",
  "기기": "Device",
  "참가자 기기": "Participant’s device",
  "진행자 기기(대면)": "Moderator’s device (in person)",
  "언어": "Language",
  "SUS 포함": "Include SUS",
  "복사": "Copy",
  "복사됨": "Copied",
  "결과 CSV": "Results CSV",
  "코드가 홀수면 A→B, 짝수면 B→A로 자동 선택돼요. 참가자는 코드를 입력하지 않아요.": "Odd codes default to A→B and even codes to B→A. Participants never type a code.",
  "전체 결과 CSV 받기": "Download all results (CSV)",
  "Firebase에 저장된 모든 세션의 설문 응답·로그 값을 한 파일로 받아요 (엑셀 '자동 수집' 시트에 붙여넣기)": "Download survey answers and log values for every session saved in Firebase (paste into the spreadsheet’s import sheet)",
  "불러오는 중…": "Loading…",
  "저장된 결과가 없어요": "No saved results",
  "Firebase에 연결되지 않았어요": "Not connected to Firebase",
  "불러오지 못했어요. Firebase 보안 규칙을 확인해 주세요.": "Could not load. Check the Firebase security rules."
});
  Object.assign(messages, {"참가자에게 연구 고지를 읽게 하고 '시작하기'를 누르세요. 패널의 '참가자 링크 만들기'로 만든 링크로 열면 참가자 코드가 자동으로 들어가요(직접 열었다면 코드를 입력). 이때부터 기록이 시작됩니다. 시작 전 안내: '디자인을 평가하는 자리지 참가자분을 평가하는 게 아니에요. 정답은 없고, 생각나는 걸 소리 내어 말하면서 진행해 주세요.'": "Ask the participant to read the research notice, then select Start. Links made with “Create participant link” fill in the participant code automatically (type it only if you opened the page directly). Logging starts now. Before starting, say: “We’re evaluating the design, not you. There are no right answers — please think aloud as you go.”"});
  Object.assign(messages, {"[SUS] 마지막 상황의 설문 다음에 항상 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요.": "[SUS] Always shown after the final scenario’s survey. Let the participant answer all 10 items. Run the wrap-up questions aloud after this screen.", "메뉴": "Menu", "임시 채팅": "Temporary chat"});
  let language = 'ko';
  try { language = localStorage.getItem('ut-language') === 'en' ? 'en' : 'ko'; } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'ko' || requested === 'en') language = requested;
  const sources = new WeakMap();
  function english(text) {
    if (messages[text]) return messages[text];
    return text
      .replace(/^(\d+)개 세션을 받았어요.*$/, '$1 sessions downloaded (use startedAt to tell repeated codes apart)')
      .replace(/^· (\d+)건$/, '· $1 items')
      .replace(/^\+ (\d+)건 더보기$/, '+ Show $1 more')
      .replace(/^(\d+(?:\.\d+)?)초$/, '$1s')
      .replace(/^(\d+)초 전$/, '$1s ago').replace(/^(\d+)분 전$/, '$1m ago').replace(/^(\d+)시간 전$/, '$1h ago')
      .replace(/^지표(\d)$/, 'Metric $1')
      .replace(/^(.+) (\d+)건을 삭제했어요$/, '$2 items deleted from $1')
      .replace(/^(.+) (\d+)건 — 원본은 (.+)에 그대로 있고, 앞으로 답변에 사용하지 않아요$/, '$1: $2 items — originals remain in $3 and will no longer be used in responses')
      .replace(/ 참조 끔$/, ' disabled')
      .replace(/참가자 모드/g, 'Participant mode').replace(/진행자 모드/g, 'Moderator mode')
      .replace(/참가자 /g, 'Participant ').replace(/ 화면을 실시간으로 보는 중/g, ' — watching live')
      .replace(/· 세션 종료됨/g, '· Session ended').replace(/세션 종료됨/g, 'Session ended')
      .replace(/실시간 · 조작 불가/g, 'Live · View only').replace(/ 화면 /g, ' screen ')
      .replace(/ · 시작 /g, ' · Started ').replace(/(\d+)개/g, '$1 events').replace(/ \(중단됨\)/g, ' (interrupted)');
  }
  function t(text) { return language === 'en' ? english(text) : text; }
  function updateText(node) {
    const current = node.nodeValue;
    const previous = sources.get(node);
    const source = previous && current === previous.rendered ? previous.source : current;
    const trimmed = source.trim();
    const translated = t(trimmed);
    const rendered = translated === trimmed ? source : source.replace(trimmed, translated);
    sources.set(node, { source, rendered });
    if (current !== rendered) node.nodeValue = rendered;
  }
  function render() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement.closest('script, style, [data-no-translate], #logFeed')) updateText(node);
    }
    const input = document.getElementById('pidInput');
    input.placeholder = t('예: P03');
    document.documentElement.lang = language;
    document.querySelectorAll('[data-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.label)); el.title = t(el.dataset.label);
    });
    document.getElementById('languageSelect').value = language;
    document.querySelectorAll('.keyboard').forEach(keyboard => {
      const korean = 'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ';
      const latin = 'qwertyuiopasdfghjklzxcvbnm';
      keyboard.querySelectorAll('.kb-key').forEach(key => {
        const value = key.textContent.trim();
        const index = language === 'en' ? korean.indexOf(value) : latin.indexOf(value);
        if (value.length === 1 && index >= 0) key.textContent = (language === 'en' ? latin : korean)[index];
      });
    });
  }
  const observer = new MutationObserver(() => {
    observer.disconnect(); render(); observe();
  });
  function observe() { observer.observe(document.documentElement, {childList:true, characterData:true, subtree:true}); }
  function setLanguage(next) {
    if (!['ko', 'en'].includes(next)) return;
    language = next;
    try { localStorage.setItem('ut-language', next); } catch (_) {}
    // Finish any typing animation using the selected language on its next entry.
    const typed = document.getElementById('a1bTyped');
    if (typed) {
      delete typed.dataset.full;
      typed.textContent = t('요즘 새로 생긴 이탈리안 레스토랑 추천해줘');
    }
    if (window.App) App.refreshLanguage();
    render();
    if (window.Logger && Logger.active) Logger.log('language_change', {language});
  }
  window.I18n = {t, setLanguage, get language(){ return language; }};
  render(); observe();
})();
