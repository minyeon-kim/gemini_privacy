// 과제 C · 통합 과제(이사 계획): 최종 디자인처럼 답변 아래에 '출처 확인'·칩·채팅이 모두 있는 상태에서
// 참가자가 어떤 경로를 고르는지, 섞여 있는 정보 중 이사 관련 정보만 골라 처리하는지 봐요.
// app.js가 화면 이동·기록·실시간 보기를 맡고, 이 파일은 C 화면의 상태와 그리기만 맡아요.
(function(){
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const t = s => (window.I18n ? I18n.t(s) : s);

  // 답변에 쓰인 정보 4건: 이사 관련 3건 + 남겨야 하는 요가 예약 1건
  const ITEMS = {
    mem_loan:   { topic:'move', src:'memory', label:'전세 대출 상담',    text:'2025.9.2 대화에서 "전세 대출 상담" 언급' },
    gm_dabang:  { topic:'move', src:'gmail', label:'투룸 매물 알림',     text:'[다방] 망원동 투룸 새 매물 알림', date:'2025.9.18' },
    cal_view:   { topic:'move', src:'calendar', label:'집 보기 일정',  text:'일요일 14:00 "망원동 투룸 보기"', date:'2025.9.28' },
    gm_yoga:    { topic:'gym',  src:'gmail', label:'요가 예약',     text:'[요가스튜디오 숨] 토요일 클래스 예약 확정', date:'2025.9.27 10:00' },
  };
  const TOPICS = {
    move: { name:'이사 준비', sub:'전세 대출 상담, 투룸 매물 알림, 집 보기 일정' },
    gym:  { name:'운동',      sub:'요가 클래스 예약' },
  };
  const SRC_NAME = { memory:'Memory', gmail:'Gmail', calendar:'Calendar' };
  const TARGET = /이사|집\s?보|전세|투룸|망원|부동산|매물|대출|moving|apartment|lease/i;
  const INTENT = /지워|지우|삭제|잊어|잊게|빼|없애|안\s?쓰|쓰지\s?마|쓰지\s?않|기억하지|기억\s?말|정리|숨겨|차단|그만|forget|delete|remove|erase|stop\s+using|don'?t\s+use/i;
  const REPLY = {
    noTarget: '어떤 정보를 정리할까요? 사람 이름이나 주제를 알려 주세요.',
    noIntent: '이사와 관련해서 무엇을 도와드릴까요?',
    other: '네, 말씀해 주세요. 무엇을 도와드릴까요?',
  };
  const RETENTION = '사람이 검토한 대화 사본은 계정과 분리되어 최대 3년간 보관될 수 있어요';

  let S;
  function reset(){
    S = { refs:{ gmail:true, calendar:true, memory:true }, memDel:false, topics:{}, checks:{}, result:null,
          via:'', echo:'', thread:[], paths:[], chipMs:null, readyAt:null, draft:'' };
  }
  reset();

  const log = (type, data) => window.Logger && Logger.log(type, Object.assign({ step: App.current }, data || {}));
  const firstPath = p => { if(!S.paths.includes(p)) S.paths.push(p); };

  /* ---------------- 그리기 ---------------- */
  function renderSheet(){
    ['gmail', 'calendar', 'memory'].forEach(k => {
      const tg = $(`#cSheet .toggle[data-cref="${k}"]`); if(!tg) return;
      tg.classList.toggle('on', S.refs[k]); tg.setAttribute('aria-checked', String(S.refs[k]));
      tg.closest('.source-item').classList.toggle('ref-off', !S.refs[k]);
    });
    const mem = $('#cSheet [data-cmem]'); if(mem) mem.closest('.source-item').classList.toggle('deleted', S.memDel);
  }
  function renderNotice(){
    const el = $('#cNotice'); if(!el) return;
    const off = ['gmail', 'calendar', 'memory'].filter(k => !S.refs[k]).map(k => SRC_NAME[k]);
    const parts = [];
    if(S.memDel) parts.push('이 답변에 쓰인 메모리 1건 삭제됨');
    if(off.length) parts.push(off.join(', ') + ' 참조 끔');
    el.innerHTML = parts.length ? `<div class="nt-title">${esc(t('설정이 바뀌었어요'))}</div><ul class="nt-list">${parts.map(x => `<li>${esc(t(x))}</li>`).join('')}</ul><div class="nt-foot">${esc(t('다음 답변부터 반영돼요'))}</div>` + (S.memDel ? `<div class="nt-foot">${esc(t(RETENTION))}</div>` : '') : '';
    el.classList.toggle('show', parts.length > 0);
  }
  function renderThread(){
    const box = $('#cThread'); if(!box) return;
    box.innerHTML = S.thread.map(m => `<div class="msg-user" data-no-translate>${esc(m.text)}</div><div class="msg-ai b1-clarify">${esc(t(REPLY[m.kind]))}</div>`).join('');
    const inp = $('#cInput'); if(inp && document.activeElement !== inp) inp.value = S.draft || '';
    syncSend();
  }
  function renderTopics(){
    $$('#cTopics .tp-row').forEach(r => r.classList.toggle('checked', !!S.topics[r.dataset.topic]));
    const btn = $('#cTopicsNext'); if(btn) btn.disabled = !Object.values(S.topics).some(Boolean);
  }
  const selectedItems = () => Object.keys(ITEMS).filter(id => S.topics[ITEMS[id].topic]);
  function renderCard(){
    const box = $('#cCard'); if(!box) return;
    const ids = selectedItems();
    const names = Object.keys(TOPICS).filter(k => S.topics[k]).map(k => `'${TOPICS[k].name}'`).join(', ');
    const row = id => {
      const it = ITEMS[id];
      return `<div class="c-item${S.checks[id] ? ' checked' : ''}" data-cid="${id}">
        <div class="c-item-main"><div class="c-item-src">${esc(SRC_NAME[it.src])}</div><div class="c-item-text">${esc(t(it.text))}</div>${it.date ? `<div class="dt">${esc(it.date)}</div>` : ''}</div>
        <div class="checkbox${S.checks[id] ? ' checked' : ''} hot" data-tag="C 체크 ${id}" onclick="TaskC.check('${id}')">✓</div></div>`;
    };
    const mem = ids.filter(id => ITEMS[id].src === 'memory'), apps = ids.filter(id => ITEMS[id].src !== 'memory');
    const picked = ids.filter(id => S.checks[id]).length;
    box.innerHTML = `<div class="c-card-title">${esc(names)} ${esc(t('관련 정보'))} ${ids.length}${esc(t('건을 찾았어요'))}</div>
      ${mem.length ? `<div class="check-group-head"><span class="check-group-title">Memory</span><span class="check-group-desc">${esc(t('삭제돼요'))}</span></div><div class="c-list">${mem.map(row).join('')}</div>` : ''}
      ${apps.length ? `<div class="check-group-head"><span class="check-group-title">${esc(t('연결된 앱'))}</span><span class="check-group-desc">${esc(t('참조만 차단돼요'))}</span></div><div class="c-list">${apps.map(row).join('')}</div>` : ''}
      <div class="selection-count">${esc(t('처리할 정보'))} <b>${picked}</b><span class="sc-total">/ ${ids.length}건</span></div>
      <div class="card-btn-row">
        <button class="btn-cancel hot" data-tag="C 카드 취소" onclick="TaskC.cancelCard()">취소</button>
        <button class="btn-del hot" id="cProcessBtn" data-tag="C 선택 항목 처리" onclick="TaskC.process()" ${picked ? '' : 'disabled'}>선택 항목 처리</button>
      </div>`;
    $$('.c-echo').forEach(el => { el.textContent = S.echo || t('이 답변에 쓰인 정보 관리하기'); });
  }
  function renderResult(){
    const box = $('#cResult'); if(!box || !S.result) return;
    const ids = Object.keys(S.result).filter(id => S.result[id]);
    const ICON_DEL = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></svg>';
    const ICON_BLOCK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-2.6 3.7"/><path d="M6.6 6.6C4.3 8 2.7 10.1 2 12c1 2.5 5 7 10 7 1.7 0 3.2-.5 4.6-1.2"/></svg>';
    const lines = ids.map(id => {
      const it = ITEMS[id], del = it.src === 'memory';
      return `<div class="b3-line"><div class="b3-main"><div class="b3-head"><span class="b3-name">${esc(SRC_NAME[it.src])}</span><span class="st-chip ${del ? 'del' : 'block'}">${del ? ICON_DEL : ICON_BLOCK}${esc(t(del ? '삭제됨' : '참조 차단'))}</span></div>
        <div class="b3-desc">${esc(t(it.text))}</div><div class="b3-desc muted">${esc(t(del ? 'Memory에서 지웠어요' : `원본은 ${SRC_NAME[it.src]}에 그대로 있어요`))}</div></div></div>`;
    }).join('');
    const hasDel = ids.some(id => ITEMS[id].src === 'memory');
    box.innerHTML = `<div class="check-row"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e8e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.3 2.3 4.7-4.9"/></svg><h3>${esc(t('요청을 처리했어요'))}</h3></div>
      <p class="b3-sub">${esc(t('아래 정보는 앞으로 답변에 쓰지 않아요'))}</p><div class="b3-lines">${lines}</div>
      ${hasDel ? `<div class="retention-note">ⓘ ${esc(t(RETENTION))} (Gemini 개인정보 보호 정책)</div>` : ''}
      <div class="btn-row-h"><div class="ghost-btn hot" data-tag="C 결과 취소" onclick="TaskC.undo()">취소</div></div>`;
  }
  function syncSend(){
    const v = ($('#cInput') || {}).value || '';
    const b = $('#cSend'); if(b){ b.classList.toggle('wait', !v.trim()); b.setAttribute('aria-disabled', String(!v.trim())); }
  }
  function render(){ renderSheet(); renderNotice(); renderThread(); renderTopics(); renderCard(); renderResult(); }

  /* ---------------- 동작 ---------------- */
  function markReady(){ S.readyAt = performance.now(); }
  function openSource(){ firstPath('source'); log('c_source_open'); App.go('C3', 'c-source'); }
  function toggle(k){
    S.refs[k] = !S.refs[k]; firstPath('source');
    log('c_toggle', { ref:k, on:S.refs[k] }); renderSheet(); renderNotice();
  }
  function delMem(ev){
    if(ev) ev.stopPropagation();
    if(S.memDel) return;
    S.memDel = true; firstPath('source'); log('c_delete', { scope:'used' }); renderSheet(); renderNotice();
  }
  function closeSheet(how){ log('c_sheet_close', { how }); App.go('C2', 'c-sheet-close'); }
  function chip(){
    if(S.chipMs == null && S.readyAt) S.chipMs = Math.round(performance.now() - S.readyAt);
    firstPath('chip'); log('c_chip', { ms:S.chipMs }); App.go('C4', 'c-chip');
  }
  function topic(k){ S.topics[k] = !S.topics[k]; log('c_topic', { topic:k, on:S.topics[k] }); renderTopics(); }
  function topicsNext(){
    if(!Object.values(S.topics).some(Boolean)) return;
    S.via = 'chip'; S.echo = t('이 답변에 쓰인 정보 관리하기');
    S.checks = Object.fromEntries(selectedItems().map(id => [id, true]));
    log('c_topics_next', { topics:Object.keys(S.topics).filter(k => S.topics[k]) });
    renderCard(); App.go('C5', 'c-topics');
  }
  function closeTopics(){ log('c_topics_close'); App.go('C2', 'c-topics-close'); }
  function kind(text){ const tg = TARGET.test(text), it = INTENT.test(text); return tg && it ? 'ok' : it ? 'noTarget' : tg ? 'noIntent' : 'other'; }
  function send(){
    const inp = $('#cInput'); const text = (inp.value || '').trim();
    if(!text || App.current !== 'C2') return;
    firstPath('chat');
    const k = kind(text);
    inp.value = ''; S.draft = '';
    if(k !== 'ok'){ S.thread.push({ text, kind:k }); log('c_clarify', { text, kind:k }); renderThread(); return; }
    S.via = 'chat'; S.echo = text; S.topics = { move:true };
    S.checks = Object.fromEntries(selectedItems().map(id => [id, true]));
    log('c_request', { text }); renderCard(); App.go('C5', 'c-chat');
  }
  function check(id){ S.checks[id] = !S.checks[id]; log('c_check', { id, on:S.checks[id] }); renderCard(); }
  function cancelCard(){ log('c_card_cancel'); App.go('C2', 'c-card-cancel'); }
  function process(){
    const sel = Object.fromEntries(Object.keys(S.checks).map(id => [id, !!S.checks[id]]));
    if(!Object.values(sel).some(Boolean)) return;
    S.result = sel; log('c_process', { selected:sel, via:S.via }); renderResult(); App.go('C6', 'c-process');
  }
  function undo(){ log('c_result_undo', { selected:S.result }); S.result = null; App.go('C5', 'c-undo'); }

  /* ---------------- 요약 · 판정 ---------------- */
  function handled(id){
    const it = ITEMS[id];
    if(S.result && S.result[id]) return true;
    if(it.src === 'memory') return S.memDel || !S.refs.memory;
    return !S.refs[it.src];
  }
  function summary(){
    const move = Object.keys(ITEMS).filter(id => ITEMS[id].topic === 'move');
    const n = move.filter(handled).length, gym = handled('gm_yoga');
    // 정답을 정해 두지 않아요. 사실만 기록하고, 의도와 맞는지는 진행자가 참가자의 말로 판단해요(C-14).
    const moveResult = n === move.length ? '3건 모두' : n > 0 ? `일부(${n}건)` : '없음';
    const otherState = gym ? '함께 막힘' : '그대로';
    const changedBy = [];
    if(S.memDel || ['gmail', 'calendar', 'memory'].some(k => !S.refs[k])) changedBy.push('source');
    if(S.result && Object.values(S.result).some(Boolean)) changedBy.push(S.via || 'chip');
    const act = [];
    if(S.memDel) act.push('Memory 1건 삭제');
    ['gmail', 'calendar', 'memory'].filter(k => !S.refs[k]).forEach(k => act.push(SRC_NAME[k] + ' 끔'));
    if(S.result) Object.keys(S.result).filter(id => S.result[id]).forEach(id => act.push(`${ITEMS[id].label} ${ITEMS[id].src === 'memory' ? '삭제' : '차단'}`));
    return {
      C_firstPath: S.paths[0] || '없음', C_paths: S.paths.slice(), C_moveResult: moveResult, C_otherState: otherState, C_changedBy: changedBy,
      C_moveHandled: n, C_gymAffected: gym, C_chipClicked: S.paths.includes('chip'),
      C_chipSec: S.chipMs != null ? +(S.chipMs / 1000).toFixed(1) : null, C_action: act.join(', ') || '변경 없음',
      C_requestText: S.via === 'chat' ? S.echo : '', C_clarifyCount: S.thread.length,
    };
  }
  const PATH_KO = { chip:'칩', source:'출처 확인', chat:'채팅 입력', '없음':'없음' };

  /* ---------------- 실시간 보기 ---------------- */
  function snapshot(){ const inp = $('#cInput'); return Object.assign({}, S, { draft: inp ? inp.value : S.draft, readyAt:null }); }
  function apply(s){ if(!s) return; reset(); Object.assign(S, s); render(); }

  document.addEventListener('input', e => { if(e.target && e.target.id === 'cInput'){ S.draft = e.target.value; syncSend(); } });
  document.addEventListener('keydown', e => { if(e.target && e.target.id === 'cInput' && e.key === 'Enter' && !e.isComposing){ e.preventDefault(); send(); } });

  window.TaskC = { reset(){ reset(); render(); }, render, markReady, openSource, toggle, delMem, closeSheet, chip, topic, topicsNext, closeTopics,
    send, check, cancelCard, process, undo, summary, snapshot, apply, PATH_KO, get state(){ return S; } };
})();
