// 과제 C · 통합 과제(이사 계획): 최종 디자인. 답변 아래 '출처 확인'을 누르면 쓰인 정보를 주제별로 보고
// 바로 골라서 처리할 수 있어요(출처 확인 + 관리 통합). 채팅으로 요청하는 길도 그대로 있어요.
// 섞여 있는 정보 중 이사 관련 정보만 골라 처리하는지, 처리 후 다시 물어 확인하는지 봐요.
// app.js가 화면 이동·기록·실시간 보기를 맡고, 이 파일은 C 화면의 상태와 그리기만 맡아요.
(function(){
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const t = s => (window.I18n ? I18n.t(s) : s);

  // 답변에 쓰인 정보 4건: 이사 관련 3건 + 남겨야 하는 요가 예약 1건
  const ITEMS = {
    mem_loan:   { topic:'move', src:'memory', label:'전세 대출 상담',    text:'2025.9.2 Gemini 채팅에서 "전세 대출 상담" 언급' },
    gm_dabang:  { topic:'move', src:'gmail', label:'투룸 매물 알림',     text:'[다방] 망원동 투룸 새 매물 알림', date:'2025.9.18' },
    cal_view:   { topic:'move', src:'calendar', label:'집 보기 일정',  text:'일요일 14:00 "망원동 투룸 보기"', date:'2025.9.28' },
    gm_yoga:    { topic:'gym',  src:'gmail', label:'요가 예약',     text:'[요가스튜디오 숨] 토요일 클래스 예약 확정', date:'2025.9.27 10:00' },
  };
  const TOPICS = { move: { name:'이사 준비' }, gym: { name:'운동' } };
  const SRC_NAME = { memory:'Memory', gmail:'Gmail', calendar:'Calendar' };
  const SRC_SCOPE = {
    gmail: '끄면 Gmail 전체를 답변에 쓰지 않아요. 메일은 그대로예요.',
    calendar: '끄면 Calendar 전체를 답변에 쓰지 않아요. 일정은 그대로예요.',
    memory: '끄면 메모리 전체를 답변에 쓰지 않아요.',
  };
  const TARGET = /이사|집\s?보|전세|투룸|망원|부동산|매물|대출|moving|apartment|lease/i;
  const INTENT = /지워|지우|삭제|잊어|잊게|빼|없애|안\s?쓰|쓰지\s?마|쓰지\s?않|기억하지|기억\s?말|정리|숨겨|차단|그만|forget|delete|remove|erase|stop\s+using|don'?t\s+use/i;
  const REPLY = {
    noTarget: '어떤 정보를 정리할까요? 사람 이름이나 주제를 알려 주세요.',
    noIntent: '이사와 관련해서 무엇을 도와드릴까요?',
    other: '네, 말씀해 주세요. 무엇을 도와드릴까요?',
  };
  const QUESTION = '이번 주말에 뭐 하면 좋을까?';
  const ICON_DEL = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></svg>';
  const ICON_BLOCK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-2.6 3.7"/><path d="M6.6 6.6C4.3 8 2.7 10.1 2 12c1 2.5 5 7 10 7 1.7 0 3.2-.5 4.6-1.2"/></svg>';
  const ICON_INFO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.7" r="1" fill="currentColor" stroke="none"/></svg>';

  let S;
  function reset(){
    // done: 처리된 항목(id → 'source' | 'chat'), sel: 시트에서 고른 항목, checks: 채팅 확인 카드에서 고른 항목
    S = { refs:{ gmail:true, calendar:true, memory:true }, done:{}, sel:{}, open:{}, checks:{}, result:null,
          via:'', echo:'', thread:[], paths:[], srcMs:null, readyAt:null, draft:'', verify:0, appsOpen:false };
  }
  reset();

  const log = (type, data) => window.Logger && Logger.log(type, Object.assign({ step: App.current }, data || {}));
  const firstPath = p => { if(!S.paths.includes(p)) S.paths.push(p); };
  const isDel = id => ITEMS[id].src === 'memory';
  function handled(id){ return !!S.done[id] || !S.refs[ITEMS[id].src]; }
  const effect = id => isDel(id) ? '삭제돼요' : `참조만 차단돼요. 원본은 ${SRC_NAME[ITEMS[id].src]}에 그대로 있어요`;

  /* ---------------- 그리기 ---------------- */
  function itemRow(id){
    const it = ITEMS[id], done = !!S.done[id], off = !S.refs[it.src];
    const right = done
      ? `<span class="st-chip ${isDel(id) ? 'del' : 'block'}">${isDel(id) ? ICON_DEL : ICON_BLOCK}${esc(t(isDel(id) ? '삭제됨' : '참조 차단'))}</span>`
      : off ? `<span class="st-chip block">${ICON_BLOCK}${esc(t('앱 전체 꺼짐'))}</span>`
      : `<div class="checkbox${S.sel[id] ? ' checked' : ''} hot" role="checkbox" aria-checked="${!!S.sel[id]}" data-tag="C 항목 ${id}" onclick="event.stopPropagation(); TaskC.pick('${id}')">✓</div>`;
    return `<div class="ct-item${done || off ? ' done' : ''}">
      <div class="c-item-main"><div class="c-item-src">${esc(SRC_NAME[it.src])}</div><div class="c-item-text">${esc(t(it.text))}</div>${it.date ? `<div class="dt">${esc(it.date)}</div>` : ''}
        ${done || off ? '' : `<div class="ct-effect">${esc(t(effect(id)))}</div>`}</div>${right}</div>`;
  }
  function renderSheet(){
    const box = $('#cSheetBody'); if(!box) return;
    const groups = Object.keys(TOPICS).map(k => {
      const ids = Object.keys(ITEMS).filter(id => ITEMS[id].topic === k);
      const open = ids.filter(id => !handled(id));
      const picked = open.filter(id => S.sel[id]).length;
      const st = !open.length ? 'done' : picked === open.length ? 'checked' : picked ? 'mixed' : '';
      const srcs = ids.map(id => SRC_NAME[ITEMS[id].src]).filter((v, i, a) => a.indexOf(v) === i)
        .map(n => `${n} ${ids.filter(id => SRC_NAME[ITEMS[id].src] === n).length}건`).join(', ');
      const box = !open.length
        ? `<span class="ct-alldone">${esc(t('처리함'))}</span>`
        : `<div class="checkbox ${st} hot" role="checkbox" aria-checked="${st === 'checked'}" data-tag="C 주제 ${k}" onclick="event.stopPropagation(); TaskC.pickTopic('${k}')">${st === 'mixed' ? '' : '✓'}</div>`;
      return `<div class="ct-group${S.open[k] ? ' open' : ''}">
        <div class="ct-head hot" data-tag="C 주제 펼치기 ${k}" onclick="TaskC.expand('${k}')">
          ${box}
          <div class="tp-main"><div class="tp-name">${esc(t(TOPICS[k].name))} <span class="item-count">${ids.length}건</span></div><div class="tp-src">${esc(srcs)}</div></div>
          <span class="chevron">⌄</span>
        </div>
        <div class="ct-items">${ids.map(itemRow).join('')}</div>
      </div>`;
    }).join('');
    const n = Object.keys(S.sel).filter(id => S.sel[id] && !handled(id)).length;
    const apps = ['gmail', 'calendar', 'memory'].map(k => `<div class="ct-app${S.refs[k] ? '' : ' ref-off'}">
        <div class="ct-app-main"><div class="ct-app-name">${SRC_NAME[k]}</div><div class="scope-note">${esc(t(SRC_SCOPE[k]))}</div></div>
        <div class="toggle${S.refs[k] ? ' on' : ''} hot" data-cref="${k}" data-tag="C ${k} 전체 차단" role="switch" aria-checked="${S.refs[k]}" onclick="TaskC.toggle('${k}')"><div class="knob"></div></div>
      </div>`).join('');
    box.innerHTML = `<div class="ct-list">${groups}</div>
      <div class="selection-count">${esc(t('선택한 정보'))} <b>${n}</b><span class="sc-total">건</span></div>
      <div class="card-btn-row"><button class="btn-del hot" id="cSheetProcess" data-tag="C 시트 처리" onclick="TaskC.processSheet()" ${n ? '' : 'disabled'}>${esc(t('선택한 정보 처리'))}</button></div>
      <div class="ct-apps${S.appsOpen ? ' open' : ''}">
        <div class="ct-apps-head hot" data-tag="C 앱 전체 설정 펼치기" onclick="TaskC.toggleApps()"><span>${esc(t('앱 전체 설정'))}</span><span class="chevron">⌄</span></div>
        <div class="ct-apps-body">${apps}</div>
      </div>`;
  }
  function renderNotice(){
    const el = $('#cNotice'); if(!el) return;
    const off = ['gmail', 'calendar', 'memory'].filter(k => !S.refs[k]).map(k => SRC_NAME[k]);
    el.innerHTML = off.length ? `<div class="nt-title">${esc(t('앱 설정을 바꿨어요'))}</div><ul class="nt-list"><li>${esc(off.join(', '))} ${esc(t('전체 참조 끔'))}</li></ul><div class="nt-foot">${esc(t('다음 답변부터 반영돼요'))}</div>` : '';
    el.classList.toggle('show', off.length > 0);
  }
  function renderThread(){
    const box = $('#cThread'); if(!box) return;
    box.innerHTML = S.thread.map(m => `<div class="msg-user" data-no-translate>${esc(m.text)}</div><div class="msg-ai b1-clarify">${esc(t(REPLY[m.kind]))}</div>`).join('');
    const inp = $('#cInput'); if(inp && document.activeElement !== inp) inp.value = S.draft || '';
    syncSend();
  }
  // 처리한 뒤 같은 질문을 다시 했을 때의 답변: 처리된 정보는 빠져요.
  function regenAnswer(){
    const li = [];
    if(!handled('gm_yoga')) li.push('<li><b>토요일 오전 10시</b>: 예약해 두신 요가스튜디오 숨 클래스가 있어요.</li>');
    li.push('<li><b>토요일 오후</b>: 날씨가 맑을 예정이라 한강 산책 어떠세요?</li>');
    if(!handled('cal_view')) li.push('<li><b>일요일 오후 2시</b>: 망원동 투룸 보기 일정이 있어요. 근처 카페에서 브런치를 먼저 드셔도 좋겠어요.</li>');
    else if(!handled('gm_dabang')) li.push('<li><b>일요일</b>: 관심 두신 망원동 투룸 새 매물이 올라왔어요. 한번 둘러보셔도 좋겠어요.</li>');
    else li.push('<li><b>일요일</b>: 동네 카페에서 여유롭게 브런치 어떠세요?</li>');
    const tail = !handled('mem_loan') ? '<p>전세 대출 상담도 알아보신다고 하셨죠. 은행 상담 예약도 함께 챙겨 두면 좋겠어요.</p>' : '';
    return `<p>이번 주말 일정을 바탕으로 계획을 정리해 봤어요.</p><ul>${li.join('')}</ul>${tail}`;
  }
  function renderRegen(){
    const box = $('#cRegen'); if(!box) return;
    if(!S.verify){ box.innerHTML = ''; return; }
    const proc = Object.keys(S.done).length;
    box.innerHTML = `<div class="regen-mark">${esc(t('정보를 처리한 뒤 같은 질문을 다시 했어요'))}${proc ? ` (${esc(t('처리한 정보'))} ${proc}건)` : ''}</div>
      <div class="msg-user">${esc(t(QUESTION))}</div>
      <div class="msg-ai c-answer regen">${regenAnswer()}
        <div class="msg-icons"><span class="src-badge hot" data-tag="C 출처 확인(다시 받은 답변)" onclick="TaskC.openSource()">${ICON_INFO}<span>${esc(t('출처 확인'))}</span></span></div>
      </div>`;
  }
  const chatItems = () => Object.keys(ITEMS).filter(id => ITEMS[id].topic === 'move');
  function renderCard(){
    const box = $('#cCard'); if(!box) return;
    const ids = chatItems();
    const row = id => {
      const it = ITEMS[id], done = handled(id);
      return `<div class="c-item${S.checks[id] ? ' checked' : ''}" data-cid="${id}">
        <div class="c-item-main"><div class="c-item-src">${esc(SRC_NAME[it.src])}</div><div class="c-item-text">${esc(t(it.text))}</div>${it.date ? `<div class="dt">${esc(it.date)}</div>` : ''}</div>
        ${done ? `<span class="st-chip ${isDel(id) ? 'del' : 'block'}">${esc(t('처리함'))}</span>` : `<div class="checkbox${S.checks[id] ? ' checked' : ''} hot" data-tag="C 체크 ${id}" onclick="TaskC.check('${id}')">✓</div>`}</div>`;
    };
    const mem = ids.filter(isDel), apps = ids.filter(id => !isDel(id));
    const picked = ids.filter(id => S.checks[id] && !handled(id)).length;
    box.innerHTML = `<div class="c-card-title">'${esc(t('이사 준비'))}' ${esc(t('관련 정보'))} ${ids.length}${esc(t('건을 찾았어요'))}</div>
      ${mem.length ? `<div class="check-group-head"><span class="check-group-title">Memory</span><span class="check-group-desc">${esc(t('삭제돼요'))}</span></div><div class="c-list">${mem.map(row).join('')}</div>` : ''}
      ${apps.length ? `<div class="check-group-head"><span class="check-group-title">${esc(t('연결된 앱'))}</span><span class="check-group-desc">${esc(t('참조만 차단돼요'))}</span></div><div class="c-list">${apps.map(row).join('')}</div>` : ''}
      <div class="selection-count">${esc(t('처리할 정보'))} <b>${picked}</b><span class="sc-total">/ ${ids.length}건</span></div>
      <div class="card-btn-row">
        <button class="btn-cancel hot" data-tag="C 카드 취소" onclick="TaskC.cancelCard()">취소</button>
        <button class="btn-del hot" id="cProcessBtn" data-tag="C 선택 항목 처리" onclick="TaskC.process()" ${picked ? '' : 'disabled'}>선택 항목 처리</button>
      </div>`;
    $$('.c-echo').forEach(el => { el.textContent = S.echo; el.hidden = !S.echo; });
  }
  function renderResult(){
    const box = $('#cResult'); if(!box || !S.result) return;
    const ids = Object.keys(S.result).filter(id => S.result[id]);
    const lines = ids.map(id => {
      const it = ITEMS[id], del = isDel(id);
      const note = del ? 'Memory에서 지웠어요. 사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요.' : `원본은 ${SRC_NAME[it.src]}에 그대로 있어요`;
      return `<div class="b3-line"><div class="b3-main"><div class="b3-head"><span class="b3-name">${esc(SRC_NAME[it.src])}</span><span class="st-chip ${del ? 'del' : 'block'}">${del ? ICON_DEL : ICON_BLOCK}${esc(t(del ? '삭제됨' : '참조 차단'))}</span></div>
        <div class="b3-desc">${esc(t(it.text))}</div><div class="b3-desc muted">${esc(t(note))}</div></div></div>`;
    }).join('');
    box.innerHTML = `<div class="check-row"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e8e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.3 2.3 4.7-4.9"/></svg><h3>${esc(t('요청을 처리했어요'))}</h3></div>
      <p class="b3-sub">${esc(t('아래 정보는 앞으로 답변에 쓰지 않아요'))}</p><div class="b3-lines">${lines}</div>
      <div class="btn-row-h"><div class="ghost-btn hot" data-tag="C 결과 되돌리기" onclick="TaskC.undo()">${esc(t('되돌리기'))}</div>
        <div class="primary-btn hot" data-tag="C 다시 물어보기" onclick="TaskC.verify()">${esc(t('같은 질문 다시 하기'))}</div></div>`;
    $$('.c-echo').forEach(el => { el.textContent = S.echo; el.hidden = !S.echo; });
  }
  function syncSend(){
    const v = ($('#cInput') || {}).value || '';
    const b = $('#cSend'); if(b){ b.classList.toggle('wait', !v.trim()); b.setAttribute('aria-disabled', String(!v.trim())); }
  }
  function render(){ renderSheet(); renderNotice(); renderThread(); renderRegen(); renderCard(); renderResult(); }

  /* ---------------- 동작 ---------------- */
  function markReady(){ S.readyAt = performance.now(); }
  function openSource(){
    if(S.srcMs == null && S.readyAt) S.srcMs = Math.round(performance.now() - S.readyAt);
    firstPath('source'); S.sel = {}; log('c_source_open', { srcMs:S.srcMs }); renderSheet(); App.go('C3', 'c-source');
  }
  function expand(k){ S.open[k] = !S.open[k]; log('c_expand', { topic:k, open:S.open[k] }); renderSheet(); }
  function pick(id){ if(handled(id)) return; S.sel[id] = !S.sel[id]; log('c_pick', { id, on:S.sel[id] }); renderSheet(); }
  function pickTopic(k){
    const open = Object.keys(ITEMS).filter(id => ITEMS[id].topic === k && !handled(id));
    const all = open.every(id => S.sel[id]);
    open.forEach(id => S.sel[id] = !all);
    log('c_pick_topic', { topic:k, on:!all }); renderSheet();
  }
  function toggleApps(){ S.appsOpen = !S.appsOpen; log('c_apps_open', { open:S.appsOpen }); renderSheet(); }
  function toggle(k){
    S.refs[k] = !S.refs[k]; firstPath('source');
    log('c_toggle', { ref:k, on:S.refs[k] }); render();
  }
  function closeSheet(how){ log('c_sheet_close', { how }); App.go('C2', 'c-sheet-close'); }
  function commit(sel, via){
    S.result = sel; S.via = via;
    Object.keys(sel).filter(id => sel[id]).forEach(id => S.done[id] = via);
    S.sel = {};
    log('c_process', { selected:sel, via }); render(); App.go('C6', 'c-process-' + via);
  }
  function processSheet(){
    const sel = Object.fromEntries(Object.keys(S.sel).filter(id => S.sel[id] && !handled(id)).map(id => [id, true]));
    if(!Object.keys(sel).length) return;
    S.echo = ''; commit(sel, 'source');
  }
  function kind(text){ const tg = TARGET.test(text), it = INTENT.test(text); return tg && it ? 'ok' : it ? 'noTarget' : tg ? 'noIntent' : 'other'; }
  function send(){
    const inp = $('#cInput'); const text = (inp.value || '').trim();
    if(!text || App.current !== 'C2') return;
    firstPath('chat');
    const k = kind(text);
    inp.value = ''; S.draft = '';
    if(k !== 'ok'){ S.thread.push({ text, kind:k }); log('c_clarify', { text, kind:k }); renderThread(); return; }
    S.echo = text;
    S.checks = Object.fromEntries(chatItems().filter(id => !handled(id)).map(id => [id, true]));
    log('c_request', { text }); renderCard(); App.go('C5', 'c-chat');
  }
  function check(id){ S.checks[id] = !S.checks[id]; log('c_check', { id, on:S.checks[id] }); renderCard(); }
  function cancelCard(){ log('c_card_cancel'); App.go('C2', 'c-card-cancel'); }
  function process(){
    const sel = Object.fromEntries(Object.keys(S.checks).filter(id => S.checks[id] && !handled(id)).map(id => [id, true]));
    if(!Object.keys(sel).length) return;
    commit(sel, 'chat');
  }
  // 되돌리기: 방금 처리한 것만 원래대로 돌리고, 처리하기 전 화면으로 돌아가요.
  function undo(){
    const via = S.via;
    log('c_result_undo', { selected:S.result, via });
    Object.keys(S.result || {}).forEach(id => { if(S.done[id] === via) delete S.done[id]; });
    if(via === 'source') S.sel = Object.assign({}, S.result);
    S.result = null; render();
    App.go(via === 'chat' ? 'C5' : 'C3', 'c-undo');
  }
  function verify(){
    S.verify++; log('c_verify', { n:S.verify, handled:Object.keys(ITEMS).filter(handled) });
    render(); App.go('C2', 'c-verify');
    setTimeout(() => { const b = $('.screen[data-step="C2"] .chat-body'); if(b) b.scrollTop = b.scrollHeight; }, 50);
  }

  /* ---------------- 요약 · 판정 ---------------- */
  function summary(){
    const move = Object.keys(ITEMS).filter(id => ITEMS[id].topic === 'move');
    const n = move.filter(handled).length, gym = handled('gm_yoga');
    // 정답을 정해 두지 않아요. 사실만 기록하고, 의도와 맞는지는 진행자가 참가자의 말로 판단해요(C-14).
    const moveResult = n === move.length ? '3건 모두' : n > 0 ? `일부(${n}건)` : '없음';
    const otherState = gym ? '함께 막힘' : '그대로';
    const changedBy = [];
    if(['gmail', 'calendar', 'memory'].some(k => !S.refs[k]) || Object.values(S.done).includes('source')) changedBy.push('source');
    if(Object.values(S.done).includes('chat')) changedBy.push('chat');
    const act = [];
    ['gmail', 'calendar', 'memory'].filter(k => !S.refs[k]).forEach(k => act.push(SRC_NAME[k] + ' 전체 끔'));
    Object.keys(S.done).forEach(id => act.push(`${ITEMS[id].label} ${isDel(id) ? '삭제' : '차단'}`));
    return {
      C_firstPath: S.paths[0] || '없음', C_paths: S.paths.slice(), C_moveResult: moveResult, C_otherState: otherState, C_changedBy: changedBy,
      C_moveHandled: n, C_gymAffected: gym, C_verify: S.verify > 0, C_verifyCount: S.verify,
      C_sourceSec: S.srcMs != null ? +(S.srcMs / 1000).toFixed(1) : null, C_action: act.join(', ') || '변경 없음',
      C_requestText: Object.values(S.done).includes('chat') ? S.echo : '', C_clarifyCount: S.thread.length,
    };
  }
  const PATH_KO = { source:'출처 확인', chat:'채팅 입력', '없음':'없음' };

  /* ---------------- 실시간 보기 ---------------- */
  function snapshot(){ const inp = $('#cInput'); return Object.assign({}, S, { draft: inp ? inp.value : S.draft, readyAt:null }); }
  function apply(s){ if(!s) return; reset(); Object.assign(S, s); render(); }

  document.addEventListener('input', e => { if(e.target && e.target.id === 'cInput'){ S.draft = e.target.value; syncSend(); } });
  document.addEventListener('keydown', e => { if(e.target && e.target.id === 'cInput' && e.key === 'Enter' && !e.isComposing){ e.preventDefault(); send(); } });

  window.TaskC = { reset(){ reset(); render(); }, render, markReady, openSource, expand, pick, pickTopic, toggleApps, toggle, closeSheet,
    processSheet, send, check, cancelCard, process, undo, verify, summary, snapshot, apply, PATH_KO, get state(){ return S; } };
})();
