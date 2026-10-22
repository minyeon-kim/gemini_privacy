// Local interaction feedback; research navigation remains controlled by App.
(function(){
  const phone = document.getElementById('phone');
  const overlay = document.getElementById('sheetOverlay');
  const sheet = overlay.querySelector('.sheet');
  const handle = sheet.querySelector('.handle');
  let toastTimer, speaking = false;
  const t = text => I18n.t(text);
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(message){
    clearTimeout(toastTimer);
    const el = document.getElementById('interactionToast');
    el.textContent = t(message);
    el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function sync(){
    phone.querySelectorAll('[onclick]:not(button):not(input)').forEach(el => {
      if(el === overlay) return;
      if(el.closest('.deleted')) { el.tabIndex = -1; return; }
      el.tabIndex = 0;
      const role = el.matches('.toggle') ? 'switch' : el.matches('.checkbox') ? 'checkbox' : 'button';
      el.setAttribute('role', role);
      if(el.matches('.toggle, .checkbox')) {
        el.setAttribute('aria-checked', el.classList.contains('mixed') ? 'mixed' : String(el.classList.contains('on') || el.classList.contains('checked')));
        el.dataset.label = el.dataset.ref || el.dataset.src || '전체 선택';
      }
    });
    phone.querySelectorAll('.source-item, .conn-wrap, .check-item').forEach((wrap, i) => {
      const trigger = wrap.querySelector('.meta[onclick], .check-item-head[onclick]');
      const detail = wrap.querySelector('.source-expand, .conn-detail, .check-item-expand');
      if(!trigger || !detail) return;
      detail.id = 'expandDetail' + i;
      detail.inert = !wrap.classList.contains('open') || wrap.classList.contains('deleted');
      trigger.setAttribute('aria-controls', detail.id);
      trigger.setAttribute('aria-expanded', String(wrap.classList.contains('open')));
      trigger.tabIndex = wrap.classList.contains('deleted') ? -1 : 0;
    });
    phone.querySelectorAll('[data-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.label));
      el.title = t(el.dataset.label);
    });
    const speak = phone.querySelector('[data-action="speak"]');
    speak.disabled = !('speechSynthesis' in window);
    if(!phone.querySelector('.screen[data-step="A2"].active') && speaking) stopSpeaking();
  }

  // Space and Enter work on the existing prototype's non-native buttons.
  phone.addEventListener('keydown', event => {
    if(event.key !== 'Enter' && event.key !== ' ') return;
    const control = event.target.closest('[role="button"], [role="switch"], [role="checkbox"]');
    if(!control || control.tagName === 'BUTTON' || control.closest('[inert], .deleted')) return;
    event.preventDefault(); event.stopPropagation();
    if(control.getAttribute('aria-disabled') !== 'true' && !control.classList.contains('wait')) control.click();
  });

  // A bounded, local ripple leaves control dimensions and click targets intact.
  phone.addEventListener('pointerdown', event => {
    const control = event.target.closest('button, .hot, .response-action');
    if(!control || control.disabled || control.closest('.deleted') || reducedMotion()) return;
    if(!control.matches('button, .round-btn, .src-badge, .sheet-close')) return;
    const bounds = control.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'tap-wave'; wave.setAttribute('aria-hidden','true');
    const size = Math.max(bounds.width, bounds.height) * 2;
    wave.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - bounds.left - size / 2}px;top:${event.clientY - bounds.top - size / 2}px`;
    control.appendChild(wave);
    setTimeout(() => wave.remove(), 500);
  });

  let drag = null;
  handle.addEventListener('pointerdown', event => {
    if(event.button !== 0 || App.current !== 'A3' || document.body.classList.contains('watching')) return;
    drag = {id:event.pointerId, y:event.clientY, distance:0};
    handle.setPointerCapture(event.pointerId);
    sheet.classList.add('dragging');
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    if(!drag || drag.id !== event.pointerId) return;
    drag.distance = Math.max(0, event.clientY - drag.y);
    sheet.style.transform = `translateY(${drag.distance}px)`;
  });
  function endDrag(event){
    if(!drag || drag.id !== event.pointerId) return;
    const dismiss = event.type !== 'pointercancel' && drag.distance > 90;
    drag = null;
    sheet.classList.remove('dragging');
    if(dismiss) {
      sheet.style.setProperty('--sheet-dismiss-from', sheet.style.transform);
      sheet.style.transform = '';
      App.closeSheet('drag');
    } else {
      sheet.classList.add('settling'); sheet.style.transform = '';
      setTimeout(() => sheet.classList.remove('settling'), 220);
    }
    if(handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);

  document.addEventListener('keydown', event => {
    if(App.current !== 'A3' || document.body.classList.contains('watching')) return;
    if(event.key === 'Escape') { event.preventDefault(); App.closeSheet('escape'); }
    if(event.key !== 'Tab') return;
    const available = [...sheet.querySelectorAll('button, [tabindex="0"], a[href]')]
      .filter(el => !el.closest('[inert], .deleted') && !el.disabled);
    const first = available[0], last = available[available.length - 1];
    if(!first) return;
    if(event.shiftKey && (document.activeElement === first || !sheet.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && (document.activeElement === last || !sheet.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  });

  function responseText(){
    const response = phone.querySelector('.screen[data-step="A2"] .msg-ai').cloneNode(true);
    response.querySelectorAll('.msg-icons, .response-pending').forEach(el => el.remove());
    return response.textContent.replace(/\n\s*\n/g,'\n').trim();
  }
  async function copyResponse(){
    const text = responseText();
    try {
      if(!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const previousFocus = document.activeElement;
      const textarea = document.createElement('textarea');
      textarea.value = text; textarea.setAttribute('data-no-translate', '');
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(textarea); textarea.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } finally { textarea.remove(); previousFocus?.focus({preventScroll:true}); }
      if(!copied) throw new Error('copy failed');
    }
  }
  function stopSpeaking(){
    window.speechSynthesis?.cancel(); speaking = false;
    phone.querySelector('[data-action="speak"]').setAttribute('aria-pressed','false');
  }
  phone.querySelectorAll('.response-action').forEach(button => button.addEventListener('click', async () => {
    const action = button.dataset.action;
    Logger.log('response_action', {step:App.current, action});
    if(action === 'like' || action === 'dislike') {
      const next = button.getAttribute('aria-pressed') !== 'true';
      phone.querySelectorAll('[data-action="like"], [data-action="dislike"]').forEach(el => el.setAttribute('aria-pressed','false'));
      button.setAttribute('aria-pressed', String(next));
      Logger.log('response_rating', {step:App.current, rating:next ? action : null});
      toast(next ? '의견이 반영됐어요' : '평가를 취소했어요');
    } else if(action === 'speak') {
      if(speaking) { stopSpeaking(); return; }
      if(!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(responseText());
      utterance.lang = I18n.language === 'en' ? 'en-US' : 'ko-KR';
      utterance.onend = stopSpeaking;
      utterance.onerror = () => { stopSpeaking(); toast('읽어주기를 사용할 수 없어요'); };
      speaking = true; button.setAttribute('aria-pressed','true');
      window.speechSynthesis.speak(utterance);
    } else {
      try {
        if(action === 'share' && navigator.share) await navigator.share({title:'Gemini', text:responseText()});
        else { await copyResponse(); toast('답변을 복사했어요'); }
      } catch(error) { if(error.name !== 'AbortError') toast('복사하지 못했어요. 다시 시도해 주세요'); }
    }
  }));
  const save = phone.querySelector('.r-photo .save');
  save.setAttribute('role','button'); save.tabIndex = 0;
  save.dataset.label = '레스토랑 저장'; save.dataset.tag = '레스토랑 저장';
  save.setAttribute('aria-pressed','false');
  save.addEventListener('click', () => {
    const saved = save.getAttribute('aria-pressed') !== 'true';
    save.setAttribute('aria-pressed', String(saved)); save.textContent = saved ? '✓' : '＋';
    toast(saved ? '이번 세션에 저장했어요' : '저장을 취소했어요');
    Logger.log('restaurant_save', {step:App.current, saved});
  });
  function reset(){
    stopSpeaking();
    sheet.classList.remove('dragging', 'settling'); sheet.style.transform = ''; drag = null;
    phone.querySelectorAll('.response-action[aria-pressed], .r-photo .save').forEach(el => el.setAttribute('aria-pressed','false'));
    save.textContent = '＋';
    document.getElementById('interactionToast').classList.remove('show');
    clearTimeout(toastTimer);
  }
  window.Interactions = {sync, reset};
  sync();
})();
