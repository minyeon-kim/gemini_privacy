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
  "리뱀프 컨셉 테스트": "Revamp concept test",
  "영업 중 · 오후 10:00에 영업 종료": "Open · Closes 10:00 PM",
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
  "는 화이트와 우드톤의 깔끔한 인테리어와 통창으로 탁 트인 센트럴파크 뷰를 즐길 수 있는 감성적인 이탈리안 레스토랑입니다.": " is an Italian restaurant with a clean white and wood interior and panoramic Central Park views through floor-to-ceiling windows.",
  "시그니처 메뉴: 쫄깃한 도우와 향긋한 바질, 탱글한 새우가 어우러진 '바질 새우 피자'": "Signature dish: basil shrimp pizza with chewy dough, fragrant basil, and juicy shrimp",
  "인기 메뉴: 꾸덕한 크림소스에 진한 풍미가 더해진 '트러플 뇨끼'": "Popular dish: truffle gnocchi in a rich, creamy sauce",
  "작년 봄에": "When you visited with",
  "정민": "Jeongmin",
  "씨와 가셨을 때 트러플 리조또를 좋아하셨었죠. 이번에도 비슷한 메뉴 어떠세요?": "last spring, you enjoyed the truffle risotto — how about something similar this time?",
  "출처 확인": "View sources",
  "· 삭제됨": "· Deleted",
  "· 참조 안 함": "· Not used",
  "2025.3.14 Gemini 채팅에서 \"정민과 트러플 리조또\" 언급": "Mar 14, 2025 chat — mentioned “truffle risotto with Jeongmin”",
  "2025.2.8 Gemini 채팅에서 \"주말 등산 코스\" 언급": "Feb 8, 2025 chat — mentioned “weekend hiking trails”",
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
  "2025.3.14 Gemini 채팅 \"정민과 트러플 리조또\" 언급": "Mar 14, 2025 chat: “truffle risotto with Jeongmin”",
  "2025.1.20 Gemini 채팅 \"정민이 좋아하던 재즈바\" 언급": "Jan 20, 2025 chat: “Jeongmin’s favorite jazz bar”",
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
  "2025.1.20 Gemini 채팅에서 \"정민이 좋아하던 재즈바\" 언급": "Jan 20, 2025 chat — mentioned “Jeongmin’s favorite jazz bar”",
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
  "세션 종료 화면이에요(SUS까지 끝난 상태). 마무리 질문과 디브리핑을 진행한 뒤, 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고 다음 참가자는 '새 참가자로 시작'을 누르세요.": "End screen (SUS is done). Run the wrap-up questions and debrief, then save with JSON/CSV in the panel and press 'Start new participant' for the next one.",
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
  "외 15건 · 전체 목록은 Personal Intelligence에서 볼 수 있어요": "15 more — see the full list in Personal Intelligence",
  "외 3건 · 전체 목록은 Personal Intelligence에서 볼 수 있어요": "3 more — see the full list in Personal Intelligence",
  "2025.3.14 Gemini 채팅 \"정민과 트러플 리조또\" 언급": "Chat on 2025.3.14 mentioned “truffle risotto with Jeongmin”",
  "2025.1.20 Gemini 채팅 \"정민이 좋아하던 재즈바\" 언급": "Chat on 2025.1.20 mentioned “the jazz bar Jeongmin liked”",
  "2024.12.24 Gemini 채팅 \"정민 선물 고민\" 언급": "Chat on 2024.12.24 mentioned “gift ideas for Jeongmin”",
  "[대한항공] 탑승객 2명 예약 확인 (정민 포함) · 2024.10.8": "[Korean Air] Booking for 2 passengers confirmed (incl. Jeongmin) · 2024.10.8",
  "[CGV] 2인 예매 확인 · 2024.9.21": "[CGV] 2 tickets confirmed · 2024.9.21",
  "[카카오페이] 정민님에게 송금 완료 · 2024.9.3": "[KakaoPay] Transfer to Jeongmin completed · 2024.9.3",
  "[에어비앤비] 공동 게스트: 정민 · 2024.8.12": "[Airbnb] Co-guest: Jeongmin · 2024.8.12",
  "[네이버 예약] 와인바 2명 예약 확정 · 2024.7.6": "[Naver Booking] Wine bar for 2 confirmed · 2024.7.6",
  "[마켓컬리] 선물 배송 완료 (받는 분: 정민) · 2024.6.1": "[Kurly] Gift delivered (recipient: Jeongmin) · 2024.6.1",
  "[인터파크] 공연 예매 2매 · 2024.5.18": "[Interpark] 2 concert tickets · 2024.5.18",
  "2024.10 일정 \"제주 여행 (정민)\"": "Event 2024.10 “Jeju trip (Jeongmin)”",
  "2024.9 일정 \"정민이랑 영화\"": "Event 2024.9 “Movie — Jeongmin”",
  "2024.8 일정 \"강릉 1박\"": "Event 2024.8 “Gangneung overnight”",
  "2024.7 일정 \"와인바\"": "Event 2024.7 “Wine bar”"
});
  Object.assign(messages, {
  "[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '이 답변에 정민 이야기가 왜 나왔는지 확인하고, 이 정보를 원하는 대로 처리해 보세요.' 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 과제 바가 이 문구로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.": "[Try] The response includes a past memory involving Jeongmin that the participant never mentioned. When it has fully appeared, first ask “What do you think of that response?” After hearing the first reaction, give the goal: “Find out why Jeongmin came up in this response, and handle this information the way you want.” Do not reveal where or how to do it, or where the source badge is (in participant mode the task bar switches to this goal once the response finishes). Surprise is an intended reaction, not a failure. [Help] If stuck for over 60 seconds, ask: “Is there a way to find out why this response appeared?” If still stuck, open A3 with the moderator controls and record it as “after help”.",
  "[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면: '이 정보가 앞으로 어떻게 되길 원하세요? 원하는 상태로 만들어 보세요.' (차단·삭제 같은 선택지를 먼저 말하지 마세요.) [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 각각 어떻게 될까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'": "[Try] Let them look first without comment. If they do not act on their own: “How would you like this information to be handled from now on? Go ahead and set it up that way.” (Do not mention options such as blocking or deleting.) [Comprehension — after acting, without explanation] ① “What just changed?” ② (If a toggle was turned off) “Which information will this toggle affect?” ③ (If something was deleted) “What happens to what you deleted and to what you turned off?” ④ “Can you explain now why that response appeared?”",
  "[Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 마무리 질문은 과제 C와 SUS까지 모두 끝난 뒤 마지막 화면에서 해요.": "[End of phase] When the participant says they are done (Finish task in participant mode), run the post-task questions (SEQ, perceived completion, confidence, information amount). Wrap-up questions come at the very end, after task C and SUS.",
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
  "이 기능을 자주 사용하고 싶다.": "I think that I would like to use this feature frequently.",
  "이 기능은 쓸데없이 복잡하다.": "I found this feature unnecessarily complex.",
  "이 기능은 사용하기 쉽다.": "I thought this feature was easy to use.",
  "이 기능을 쓰려면 다른 사람의 도움이 필요할 것 같다.": "I think I would need technical support to use this feature.",
  "이 기능의 여러 부분이 자연스럽게 잘 연결되어 있다.": "I found the various parts of this feature well integrated.",
  "이 기능에는 앞뒤가 맞지 않는 부분이 많다.": "I thought there was too much inconsistency in this feature.",
  "대부분의 사람들이 이 기능을 금방 익힐 것 같다.": "I would imagine most people would learn to use this feature quickly.",
  "이 기능은 사용하기 번거롭다.": "I found this feature very cumbersome to use.",
  "이 기능을 자신 있게 사용할 수 있었다.": "I felt very confident using this feature.",
  "이 기능을 쓰기 전에 배워야 할 것이 많았다.": "I needed to learn a lot of things before I could get going with this feature.",
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
  Object.assign(messages, {
  "[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 확인하고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (지울지, 참조만 막을지는 참가자가 고르게 두세요.) 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 과제 바가 이 문구로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.": "[Try] The response includes a past memory involving Jeongmin that the participant never mentioned. When it has fully appeared, first ask “What do you think of that response?” After hearing the first reaction, give the goal: “For context, Jeongmin is someone you’re no longer in touch with. Find out why Jeongmin came up in this response, and make sure information about Jeongmin isn’t used in responses from now on.” (Let the participant choose whether to delete or only block it.) Do not reveal where or how to do it, or where the source badge is (in participant mode the task bar switches to this goal once the response finishes). Surprise is an intended reaction, not a failure. [Help] If stuck for over 60 seconds, ask: “Is there a way to find out why this response appeared?” If still stuck, open A3 with the moderator controls and record it as “after help”.",
  "[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면 목표만 다시 말해 주세요: '앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (차단·삭제 같은 선택지나 방법은 말하지 마세요.) 조작하기 전에 '어떻게 하실 생각이세요?'로 의도를 들어 두세요(A-05). [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 각각 어떻게 될까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'": "[Try] Let them look first without comment. If they do not act on their own, only restate the goal: “Make sure information about Jeongmin isn’t used in responses from now on.” (Do not mention options such as blocking or deleting, or how to do it.) Before they act, ask “How are you planning to do that?” to capture their intent (A-05). [Comprehension — after acting, without explanation] ① “What just changed?” ② (If a toggle was turned off) “Which information will this toggle affect?” ③ (If something was deleted) “What happens to what you deleted and to what you turned off?” ④ “Can you explain now why that response appeared?”",
  "[과제 전 질문] 과제를 주기 전에 먼저: '정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?' — 채팅으로 요청하는 방법을 스스로 떠올리는지 기록하세요. [목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요. 이번엔 채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 요청에 '정민'이나 '그 사람' 같은 대상이 없으면 Gemini가 '어떤 정보를 정리할까요?'라고 되묻고, 대상을 말하면 정리 목록이 나와요. 입력한 문장과 되묻기 횟수는 자동 기록됩니다.": "[Before the task] First ask: “If you wanted information about Jeongmin to stop being used in responses, what would you normally do?” Record whether they think of asking in chat. [Goal] (If A came first: “This is a new scenario, separate from the previous one.”) “Gemini remembers information about someone named Jeongmin. Jeongmin is someone you’re no longer in touch with. This time, ask Gemini directly in chat so that information about Jeongmin isn’t used in responses from now on.” The input is empty; let the participant type (in screen-share sessions, type exactly what they say). If the request names no target such as “Jeongmin” or “that person”, Gemini asks “Which information should I manage?”; once a target is named, the list appears. Requests and clarification counts are logged automatically.",
  "참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 확인하고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.": "For context, Jeongmin is someone you’re no longer in touch with. Find out why Jeongmin came up in this response, and make sure information about Jeongmin isn’t used in responses from now on. When you feel finished, select “Finish task”.",
  "채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.": "Ask Gemini directly in chat so that information about Jeongmin isn’t used in responses from now on. When you feel finished, select “Finish task”.",
  "Gemini가 '정민'이라는 사람과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요.": "Gemini remembers information about someone named Jeongmin. Jeongmin is someone you’re no longer in touch with.",
  "이번에는": "This time,",
  "앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.": "so that information about Jeongmin isn’t used in responses from now on."
});
  Object.assign(messages, {
  "Gemini에게 저녁 약속 장소를 물어보고 답변을 살펴보세요": "Ask Gemini for a dinner venue and review the response",
  "정민은 지금은 연락하지 않는 사람이에요": "Jeongmin is someone you’re no longer in touch with",
  "답변에 정민 이야기가 왜 나왔는지 확인하기": "Find out why Jeongmin came up in the response",
  "앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기": "Make sure information about Jeongmin isn’t used in responses from now on",
  "채팅으로 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기": "Ask in chat so that information about Jeongmin isn’t used in responses from now on",
  "설정이 바뀌었어요. 다음 답변부터 반영돼요": "Settings updated. Applies to future responses",
  "응답이 저장됐어요. 진행자에게 알려 주세요.": "Your answers have been saved. Please let the moderator know.",
  "저장에 실패했어요. 아래 버튼으로 기록을 받아 진행자에게 보내 주세요.": "Saving failed. Use the buttons below to download the log and send it to the moderator.",
  "최근 답변에 쓰인 2건 포함": "Includes 2 used in a recent response",
  "저녁 약속 상황에 대해 알려 주세요": "Tell us about the dinner scenario",
  "답변에 나온 정민 관련 정보를 확인하고 처리한 과정을 떠올리며 답해 주세요": "Think about how you checked and handled the Jeongmin-related information in the response",
  "정민 이야기가 나온 이유를 확인하고, 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?": "How difficult or easy was it to find out why Jeongmin came up and to keep that information from being used?",
  "정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?": "Do you think information about Jeongmin will no longer be used in responses?",
  "앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고 얼마나 확신하시나요?": "How confident are you that Jeongmin-related information won’t appear in Gemini’s responses from now on?",
  "'이 답변에 사용된 정보' 화면에서 보여준 정보의 양은 어땠나요?": "How was the amount of information shown on the “Information used in this response” screen?",
  "채팅으로 정리한 상황에 대해 알려 주세요": "Tell us about handling it through chat",
  "채팅으로 요청해 정민 관련 정보를 처리한 과정을 떠올리며 답해 주세요": "Think about how you asked in chat and handled the Jeongmin-related information",
  "채팅으로 요청해서 정민 관련 정보를 처리하는 과정은 얼마나 어렵거나 쉬웠나요?": "How difficult or easy was it to handle the Jeongmin-related information by asking in chat?",
  "Gemini가 보여준 정민 관련 정보 목록과 처리 결과의 정보 양은 어땠나요?": "How was the amount of information in the Jeongmin list and the results Gemini showed?",
  "목록에서 처리할 항목을 확인하고 고르는 과정이 번거로웠나요?": "Was reviewing and choosing items in the list a hassle?",
  "오늘 써 본 정보 관리 기능 전체에 대해 알려 주세요": "Tell us about the information-management features you used today",
  "오늘 써 본 기능 전체(출처 확인, 답변 아래 버튼, 채팅 요청)를 떠올리며, 각 문장에 얼마나 동의하는지 골라 주세요": "Think about everything you used today (source check, the button under the answer, chat requests) and rate how much you agree with each statement"
});
  Object.assign(messages, {
  "아래 내용을 확인하고 체크해 주세요": "Please review and check the following",
  "화면·음성 녹화와 생각 말하기(think-aloud)에 동의해요": "I agree to screen and audio recording and to thinking aloud",
  "누른 위치·순서·시간, 입력한 문장, 설문 응답이 연구 목적으로 기록되는 것에 동의해요": "I agree that taps (location, order, timing), typed text, and survey answers are recorded for research",
  "원할 때 언제든 중단할 수 있다는 걸 이해했어요": "I understand I can stop at any time"
});
  Object.assign(messages, {
  "입력창을 누르면 질문이 미리 입력돼 있어요. 그대로 보내고 답변을 살펴봐 주세요.": "Tap the input — the question is already filled in. Send it as is and review the response.",
  "미리 입력된 질문을 보내고 답변을 살펴보세요": "Send the pre-filled question and review the response",
  "과제": "Task",
  "이제 이렇게 해 보세요": "Here’s what to do next",
  "확인": "OK",
  "다 됐다고 느껴지면 화면 위 '과제 완료'를 눌러 주세요": "When you feel finished, select “Finish task” at the top",
  "삭제됨": "Deleted",
  "참조 차단": "Reference blocked",
  "앞으로 답변에 쓰지 않아요": "Won’t be used in future responses",
  "Memory에서 지웠어요": "Removed from Memory",
  "원본은 Gmail에 그대로 있어요": "The originals stay in Gmail",
  "원본은 Calendar에 그대로 있어요": "The originals stay in Calendar",
  "그대로 유지됨": "Unchanged",
  "계속 답변에 쓰일 수 있어요": "May still be used in responses",
  "답변에 더 이상 쓰이지 않아요": "No longer used in responses",
  "참조 차단됨": "Reference blocked",
  "원본은 남고, 앞으로 답변에 쓰이지 않아요": "Originals remain; won’t be used in future responses",
  "정해진 질문이 입력창에 미리 채워져 있어요(고정 시나리오). 참가자가 전송을 누르게 두세요.": "The scripted question is already filled in (fixed scenario). Let the participant select Send.",
  "클릭 가능 — <b>전송 버튼</b>.": "Available: Send.",
  "[목표 제시] 상황만 읽어 주세요: '퇴근 후 소파에 앉아 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요. 입력창을 누르면 질문이 미리 입력돼 있으니, 그대로 보내고 답변을 살펴봐 주세요.' 이후 참가자가 직접 입력창을 누르게 두세요. 질문을 고정하는 이유: 모든 참가자가 같은 답변(정민 기억이 섞인 답변)을 보게 하려고.": "[Goal] Read only the scenario: “After work, you’re on the sofa and open Gemini to find a place for dinner this week. When you tap the input, the question is already filled in — send it as is and review the response.” Then let the participant tap the input. Why the question is fixed: so every participant sees the same response (one that includes a memory about Jeongmin).",
  "[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 확인하고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (지울지, 참조만 막을지는 참가자가 고르게 두세요.) 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 왼쪽 과제 패널이 '새 과제'로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.": "[Try] The response includes a past memory involving Jeongmin that the participant never mentioned. When it has fully appeared, first ask “What do you think of that response?” After hearing the first reaction, give the goal: “For context, Jeongmin is someone you’re no longer in touch with. Find out why Jeongmin came up in this response, and make sure information about Jeongmin isn’t used in responses from now on.” (Let the participant choose whether to delete or only block it.) Do not reveal where or how to do it, or where the source badge is (in participant mode a task card appears once the response finishes). Surprise is an intended reaction, not a failure. [Help] If stuck for over 60 seconds, ask: “Is there a way to find out why this response appeared?” If still stuck, open A3 with the moderator controls and record it as “after help”."
});
  Object.assign(messages, {
    "연구용 컨셉 화면이에요. 실제 Google 서비스가 아니에요.": "This is a research concept, not a real Google product.",
    "이름·일정은 모두 가상이에요.": "All names and events are fictional.",
    "정답은 없어요. 평소처럼 써 주세요.": "There are no right answers. Use it as you normally would.",
    "화면·음성 녹화와 생각 말하며 하기에 동의해요": "I agree to screen/audio recording and thinking aloud",
    "누른 위치·시간, 입력한 문장, 설문 응답 기록에 동의해요": "I agree to logging of taps, timing, typed text and survey answers",
    "언제든 중단할 수 있어요": "I can stop at any time",
    "과제": "Task", "새 과제": "New task", "과제 1 / 2": "Task 1 / 2", "과제 2 / 2": "Task 2 / 2",
    "다 됐다고 느껴지면 눌러 주세요": "Press when you feel you're done",
    "이전": "Back", "완료": "Done", "그대로 유지됨": "Kept",
    "원본은 그대로, 앞으로 답변에 안 쓰여요": "Original kept, no longer used in answers",
  });

  Object.assign(messages, {
    "앞의 상황과는 별개인 새로운 상황이에요": "This is a new situation, separate from the previous one",
    "퇴근 후 소파에 앉아, 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요.": "After work, sitting on the sofa, you open Gemini to find a place for dinner plans this week.",
    "입력창을 누르면 질문이 미리 입력돼 있어요. 그대로 보내 주세요.": "Tap the input box: the question is already filled in. Just send it.",
    "답변을 살펴봐 주세요.": "Look through the answer.",
    "생각나는 것을 소리 내어 말해 주세요.": "Please think aloud as you go.",
    "Gemini가 '정민'과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요.": "Gemini remembers information about 'Jeongmin'. Jeongmin is someone you're no longer in touch with.",
    "채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.": "Ask Gemini in the chat so that information about Jeongmin isn't used in future answers.",
    "요청 문장은 평소 말하듯 자유롭게 입력하면 돼요.": "Type your request however you'd normally say it.",
    "참여해 주셔서 감사합니다.": "Thank you for participating.",
    "진행자의 안내에 따라 마무리 질문에 답해 주세요.": "Please answer the wrap-up questions with the moderator.",
    "아래 정보는 앞으로 답변에 쓰지 않아요": "The information below won't be used in future answers",
    "과제 1을 마쳤어요": "Task 1 finished", "과제 2를 마쳤어요": "Task 2 finished", "두 과제를 모두 마쳤어요": "Both tasks finished",
    "휴대폰 화면의 짧은 설문에 답해 주세요": "Answer the short survey on the phone screen",
    "마지막 설문이에요. 휴대폰 화면에서 답해 주세요": "Last survey: answer it on the phone screen",
  });

  messages["무엇을 도와드릴까요?"] = "What should we focus on?";
  messages["나와 내 주변에 관한 정보를 바탕으로 더 유용한 답변과 추천을 받아 보세요"] = "Get more helpful responses and recommendations based on info about you and your world";
  messages["무엇을 도와드릴까요?"] = "What should we focus on?";
  messages["Gemini에게 물어보기"] = "Ask Gemini";
  messages["Gemini는 AI이며 인물 등에 관한 정보 제공 시 실수를 할 수 있습니다."] = "Gemini is AI and can make mistakes, including about people.";
  messages["개인 정보 보호 및 Gemini"] = "Your privacy & Gemini";
  messages["연결된 앱"] = "Connected Apps";
  messages["나와 내 주변에 관한 정보를 바탕으로 더 유용한 답변과 추천을 받아 보세요"] = "Get more helpful responses and recommendations based on info about you and your world";
  messages["마무리 질문은 진행자가 이어서 안내해 드릴게요."] = "The moderator will guide you through a few wrap-up questions.";
  messages["접기"] = "Show less";
  messages["참조 안 함"] = "Not used";
  messages["[톨로 비스트로] 예약이 확정되었습니다"] = "[Tolo Bistro] Booking confirmed";
  messages["[대한항공] 예약이 확정되었습니다"] = "[Korean Air] Booking confirmed";
  messages["[스시타로] 오마카세 예약 확인"] = "[Sushi Taro] Omakase booking confirmed";
  messages["[대한항공] 탑승객 2명 예약 확인 (정민 포함)"] = "[Korean Air] Booking for 2 passengers confirmed (incl. Jeongmin)";
  messages["[CGV] 2인 예매 확인"] = "[CGV] 2 tickets confirmed";
  messages["[카카오페이] 정민님에게 송금 완료"] = "[KakaoPay] Transfer to Jeongmin completed";
  messages["[에어비앤비] 공동 게스트: 정민"] = "[Airbnb] Co-guest: Jeongmin";
  messages["[네이버 예약] 와인바 2명 예약 확정"] = "[Naver Booking] Wine bar for 2 confirmed";
  messages["[마켓컬리] 선물 배송 완료 (받는 분: 정민)"] = "[Kurly] Gift delivered (recipient: Jeongmin)";
  messages["[인터파크] 공연 예매 2매"] = "[Interpark] 2 concert tickets";
  messages["출처별로 묶었어요. 펼치면 최근 항목을 볼 수 있어요."] = "Grouped by source. Expand to see recent items.";
  messages["이 답변에 쓰인 정보만 보여요. 토글을 끄면 앞으로 참조하지 않고, 펼치면 내용을 볼 수 있어요."] = "Only information used in this answer is shown. Turn a toggle off to stop using it; expand to see details.";
  messages["나머지 15건은 Personal Intelligence에서 볼 수 있어요"] = "See the other 15 in Personal Intelligence";
  messages["나머지 3건은 Personal Intelligence에서 볼 수 있어요"] = "See the other 3 in Personal Intelligence";
  messages["기능 전체에 대한 설문"] = "About the whole feature";
  messages["과제 보기"] = "View task";
  messages["접기"] = "Hide";
  messages["화면과 목소리를 녹화하고, 생각을 소리 내어 말하며 진행해요"] = "Your screen and voice are recorded, and you think aloud as you go";
  messages["누른 위치와 시간, 입력한 문장, 설문 응답이 기록돼요"] = "Taps and timing, typed text and survey answers are logged";
  messages["원할 때 언제든 중단할 수 있어요"] = "You can stop at any time";
  messages["위 내용을 확인했고 동의해요"] = "I have read the above and agree";
  messages["참여해 주셔서 감사합니다"] = "Thank you for taking part";
  messages["진행자가 마무리 질문을 이어서 드릴게요"] = "The moderator will continue with a few wrap-up questions";
  messages["어떤 정보를 정리할까요? 사람 이름이나 주제를 알려 주세요."] = "Which information should I tidy up? Tell me a name or a topic.";
  messages["정민 님과 관련해서 무엇을 도와드릴까요?"] = "What can I help you with about Jeongmin?";
  messages["네, 말씀해 주세요. 무엇을 도와드릴까요?"] = "Sure. What can I help you with?";
  messages["처리할 정보"] = "Selected";
  messages["상황 3"] = "Situation 3";
  messages["주말 계획 세우기"] = "Planning the weekend";
  messages["이번 주말에 뭘 할지 Gemini에게 물어보려고 해요. 얼마 전 이사는 안 가기로 했어요."] = "You're about to ask Gemini what to do this weekend. You recently decided not to move.";
  messages["입력창의 질문을 그대로 보내고 답변을 살펴봐 주세요."] = "Send the question in the input box and look through the answer.";
  messages["앞으로 이사 관련 정보가 답변에 쓰이지 않게 해 보세요. 방법은 자유롭게 골라도 돼요."] = "Make sure information about moving isn't used in future answers. Any method is fine.";
  messages["이번 주말에 뭐 하면 좋을까?"] = "What should I do this weekend?";
  messages["이번 주말 일정을 바탕으로 계획을 정리해 봤어요."] = "Here's a plan based on your schedule this weekend.";
  messages["이번 주말 일정을 바탕으로 계획을 정리해 봤어요. …"] = "Here's a plan based on your schedule this weekend. …";
  messages["이 답변에 쓰인 정보 관리하기"] = "Manage info used in this answer";
  messages["품질 개선을 위해 사람이 검토한 대화는 내 계정과 연결을 끊은 채 최대 3년간 보관될 수 있어요"] = "Chats reviewed by people to improve quality may be kept for up to 3 years, disconnected from your account";
  messages["답변에 안 씀"] = "Not used in answers";
  messages["답변에만 안 써요"] = "Only kept out of answers";
  messages["연동 끔"] = "Disconnected";
  messages["앱 연동 설정"] = "App connections";
  messages["건 처리"] = " items: process";
  messages["선택한 정보를 답변에 쓰지 않게 했어요"] = "Selected info won’t be used in answers";
  messages["목록에서 처리할 항목을 확인하고 고르는 과정은 얼마나 번거롭거나 수월했나요?"] = "How cumbersome or easy was it to review and pick items from the list?";
  messages["매우 번거로움"] = "Very cumbersome";
  messages["매우 수월함"] = "Very easy";
  messages["너무 적음"] = "Too little";
  messages["너무 많음"] = "Too much";
  messages["4 = 적절함"] = "4 = About right";
  messages["전혀 동의하지 않음"] = "Strongly disagree";
  messages["같은 질문 다시 하기"] = "Ask the same question again";
  messages["설정을 바꾼 뒤 같은 질문을 다시 했어요"] = "Asked the same question again after changing settings";
  messages["정보를 처리한 뒤 같은 질문을 다시 했어요"] = "Asked the same question again after handling the info";
  messages["처리한 정보"] = "Handled";
  messages["되돌리기"] = "Undo";
  messages["앱 설정을 바꿨어요"] = "App settings changed";
  messages["전체 참조 끔"] = "turned off entirely";
  messages["앱 전체 설정"] = "App-wide settings";
  messages["앱 전체 꺼짐"] = "App off";
  messages["선택한 정보"] = "Selected";
  messages["선택한 정보 처리"] = "Process selected info";
  messages["처리함"] = "Handled";
  messages["주제별로 묶었어요. 앞으로 답변에 쓰지 않을 정보를 골라 주세요."] = "Grouped by topic. Choose the info you don't want used in future answers.";
  messages["이 답변에 쓰인 정보만 보여요. 펼치면 내용을 볼 수 있어요."] = "Only info used in this answer is shown. Expand to see details.";
  messages["끄면 Gmail 전체를 답변에 쓰지 않아요. 메일은 그대로예요."] = "Turning this off stops using all of Gmail. Your emails stay as they are.";
  messages["끄면 Calendar 전체를 답변에 쓰지 않아요. 일정은 그대로예요."] = "Turning this off stops using all of Calendar. Your events stay as they are.";
  messages["끄면 메모리 전체를 답변에 쓰지 않아요. 지우려면 펼쳐서 삭제해요."] = "Turning this off stops using all memory. Expand to delete items.";
  messages["끄면 메모리 전체를 답변에 쓰지 않아요."] = "Turning this off stops using all memory.";
  messages["토글을 끄면 그 앱의 정보 전체를 답변에 쓰지 않아요. 메일과 일정 원본은 그대로예요."] = "Turning a toggle off stops using all info from that app. Original emails and events stay.";
  messages["Memory에서 지웠어요. 사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요."] = "Deleted from Memory. Human-reviewed chat copies may be kept separately for up to 3 years.";
  messages["참조만 차단돼요. 원본은 Gmail에 그대로 있어요"] = "Only blocked from use. The original stays in Gmail";
  messages["참조만 차단돼요. 원본은 Calendar에 그대로 있어요"] = "Only blocked from use. The original stays in Calendar";
  messages["Gmail 전체 참조 끔"] = "Gmail turned off entirely";
  messages["메모리 전체 삭제됨"] = "All memory deleted";
  messages["이 답변에 쓰인 메모리 2건 삭제됨"] = "2 memories used in this answer deleted";
  messages["같은 날 Calendar 일정 \"정민과 저녁\""] = "Same day as the Calendar event “Dinner with Jeongmin”";
  messages["참석자: 정민"] = "Attendee: Jeongmin";
  messages["방금 처리로 무엇이 지워지거나 막혔고 무엇이 남았는지, 얼마나 확실히 아시나요?"] = "How sure are you about what was deleted or blocked, and what remains?";
  messages["이 기능에는 일관성이 없는 부분이 너무 많다."] = "I thought there was too much inconsistency in this feature.";
  messages["앞으로 답변에 쓰지 않을 정보를 골라 주세요."] = "Choose information that shouldn't be used in future answers.";
  messages["이사 준비"] = "Moving plans";
  messages["운동"] = "Workout";
  messages["요가 클래스 예약"] = "Yoga class booking";
  messages["전세 대출 상담, 투룸 매물 알림, 집 보기 일정"] = "Lease loan consultation, listing alert, viewing appointment";
  messages["관련 정보"] = "related info:";
  messages["건을 찾았어요"] = " items found";
  messages["다음"] = "Next";
  messages["기억된 정보는 채팅으로 잊어 달라고 말할 수 있어요"] = "You can ask in chat to forget remembered info";
  messages["이사와 관련해서 무엇을 도와드릴까요?"] = "What can I help you with about moving?";
  messages["이 답변에 쓰인 메모리 삭제"] = "Delete memory used in this answer";
  messages["이 답변에 쓰인 메모리 1건 삭제됨"] = "1 memory used in this answer deleted";
  messages["과제 1 / 3"] = "Task 1 / 3";
  messages["과제 2 / 3"] = "Task 2 / 3";
  messages["과제 3 / 3"] = "Task 3 / 3";
  messages["과제 3을 마쳤어요"] = "Task 3 finished";
  messages["세 과제를 모두 마쳤어요"] = "All three tasks finished";
  messages["이사 정보를 정리한 상황"] = "Tidying up moving info";
  messages["방금 한 처리가 어떤 정보에 영향을 줬는지 얼마나 확실히 알고 계신가요?"] = "How sure are you about which information your changes affected?";
  messages["전혀 모르겠음"] = "Not sure at all";
  messages["매우 확실히 앎"] = "Completely sure";
  messages["이사는 안 가기로 했어요"] = "You decided not to move";
  messages["앞으로 이사 관련 정보가 답변에 쓰이지 않게 하기"] = "Make sure moving-related info isn't used in future answers";
  messages["토요일 오전 10시"] = "Saturday 10 AM";
  messages["토요일 오후"] = "Saturday afternoon";
  messages["일요일 오후 2시"] = "Sunday 2 PM";
  messages[": 예약해 두신 요가스튜디오 숨 클래스가 있어요."] = ": you have a class booked at Yoga Studio Sum.";
  messages[": 날씨가 맑을 예정이라 한강 산책 어떠세요?"] = ": it should be sunny, so how about a walk by the Han River?";
  messages[": 망원동 투룸 보기 일정이 있어요. 근처 카페에서 브런치를 먼저 드셔도 좋겠어요."] = ": you're scheduled to view a two-room apartment in Mangwon-dong. Maybe grab brunch at a café nearby first.";
  messages["전세 대출 상담도 알아보신다고 하셨죠. 은행 상담 예약도 함께 챙겨 두면 좋겠어요."] = "You mentioned looking into a lease loan consultation. It might help to book a bank appointment too.";
  messages["이 답변에 쓰인 정보"] = "Info used in this answer";
  messages["Memory 1건, Gmail 1건, Calendar 1건"] = "Memory 1, Gmail 1, Calendar 1";
  messages["Gmail 1건"] = "Gmail 1";
  messages["이사 관련 정보를 골라서 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?"] = "How difficult or easy was it to pick the moving-related info and stop it from being used?";
  messages["이사 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?"] = "Do you think moving-related info will no longer be used in answers?";
  messages["2025.2.20 인천→제주"] = "2025.2.20 Incheon→Jeju";
  messages["2025.9.2 Gemini 채팅에서 \"전세 대출 상담\" 언급"] = "Mentioned \"lease loan consultation\" in a 2025.9.2 chat";
  messages["[다방] 망원동 투룸 새 매물 알림"] = "[Dabang] New two-room listing in Mangwon-dong";
  messages["일요일 14:00 \"망원동 투룸 보기\""] = "Sunday 14:00 \"View two-room in Mangwon\"";
  messages["[요가스튜디오 숨] 토요일 클래스 예약 확정"] = "[Yoga Studio Sum] Saturday class confirmed";
  messages["Memory에서 지웠어요"] = "Removed from Memory";
  // v29: strings that were still Korean in the English UI
  Object.assign(messages, {
    "식당 취향": "Dining preferences",
    "정민과 저녁": "Dinner with Jeongmin",
    "정민 생일": "Jeongmin's birthday",
    "\"정민과 트러플 리조또\"": "\"Truffle risotto with Jeongmin\"",
    "\"정민이 좋아하던 재즈바\"": "\"The jazz bar Jeongmin liked\"",
    "\"이탈리안 음식 좋아함\"": "\"Likes Italian food\"",
    "[캐치테이블] 저장한 송도 레스토랑 3곳 소식": "[CatchTable] News from 3 saved Songdo restaurants",
    "끄면 Gmail 전체를 답변에 쓰지 않아요. 메일은 그대로예요.": "When off, nothing from Gmail is used in answers. Your emails stay.",
    "끄면 Calendar 전체를 답변에 쓰지 않아요. 일정은 그대로예요.": "When off, nothing from Calendar is used in answers. Your events stay.",
    "끄면 메모리 전체를 답변에 쓰지 않아요.": "When off, no memories are used in answers.",
    "Memory는 삭제돼요. Gmail과 Calendar는 원본은 그대로 두고 답변에만 안 써요.": "Memories are deleted. Gmail and Calendar keep the originals and are only left out of answers.",
    "선택한 정보 처리": "Process selected info",
    "앱 꺼짐": "App off",
    "'정민' 관련 정보 20건을 찾았어요": "Found 20 items related to Jeongmin",
    "마지막 질문": "Last questions",
    "마지막으로 세 가지만 여쭤볼게요": "Just three last questions",
    "오늘 써 본 기능들이 실제 Gemini에 있다면, 내 정보를 답변에 쓰는 것에 대해 어떻게 느끼실 것 같나요?": "If today's features were in the real Gemini, how would you feel about it using your info in answers?",
    "더 안심돼요": "More at ease",
    "비슷해요": "About the same",
    "더 불안해요": "More uneasy",
    "오늘 전에, AI가 메모리나 다른 앱 정보를 답변에 쓴다는 걸 알고 계셨나요?": "Before today, did you know AI can use memories and info from other apps in its answers?",
    "오늘 해 본 두 방법 중 더 편했던 것은 무엇인가요?": "Which of the two methods you tried today felt easier?",
    "출처 확인 화면에서 고르기": "Choosing in the sources sheet",
    "채팅으로 요청하기": "Asking in chat",
  });
  let language = 'ko';
  try { language = localStorage.getItem('ut-language') === 'en' ? 'en' : 'ko'; } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'ko' || requested === 'en') language = requested;
  const sources = new WeakMap();
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dates = s => s
    .replace(/\b(20\d\d)\.(\d{1,2})\.(\d{1,2})\b/g, (_, y, m, d) => `${MONTHS[m - 1]} ${+d}, ${y}`)
    .replace(/\b(20\d\d)\.(\d{1,2})\b(?!\.\d)/g, (_, y, m) => `${MONTHS[m - 1]} ${y}`);
  const items = n => `${n} item${n === '1' ? '' : 's'}`;
  // 진행자 패널 화면 이름 · 버튼
  Object.assign(messages, { "기록 받기(JSON)":"Download log (JSON)", "기록 받기(CSV)":"Download log (CSV)", "결과 받기(엑셀용)":"Results CSV (for Excel)",
    "과제 3 · 통합(출처 확인+관리, 채팅)":"Task 3 · Combined (sources + manage, chat)", "시작":"Start", "종료":"End",
    "상황 1 카드":"Scenario 1 card", "첫 화면":"Home", "질문 입력":"Question input", "답변 생성 중":"Generating", "답변":"Response", "출처 시트":"Sources sheet",
    "개인 인텔리전스":"Personal Intelligence", "상황 2 카드":"Scenario 2 card", "채팅 요청":"Chat request", "정리 목록":"Cleanup list", "처리 결과":"Result",
    "확인 화면":"Check screen", "과제 종료":"Task end", "과제 1 설문":"Task 1 survey", "과제 2 설문":"Task 2 survey", "마지막 질문":"Final questions",
    "사용성 설문":"SUS", "상황 3 카드":"Scenario 3 card", "처리 목록":"Processing list", "과제 3 설문":"Task 3 survey" });
  // 진행자 패널 한글화(메모리·캘린더·사용성 설문 등) 이후 문장의 영어 번역
  messages["클릭 가능 — 항목 이름=<b>데이터 펼치기(읽기 전용)</b>, 참조 켜기/끄기는 <b>앱 단위 토글</b>(이 시트엔 2건만 보이지만 끄면 해당 앱 전체 참조가 꺼짐 — 그레이존 핵심 관찰). <b>메모리는 펼쳤을 때만</b> '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초 실행취소). Gmail·캘린더는 참조 차단만 가능. <b>닫기(X)</b>·바깥 영역으로 닫기, 하단 <b>'개인 인텔리전스에서 전체 관리 →'</b> 링크."] = "Expand source names to read data. Toggles control use of the entire app, although this panel shows only 2 items. Expanding Memory reveals deletion of the 2 memories used here, with 4 seconds to undo. Gmail and Calendar can only be blocked. Close with X or the backdrop, or manage everything in Personal Intelligence.";
  messages["참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 이 화면엔 정민 관련 메모리만 골라 지우는 기능이 없고 '메모리 전체 삭제'뿐이에요. 이때의 반응은 디자인 제약에서 나온 발견으로 기록하세요. [과제 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(쉬움·완료 인식·확신도·정보량)을 진행하세요."] = "Observe only if the participant navigates here independently. Ask what this screen shows and watch their actions. This screen supports deleting all memories, not selectively deleting those about Jeongmin; record reactions to this limitation. When the participant finishes, run the post-task survey on ease, perceived completion, confidence, and amount of information.";
  messages["클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>메모리는 펼쳤을 때만</b> '메모리 전체 삭제' 링크(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀."] = "Expand items to read details. App toggles are shared with A3. Expanding Memory reveals Delete all memories. Deleting 2 in A3 reduces the total from 11 to 9. Back returns to the source panel.";
  messages["클릭 가능 — <b>입력창</b>(자유 입력), <b>전송 버튼</b>(글자를 입력해야 활성화, 엔터 키로도 전송)."] = "Free text input. Send activates when text is entered; Enter also sends.";
  messages["[과제 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(쉬움·완료 인식·확신도·정보량)을 진행하세요. 마무리 질문은 사용성 설문(SUS)까지 끝난 뒤 마지막 질문 화면에서 해요."] = "[Phase 종료] 참가자가 끝났다고 하면(Participant mode는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 마무리 질문은 SUS까지 끝난 뒤 마지막 질문 화면에서 해요.";
  messages["[마지막 질문] 사용성 설문(SUS) 다음에 나오는 닫힌 질문 3개예요(W-01~03, 자동 기록). 참가자가 답하면 이어서 말로 마무리 주관식 질문을 하나씩 하세요(W-04~W-07). 보안 종사자 질문은 그다음 종료 화면에서 해요."] = "[마지막 질문] SUS 다음에 나오는 닫힌 질문 3 events예요(W-01~03, 자동 기록). 참가자가 답하면 이어서 말로 마무리 주관식 질문을 하나씩 하세요(W-04~W-07). 보안 종사자 질문은 그다음 종료 화면에서 해요.";
  messages["[사용성 설문(SUS)] 마지막 상황의 설문 다음에 항상 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요."] = "[SUS] Always shown after the final scenario’s survey. Let the participant answer all 10 items. Run the wrap-up questions aloud after this screen.";
  // 프로토콜 수정 반영(11/21): 목표 문장, 이해 질문 위치, 마무리 질문
  messages["답변에 정민 이야기가 왜 나왔는지 알아보기"] = "Find out why Jeongmin came up in the response";
  messages["참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 알아보고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요."] = "For context, you no longer keep in touch with Jeongmin. Find out why Jeongmin came up in this response, and make sure information about Jeongmin isn't used in responses from now on.";
  messages["조작하는 동안에는 묻지 않기 · 이해 질문(A-08~A-10)은 과제 완료 뒤 설문 전에"] = "Don't ask while they work · comprehension questions (A-08–A-10) come after task completion, before the survey";
  messages["이 답변에 정민 이야기가 왜 나왔는지 설명해 주실 수 있나요? (A-08)"] = "Can you explain why Jeongmin came up in this response? (A-08)";
  messages["(앱 연동 토글을 껐을 때만) 그 토글을 끄면 어떤 정보가 영향을 받을까요? (A-09 정답: 앱 전체 · 안 껐으면 묻지 않고 \"토글 안 씀\")"] = "(Only if they turned off an app connection toggle) What information is affected when that toggle is off? (A-09 answer: the whole app · if not used, skip and record \"toggle not used\")";
  messages["(항목을 처리했을 때만) 지운 것과 '답변에 안 씀'으로 처리한 것은 각각 어떻게 될까요? (A-10 정답: 지운 것은 사라짐 · 답변에 안 씀은 원본은 남고 답변에만 안 쓰임)"] = "(Only if they processed items) What happens to what you deleted, and to what you set to 'not used in responses'? (A-10 answer: deleted = gone · not used = original stays, only left out of responses)";
  messages["(화면에서 고른 답을 보며) 그렇게 고르신 이유는요? — 지금 느낌(W-01), 더 편했던 방법(W-03) 순서로 (W-04)"] = "(Looking at their on-screen answers) Why did you choose that? — current feeling (W-01), then preferred method (W-03) (W-04)";
  messages["(스스로 들어왔을 때만) 이 화면은 무엇을 보여 주는 것 같으세요?"] = "(Only if they came here on their own) What do you think this screen shows?";
  messages["보관 안내(검토 사본 최대 3년)를 읽는지 · 묻지 않고 관찰 (B-18)"] = "Whether they read the retention note (reviewed copies kept up to 3 years) · observe, don't ask (B-18)";
  messages["요청하신 범위와 실제로 처리된 범위를 비교하면 어땠나요? (B-15)"] = "How did the scope you asked for compare with what was actually processed? (B-15)";
  messages["[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 알아보고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (지울지, 답변에만 안 쓰게 할지는 참가자가 고르게 두세요.) 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 왼쪽 과제 패널이 '새 과제'로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요."] = "[Try it] The response mixes in past memories of 'Jeongmin', whom the participant never mentioned. When the response finishes, wait a moment, ask 'What do you think about this response?' first, and after the first reaction give the goal: 'For context, you no longer keep in touch with Jeongmin. Find out why Jeongmin came up in this response, and make sure information about Jeongmin isn't used in responses from now on.' (Let the participant choose whether to delete or only keep it out of responses.) Don't point out where or how to act, or where the 'Sources' badge is (in participant mode the task panel on the left changes to 'New task' when the response finishes). Surprise is the intended reaction here, not a failure. [Help rule] If stuck for over 60 seconds, hint once: 'Is there a way to find out why this response came out this way?' If they still can't find it, open A3 via the shortcut and mark 'after help' on the sheet.";
  messages["[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 출처 시트는 주제(정민, 식당 취향)별로 묶여 있고, 항목마다 골라 처리하거나 아래 '앱 연동 설정'에서 앱을 통째로 끌 수 있어요. 조작하기 전에 '어떻게 하실 생각이세요?'로 의도를 들어 두세요(A-05). 정민만 고르는지, 식당 취향까지 막는지는 A-19, A-20에 자동 기록돼요. [이해 질문은 과제 뒤] 조작하는 동안에는 묻지 마세요. 토글 범위(A-09)와 삭제·답변에 안 씀 차이(A-10)는 '과제 완료'를 누른 뒤 설문 전에 조건에 맞을 때만 물어요(과제 1 설문 화면 안내 참고)."] = "[Try it] Let them look around without comment first. The sources sheet is grouped by topic (Jeongmin, restaurant taste); they can process items one by one, or turn a whole app off under 'App connection settings'. Before they act, ask 'What are you planning to do?' to capture intent (A-05). Whether they pick only Jeongmin or also restaurant taste is logged in A-19 and A-20. [Comprehension questions come after the task] Don't ask while they work. Toggle scope (A-09) and the difference between deleted and not used in responses (A-10) are asked after they press 'Finish task', before the survey, only when they apply (see the Task 1 survey screen guide).";
  messages["참가자가 스스로 들어온 경우의 확인 화면입니다. '이 화면은 무엇을 보여 주는 것 같으세요?' 보관 안내를 읽는지는 묻지 말고 관찰만 하세요(B-18). 신뢰에 관한 질문은 여기서 하지 말고 마무리 단계로 미루세요."] = "The check screen, only when the participant came here on their own. 'What do you think this screen shows?' Don't ask whether they read the retention note—just observe (B-18). Save trust questions for the wrap-up.";
  messages["[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 이어서 이해 질문 A-08~A-10을 조건에 맞는 것만 하나씩 묻고, 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요."] = "[Post-task survey · dinner scenario] Before showing the survey, ask aloud first: 'Of the information about Jeongmin, what is gone now and what remains?' (A-12, moderator records) Then ask comprehension questions A-08–A-10 one at a time, only those that apply, and then let the participant answer the 4 on-screen questions and press 'Next' themselves. Don't explain the screen.";
  messages["[마지막 질문] 사용성 설문(SUS) 다음에 나오는 닫힌 질문 3개예요(W-01~03, 자동 기록). 참가자가 답하면 화면에서 고른 이유를 묻고(W-04), 이어서 W-05~W-07을 하나씩 하세요. 화면에서 이미 고른 질문은 말로 다시 묻지 않아요. 보안 종사자 질문은 그다음 종료 화면에서 해요."] = "[Final questions] Three closed questions shown after the SUS (W-01–03, logged automatically). After they answer, ask why they chose those answers (W-04), then W-05–W-07 one at a time. Don't ask aloud again what they already answered on screen. Security-professional questions come next, on the end screen.";
  messages["정민 이야기가 나온 이유를 알아보고, 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?"] = "How difficult or easy was it to find out why Jeongmin came up and keep that information out of future responses?";
  messages["설문 뒤에 하나씩 묻기"] = "After the survey, ask one at a time";
  // 사후 질문 순서 조정(11/21): 이해 질문은 설문 뒤, 과제 1에서 확인 방법 질문 제외
  messages["조작하는 동안에는 묻지 않기 · 이해 질문(A-08~A-10)은 과제 완료 뒤 설문 다음에"] = "Don't ask while they work · comprehension questions (A-08–A-10) come after task completion, after the survey";
  messages["처리를 확인하는 방법은 여기서 묻지 않기 (과제 2에서 스스로 다시 묻는지(B-06)를 보기 위해)"] = "Don't ask how they'd verify the result here (so Task 2 can show whether they re-ask on their own, B-06)";
  messages["이해 질문(B-08)은 과제 완료 뒤 설문 다음에"] = "Comprehension questions (B-08) come after task completion, after the survey";
  messages["(메모리를 지웠다면) 지운 정보는 어떻게 됐을까요?"] = "(If they deleted memories) What happened to the deleted information?";
  messages["[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 출처 시트는 주제(정민, 식당 취향)별로 묶여 있고, 항목마다 골라 처리하거나 아래 '앱 연동 설정'에서 앱을 통째로 끌 수 있어요. 조작하기 전에 '어떻게 하실 생각이세요?'로 의도를 들어 두세요(A-05). 정민만 고르는지, 식당 취향까지 막는지는 A-19, A-20에 자동 기록돼요. [이해 질문은 과제 뒤] 조작하는 동안에는 묻지 마세요. 토글 범위(A-09)와 삭제·답변에 안 씀 차이(A-10)는 '과제 완료'를 누른 뒤 화면 설문을 마치고 나서 조건에 맞을 때만 물어요(과제 1 설문 화면 안내 참고)."] = "[Try it] Let them look around without comment first. The sources sheet is grouped by topic (Jeongmin, restaurant taste); they can process items one by one, or turn a whole app off under 'App connection settings'. Before they act, ask 'What are you planning to do?' to capture intent (A-05). Whether they pick only Jeongmin or also restaurant taste is logged in A-19 and A-20. [Comprehension questions come after the task] Don't ask while they work. Toggle scope (A-09) and the difference between deleted and not used in responses (A-10) are asked after they press 'Finish task' and finish the on-screen survey, only when they apply (see the Task 1 survey screen guide).";
  messages["[관찰만] 처리 결과 카드예요. 참가자가 입력창에 다시 물어서 확인하는지가 관찰값이에요(B-06, 자동 기록). 확인하지 않아도 실패는 아니에요. [이해 질문은 과제 뒤] 여기서는 묻지 마세요. '방금 무엇이 처리됐나요?', 'Gmail과 캘린더의 정민 정보는 지금 어떤 상태일까요?'(B-08), (메모리를 지웠다면) '지운 정보는 어떻게 됐을까요?'는 '과제 완료' 뒤 설문을 마치고 나서 물어요. 결과 줄 아래 보관 안내를 읽었는지(B-18)는 관찰로 기록해요."] = "[Observe only] The result card. Whether the participant re-asks in the input to check is the observation (B-06, logged automatically). Not checking isn't a failure. [Comprehension questions come after the task] Don't ask here. 'What was just processed?', 'What state is Jeongmin's information in Gmail and Calendar now?' (B-08), and (if they deleted memories) 'What happened to the deleted information?' are asked after 'Finish task', once the survey is done. Whether they read the retention note under the result line (B-18) is recorded by observation.";
  messages["[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요. 설문을 마친 뒤 이해 질문 A-08~A-10을 조건에 맞는 것만 하나씩 묻고, 점수 이유를 물어요. 처리를 어떻게 확인할지는 묻지 마세요(과제 2의 B-06 관찰을 위해)."] = "[Post-task survey · dinner scenario] Before showing the survey, ask aloud first: 'Of the information about Jeongmin, what is gone now and what remains?' (A-12, moderator records) Then let the participant answer the 4 on-screen questions and press 'Next' themselves. Don't explain the screen. After the survey, ask comprehension questions A-08–A-10 one at a time, only those that apply, then ask about their scores. Don't ask how they would verify the result (to keep the Task 2 B-06 observation clean).";
  messages["[과제 직후 설문 · 채팅 삭제 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(B-09, 진행자 기록) 그다음 참가자가 화면의 설문 5문항에 직접 답하고 '다음'을 누르게 두세요. 설문을 마친 뒤 이해 질문(B-08)과 점수 이유를 하나씩 물어요."] = "[Post-task survey · chat deletion scenario] Before showing the survey, ask aloud first: 'Of the information about Jeongmin, what is gone now and what remains?' (B-09, moderator records) Then let the participant answer the 5 on-screen questions and press 'Next' themselves. After the survey, ask the comprehension question (B-08) and the reasons for their scores, one at a time.";
  messages["쉬움 점수를 그렇게 주신 이유는요?"] = "Why did you give that ease score?";
  messages["점수를 그렇게 주신 이유는요?"] = "Why did you give those scores?";
  // 보관 안내 새 문구 · A4 메모리 한 건 삭제 · 월별 묶음(11/21)
  messages["지운 대화 중 품질 검토를 위해 사람이 이미 본 내용은 내 계정과 연결되지 않은 채 최대 3년 남을 수 있어요"] = "Of what you deleted, chats a person already reviewed for quality may stay for up to 3 years, not linked to your account";
  messages["ⓘ 지운 대화 중 품질 검토를 위해 사람이 이미 본 내용은 내 계정과 연결되지 않은 채 최대 3년 남을 수 있어요 (Gemini 개인정보 보호 정책)"] = "ⓘ Of what you deleted, chats a person already reviewed for quality may stay for up to 3 years, not linked to your account (Gemini Privacy Policy)";
  messages["메모리 1건 삭제됨"] = "1 memory deleted";
  messages["이 메모리 삭제"] = "Delete this memory";
  // A4 진행자 안내(메모리 한 건 삭제 · 월별 묶음)
  messages["참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 메모리는 월별로 묶여 있고 항목마다 휴지통 버튼으로 한 건씩 지울 수 있어요(정민 메모리를 지우면 출처 시트에도 '삭제됨'으로 반영). 맨 아래 '메모리 전체 삭제'도 있어요. 한 건씩 지우는지, 전체 삭제를 고르는지 지켜보세요(A-07은 v30 문구 패치부터 '없는 기능 시도'가 아니라 관찰 메모로 기록). [과제 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(쉬움·완료 인식·확신도·정보량)을 진행하세요."] = "Proceed only if the participant came here on their own (the visit itself is an observation, so the moderator doesn't move them here). 'What do you think this screen shows?' → watch what they try to do. Memories are grouped by month, and each item can be deleted one at a time with its trash button (deleting a Jeongmin memory also shows as 'Deleted' in the sources sheet). 'Delete all memory' is at the bottom. Watch whether they delete items one by one or choose delete all (from the v30 copy patch, A-07 is recorded as an observation note, not as 'tried a missing feature'). [Task end] When the participant says they're done (in participant mode, 'Finish task'), run the post-task survey (ease · completion · confidence · amount of information).";
  messages["클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>메모리는 펼쳤을 때</b> 항목마다 휴지통(한 건 삭제, 실행취소 가능)과 '메모리 전체 삭제' 링크. 목록은 월별로 묶임(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀."] = "Clickable — name = <b>expand to view data (read-only)</b>; app toggles are synced with A3. <b>When memory is expanded</b>, each item has a trash button (deletes one, can be undone) plus the 'Delete all memory' link. The list is grouped by month (if 2 items were deleted in A3, 11→9). ← returns to the sources panel.";
  // A4 목록 항목(일정 제목 · 메모리 주제 · 메일 제목)
  const LIST_TITLES = {"정민 선물 고민": "Gift ideas for Jeongmin", "정민 생일": "Jeongmin's birthday", "제주 여행 (정민)": "Jeju trip (Jeongmin)", "강릉 1박": "Overnight in Gangneung", "와인바": "Wine bar", "정민 이사 도와주기": "Help Jeongmin move", "정민이랑 전시": "Exhibition with Jeongmin", "벚꽃 구경": "Cherry blossom viewing", "팀 주간 회의": "Weekly team meeting", "치과 정기 검진": "Dental checkup", "헬스 PT": "Gym PT session", "엄마 생신": "Mom's birthday", "프로젝트 마감": "Project deadline", "대학 동기 모임": "College friends meetup", "정민이랑 영화": "Movie with Jeongmin", "자동차 정기 점검": "Car service", "독서 모임": "Book club", "치과 예약": "Dentist appointment", "정민과 저녁": "Dinner with Jeongmin", "정민과 트러플 리조또": "truffle risotto with Jeongmin", "주말 등산 코스": "weekend hiking trail", "회사 근처 필라테스": "Pilates near work", "정민이 좋아하던 재즈바": "the jazz bar Jeongmin liked", "부모님 결혼기념일 선물": "gift for parents' anniversary", "연말 제주 여행 일정": "year-end Jeju trip plan", "고양이 사료 브랜드": "cat food brand", "이직 준비 포트폴리오": "portfolio for a job change", "할로윈 파티 의상": "Halloween party costume", "가을 캠핑 장비": "fall camping gear", "추석 기차표 예매": "Chuseok train tickets"};
  Object.assign(messages, {"[쿠팡] 주문하신 상품이 배송 완료되었습니다": "[Coupang] Your order has been delivered", "[카카오뱅크] 이번 달 카드 이용 내역 안내": "[KakaoBank] Your card statement for this month", "[무신사] 주문이 접수되었습니다": "[Musinsa] Your order was received", "[CGV] 예매가 완료되었습니다": "[CGV] Your booking is complete", "[배달의민족] 주문하신 음식이 출발했어요": "[Baemin] Your food is on the way", "[네이버페이] 결제가 완료되었습니다": "[Naver Pay] Payment complete", "[인터파크] 공연 예매 확인": "[Interpark] Show booking confirmed", "[SRT] 승차권 예매 내역": "[SRT] Train ticket booking", "[올리브영] 주문 상품 발송 안내": "[Olive Young] Your order has shipped", "[당근] 거래 후기가 도착했어요": "[Karrot] You got a trade review", "[야놀자] 숙소 예약이 확정되었습니다": "[Yanolja] Your stay is confirmed"});
  // 진행자 질문 대기 화면
  messages["시간 남으면 (선택)"] = "If time allows (optional)";
  if (!messages["과제를 마쳤어요"]) messages["과제를 마쳤어요"] = "Task finished";
  if (!messages["설문 전에 진행자가 질문을 하나 드릴 거예요"]) messages["설문 전에 진행자가 질문을 하나 드릴 거예요"] = "Before the survey, the moderator will ask you a question";
  if (!messages["답하신 뒤 '계속'을 눌러 주세요."]) messages["답하신 뒤 '계속'을 눌러 주세요."] = "After you answer, tap 'Continue'.";
  if (!messages["설문을 마쳤어요"]) messages["설문을 마쳤어요"] = "Survey finished";
  if (!messages["진행자가 몇 가지 질문을 드릴 거예요"]) messages["진행자가 몇 가지 질문을 드릴 거예요"] = "The moderator will ask you a few questions";
  if (!messages["다 답하신 뒤 '계속'을 눌러 주세요."]) messages["다 답하신 뒤 '계속'을 눌러 주세요."] = "When you've answered, tap 'Continue'.";
  if (!messages["거의 끝났어요"]) messages["거의 끝났어요"] = "Almost done";
  if (!messages["마지막으로 진행자가 몇 가지 여쭤볼게요"]) messages["마지막으로 진행자가 몇 가지 여쭤볼게요"] = "Finally, the moderator has a few questions";
  if (!messages["계속"]) messages["계속"] = "Continue";
  if (!messages["잠깐만요"]) messages["잠깐만요"] = "One moment";
  if (!messages["진행자가 질문을 드릴 거예요"]) messages["진행자가 질문을 드릴 거예요"] = "The moderator will ask you a question";
  if (!messages["참가자 화면이 멈춰 있어요 · 지금 하나씩 묻기"]) messages["참가자 화면이 멈춰 있어요 · 지금 하나씩 묻기"] = "Participant's screen is paused · ask these now, one at a time";
  // 보안 종사자 질문 삭제 후 안내 문장
  messages["[마지막 질문] 사용성 설문(SUS) 다음에 나오는 닫힌 질문 3개예요(W-01~03, 자동 기록). 참가자가 답하면 화면에서 고른 이유를 묻고(W-04), 이어서 W-05~W-07을 하나씩 하세요. 화면에서 이미 고른 질문은 말로 다시 묻지 않아요."] = "[Final questions] Three closed questions shown after the SUS (W-01–03, logged automatically). After they answer, ask why they chose those answers (W-04), then W-05–W-07 one at a time. Don't ask aloud again what they already answered on screen.";
  messages["세션 종료 화면이에요(사용성 설문(SUS)와 마무리 질문까지 끝난 상태). 디브리핑을 진행한 뒤, 패널의 '기록 받기(JSON)/기록 받기(CSV)'로 기록을 저장하고 다음 참가자는 '새 참가자로 시작'을 누르세요."] = "This is the session end screen (SUS and wrap-up questions are done). Debrief, save the log with 'Download log (JSON)/Download log (CSV)' in the panel, and press 'Start with new participant' for the next participant.";

  // v31 (P03·P04 이터레이션) 새 문구
  messages["삭제돼요"] = "Will be deleted";
  messages["삭제됨"] = "Deleted";
  messages["지우면 다시 볼 수 없어요"] = "Once deleted, you can't see it again";
  messages["원본은 그대로 두고 답변에만 안 써요"] = "Originals stay; only left out of answers";
  messages["항목 접기"] = "Hide items";
  messages["변경 내역"] = "Change history";
  messages["출처 확인에서"] = "In Sources";
  messages["개인 인텔리전스에서"] = "In Personal Intelligence";
  messages["메모리 전체 삭제됨"] = "All memories deleted";
  messages["출처 확인"] = "Sources";
  messages["이 답변에 쓰인 정민 관련 정보예요. 여기서 골라 지우거나, 답변에만 안 쓰게 할 수 있어요."] = "This is the Jeongmin info used in this answer. Pick items here to delete them or keep them out of answers.";
  messages["정민 님 관련 정보는 이미 정리했어요. 앞으로 답변에 쓰지 않아요."] = "Jeongmin info has already been handled. It won't be used in answers.";
  messages["정민 님 이야기는 아래 정보를 참고해서 나왔어요."] = "Jeongmin came up because of this info:";
  messages["예전 Gemini 채팅에서 정민 님과 트러플 리조또를 드신 이야기(메모리)"] = "A past Gemini chat about truffle risotto with Jeongmin (memory)";
  messages["캘린더 일정 '정민과 저녁'"] = "Calendar event 'Dinner with Jeongmin'";
  messages["Gmail의 톨로 비스트로 예약 메일"] = "The Tolo Bistro booking email in Gmail";
  messages["지금은 정민 님 관련 정보를 답변에 쓰지 않아요."] = "Jeongmin info isn't used in answers now.";
  messages["답변에 쓰지 않으려면 여기서 고를 수 있어요."] = "To keep it out of answers, pick it here.";
  messages["출처별로 묶었어요. 펼치면 항목을 하나씩 고를 수 있어요."] = "Grouped by source. Expand to pick items one by one.";
  messages["원본은 Gmail·캘린더에 그대로 두고 답변에만 안 써요"] = "Originals stay in Gmail and Calendar; only left out of answers";
  messages["확인이 필요한 정보"] = "Needs your check";
  messages["남겨 둬요"] = "Kept";
  messages["돈이 오간 기록이라 따로 묶었어요. 함께 처리하려면 골라 주세요"] = "These are money records, so they're grouped separately. Select them to handle them too";
  messages["송금·입금 메일"] = "Payment emails";
  messages["고르면 원본은 Gmail에 그대로, 답변에만 안 써요"] = "If selected, originals stay in Gmail; only left out of answers";
  messages["[카카오페이] 정민님에게 송금 완료"] = "[KakaoPay] Money sent to Jeongmin";
  messages["[토스] 정민님이 보낸 돈이 도착했어요"] = "[Toss] Money from Jeongmin arrived";
  messages["남겨 둠"] = "Kept";
  messages["지웠어요. 다시 볼 수 없어요"] = "Deleted. You can't see it again";
  messages["돈이 오간 기록이라 처리하지 않았어요. 계속 답변에 쓰일 수 있어요"] = "Not handled because these are money records. They may still be used in answers";
  messages["함께 처리"] = "Handle these too";
  messages["자세히 고르기"] = "Choose in detail";
  messages["Gmail에 정민 님과 주고받은 송금·입금 메일 2건이 남아 있어요."] = "2 payment emails with Jeongmin remain in Gmail.";
  messages["평소 이탈리안을 좋아하신다고 하셔서 골라 봤어요. 송도 센트럴파크 인근의"] = "You said you like Italian food, so I picked this. Near Songdo Central Park, I recommend";
  messages["송도 센트럴파크 인근의"] = "Near Songdo Central Park, I recommend";
  messages["를 추천해 드려요. 통창으로 공원 뷰를 즐길 수 있고, '바질 새우 피자'와 '트러플 뇨끼'가 인기 메뉴예요."] = ". It has big windows with a park view, and its popular dishes are basil shrimp pizza and truffle gnocchi.";
  messages["지난봄에 다녀오신 톨로 비스트로도 다시 가 보셔도 좋겠어요."] = "You could also go back to Tolo Bistro, where you went last spring.";
  messages["정민 님에 대해 지금 참고할 수 있는 정보예요."] = "Here's what I can refer to about Jeongmin right now.";
  messages["정민 님에 대해 참고할 수 있는 정보가 없어요."] = "There's no information about Jeongmin I can refer to.";
  messages["예전 대화에서 정민 님과 트러플 리조또를 드신 이야기를 기억하고 있어요."] = "I remember a past chat about having truffle risotto with Jeongmin.";
  messages["캘린더에 '정민과 저녁', '정민 생일' 같은 일정이 있어요."] = "Your calendar has events like 'Dinner with Jeongmin' and 'Jeongmin's birthday'.";
  messages["Gmail에 정민 님이 함께한 항공 예약, 송금 메일이 있어요."] = "Gmail has a flight booking with Jeongmin and payment emails.";
  messages["네, 좋아요. 조금 더 자세히 알려 주시면 도와드릴게요."] = "Sure. Tell me a bit more and I'll help.";
  messages["정민 님 관련 정보는 이미 정리했어요. 지금은 답변에 쓰지 않아요."] = "Jeongmin info has already been handled. It isn't used in answers now.";
  messages["잠깐 질문"] = "Quick question";
  messages["다음 질문"] = "Next question";
  messages["생각나는 대로 말로 답해 주세요. 다 말하면 아래 버튼을 눌러 주세요."] = "Answer out loud in your own words. When you're done, tap the button below.";
  messages["AI에게 사람이나 일정 같은 개인적인 이야기를 해 본 적 있으세요? 그때 어떠셨어요?"] = "Have you ever told an AI something personal, like about a person or your schedule? How did that feel?";
  messages["방금 답변을 보고 어떤 생각이 드세요?"] = "What do you think about the answer you just saw?";
  messages["이 화면을 보고, 어떻게 하실 생각이세요?"] = "Looking at this screen, what are you planning to do?";
  messages["지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?"] = "Of the Jeongmin info, what do you think is gone now and what is still there?";
  messages["이 답변에 정민 이야기가 왜 나왔는지 설명해 주실 수 있나요?"] = "Can you explain why Jeongmin came up in that answer?";
  messages["앱 연동 토글을 끄면 어떤 정보가 영향을 받을까요?"] = "When you turn off an app connection toggle, what info is affected?";
  messages["지운 것과 '답변에 안 씀'으로 처리한 것은 각각 어떻게 될까요?"] = "What happens to what you deleted, and to what you set to 'Not used in answers'?";
  messages["정민 관련 정보를 앞으로 답변에 안 쓰이게 하고 싶다면, 평소라면 어떻게 하실 것 같으세요?"] = "If you wanted Jeongmin info kept out of future answers, how would you normally go about it?";
  messages["Gmail과 캘린더의 정민 정보는 지금 어떤 상태일까요?"] = "What state is the Jeongmin info in Gmail and Calendar in now?";
  messages["방금 고르신 답을 그렇게 고르신 이유는 무엇인가요?"] = "Why did you choose the answers you just picked?";
  messages["오늘 가장 헷갈리거나 불편했던 순간은 언제였나요?"] = "What was the most confusing or uncomfortable moment today?";
  messages["하나만 바꿀 수 있다면 무엇을 바꾸고 싶으세요?"] = "If you could change just one thing, what would it be?";
  messages["답변에만 안 씀"] = "Only kept out of answers";
  messages["이 답변에 쓰인 정보를 모두 처리했어요"] = "All info used in this answer has been handled";
  messages["이 메일도 답변에 안 쓰기"] = "Keep these emails out of answers too";
  messages["지웠어요. 지금 되돌리지 않으면 다시 볼 수 없어요"] = "Deleted. Unless you undo now, you can't see it again";
  messages["지운 것과 '답변에만 안 씀'으로 처리한 것은 각각 어떻게 될까요?"] = "What happens to what you deleted, and to what you set to 'Only kept out of answers'?";
  messages["오늘 써 보면서 막히거나 헷갈린 순간이 있었나요? 있었다면 언제였나요?"] = "Was there a moment today when you got stuck or confused? If so, when?";
  messages["오늘 써 본 것 중 가장 좋았던 부분과, 가장 덜 쓸 것 같은 부분은 어디였나요? 왜 그런가요?"] = "What did you like most today, and what would you use least? Why?";
  messages["끄면 그 앱의 정보 전체를 답변에 쓰지 않아요. 메일·일정 원본은 그대로예요."] = "When off, nothing from that app is used in answers. Your emails and events stay.";
  messages["이렇게 처리할게요. 처리하기 전에 확인해 주세요."] = "Here's what will happen. Please check before processing.";
  messages["항목을 하나씩 고를 수 있어요."] = "You can pick items one by one.";
  messages["자세히 고르기"] = "Choose in detail";
  messages["요약만 보기"] = "Show summary";
  messages["남겨 둬요"] = "Kept";
  messages["원본은 각 앱에 그대로 둬요"] = "Originals stay in each app";
  messages["원본은 각 앱에 그대로 있어요. 답변에만 안 써요"] = "Originals stay in each app; only kept out of answers";
  messages["돈이 오간 기록이라 따로 뒀어요. 함께 처리하려면 자세히 고르기"] = "These are money records, so they're kept aside. To handle them too, choose in detail";
  messages["고르지 않은 정보는 계속 답변에 쓰일 수 있어요"] = "Info you didn't pick may still be used in answers";
  messages["계속 답변에 쓰일 수 있어요"] = "May still be used in answers";
  messages["돈이 오간 기록이라 처리하지 않았어요."] = "Not handled because these are money records.";
  messages["진행자 질문"] = "Moderator question";
  messages["삭제"] = "Delete";
  messages["삭제돼요 · 다시 볼 수 없어요"] = "Deleted · can't be seen again";
  messages["답변에만 안 써요 · 원본은 그대로"] = "Kept out of answers · originals stay";
  messages["남겨 둬요 · 돈이 오간 기록"] = "Kept · money records";
  messages["답변에만 안 써요 · 원본은 Gmail에 그대로"] = "Kept out of answers · originals stay in Gmail";
  messages["AI 챗봇에 다른 사람 이야기나 약속처럼 개인적인 내용을 말해 본 적이 있나요? 있다면, 그때 어떤 생각이 들었나요?"] = "Have you ever told an AI chatbot something personal, like about another person or a plan? If so, what went through your mind?";
  messages["지금 정민과 관련된 정보는 어떻게 됐을 것 같나요? 생각나는 대로 말씀해 주세요."] = "What do you think has happened to the Jeongmin info now? Say whatever comes to mind.";
  messages["처음 답변에 정민 이야기가 왜 나왔다고 생각하세요?"] = "Why do you think Jeongmin came up in the first answer?";
  messages["'삭제'로 처리한 것과 '답변에만 안 씀'으로 처리한 것은 어떻게 다를까요?"] = "How is what you set to 'Delete' different from what you set to 'Only kept out of answers'?";
  messages["실제 Gemini에서 정민 관련 정보가 앞으로 답변에 안 나오게 하고 싶다면, 어떻게 해 보실 것 같으세요?"] = "In the real Gemini, if you wanted Jeongmin info kept out of future answers, what would you try?";
  messages["Gmail과 캘린더에 있던 정민 관련 메일과 일정은 지금 어떻게 됐을 것 같나요?"] = "What do you think has happened to the Jeongmin emails and events in Gmail and Calendar?";
  messages["방금 고르신 첫 번째 답은 왜 그렇게 고르셨나요?"] = "Why did you choose your first answer?";
  messages["두 방법이 비슷하다고 고르셨어요. 어떤 점에서 그렇게 느끼셨나요?"] = "You said the two methods felt similar. In what way?";
  messages["더 편했던 방법은 어떤 점이 편했나요?"] = "What made the easier method easier?";
  messages["오늘 써 본 것 중 가장 좋았던 부분은 어디였나요? 왜 그런가요?"] = "What did you like most today? Why?";
  messages["반대로, 실제로는 잘 안 쓸 것 같은 부분이 있었나요? 있다면 왜 그런가요?"] = "On the other hand, was there anything you probably wouldn't use? If so, why?";
  messages["처리하기 전에 무엇이 처리될지 확인하는 과정은 얼마나 번거롭거나 수월했나요?"] = "How cumbersome or easy was checking what would be handled before processing?";
  messages["오늘 써 본 기능들이 실제 Gemini에 있다면, Gemini가 내 정보를 답변에 쓰는 것이 지금보다 어떻게 느껴질 것 같나요?"] = "If today's features were in the real Gemini, how would Gemini using your info in answers feel compared to now?";
  messages["진행자 질문 · 힌트"] = "Moderator question · hint";
  messages["답했어요"] = "Done answering";
  messages["이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?"] = "Is there a way to find out why this answer came out this way?";
  messages["이 화면은 무엇을 보여 주는 것 같으세요?"] = "What do you think this screen is showing?";
  messages["여기 나온 정리 범위는 생각하셨던 것과 비교하면 어떤가요?"] = "How does the scope shown here compare to what you had in mind?";
  messages["평소 AI 챗봇을 어떤 일에 주로 쓰세요?"] = "What do you usually use AI chatbots for?";
  messages["처리하면서 확신이 덜 든 부분이 있었나요? 있었다면 어디였나요?"] = "Was there any part you felt less sure about? If so, where?";
  messages["요청하신 범위와 실제로 처리된 범위를 비교하면 어땠나요?"] = "How did what you asked for compare to what was actually handled?";
  messages["처리가 됐는지 확인하고 싶다면 어떻게 하실 것 같으세요?"] = "If you wanted to check it was handled, what would you do?";
  messages["실제 Gemini에 이 기능이 있다면, 어떤 상황에서 쓰실 것 같으세요?"] = "If the real Gemini had this feature, in what situations would you use it?";
  messages["쉬운 정도 점수를 그렇게 주신 이유는요?"] = "Why did you give that ease score?";
  messages["AI 챗봇에 다른 사람 이야기나 약속처럼 개인적인 내용을 말해 본 적이 있나요? 있다면 어떤 내용이었나요?"] = "Have you ever told an AI chatbot something personal, like about another person or a plan? If so, what was it about?";
  messages["AI에게 그런 이야기를 할 때 신경 쓰이는 점이 있나요? 있다면 무엇인가요?"] = "When you tell an AI things like that, is there anything that concerns you? If so, what?";
  messages["모든 질문이 끝났어요. 오늘 본 이름·일정·메일은 모두 가상이에요."] = "All questions are done. The names, events and emails you saw today were all fictional.";
  messages["모든 질문이 끝났어요."] = "All questions are done.";
  messages["삭제돼요"] = messages["삭제돼요"] || "Will be deleted";
  messages["사람이 품질 검토한 대화 사본은 계정과 분리돼 최대 3년 남을 수 있어요"] = "Chats reviewed by people for quality may stay up to 3 years, separated from your account";
  messages["ⓘ 사람이 품질 검토한 대화 사본은 계정과 분리돼 최대 3년 남을 수 있어요 (Gemini 개인정보 보호 정책)"] = "ⓘ Chats reviewed by people for quality may stay up to 3 years, separated from your account (Gemini Privacy Policy)";
  messages["앞으로 답변에 쓰지 않을 정보를 골라 주세요."] = "Choose the info you don't want used in future answers.";
  messages["다시 볼 수 없어요"] = "Can't be seen again";
  messages["원본은 각 앱에 그대로예요"] = "Originals stay in each app";
  messages["돈이 오간 기록이라 남겨 뒀어요"] = "Kept because these are money records";
  messages["메모리는 삭제"] = "Memory: deleted";
  messages["Gmail·캘린더는 답변에만 안 씀"] = "Gmail & Calendar: kept out of answers";
  messages["원본은 그대로예요"] = "Originals stay";
  messages["메모리는 삭제되고, Gmail·캘린더는 답변에만 안 써요."] = "Memory is deleted; Gmail and Calendar are only kept out of answers.";
  messages["돈이 오간 기록이라 따로 뒀어요"] = "Kept aside because these are money records";
  messages["검토용 사본은 최대 3년 남을 수 있어요"] = "Copies kept for review may stay up to 3 years";
  messages["상황"] = "Situation";
  messages["할 일"] = "To do";
  messages["퇴근 후 소파에 앉아, 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요."] = "After work, you're on the sofa and open Gemini to find a place for dinner this week.";
  messages["입력창을 누르고, 미리 입력된 질문을"] = "Tap the input box and";
  messages["그대로 보내 주세요."] = "send the pre-filled question as is.";
  messages["답변을 살펴봐 주세요."] = "Look through the answer.";
  messages["생각나는 것을 소리 내어 말해 주세요"] = "Think out loud as you go";
  messages["Gemini가 '정민'과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요."] = "Gemini remembers information about 'Jeongmin'. You're no longer in touch with Jeongmin.";
  messages["채팅으로 Gemini에게 요청해서"] = "Ask Gemini in chat";
  messages[", 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요."] = " so that Jeongmin info isn't used in future answers.";
  messages["요청 문장은 평소 말하듯 자유롭게 입력하면 돼요."] = "Type the request however you'd normally say it.";
  messages["항목 직접 고르기"] = "Pick items myself";
  messages["목록 접기"] = "Hide list";
  messages["다시 고르기"] = "Pick again";
  messages["직접 고르기"] = "Pick items";
  messages["돈이 오간 송금·입금 메일"] = "Emails about money transfers";
  messages["고르지 않은 정보는 계속 답변에 쓰일 수 있어요"] = "Unselected info may still be used in answers";
  messages["메모리는 삭제돼요. 다시 볼 수 없어요"] = "Memory is deleted and can't be seen again";
  messages["Gmail·캘린더는 답변에만 안 써요. 원본은 그대로예요"] = "Gmail and Calendar are only kept out of answers; originals stay";
  messages["개선 컨셉 테스트"] = 'Improvement concept test';
  messages["실제 서비스가 아닌 연구용 화면이에요"] = 'This is a research screen, not a real service';
  messages["이름·일정은 모두 가상이에요"] = 'All names and events are fictional';
  messages["정답은 없어요. 평소처럼 써 주세요"] = 'There are no right answers. Use it as you normally would';
  messages["화면과 목소리를 녹화해요"] = 'Your screen and voice are recorded';
  messages["누른 곳 · 입력 · 응답이 기록돼요"] = 'Taps, typing and answers are logged';
  messages["언제든 중단할 수 있어요"] = 'You can stop at any time';
  messages["위 내용에 동의해요"] = 'I agree to the above';
  messages["퇴근 후 소파에 앉아, 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요"] = "After work, you're on the sofa and open Gemini to find a place for dinner this week";
  messages["그대로 보내 주세요"] = 'send the pre-filled question as is';
  messages["답변을 살펴봐 주세요"] = 'Look through the answer';
  messages["Gemini가 정민과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요"] = "Gemini remembers information about Jeongmin. You're no longer in touch with Jeongmin";
  messages[", 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요"] = " so that Jeongmin info isn't used in future answers";
  messages["요청 문장은 평소 말하듯 자유롭게 입력하면 돼요"] = "Type the request however you'd normally say it";
  messages["앞으로 답변에 쓰지 않을 정보를 골라 주세요"] = "Choose the info you don't want used in future answers";
  messages["말로 답한 뒤 아래 버튼을 눌러 주세요"] = 'Answer out loud, then tap the button below';
  messages["진행자 질문 · 힌트"] = 'Moderator question · hint';
  messages["정민 이야기가 왜 나왔는지 알아보고, 앞으로 답변에 쓰이지 않게 하기"] = 'Find out why Jeongmin came up and keep it out of future answers';
  messages["메모리는 다시 볼 수 없어요"] = "Memory can't be seen again";
  messages["Gmail·캘린더는 원본 그대로"] = 'Gmail & Calendar originals stay';
  messages["Gmail은 원본 그대로"] = 'Gmail originals stay';
  messages["캘린더는 원본 그대로"] = 'Calendar originals stay';
  messages["개인 인텔리전스에서 한 처리 포함"] = 'Includes changes made in Personal Intelligence';
  messages["전체"] = 'All';
  messages["송금·입금 메일은 돈이 오간 기록이에요"] = 'Payment emails are money records';
  messages["송금·입금 메일은 그대로 뒀어요"] = 'Payment emails were kept';
  messages["답변에 안 쓰기"] = 'Keep out of answers';
  messages["Gemini가 기억하는 정보"] = 'What Gemini remembers';
  messages["끄면 그 앱 정보 전체를 답변에 쓰지 않아요. 메일·일정 원본은 그대로예요"] = 'When off, nothing from that app is used in answers. Mail and events stay as they are';
  messages["항목 보기"] = 'View items';
  messages["보기"] = 'View';
  messages["메일 130건"] = '130 emails';
  messages["일정 36건"] = '36 events';
  messages["이 답변엔 쓰이지 않았어요"] = 'Not used in this answer';
  messages["정민 관련 정보 20건을 찾았어요"] = 'Found 20 items related to Jeongmin';
  messages["메모리는 삭제되고, Gmail·캘린더는 답변에만 안 써요"] = 'Memory is deleted; Gmail and Calendar are only kept out of answers';
  messages["지금 정민과 관련된 정보는 어떻게 됐을 것 같나요?"] = 'What do you think has happened to the information about Jeongmin?';
  messages["생각나는 대로 말로 답해 주세요. 다 말하면 아래 버튼을 눌러 주세요"] = 'Answer out loud in your own words, then tap the button below';
  messages["저녁 약속 상황"] = 'Dinner plans';
  messages["채팅으로 정리한 상황"] = 'Cleaning up via chat';
  messages["이사 정보 정리"] = 'Moving info';
  messages["이 문장에 얼마나 동의하세요?"] = 'How much do you agree?';
  messages["남겨 둘 것"] = "To keep";
  function english(text) { return dates(englishText(text)); }
  // 한국어 화면의 서비스 이름(메모리·캘린더 등)을 예전 영어 표기로 되돌려 기존 번역 키를 그대로 씀.
  function legacy(text) {
    return text.replace(/개인 인텔리전스/g, 'Personal Intelligence').replace(/Google 캘린더/g, 'Google Calendar')
      .replace(/Google 포토/g, 'Google Photos').replace(/메모리/g, 'Memory').replace(/캘린더/g, 'Calendar');
  }
  function englishText(text) {
    if (messages[text]) return messages[text];
    const old = legacy(text);
    if (messages[old]) return messages[old];
    const quoted = old.match(/^"(.+)"$/);
    if (quoted && LIST_TITLES[quoted[1]]) return `“${LIST_TITLES[quoted[1]]}”`;
    const event = old.match(/^(\S+) 일정 "(.+)"$/);
    if (event && LIST_TITLES[event[2]]) return `${event[1]} event “${LIST_TITLES[event[2]]}”`;
    const mention = old.match(/^(\S+) Gemini 채팅에서 "(.+)" 언급$/);
    if (mention && LIST_TITLES[mention[2]]) return `${mention[1]} chat — mentioned “${LIST_TITLES[mention[2]]}”`;
    const month = old.match(/^(\d{4})년 (\d{1,2})월$/);
    if (month) return `${['January','February','March','April','May','June','July','August','September','October','November','December'][+month[2] - 1]} ${month[1]}`;
    const step = old.match(/^([A-Z]{1,2}[0-9]?[A-Z]?) (.+)$/);
    if (step && messages[step[2]]) return `${step[1]} ${messages[step[2]]}`;
    return old
      .replace(/^정민 관련 정보 (\d+)건을 처리했어요$/, (_, n) => `Handled ${items(n)} about Jeongmin`)
      .replace(/^Memory (\d+)건 삭제됨$/, (_, n) => `${items(n)} deleted from Memory`)
      .replace(/^Memory (\d+)건 삭제$/, (_, n) => `Delete ${items(n)} from Memory`)
      .replace(/^(\d+)건 답변에만? 안 씀$/, (_, n) => `${items(n)} kept out of answers`)
      .replace(/^정민 관련 정보 (\d+)건 중 (\d+)건을 처리했어요$/, (_, a, n) => `Handled ${n} of ${a} items about Jeongmin`)
      .replace(/^(\d+)초 뒤에 누를 수 있어요$/, 'Available in $1s')
      .replace(/^(\d+)건을 처리했어요$/, (_, n) => `Handled ${items(n)}`)
      .replace(/^송금·입금 메일 (\d+)건은 남겨 둬요 · 돈이 오간 기록$/, (_, n) => `Keeping ${items(n)} of payment emails · money records`)
      .replace(/^송금·입금 메일 (\d+)건은 남겨 뒀어요$/, (_, n) => `Kept ${items(n)} of payment emails`)
      .replace(/^고르지 않은 (\d+)건은 남겨 둬요 · 계속 답변에 쓰일 수 있어요$/, (_, n) => `Keeping ${items(n)} you didn't pick · may still be used in answers`)
      .replace(/^고르지 않은 (\d+)건은 남겨 뒀어요 · 계속 답변에 쓰일 수 있어요$/, (_, n) => `Kept ${items(n)} you didn't pick · may still be used in answers`)
      .replace(/^(\d+)건$/, '$1')
      .replace(/^(\S+) 연동 끔$/, '$1 turned off')
      .replace(/^항목 (\d+)건 보기$/, (_, n) => `Show ${items(n)}`)
      .replace(/^(.+) 연동 끔$/, '$1 disconnected')
      .replace(/^(.+) 답변에만? 안 씀$/, '$1 · kept out of answers')
      .replace(/^원본은 (\w+)에 그대로 있어요\. 답변에만 안 써요$/, 'Originals stay in $1; only left out of answers')
      .replace(/^고르지 않은 (\d+)건은 계속 답변에 쓰일 수 있어요$/, (_, n) => `The ${items(n)} you didn't pick may still be used in answers`)
      .replace(/^진행자 질문 (\d+) \/ (\d+)$/, 'Moderator question $1 / $2')
      .replace(/^방금 '얼마나 쉬웠나요' 질문에 (\d+)점을 주셨어요\. 그렇게 주신 이유는요\?$/, 'You gave $1 points for how easy it was. Why that score?')
      .replace(/^아까 (.+) 스위치를 끄셨어요\. 끄면 어떤 정보가 답변에 안 쓰이게 될까요\?$/, 'Earlier you turned off the $1 switch. What info is no longer used in answers when it is off?')
      .replace(/^방금 '(.+)'를 고르셨어요\. 왜 그렇게 느끼셨나요\?$/, 'You just picked "$1". Why do you feel that way?')
      .replace(/^'(.+)'가 더 편하다고 고르셨어요\. 어떤 점이 더 편했나요\?$/, 'You said "$1" was easier. What made it easier?')
      .replace(/^질문 (\d+) \/ (\d+)$/, 'Question $1 / $2')
      .replace(/^방금 '(.+)', '(.+)'를 고르셨어요\. 그렇게 고르신 이유는 무엇인가요\?$/, 'You just picked "$1" and "$2". Why did you choose those?')
      .replace(/^선택 (\d+)건$/, (_, n) => `${n} selected`)
      .replace(/^(\d+)건 처리$/, (_, n) => `Process ${items(n)}`)
      .replace(/^정보 (\d+)건 처리됨$/, (_, n) => `${items(n)} handled`)
      .replace(/^정보 (\d+)건 처리$/, (_, n) => `${items(n)} handled`)
      .replace(/^앱 연동 (\d+)개 끔$/, (_, n) => `${n} app connection${n === '1' ? '' : 's'} off`)
      .replace(/^Gemini 채팅, (.+)$/, 'Gemini chat, $1')
      .replace(/^(Memory|Gmail|Calendar) (\d+)건$/, '$1 · $2 items')
      .replace(/^(\d+)개 세션을 받았어요.*$/, '$1 sessions downloaded (use startedAt to tell repeated codes apart)')
      .replace(/^· (\d+)건$/, '· $1 items')
      .replace(/^\+ (\d+)건 더보기$/, '+ Show $1 more')
      .replace(/^(\d+)건 중 (\d+)건 선택$/, '$2 of $1 selected')
      .replace(/^(\d+)건$/, '$1 items')
      .replace(/^\/ (\d+)건$/, '/ $1')
      .replace(/^원본은 (\w+)에 그대로 있어요$/, 'Original kept in $1')
      .replace(/^(.*), (\d+)명$/, '$1, $2 people')
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
    document.querySelectorAll('input[placeholder]:not(#pidInput)').forEach(el => {
      if (!el.dataset.ph) el.dataset.ph = el.getAttribute('placeholder');
      el.placeholder = t(el.dataset.ph);
    });
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
