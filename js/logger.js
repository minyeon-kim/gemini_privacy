// UT 이벤트 기록기 — 서버 없이 브라우저 안에서 기록하고, JSON/CSV로 내보냅니다.
// 새로고침해도 사라지지 않도록 브라우저 저장소에도 계속 저장해 둡니다(가능한 경우).
(function(){
  const CUR_KEY = 'ut-log-current';
  const ARC_KEY = 'ut-log-archive';
  const cfg = window.UT_CONFIG || {};

  let session = null;      // { meta, events }
  let t0 = 0;              // performance.now() 기준 시작 시각
  const listeners = [];

  function store(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
  }
  function load(key, fallback){
    try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; }
  }
  function remove(key){ try{ localStorage.removeItem(key); }catch(e){} }

  function now(){ return Math.round(performance.now() - t0); }

  const Logger = {
    get session(){ return session; },
    get active(){ return !!session; },

    // 이전에 끝내지 못한 세션이 남아 있으면 보관함으로 옮겨 둡니다.
    rescuePrevious(){
      const prev = load(CUR_KEY, null);
      if(prev && prev.events && prev.events.length){
        const arc = load(ARC_KEY, []);
        prev.meta.rescued = true;
        arc.push(prev);
        store(ARC_KEY, arc.slice(-30));
      }
      remove(CUR_KEY);
    },

    start(meta){
      t0 = performance.now();
      session = {
        meta: Object.assign({
          studyId: cfg.STUDY_ID || '',
          startedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: window.innerWidth + 'x' + window.innerHeight,
          url: location.href,
        }, meta),
        events: [],
      };
      this.log('session_start', {});
    },

    log(type, data){
      if(!session) return null;
      const ev = Object.assign({ ms: now(), at: new Date().toISOString(), type }, data || {});
      session.events.push(ev);
      store(CUR_KEY, session);
      listeners.forEach(fn => { try{ fn(ev); }catch(e){} });
      return ev;
    },

    onEvent(fn){ listeners.push(fn); },

    finish(summary){
      if(!session) return;
      if(!session.meta.endedAt){
        this.log('session_end', {});
        session.meta.endedAt = new Date().toISOString();
        session.meta.durationMs = now();
      }
      session.summary = summary;
      store(CUR_KEY, session);
    },

    // 현재 세션을 보관함에 넣고 비웁니다.
    archive(summary){
      if(!session) return;
      this.finish(summary);
      const arc = load(ARC_KEY, []);
      arc.push(session);
      store(ARC_KEY, arc.slice(-30));
      remove(CUR_KEY);
      session = null;
    },

    archived(){ return load(ARC_KEY, []); },

    filename(s, ext){
      const m = s.meta || {};
      const stamp = (m.startedAt || new Date().toISOString()).replace(/[:T]/g,'-').slice(0,16);
      return `${m.studyId || 'ut'}_${m.participant || 'P'}_${stamp}.${ext}`;
    },

    toCSV(s){
      const cols = ['participant','mode','ms','at','type','step','tag','detail','x','y'];
      const esc = v => {
        if(v === undefined || v === null) return '';
        const str = typeof v === 'object' ? JSON.stringify(v) : String(v);
        return /[",\n]/.test(str) ? '"' + str.replace(/"/g,'""') + '"' : str;
      };
      const rows = s.events.map(ev => {
        const rest = Object.assign({}, ev);
        ['ms','at','type','step','tag','x','y'].forEach(k => delete rest[k]);
        return [s.meta.participant, s.meta.mode, ev.ms, ev.at, ev.type, ev.step, ev.tag,
                Object.keys(rest).length ? rest : '', ev.x, ev.y].map(esc).join(',');
      });
      return '﻿' + cols.join(',') + '\n' + rows.join('\n');   // BOM: 엑셀에서 한글 안 깨지게
    },

    download(fmt, s){
      s = s || session;
      if(!s){ alert(I18n.t('아직 기록된 세션이 없어요.')); return; }
      if(s === session && window.App) s.summary = App.summary();
      const text = fmt === 'csv' ? this.toCSV(s) : JSON.stringify(s, null, 2);
      const blob = new Blob([text], { type: fmt === 'csv' ? 'text/csv;charset=utf-8' : 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = this.filename(s, fmt);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },

    async copy(){
      if(!session){ alert(I18n.t('아직 기록된 세션이 없어요.')); return; }
      if(window.App) session.summary = App.summary();
      const text = JSON.stringify(session);
      try{
        await navigator.clipboard.writeText(text);
        App && App.notice('기록을 복사했어요. 진행자에게 붙여 넣어 보내 주세요.');
      }catch(e){
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); App && App.notice('기록을 복사했어요.'); }
        catch(e2){ App && App.notice('복사에 실패했어요. "기록 파일 받기"를 이용해 주세요.'); }
        ta.remove();
      }
    },

    // LOG_ENDPOINT가 설정돼 있으면 세션 기록을 전송합니다.
    async send(){
      if(!cfg.LOG_ENDPOINT || !session) return 'skipped';
      try{
        await fetch(cfg.LOG_ENDPOINT, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(session),
        });
        return 'sent';
      }catch(e){ return 'failed'; }
    },
  };

  window.Logger = Logger;
})();
