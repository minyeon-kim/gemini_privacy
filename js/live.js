// 실시간 보기 — 참가자 화면을 진행자 패널에서 그대로 따라 봅니다 (Firebase Realtime Database).
// config.js의 FIREBASE가 비어 있으면 아무 것도 하지 않고, 프로토타입은 기존처럼 동작해요.
//
// 저장 구조
//   liveIndex/{sid}  { participant, startedAt, updatedAt, step, ended }   ← 진행자 목록용
//   live/{sid}/meta     세션 정보 + 참가자 화면 크기
//   live/{sid}/state    현재 화면 상태 (App.snapshot())
//   live/{sid}/summary  요약 지표
//   live/{sid}/events   이벤트 기록 (Logger와 동일)
//   live/M_…/meta·summary  진행자 기기(대면)로 진행한 세션의 결과 — 목록(liveIndex)에는 나오지 않고 결과 내보내기에만 쓰여요
//   summary.ids          과제 직후 설문·SUS 응답과 로그 값(엑셀 '자동 수집'용)
(function(){
  const cfg = (window.UT_CONFIG || {}).FIREBASE;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const $ = sel => document.querySelector(sel);
  const phone = $('#phone');
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const clean = v => JSON.parse(JSON.stringify(v === undefined ? null : v));   // Firebase는 undefined를 못 받아요

  function loadScript(src){
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  let db = null;
  async function connect(){
    if(db) return db;
    await loadScript(SDK + 'firebase-app-compat.js');
    await loadScript(SDK + 'firebase-database-compat.js');
    db = firebase.initializeApp(cfg).database();
    return db;
  }

  // 화면 위쪽 여백(상태바). 참가자가 휴대폰에서 전체 화면으로 열면 0이에요.
  const screenTop = () => parseFloat(getComputedStyle(phone.querySelector('.screen')).top) || 0;

  /* ================= 참가자 쪽: 상태 올리기 ================= */
  function startPublisher(){
    let sid = null, stateTimer = null, scrollTimer = null;

    function publishState(){
      if(!sid) return;
      const now = Date.now();
      const snap = App.snapshot();
      db.ref('live/' + sid).update({
        state: clean(snap),
        summary: clean(App.summary()),
        'meta/updatedAt': now,
      });
      db.ref('liveIndex/' + sid).update({ updatedAt: now, step: snap.step });
    }
    const schedule = () => { clearTimeout(stateTimer); stateTimer = setTimeout(publishState, 80); };

    function begin(){
      const m = Logger.session.meta;
      sid = (m.participant || 'P').replace(/[^A-Za-z0-9_-]/g, '_') + '_' + Date.now().toString(36);
      const meta = {
        participant: m.participant, startedAt: m.startedAt, studyId: m.studyId, mode: m.mode, order: m.order, consentAt: m.consent ? m.consent.at : '',
        userAgent: m.userAgent, url: m.url,
        pw: phone.clientWidth, ph: phone.clientHeight, top: screenTop(),
        updatedAt: Date.now(), ended: false,
      };
      db.ref('live/' + sid).set({ meta: clean(meta) });
      db.ref('liveIndex/' + sid).set({ participant: m.participant, startedAt: m.startedAt, updatedAt: Date.now(), step: App.current, ended: false });
    }

    // Firebase 연결 전에 이미 시작했다면 지금까지의 기록부터 올려요.
    if(Logger.active){
      begin();
      Logger.session.events.forEach(ev => db.ref('live/' + sid + '/events').push(clean(ev)));
      schedule();
    }

    Logger.onEvent(ev => {
      if(ev.type === 'session_start') begin();
      if(!sid) return;
      db.ref('live/' + sid + '/events').push(clean(ev));
      if(ev.type === 'session_end'){
        db.ref('live/' + sid + '/meta').update({ ended: true });
        db.ref('liveIndex/' + sid).update({ ended: true });
      }
      schedule();
    });

    // B1 입력 중인 글자도 진행자 화면에 보이도록 올려요.
    phone.addEventListener('input', () => {
      if(!sid || scrollTimer) return;
      scrollTimer = setTimeout(() => { scrollTimer = null; publishState(); }, 200);
    }, true);

    // 펼치기·삭제 등은 이벤트로 잡히지만, 스크롤은 따로 올려요.
    phone.addEventListener('scroll', () => {
      if(!sid || scrollTimer) return;
      scrollTimer = setTimeout(() => { scrollTimer = null; publishState(); }, 200);
    }, true);
  }

  /* ================= 진행자 쪽: 목록 + 따라 보기 ================= */
  let watching = null;   // { sid, refs: [], meta, events, summary }

  function buildPanel(){
    const box = document.createElement('div');
    box.className = 'live-box';
    box.innerHTML = `
      <div class="panel-section-title">참가자 화면 실시간 보기</div>
      <div class="live-hint">참가자가 <b>?mode=participant</b> 링크로 시작하면 여기에 나타나요. 누르면 왼쪽 휴대폰 화면이 참가자 화면을 그대로 따라가요.</div>
      <div class="live-list" id="liveList">불러오는 중…</div>
      <div class="live-export">
        <button id="exportAllBtn" onclick="Live.exportAll()">전체 결과 CSV 받기</button>
        <span class="live-hint" id="exportStatus">Firebase에 저장된 모든 세션의 설문 응답·로그 값을 한 파일로 받아요 (엑셀 '자동 수집' 시트에 붙여넣기)</span>
      </div>
      <div class="panel-divider"></div>`;
    $('#sessionRow').after(box);
  }

  function ago(ms){
    const s = Math.round((Date.now() - ms) / 1000);
    return s < 60 ? `${s}초 전` : s < 3600 ? `${Math.round(s / 60)}분 전` : `${Math.round(s / 3600)}시간 전`;
  }

  let rows = null;
  function listSessions(){
    const since = Date.now() - 12 * 3600 * 1000;   // 최근 12시간
    db.ref('liveIndex').orderByChild('updatedAt').startAt(since).on('value', snap => {
      rows = [];
      snap.forEach(c => { rows.push(Object.assign({ sid: c.key }, c.val())); });
      rows.reverse();
      renderList();
    }, () => { $('#liveList').innerHTML = '<span class="live-empty">목록을 불러오지 못했어요. Firebase 설정과 보안 규칙을 확인해 주세요.</span>'; });
    setInterval(renderList, 15000);   // "n초 전" 표시 갱신
  }

  function renderList(){
    if(!rows) return;
    const el = $('#liveList');
    if(!rows.length){ el.innerHTML = '<span class="live-empty">진행 중인 참가자 세션이 없어요</span>'; return; }
    el.innerHTML = rows.map(r => {
      const cur = watching && watching.sid === r.sid;
      const state = r.ended ? '<span class="live-dot-ended"></span>종료' : '<span class="live-dot-on"></span>' + esc(r.step || '');
      return `<div class="live-row${cur ? ' cur' : ''}">
        <span><b>${esc(r.participant || '?')}</b> · ${state} · ${ago(r.updatedAt)}</span>
        <button onclick="Live.${cur ? 'stop()' : `watch('${esc(r.sid)}')`}">${cur ? '그만 보기' : '보기'}</button>
      </div>`;
    }).join('');
  }

  function watch(sid){
    if(watching) stop(true);
    if(Logger.active){
      if(!confirm(I18n.t('진행 중인 이 브라우저의 세션은 보관함에 저장하고, 참가자 화면 보기로 전환할까요?'))) return;
      Logger.archive(App.summary());
    }
    App.newSession();   // 이 브라우저 화면을 깨끗하게 비운 뒤 참가자 상태를 덮어씁니다

    const w = watching = { sid, refs: [], meta: {}, events: [], summary: null, ready: false };
    document.body.classList.add('watching');
    $('#liveBadge').textContent = '참가자 화면 보는 중 · 조작 불가';
    const base = db.ref('live/' + sid);
    const sync = () => App.setRemote({ meta: w.meta, events: w.events, summary: w.summary });

    const on = (ref, evt, fn) => { ref.on(evt, fn); w.refs.push(() => ref.off(evt, fn)); };
    on(base.child('meta'), 'value', s => {
      w.meta = s.val() || {};
      $('#liveBadge').textContent = `${w.meta.participant || '참가자'} 화면 ${w.meta.ended ? '· 세션 종료됨' : '실시간 · 조작 불가'}`;
      sync();
    });
    on(base.child('state'), 'value', s => { if(watching === w) App.applySnapshot(s.val()); });
    on(base.child('summary'), 'value', s => { w.summary = s.val(); sync(); });
    on(base.child('events'), 'child_added', s => {
      const ev = s.val();
      w.events.push(ev);
      if(w.ready) showTouch(ev, w.meta);
      sync();
    });
    base.child('events').once('value').then(() => { w.ready = true; });   // 지난 기록은 다시 깜빡이지 않게
    renderList();
  }

  function stop(silent){
    if(!watching) return;
    watching.refs.forEach(off => off());
    watching = null;
    document.body.classList.remove('watching');
    App.setRemote(null);
    if(!silent) App.newSession();
    renderList();
  }

  // 참가자가 누른 곳을 잠깐 표시: 이름이 있는 요소는 테두리로, 오클릭은 빨간 점으로
  function showTouch(ev, meta){
    if(ev.type === 'click' && ev.tag){
      const el = [...phone.querySelectorAll('[data-tag]')].find(n => n.dataset.tag === ev.tag && n.offsetParent !== null);
      if(el){
        el.classList.remove('live-flash'); void el.offsetWidth;
        el.classList.add('live-flash');
        setTimeout(() => el.classList.remove('live-flash'), 900);
        return;
      }
    }
    if((ev.type === 'click' || ev.type === 'misclick') && ev.x != null && meta.pw){
      const myTop = screenTop(), pTop = meta.top || 0;
      const x = ev.x * phone.clientWidth / meta.pw;
      const y = myTop + (ev.y - pTop) * (phone.clientHeight - myTop) / ((meta.ph || phone.clientHeight) - pTop);
      const dot = document.createElement('div');
      dot.className = 'live-touch' + (ev.type === 'misclick' ? ' miss' : '');
      dot.style.left = x + 'px'; dot.style.top = y + 'px';
      phone.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    }
  }

  /* ================= 결과 저장 · 내보내기 ================= */
  // 진행자 기기로 대면 진행한 세션도 결과(meta·summary)를 Firebase에 남겨요.
  function startModeratorWriter(){
    let msid = null, timer = null;
    const push = () => {
      if(!msid || !Logger.active || watching) return;
      const m = Logger.session.meta;
      db.ref('live/' + msid).update({
        meta: clean({ participant: m.participant, startedAt: m.startedAt, studyId: m.studyId, mode: m.mode, order: m.order, consentAt: m.consent ? m.consent.at : '', ended: !!m.endedAt, updatedAt: Date.now() }),
        summary: clean(App.summary()),
      });
    };
    Logger.onEvent(ev => {
      if(ev.type === 'session_start'){
        const m = Logger.session.meta;
        msid = 'M_' + (m.participant || 'P').replace(/[^A-Za-z0-9_-]/g, '_') + '_' + Date.now().toString(36);
      }
      if(['session_start', 'survey', 'task_done', 'session_end'].includes(ev.type)){ clearTimeout(timer); timer = setTimeout(push, 200); }
    });
  }
  async function exportAll(){
    const st = $('#exportStatus');
    if(!db){ st.textContent = 'Firebase에 연결되지 않았어요'; return; }
    st.textContent = '불러오는 중…';
    try{
      const snap = await db.ref('live').once('value');
      const rows = [];
      snap.forEach(c => { const v = c.val() || {}; if(v.meta && v.summary) rows.push(App.rowFrom(v.meta, v.summary)); });
      rows.sort((a, b) => String(a.participant).localeCompare(String(b.participant)) || String(a.startedAt).localeCompare(String(b.startedAt)));
      if(!rows.length){ st.textContent = '저장된 결과가 없어요'; return; }
      App.downloadResults(rows, 'ut-results-all');
      st.textContent = `${rows.length}개 세션을 받았어요 (같은 코드가 여러 번이면 startedAt으로 구분)`;
    }catch(e){ st.textContent = '불러오지 못했어요. Firebase 보안 규칙을 확인해 주세요.'; }
  }

  /* ================= 시작 ================= */
  window.Live = { watch, stop, exportAll, get enabled(){ return !!cfg; }, get connected(){ return !!db; } };

  if(App.mode === 'moderator'){
    const shield = document.createElement('div');
    shield.className = 'live-shield';
    shield.innerHTML = '<div class="live-badge" id="liveBadge"></div>';
    phone.appendChild(shield);
  }

  if(!cfg){
    if(App.mode === 'moderator'){
      buildPanel();
      $('#liveList').innerHTML = '<span class="live-empty">꺼져 있어요 — js/config.js에 FIREBASE 설정을 넣으면 켜져요 (README 참고).</span>';
    }
    return;
  }

  connect().then(() => {
    if(App.mode === 'participant') startPublisher();
    else { buildPanel(); listSessions(); startModeratorWriter(); }
  }).catch(() => {
    if(App.mode === 'moderator'){ buildPanel(); $('#liveList').innerHTML = '<span class="live-empty">Firebase에 연결하지 못했어요. 인터넷 연결과 config.js 설정을 확인해 주세요.</span>'; }
  });
})();
