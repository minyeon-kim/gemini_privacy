// 프로토타입 동작 + 진행자 패널 + 기록 연결
(function(){
  const params = new URLSearchParams(location.search);
  const MODE = params.get('mode') === 'participant' ? 'participant' : 'moderator';
  if(MODE === 'participant') document.body.classList.add('participant');
  // 과제 순서: 기본 A→B, 주소에 ?order=ba 를 붙이면 B→A (순서 효과를 줄이려고 참가자마다 교차)
  const SEQ = (params.get('order') || '').toLowerCase() === 'ba' ? 'BA' : 'AB';
  // 참가자 코드는 링크에 담아 보내요(?pid=P03). 참가자 모드에서 코드가 없으면 익명 코드를 자동으로 만들어요.
  const PID = (params.get('pid') || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
  // SUS(선택)는 링크에 sus=1이 있을 때만 마지막에 보여요.
  const WITH_SUS = params.get('sus') === '1';

  /* ---------------- 단계 정의 (진행자 스크립트) ----------------
     진행 원칙: ① 목표만 제시 → ② 참가자가 직접 시도(진행자는 설명·힌트 없이 관찰) → ③ 설명 없이 이해 확인 → ④ 과제 직후 설문 → ⑤ 그다음 심층 질문.
     조작 방법이나 선택지(차단/삭제)를 진행자가 먼저 말하지 않아요. 도움을 줬다면 그 시점을 기록지에 남겨요. */
  const STEPS = {
    START:{phase:'-', script:"참가자에게 연구 고지를 읽게 하고 '시작하기'를 누르세요. 패널의 '참가자 링크 만들기'로 만든 링크로 열면 참가자 코드가 자동으로 들어가요(직접 열었다면 코드를 입력). 이때부터 기록이 시작됩니다. 시작 전 안내: '디자인을 평가하는 자리지 참가자분을 평가하는 게 아니에요. 정답은 없고, 생각나는 걸 소리 내어 말하면서 진행해 주세요.'",
      indicators:[], interact:"클릭 가능 — <b>참가자 코드 입력</b>, <b>시작하기</b>. 순서 교차는 주소 끝에 <b>?order=ba</b>(B→A)."},
    SA:{phase:'a', script:"(참가자 모드 전용) 상황 1 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    A1:{phase:'a', script:"[목표 제시] 상황만 읽어 주세요: '퇴근 후 소파에 앉아 이번 주 저녁 약속 장소를 찾으려고 Gemini를 열었어요. 질문을 보내고 답변을 살펴본 뒤, 해 보고 싶은 게 있으면 자유롭게 해 보세요.' 이후 참가자가 직접 입력창을 누르게 두세요.",
      indicators:[], interact:"클릭 가능 — <b>입력창</b>을 누르면 질문이 채워진 화면으로 넘어갑니다(질문은 고정)."},
    A1B:{phase:'a', script:"정해진 질문이 한 글자씩 입력되는 연출입니다(약 1초). 참가자가 전송을 누르게 두세요.", indicators:[], interact:"클릭 가능 — <b>전송 버튼</b>만(입력 연출이 끝난 뒤 활성화)."},
    A1C:{phase:'a', script:"응답 대기 연출입니다. 약 1.2초 뒤 자동으로 다음 화면으로 전환됩니다.", indicators:[], interact:"클릭 지점 없음 — 자동 전환됩니다.", autoNext:'A2', autoDelay:1200},
    A2:{phase:'a', script:"[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '이 답변에 정민 이야기가 왜 나왔는지 확인하고, 이 정보를 원하는 대로 처리해 보세요.' 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 과제 바가 이 문구로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.",
      indicators:[2,4], interact:"관찰 포인트 — 좋아요·싫어요 옆 <b>'출처 확인' 배지</b>를 스스로 찾는지. 발견 시간은 <b>답변이 다 표시된 시점부터</b> 자동 기록돼요. A3에서 참조를 끄거나 메모리를 지우고 돌아오면 답변 아래에 변경 안내가 표시됩니다."},
    A3:{phase:'a', script:"[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. 참가자가 스스로 조작하지 않으면: '이 정보가 앞으로 어떻게 되길 원하세요? 원하는 상태로 만들어 보세요.' (차단·삭제 같은 선택지를 먼저 말하지 마세요.) [이해 확인 — 조작 후, 설명 없이] ① '방금 무엇이 바뀌었나요?' ② (토글을 껐다면) '이 토글을 끄면 어떤 정보가 영향을 받을까요?' ③ (삭제했다면) '지운 것과 꺼 둔 것은 각각 어떻게 될까요?' ④ '이제 왜 그 답변이 나왔는지 설명해 주실 수 있나요?'",
      indicators:[1,2,4], interact:"클릭 가능 — 항목 이름=<b>데이터 펼치기(읽기 전용)</b>, 참조 on/off는 <b>앱 단위 토글</b>(이 시트엔 2건만 보이지만 끄면 해당 앱 전체 참조가 꺼짐 — 그레이존 핵심 관찰). <b>Memory는 펼쳤을 때만</b> '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초 실행취소). Gmail·Calendar는 참조 차단만 가능. <b>X</b>·바깥 영역으로 닫기, 하단 <b>'Personal Intelligence에서 전체 관리 →'</b> 링크."},
    A4:{phase:'a', script:"참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 이 화면엔 정민 관련 메모리만 골라 지우는 기능이 없고 '메모리 전체 삭제'뿐이에요. 이때의 반응은 디자인 제약에서 나온 발견으로 기록하세요. [Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요.",
      indicators:[1,5], interact:"클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>Memory는 펼쳤을 때만</b> '메모리 전체 삭제' 링크(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀."},
    SB:{phase:'b', script:"(참가자 모드 전용) 상황 2 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    B1:{phase:'b', script:"[과제 전 질문] 과제를 주기 전에 먼저: '정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?' — 채팅으로 요청하는 방법을 스스로 떠올리는지 기록하세요. [목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 이번엔 채팅으로 Gemini에게 직접 요청해서 정민 관련 정보를 정리해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 요청에 '정민'이나 '그 사람' 같은 대상이 없으면 Gemini가 '어떤 정보를 정리할까요?'라고 되묻고, 대상을 말하면 정리 목록이 나와요. 입력한 문장과 되묻기 횟수는 자동 기록됩니다.",
      indicators:[1], interact:"클릭 가능 — <b>입력창</b>(자유 입력), <b>전송 버튼</b>(글자를 입력해야 활성화, Enter로도 전송)."},
    B2:{phase:'b', script:"[직접 시도] 먼저 묻지 말고 살펴보며 처리하게 두세요. 목록은 실제처럼 36건(Memory 3 · Gmail 24 · Calendar 9)이고 출처별로 접혀 있어요. 기본값이 '전체 선택'이라 바로 처리를 눌러도 삭제·차단 차이를 이해했다는 근거는 아니에요. 펼쳤는지, '더보기'를 눌렀는지, 체크를 바꿨는지, 양이 많다는 반응이 있는지 관찰하세요. 처리 전에 멈춰서 고민하면 그때 '이 목록이 생각하신 범위와 비교하면 어떤가요?'",
      indicators:[2], interact:"B1에서 전송하면 약 1.2초 응답 대기 후 카드가 나타납니다. 클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 출처별 <b>체크박스</b>(출처 단위로 선택), 펼친 뒤 <b>'+N건 더보기'</b>, <b>선택 항목 처리/취소</b>. 그룹 라벨 '삭제돼요'/'참조만 차단돼요'를 알아차리는지가 관찰 포인트. 아무것도 선택하지 않으면 처리 버튼 비활성."},
    B3:{phase:'b', script:"[관찰만] 먼저 묻지 마세요. '지금 확인하기'를 누르는지, 그냥 끝내는지가 관찰값입니다(참가자 모드에서는 '과제 완료'로 바로 끝낼 수 있어요). 누르지 않았다고 실패가 아니에요 — 확인 행동은 따로 기록합니다. [이해 확인 — 참가자가 끝났다고 한 뒤] ① '방금 무엇이 처리됐나요?' ② 'Gmail과 Calendar에 있던 정민 관련 정보는 지금 어떤 상태일까요?' ③ (Memory를 지웠다면) '지운 정보는 지금 어떻게 됐을까요?' — 결과 카드의 보관 예외 안내(검토된 대화 사본 최대 3년)를 읽었는지가 이해 판정 기준이에요. '그래도 다 지워졌을지 의심된다'는 반응은 이해 실패가 아니라 신뢰 관찰값으로 따로 기록하세요.",
      indicators:[3,4], interact:"클릭 가능 — <b>'지금 확인하기'</b>(누르기까지 시간 자동 기록), <b>'취소'</b>(처리 이전으로 되돌리고 B2로 복귀). 결과 문구는 B2에서 고른 항목에 맞춰 바뀝니다."},
    B4:{phase:'b', script:"참가자가 스스로 들어온 경우의 확인 화면입니다. '이 화면에서 무엇을 알 수 있나요?' → '정민 관련 정보 중 아직 남아 있는 건 무엇일까요?' 신뢰에 관한 질문은 여기서 하지 말고 마무리 단계로 미루세요.",
      indicators:[3,4,5], interact:"클릭 가능 — <b>'채팅으로 돌아가기'</b>(B5로 이동), ← 로 B3 복귀."},
    B5:{phase:'b', script:"[Phase 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(SEQ·완료 인식·확신도·정보량)을 진행하세요. 두 Phase를 모두 마쳤다면 마무리 질문을 한 번에 하나씩: ① '지금 이런 기능에 대해 어떻게 느끼세요?' ② 'AI가 이렇게 정보를 쓴다는 걸 전에 알고 계셨나요?' ③ '두 방식(답변에서 바로 관리 / 채팅으로 요청) 중 어느 쪽이 더 나았나요?' ④ (답을 들은 뒤) '왜 그렇게 느끼셨나요?' ⑤ '진행하면서 가장 헷갈리거나 불편했던 순간은 언제였나요?'",
      indicators:[4,5], interact:"클릭 지점 없음 — 처리 결과 카드와 마무리 답변만 표시됩니다."},
    QA:{phase:'-', script:"[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요.",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QB:{phase:'-', script:"[과제 직후 설문 · 채팅 삭제 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(B-09, 진행자 기록) 그다음 참가자가 화면의 설문 5문항에 직접 답하고 '다음'을 누르게 두세요.",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QS:{phase:'-', script:"[선택 · SUS] 링크에 sus=1이 있을 때만 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요.",
      indicators:[], interact:"클릭 가능 — 문항별 1~5, <b>다음</b>(10문항 모두 답하면 활성화)."},
    END:{phase:'-', script:"세션 종료 화면입니다. SUS(선택)를 진행한 뒤 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고, 다음 참가자는 '새 참가자로 시작'을 누르세요.", indicators:[], interact:"참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송)."},
  };
  const PHASE_A = ['A1','A1B','A1C','A2','A3','A4'];
  const PHASE_B = ['B1','B2','B3','B4','B5'];
  const seg = ph => (MODE === 'participant' ? ['S' + ph] : []).concat(ph === 'A' ? PHASE_A : PHASE_B);
  const FIRST = SEQ[0], SECOND = SEQ[1];
  const ORDER = ['START'].concat(seg(FIRST), ['Q' + FIRST], seg(SECOND), ['Q' + SECOND], WITH_SUS ? ['QS'] : [], ['END']);
  const firstStep = ph => seg(ph)[0];
  const TASK_TEXT = {
    A: "Gemini에게 저녁 약속 장소를 물어보고 답변을 살펴보세요.",
    A2: "이 답변에 정민 이야기가 왜 나왔는지 확인하고, 이 정보를 원하는 대로 처리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.",
    B: "채팅으로 Gemini에게 직접 요청해서 '정민' 관련 정보를 정리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.",
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
  let refState, memState, b2Result, lastUndo, undoTimer, b1Text, b1Asks = [], svDraft = {}, survey = {};
  const M = {}; // 지표 계산용 타임스탬프

  function resetState(){
    refState = { memory:true, gmail:true, calendar:true, photos:true };
    memState = { used:false, all:false };
    b2Result = null;
    lastUndo = null;
    b1Text = '';
    b1Asks = [];
    svDraft = {}; survey = {};
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
    if(step === 'A3'){                // A3 = A2 화면 위에 출처 시트가 열린 상태
      showScreen('A2');
      sheetReturnFocus = document.activeElement;
      $('#sheetOverlay .sheet').style.removeProperty('--sheet-dismiss-from');
      $('#sheetOverlay').classList.add('active');
      $('.screen[data-step="A2"]').inert = true;
      $('#sheetOverlay .sheet-close').focus({preventScroll:true});
      $('#sheetOverlay .sheet').scrollTop = 0;
    }else{
      showScreen(step);
      $('#sheetOverlay').classList.remove('active');
      $('.screen[data-step="A2"]').inert = false;
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
    if(step === 'END') onEnd();
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
  }
  const later = (fn, ms) => fxTimers.push(setTimeout(fn, ms));

  function enterEffects(step, prev){
    clearFx();
    if(step === 'A1B' && prev !== 'A1B'){          // 질문이 한 글자씩 입력됨
      const typed = $('#a1bTyped'), send = $('#a1bSend');
      const full = typed.dataset.full = I18n.t('요즘 새로 생긴 이탈리안 레스토랑 추천해줘');
      typed.textContent = ''; typed.classList.add('caret'); send.classList.add('wait'); send.setAttribute('aria-disabled','true');
      [...full].forEach((ch, i) => later(() => { typed.textContent = full.slice(0, i + 1); }, 120 + i * 45));
      later(() => { typed.classList.remove('caret'); send.classList.remove('wait'); send.setAttribute('aria-disabled','false'); }, 160 + full.length * 45);
    }
    if(step === 'A2' && prev === 'A1C'){           // 답변이 위에서부터 순서대로 나타남
      responseVisible = 0; responsePaused = false;
      M.a2Enter = null;
      renderResponse(); advanceResponse();
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
      if(!M.aGoal){ M.aGoal = true; if(MODE === 'participant') Logger.log('task_goal_shown', {step:current}); renderTaskbar(); }
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
          if(sheetReturnFocus && sheetReturnFocus.isConnected) sheetReturnFocus.focus({preventScroll:true});
        }
      }, 200);
    }
    else ov.classList.remove('active');
  }

  /* ---------------- 세션 ---------------- */
  function start(){
    const input = $('#pidInput');
    const pid = (input.value || '').trim().toUpperCase() || PID;
    if(!pid){ $('#pidError').classList.add('show'); input.focus(); return; }
    $('#pidError').classList.remove('show');
    Object.keys(M).forEach(k => delete M[k]);
    resetState(); applyAll();
    window.Interactions?.reset();
    Logger.start({ participant: pid, mode: MODE, order: SEQ, sus: WITH_SUS, language: I18n.language, pidFromLink: !!PID });
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
    const phase = PHASE_A.includes(current) ? 'A' : PHASE_B.includes(current) ? 'B' : null;
    if(!phase) return;
    finishPhase(phase, 'task-button');
  }

  function finishPhase(phase, how){
    const startT = phase === 'A' ? M.aStart : M.bStart;
    Logger.log('task_done', { step: current, phase, how: how || 'in-app', taskMs: startT ? Math.round(performance.now() - startT) : null });
    M['done' + phase] = true;
    go('Q' + phase, 'task-done');
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
      $('#endActions').style.display = MODE === 'participant' ? '' : 'none';
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
    if(off.length) parts.push(off.join('·') + ' 참조 끔');
    const keep = (memState.used || memState.all) ? `<br><span class="notice-sub">${esc(I18n.t(RETENTION))}</span>` : '';
    el.innerHTML = parts.length ? `<b>${esc(I18n.t('설정이 바뀌었어요'))}</b> · ${esc(parts.map(x => I18n.t(x)).join(' · '))}<br>${esc(I18n.t('다음 답변부터 반영돼요'))}${keep}` : '';
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
    $('#a4MemCount').textContent = memState.all ? '' : (memState.used ? '· 9건' : '· 11건');
    $('#a4MemMore').textContent = memState.used ? '+ 8건 더보기' : '+ 9건 더보기';
    $$('[data-mem="used"]').forEach(el => el.classList.toggle('gone', memState.used));
    renderA2Notice();
    window.Interactions?.sync();
  }

  function showSnackbar(msg){
    clearTimeout(undoTimer);
    const bar = $('#snackbar');
    bar.querySelector('.snackbar-msg').textContent = msg;
    bar.classList.add('show');
    undoTimer = setTimeout(() => { lastUndo = null; hideSnackbar(); }, 4000);
  }
  function hideSnackbar(){ $('#snackbar').classList.remove('show'); }

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
  const B1_CLARIFY = "어떤 정보를 정리할까요? 사람 이름이나 주제를 함께 알려 주세요. 예: '정민 관련 정보 지워줘'";
  function renderB1Thread(){
    const box = $('#b1Thread');
    box.innerHTML = b1Asks.map(t => `<div class="msg-user" data-no-translate>${esc(t)}</div><div class="msg-ai b1-clarify">${esc(I18n.t(B1_CLARIFY))}</div>`).join('');
    const body = box.closest('.chat-body'); if(body) body.scrollTop = body.scrollHeight;
  }
  function sendB1(){
    const text = b1Input.value.trim();
    if(!text || current !== 'B1') return;
    if(!B1_TARGET.test(text)){
      b1Asks.push(text);
      Logger.log('b1_clarify', { step: current, text, count: b1Asks.length });
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
    $('#selectionCount').textContent = I18n.t('선택한 정보') + ' · ' + picked + '/' + B2_TOTAL;
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

  function renderB3B4(){
    const sel = b2Result || currentSelection();
    const lines = Object.keys(SRC).filter(k => sel[k]).map(k => {
      const s = SRC[k];
      return s.del
        ? `<div class="b3-line"><span class="tag del">삭제</span><span>${s.name} ${s.count}건을 삭제했어요</span></div>`
        : `<div class="b3-line"><span class="tag block">참조 차단</span><span>${s.name} ${s.count}건 — 원본은 ${s.name}에 그대로 있고, 앞으로 답변에 사용하지 않아요</span></div>`;
    });
    $('#b3Lines').innerHTML = $('#b5Lines').innerHTML = lines.join('');
    const nDel = Object.keys(SRC).filter(k => sel[k] && SRC[k].del).length;
    const nBlock = Object.keys(SRC).filter(k => sel[k] && !SRC[k].del).length;
    ['#b3Note', '#b4Note', '#b5Note'].forEach(id => { const n = $(id); if(n) n.hidden = !nDel; });
    $('#b3Title').textContent = $('#b5Title').textContent = nDel && nBlock ? '요청을 처리했어요' : nDel ? '선택한 정보를 삭제했어요' : '선택한 정보의 참조를 차단했어요';

    Object.keys(SRC).forEach(k => {
      const item = $(`.screen[data-step="B4"] [data-b4="${k}"]`);
      const d = $(`.screen[data-step="B4"] [data-b4d="${k}"]`);
      if(!sel[k]){ d.textContent = '그대로 유지됨 — 계속 답변에 참조될 수 있어요'; item.classList.remove('dim'); }
      else if(SRC[k].del){ d.textContent = '삭제됨 — 답변에 더 이상 쓰이지 않아요'; item.classList.add('dim'); }
      else { d.textContent = '참조 차단됨 — 앞으로 답변에 사용되지 않아요'; item.classList.remove('dim'); }
    });
  }

  function applyAll(){
    clearFx();
    b1Input.value = ''; syncB1(); renderB1Thread();
    if($('.sv-opt')) renderSurvey();
    $$('.b2-more').forEach(el => el.hidden = true); renderMoreToggles();
    applyRefs(); applyMemory();
    b2Boxes().forEach(cb => cb.classList.add('checked'));
    syncSelectAll();
    $$('.open').forEach(el => el.classList.remove('open'));
    hideSnackbar();
    renderB3B4();
  }

  /* ---------------- 클릭 기록 (휴대폰 화면 안의 모든 클릭) ---------------- */
  phone.addEventListener('click', e => {
    if(!Logger.active) return;
    const r = phone.getBoundingClientRect();
    const x = Math.round(e.clientX - r.left), y = Math.round(e.clientY - r.top);
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
    out.ids = resultIds(out);
    return out;
  }

  /* ---------------- 과제 직후 설문 (앱 안에서 참가자가 직접 응답) ---------------- */
  const S7 = [1, 2, 3, 4, 5, 6, 7], S5 = [1, 2, 3, 4, 5];
  const SURVEY = {
    A: { badge:'잠깐 설문', title:'방금 상황에 대해 알려 주세요', sub:'저녁 약속 장소 찾기', items:[
      { id:'A-13', q:'방금 과제는 전반적으로 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'A-14', q:'원하시던 상태로 처리를 마쳤다고 느끼시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'A-15', q:'방금 처리한 결과가 생각하신 대로 반영됐다고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'A-16', q:'출처 패널과 전체 관리 화면에서 보여준 정보의 양은 어땠나요?', scale:S7, lo:'너무 적다', hi:'너무 많다', mid:'4 = 적절하다' },
    ]},
    B: { badge:'잠깐 설문', title:'방금 상황에 대해 알려 주세요', sub:'채팅으로 정보 지우기', items:[
      { id:'B-10', q:'방금 과제는 전반적으로 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'B-11', q:'원하시던 상태로 처리를 마쳤다고 느끼시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'B-12', q:'방금 처리한 결과가 생각하신 대로 반영됐다고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'B-13', q:'처리 목록과 처리 결과에서 보여준 정보의 양은 어땠나요?', scale:S7, lo:'너무 적다', hi:'너무 많다', mid:'4 = 적절하다' },
      { id:'B-14', q:'처리할 항목을 확인하고 고르는 과정이 번거로웠나요?', scale:S7, lo:'전혀 번거롭지 않다', hi:'매우 번거롭다' },
    ]},
    S: { badge:'마지막 설문', title:'오늘 사용한 기능 전체에 대해 알려 주세요', sub:'각 문장에 얼마나 동의하는지 골라 주세요', items:[
      '이 기능을 자주 사용하고 싶을 것 같다.', '이 기능은 불필요하게 복잡하다.', '이 기능은 사용하기 쉽다.',
      '이 기능을 사용하려면 기술 지원이 필요할 것 같다.', '이 기능의 여러 부분이 잘 통합되어 있다.', '이 기능에 불일치나 혼동이 너무 많다.',
      '대부분의 사람들이 이 기능을 쉽게 배울 수 있을 것 같다.', '이 기능은 사용하기 번거롭다.', '이 기능을 사용할 때 자신감이 있다.',
      '이 기능을 사용하기 전에 많은 것을 배워야 한다.',
    ].map((q, i) => ({ id:`S-${String(i + 1).padStart(2, '0')}`, q, scale:S5, lo:'전혀 동의 안 함', hi:'매우 동의함' })) },
  };
  function buildSurveys(){
    const end = $('.screen[data-step="END"]');
    Object.keys(SURVEY).forEach(k => {
      const sv = SURVEY[k];
      const el = document.createElement('div');
      el.className = 'screen intro-screen survey-screen'; el.dataset.step = 'Q' + k;
      el.innerHTML = `<div class="survey-body">
        <div class="intro-badge">${esc(sv.badge)}</div>
        <h1>${esc(sv.title)}</h1><p class="survey-sub">${esc(sv.sub)}</p>
        ${sv.items.map((it, n) => `<div class="sv-item"><div class="sv-q"><span class="sv-no">${n + 1}</span><span>${esc(it.q)}</span></div>
          ${it.scale ? `<div class="sv-scale">${it.scale.map(v => `<button type="button" class="sv-opt hot" data-tag="설문 ${it.id}=${v}" data-id="${it.id}" data-v="${v}" onclick="App.pickSurvey('${it.id}', ${v})">${v}</button>`).join('')}</div>
            <div class="sv-ends"><span>${esc(it.lo)}</span>${it.mid ? `<span>${esc(it.mid)}</span>` : ''}<span>${esc(it.hi)}</span></div>`
          : `<div class="sv-choices">${it.choices.map(v => `<button type="button" class="sv-opt hot" data-tag="설문 ${it.id}=${v}" data-id="${it.id}" data-v="${esc(v)}" onclick="App.pickSurvey('${it.id}', '${esc(v)}')">${esc(v)}</button>`).join('')}</div>`}
        </div>`).join('')}
        <button type="button" class="primary-btn hot" id="svNext${k}" data-tag="설문 ${k} 다음" onclick="App.submitSurvey('${k}')" disabled>다음</button>
        <div class="survey-hint" id="svHint${k}">모든 문항에 답하면 '다음'을 누를 수 있어요</div>
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
      const ok = surveyDone(k); const btn = $('#svNext' + k);
      if(btn) btn.disabled = !ok;
      const hint = $('#svHint' + k); if(hint) hint.hidden = ok;
    });
  }
  function pickSurvey(id, v){
    svDraft[id] = v; renderSurvey();
    Logger.log('survey_pick', { step: current, id, value: v });
  }
  function submitSurvey(k){
    if(!surveyDone(k)) return;
    survey[k] = Object.fromEntries(SURVEY[k].items.map(it => [it.id, svDraft[it.id]]));
    Logger.log('survey', { step: current, key: k, answers: survey[k] });
    const next = k === 'S' ? 'END' : k === FIRST ? firstStep(SECOND) : (WITH_SUS ? 'QS' : 'END');
    go(next, 'survey');
  }
  buildSurveys();

  /* ---------------- 결과 내보내기 (엑셀 '자동 수집' 시트에 붙여넣는 형식) ---------------- */
  const RESULT_IDS = ['A-03', 'A-11', 'A-13', 'A-14', 'A-15', 'A-16', 'B-01', 'B-06', 'B-07', 'B-10', 'B-11', 'B-12', 'B-13', 'B-14', 'B-16', 'B-17']
    .concat(Array.from({ length: 10 }, (_, i) => `S-${String(i + 1).padStart(2, '0')}`));
  function resultIds(sm){
    const yn = v => v ? '예' : '아니오';
    const ev = Logger.active ? Logger.session.events : [];
    const reachedA = ev.some(e => e.type === 'step' && PHASE_A.includes(e.step));
    const reachedB = ev.some(e => e.type === 'step' && PHASE_B.includes(e.step));
    const ids = {
      'A-03': sm.A_sourceBadgeFoundSec ?? '',
      'A-11': reachedA ? yn(sm.A_visitedA4) : '',
      'B-01': sm.B_requestText || '',
      'B-06': sm.B_processed ? yn(sm.B_verifyClicked) : '',
      'B-07': sm.B_verifySec ?? '',
      'B-16': reachedB ? sm.B_clarifyCount : '',
      'B-17': reachedB ? yn(sm.B_moreOpened) : '',
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
      startedAt: meta.startedAt || '', studyId: meta.studyId || '', ended: (meta.ended || meta.finishedAt) ? '예' : '' }, ids, { SUS: susScore(ids) });
  }
  function resultsCSV(rows){
    const cols = ['participant', 'order', 'mode', 'startedAt', 'studyId', 'ended'].concat(RESULT_IDS, ['SUS']);
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
    if($('#lmSus').checked) q.set('sus', '1');
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
  function renderPanel(){
    const d = STEPS[current] || STEPS.START;
    const tag = d.phase === 'a' ? '<span class="phase-tag a">Phase A · 인라인 데이터 관리</span>'
              : d.phase === 'b' ? '<span class="phase-tag b">Phase B · 채팅 자연어 삭제</span>' : '';
    $('#stepTitle').innerHTML = current + ' ' + tag;
    $('#scriptBox').textContent = I18n.t(d.script);
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

  function renderTaskbar(){
    const bar = $('#taskbar');
    const phase = PHASE_A.includes(current) ? 'A' : PHASE_B.includes(current) ? 'B' : null;
    bar.classList.toggle('show', MODE === 'participant' && !!phase);
    // A는 답변이 다 나온 뒤 구체적인 목표로 바뀌어요(첫 반응은 자유롭게 보고, 그다음 목표 제시).
    const key = phase === 'A' && (M.aGoal || ['A3', 'A4'].includes(current)) ? 'A2' : phase;
    if(phase) $('#taskText').textContent = I18n.t(TASK_TEXT[key]);
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
    pickSurvey, submitSurvey, rowFrom, downloadResults, downloadResultLocal, updateLink, copyLink,
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
