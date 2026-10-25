// 프로토타입 동작 + 진행자 패널 + 기록 연결
(function(){
  const params = new URLSearchParams(location.search);
  const MODE = params.get('mode') === 'participant' ? 'participant' : 'moderator';
  if(MODE === 'participant') document.body.classList.add('participant');
  // 과제 순서: 기본 A→B, 주소에 ?order=ba 를 붙이면 B→A (순서 효과를 줄이려고 참가자마다 교차)
  const SEQ = (params.get('order') || '').toLowerCase() === 'ba' ? 'BA' : 'AB';
  // 참가자 코드는 링크에 담아 보내요(?pid=P03). 참가자 모드에서 코드가 없으면 익명 코드를 자동으로 만들어요.
  const PID = (params.get('pid') || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
  // SUS는 모든 참가자가 마지막 상황의 설문 다음에 답해요.
  const WITH_SUS = true;

  /* ---------------- 단계 정의 (진행자 스크립트) ----------------
     진행 원칙: ① 목표만 제시 → ② 참가자가 직접 시도(진행자는 설명·힌트 없이 관찰) → ③ 설명 없이 이해 확인 → ④ 과제 직후 설문 → ⑤ 그다음 심층 질문.
     조작 방법이나 선택지(차단/삭제)를 진행자가 먼저 말하지 않아요. 도움을 줬다면 그 시점을 기록지에 남겨요. */
  const STEPS = {
    START:{phase:'-', script:"참가자에게 연구 고지를 읽게 하고 '시작하기'를 누르세요. 패널의 '참가자 링크 만들기'로 만든 링크로 열면 참가자 코드가 자동으로 들어가요(직접 열었다면 코드를 입력). 이때부터 기록이 시작됩니다. 시작 전 안내: '디자인을 평가하는 자리지 참가자분을 평가하는 게 아니에요. 정답은 없고, 생각나는 걸 소리 내어 말하면서 진행해 주세요.'",
      indicators:[], interact:"클릭 가능 — <b>참가자 코드 입력</b>, <b>시작하기</b>. 순서 교차는 주소 끝에 <b>?order=ba</b>(B→A)."},
    SA:{phase:'a', script:"(참가자 모드 전용) 상황 1 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    A1:{phase:'a', script:"[목표 제시] 상황만 읽어 주세요: '퇴근 후 소파에 앉아 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요. 입력창을 누르면 질문이 미리 입력돼 있으니, 그대로 보내고 답변을 살펴봐 주세요.' 이후 참가자가 직접 입력창을 누르게 두세요. 질문을 고정하는 이유: 모든 참가자가 같은 답변(정민 기억이 섞인 답변)을 보게 하려고.",
      indicators:[], interact:"클릭 가능 — <b>입력창</b>을 누르면 질문이 채워진 화면으로 넘어갑니다(질문은 고정)."},
    A1B:{phase:'a', script:"정해진 질문이 입력창에 미리 채워져 있어요(고정 시나리오). 참가자가 전송을 누르게 두세요.", indicators:[], interact:"클릭 가능 — <b>전송 버튼</b>."},
    A1C:{phase:'a', script:"응답 대기 연출입니다. 약 1.2초 뒤 자동으로 다음 화면으로 전환됩니다.", indicators:[], interact:"클릭 지점 없음 — 자동 전환됩니다.", autoNext:'A2', autoDelay:1200},
    A2:{phase:'a', script:"[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 확인하고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (지울지, 참조만 막을지는 참가자가 고르게 두세요.) 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 왼쪽 과제 패널이 '새 과제'로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.",
      indicators:[2,4], interact:"관찰 포인트 — 좋아요·싫어요 옆 <b>'출처 확인' 배지</b>를 스스로 찾는지. 발견 시간은 <b>답변이 다 표시된 시점부터</b> 자동 기록돼요. A3에서 참조를 끄거나 메모리를 지우고 돌아오면 답변 아래에 변경 안내가 표시됩니다."},
    A3:{phase:'a', script:"[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면 목표만 다시 말해 주세요: '앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (차단·삭제 같은 선택지나 방법은 말하지 마세요.) 조작하기 전에 '어떻게 하실 생각이세요?'로 의도를 들어 두세요(A-05). [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 각각 어떻게 될까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'",
      indicators:[1,2,4], interact:"클릭 가능 — 항목 이름=<b>데이터 펼치기(읽기 전용)</b>, 참조 on/off는 <b>앱 단위 토글</b>(이 시트엔 2건만 보이지만 끄면 해당 앱 전체 참조가 꺼짐 — 그레이존 핵심 관찰). <b>Memory는 펼쳤을 때만</b> '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초 실행취소). Gmail·Calendar는 참조 차단만 가능. <b>X</b>·바깥 영역으로 닫기, 하단 <b>'Personal Intelligence에서 전체 관리 →'</b> 링크."},
    A4:{phase:'a', script:"참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 이 화면엔 정민 관련 메모리만 골라 지우는 기능이 없고 '메모리 전체 삭제'뿐이에요. 이때의 반응은 디자인 제약에서 나온 발견으로 기록하세요. [Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요.",
      indicators:[1,5], interact:"클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>Memory는 펼쳤을 때만</b> '메모리 전체 삭제' 링크(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀."},
    SB:{phase:'b', script:"(참가자 모드 전용) 상황 2 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    B1:{phase:'b', script:"[과제 전 질문] 과제를 주기 전에 먼저: '정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?' — 채팅으로 요청하는 방법을 스스로 떠올리는지 기록하세요. [목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요. 이번엔 채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 요청에 '정민'이나 '그 사람' 같은 대상이 없으면 Gemini가 '어떤 정보를 정리할까요?'라고 되묻고, 대상을 말하면 정리 목록이 나와요. 입력한 문장과 되묻기 횟수는 자동 기록됩니다.",
      indicators:[1], interact:"클릭 가능 — <b>입력창</b>(자유 입력), <b>전송 버튼</b>(글자를 입력해야 활성화, Enter로도 전송)."},
    B2:{phase:'b', script:"[직접 시도] 먼저 묻지 말고 살펴보며 처리하게 두세요. 목록은 실제처럼 36건(Memory 3 · Gmail 24 · Calendar 9)이고 출처별로 접혀 있어요. 기본값이 '전체 선택'이라 바로 처리를 눌러도 삭제·차단 차이를 이해했다는 근거는 아니에요. 펼쳤는지, '더보기'를 눌렀는지, 체크를 바꿨는지, 양이 많다는 반응이 있는지 관찰하세요. 처리 전에 멈춰서 고민하면 그때 '이 목록이 생각하신 범위와 비교하면 어떤가요?'",
      indicators:[2], interact:"B1에서 전송하면 약 1.2초 응답 대기 후 카드가 나타납니다. 클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 출처별 <b>체크박스</b>(출처 단위로 선택), 펼친 뒤 <b>'+N건 더보기'</b>, <b>선택 항목 처리/취소</b>. 그룹 라벨 '삭제돼요'/'참조만 차단돼요'를 알아차리는지가 관찰 포인트. 아무것도 선택하지 않으면 처리 버튼 비활성."},
    B3:{phase:'b', script:"[관찰만] 먼저 묻지 마세요. '지금 확인하기'를 누르는지, 그냥 끝내는지가 관찰값입니다(참가자 모드에서는 '과제 완료'로 바로 끝낼 수 있어요). 누르지 않았다고 실패가 아니에요 — 확인 행동은 따로 기록합니다. [이해 확인 — 참가자가 끝났다고 한 뒤] ① '방금 무엇이 처리됐나요?' ② 'Gmail과 Calendar에 있던 정민 관련 정보는 지금 어떤 상태일까요?' ③ (Memory를 지웠다면) '지운 정보는 지금 어떻게 됐을까요?' — 결과 카드의 보관 예외 안내(검토된 대화 사본 최대 3년)를 읽었는지가 이해 판정 기준이에요. '그래도 다 지워졌을지 의심된다'는 반응은 이해 실패가 아니라 신뢰 관찰값으로 따로 기록하세요.",
      indicators:[3,4], interact:"클릭 가능 — <b>'지금 확인하기'</b>(누르기까지 시간 자동 기록), <b>'취소'</b>(처리 이전으로 되돌리고 B2로 복귀). 결과 문구는 B2에서 고른 항목에 맞춰 바뀝니다."},
    B4:{phase:'b', script:"참가자가 스스로 들어온 경우의 확인 화면입니다. '이 화면에서 무엇을 알 수 있나요?' → '정민 관련 정보 중 아직 남아 있는 건 무엇일까요?' 신뢰에 관한 질문은 여기서 하지 말고 마무리 단계로 미루세요.",
      indicators:[3,4,5], interact:"클릭 가능 — <b>'채팅으로 돌아가기'</b>(B5로 이동), ← 로 B3 복귀."},
    B5:{phase:'b', script:"[Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 마무리 질문은 과제 C와 SUS까지 모두 끝난 뒤 마지막 화면에서 해요.",
      indicators:[4,5], interact:"클릭 지점 없음 — 처리 결과 카드와 마무리 답변만 표시됩니다."},
    QA:{phase:'-', script:"[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요.",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QB:{phase:'-', script:"[과제 직후 설문 · 채팅 삭제 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(B-09, 진행자 기록) 그다음 참가자가 화면의 설문 5문항에 직접 답하고 '다음'을 누르게 두세요.",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QS:{phase:'-', script:"[SUS] 마지막 상황의 설문 다음에 항상 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요.",
      indicators:[], interact:"클릭 가능 — 문항별 1~5, <b>다음</b>(10문항 모두 답하면 활성화)."},
    SC:{phase:'c', script:"(참가자 모드 전용) 상황 3 안내 카드예요. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능: <b>시작하기</b>"},
    C1:{phase:'c', script:"질문이 미리 입력돼 있어요. 참가자가 전송을 누르게 두세요.", indicators:[], interact:"클릭 가능: 전송"},
    C2:{phase:'c', script:"[통합 과제] 최종 디자인처럼 답변 아래에 '출처 확인', 칩('이 답변에 쓰인 정보 관리하기'), 채팅 입력이 모두 있어요. 어떤 경로를 고르는지 지켜보세요. 방법은 알려 주지 마세요. 정답은 정해 두지 않아요. 참가자가 말한 의도와 실제 결과가 맞는지, 다른 정보(요가 예약)까지 영향을 받았다면 그걸 알고 했는지가 핵심이에요.", indicators:[1,2,4], interact:"클릭 가능: 출처 확인, 칩, 채팅 입력"},
    C3:{phase:'c', script:"[출처 확인 경로] Gmail 토글은 앱 전체 단위라 끄면 요가 예약도 함께 막혀요. 참가자가 그걸 알고 그렇게 하는지 보세요(원해서 끄는 것도 괜찮아요).", indicators:[1,4], interact:"클릭 가능: 펼치기, 앱 토글, 메모리 삭제, 닫기"},
    C4:{phase:'c', script:"[칩 경로] 주제별 목록이에요. '이사 준비'만 고르는지, '운동'도 고르는지 보세요.", indicators:[1,5], interact:"클릭 가능: 주제 선택, 다음, 닫기"},
    C5:{phase:'c', script:"처리 목록이에요. 체크를 바꾸는지, '삭제돼요/참조만 차단돼요'를 알아차리는지 보세요.", indicators:[3,4,5], interact:"클릭 가능: 항목 체크, 취소, 선택 항목 처리"},
    C6:{phase:'c', script:"처리 결과예요. 참가자가 끝났다고 하면 '과제 완료'를 누르게 두세요.", indicators:[3], interact:"클릭 가능: 취소(되돌리기)"},
    QC:{phase:'-', script:"[과제 직후 설문 · 이사 상황] 설문 전에 먼저 말로: '지금 이사 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?' 그다음 화면 설문(3문항)에 답하게 두세요.", indicators:[3,5], interact:"클릭 가능: 문항별 보기, 다음"},
    END:{phase:'-', script:"세션 종료 화면이에요(SUS까지 끝난 상태). 마무리 질문과 디브리핑을 진행한 뒤, 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고 다음 참가자는 '새 참가자로 시작'을 누르세요.", indicators:[], interact:"참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송)."},
  };
  const PHASE_A = ['A1','A1B','A1C','A2','A3','A4'];
  const PHASE_B = ['B1','B2','B3','B4','B5'];
  const PHASE_C = ['C1','C2','C3','C4','C5','C6'];
  const seg = ph => (MODE === 'participant' ? ['S' + ph] : []).concat(ph === 'A' ? PHASE_A : ph === 'B' ? PHASE_B : PHASE_C);
  const FIRST = SEQ[0], SECOND = SEQ[1];
  // 과제 C(통합)는 A·B를 마친 뒤 항상 세 번째로 해요. SUS는 C까지 끝난 뒤.
  const ORDER = ['START'].concat(seg(FIRST), ['Q' + FIRST], seg(SECOND), ['Q' + SECOND], seg('C'), ['QC'], WITH_SUS ? ['QS'] : [], ['END']);
  const firstStep = ph => seg(ph)[0];
  const TASK_TEXT = {
    A:  { steps:['미리 입력된 질문을 보내고 답변을 살펴보세요'] },
    A2: { ctx:'정민은 지금은 연락하지 않는 사람이에요', steps:['답변에 정민 이야기가 왜 나왔는지 확인하기', '앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기'] },
    B:  { ctx:'정민은 지금은 연락하지 않는 사람이에요', steps:['채팅으로 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기'] },
    C:  { ctx:'이사는 안 가기로 했어요', steps:['앞으로 이사 관련 정보가 답변에 쓰이지 않게 하기'] },
  };
  // 두 번째로 하는 상황 카드에만 '앞의 상황과는 별개' 문구를 보여요.
  document.querySelectorAll('.screen[data-step="SA"] .order-note').forEach(el => el.style.display = SEQ === 'BA' ? '' : 'none');
  document.querySelectorAll('.screen[data-step="SB"] .order-note').forEach(el => el.style.display = SEQ === 'AB' ? '' : 'none');
  if(SEQ === 'BA'){
    const badge = ph => document.querySelector(`.screen[data-step="S${ph}"] .intro-badge`);
    badge('B').textContent = '상황 1'; badge('A').textContent = '상황 2';
  }

  /* ---------------- 상태 ---------------- */
  let current = 'START';
  let stepEnteredAt = 0;
  let devMode = false;
  let sheetBefore = null;
  let refState, memState, b2Result, lastUndo, undoTimer, b1Text, b1Asks = [], svDraft = {}, survey = {}, svIdx = {};
  const M = {}; // 지표 계산용 타임스탬프

  function resetState(){
    refState = { memory:true, gmail:true, calendar:true, photos:true };
    memState = { used:false, all:false };
    b2Result = null;
    lastUndo = null;
    b1Text = '';
    b1Asks = [];
    svDraft = {}; survey = {}; svIdx = {};
    window.TaskC?.reset();
  }
  resetState();

  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const phone = $('#phone');

  /* ---------------- 화면 전환 ---------------- */
  function showScreen(step){
    $$('.screen').forEach(el => el.classList.remove('active'));
    const el = $(`.screen[data-step="${step}"]`);
    if(el){ el.classList.add('active'); el.scrollTop = 0; }
  }

  function showStep(step){
    if(step === 'A3' && current !== 'A3') sheetBefore = JSON.stringify({ refState, memState });
    if(step === 'A3'){                // A3 = A2 화면 위에 출처 시트가 열린 상태
      showScreen('A2');
      sheetReturnFocus = document.activeElement;
      $('#sheetOverlay .sheet').style.removeProperty('--sheet-dismiss-from');
      $('#sheetOverlay').classList.add('active');
      $('.screen[data-step="A2"]').inert = true;
      $('#sheetOverlay .sheet-close').focus({preventScroll:true});
      $('#sheetOverlay .sheet').scrollTop = 0;
    }else if(step === 'C3' || step === 'C4'){
      showScreen('C2');
      $('#sheetOverlay').classList.remove('active');
      $('#cSheet').classList.toggle('active', step === 'C3');
      $('#cTopics').classList.toggle('active', step === 'C4');
      $('.screen[data-step="C2"]').inert = true;
    }else{
      showScreen(step);
      $('#sheetOverlay').classList.remove('active');
      $('.screen[data-step="A2"]').inert = false;
      $('#cSheet').classList.remove('active'); $('#cTopics').classList.remove('active');
      const c2 = $('.screen[data-step="C2"]'); if(c2) c2.inert = false;
    }
  }

  function go(step, why){
    if(!STEPS[step]) return;
    const prev = current;
    clearTimeout(transitionTimer);
    $('#sheetOverlay').classList.remove('closing');
    phone.classList.toggle('nav-back', ORDER.indexOf(step) < ORDER.indexOf(prev));
    const dwell = Math.round(performance.now() - stepEnteredAt);

    if(['B3','B4','B5'].includes(step) && !b2Result) renderB3B4();   // 바로가기로 들어온 경우 현재 체크 상태로 표시

    showStep(step);
    hideSnackbar();

    current = step;
    stepEnteredAt = performance.now();
    enterEffects(step, prev);
    if(prev !== step) Logger.log('step', { step, from: prev, prevDwellMs: dwell, via: why || '' });
    markMilestones(step);

    renderPanel();
    window.Interactions?.sync();
    renderTaskbar();

    const d = STEPS[step];
    if(d.autoNext) autoTimer = setTimeout(() => { if(current === step) go(d.autoNext, 'auto'); }, d.autoDelay || 1200);
    if(step === 'END'){ onEnd(); celebrate(); }
  }

  /* ---------------- 화면 진입 연출 ---------------- */
  // 연출은 이 기기에서만 재생돼요. 실시간 보기(진행자 쪽)는 연출 없이 최종 화면을 바로 보여줍니다.
  const REVEAL_MS = 1600;
  let responseTimer = null, responseVisible = null, responsePaused = false;
  let processTimer = null, transitionTimer = null, autoTimer = null;
  let sheetReturnFocus = null;
  const responseParts = () => $$('.screen[data-step="A2"] .msg-ai > *');
  let fxTimers = [];
  function clearFx(){
    fxTimers.forEach(clearTimeout); fxTimers = [];
    clearTimeout(autoTimer); autoTimer = null;
    clearTimeout(responseTimer); responseTimer = null;
    clearTimeout(processTimer); processTimer = null;
    const process = $('#b2ProcessBtn');
    process.classList.remove('busy'); process.textContent = '선택 항목 처리';
    process.setAttribute('aria-busy', 'false');
    b2Boxes().forEach(box => box.removeAttribute('aria-disabled'));
    const card = $('.screen[data-step="B2"] .ai-card');
    card.classList.remove('processing');
    syncSelectAll();
    responseVisible = null; responsePaused = false;
    renderResponse();
    const typed = $('#a1bTyped');
    typed.textContent = typed.dataset.full || typed.textContent;
    typed.classList.remove('caret');
    $('#a1bSend').classList.remove('wait');
    $('#a1bSend').setAttribute('aria-disabled', 'false');
    $$('.stream').forEach(el => el.classList.remove('stream'));
    $$('.screen.loading').forEach(el => el.classList.remove('loading'));
    $$('.screen.c-loading').forEach(el => el.classList.remove('c-loading'));
  }
  const later = (fn, ms) => fxTimers.push(setTimeout(fn, ms));

  function enterEffects(step, prev){
    clearFx();
    if(step === 'A1B' && prev !== 'A1B'){          // 질문이 한 글자씩 입력됨
      const typed = $('#a1bTyped'), send = $('#a1bSend');
      const full = typed.dataset.full = I18n.t('요즘 새로 생긴 이탈리안 레스토랑 추천해줘');
      // 질문은 미리 입력된 상태로 보여요(한 글자씩 입력되는 연출 없음).
      typed.textContent = full; typed.classList.remove('caret'); send.classList.remove('wait'); send.setAttribute('aria-disabled','false');
    }
    if(step === 'A2' && prev === 'A1C'){           // 답변이 위에서부터 순서대로 나타남
      responseVisible = 0; responsePaused = false;
      M.a2Enter = null;
      renderResponse(); advanceResponse();
    }
    if(step === 'C2' && prev === 'C1'){
      const scr = $('.screen[data-step="C2"]');
      scr.classList.add('c-loading');
      later(() => { scr.classList.remove('c-loading'); TaskC.markReady(); Logger.log('response_complete', { step:'C2' }); }, 1300);
    }
    if(step === 'B2' && prev === 'B1'){            // 응답 대기 후 카드 등장
      const scr = $('.screen[data-step="B2"]');
      scr.classList.add('loading');
      later(() => scr.classList.remove('loading'), 1200);
    }
  }

  function renderResponse(){
    const parts = responseParts();
    const generating = responseVisible !== null && responseVisible < parts.length;
    parts.forEach((part, i) => part.classList.toggle('response-pending', generating && i >= responseVisible));
    const controls = $('#responseControl');
    controls.hidden = !generating;
    controls.classList.toggle('paused', responsePaused);
    controls.querySelector('span').textContent = responsePaused ? '계속 생성' : '생성 중지';
    controls.setAttribute('aria-label', I18n.t(responsePaused ? '계속 생성' : '생성 중지'));
    $('.screen[data-step="A2"] .msg-ai').setAttribute('aria-busy', String(generating && !responsePaused));
  }

  function advanceResponse(){
    if(current !== 'A2' || responsePaused || responseVisible === null) return;
    const parts = responseParts();
    if(responseVisible >= parts.length) return;
    const body = $('.screen[data-step="A2"] .chat-body');
    const follow = body.scrollHeight - body.scrollTop - body.clientHeight < 72;
    const part = parts[responseVisible++];
    renderResponse();
    part.classList.remove('response-arrive');
    void part.offsetWidth;
    part.classList.add('response-arrive');
    if(follow) body.scrollTo({top: body.scrollHeight, behavior: 'smooth'});
    if(responseVisible < parts.length) responseTimer = setTimeout(advanceResponse, REVEAL_MS / Math.max(1, parts.length - 1));
    else {
      M.a2Enter = performance.now(); Logger.log('response_complete', {step:current});
      if(!M.aGoal){ M.aGoal = true; if(MODE === 'participant'){ Logger.log('task_goal_shown', {step:current}); M.flash = true; } renderTaskbar(); }
    }
  }

  function toggleResponse(){
    if(current !== 'A2' || responseVisible === null || responseVisible >= responseParts().length) return;
    responsePaused = !responsePaused;
    clearTimeout(responseTimer);
    renderResponse();
    Logger.log(responsePaused ? 'response_pause' : 'response_resume', {step:current, visible:responseVisible});
    if(!responsePaused) advanceResponse();
  }

  function stopLoading(){
    if(current !== 'A1C') return;
    Logger.log('response_cancel', {step:current});
    go('A1B', 'response-cancel');
  }

  function markMilestones(step){
    const p = performance.now();
    if(step === 'A1' && !M.aStart) M.aStart = p;
    if(step === 'A2' && responseVisible === null && !M.a2Enter) M.a2Enter = p;
    if(step === 'B1' && !M.bStart) M.bStart = p;
    if(step === 'C1' && !M.cStart) M.cStart = p;
    if(step === 'B3') M.b3Enter = p;
  }

  function advance(){
    if(current === 'START'){ start(); return; }
    const i = ORDER.indexOf(current);
    if(i >= 0 && i < ORDER.length - 1) go(ORDER[i+1], 'panel-next');
  }

  function closeSheet(how){
    const ov = $('#sheetOverlay');
    if(current === 'A3'){
      if(ov.classList.contains('closing')) return;
      Logger.log('sheet_close', { step:'A3', how });
      ov.classList.add('closing');
      transitionTimer = setTimeout(() => {
        ov.classList.remove('closing');
        if(current === 'A3') {
          go('A2', 'sheet-close');
          afterSheetClose();
          if(sheetReturnFocus && sheetReturnFocus.isConnected) sheetReturnFocus.focus({preventScroll:true});
        }
      }, 200);
    }
    else ov.classList.remove('active');
  }

  /* ---------------- 세션 ---------------- */
  function start(){
    const input = $('#pidInput');
    if(!consentOk()) return;
    const pid = (input.value || '').trim().toUpperCase() || PID;
    if(!pid){ $('#pidError').classList.add('show'); input.focus(); return; }
    $('#pidError').classList.remove('show');
    Object.keys(M).forEach(k => delete M[k]);
    resetState(); applyAll();
    window.Interactions?.reset();
    const consentAt = new Date().toISOString();
    const consentItems = ['record', 'log', 'stop'];   // 체크 한 번으로 세 항목 모두 동의
    Logger.start({ participant: pid, mode: MODE, order: SEQ, sus: WITH_SUS, language: I18n.language, pidFromLink: !!PID,
      consent: { at: consentAt, items: consentItems } });
    Logger.log('consent', { at: consentAt, items: consentItems });
    stepEnteredAt = performance.now();
    renderSession();
    go(firstStep(FIRST), 'start');
  }

  function newSession(){
    if(Logger.active && !confirm(I18n.t('현재 세션 기록을 보관함에 저장하고 새 참가자로 시작할까요?'))) return;
    if(Logger.active) Logger.archive(summary());
    Object.keys(M).forEach(k => delete M[k]);
    resetState(); applyAll();
    window.Interactions?.reset();
    $('#pidInput').value = '';
    $$('[data-consent]').forEach(el => el.checked = false); syncConsent();
    $$('.screen').forEach(el => el.classList.remove('active'));
    current = 'START';
    showScreen('START');
    $('#sheetOverlay').classList.remove('active');
    renderSession(); renderPanel(); renderTaskbar(); renderFeed(); renderArchive();
    $('#endStatus').textContent = '';
  }

  function resetScenario(){
    resetState(); applyAll();
    window.Interactions?.reset();
    Logger.log('scenario_reset', { step: current });
    go(firstStep(FIRST), 'reset');
  }

  function taskDone(){
    const phase = PHASE_A.includes(current) ? 'A' : PHASE_B.includes(current) ? 'B' : PHASE_C.includes(current) ? 'C' : null;
    if(!phase) return;
    finishPhase(phase, 'task-button');
  }

  function finishPhase(phase, how){
    const startT = phase === 'A' ? M.aStart : phase === 'B' ? M.bStart : M.cStart;
    Logger.log('task_done', { step: current, phase, how: how || 'in-app', taskMs: startT ? Math.round(performance.now() - startT) : null });
    M['done' + phase] = true;
    go('Q' + phase, 'task-done');
  }

  // 테스트를 모두 마쳤을 때만 축하 효과(과제 중에는 정답 신호가 되지 않도록 쓰지 않아요).
  function celebrate(){
    if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti'; cv.width = phone.clientWidth * 2; cv.height = phone.clientHeight * 2;
    phone.appendChild(cv);
    const g = cv.getContext('2d'), W = cv.width, H = cv.height;
    const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#a142f4', '#24c1e0'];
    const ps = Array.from({ length: 90 }, () => ({
      x: W / 2 + (Math.random() - .5) * W * .3, y: H * .42, vx: (Math.random() - .5) * 22, vy: -Math.random() * 26 - 10,
      s: 8 + Math.random() * 10, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[Math.random() * colors.length | 0] }));
    const t0 = performance.now();
    (function frame(t){
      const k = (t - t0) / 1800; g.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += .9; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        g.save(); g.globalAlpha = Math.max(0, 1 - k); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if(k < 1) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }
  async function onEnd(){
    if(!Logger.active) return;
    Logger.finish(summary());
    renderPanel();
    const status = $('#endStatus');
    const cfg = window.UT_CONFIG || {};
    if(cfg.LOG_ENDPOINT){
      status.textContent = '기록을 전송하고 있어요…';
      const r = await Logger.send();
      status.textContent = r === 'sent' ? '기록이 전송됐어요. 창을 닫으셔도 돼요.' : '전송에 실패했어요. 아래 버튼으로 기록을 받아 진행자에게 보내 주세요.';
      $('#endActions').style.display = r === 'sent' ? 'none' : '';
    }else{
      // 결과는 Firebase로 저장되고 진행자 패널에서 받으니, 참가자 화면에는 버튼을 숨겨요(연결 실패 시에만 보여요).
      const saved = window.Live && Live.connected;
      $('#endActions').style.display = MODE === 'participant' && !saved ? '' : 'none';
      if(MODE === 'participant') status.textContent = saved ? '' : I18n.t('저장에 실패했어요. 아래 버튼으로 기록을 받아 진행자에게 보내 주세요.');
    }
  }

  /* ---------------- 펼치기 / 토글 ---------------- */
  function expand(el, sel){
    const wrap = el.closest(sel);
    if(!wrap) return;
    wrap.classList.toggle('open');
    el.setAttribute('aria-expanded', String(wrap.classList.contains('open')));
    window.Interactions?.sync();
    Logger.log('expand', { step: current, tag: el.dataset.tag || '', open: wrap.classList.contains('open') });
  }

  function toggleRef(key){
    refState[key] = !refState[key];
    applyRefs();
    Logger.log('toggle', { step: current, ref: key, on: refState[key] });
  }

  function applyRefs(){
    Object.keys(refState).forEach(k => $$(`.toggle[data-ref="${k}"]`).forEach(el => {
      el.classList.toggle('on', refState[k]);
      el.setAttribute('aria-checked', String(refState[k]));
      const box = el.closest('.source-item, .conn-wrap');
      if(box) box.classList.toggle('ref-off', !refState[k]);
    }));
    renderA2Notice();
  }

  // A3에서 바꾼 내용을 A2 답변 아래에 알려줘요 (출처 시트를 닫고 돌아왔을 때 변화가 보이도록).
  const REF_NAME = { memory:'Memory', gmail:'Gmail', calendar:'Calendar', photos:'Photos' };
  const RETENTION = '사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요';
  function renderA2Notice(){
    const el = $('#a2Notice');
    if(!el || !refState || !memState) return;
    const off = Object.keys(refState).filter(k => !refState[k]).map(k => REF_NAME[k]);
    const parts = [];
    if(memState.all) parts.push('메모리 전체 삭제됨');
    else if(memState.used) parts.push('이 답변에 쓰인 메모리 2건 삭제됨');
    if(off.length) parts.push(off.join(', ') + ' 참조 끔');
    const keep = (memState.used || memState.all) ? `<div class="nt-foot">${esc(I18n.t(RETENTION))}</div>` : '';
    el.innerHTML = parts.length ? `<div class="nt-title">${esc(I18n.t('설정이 바뀌었어요'))}</div><ul class="nt-list">${parts.map(x => `<li>${esc(I18n.t(x))}</li>`).join('')}</ul><div class="nt-foot">${esc(I18n.t('다음 답변부터 반영돼요'))}</div>${keep}` : '';
    el.classList.toggle('show', parts.length > 0);
  }

  /* ---------------- 메모리 삭제 (A3: 이 답변에 쓰인 2건 / A4: 전체) ---------------- */
  function deleteMemory(scope, ev){
    if(ev) ev.stopPropagation();
    const before = { mem: Object.assign({}, memState), ref: refState.memory };
    if(scope === 'all'){ memState.all = true; memState.used = true; refState.memory = false; }
    else { memState.used = true; }
    lastUndo = before;
    applyMemory(); applyRefs();
    Logger.log('delete', { step: current, target: 'memory', scope });
    showSnackbar(scope === 'all' ? '메모리 전체 삭제됨' : '메모리 2건 삭제됨');
  }

  function undoDelete(){
    if(!lastUndo) return;
    memState = lastUndo.mem; refState.memory = lastUndo.ref;
    lastUndo = null;
    applyMemory(); applyRefs();
    Logger.log('undo', { step: current, target: 'memory' });
    hideSnackbar();
  }

  function applyMemory(){
    const sheetMem = $('#sheetOverlay [data-ref="memory"]').closest('.source-item');
    sheetMem.classList.toggle('deleted', memState.used || memState.all);
    if(memState.used || memState.all) sheetMem.classList.remove('open');

    const a4Mem = $('#a4MemCount').closest('.conn-wrap');
    a4Mem.classList.toggle('deleted', memState.all);
    if(memState.all) a4Mem.classList.remove('open');
    $('#a4MemCount').textContent = memState.all ? '' : (memState.used ? '9건' : '11건');
    renderA4More();
    $$('[data-mem="used"]').forEach(el => el.classList.toggle('gone', memState.used));
    renderA2Notice();
    window.Interactions?.sync();
  }

  // A4 '+N건 더보기': 10건씩 실제로 펼쳐요.
  const A4_POOL = {
    memory: () => (memState.used ? [] : ['2025.1.20 대화에서 "정민이 좋아하던 재즈바" 언급']).concat([
      '2025.2.1 대화에서 "회사 근처 필라테스" 언급', '2025.1.12 대화에서 "부모님 결혼기념일 선물" 언급', '2024.12.24 대화에서 "연말 제주 여행 일정" 언급',
      '2024.12.3 대화에서 "고양이 사료 브랜드" 언급', '2024.11.18 대화에서 "이직 준비 포트폴리오" 언급', '2024.10.30 대화에서 "할로윈 파티 의상" 언급',
      '2024.10.2 대화에서 "가을 캠핑 장비" 언급', '2024.9.14 대화에서 "추석 기차표 예매" 언급']),
    gmail: () => {
      const t = ['[쿠팡] 주문하신 상품이 배송 완료되었습니다', '[카카오뱅크] 이번 달 카드 이용 내역 안내', '[무신사] 주문이 접수되었습니다', '[CGV] 예매가 완료되었습니다',
        '[스시타로] 오마카세 예약 확인', '[배달의민족] 주문하신 음식이 출발했어요', '[네이버페이] 결제가 완료되었습니다', '[인터파크] 공연 예매 확인',
        '[SRT] 승차권 예매 내역', '[올리브영] 주문 상품 발송 안내', '[당근] 거래 후기가 도착했어요', '[야놀자] 숙소 예약이 확정되었습니다'];
      return Array.from({ length: 128 }, (_, n) => { const d = new Date(2025, 2, 12 - n * 3); return [t[n % t.length], `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`]; });
    },
    calendar: () => {
      const t = ['팀 주간 회의', '치과 정기 검진', '헬스 PT', '엄마 생신', '프로젝트 마감', '대학 동기 모임', '정민이랑 영화', '자동차 정기 점검', '독서 모임'];
      return Array.from({ length: 34 }, (_, n) => { const d = new Date(2025, 2, 18 - n * 9); return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} 일정 "${t[n % t.length]}"`; });
    },
  };
  function a4Rest(btn){ return A4_POOL[btn.dataset.src]().length - (+btn.dataset.shown || 0); }
  function renderA4More(){
    $$('.screen[data-step="A4"] .chip-more[data-src]').forEach(btn => {
      const list = A4_POOL[btn.dataset.src](), shown = Math.min(+btn.dataset.shown || 0, list.length);
      btn.parentElement.querySelectorAll('.data-chip.gen').forEach(el => el.remove());
      list.slice(0, shown).forEach(txt => { const d = document.createElement('div'); d.className = 'data-chip gen'; d.innerHTML = Array.isArray(txt) ? `<span>${esc(txt[0])}<span class="dt">${esc(txt[1])}</span></span>` : `<span>${esc(txt)}</span>`; btn.before(d); });
      const rest = list.length - shown;
      btn.textContent = rest > 0 ? I18n.t(`+ ${rest}건 더보기`) : I18n.t('접기');
    });
  }
  function a4More(btn){
    const rest = a4Rest(btn);
    btn.dataset.shown = rest > 0 ? (+btn.dataset.shown || 0) + 10 : 0;
    renderA4More();
    Logger.log('more', { step: current, src: btn.dataset.src, open: rest > 0, shown: +btn.dataset.shown });
  }

  function showSnackbar(msg){
    clearTimeout(undoTimer);
    const bar = $('#snackbar');
    bar.querySelector('.snackbar-msg').textContent = msg;
    $('#snackUndo').hidden = false;
    bar.classList.add('show');
    $('#sheetOverlay').classList.add('snack-lift');
    undoTimer = setTimeout(() => { lastUndo = null; hideSnackbar(); }, 4000);
  }
  function hideSnackbar(){ $('#snackbar').classList.remove('show'); $('#sheetOverlay').classList.remove('snack-lift'); $('#snackUndo').hidden = false; }
  // 실행취소 없이 잠깐 보이는 안내
  function showToast(msg){
    showSnackbar(msg); lastUndo = null; $('#snackUndo').hidden = true;
  }
  // 출처 패널에서 바꾼 게 있으면, 닫았을 때 바로 알려 주고 답변 아래 변경 안내로 데려가요.
  function afterSheetClose(){
    const changed = sheetBefore !== null && sheetBefore !== JSON.stringify({ refState, memState });
    sheetBefore = null;
    if(!changed) return;
    showToast(I18n.t('설정이 바뀌었어요 · 다음 답변부터 반영돼요'));
    Logger.log('a3_change_feedback', { step: current });
  }

  /* ---------------- B1 (자유 입력 요청) ---------------- */
  const B1_DEFAULT = '정민이랑 관련된 정보 다 지워줘';   // 바로가기로 B2 이후에 들어온 경우에만 쓰는 대체 문구
  const b1Input = $('#b1Input');
  function syncB1(){
    $('#b1Send').classList.toggle('wait', !b1Input.value.trim());
    $('#b1Send').setAttribute('aria-disabled', String(!b1Input.value.trim()));
    $$('.b1-echo').forEach(el => { el.textContent = b1Text || I18n.t(B1_DEFAULT); el.setAttribute('data-no-translate',''); });
  }
  // 요청에 정리할 대상(사람·지칭어)이 있어야 정리 목록을 보여줘요. 없으면 되물어요.
  const B1_TARGET = /정민|jeongmin|jungmin|그\s?사람|이\s?사람|그\s?분|이\s?분|걔|그\s?친구|이\s?친구|\bthat person\b|\bthis person\b|\bhim\b|\bher\b|\bthem\b/i;
  const B1_INTENT = /지워|지우|삭제|잊어|잊게|빼|없애|안\s?쓰|쓰지\s?마|쓰지\s?않|기억하지|기억\s?말|정리|숨겨|차단|forget|delete|remove|erase|stop\s+using|don'?t\s+use/i;
  const B1_REPLY = {
    noTarget: '어떤 정보를 정리할까요? 사람 이름이나 주제를 알려 주세요.',
    noIntent: '정민 님과 관련해서 무엇을 도와드릴까요?',
    other: '네, 말씀해 주세요. 무엇을 도와드릴까요?',
  };
  function renderB1Thread(){
    const box = $('#b1Thread');
    box.innerHTML = b1Asks.map(t => `<div class="msg-user" data-no-translate>${esc(t)}</div><div class="msg-ai b1-clarify">${esc(I18n.t(B1_REPLY[b1Kind(t)]))}</div>`).join('');
    const hero = $('.screen[data-step="B1"] .b1-hero'); if(hero) hero.hidden = b1Asks.length > 0;
    const body = box.closest('.chat-body'); if(body) body.scrollTop = body.scrollHeight;
  }
  function b1Kind(t){
    const tg = B1_TARGET.test(t), it = B1_INTENT.test(t);
    return tg && it ? 'ok' : it ? 'noTarget' : tg ? 'noIntent' : 'other';
  }
  function sendB1(){
    const text = b1Input.value.trim();
    if(!text || current !== 'B1') return;
    const kind = b1Kind(text);
    if(kind !== 'ok'){
      b1Asks.push(text);
      Logger.log('b1_clarify', { step: current, text, kind, count: b1Asks.length });
      b1Input.value = ''; syncB1(); renderB1Thread();
      return;
    }
    b1Text = text;
    Logger.log('b1_request', { step: current, text, clarifiedBefore: b1Asks.length });
    syncB1();
    b1Input.blur();
    go('B2', 'b1-send');
  }
  b1Input.addEventListener('input', syncB1);
  b1Input.addEventListener('keydown', e => { if(e.key === 'Enter' && !e.isComposing){ e.preventDefault(); sendB1(); } });

  /* ---------------- B2 ~ B4 (채팅 자연어 삭제) ---------------- */
  const b2Boxes = () => $$('.screen[data-step="B2"] .check-item .checkbox[data-src]');

  function toggleCheckItem(el){
    if($('#b2ProcessBtn').classList.contains('busy')) return;
    el.classList.toggle('checked');
    syncSelectAll();
    Logger.log('check', { step: current, src: el.dataset.src, checked: el.classList.contains('checked') });
  }
  function toggleSelectAll(el){
    if($('#b2ProcessBtn').classList.contains('busy')) return;
    const next = !el.classList.contains('checked');
    b2Boxes().forEach(cb => cb.classList.toggle('checked', next));
    syncSelectAll();
    Logger.log('check_all', { step: current, checked: next });
  }
  function syncSelectAll(){
    const boxes = b2Boxes();
    const all = boxes.every(b => b.classList.contains('checked'));
    const any = boxes.some(b => b.classList.contains('checked'));
    const selAll = $('.screen[data-step="B2"] .select-all-row .checkbox');
    selAll.classList.toggle('checked', all);
    selAll.textContent = all ? '✓' : '';
    selAll.classList.toggle('mixed', any && !all);
    selAll.setAttribute('aria-checked', all ? 'true' : any ? 'mixed' : 'false');
    boxes.forEach(b => {
      b.textContent = b.classList.contains('checked') ? '✓' : '';
      b.setAttribute('aria-checked', String(b.classList.contains('checked')));
    });
    const picked = boxes.filter(b => b.classList.contains('checked')).reduce((a, b) => a + (SRC[b.dataset.src] ? SRC[b.dataset.src].count : 0), 0);
    $('#selectionCount').innerHTML = `${esc(I18n.t('처리할 정보'))} <b>${picked}</b><span class="sc-total">/ ${B2_TOTAL}건</span>`;
    $('#b2ProcessBtn').disabled = !any;
  }

  function processB2(){
    const btn = $('#b2ProcessBtn');
    const sel = currentSelection();
    if(!Object.values(sel).some(Boolean) || btn.classList.contains('busy')) return;
    btn.classList.add('busy'); btn.textContent = '처리 중…'; btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    $('.screen[data-step="B2"] .ai-card').classList.add('processing');
    b2Boxes().forEach(box => box.setAttribute('aria-disabled', 'true'));
    Logger.log('b2_process', { step: current, selected: sel });
    processTimer = setTimeout(() => {
      btn.classList.remove('busy'); btn.textContent = '선택 항목 처리';
      if(current !== 'B2') return;
      b2Result = sel;
      renderB3B4();
      go('B3', 'b2-process');
    }, 900);
  }

  function undoB2(){
    Logger.log('b3_cancel', { step: current, selected: b2Result });
    b2Result = null;
    go('B2', 'b3-cancel');
  }

  const SRC = {
    memory:  { name:'Memory',   count:3,  del:true },
    gmail:   { name:'Gmail',    count:24, del:false },
    calendar:{ name:'Calendar', count:9,  del:false },
  };
  const B2_TOTAL = Object.values(SRC).reduce((a, s) => a + s.count, 0);
  // 펼친 그룹 안에서 '+N건 더보기'로 추가 항목을 보여줘요.
  function renderMoreToggles(){
    $$('.more-toggle').forEach(t => {
      const more = t.previousElementSibling;
      const n = t.dataset.n || (t.dataset.n = (t.textContent.match(/\d+/) || ['0'])[0]);
      t.textContent = more && !more.hidden ? I18n.t('접기') : I18n.t(`+ ${n}건 더보기`);
    });
  }
  function toggleMore(el){
    const more = el.previousElementSibling;
    if(!more) return;
    more.hidden = !more.hidden;
    renderMoreToggles();
    Logger.log('more', { step: current, tag: el.dataset.tag || '', open: !more.hidden });
  }

  function currentSelection(){
    const sel = {};
    b2Boxes().forEach(cb => sel[cb.dataset.src] = cb.classList.contains('checked'));
    return sel;
  }

  const ICON_DEL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></svg>';
  const ICON_BLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-2.6 3.7"/><path d="M6.6 6.6C4.3 8 2.7 10.1 2 12c1 2.5 5 7 10 7 1.7 0 3.2-.5 4.6-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  // B2 화면의 앱 아이콘을 복사해요(그라디언트 id는 화면마다 겹치지 않게 바꿔요).
  function srcIcon(k, sfx){
    const src = $(`.screen[data-step="B2"] [data-src="${k}"]`)?.closest('.check-item-head')?.querySelector('.icon-chip');
    if(!src) return '';
    return src.outerHTML.replace(/id="([^"]+)"/g, `id="$1_${sfx}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_${sfx})`).replace('icon-chip sm', 'icon-chip b3-ic');
  }
  function renderB3B4(){
    const sel = b2Result || currentSelection();
    const lines = sfx => Object.keys(SRC).filter(k => sel[k]).map(k => {
      const s = SRC[k];
      const chip = `<span class="st-chip ${s.del ? 'del' : 'block'}">${s.del ? ICON_DEL : ICON_BLOCK}${s.del ? '삭제됨' : '참조 차단'}</span>`;
      const head = `<div class="b3-head"><span class="b3-name">${s.name} <span class="b3-count">${s.count}건</span></span>${chip}</div>`;
      const desc = s.del
        ? `<div class="b3-desc">${s.name}에서 지웠어요</div>`
        : `<div class="b3-desc">원본은 ${s.name}에 그대로 있어요</div>`;
      return `<div class="b3-line">${srcIcon(k, sfx)}<div class="b3-main">${head}${desc}</div></div>`;
    }).join('');
    $('#b3Lines').innerHTML = lines('b3'); $('#b5Lines').innerHTML = lines('b5');
    const nDel = Object.keys(SRC).filter(k => sel[k] && SRC[k].del).length;
    const nBlock = Object.keys(SRC).filter(k => sel[k] && !SRC[k].del).length;
    ['#b3Note', '#b4Note', '#b5Note'].forEach(id => { const n = $(id); if(n) n.hidden = !nDel; });
    $('#b3Title').textContent = $('#b5Title').textContent = nDel && nBlock ? '요청을 처리했어요' : nDel ? '선택한 정보를 삭제했어요' : '선택한 정보의 참조를 차단했어요';

    Object.keys(SRC).forEach(k => {
      const item = $(`.screen[data-step="B4"] [data-b4="${k}"]`);
      const d = $(`.screen[data-step="B4"] [data-b4d="${k}"]`);
      const two = (cls, ic, a, b) => `<span class="st-chip ${cls}">${ic}${a}</span><span class="b4-desc">${b}</span>`;
      if(!sel[k]){ d.innerHTML = two('keep', '', '그대로 유지됨', '계속 답변에 쓰일 수 있어요'); item.classList.remove('dim'); }
      else if(SRC[k].del){ d.innerHTML = two('del', ICON_DEL, '삭제됨', '답변에 더 이상 쓰이지 않아요'); item.classList.remove('dim'); }
      else { d.innerHTML = two('block', ICON_BLOCK, '참조 차단됨', '원본은 그대로, 앞으로 답변에 안 쓰여요'); item.classList.remove('dim'); }
    });
  }

  function applyAll(){
    clearFx();
    svIdx = {};
    b1Input.value = ''; syncB1(); renderB1Thread();
    if($('.sv-opt')) renderSurvey();
    $$('.b2-more').forEach(el => el.hidden = true); renderMoreToggles();
    $$('.chip-more[data-src]').forEach(b => b.dataset.shown = 0); renderA4More();
    applyRefs(); applyMemory();
    b2Boxes().forEach(cb => cb.classList.add('checked'));
    syncSelectAll();
    $$('.open').forEach(el => el.classList.remove('open'));
    hideSnackbar();
    renderB3B4();
  }

  /* ---------------- PC 참가자 화면: 창 높이에 맞춰 휴대폰을 키워요 ---------------- */
  function fitPhone(){
    const wrap = $('.phone-wrap');
    if(MODE !== 'participant' || window.innerWidth < 900){ wrap.style.zoom = ''; window.UI_ZOOM = 1; return; }
    // 참가자마다 같은 크기로 보이게 1.1배로 고정하고, 창이 낮을 때만 줄여요.
    const z = Math.max(.8, Math.min(1.1, (window.innerHeight - 80) / 832));
    wrap.style.zoom = z.toFixed(3); window.UI_ZOOM = z;
  }
  fitPhone();
  window.addEventListener('resize', fitPhone);

  /* ---------------- 클릭 기록 (휴대폰 화면 안의 모든 클릭) ---------------- */
  phone.addEventListener('click', e => {
    if(!Logger.active) return;
    const r = phone.getBoundingClientRect();
    const z = window.UI_ZOOM || 1;   // PC에서 화면을 키운 배율만큼 되돌려 휴대폰 기준 좌표로 기록
    const x = Math.round((e.clientX - r.left) / z), y = Math.round((e.clientY - r.top) / z);
    const hit = e.target.closest('[data-tag], button, input, .hot');
    if(hit){
      const tag = hit.dataset.tag || (hit.textContent || '').trim().slice(0, 24) || hit.id || hit.tagName.toLowerCase();
      Logger.log('click', { step: current, tag, x, y });
      if(tag === '출처 확인' && M.a2Enter && !M.sourceFoundMs) M.sourceFoundMs = Math.max(0, Math.round(performance.now() - M.a2Enter));
      if(tag === '지금 확인하기' && M.b3Enter && !M.verifyMs) M.verifyMs = Math.round(performance.now() - M.b3Enter);
    }else{
      const desc = (e.target.className && typeof e.target.className === 'string' ? '.' + e.target.className.split(' ')[0] : e.target.tagName.toLowerCase())
        + ((e.target.textContent || '').trim() ? ' "' + e.target.textContent.trim().slice(0, 18) + '"' : '');
      Logger.log('misclick', { step: current, tag: desc, x, y });
    }
  }, true);

  /* ---------------- 실시간 보기용 화면 상태 (js/live.js에서 사용) ---------------- */
  // 화면은 정해진 HTML이라, 상태만 주고받으면 진행자 쪽에서 똑같이 다시 그릴 수 있어요.
  const openables = () => $$('.source-item, .conn-wrap, .check-item', phone);
  const scrollers = () => $$('.screen, .sheet, .chat-body', phone);

  function snapshot(){
    const bar = $('#snackbar');
    return {
      step: current,
      response: {visible:responseVisible, paused:responsePaused},
      ref: refState, mem: memState,
      checks: currentSelection(),
      b2: b2Result,
      b1: { draft: b1Input.value, sent: b1Text, asks: b1Asks },
      more: $$('.b2-more').map(el => !el.hidden),
      sv: svDraft,
      c: window.TaskC ? TaskC.snapshot() : null,
      open: openables().map((el, i) => el.classList.contains('open') ? i : -1).filter(i => i >= 0),
      snack: bar.classList.contains('show') ? bar.querySelector('.snackbar-msg').textContent : '',
      scroll: scrollers().map(el => { const max = el.scrollHeight - el.clientHeight; return max > 0 ? +(el.scrollTop / max).toFixed(3) : 0; }),
    };
  }

  function applySnapshot(s){
    if(!s) return;
    clearFx();
    refState = Object.assign({ memory:true, gmail:true, calendar:true, photos:true }, s.ref);
    memState = Object.assign({ used:false, all:false }, s.mem);
    b2Result = s.b2 || null;
    if(s.b1){ b1Input.value = s.b1.draft || ''; b1Text = s.b1.sent || ''; b1Asks = (s.b1.asks || []).slice(); syncB1(); renderB1Thread(); }
    if(s.more){ $$('.b2-more').forEach((el, i) => el.hidden = !s.more[i]); renderMoreToggles(); }
    svDraft = Object.assign({}, s.sv || {}); renderSurvey();
    if(s.c && window.TaskC) TaskC.apply(s.c);
    const checks = s.checks || {};
    b2Boxes().forEach(cb => cb.classList.toggle('checked', !!checks[cb.dataset.src]));
    syncSelectAll(); applyRefs(); applyMemory(); renderB3B4();
    if(s.step && s.step !== current && STEPS[s.step]){
      current = s.step;
      showStep(current);
      renderPanel();
    }
    if(s.response){
      responseVisible = s.response.visible; responsePaused = !!s.response.paused; renderResponse();
    }
    const open = s.open || [];
    openables().forEach((el, i) => el.classList.toggle('open', open.includes(i)));
    window.Interactions?.sync();
    const bar = $('#snackbar');
    if(s.snack) bar.querySelector('.snackbar-msg').textContent = s.snack;
    bar.classList.toggle('show', !!s.snack);
    const scroll = s.scroll || [];
    scrollers().forEach((el, i) => { el.scrollTop = (scroll[i] || 0) * (el.scrollHeight - el.clientHeight); });
  }

  let remote = null;   // 참가자 화면을 보는 중일 때: { meta, events, summary }
  function setRemote(r){
    remote = r;
    renderSession(); renderMetrics(); renderFeed();
  }

  // 보는 중이면 참가자 기록을, 아니면 이 브라우저의 기록을 내려받아요.
  function download(fmt){ remote ? Logger.download(fmt, remote) : Logger.download(fmt); }

  /* ---------------- 요약 지표 ---------------- */
  function summary(){
    const ev = Logger.active ? Logger.session.events : [];
    const miss = {}, dwell = {};
    let lastStep = null, lastMs = 0;
    ev.forEach(e => {
      if(e.type === 'misclick') miss[e.step] = (miss[e.step] || 0) + 1;
      if(e.type === 'step'){
        if(lastStep) dwell[lastStep] = (dwell[lastStep] || 0) + (e.ms - lastMs);
        lastStep = e.step; lastMs = e.ms;
      }
    });
    const count = type => ev.filter(e => e.type === type).length;
    const sel = b2Result;
    const out = {
      participant: Logger.active ? Logger.session.meta.participant : null,
      mode: MODE,
      A_sourceBadgeFound: !!M.sourceFoundMs,
      A_sourceBadgeFoundSec: M.sourceFoundMs ? +(M.sourceFoundMs / 1000).toFixed(1) : null,
      A_visitedA4: ev.some(e => e.type === 'step' && e.step === 'A4'),
      A_memoryDeleted: memState.all ? 'all' : memState.used ? 'used(2)' : 'none',
      A_refsFinal: Object.assign({}, refState),
      A_undoCount: count('undo'),
      order: SEQ,
      B_requestText: b1Text || null,
      B_clarifyCount: b1Asks.length,
      B_clarifiedTexts: b1Asks.slice(),
      B_moreOpened: ev.some(e => e.type === 'more' && e.open),
      B_processed: !!sel,
      B_selected: sel,
      B_verifyClicked: !!M.verifyMs,
      B_verifySec: M.verifyMs ? +(M.verifyMs / 1000).toFixed(1) : null,
      B_cancelCount: count('b3_cancel'),
      B_returnedToChat: ev.some(e => e.type === 'step' && e.step === 'B5'),
      taskDone: { A: !!M.doneA, B: !!M.doneB },
      misclicksByStep: miss,
      misclicksTotal: count('misclick'),
      dwellMsByStep: dwell,
      survey: JSON.parse(JSON.stringify(survey)),
    };
    const done = p => ev.find(e => e.type === 'task_done' && e.phase === p);
    out.A_taskSec = done('A') && done('A').taskMs != null ? +(done('A').taskMs / 1000).toFixed(1) : null;
    out.B_taskSec = done('B') && done('B').taskMs != null ? +(done('B').taskMs / 1000).toFixed(1) : null;
    const offA = ['gmail', 'calendar', 'memory', 'photos'].filter(k => !refState[k]).map(k => REF_NAME[k] + ' 끔');
    const memA = memState.all ? ['Memory 전체 삭제'] : memState.used ? ['Memory 2건 삭제'] : [];
    out.A_action = memA.concat(offA).join(' · ') || '변경 없음';
    out.B_action = sel ? (Object.keys(SRC).filter(k => sel[k]).map(k => SRC[k].name + (SRC[k].del ? ' 삭제' : ' 차단')).join(' · ') || '선택 없음') : '처리 안 함';
    out.viewport = Logger.active ? Logger.session.meta.viewport : null;
    out.resizes = ev.filter(e => e.type === 'resize').map(e => e.viewport);
    // 마지막 화면 체류 시간도 지금까지로 채워요.
    if(lastStep && Logger.active) dwell[lastStep] = (dwell[lastStep] || 0) + (ev[ev.length - 1].ms - lastMs);
    Object.assign(out, window.TaskC ? TaskC.summary() : {});
    out.C_taskSec = done('C') && done('C').taskMs != null ? +(done('C').taskMs / 1000).toFixed(1) : null;
    out.ids = resultIds(out);
    return out;
  }

  /* ---------------- 과제 직후 설문 (앱 안에서 참가자가 직접 응답) ---------------- */
  const S7 = [1, 2, 3, 4, 5, 6, 7], S5 = [1, 2, 3, 4, 5];
  const SURVEY = {
    A: { badge:'잠깐 설문', title:'저녁 약속 상황에 대해 알려 주세요', sub:'답변에 나온 정민 관련 정보를 확인하고 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'A-13', q:'정민 이야기가 나온 이유를 확인하고, 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'A-14', q:'정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'A-15', q:'앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'A-16', q:"'이 답변에 사용된 정보' 화면에서 보여준 정보의 양은 어땠나요?", scale:S7, lo:'너무 적다', hi:'너무 많다', mid:'4 = 적절하다' },
    ]},
    B: { badge:'잠깐 설문', title:'채팅으로 정리한 상황에 대해 알려 주세요', sub:'채팅으로 요청해 정민 관련 정보를 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'B-10', q:'채팅으로 요청해서 정민 관련 정보를 처리하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'B-11', q:'정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'B-12', q:'앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'B-13', q:'Gemini가 보여준 정민 관련 정보 목록과 처리 결과의 정보 양은 어땠나요?', scale:S7, lo:'너무 적다', hi:'너무 많다', mid:'4 = 적절하다' },
      { id:'B-14', q:'목록에서 처리할 항목을 확인하고 고르는 과정이 번거로웠나요?', scale:S7, lo:'전혀 번거롭지 않다', hi:'매우 번거롭다' },
    ]},
    C: { badge:'잠깐 설문', title:'이사 정보를 정리한 상황', sub:'답변에 섞여 있던 이사 관련 정보를 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'C-10', q:'이사 관련 정보를 골라서 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'C-11', q:'이사 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'C-12', q:'방금 한 처리가 어떤 정보에 영향을 줬는지 얼마나 확실히 알고 계신가요?', scale:S7, lo:'전혀 모르겠음', hi:'매우 확실히 앎' },
    ]},
    S: { badge:'마지막 설문', title:'기능 전체에 대한 설문', sub:"오늘 써 본 기능 전체(출처 확인, 답변 아래 버튼, 채팅 요청)를 떠올리며, 각 문장에 얼마나 동의하는지 골라 주세요", items:[
      '이 기능을 자주 사용하고 싶다.', '이 기능은 쓸데없이 복잡하다.', '이 기능은 사용하기 쉽다.',
      '이 기능을 쓰려면 다른 사람의 도움이 필요할 것 같다.', '이 기능의 여러 부분이 자연스럽게 잘 연결되어 있다.', '이 기능에는 앞뒤가 맞지 않는 부분이 많다.',
      '대부분의 사람들이 이 기능을 금방 익힐 것 같다.', '이 기능은 사용하기 번거롭다.', '이 기능을 자신 있게 사용할 수 있었다.',
      '이 기능을 쓰기 전에 배워야 할 것이 많았다.',
    ].map((q, i) => ({ id:`S-${String(i + 1).padStart(2, '0')}`, q, scale:S5, lo:'전혀 동의 안 함', hi:'매우 동의함' })) },
  };
  function buildSurveys(){
    const end = $('.screen[data-step="END"]');
    Object.keys(SURVEY).forEach(k => {
      const sv = SURVEY[k];
      const el = document.createElement('div');
      el.className = 'screen intro-screen survey-screen'; el.dataset.step = 'Q' + k;
      const total = sv.items.length;
      el.innerHTML = `<div class="survey-body">
        <div class="sv-top"><span class="sv-title">${esc(sv.title)}</span><span class="sv-count" id="svCount${k}">1 / ${total}</span></div>
        <div class="sv-progress"><i id="svBar${k}"></i></div>
        ${sv.items.map((it, n) => `<div class="sv-item" data-sv="${k}" data-n="${n}"><div class="sv-q">${esc(it.q)}</div>
          ${it.scale ? `<div class="sv-scale">${it.scale.map(v => `<button type="button" class="sv-opt hot" data-tag="설문 ${it.id}=${v}" data-id="${it.id}" data-v="${v}" onclick="App.pickSurvey('${it.id}', ${v})">${v}</button>`).join('')}</div>
            <div class="sv-ends"><span>${esc(it.lo)}</span>${it.mid ? `<span>${esc(it.mid)}</span>` : ''}<span>${esc(it.hi)}</span></div>`
          : `<div class="sv-choices">${it.choices.map(v => `<button type="button" class="sv-opt hot" data-tag="설문 ${it.id}=${v}" data-id="${it.id}" data-v="${esc(v)}" onclick="App.pickSurvey('${it.id}', '${esc(v)}')">${esc(v)}</button>`).join('')}</div>`}
        </div>`).join('')}
        <div class="sv-nav">
          <button type="button" class="sv-prev hot" id="svPrev${k}" data-tag="설문 ${k} 이전" onclick="App.surveyStep('${k}', -1)">이전</button>
          <button type="button" class="primary-btn hot" id="svNext${k}" data-tag="설문 ${k} 다음" onclick="App.surveyStep('${k}', 1)" disabled>다음</button>
        </div>
      </div>`;
      end.before(el);
    });
  }
  const surveyDone = k => SURVEY[k].items.every(it => svDraft[it.id] !== undefined);
  function renderSurvey(){
    $$('.sv-opt').forEach(b => {
      const on = String(svDraft[b.dataset.id]) === b.dataset.v;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    });
    Object.keys(SURVEY).forEach(k => {
      const items = SURVEY[k].items, total = items.length;
      if(svIdx[k] === undefined){ const f = items.findIndex(it => svDraft[it.id] === undefined); svIdx[k] = f < 0 ? total - 1 : f; }
      const i = svIdx[k];
      $$(`.sv-item[data-sv="${k}"]`).forEach(el => el.classList.toggle('cur', +el.dataset.n === i));
      const cnt = $('#svCount' + k); if(cnt) cnt.textContent = `${i + 1} / ${total}`;
      const bar = $('#svBar' + k); if(bar) bar.style.width = `${(i + 1) / total * 100}%`;
      const prev = $('#svPrev' + k); if(prev) prev.style.visibility = i ? 'visible' : 'hidden';
      const btn = $('#svNext' + k);
      if(btn){ btn.disabled = svDraft[items[i].id] === undefined; btn.textContent = I18n.t(i === total - 1 ? '완료' : '다음'); }
    });
  }
  function surveyKey(id){ return Object.keys(SURVEY).find(k => SURVEY[k].items.some(it => it.id === id)); }
  function surveyStep(k, d){
    const total = SURVEY[k].items.length, i = svIdx[k] || 0;
    if(d > 0 && svDraft[SURVEY[k].items[i].id] === undefined) return;
    if(d > 0 && i === total - 1) return submitSurvey(k);
    svIdx[k] = Math.max(0, Math.min(total - 1, i + d)); renderSurvey();
    $(`.screen[data-step="Q${k}"]`)?.scrollTo?.({ top: 0 });
  }
  let svAuto;
  function pickSurvey(id, v){
    const k = surveyKey(id), first = svDraft[id] === undefined;
    svDraft[id] = v; renderSurvey();
    Logger.log('survey_pick', { step: current, id, value: v });
    renderMetrics();
    // 처음 고른 문항은 잠깐 뒤 자동으로 다음 문항으로 넘어가요(마지막 문항은 '완료'를 직접 눌러요).
    clearTimeout(svAuto);
    if(first && k && svIdx[k] < SURVEY[k].items.length - 1) svAuto = setTimeout(() => { if(current === 'Q' + k) surveyStep(k, 1); }, 320);
  }
  function submitSurvey(k){
    if(!surveyDone(k)) return;
    survey[k] = Object.fromEntries(SURVEY[k].items.map(it => [it.id, svDraft[it.id]]));
    Logger.log('survey', { step: current, key: k, answers: survey[k] });
    const next = k === 'S' ? 'END' : k === FIRST ? firstStep(SECOND) : k === SECOND ? firstStep('C') : (WITH_SUS ? 'QS' : 'END');
    go(next, 'survey');
  }
  buildSurveys();

  /* ---------------- 결과 내보내기 (엑셀 '자동 수집' 시트에 붙여넣는 형식) ---------------- */
  const RESULT_IDS = ['A-03', 'A-11', 'A-13', 'A-14', 'A-15', 'A-16', 'B-01', 'B-03', 'B-06', 'B-07', 'B-10', 'B-11', 'B-12', 'B-13', 'B-14', 'B-16', 'B-17', 'L-01', 'L-02', 'L-03', 'L-04', 'L-05', 'L-06', 'C-05', 'C-15', 'C-06', 'C-09', 'C-07', 'C-08', 'C-10', 'C-11', 'C-12', 'L-07', 'L-08']
    .concat(Array.from({ length: 10 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`));
  function resultIds(sm){
    const yn = v => v ? '예' : '아니오';
    const ev = Logger.active ? Logger.session.events : [];
    const reachedA = ev.some(e => e.type === 'step' && PHASE_A.includes(e.step));
    const reachedB = ev.some(e => e.type === 'step' && PHASE_B.includes(e.step));
    const reachedC = ev.some(e => e.type === 'step' && PHASE_C.includes(e.step));
    const ids = {
      'A-03': sm.A_sourceBadgeFoundSec ?? '',
      'A-11': reachedA ? yn(sm.A_visitedA4) : '',
      'B-01': sm.B_requestText || '',
      'B-06': sm.B_processed ? yn(sm.B_verifyClicked) : '',
      'B-07': sm.B_verifySec ?? '',
      'B-16': reachedB ? sm.B_clarifyCount : '',
      'B-17': reachedB ? yn(sm.B_moreOpened) : '',
      'B-03': reachedB ? yn(ev.some(e => e.step === 'B2' && ['expand', 'check', 'check_all', 'more'].includes(e.type))) : '',
      'L-01': sm.A_taskSec ?? '',
      'L-02': reachedA ? sm.A_action : '',
      'L-03': sm.B_taskSec ?? '',
      'L-04': reachedB ? sm.B_action : '',
      'L-05': Logger.active ? (Logger.session.meta.viewport || '') : '',
      'L-06': Logger.active ? ev.filter(e => e.type === 'resize').length : '',
      'C-05': reachedC ? (TaskC.PATH_KO[sm.C_firstPath] || sm.C_firstPath) : '',
      'C-15': reachedC ? ((sm.C_changedBy || []).map(p => TaskC.PATH_KO[p]).join(' + ') || '없음') : '',
      'C-06': reachedC ? sm.C_moveResult : '',
      'C-09': reachedC ? sm.C_otherState : '',
      'C-07': reachedC ? yn(sm.C_chipClicked) : '',
      'C-08': sm.C_chipSec ?? '',
      'L-07': sm.C_taskSec ?? '',
      'L-08': reachedC ? sm.C_action : '',
    };
    Object.values(sm.survey || {}).forEach(a => Object.assign(ids, a));
    return ids;
  }
  function susScore(ids){
    const v = Array.from({ length: 10 }, (_, i) => ids[`S-${String(i + 1).padStart(2, '0')}`]);
    if(v.some(x => typeof x !== 'number')) return '';
    return v.reduce((a, x, i) => a + (i % 2 === 0 ? x - 1 : 5 - x), 0) * 2.5;
  }
  function rowFrom(meta, sm){
    const ids = (sm && sm.ids) || {};
    return Object.assign({ participant: meta.participant || '', order: (sm && sm.order) || meta.order || '', mode: meta.mode || '',
      startedAt: meta.startedAt || '', studyId: meta.studyId || '', ended: (meta.ended || meta.finishedAt) ? '예' : '',
      consentAt: (meta.consent && meta.consent.at) || meta.consentAt || '' }, ids, { SUS: susScore(ids) });
  }
  function resultsCSV(rows){
    const cols = ['participant', 'order', 'mode', 'startedAt', 'consentAt', 'studyId', 'ended'].concat(RESULT_IDS, ['SUS']);
    const cell = v => { const t = v == null ? '' : String(v); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
    return '﻿' + [cols.join(',')].concat(rows.map(r => cols.map(c => cell(r[c])).join(','))).join('\n');
  }
  function downloadResults(rows, name){
    const blob = new Blob([resultsCSV(rows)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (name || 'ut-results') + '-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function downloadResultLocal(){
    if(remote) return downloadResults([rowFrom(remote.meta || {}, remote.summary)], 'ut-result-' + ((remote.meta || {}).participant || 'P'));
    if(!Logger.active) return;
    downloadResults([rowFrom(Logger.session.meta, summary())], 'ut-result-' + Logger.session.meta.participant);
  }

  /* ---------------- 시작 화면 동의 ---------------- */
  function consentOk(){ return $$('[data-consent]').every(el => el.checked); }
  function syncConsent(){ $('#startBtn').disabled = !consentOk(); }

  /* ---------------- 참가자 링크 만들기 (진행자 패널) ---------------- */
  function updateLink(fromPid){
    const pidEl = $('#lmPid'); if(!pidEl) return;
    const pid = (pidEl.value || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const n = parseInt((pid.match(/\d+/) || [''])[0], 10);
    if(fromPid && !isNaN(n)) $('#lmOrder').value = n % 2 === 1 ? 'ab' : 'ba';   // 홀수 A→B, 짝수 B→A
    const q = new URLSearchParams();
    if($('#lmMode').value === 'participant') q.set('mode', 'participant');
    if(pid) q.set('pid', pid);
    if($('#lmOrder').value === 'ba') q.set('order', 'ba');
    if($('#lmLang').value) q.set('lang', $('#lmLang').value);
    $('#lmUrl').value = location.origin + location.pathname + '?' + q.toString();
  }
  function copyLink(){
    const el = $('#lmUrl'); el.select();
    const done = () => { const b = $('#lmCopy'); const t = b.textContent; b.textContent = I18n.t('복사됨'); setTimeout(() => b.textContent = t, 1200); };
    if(navigator.clipboard) navigator.clipboard.writeText(el.value).then(done, () => { document.execCommand('copy'); done(); });
    else { document.execCommand('copy'); done(); }
  }

  // 시작 화면: 참가자 모드에서는 코드를 입력받지 않아요(링크의 코드 또는 자동 코드).
  (function setupStart(){
    const input = $('#pidInput');
    if(MODE === 'participant'){
      input.value = PID || ('U' + Math.random().toString(36).slice(2, 6).toUpperCase());
      ['.intro-label', '#pidInput', '#pidError'].forEach(sel => { const el = $(sel); if(el) el.style.display = 'none'; });
      if(PID){ const tag = document.createElement('div'); tag.className = 'intro-pid'; tag.textContent = '참가자 ' + PID; $('#startBtn').before(tag); }
    } else if(PID){ input.value = PID; }
    updateLink(true);
  })();

  /* ---------------- 진행자 패널 렌더 ---------------- */
  // 진행자 안내 카드: 화면이 바뀔 때마다 지금 할 말과 질문을 짧게 보여 줘요(자세한 내용은 아래 스크립트).
  const GUIDE = {
    START: { say:['오늘 보실 화면은 연구용 가상 화면이에요. 이름·일정도 모두 가상이에요.', '정답은 없으니 평소처럼 쓰면서 생각나는 걸 소리 내어 말씀해 주세요.'], watch:['동의 체크 후 시작하기'] },
    SA: { say:['안내를 읽고 시작하기를 눌러 주세요.'] },
    SB: { first:['정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?'], say:['(두 번째 상황이면) 여기부터는 앞과 별개의 새 상황이에요.'] },
    A1: { watch:['입력창을 스스로 누르는지'] },
    A1B: { watch:['미리 입력된 질문을 보내는지'] },
    A1C: { watch:['기다리는 동안의 반응'] },
    A2: { first:['방금 답변을 보고 어떤 생각이 드세요?'],
          say:['참고로 정민은 지금은 연락하지 않는 사람이에요.', '이 답변에 정민 이야기가 왜 나왔는지 확인하고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.'],
          watch:["'출처 확인'을 스스로 찾는지", '조작 위치는 알려 주지 않기'],
          help:['60초 넘게 막히면: 이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?'] },
    A3: { watch:['토글(참조 끄기)과 삭제를 구분하는지', 'Memory를 펼쳐 삭제를 찾는지'],
          after:['방금 무엇이 바뀌었나요?', '(토글을 껐다면) 이 토글을 끄면 어떤 정보가 영향을 받을까요?', '지운 정보와 끈 정보는 각각 어떻게 될까요?'] },
    A4: { first:['이 화면은 무엇을 보여 주는 것 같으세요?'], watch:['정민 메모리만 골라 지우려 하는지'] },
    QA: { first:['(설문 전에 말로) 지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'], say:['이어서 화면의 짧은 설문에 답해 주세요.'] },
    B1: { say:['채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.'], watch:['어떤 문장으로 요청하는지', '되묻기가 나오면 어떻게 고쳐 말하는지'] },
    B2: { watch:['펼쳐 보는지, 더보기를 누르는지, 체크를 바꾸는지', "'삭제돼요/참조만 차단돼요' 라벨을 알아차리는지"], help:['처리 전에 망설이면: 이 목록을 생각하셨던 범위와 비교하면 어떤가요?'] },
    B3: { watch:["'지금 확인하기'를 누르는지(안 눌러도 실패 아님)"],
          after:['방금 무엇이 처리됐나요?', 'Gmail과 Calendar의 원본은 어떻게 됐을까요?', '남아 있는 게 있다면 무엇일까요?'] },
    B4: { first:['이 화면에서 무엇을 알 수 있나요?'], watch:['보관 예외(검토 사본 최대 3년) 안내를 읽는지'] },
    B5: { watch:["참가자가 끝났다고 하면 '과제 완료'"] },
    QB: { first:['(설문 전에 말로) 지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'], say:['이어서 화면의 짧은 설문에 답해 주세요.'] },
    SC: { say:['여기부터는 앞과 별개의 새 상황이에요. 안내를 읽고 시작해 주세요.'] },
    C1: { watch:['미리 입력된 질문을 보내는지'] },
    C2: { say:['(필요하면) 얼마 전 이사는 안 가기로 했어요. 앞으로 이사 관련 정보가 답변에 쓰이지 않게 해 보세요. 방법은 자유예요.'],
          watch:['출처 확인, 칩, 채팅 입력 중 무엇을 먼저 쓰는지', '경로를 연 뒤 조작하기 전에: 어떻게 하실 생각이세요? (C-13)'],
          help:['60초 넘게 막히면: 이 답변에 쓰인 정보를 관리할 방법이 있을까요?'] },
    C3: { watch:['Gmail 토글은 앱 전체 단위예요. 요가 예약도 함께 막힌다는 걸 알고 끄는지'], after:['방금 끈 것은 어떤 정보에 영향을 줄까요?'] },
    C4: { first:['이 목록은 무엇을 보여 주는 것 같으세요?'], watch:['어떤 주제를 고르는지, 왜 그렇게 고르는지'] },
    C5: { watch:["'삭제돼요/참조만 차단돼요' 구분을 보는지", '체크를 바꾸는지'] },
    C6: { after:['방금 무엇이 처리됐나요?', '이사 말고 다른 정보도 영향을 받았을까요?', '원하셨던 결과와 같은가요? (C-14)'], watch:["참가자가 끝났다고 하면 '과제 완료'"] },
    QC: { first:['(설문 전에 말로) 지금 이사 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?', '(칩을 썼다면) 답변 아래 버튼은 누르기 전에 무엇을 할 거라고 생각하셨나요?', '(칩을 안 썼다면) 답변 아래 이 버튼은 무엇을 할 것 같으세요?'], say:['이어서 화면의 짧은 설문에 답해 주세요.'] },
    QS: { say:['마지막 설문이에요. 오늘 써 본 기능 전체를 떠올리며 답해 주세요.'] },
    END: { after:['지금 이런 기능에 대해 어떻게 느끼세요?', 'AI가 이렇게 정보를 쓴다는 걸 전에 알고 계셨나요?', '출처 확인, 칩, 채팅 요청 중 어느 쪽이 가장 편했나요?', '그렇게 생각하신 이유는 무엇인가요?', '가장 헷갈리거나 불편했던 순간은 언제였나요?'],
           say:['(디브리핑) 오늘 본 이름·예약·일정은 모두 가상이었어요. 참여해 주셔서 감사합니다.'] },
  };
  let guideStep = null;
  function renderGuide(){
    const box = $('#guideBox'); if(!box) return;
    const g = GUIDE[current];
    if(!g){ box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    const sec = (cls, label, list) => list && list.length ? `<div class="gd-sec ${cls}"><div class="gd-label">${label}</div>${list.map(x => `<div class="gd-line">${esc(x)}</div>`).join('')}</div>` : '';
    box.innerHTML = sec('first', '먼저 물어보기', g.first) + sec('say', '말하기', g.say) + sec('watch', '지켜보기', g.watch) + sec('help', '막히면', g.help) + sec('after', '끝나면 하나씩 묻기', g.after);
    if(guideStep !== current){ guideStep = current; box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash'); }
  }

  function renderPanel(){
    const d = STEPS[current] || STEPS.START;
    const tag = d.phase === 'a' ? '<span class="phase-tag a">Phase A · 인라인 데이터 관리</span>'
              : d.phase === 'b' ? '<span class="phase-tag b">Phase B · 채팅 자연어 삭제</span>'
              : d.phase === 'c' ? '<span class="phase-tag c">Phase C · 통합(칩·출처·채팅)</span>' : '';
    $('#stepTitle').innerHTML = current + ' ' + tag;
    $('#scriptBox').textContent = I18n.t(d.script);
    renderGuide();
    $('#interactNote').innerHTML = I18n.t(d.interact);
    if(current === 'A2') $('#interactNote').append(document.createTextNode(' ' + I18n.t('생성 중지·계속, 복사·공유·듣기·평가 버튼도 사용할 수 있어요.')));
    if(current === 'A3') $('#interactNote').append(document.createTextNode(' ' + I18n.t('시트 상단을 아래로 드래그하거나 Esc를 눌러 닫을 수 있어요.')));
    $('#indicatorRow').innerHTML = [1,2,3,4,5].map(i => `<span class="ind-chip ${d.indicators.includes(i)?'active':''}">지표${i}</span>`).join('');
    $('#jumpnav').innerHTML = ORDER.map(s => `<button class="${s===current?'cur':''}" ${s==='START'?'disabled':''} onclick="App.go('${s}','jump')">${s}</button>`).join('');
    renderMetrics();
  }

  function renderSession(){
    const row = $('#sessionRow');
    if(remote){
      const m = remote.meta || {};
      row.innerHTML = `참가자 <b>${esc(m.participant || '?')}</b> 화면을 실시간으로 보는 중${m.ended ? ' · <b>세션 종료됨</b>' : ''}`;
      return;
    }
    if(!Logger.active){ row.innerHTML = '세션 시작 전 — 참가자 코드를 입력하고 시작하세요'; return; }
    const m = Logger.session.meta;
    row.innerHTML = `참가자 <b>${m.participant}</b> · ${MODE === 'participant' ? '참가자 모드' : '진행자 모드'} · 시작 ${new Date(m.startedAt).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}`;
  }

  function renderMetrics(){
    const box = $('#metricsBox');
    const src = remote || (Logger.active ? { summary: summary(), events: Logger.session.events } : null);
    renderSurveyLive(src);
    if(!src || !src.summary){ box.innerHTML = '<span class="k">기록 없음</span><span class="v"></span>'; return; }
    const s = src.summary;
    const rows = [
      ['A · 출처 확인 배지 발견', s.A_sourceBadgeFound ? `${s.A_sourceBadgeFoundSec}초` : '아직'],
      ['A · 메모리 삭제', s.A_memoryDeleted],
      ['A · 참조 끈 앱', Object.keys(s.A_refsFinal || {}).filter(k => !s.A_refsFinal[k]).join(', ') || '없음'],
      ['B · 처리한 항목', s.B_selected ? Object.keys(s.B_selected).filter(k => s.B_selected[k]).join(', ') : '아직'],
      ['B · 지금 확인하기', s.B_verifyClicked ? `${s.B_verifySec}초` : '아직'],
      ['오클릭 (전체)', s.misclicksTotal],
      ['기록된 이벤트', src.events.length],
    ];
    box.innerHTML = rows.map(([k,v]) => `<span class="k">${k}</span><span class="v">${esc(v)}</span>`).join('');
  }

  // 진행자 패널: 참가자가 고르는 설문 응답을 실시간으로 보여 주고, 후속 질문 거리를 짚어 줘요.
  const SV_SHORT = { 'A-13':'쉬움 정도 (SEQ)', 'A-14':'완료됐다고 생각', 'A-15':'확신도', 'A-16':'정보량',
    'B-10':'쉬움 정도 (SEQ)', 'B-11':'완료됐다고 생각', 'B-12':'확신도', 'B-13':'정보량', 'B-14':'선택 부담',
    'C-10':'쉬움 정도 (SEQ)', 'C-11':'완료됐다고 생각', 'C-12':'영향 범위 확신도' };
  function svFlag(id, v){
    if(['A-13', 'B-10', 'C-10'].includes(id) && v <= 3) return "어렵다고 답했어요. '어느 부분이 어려웠나요?'";
    if(['A-14', 'B-11', 'C-11'].includes(id) && v !== '예') return "완료에 확신이 없어요. '어떤 점 때문에 그렇게 생각하셨나요?'";
    if(['A-15', 'B-12', 'C-12'].includes(id) && v <= 3) return "확신이 낮아요. '무엇이 확실하지 않게 느껴졌나요?'";
    if(['A-16', 'B-13'].includes(id) && (v <= 2 || v >= 6)) return v <= 2 ? "정보가 적다고 했어요. '어떤 정보가 더 있었으면 했나요?'" : "정보가 많다고 했어요. '어떤 부분이 과했나요?'";
    if(id === 'B-14' && v >= 5) return "고르기가 번거로웠대요. '어떤 점이 번거로웠나요?'";
    return '';
  }
  function renderSurveyLive(src){
    const box = $('#svLive'); if(!box) return;
    const evs = src ? src.events || [] : [];
    const s = src && src.summary ? src.summary : {};
    const ans = {};
    Object.values(s.survey || {}).forEach(o => Object.assign(ans, o));
    evs.forEach(e => { if(e.type === 'survey_pick') ans[e.id] = e.value; });
    const groups = [['A', '저녁 약속 상황 (A)'], ['B', '채팅으로 정리한 상황 (B)'], ['C', '이사 정보 정리 (C)']].filter(([k]) => SURVEY[k].items.some(it => ans[it.id] !== undefined));
    const susIds = SURVEY.S.items.map(it => it.id), susN = susIds.filter(id => ans[id] !== undefined).length;
    if(!groups.length && !susN){ box.innerHTML = ''; box.hidden = true; return; }
    box.hidden = false;
    const act = { A: s.A_action, B: s.B_action, C: s.C_action ? `${s.C_action} (경로: ${(s.C_paths || []).map(p => TaskC.PATH_KO[p]).join(' → ') || '없음'}, 이사 정보: ${s.C_moveResult}, 다른 정보: ${s.C_otherState})` : '' };
    let html = '<div class="panel-section-title">설문 응답 · 실시간</div>';
    groups.forEach(([k, label]) => {
      html += `<div class="svl-group"><div class="svl-head">${label}</div>`;
      SURVEY[k].items.forEach(it => {
        const v = ans[it.id]; if(v === undefined) return;
        const f = svFlag(it.id, v), scale = it.scale ? `<span class="svl-max">/ ${it.scale.length}</span>` : '';
        html += `<div class="svl-row${f ? ' flag' : ''}"><span class="svl-k">${esc(SV_SHORT[it.id] || it.id)}</span><span class="svl-v">${esc(v)}${scale}</span></div>` + (f ? `<div class="svl-tip">${esc(f)}</div>` : '');
      });
      const doneId = k === 'A' ? 'A-14' : k === 'B' ? 'B-11' : 'C-11';
      const noAct = k === 'A' ? act.A === '변경 없음' : k === 'B' ? act.B === '처리 안 함' : s.C_moveResult === '없음';
      if(ans[doneId] === '예' && noAct) html += `<div class="svl-tip warn">완료했다고 답했지만 실제로 바꾼 게 없어요. '어떻게 처리하셨다고 생각하세요?'</div>`;
      if(act[k]) html += `<div class="svl-act">실제 조작: ${esc(act[k])}</div>`;
      html += '</div>';
    });
    if(susN){
      const ids = Object.fromEntries(susIds.map(id => [id, ans[id]]));
      const score = susScore(ids);
      html += `<div class="svl-group"><div class="svl-head">SUS</div><div class="svl-row"><span class="svl-k">응답한 문항</span><span class="svl-v">${susN}<span class="svl-max">/ 10</span></span></div>`
        + (score !== '' ? `<div class="svl-row"><span class="svl-k">점수</span><span class="svl-v">${score}</span></div>` : '') + '</div>';
    }
    box.innerHTML = html;
  }

  function renderFeed(){
    const feed = $('#logFeed');
    const all = remote ? remote.events : Logger.active ? Logger.session.events : null;
    if(!all){ feed.innerHTML = '시작하면 이벤트가 여기에 쌓여요'; return; }
    const evs = all.slice(-40);
    feed.innerHTML = evs.map(e => {
      const sec = (e.ms / 1000).toFixed(1).padStart(6, ' ');
      const what = e.type === 'step' ? `→ ${e.step}`
                 : e.type === 'click' || e.type === 'misclick' ? `${e.tag}`
                 : e.type === 'toggle' ? `${e.ref} ${e.on ? 'ON' : 'OFF'}`
                 : e.type === 'check' ? `${e.src} ${e.checked ? '✓' : '✗'}`
                 : e.type === 'b2_process' ? Object.keys(e.selected || {}).filter(k => e.selected[k]).join('+')
                 : e.type === 'delete' ? `memory (${e.scope})`
                 : e.type === 'expand' ? `${e.tag} ${e.open ? '열림' : '닫힘'}`
                 : '';
      return `<div class="${e.type === 'misclick' ? 'miss' : ''}">${sec}s ${esc(e.type)} ${esc(what)}</div>`;
    }).join('');
    feed.scrollTop = feed.scrollHeight;
  }

  function renderArchive(){
    let el = $('#archiveList');
    if(!el){ el = document.createElement('div'); el.id = 'archiveList'; el.className = 'archive-list'; $('#panel .legend').before(el); }
    const arc = Logger.archived();
    if(!arc.length){ el.innerHTML = ''; return; }
    el.innerHTML = '<div style="font-weight:700;">이 브라우저에 보관된 세션</div>' + arc.map((s, i) =>
      `<div>${s.meta.participant || '?'} · ${(s.meta.startedAt || '').slice(5,16).replace('T',' ')} · ${s.events.length}개${s.meta.rescued ? ' (중단됨)' : ''}
        <button onclick="App.downloadArchived(${i},'json')">JSON</button><button onclick="App.downloadArchived(${i},'csv')">CSV</button></div>`
    ).reverse().join('');
  }

  // 과제 카드는 앱 기능처럼 보일 수 있어 화면 밖 과제 패널만 써요. 목표가 바뀌면 패널을 잠깐 강조해요.
  function closeTaskCard(){}
  // 휴대폰: 과제 문구는 접어 두고, 참가자가 '과제 보기'를 누를 때만 펼쳐요(진행자가 말로 안내).
  function toggleTaskPeek(){
    if(window.innerWidth > 520) return;
    const bar = $('#taskbar'); const open = !bar.classList.contains('peek');
    bar.classList.toggle('peek', open);
    Logger.log('task_peek', { step: current, open });
  }
  function renderTaskbar(){
    const bar = $('#taskbar');
    const phase = PHASE_A.includes(current) ? 'A' : PHASE_B.includes(current) ? 'B' : PHASE_C.includes(current) ? 'C' : null;
    const doneKey = { QA:'A', QB:'B', QC:'C', QS:'S' }[current] || null;
    bar.classList.toggle('show', MODE === 'participant' && !!(phase || doneKey));
    const wasDone = bar.classList.contains('done');
    if(bar.dataset.step !== current){ bar.classList.remove('peek'); bar.dataset.step = current; }
    bar.classList.toggle('done', !phase && !!doneKey);
    if(!phase && doneKey){
      const n = doneKey === 'S' ? 3 : doneKey === 'C' ? 3 : (doneKey === FIRST ? 1 : 2);
      $('#taskLabel').textContent = I18n.t(`과제 ${n} / 3`);
      $('#taskText').innerHTML = `<div class="tk-done"><span class="tk-check"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4 4 8-9"/></svg></span><span>${esc(I18n.t(doneKey === 'S' ? '세 과제를 모두 마쳤어요' : `과제 ${n}${n === 2 ? '를' : '을'} 마쳤어요`))}</span></div>`
        + `<div class="tk-ctx">${esc(I18n.t(doneKey === 'S' ? '마지막 설문이에요. 휴대폰 화면에서 답해 주세요' : '휴대폰 화면의 짧은 설문에 답해 주세요'))}</div>`;
      if(!wasDone){ bar.classList.remove('pop'); void bar.offsetWidth; bar.classList.add('pop'); }
      return;
    }
    // A는 답변이 다 나온 뒤 구체적인 목표로 바뀌어요(첫 반응은 자유롭게 보고, 그다음 목표 제시).
    const key = phase === 'A' && (M.aGoal || ['A3', 'A4'].includes(current)) ? 'A2' : phase;
    if(phase){
      const t = TASK_TEXT[key];
      const steps = t.steps.length > 1 ? `<ol class="tk-steps">${t.steps.map(x => `<li>${esc(I18n.t(x))}</li>`).join('')}</ol>` : `<div class="tk-main">${esc(I18n.t(t.steps[0]))}</div>`;
      $('#taskText').innerHTML = (t.ctx ? `<div class="tk-ctx">${esc(I18n.t(t.ctx))}</div>` : '') + steps;
      $('#taskLabel').textContent = I18n.t(phase === 'C' ? '과제 3 / 3' : phase === FIRST ? '과제 1 / 3' : '과제 2 / 3');
      if(M.flash){
        M.flash = false;
        bar.classList.remove('flash'); void bar.offsetWidth; bar.classList.add('flash');
        clearTimeout(bar._ft); bar._ft = setTimeout(() => bar.classList.remove('flash'), 6000);
      }
    }
  }

  function notice(msg){ const s = $('#endStatus'); if(s) s.textContent = msg; }

  function toggleDev(){
    devMode = !devMode;
    $('#devSwitch').classList.toggle('on', devMode);
    phone.classList.toggle('devmode', devMode);
  }

  /* ---------------- 시작 ---------------- */
  Logger.rescuePrevious();
  Logger.onEvent(() => { renderFeed(); renderMetrics(); });
  $('#pidInput').addEventListener('keydown', e => { if(e.key === 'Enter') start(); });
  applyAll();
  renderSession(); renderPanel(); renderTaskbar(); renderFeed(); renderArchive();

  window.App = {
    go, advance, start, newSession, resetScenario, taskDone, finishPhase,
    closeSheet, toggleResponse, stopLoading, expand, toggleRef, deleteMemory, undoDelete,
    toggleCheckItem, toggleSelectAll, processB2, undoB2, sendB1, toggleMore,
    pickSurvey, submitSurvey, surveyStep, a4More, toggleTaskPeek, closeTaskCard, syncConsent, rowFrom, downloadResults, downloadResultLocal, updateLink, copyLink,
    toggleDev, summary, notice,
    refreshLanguage(){
      clearFx();
      const typed = $('#a1bTyped');
      typed.dataset.full = I18n.t('요즘 새로 생긴 이탈리안 레스토랑 추천해줘');
      typed.textContent = typed.dataset.full;
      syncB1(); renderB1Thread(); renderMoreToggles(); renderA2Notice(); syncSelectAll(); renderPanel(); renderSession(); window.Interactions?.sync();
    },
    snapshot, applySnapshot, setRemote, download,
    downloadArchived(i, fmt){ Logger.download(fmt, Logger.archived()[i]); },
    get current(){ return current; },
    get mode(){ return MODE; },
  };
  // 기존 HTML의 패널 토글 버튼용
  window.togglePanel = function(){
    const panel = $('#panel'), btn = $('#panelToggleBtn');
    const hidden = panel.classList.toggle('hidden');
    btn.textContent = hidden ? '진행자 패널 보이기' : '진행자 패널 숨기기';
  };
})();
