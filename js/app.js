// 프로토타입 동작 + 진행자 패널 + 기록 연결
(function(){
  const params = new URLSearchParams(location.search);
  const MODE = params.get('mode') === 'participant' ? 'participant' : 'moderator';
  if(MODE === 'participant') document.body.classList.add('participant');

  /* ---------------- 단계 정의 (진행자 스크립트) ---------------- */
  const STEPS = {
    START:{phase:'-', script:"참가자에게 연구 고지를 읽게 하고, 참가자 코드(P01 등)를 입력한 뒤 '시작하기'를 누르세요. 이때부터 기록이 시작됩니다.", indicators:[], interact:"클릭 가능 — <b>참가자 코드 입력</b>, <b>시작하기</b>."},
    SA:{phase:'a', script:"(참가자 모드 전용) 상황 1 안내 카드입니다.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    A1:{phase:'a', script:"퇴근 후 소파에서 저녁 약속 장소를 물어보는 장면입니다. 상황을 읽어준 뒤 참가자가 입력창을 누르게 하세요.", indicators:[2], interact:"클릭 가능 — <b>입력창</b>을 누르면 질문이 채워진 화면으로 넘어갑니다."},
    A1B:{phase:'a', script:"이미 정해진 질문이 입력창에 채워지는 장면입니다(실시간 타이핑 아님, 고정 시나리오). 전송 버튼을 누르게 하세요.", indicators:[2], interact:"클릭 가능 — <b>전송 버튼</b>만."},
    A1C:{phase:'a', script:"응답을 기다리는 짧은 로딩 장면입니다. 약 1.2초 뒤 자동으로 다음 화면으로 전환됩니다.", indicators:[2], interact:"클릭 지점 없음 — 자동 전환됩니다.", autoNext:'A2', autoDelay:1200},
    A2:{phase:'a', script:"실제 검색 기반 답변 형식(지도·맛집 카드)에 참가자가 언급한 적 없는 전 남자친구 이름이 자연스럽게 섞여 나옵니다. '예상하신 답변이었나요?'라고 물은 뒤, 참가자가 스스로 확인할 방법을 찾는지 관찰하세요.", indicators:[2,4], interact:"관찰 포인트 — 좋아요·싫어요 옆의 <b>파란색 '출처 확인' 배지</b>를 참가자가 스스로 찾아 누르는지가 핵심입니다. (발견까지 걸린 시간이 자동 기록돼요)"},
    A3:{phase:'a', script:"출처 패널이 열렸습니다. 이 답변이 참고한 소스만 표시되어, 펼치면 나오는 데이터도 전부 정민 관련(과거 예약·일정·대화)입니다. '이 정보를 앞으로 어떻게 하고 싶으신가요? 참조만 막고 싶으신가요, 아예 지우고 싶으신가요?'라고 열린 질문을 던지세요.", indicators:[1], interact:"클릭 가능 — 항목 이름을 누르면 <b>구체적 데이터가 펼쳐짐(읽기 전용)</b>, 참조 on/off는 <b>앱 단위 토글</b>. <b>Memory는 펼쳤을 때만</b> 하단에 '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초간 실행취소 토스트). Gmail·Calendar는 연동 데이터라 참조 차단만 가능. 우측 상단 <b>X</b>나 바깥 영역으로 닫기, 하단 <b>'Personal Intelligence에서 전체 관리 →'</b> 링크."},
    A4:{phase:'a', script:"이곳은 이 답변 하나가 아니라 Gemini가 갖고 있는 전체 데이터를 보여주는 화면이라, 항목을 펼치면 정민 관련 데이터 옆에 무관한 데이터(배송 알림·치과 예약 등)도 같이 보입니다. '정민 관련 정보를 어떻게 처리하고 싶으신가요?'라고 물어보세요.", indicators:[1,5], interact:"클릭 가능 — 이름을 누르면 <b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>Memory는 펼쳤을 때만</b> '메모리 전체 삭제' 링크가 나타남(A3에서 2건을 지웠다면 11→9건으로 반영). ← 로 출처 패널 복귀."},
    SB:{phase:'b', script:"(참가자 모드 전용) 상황 2 안내 카드입니다.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    B1:{phase:'b', script:"여기부터는 별개의 상황입니다 — 방금 A에서 본 인라인 관리와는 독립된, '채팅에 말로 요청해서 지우기'라는 다른 방식을 시연합니다. '이번엔 정민 관련 정보를 채팅에 직접 말해서 지워보고 싶다면 어떻게 하시겠어요?' 문구는 이미 입력돼 있으니 전송만 누르면 됩니다(고정 플로우).", indicators:[1], interact:"클릭 가능 — <b>전송 버튼</b>만."},
    B2:{phase:'b', script:"'이 목록이 기대하신 범위와 같나요, 빠지거나 더 있는 게 있나요?' Memory 그룹과 Connected Apps 그룹으로 나뉘어 있고, 각 그룹 라벨이 '삭제돼요'/'참조만 차단돼요'로 다른 걸 참가자가 알아차리는지 확인하세요.", indicators:[2,3], interact:"클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 항목별 <b>체크박스</b>, <b>선택 항목 처리/취소</b>. 아무것도 선택하지 않으면 처리 버튼이 비활성화됩니다."},
    B3:{phase:'b', script:"처리 결과를 참가자가 그대로 믿는지, 확인하고 싶어 하는지 관찰하세요. 먼저 묻지 말고 스스로 버튼을 누르는지 지켜보세요.", indicators:[3,4], interact:"클릭 가능 — <b>'지금 확인하기'</b>(관찰 핵심, 누르기까지 시간 자동 기록), <b>'취소'</b>(처리 이전으로 되돌리고 B2로 복귀). 결과 문구는 B2에서 고른 항목에 맞춰 바뀝니다."},
    B4:{phase:'b', script:"출처 패널과 같은 형식으로, 실제로 항목이 처리됐는지 다시 확인합니다. '신뢰가 어떻게 달라졌나요? 이런 방식의 데이터 활용을 원래 알고 계셨나요?'로 마무리하세요.", indicators:[3,4,5], interact:"클릭 가능 — <b>'채팅으로 돌아가기'</b>(세션 종료), ← 로 B3 복귀."},
    END:{phase:'-', script:"세션 종료 화면입니다. 패널의 'JSON 받기/CSV 받기'로 기록을 저장하고, 다음 참가자는 '새 참가자로 시작'을 누르세요.", indicators:[], interact:"참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송)."},
  };
  const ORDER = MODE === 'participant'
    ? ['START','SA','A1','A1B','A1C','A2','A3','A4','SB','B1','B2','B3','B4','END']
    : ['START','A1','A1B','A1C','A2','A3','A4','B1','B2','B3','B4','END'];
  const PHASE_A = ['A1','A1B','A1C','A2','A3','A4'];
  const PHASE_B = ['B1','B2','B3','B4'];
  const TASK_TEXT = {
    A: "Gemini에게 저녁 장소를 물어보고 답변을 살펴보세요. 할 만큼 했다고 느껴지면 '과제 완료'를 눌러 주세요.",
    B: "채팅으로 '정민' 관련 정보를 정리해 보세요. 다 됐다고 느껴지면 '과제 완료'를 눌러 주세요.",
  };

  /* ---------------- 상태 ---------------- */
  let current = 'START';
  let stepEnteredAt = 0;
  let devMode = false;
  let refState, memState, b2Result, lastUndo, undoTimer;
  const M = {}; // 지표 계산용 타임스탬프

  function resetState(){
    refState = { memory:true, gmail:true, calendar:true, photos:true };
    memState = { used:false, all:false };
    b2Result = null;
    lastUndo = null;
  }
  resetState();

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const phone = $('#phone');

  /* ---------------- 화면 전환 ---------------- */
  function showScreen(step){
    $$('.screen').forEach(el => el.classList.remove('active'));
    const el = $(`.screen[data-step="${step}"]`);
    if(el){ el.classList.add('active'); el.scrollTop = 0; }
  }

  function go(step, why){
    if(!STEPS[step]) return;
    const prev = current;
    const dwell = Math.round(performance.now() - stepEnteredAt);

    if((step === 'B3' || step === 'B4') && !b2Result) renderB3B4();   // 바로가기로 들어온 경우 현재 체크 상태로 표시

    if(step === 'A3'){                // A3 = A2 화면 위에 출처 시트가 열린 상태
      showScreen('A2');
      $('#sheetOverlay').classList.add('active');
      $('#sheetOverlay .sheet').scrollTop = 0;
    }else{
      showScreen(step);
      $('#sheetOverlay').classList.remove('active');
    }
    hideSnackbar();

    current = step;
    stepEnteredAt = performance.now();
    if(prev !== step) Logger.log('step', { step, from: prev, prevDwellMs: dwell, via: why || '' });
    markMilestones(step);

    renderPanel();
    renderTaskbar();

    const d = STEPS[step];
    if(d.autoNext) setTimeout(() => { if(current === step) go(d.autoNext, 'auto'); }, d.autoDelay || 1200);
    if(step === 'END') onEnd();
  }

  function markMilestones(step){
    const p = performance.now();
    if(step === 'A1' && !M.aStart) M.aStart = p;
    if(step === 'A2' && !M.a2Enter) M.a2Enter = p;
    if(step === 'B1' && !M.bStart) M.bStart = p;
    if(step === 'B3') M.b3Enter = p;
  }

  function advance(){
    if(current === 'START'){ start(); return; }
    const i = ORDER.indexOf(current);
    if(i >= 0 && i < ORDER.length - 1) go(ORDER[i+1], 'panel-next');
  }

  function closeSheet(how){
    if(current === 'A3'){ Logger.log('sheet_close', { step:'A3', how }); go('A2', 'sheet-close'); }
    else $('#sheetOverlay').classList.remove('active');
  }

  /* ---------------- 세션 ---------------- */
  function start(){
    const input = $('#pidInput');
    const pid = (input.value || '').trim().toUpperCase();
    if(!pid){ $('#pidError').classList.add('show'); input.focus(); return; }
    $('#pidError').classList.remove('show');
    Object.keys(M).forEach(k => delete M[k]);
    resetState(); applyAll();
    Logger.start({ participant: pid, mode: MODE });
    stepEnteredAt = performance.now();
    renderSession();
    go(MODE === 'participant' ? 'SA' : 'A1', 'start');
  }

  function newSession(){
    if(Logger.active && !confirm('현재 세션 기록을 보관함에 저장하고 새 참가자로 시작할까요?')) return;
    if(Logger.active) Logger.archive(summary());
    Object.keys(M).forEach(k => delete M[k]);
    resetState(); applyAll();
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
    Logger.log('scenario_reset', { step: current });
    go('A1', 'reset');
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
    if(phase === 'A') go(MODE === 'participant' ? 'SB' : 'B1', 'task-done');
    else go('END', 'task-done');
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
    Logger.log('expand', { step: current, tag: el.dataset.tag || '', open: wrap.classList.contains('open') });
  }

  function toggleRef(key){
    refState[key] = !refState[key];
    applyRefs();
    Logger.log('toggle', { step: current, ref: key, on: refState[key] });
  }

  function applyRefs(){
    Object.keys(refState).forEach(k => $$(`.toggle[data-ref="${k}"]`).forEach(el => el.classList.toggle('on', refState[k])));
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
  }

  function showSnackbar(msg){
    clearTimeout(undoTimer);
    const bar = $('#snackbar');
    bar.querySelector('.snackbar-msg').textContent = msg;
    bar.classList.add('show');
    undoTimer = setTimeout(() => { lastUndo = null; hideSnackbar(); }, 4000);
  }
  function hideSnackbar(){ $('#snackbar').classList.remove('show'); }

  /* ---------------- B2 ~ B4 (채팅 자연어 삭제) ---------------- */
  const b2Boxes = () => $$('.screen[data-step="B2"] .check-item .checkbox[data-src]');

  function toggleCheckItem(el){
    el.classList.toggle('checked');
    syncSelectAll();
    Logger.log('check', { step: current, src: el.dataset.src, checked: el.classList.contains('checked') });
  }
  function toggleSelectAll(el){
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
    boxes.forEach(b => b.textContent = b.classList.contains('checked') ? '✓' : '');
    $('#b2ProcessBtn').disabled = !any;
  }

  function processB2(){
    const sel = currentSelection();
    if(!Object.values(sel).some(Boolean)) return;
    b2Result = sel;
    renderB3B4();
    Logger.log('b2_process', { step: current, selected: sel });
    go('B3', 'b2-process');
  }

  function undoB2(){
    Logger.log('b3_cancel', { step: current, selected: b2Result });
    b2Result = null;
    go('B2', 'b3-cancel');
  }

  const SRC = {
    memory:  { name:'Memory',   count:2, del:true },
    gmail:   { name:'Gmail',    count:2, del:false },
    calendar:{ name:'Calendar', count:2, del:false },
  };

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
    $('#b3Lines').innerHTML = lines.join('');
    const nDel = Object.keys(SRC).filter(k => sel[k] && SRC[k].del).length;
    const nBlock = Object.keys(SRC).filter(k => sel[k] && !SRC[k].del).length;
    $('#b3Title').textContent = nDel && nBlock ? '요청을 처리했어요' : nDel ? '선택한 정보를 삭제했어요' : '선택한 정보의 참조를 차단했어요';

    Object.keys(SRC).forEach(k => {
      const item = $(`.screen[data-step="B4"] [data-b4="${k}"]`);
      const d = $(`.screen[data-step="B4"] [data-b4d="${k}"]`);
      if(!sel[k]){ d.textContent = '그대로 유지됨 — 계속 답변에 참조될 수 있어요'; item.classList.remove('dim'); }
      else if(SRC[k].del){ d.textContent = '삭제됨 — 더 이상 남아있지 않아요'; item.classList.add('dim'); }
      else { d.textContent = '참조 차단됨 — 앞으로 답변에 사용되지 않아요'; item.classList.remove('dim'); }
    });
  }

  function applyAll(){
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
      if(tag === '출처 확인' && M.a2Enter && !M.sourceFoundMs) M.sourceFoundMs = Math.round(performance.now() - M.a2Enter);
      if(tag === '지금 확인하기' && M.b3Enter && !M.verifyMs) M.verifyMs = Math.round(performance.now() - M.b3Enter);
    }else{
      const desc = (e.target.className && typeof e.target.className === 'string' ? '.' + e.target.className.split(' ')[0] : e.target.tagName.toLowerCase())
        + ((e.target.textContent || '').trim() ? ' "' + e.target.textContent.trim().slice(0, 18) + '"' : '');
      Logger.log('misclick', { step: current, tag: desc, x, y });
    }
  }, true);

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
    return {
      participant: Logger.active ? Logger.session.meta.participant : null,
      mode: MODE,
      A_sourceBadgeFound: !!M.sourceFoundMs,
      A_sourceBadgeFoundSec: M.sourceFoundMs ? +(M.sourceFoundMs / 1000).toFixed(1) : null,
      A_visitedA4: ev.some(e => e.type === 'step' && e.step === 'A4'),
      A_memoryDeleted: memState.all ? 'all' : memState.used ? 'used(2)' : 'none',
      A_refsFinal: Object.assign({}, refState),
      A_undoCount: count('undo'),
      B_processed: !!sel,
      B_selected: sel,
      B_verifyClicked: !!M.verifyMs,
      B_verifySec: M.verifyMs ? +(M.verifyMs / 1000).toFixed(1) : null,
      B_cancelCount: count('b3_cancel'),
      taskDone: { A: !!M.doneA, B: !!M.doneB },
      misclicksByStep: miss,
      misclicksTotal: count('misclick'),
      dwellMsByStep: dwell,
    };
  }

  /* ---------------- 진행자 패널 렌더 ---------------- */
  function renderPanel(){
    const d = STEPS[current] || STEPS.START;
    const tag = d.phase === 'a' ? '<span class="phase-tag a">Phase A · 인라인 데이터 관리</span>'
              : d.phase === 'b' ? '<span class="phase-tag b">Phase B · 채팅 자연어 삭제</span>' : '';
    $('#stepTitle').innerHTML = current + ' ' + tag;
    $('#scriptBox').textContent = d.script;
    $('#interactNote').innerHTML = d.interact;
    $('#indicatorRow').innerHTML = [1,2,3,4,5].map(i => `<span class="ind-chip ${d.indicators.includes(i)?'active':''}">지표${i}</span>`).join('');
    $('#jumpnav').innerHTML = ORDER.map(s => `<button class="${s===current?'cur':''}" ${s==='START'?'disabled':''} onclick="App.go('${s}','jump')">${s}</button>`).join('');
    renderMetrics();
  }

  function renderSession(){
    const row = $('#sessionRow');
    if(!Logger.active){ row.innerHTML = '세션 시작 전 — 참가자 코드를 입력하고 시작하세요'; return; }
    const m = Logger.session.meta;
    row.innerHTML = `참가자 <b>${m.participant}</b> · ${MODE === 'participant' ? '참가자 모드' : '진행자 모드'} · 시작 ${new Date(m.startedAt).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}`;
  }

  function renderMetrics(){
    const box = $('#metricsBox');
    if(!Logger.active){ box.innerHTML = '<span class="k">기록 없음</span><span class="v"></span>'; return; }
    const s = summary();
    const rows = [
      ['A · 출처 확인 배지 발견', s.A_sourceBadgeFound ? `${s.A_sourceBadgeFoundSec}초` : '아직'],
      ['A · 메모리 삭제', s.A_memoryDeleted],
      ['A · 참조 끈 앱', Object.keys(s.A_refsFinal).filter(k => !s.A_refsFinal[k]).join(', ') || '없음'],
      ['B · 처리한 항목', s.B_selected ? Object.keys(s.B_selected).filter(k => s.B_selected[k]).join(', ') : '아직'],
      ['B · 지금 확인하기', s.B_verifyClicked ? `${s.B_verifySec}초` : '아직'],
      ['오클릭 (전체)', s.misclicksTotal],
      ['기록된 이벤트', Logger.session.events.length],
    ];
    box.innerHTML = rows.map(([k,v]) => `<span class="k">${k}</span><span class="v">${v}</span>`).join('');
  }

  function renderFeed(){
    const feed = $('#logFeed');
    if(!Logger.active){ feed.innerHTML = '시작하면 이벤트가 여기에 쌓여요'; return; }
    const evs = Logger.session.events.slice(-40);
    feed.innerHTML = evs.map(e => {
      const sec = (e.ms / 1000).toFixed(1).padStart(6, ' ');
      const what = e.type === 'step' ? `→ ${e.step}`
                 : e.type === 'click' || e.type === 'misclick' ? `${e.tag}`
                 : e.type === 'toggle' ? `${e.ref} ${e.on ? 'ON' : 'OFF'}`
                 : e.type === 'check' ? `${e.src} ${e.checked ? '✓' : '✗'}`
                 : e.type === 'b2_process' ? Object.keys(e.selected).filter(k => e.selected[k]).join('+')
                 : e.type === 'delete' ? `memory (${e.scope})`
                 : e.type === 'expand' ? `${e.tag} ${e.open ? '열림' : '닫힘'}`
                 : '';
      return `<div class="${e.type === 'misclick' ? 'miss' : ''}">${sec}s ${e.type} ${what}</div>`;
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
    if(phase) $('#taskText').textContent = TASK_TEXT[phase];
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
    closeSheet, expand, toggleRef, deleteMemory, undoDelete,
    toggleCheckItem, toggleSelectAll, processB2, undoB2,
    toggleDev, summary, notice,
    downloadArchived(i, fmt){ Logger.download(fmt, Logger.archived()[i]); },
    get current(){ return current; },
  };
  // 기존 HTML의 패널 토글 버튼용
  window.togglePanel = function(){
    const panel = $('#panel'), btn = $('#panelToggleBtn');
    const hidden = panel.classList.toggle('hidden');
    btn.textContent = hidden ? '진행자 패널 보이기' : '진행자 패널 숨기기';
  };
})();
