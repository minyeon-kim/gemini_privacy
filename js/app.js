// 프로토타입 동작 + 진행자 패널 + 기록 연결
(function(){
  const params = new URLSearchParams(location.search);
  const MODE = params.get('mode') === 'participant' ? 'participant' : 'moderator';
  if(MODE === 'participant') document.body.classList.add('participant');
  // 과제 순서: 모든 참가자 A→B로 고정. (필요할 때만 주소에 ?order=ba 를 붙이면 B→A)
  const SEQ = (params.get('order') || '').toLowerCase() === 'ba' ? 'BA' : 'AB';
  // 참가자 코드는 링크에 담아 보내요(?pid=P03). 참가자 모드에서 코드가 없으면 익명 코드를 자동으로 만들어요.
  const PID = (params.get('pid') || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
  // SUS는 모든 참가자가 마지막 상황의 설문 다음에 답해요.
  const WITH_SUS = true;
  // v31 D5: 채팅 요청은 기본으로 바로 처리하고 결과를 보고해요. 예전처럼 목록에서 먼저 고르게 하려면 ?b=confirm
  // v31: 채팅 요청 → 요약 카드에서 한 번 승인(기본). ?b=direct 바로 처리 · ?b=list 목록부터(v30 방식)
  // v31: 과제 도중 질문(A-01 · A-04 힌트 · A-05 · A-07 · B-02)을 화면 위쪽 배너로 자동 표시. 끄려면 ?ask=boundary
  const ASK_INTASK = (params.get('ask') || '').toLowerCase() !== 'boundary';
  const B_MODE = ({ direct:'direct', list:'list' })[(params.get('b') || '').toLowerCase()] || 'summary';

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
    A2:{phase:'a', script:"[직접 시도] 답변에 참가자가 언급한 적 없는 '정민'과의 과거 기억이 섞여 나옵니다. 답변이 다 나오면 잠시 기다렸다가 '방금 답변을 보고 어떤 생각이 드세요?'를 먼저 묻고, 첫 반응을 들은 뒤 목표를 주세요: '참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 알아보고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' (지울지, 답변에만 안 쓰게 할지는 참가자가 고르게 두세요.) 조작 위치나 방법, '출처 확인' 배지 위치는 알려주지 마세요(참가자 모드에서는 답변이 다 나오면 왼쪽 과제 패널이 '새 과제'로 바뀌어요). 놀람은 이 시나리오에서 의도된 반응이라 실패로 보지 않아요. [도움 기준] 60초 넘게 막히면 1차: '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?' 그래도 못 찾으면 바로가기로 A3를 열고 기록지에 '도움 후'로 표시하세요.",
      indicators:[2,4], interact:"관찰 포인트 — 좋아요·싫어요 옆 <b>'출처 확인' 배지</b>를 스스로 찾는지. v31: 입력창에 다시 물어본 답변에도 배지가 붙고, '정민 얘기 하지 마'·'왜 나왔어?'처럼 정리나 이유를 물으면 답변 안에 <b>출처 확인</b> 버튼이 나와요. 처음 연 경로는 A_sourcePath(배지 / 다시 물어본 답변 / 채팅 안내)로 기록돼요. 발견 시간은 <b>답변이 다 표시된 시점부터</b> 자동 기록돼요."},
    A3:{phase:'a', script:"[직접 시도] 먼저 아무 말 없이 살펴보게 두세요. v31: 주제(정민, 식당 취향)를 펼치면 먼저 요약이 보여요. '삭제돼요 · 메모리 2'(빨강)와 '답변에만 안 써요 · Gmail 1 · 캘린더 2'(파랑)가 한 줄 설명과 함께 나오고, 항목 목록은 '항목 N건 보기'로 접혀 있어요. 고르면 처리 버튼 옆에 '메모리 2건 삭제 · 3건 답변에 안 씀'처럼 결과를 미리 보여 줘요. 바꾼 게 있으면 맨 위 '변경 내역'에 출처 확인과 개인 인텔리전스에서 한 처리가 함께 모여요. 조작하기 전에 '어떻게 하실 생각이세요?'로 의도를 들어 두세요(A-05). 정민만 고르는지, 식당 취향까지 막는지는 A-19, A-20에 자동 기록돼요. [이해 질문은 과제 뒤] 토글 범위(A-09)와 삭제·답변에 안 씀 차이(A-10)는 '과제 완료' 뒤 설문을 마치고 나서 물어요.",
      indicators:[1,2,4], interact:"클릭 가능 — 항목 이름=<b>데이터 펼치기(읽기 전용)</b>, 참조 켜기/끄기는 <b>앱 단위 토글</b>(이 시트엔 2건만 보이지만 끄면 해당 앱 전체 참조가 꺼짐 — 그레이존 핵심 관찰). <b>메모리는 펼쳤을 때만</b> '이 답변에 쓰인 메모리 2건 삭제' 링크가 나타남(바로 삭제 + 4초 실행취소). Gmail·캘린더는 참조 차단만 가능. <b>닫기(X)</b>·바깥 영역으로 닫기, 하단 <b>'개인 인텔리전스에서 전체 관리 →'</b> 링크."},
    A4:{phase:'a', script:"참가자가 스스로 들어온 경우에만 진행하세요(방문 여부 자체가 관찰값이라 진행자가 이동시키지 않아요). '이 화면은 무엇을 보여주는 것 같으세요?' → 참가자가 하려는 걸 지켜보세요. 메모리는 월별로 묶여 있고 항목마다 휴지통 버튼으로 한 건씩 지울 수 있어요(정민 메모리를 지우면 출처 시트에도 '삭제됨'으로 반영). 맨 아래 '메모리 전체 삭제'도 있어요. 한 건씩 지우는지, 전체 삭제를 고르는지 지켜보세요(A-07은 v30 문구 패치부터 '없는 기능 시도'가 아니라 관찰 메모로 기록). [과제 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(쉬움·완료 인식·확신도·정보량)을 진행하세요.",
      indicators:[1,5], interact:"클릭 가능 — 이름=<b>펼쳐서 데이터 확인(읽기 전용)</b>, 앱 단위 토글은 A3와 상태 연동. <b>메모리는 펼쳤을 때</b> 항목마다 휴지통(한 건 삭제, 실행취소 가능)과 '메모리 전체 삭제' 링크. 목록은 월별로 묶임(A3에서 2건을 지웠다면 11→9건). ← 로 출처 패널 복귀."},
    SB:{phase:'b', script:"(참가자 모드 전용) 상황 2 안내 카드입니다. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능 — <b>시작하기</b>."},
    B1:{phase:'b', script:"[과제 전 질문] 과제를 주기 전에 먼저: '정민 관련 정보를 앞으로 답변에 안 쓰이게 정리하고 싶다면, 평소라면 어떻게 하실 것 같으세요?' — 채팅으로 요청하는 방법을 스스로 떠올리는지 기록하세요. [목표 제시] (A를 먼저 했다면 '여기부터는 앞과 별개의 새 상황이에요.') 'Gemini가 정민이라는 사람과 관련된 정보를 기억하고 있어요. 정민은 지금은 연락하지 않는 사람이에요. 이번엔 채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요.' 입력창은 비어 있어요. 참가자가 직접 문장을 입력하게 하세요(화면 공유로 진행할 땐 참가자가 말한 문장을 진행자가 그대로 입력). 요청에 '정민'이나 '그 사람' 같은 대상이 없으면 Gemini가 '어떤 정보를 정리할까요?'라고 되묻고, 대상을 말하면 정리 목록이 나와요. 입력한 문장과 되묻기 횟수는 자동 기록됩니다.",
      indicators:[1], interact:"클릭 가능 — <b>입력창</b>(자유 입력), <b>전송 버튼</b>(글자를 입력해야 활성화, 엔터 키로도 전송)."},
    B2:{phase:'b', script:"[요약 카드 · 승인 한 번] v31: 채팅 요청을 보내면 약 1.2초 뒤 요약 카드가 나와요. '삭제돼요 · 메모리 3'(빨강), '답변에만 안 써요 · Gmail 6 · 캘린더 9'(파랑), '남겨 둬요 · 송금·입금 메일 2'(회색) 세 줄(합 20건)과 보관 안내, '직접 고르기' / 'N건 처리' 버튼이에요. '직접 고르기'를 누르면 같은 카드에서 출처별 목록이 펼쳐져요(주소에 ?b=direct면 바로 처리, ?b=list면 목록부터). 요약만 보고 바로 처리하는지, 목록을 여는지, 송금 메일을 함께 고르는지 관찰하세요.",
      indicators:[2], interact:"클릭 가능 — <b>전체 선택</b>, 항목 이름(펼치기), 묶음별 <b>체크박스</b>, 펼친 뒤 <b>'+N건 더보기'</b>, <b>N건 처리</b>(결과 카드로), <b>취소</b>(처리한 결과가 있으면 결과 카드로, 없으면 채팅으로)."},
    B3:{phase:'b', script:"[관찰만] 처리 결과 카드예요. 효과별로 한 줄씩: 메모리 '삭제됨'(지금 되돌리지 않으면 다시 볼 수 없음), Gmail·캘린더 '답변에만 안 씀'(원본은 각 앱에), 고르지 않은 것 '남겨 둠'(요약 카드와 같은 세 줄). '다시 고르기'는 목록을 펼친 요약 카드로(송금 메일까지 처리하려면 여기서), '되돌리기'는 모두 원래대로 돌리고 요약 카드로 가요. 참가자가 입력창에 다시 물어서 확인하는지가 관찰값이에요(B-06, 자동 기록). 이해 질문은 과제 뒤 화면에 자동으로 떠요(B-09, B-08). 결과 줄 아래 보관 안내를 읽었는지(B-18)는 관찰로 기록해요.", indicators:[3,4], interact:"클릭 가능: 다시 고르기, 되돌리기, 입력창"},
    B4:{phase:'b', script:"참가자가 스스로 들어온 경우의 확인 화면입니다. '이 화면은 무엇을 보여 주는 것 같으세요?' 보관 안내를 읽는지는 묻지 말고 관찰만 하세요(B-18). 신뢰에 관한 질문은 여기서 하지 말고 마무리 단계로 미루세요.",
      indicators:[3,4,5], interact:"클릭 가능 — <b>'채팅으로 돌아가기'</b>(B5로 이동), ← 로 B3 복귀."},
    B5:{phase:'b', script:"[과제 종료] 참가자가 끝났다고 하면(참가자 모드는 '과제 완료') 사후 설문(쉬움·완료 인식·확신도·정보량)을 진행하세요. 마무리 질문은 사용성 설문(SUS)까지 끝난 뒤 마지막 질문 화면에서 해요.",
      indicators:[4,5], interact:"클릭 지점 없음 — 처리 결과 카드와 마무리 답변만 표시됩니다."},
    QA:{phase:'-', script:"[과제 직후 설문 · 저녁 약속 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(A-12, 진행자 기록) 그다음 참가자가 화면의 설문 4문항에 직접 답하고 '다음'을 누르게 두세요. 화면을 설명하지 마세요. 설문을 마친 뒤 이해 질문 A-08~A-10을 조건에 맞는 것만 하나씩 묻고, 점수 이유를 물어요. 처리를 어떻게 확인할지는 묻지 마세요(과제 2의 B-06 관찰을 위해).",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QB:{phase:'-', script:"[과제 직후 설문 · 채팅 삭제 상황] 설문 화면을 보여주기 전에 먼저 말로 물어보세요: '지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?'(B-09, 진행자 기록) 그다음 참가자가 화면의 설문 5문항에 직접 답하고 '다음'을 누르게 두세요. 설문을 마친 뒤 이해 질문(B-08)과 점수 이유를 하나씩 물어요.",
      indicators:[3,5], interact:"클릭 가능 — 문항별 보기, <b>다음</b>(모든 문항에 답하면 활성화). 응답은 기록 파일과 Firebase에 자동 저장돼요."},
    QW:{phase:'-', script:"[마지막 질문] 사용성 설문(SUS) 다음에 나오는 닫힌 질문 3개예요(W-01~03, 자동 기록). 참가자가 답하면 화면에서 고른 이유를 묻고(W-04), 이어서 W-05~W-07을 하나씩 하세요. 화면에서 이미 고른 질문은 말로 다시 묻지 않아요.", indicators:[4], interact:"클릭 가능: 보기 선택, 다음"},
    QS:{phase:'-', script:"[사용성 설문(SUS)] 마지막 상황의 설문 다음에 항상 나오는 화면이에요. 참가자가 10문항에 직접 답하게 두세요. 마무리 질문은 이 화면을 마친 뒤 말로 진행하세요.",
      indicators:[], interact:"클릭 가능 — 문항별 1~5, <b>다음</b>(10문항 모두 답하면 활성화)."},
    SC:{phase:'c', script:"(참가자 모드 전용) 상황 3 안내 카드예요. 참가자가 직접 읽고 시작하게 두세요.", indicators:[], interact:"클릭 가능: <b>시작하기</b>"},
    C1:{phase:'c', script:"질문이 미리 입력돼 있어요. 참가자가 전송을 누르게 두세요.", indicators:[], interact:"클릭 가능: 전송"},
    C2:{phase:'c', script:"[통합 과제] 최종 디자인이에요. 답변 아래 '출처 확인'을 누르면 쓰인 정보가 주제별로 나오고, 거기서 바로 골라 처리할 수 있어요. 채팅으로 요청하는 길도 있어요. 어떤 경로를 고르는지 지켜보고 방법은 알려 주지 마세요. 정답은 정해 두지 않아요. 참가자가 말한 의도와 실제 결과가 맞는지, 다른 정보(요가 예약)까지 영향을 받았다면 그걸 알고 했는지가 핵심이에요.", indicators:[1,2,4], interact:"클릭 가능: 출처 확인, 채팅 입력"},
    C3:{phase:'c', script:"[출처 확인 + 관리] 주제(이사 준비, 운동)를 펼쳐 항목을 고르고 '선택한 정보 처리'로 처리해요. 아래 '앱 연동 설정'의 토글은 앱 전체 단위라 끄면 요가 예약도 함께 막혀요. 참가자가 그걸 알고 그렇게 하는지 보세요(원해서 끄는 것도 괜찮아요).", indicators:[1,4,5], interact:"클릭 가능: 주제 펼치기, 주제와 항목 체크, 선택한 정보 처리, 앱 연동 설정 토글, 닫기"},
    C5:{phase:'c', script:"처리 목록이에요. 체크를 바꾸는지, '삭제돼요/답변에만 안 써요'를 알아차리는지 보세요.", indicators:[3,4,5], interact:"클릭 가능: 항목 체크, 취소, 선택 항목 처리"},
    C6:{phase:'c', script:"처리 결과예요. '같은 질문 다시 하기'로 처리된 정보가 빠진 답변을 직접 확인하는지 보세요(C-07). '되돌리기'는 방금 처리한 것만 원래대로 돌려요. 참가자가 끝났다고 하면 '과제 완료'를 누르게 두세요.", indicators:[3], interact:"클릭 가능: 되돌리기, 같은 질문 다시 하기"},
    QC:{phase:'-', script:"[과제 직후 설문 · 이사 상황] 설문 전에 먼저 말로: '지금 이사 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?' 그다음 화면 설문(3문항)에 답하게 두세요.", indicators:[3,5], interact:"클릭 가능: 문항별 보기, 다음"},
    END:{phase:'-', script:"세션 종료 화면이에요(SUS와 마무리 질문 W-04~W-07이 화면에서 모두 끝난 상태라 더 물을 필수 질문은 없어요). 짧게 감사 인사를 하고(필요하면 오늘 본 이름·일정은 모두 가상이었다고 말로 안내) 녹화를 멈춘 뒤, 패널의 '기록 받기(JSON)/기록 받기(CSV)'로 기록을 저장하고 다음 참가자는 '새 참가자로 시작'을 누르세요.", indicators:[], interact:"참가자 모드에서는 이 화면에 기록 받기/복사 버튼이 보입니다(자동 전송 설정 시 자동 전송)."},
  };
  const PHASE_A = ['A1','A1B','A1C','A2','A3','A4'];
  const PHASE_B = ['B1','B2','B3'];
  const PHASE_C = ['C1','C2','C3','C5'];
  const seg = ph => (MODE === 'participant' ? ['S' + ph] : []).concat(ph === 'A' ? PHASE_A : ph === 'B' ? PHASE_B : PHASE_C);
  const FIRST = SEQ[0], SECOND = SEQ[1];
  // 과제 C(통합)는 A·B를 마친 뒤 항상 세 번째로 해요. SUS는 C까지 끝난 뒤.
  const ORDER = ['START'].concat(seg(FIRST), ['Q' + FIRST], seg(SECOND), ['Q' + SECOND], WITH_SUS ? ['QS'] : [], ['QW', 'END']);
  const firstStep = ph => seg(ph)[0];
  const TASK_TEXT = {
    A:  { steps:['미리 입력된 질문을 보내고 답변을 살펴보세요'] },
    A2: { ctx:'정민은 지금은 연락하지 않는 사람이에요', steps:['답변에 정민 이야기가 왜 나왔는지 알아보기', '앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기'] },
    B:  { ctx:'정민은 지금은 연락하지 않는 사람이에요', steps:['채팅으로 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 하기'] },
    C:  { ctx:'이사는 안 가기로 했어요', steps:['앞으로 이사 관련 정보가 답변에 쓰이지 않게 하기'] },
  };
  const TASK_BRIEF = { A2:'정민 이야기가 왜 나왔는지 알아보고, 앞으로 답변에 쓰이지 않게 하기' };
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
  let refState, refVia = {}, memState, b2Result, b2Detail = null, b2View = 'summary', lastUndo, undoTimer, b1Text, b1Asks = [], svDraft = {}, survey = {}, svIdx = {};
  const M = {}; // 지표 계산용 타임스탬프

  function resetState(){
    refState = { memory:true, gmail:true, calendar:true, photos:true };
    refVia = {};   // v31 D7: 앱 연동을 어디서 껐는지(출처 확인 sheet / 개인 인텔리전스 pi)
    memState = { used:false, all:false, done:{}, a4:{}, via:{} };
    b2Result = null; b2Detail = null;
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
    }else if(step === 'C3'){
      showScreen('C2');
      $('#sheetOverlay').classList.remove('active');
      $('#cSheet').classList.add('active');
      $('.screen[data-step="C2"]').inert = true;
    }else{
      showScreen(step);
      $('#sheetOverlay').classList.remove('active');
      $('.screen[data-step="A2"]').inert = false;
      $('#cSheet').classList.remove('active');
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
    if(askCur && ((!['A2', 'A3', 'A4'].includes(step) && !(askCur.id === 'B-02' && step === 'B2')) || (askCur.id === 'A-07' && step !== 'A4'))){ const after = askAfter; Logger.log('ask_next', { step, id: askCur.id, mode: 'banner', how: 'left-screen' }); askCur = null; askAfter = null; renderAskBanner(); if(after) after(); }
    markMilestones(step);

    renderPanel();
    window.Interactions?.sync();
    renderTaskbar();

    const d = STEPS[step];
    if(d.autoNext) autoTimer = setTimeout(() => { if(current === step) go(d.autoNext, 'auto'); }, d.autoDelay || 1200);
    if(step === 'END'){ onEnd(); celebrate(); }
    // 과제 도중 질문은 화면을 막지 않는 위쪽 배너로(조작은 그대로 가능)
    if(MODE === 'participant' && ASK_INTASK){
      // A-05 · A-07: 화면이 열리면 바로 묻고, 답하기 전에는 조작할 수 없어요(조작 전 의도를 먼저 듣기 위해)
      if(step === 'A3' && !M.askedA05){ M.askedA05 = true; if(askCur && askCur.id === 'A-01'){ const a = askAfter; askCur = null; askAfter = null; if(a) a(); } askBanner('A-05', '이 화면을 보고, 어떻게 하실 생각이세요?', { gate: true }); }
      if(step === 'A4' && !M.askedA07){ M.askedA07 = true; askBanner('A-07', '이 화면은 무엇을 보여 주는 것 같으세요?', { gate: true }); }
      if(step === 'B2' && !M.askedB02 && !b2Result){
        const enteredAt = M.lastClick = performance.now();
        askTimers.push(setTimeout(function idle(){
          if(current !== 'B2' || M.askedB02 || b2Result) return;
          if(performance.now() - (M.lastClick || enteredAt) >= 20000){ M.askedB02 = true; askBanner('B-02', '여기 나온 정리 범위는 생각하셨던 것과 비교하면 어떤가요?'); }
          else askTimers.push(setTimeout(idle, 2000));
        }, 20000));
      }
    }
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
    process.classList.remove('busy'); process.textContent = b2ProcessLabel();
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
    if(step === 'B3' && prev === 'B1'){            // v31 바로 처리: 응답 대기 후 결과 카드 등장
      const scr = $('.screen[data-step="B3"]');
      scr.classList.add('loading');
      later(() => scr.classList.remove('loading'), 1200);
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
      if(!M.aGoal){
        const showGoal = () => { M.aGoal = true; M.a2Enter = performance.now(); if(MODE === 'participant'){ Logger.log('task_goal_shown', {step:current}); M.flash = true; } renderTaskbar(); };
        const goalThenHint = () => {
          showGoal();
          // A-04: 목표가 나오고 60초 동안 출처 확인을 못 찾으면 스크립트 문장 그대로 힌트 한 번(진행자마다 말이 달라지지 않게)
          if(MODE === 'participant' && ASK_INTASK) askTimers.push(setTimeout(() => {
            if(!M.sourceFoundMs && current === 'A2' && !hold){ M.hintA = performance.now(); askBanner('A-04', '이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요?', { hint: true }); }
          }, 60000));
        };
        // A-01: 답변이 끝나면 바로 과제 안내 카드에 묻고, 답하기 전에는 프로토타입을 누를 수 없어요(질문을 건너뛰지 않게). 답하면 과제 목표.
        if(MODE === 'participant' && ASK_INTASK && !M.askedA01){
          M.askedA01 = true;
          askBanner('A-01', '방금 답변을 보고 어떤 생각이 드세요?', { after: goalThenHint, gate: true });
        }else goalThenHint();
      }
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
    clearAsk();
    M.sessionStart = performance.now();
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
    holdThen('intro', '-', null, 'start');   // 참가자 모드: 도입 질문(I-02)
  }

  function newSession(){
    if(Logger.active && !confirm(I18n.t('현재 세션 기록을 보관함에 저장하고 새 참가자로 시작할까요?'))) return;
    if(Logger.active) Logger.archive(summary());
    Object.keys(M).forEach(k => delete M[k]);
    clearAsk();
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
    holdThen('post-task', phase, 'Q' + phase, 'task-done');
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
    if(refState[key]) delete refVia[key]; else refVia[key] = current === 'A4' ? 'pi' : 'sheet';
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
    renderA3();
    renderA2Notice();
  }

  // A3에서 바꾼 내용을 A2 답변 아래에 알려줘요 (출처 시트를 닫고 돌아왔을 때 변화가 보이도록).
  const LOG_NAME = { memory:'Memory', gmail:'Gmail', calendar:'Calendar', photos:'Photos' };   // 기록 파일 값은 이전 세션과 같게 유지
  const REF_NAME = { memory:'메모리', gmail:'Gmail', calendar:'캘린더', photos:'Google 포토' };
  const RETENTION = '사람이 검토한 채팅은 지워도 최대 3년 보관돼요';   // Gemini 개인정보 보호 허브 문장 순서(검토자 → 채팅 → 지워도 → 최대 3년)
  // 보관 안내 각주: 과제 1 시트 · 과제 2 요약/결과 카드에 같은 모양으로 (메모리를 고르거나 지웠을 때)
  const RET_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.7" r="1" fill="currentColor" stroke="none"/></svg>';
  const retFoot = () => `<div class="fxg-foot">${RET_ICON}${esc(I18n.t(RETENTION))}</div>`;
  // 답변 아래에는 무엇이 바뀌었는지만 한 줄로 알려줘요.
  // 답변 아래: 바뀐 내용을 칩 하나로 보여 주고, 누르면 출처 화면에서 자세히 볼 수 있어요.
  const NT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>';
  const appList = names => names.length <= 2 ? names.join(', ') : `${names[0]} 외 ${names.length - 1}개 앱`;
  function renderA2Notice(){
    const el = $('#a2Notice');
    if(!el || !refState || !memState) return;
    const nItems = Object.keys(memState.done || {}).length + Object.keys(memState.a4 || {}).length;   // v31 D7: 개인 인텔리전스에서 지운 것까지
    const nOff = Object.keys(refState).filter(k => !refState[k]).length;
    const parts = [];
    if(memState.all) parts.push('메모리 전체 삭제');
    if(nItems) parts.push(`정보 ${nItems}건 처리`);
    if(nOff) parts.push(`앱 연동 ${nOff}개 끔`);
    el.innerHTML = parts.length ? `<div class="nt-row"><button type="button" class="nt-chip hot" data-tag="A 변경 내역 보기" onclick="App.go('A3')">${NT_ICON}<span>${esc(parts.map(x => I18n.t(x)).join(', '))}</span><span class="nt-chev" aria-hidden="true"></span></button></div>`
      + ((memDeletedN() || memState.all) ? `<div class="nt-sub">${esc(I18n.t(RETENTION))}</div>` : '') : '';
    el.classList.toggle('show', parts.length > 0);
  }


  /* ---------------- 다시 물어보기: A·B 채팅 입력 ----------------
     처리한 뒤 참가자가 입력창에 직접 다시 물어보면, 지금 남아 있는 정보만으로 답해요.
     답변은 물어본 순간의 상태로 고정해서 기록해요. */
  var chat = { a2: [], b3: [] };   // var: 초기화 중 먼저 불려도 안전하게
  const RESTO_Q = /추천|레스토랑|식당|맛집|이탈리안|저녁|약속|어디|restaurant|dinner/i;
  function aSources(){ const live = id => !aHandled(id); return { memory: ['a_mem_truffle', 'a_mem_jazz'].some(live), calendar: ['a_cal_dinner', 'a_cal_bday'].some(live), gmail: live('a_gm_tolo'), taste: ['a_mem_italian', 'a_gm_saved'].some(live) }; }
  function bSources(){
    const sel = b2Result || {}, st = b2Detail || [];
    const gmLeft = b2Items().filter((cb, i) => cb.dataset.isrc === 'gmail' && !st[i]);
    const gmail = !b2Result ? true : !gmLeft.length ? false : gmLeft.every(cb => cb.dataset.hold) ? 'hold' : true;
    return { memory: (sel.memory || 0) < SRC.memory.count, calendar: (sel.calendar || 0) < SRC.calendar.count, gmail };
  }
  function restoAnswer(src){
    const tail = src.memory || src.calendar
      ? '<p>작년 봄에 <b>정민</b> 씨와 가셨을 때 트러플 리조또를 좋아하셨었죠. 이번에도 비슷한 메뉴 어떠세요?</p>'
      : src.gmail ? '<p>지난봄에 다녀오신 톨로 비스트로도 다시 가 보셔도 좋겠어요.</p>' : '';
    const taste = src.taste === false ? '' : '평소 이탈리안을 좋아하신다고 하셔서 골라 봤어요. ';
    return `<p>${taste}송도 센트럴파크 인근의 <b>톨로 비스트로</b>를 추천해 드려요. 통창으로 공원 뷰를 즐길 수 있고, '바질 새우 피자'와 '트러플 뇨끼'가 인기 메뉴예요.</p>${tail}`;
  }
  function jmAnswer(src, task){
    const li = [];
    if(src.memory) li.push('예전 대화에서 정민 님과 트러플 리조또를 드신 이야기를 기억하고 있어요.');
    if(src.calendar) li.push("캘린더에 '정민과 저녁', '정민 생일' 같은 일정이 있어요.");
    if(src.gmail === 'hold' && task === 'b') li.push('Gmail에 정민 님과 주고받은 송금·입금 메일 2건이 남아 있어요.');
    else if(src.gmail && task === 'b') li.push('Gmail에 정민 님이 함께한 항공 예약, 송금 메일이 있어요.');
    return li.length ? `<p>정민 님에 대해 지금 참고할 수 있는 정보예요.</p><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul>`
      : '<p>정민 님에 대해 참고할 수 있는 정보가 없어요.</p>';
  }
  // v31 D4: 과제 1에서 채팅으로 정리를 요청하거나 이유를 물으면, 그 자리에서 출처 확인을 열 수 있게 버튼을 붙여요.
  const A_WHY = /왜|어디서|어떻게\s?알|출처|근거|\bwhy\b|how do you know|where did/i;
  const SRC_BTN = (tag, label) => `<button type="button" class="src-badge chat-src hot" data-tag="${tag}" onclick="App.go('A3', 'chat-link')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.7" r="1" fill="currentColor" stroke="none"/></svg><span>${label}</span></button>`;
  function whyAnswer(src){
    const li = [];
    if(src.memory) li.push('예전 Gemini 채팅에서 정민 님과 트러플 리조또를 드신 이야기(메모리)');
    if(src.calendar) li.push("캘린더 일정 '정민과 저녁'");
    if(src.gmail) li.push('Gmail의 톨로 비스트로 예약 메일');
    return li.length ? `<p>정민 님 이야기는 아래 정보를 참고해서 나왔어요.</p><ul>${li.map(x => `<li>${x}</li>`).join('')}</ul>` : '<p>지금은 정민 님 관련 정보를 답변에 쓰지 않아요.</p>';
  }
  function chatReply(key, text){
    const task = key === 'a2' ? 'a' : 'b', src = task === 'a' ? aSources() : bSources();
    const target = B1_TARGET.test(text), del = B1_INTENT.test(text);
    if(task === 'a'){
      const jmLeft = aTopicIds('jm').some(id => !aHandled(id));
      const link = jmLeft ? SRC_BTN('출처 확인 · 채팅 안내', '출처 확인') : '';
      if(del) return { kind:'delete', badge:false, html: jmLeft ? `<p>이 답변에 쓰인 정민 관련 정보예요. 여기서 골라 지우거나, 답변에만 안 쓰게 할 수 있어요.</p>${link}` : '<p>정민 님 관련 정보는 이미 정리했어요. 앞으로 답변에 쓰지 않아요.</p>' };
      if(target && A_WHY.test(text)) return { kind:'why', badge:false, html: whyAnswer(src) + (jmLeft ? `<p>답변에 쓰지 않으려면 여기서 고를 수 있어요.</p>${link}` : '') };
      if(target) return { kind:'person', badge:true, html: jmAnswer(src, task) };
      if(RESTO_Q.test(text)) return { kind:'same', badge:true, html: restoAnswer(src) };
      return { kind:'other', badge:false, html:'<p>네, 좋아요. 조금 더 자세히 알려 주시면 도와드릴게요.</p>' };
    }
    if(del) return { kind:'delete', html: Object.values(src).some(Boolean) ? jmAnswer(src, task) : '<p>정민 님 관련 정보는 이미 정리했어요. 지금은 답변에 쓰지 않아요.</p>' };
    if(target) return { kind:'person', html: jmAnswer(src, task) };
    if(RESTO_Q.test(text)) return { kind:'same', html: restoAnswer(src) };
    return { kind:'other', html:'<p>네, 좋아요. 조금 더 자세히 알려 주시면 도와드릴게요.</p>' };
  }
  function renderChat(){
    // v31 D3: 다시 물어본 답변에도 출처 확인 배지를 붙여서, 위로 올라가 첫 답변을 찾지 않아도 되게 해요.
    const badge = `<div class="msg-icons reask-icons"><span class="src-badge hot" data-tag="출처 확인 · 다시 물어본 답변" onclick="App.go('A3', 'reask-badge')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.7" r="1" fill="currentColor" stroke="none"/></svg><span>출처 확인</span></span></div>`;
    // 한 화면에 '출처 확인'이 여러 번 보이지 않게, 다시 물어본 답변 중 마지막 것에만 붙여요.
    const draw = (id, list, withBadge) => { const box = $('#' + id); if(box) box.innerHTML = list.map((m, i) => `<div class="msg-user" data-no-translate>${esc(m.q)}</div><div class="msg-ai reask">${m.html}${withBadge && m.badge && i === list.length - 1 ? badge : ''}</div>`).join(''); };
    draw('a2Thread', chat.a2, true); draw('b3Thread', chat.b3, false);
    ['a2', 'b3'].forEach(k => syncChatSend(k));
  }
  function syncChatSend(k){
    const inp = $('#' + k + 'Input'), btn = $('#' + k + 'Send'); if(!inp || !btn) return;
    btn.classList.toggle('wait', !inp.value.trim()); btn.setAttribute('aria-disabled', String(!inp.value.trim()));
  }
  function ask(k){
    const inp = $('#' + k + 'Input'); if(!inp) return;
    const text = inp.value.trim(); if(!text) return;
    inp.value = ''; syncChatSend(k);
    const key = k === 'a2' ? 'a2' : 'b3';
    if(key === 'b3' && M.b3Enter && !M.verifyMs) M.verifyMs = Math.round(performance.now() - M.b3Enter);
    const r = chatReply(key, text);
    chat[key].push({ q: text, html: r.html, badge: !!r.badge });
    Logger.log('reask', { step: current, task: key === 'a2' ? 'A' : 'B', text, kind: r.kind, sources: key === 'a2' ? aSources() : bSources() });
    renderChat();
    setTimeout(() => { const b = $(`.screen[data-step="${key === 'a2' ? 'A2' : 'B3'}"] .chat-body`); if(b) b.scrollTop = b.scrollHeight; }, 60);
  }
  document.addEventListener('input', e => { const m = e.target && /^(a2|b3|b5)Input$/.exec(e.target.id); if(m) syncChatSend(m[1]); });
  document.addEventListener('keydown', e => { const m = e.target && /^(a2|b3|b5)Input$/.exec(e.target.id); if(m && e.key === 'Enter' && !e.isComposing){ e.preventDefault(); ask(m[1]); } });

  /* ---------------- A3: 항목별 처리 + A4: 메모리 전체 삭제 ---------------- */
  // A3 출처 화면(최종안): 주제별로 묶고 항목마다 골라 처리. Memory는 삭제, Gmail·Calendar는 이 항목만 참조 차단.
  var A_TOPICS = { jm: '정민', taste: '식당 취향' };
  var A_ITEMS = {   // var: 초기화 중 먼저 그려도 안전하게
    a_gm_tolo:    { topic:'jm', src:'gmail', label:'톨로 비스트로 예약', text:'[톨로 비스트로] 예약이 확정되었습니다', meta:'2025.3.15 19:00, 2명', why:'같은 날 캘린더 일정 "정민과 저녁"' },
    a_cal_dinner: { topic:'jm', src:'calendar', label:'정민과 저녁 일정', text:'정민과 저녁', meta:'2025.3.15' },
    a_cal_bday:   { topic:'jm', src:'calendar', label:'정민 생일 일정', text:'정민 생일', meta:'2024.11.2' },
    a_mem_truffle:{ topic:'jm', src:'memory', label:'트러플 리조또 메모리', text:'"정민과 트러플 리조또"', meta:'Gemini 채팅, 2025.3.14' },
    a_mem_jazz:   { topic:'jm', src:'memory', label:'재즈바 메모리', text:'"정민이 좋아하던 재즈바"', meta:'Gemini 채팅, 2025.1.20' },
    a_mem_italian:{ topic:'taste', src:'memory', label:'이탈리안 선호 메모리', text:'"이탈리안 음식 좋아함"', meta:'Gemini 채팅, 2025.2.10' },
    a_gm_saved:   { topic:'taste', src:'gmail', label:'저장한 레스토랑 알림', text:'[캐치테이블] 저장한 송도 레스토랑 3곳 소식', meta:'2025.3.20' },
  };
  var a3Sel = {}, a3Open = {}, a3Detail = {}, a3AppsOpen = false;
  const aDone = id => !!(memState && memState.done && memState.done[id]);
  const aOff = id => !refState[A_ITEMS[id].src] || (A_ITEMS[id].src === 'memory' && memState.all);
  const aHandled = id => aDone(id) || aOff(id);
  const aSrcIds = k => Object.keys(A_ITEMS).filter(id => A_ITEMS[id].src === k);
  const aTopicIds = t => Object.keys(A_ITEMS).filter(id => A_ITEMS[id].topic === t);
  const memDeletedN = () => aSrcIds('memory').filter(aDone).length;
  const CHECK_TXT = '✓';
  const A_SCOPE = { gmail:'끄면 Gmail 전체를 답변에 쓰지 않아요. 메일은 그대로예요.', calendar:'끄면 캘린더 전체를 답변에 쓰지 않아요. 일정은 그대로예요.', memory:'끄면 메모리 전체를 답변에 쓰지 않아요.' };
  function aIcon(k){
    const src = $(`.screen[data-step="B2"] [data-src="${k}"]`)?.closest('.check-item-head')?.querySelector('.icon-chip');
    if(!src) return '';
    const sfx = 'a3' + k + Math.random().toString(36).slice(2, 6);
    return src.outerHTML.replace(/id="([^"]+)"/g, `id="$1_${sfx}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_${sfx})`).replace('icon-chip sm', 'icon-chip ct-ic');
  }
  // v31 D1: '삭제'와 '답변에만 안 씀'을 처리 전·후 모두 같은 아이콘·색·한 줄 설명으로 보여 줘요.
  const FX = {
    del:   { cls:'del',   icon:() => ICON_DEL,   todo:'삭제돼요',       done:'삭제됨',       line:'지우면 다시 볼 수 없어요' },
    block: { cls:'block', icon:() => ICON_BLOCK, todo:'답변에만 안 써요', done:'답변에만 안 씀', line:'원본은 그대로 두고 답변에만 안 써요' },
  };
  const fxOf = id => A_ITEMS[id].src === 'memory' ? 'del' : 'block';
  // 출처별 건수 요약: '메모리 2 · Gmail 1 · 캘린더 2'
  function srcCounts(ids){
    const n = {}; ids.forEach(id => { const k = A_ITEMS[id].src; n[k] = (n[k] || 0) + 1; });
    return ['memory', 'gmail', 'calendar'].filter(k => n[k]).map(k => `${REF_NAME[k]} ${n[k]}`).join(' · ');
  }
  // 고른 항목을 처리하면 어떻게 되는지 한 줄로: '메모리 2건 삭제 · 3건 답변에만 안 씀'
  function effectText(ids, done){
    const d = ids.filter(id => fxOf(id) === 'del').length, b = ids.length - d, out = [];
    if(d) out.push(I18n.t(`메모리 ${d}건 ${done ? '삭제됨' : '삭제'}`));
    if(b) out.push(I18n.t(`${b}건 답변에만 안 씀`));
    return out.join(' · ');
  }
  function fxLine(kind, ids, done){
    if(!ids.length) return '';
    const f = FX[kind];
    return `<div class="fx-line ${f.cls}${done ? ' is-done' : ''}"><span class="fx-ic">${f.icon()}</span><div class="fx-text"><div class="fx-t1"><b>${esc(I18n.t(done ? f.done : f.todo))}</b><span class="fx-src">${esc(I18n.t(srcCounts(ids)))}</span></div><div class="fx-t2">${esc(I18n.t(f.line))}</div></div></div>`;
  }
  // v31 D7: 출처 확인과 개인 인텔리전스에서 바꾼 것을 한곳에 모아 보여 줘요.
  function changeLog(){
    const via = memState.via || {}, groups = { sheet: [], pi: [] };
    const done = Object.keys(memState.done || {}).filter(id => A_ITEMS[id]);
    ['sheet', 'pi'].forEach(w => {
      const ids = done.filter(id => (via[id] || 'sheet') === w);
      const del = ids.filter(id => fxOf(id) === 'del').length + (w === 'pi' ? Object.keys(memState.a4 || {}).length : 0);
      const blk = ids.filter(id => fxOf(id) === 'block');
      if(w === 'pi' && memState.all) groups.pi.push(['del', '메모리 전체 삭제됨']);
      else if(del) groups[w].push(['del', `메모리 ${del}건 삭제됨`]);
      if(blk.length) groups[w].push(['block', `${srcCounts(blk)} 답변에만 안 씀`]);
      Object.keys(refState).filter(k => !refState[k] && (refVia[k] || 'sheet') === w && !(k === 'memory' && memState.all)).forEach(k => groups[w].push(['off', `${REF_NAME[k]} 연동 끔`]));
    });
    const rows = ['sheet', 'pi'].map(w => groups[w].map(([k, t]) => `<div class="ch-row ${k}"><span class="fx-ic">${k === 'del' ? ICON_DEL : ICON_BLOCK}</span><span>${esc(I18n.t(t))}</span>${w === 'pi' ? `<span class="ch-where">${esc(I18n.t('개인 인텔리전스에서'))}</span>` : ''}</div>`).join('')).join('');
    return rows ? `<div class="ch-log"><div class="ch-title">${esc(I18n.t('변경 내역'))}</div>${rows}</div>` : '';
  }
  // 효과 패널: 처리 전에는 '무엇이 어떻게 되는지', 처리 후에는 같은 자리에서 개수 칩 + 과거형(출처 확인 · 개인 인텔리전스 처리 합산)
  let fxSig = '', fxFlashAt = 0;
  // 효과 표시(출처 시트 패널 · 과제 2 카드 공통): 한 줄에 하나씩 '아이콘 · 효과 · 건수 / 이유'. 건수 칩은 처리 전 외곽선 → 처리 후 연한 바탕
  // 남겨 둠: 점선 원(그냥 원은 글자 O처럼 읽혀서) · 다른 아이콘과 같은 선 굵기
  const ICON_KEEP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3.2 2.7" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/></svg>';
  const fxCnt = (kind, n, done) => `<span class="fx-cnt ${kind}${done ? ' done' : ''}">${esc(n)}</span>`;
  const fxStack = rows => `<div class="fxs">${rows.map(([kind, title, n, sub, done]) => `<div class="fxs-row ${kind}"><span class="fxs-ic">${kind === 'del' ? ICON_DEL : kind === 'block' ? ICON_BLOCK : ICON_KEEP}</span><div class="fxs-text"><div class="fxs-h"><b>${esc(I18n.t(title))}</b>${n ? fxCnt(kind, n, done) : ''}</div><div class="fxs-sub">${esc(I18n.t(sub))}</div></div></div>`).join('')}</div>`;
  const fxChip = (kind, n, done) => `<span class="fx-chip2 ${kind}${done ? ' done' : ''}">${kind === 'del' ? ICON_DEL : kind === 'block' ? ICON_BLOCK : '<span class="keep-dot"></span>'}${n ? `<span>${esc(n)}</span>` : ''}</span>`;
  function effectPanel(){
    const via = memState.via || {}, a4n = Object.keys(memState.a4 || {}).length;
    const done = Object.keys(memState.done || {}).filter(id => A_ITEMS[id]);
    const del = done.filter(id => fxOf(id) === 'del').length + a4n, blk = done.filter(id => fxOf(id) === 'block').length;
    const off = Object.keys(refState).filter(k => !refState[k] && REF_NAME[k] && !(k === 'memory' && memState.all));
    const fromPi = done.some(id => via[id] === 'pi') || a4n || memState.all || off.some(k => refVia[k] === 'pi');
    const any = memState.all || del || blk;
    // 처리 직후 화면을 연달아 다시 그려도(applyMemory · applyRefs) 비춤이 남도록 바뀐 순간부터 0.3초 안의 그림에 flash를 붙여요
    const sig = [memState.all ? 'all' : del, blk].join('/'); if(any && fxSig !== sig) fxFlashAt = Date.now(); fxSig = sig;
    const flash = !!any && Date.now() - fxFlashAt < 300;
    const notes = off.map(k => I18n.t(`${REF_NAME[k]} 연동 끔`)).concat(fromPi ? [I18n.t('개인 인텔리전스에서 한 처리 포함')] : []);
    const delN = memState.all ? I18n.t('전체') : del ? I18n.t(`${del}건`) : '';
    return `<div class="fx-panel${any ? ' after' : ''}${flash ? ' flash' : ''}">` + fxStack([
      ['del', delN ? '삭제됨' : '삭제돼요', delN, '메모리는 다시 볼 수 없어요', true],
      ['block', blk ? '답변에만 안 씀' : '답변에만 안 써요', blk ? I18n.t(`${blk}건`) : '', 'Gmail·캘린더는 원본 그대로', true],
    ]) + (memState.all || del || Object.keys(a3Sel).some(id => a3Sel[id] && A_ITEMS[id] && fxOf(id) === 'del') ? retFoot() : '') + '</div>' + (notes.length ? `<div class="fxp-note">${notes.map(esc).join(' · ')}</div>` : '');
  }
  // 처리 줄 왼쪽: 고른 효과를 다른 화면과 같은 효과 알약(아이콘 + 건수)으로. 건수 합은 버튼('N건 처리')에만
  function fxSelChips(ids){
    const d = ids.filter(id => fxOf(id) === 'del').length, b = ids.length - d;
    return (d ? fxChip('del', I18n.t(`${d}건`), true) : '') + (b ? fxChip('block', I18n.t(`${b}건`), true) : '');
  }
  // 고른 것의 효과: '2건 삭제 · 3건 답변에만 안 씀' (개수만 효과 색)
  function fxCounts(ids){
    const d = ids.filter(id => fxOf(id) === 'del').length, b = ids.length - d, out = [];
    if(d) out.push(`<b class="fx-n del">${esc(I18n.t(`${d}건`))}</b> ${esc(I18n.t('삭제'))}`);
    if(b) out.push(`<b class="fx-n block">${esc(I18n.t(`${b}건`))}</b> ${esc(I18n.t('답변에만 안 씀'))}`);
    return out.join(' · ');
  }
  function renderA3(){
    if(!memState || !refState) return;
    const body = $('#a3Body'), foot = $('#a3Foot'); if(!body || !foot) return;
    const row = id => {
      const it = A_ITEMS[id], done = aDone(id), off = !done && aOff(id);
      const left = done || off ? '<span class="cb-done" aria-hidden="true"></span>'
        : `<div class="checkbox${a3Sel[id] ? ' checked' : ''} hot" role="checkbox" aria-checked="${!!a3Sel[id]}" data-tag="A3 항목 ${id}" onclick="event.stopPropagation(); App.a3Pick('${id}')">${CHECK_TXT}</div>`;
      const right = done ? `<span class="st-chip ${FX[fxOf(id)].cls}">${FX[fxOf(id)].icon()}${esc(I18n.t(FX[fxOf(id)].done))}</span>`
        : off ? `<span class="st-chip block">${esc(I18n.t('앱 꺼짐'))}</span>` : '';
      const fxTag = done || off ? '' : `<span class="li-dot">·</span><span class="li-fx ${FX[fxOf(id)].cls}">${esc(I18n.t(FX[fxOf(id)].todo))}</span>`;
      return `<div class="li-row${done || off ? ' done' : ' hot'}"${done || off ? '' : ` data-tag="A3 항목 줄 ${id}" onclick="App.a3Pick('${id}')"`}>${left}<div class="li-text"><div class="li-t1">${esc(I18n.t(it.text))}</div>${it.why ? `<div class="why">${esc(I18n.t(it.why))}</div>` : ''}</div></div>`;
    };
    const legend = Object.keys(A_ITEMS).some(id => !aHandled(id)) ? `<div class="fx-legend"><div class="fx-leg del">${ICON_DEL}<span>${esc(I18n.t('메모리는 삭제돼요. 다시 볼 수 없어요'))}</span></div><div class="fx-leg block">${ICON_BLOCK}<span>${esc(I18n.t('Gmail·캘린더는 답변에만 안 써요. 원본은 그대로예요'))}</span></div></div>` : '';
    body.innerHTML = effectPanel() + `<div class="ct-list">` + Object.keys(A_TOPICS).map(t => {
      const ids = aTopicIds(t), open = ids.filter(id => !aHandled(id)), picked = open.filter(id => a3Sel[id]).length;
      const handled = ids.filter(aHandled);
      // 처리한 것은 '처리함' 글자 대신 효과 패널·과제 2 결과와 같은 색 채운 효과 칩으로
      const dN = handled.filter(id => aDone(id) && fxOf(id) === 'del').length, bN = handled.length - dN;
      const st = picked && picked === open.length ? 'checked' : picked ? 'mixed' : '';
      const left = !open.length ? '<span class="cb-done" aria-hidden="true"></span>'
        : `<div class="checkbox ${st} hot" role="checkbox" aria-checked="${st === 'checked'}" data-tag="A3 주제 ${t}" onclick="event.stopPropagation(); App.a3PickTopic('${t}')">${st === 'mixed' ? '' : CHECK_TXT}</div>`;
      // v31 D2: 주제를 펼치면 '무엇이 어떻게 되는지'를 칩 한 줄로만 보여 줘요. 긴 설명은 시트 맨 위에 한 번만.
      const chip = (kind, ids) => ids.length ? `<span class="fx-chip ${FX[kind].cls}">${FX[kind].icon()}<b>${esc(I18n.t(kind === 'del' ? '삭제' : '답변에만 안 씀'))}</b> ${esc(I18n.t(srcCounts(ids)))}</span>` : '';
      const fx = chip('del', open.filter(id => fxOf(id) === 'del')) + chip('block', open.filter(id => fxOf(id) === 'block'));
      return `<div class="ct-group${a3Open[t] ? ' open' : ''}${a3Detail[t] ? ' detail' : ''}">
        <div class="ct-head hot" data-tag="A3 주제 펼치기 ${t}" onclick="App.a3Expand('${t}')">${left}
          <div class="ct-text"><div class="ct-name"><span>${esc(I18n.t(A_TOPICS[t]))}</span>${open.length ? `<span class="ct-count">${esc(I18n.t(`${open.length}건`))}</span>` : ''}${dN ? fxChip('del', I18n.t(`${dN}건`), true) : ''}${bN ? fxChip('block', I18n.t(`${bN}건`), true) : ''}</div><div class="ct-t2">${esc(I18n.t(srcCounts(ids)))}</div></div>
          <span class="chevron"></span>
        </div>
        <div class="ct-items">
          <div class="ct-rows">${['memory', 'gmail', 'calendar'].map(k => { const g = ids.filter(id => A_ITEMS[id].src === k); return g.length ? `<div class="li-src"><span class="li-app">${aIcon(k)}</span><span>${esc(REF_NAME[k])}</span><span class="li-src-n">${g.length}</span></div>` + g.map(row).join('') : ''; }).join('')}</div>
        </div>
      </div>`;
    }).join('') + `</div>`;
    const selIds = Object.keys(a3Sel).filter(id => a3Sel[id] && !aHandled(id)), n = selIds.length;
    // 앱 연동 설정 줄은 A4 개인 인텔리전스 줄과 같은 모양(이름 + 상태 한 줄 · 끄면 '연동 끔'). 뜻도 같아요: 앱 전체 설정(toggleRef)
    const appSub = { gmail:'메일 130건', calendar:'일정 36건', memory: ($('#a4MemCount')?.textContent || '11건') };
    const apps = ['gmail', 'calendar', 'memory'].map(k => `<div class="ct-app${refState[k] ? '' : ' ref-off'}">${aIcon(k)}
        <div class="ct-text"><div class="ct-t1">${REF_NAME[k]}<span class="ref-off-badge">${esc(I18n.t('연동 끔'))}</span></div><div class="ct-t2">${esc(I18n.t(appSub[k]))}</div></div>
        <div class="toggle${refState[k] ? ' on' : ''} hot" data-ref="${k}" data-tag="${REF_NAME[k]} 전체 차단" role="switch" aria-checked="${refState[k]}" onclick="App.toggleRef('${k}')"><div class="knob"></div></div>
      </div>`).join('');
    // 처리 버튼 옆에 '고른 것이 어떻게 되는지'를 미리 보여 줘요(D1).
    const allDone = Object.keys(A_ITEMS).every(aHandled);
    // 처리 직후 8초는 아래 줄이 '무엇이 처리됐는지 + 되돌리기'로 바뀌어요(떠 있는 알림이 시트 내용을 가리지 않게).
    // 모두 처리한 뒤에는 아래 줄을 숨겨요(결과는 맨 위 '변경 내역'에 있어요).
    const bar = $('#a3Bar');
    if(bar) bar.hidden = !a3Notice && allDone;
    if(bar) bar.innerHTML = a3Notice ? `<div class="ct-foot ct-foot-notice"><div class="ct-sel-wrap"><span class="ct-notice-msg">${esc(a3Notice)}</span></div><span class="ct-act"><button type="button" class="text-btn ct-undo hot" data-tag="A3 되돌리기" onclick="App.undoDelete()">${esc(I18n.t('되돌리기'))}</button></span></div>`
      : allDone ? '' : `<div class="ct-foot"><div class="ct-sel-wrap">${n ? fxSelChips(selIds) : `<span class="ct-sel ct-hint">${esc(I18n.t('골라 주세요'))}</span>`}</div>
      <span class="ct-act"><button class="pill-btn hot" id="a3Process" data-tag="A3 선택 처리" onclick="App.a3Process()" ${n ? '' : 'disabled'}>${esc(I18n.t(n ? `${n}건 처리` : '처리'))}</button></span></div>`;
    foot.innerHTML = `      <div class="ct-apps${a3AppsOpen ? ' open' : ''}">
        <div class="ct-apps-head hot" data-tag="A3 앱 연동 설정 펼치기" onclick="App.a3Apps()"><span>${esc(I18n.t('앱 연동 설정'))}</span><span class="chevron"></span></div>
        <div class="ct-apps-body"><p class="ct-apps-note">${esc(I18n.t('끄면 그 앱 정보 전체를 답변에 쓰지 않아요. 메일·일정 원본은 그대로예요'))}</p>${apps}</div>
      </div>`;
  }
  function a3DetailToggle(t){ a3Detail[t] = !a3Detail[t]; Logger.log('a3_detail', { step: current, topic: t, open: a3Detail[t] }); renderA3(); }
  function a3Expand(t){ a3Open[t] = !a3Open[t]; Logger.log('a3_expand', { step: current, topic: t, open: a3Open[t] }); renderA3(); }
  function a3Apps(){ a3AppsOpen = !a3AppsOpen; Logger.log('a3_apps_open', { step: current, open: a3AppsOpen }); renderA3(); }
  function a3PickTopic(t){
    const open = aTopicIds(t).filter(id => !aHandled(id)), all = open.every(id => a3Sel[id]);
    open.forEach(id => a3Sel[id] = !all);
    Logger.log('a3_pick_topic', { step: current, topic: t, on: !all }); renderA3();
  }
  function a3Pick(id){ if(aHandled(id)) return; a3Sel[id] = !a3Sel[id]; Logger.log('a3_pick', { step: current, id, on: a3Sel[id] }); renderA3(); }
  function a3Process(){
    const ids = Object.keys(a3Sel).filter(id => a3Sel[id] && !aHandled(id));
    if(!ids.length) return;
    lastUndo = { mem: JSON.parse(JSON.stringify(memState)), ref: refState.memory };
    memState.via = memState.via || {};
    ids.forEach(id => { memState.done[id] = true; memState.via[id] = 'sheet'; });
    memState.used = memDeletedN() > 0;
    a3Sel = {};
    Logger.log('a3_process', { step: current, ids });
    applyMemory(); applyRefs();
    // v31 D1: 무엇이 지워졌고 무엇이 답변에서만 빠졌는지 알림에서도 나눠서 보여 줘요.
    showSnackbar(I18n.t(`${ids.length}건을 처리했어요`));
  }
  function deleteMemory(scope, ev){
    if(ev) ev.stopPropagation();
    lastUndo = { mem: JSON.parse(JSON.stringify(memState)), ref: refState.memory };
    if(scope === 'all'){ memState.all = true; memState.used = true; refState.memory = false; refVia.memory = 'pi'; }
    applyMemory(); applyRefs();
    Logger.log('delete', { step: current, target: 'memory', scope });
    showSnackbar(I18n.t('메모리 전체 삭제됨'));
  }

  // A4에서 메모리 한 건만 지우기(정민 메모리는 출처 시트 처리 상태와 같게 맞춰요)
  function deleteMemoryItem(id, ev){
    if(ev) ev.stopPropagation();
    if(memState.all || memGone(id)) return;
    lastUndo = { mem: JSON.parse(JSON.stringify(memState)), ref: refState.memory };
    if(A_ITEMS[id]){ memState.done[id] = true; memState.via = memState.via || {}; memState.via[id] = 'pi'; } else { memState.a4 = memState.a4 || {}; memState.a4[id] = true; }
    memState.used = true;
    applyMemory(); applyRefs();
    Logger.log('delete', { step: current, target: 'memory', scope: 'item', id });
    showSnackbar(I18n.t('메모리 1건 삭제됨'));
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
    const a4Mem = $('#a4MemCount').closest('.conn-wrap');
    a4Mem.classList.toggle('deleted', memState.all);
    if(memState.all) a4Mem.classList.remove('open');
    $('#a4MemCount').textContent = memState.all ? '' : `${11 - memDeletedN() - Object.keys(memState.a4 || {}).length}건`;
    renderA4More();
    renderA3();
    renderA2Notice();
    window.Interactions?.sync();
  }

  // A4 목록: 월별로 묶어 보여 주고 '+N건 더보기'로 10건씩 펼쳐요. 메모리는 항목마다 지울 수 있어요.
  const A4_MEM = [
    ['a_mem_truffle', '2025.3.14 Gemini 채팅에서 "정민과 트러플 리조또" 언급'], ['m_hike', '2025.2.8 Gemini 채팅에서 "주말 등산 코스" 언급'],
    ['m_pilates', '2025.2.1 Gemini 채팅에서 "회사 근처 필라테스" 언급'], ['a_mem_jazz', '2025.1.20 Gemini 채팅에서 "정민이 좋아하던 재즈바" 언급'],
    ['m_gift', '2025.1.12 Gemini 채팅에서 "부모님 결혼기념일 선물" 언급'], ['m_jeju', '2024.12.24 Gemini 채팅에서 "연말 제주 여행 일정" 언급'],
    ['m_cat', '2024.12.3 Gemini 채팅에서 "고양이 사료 브랜드" 언급'], ['m_job', '2024.11.18 Gemini 채팅에서 "이직 준비 포트폴리오" 언급'],
    ['m_halloween', '2024.10.30 Gemini 채팅에서 "할로윈 파티 의상" 언급'], ['m_camp', '2024.10.2 Gemini 채팅에서 "가을 캠핑 장비" 언급'],
    ['m_train', '2024.9.14 Gemini 채팅에서 "추석 기차표 예매" 언급'] ];
  const memGone = id => (A_ITEMS[id] ? aDone(id) : !!(memState.a4 && memState.a4[id]));
  const A4_POOL = {
    memory: () => A4_MEM.filter(([id]) => !memGone(id)).map(([id, text]) => ({ id, text })),
    gmail: () => {
      const t = ['[쿠팡] 주문하신 상품이 배송 완료되었습니다', '[카카오뱅크] 이번 달 카드 이용 내역 안내', '[무신사] 주문이 접수되었습니다', '[CGV] 예매가 완료되었습니다',
        '[스시타로] 오마카세 예약 확인', '[배달의민족] 주문하신 음식이 출발했어요', '[네이버페이] 결제가 완료되었습니다', '[인터파크] 공연 예매 확인',
        '[SRT] 승차권 예매 내역', '[올리브영] 주문 상품 발송 안내', '[당근] 거래 후기가 도착했어요', '[야놀자] 숙소 예약이 확정되었습니다'];
      const gen = Array.from({ length: 128 }, (_, n) => { const d = new Date(2025, 2, 12 - n * 3); return { text: t[n % t.length], dt: `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}` }; });
      return [{ text:'[톨로 비스트로] 예약이 확정되었습니다', dt:'2025.3.15 19:00, 2명' }].concat(gen.slice(0, 7), [{ text:'[대한항공] 예약이 확정되었습니다', dt:'2025.2.20 인천→제주' }], gen.slice(7));
    },
    calendar: () => {
      const t = ['팀 주간 회의', '치과 정기 검진', '헬스 PT', '엄마 생신', '프로젝트 마감', '대학 동기 모임', '정민이랑 영화', '자동차 정기 점검', '독서 모임'];
      const gen = Array.from({ length: 34 }, (_, n) => { const d = new Date(2025, 2, 18 - n * 9); return { text: `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} 일정 "${t[n % t.length]}"` }; });
      return [{ text:'2025.3.20 일정 "치과 예약"' }, gen[0], { text:'2025.3.15 일정 "정민과 저녁"' }].concat(gen.slice(1));
    },
  };
  const A4_FIRST = 2;   // 펼쳤을 때 처음 보이는 건수
  const monthOf = it => { const m = (it.dt || it.text).match(/^(\d{4})\.(\d{1,2})/); return m ? `${m[1]}년 ${+m[2]}월` : ''; };
  const TRASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
  function a4Rest(btn){ return A4_POOL[btn.dataset.src]().length - Math.max(A4_FIRST, +btn.dataset.shown || 0); }
  function renderA4More(){
    $$('.screen[data-step="A4"] .chip-more[data-src]').forEach(btn => {
      const src = btn.dataset.src, list = A4_POOL[src](), shown = Math.min(Math.max(A4_FIRST, +btn.dataset.shown || 0), list.length);
      btn.parentElement.querySelectorAll('.data-chip.gen, .a4-month').forEach(el => el.remove());
      let month = '';
      list.slice(0, shown).forEach(it => {
        const m = monthOf(it);
        if(m && m !== month){ month = m; const h = document.createElement('div'); h.className = 'a4-month'; h.textContent = m; btn.before(h); }
        const d = document.createElement('div'); d.className = 'data-chip gen' + (src === 'memory' ? ' mem-row' : '');
        // 긴 문장 대신 제목 + 회색 한 줄(날짜·출처)
        const mm = it.text.match(/^(\d{4}\.\d{1,2}\.\d{1,2}) Gemini 채팅에서 "(.+)" 언급$/), cm = it.text.match(/^(\S+) 일정 "(.+)"$/);
        const t1 = mm ? `"${mm[2]}"` : cm ? `"${cm[2]}"` : it.text, t2 = mm ? `Gemini 채팅, ${mm[1]}` : cm ? cm[1] : (it.dt || '');
        d.innerHTML = `<span class="a4-t">${esc(t1)}${t2 ? `<span class="dt">${esc(t2)}</span>` : ''}</span>`
          + (src === 'memory' ? `<button type="button" class="mem-del hot" data-tag="A4 메모리 1건 삭제 ${it.id}" data-label="이 메모리 삭제" onclick="App.deleteMemoryItem('${it.id}', event)">${TRASH}</button>` : '');
        btn.before(d);
      });
      const rest = list.length - shown;
      btn.hidden = list.length <= A4_FIRST;
      btn.textContent = rest > 0 ? I18n.t(`+ ${rest}건 더보기`) : I18n.t('접기');
    });
  }
  function a4More(btn){
    const rest = a4Rest(btn);
    btn.dataset.shown = rest > 0 ? Math.max(A4_FIRST, +btn.dataset.shown || 0) + 10 : 0;
    renderA4More();
    Logger.log('more', { step: current, src: btn.dataset.src, open: rest > 0, shown: +btn.dataset.shown });
  }

  let a3Notice = '';
  function showSnackbar(msg){
    clearTimeout(undoTimer);
    if($('#sheetOverlay.active') && current === 'A3' && lastUndo){
      // 출처 시트 안에서는 떠 있는 알림 대신 아래 처리 줄에 보여 줘요
      a3Notice = msg; renderA3();
      undoTimer = setTimeout(() => { lastUndo = null; a3Notice = ''; renderA3(); }, 8000);
      return;
    }
    const bar = $('#snackbar');
    bar.querySelector('.snackbar-msg').textContent = msg;
    $('#snackUndo').hidden = false;
    const a3Bar = $('#sheetOverlay.active #a3Bar');
    bar.style.bottom = a3Bar ? `${a3Bar.offsetHeight + 12}px` : '';
    bar.classList.add('show');
    undoTimer = setTimeout(() => { lastUndo = null; hideSnackbar(); }, 8000);
  }
  function hideSnackbar(){ $('#snackbar').classList.remove('show'); $('#snackUndo').hidden = false; if(a3Notice){ a3Notice = ''; renderA3(); } }
  // 실행취소 없이 잠깐 보이는 안내
  function showToast(msg){
    showSnackbar(msg); lastUndo = null; $('#snackUndo').hidden = true;
  }
  // 출처 패널에서 바꾼 게 있으면, 닫았을 때 바로 알려 주고 답변 아래 변경 안내로 데려가요.
  function afterSheetClose(){
    const changed = sheetBefore !== null && sheetBefore !== JSON.stringify({ refState, memState });
    sheetBefore = null;
    if(!changed) return;
    showToast(I18n.t('설정이 바뀌었어요. 다음 답변부터 반영돼요'));
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
  const B1_INTENT = /쓰이지\s?않|쓰이지\s?마|안\s?쓰이|사용하지\s?않|사용하지\s?마|쓰지\s?말|나오지\s?않|나오지\s?마|안\s?나오|참조하지|언급하지|지워|지우|삭제|잊어|잊게|빼|없애|안\s?쓰|쓰지\s?마|쓰지\s?않|기억하지|기억\s?말|정리|숨겨|차단|하지\s?마|꺼내지|말하지|언급\s?(?:금지|말|안)|얘기\s?(?:하지|말|안|그만)|그만|forget|delete|remove|erase|stop\s+using|don'?t\s+use|don'?t\s+(?:mention|bring\s+up)|stop\s+mentioning/i;
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
    Logger.log('b1_request', { step: current, text, clarifiedBefore: b1Asks.length, mode: B_MODE });
    syncB1();
    b1Input.blur();
    if(B_MODE !== 'direct'){ setDefaultChecks(); b2View = B_MODE === 'list' ? 'detail' : 'summary'; renderB2View(); go('B2', 'b1-send'); return; }
    // 바로 처리: 확인이 필요한 정보(송금·입금)만 빼고 처리한 뒤 결과를 보여 줘요. 고치려면 결과 카드의 '자세히 고르기'.
    setDefaultChecks();
    b2Result = currentSelection(); b2Detail = b2ItemState();
    Logger.log('b2_process', { step: current, selected: b2Result, items: b2Detail, how: 'direct' });
    renderB3B4();
    go('B3', 'b1-direct');
  }
  // 요약 카드 ↔ 자세히 고르기 목록
  function renderB2View(){
    const card = $('.screen[data-step="B2"] .ai-card'); if(!card) return;
    card.classList.toggle('detail', b2View === 'detail');
    const btn = $('#b2DetailBtn'); if(btn) btn.textContent = I18n.t(b2View === 'detail' ? '목록 접기' : '직접 고르기');
  }
  function toggleB2Detail(){ b2View = b2View === 'detail' ? 'summary' : 'detail'; renderB2View(); Logger.log('b2_view', { step: current, view: b2View }); }
  // 지금 체크 상태를 효과별로 묶어요: memory(삭제) / gmail·calendar·hold(답변에만 안 씀)
  function groupState(st){
    const g = {};
    b2Items().forEach((cb, i) => { const k = cb.dataset.hold ? 'hold' : cb.dataset.isrc; g[k] = g[k] || { on:0, all:0 }; g[k].all++; if(st[i]) g[k].on++; });
    return g;
  }
  const B_NAME = { memory:'메모리', gmail:'Gmail', calendar:'캘린더', hold:'송금·입금 메일' };
  // 과제 2 카드 공통: '처리할 것(처리함)' 묶음 + '남겨 둘 것' 예외. 개수는 효과 칩(승인 전 외곽선, 처리 후 색 채움)
  function fxRow(kind, n, label, sub, done, action){
    return `<div class="fxr ${kind}"><div class="fxr-text"><div class="fxr-h">${fxChip(kind, I18n.t(`${n}건`), done)}<b>${esc(I18n.t(label))}</b></div><div class="fxr-sub">${esc(I18n.t(sub))}</div></div>${action || ''}</div>`;
  }
  function blockSub(g){
    const names = [...new Set(['gmail', 'hold', 'calendar'].filter(k => g[k] && g[k].on).map(k => k === 'calendar' ? '캘린더' : 'Gmail'))];
    return names.join('·') + (names[names.length - 1] === '캘린더' ? '는' : '은') + ' 원본 그대로';
  }
  // 과제 2 카드(B2 요약 · B3 결과 같은 틀): 삭제 / 답변에만 안 씀 / 남겨 둠 세 줄(합 = 제목 건수) + 보관 안내. 처리 전후는 제목 · 줄 글자 · 버튼만 바뀜
  function fxGroups(g, done){
    const blkN = ['gmail', 'calendar', 'hold'].reduce((s, k) => s + (g[k] ? g[k].on : 0), 0);
    const left = ['memory', 'gmail', 'calendar', 'hold'].filter(k => g[k] && g[k].on < g[k].all);
    const leftN = left.reduce((s, k) => s + g[k].all - g[k].on, 0), holdOnly = left.length === 1 && left[0] === 'hold';
    const rows = [];
    if(g.memory && g.memory.on) rows.push(['del', done ? '삭제됨' : '삭제돼요', I18n.t(`${g.memory.on}건`), '메모리는 다시 볼 수 없어요', done]);
    if(blkN) rows.push(['block', done ? '답변에만 안 씀' : '답변에만 안 써요', I18n.t(`${blkN}건`), blockSub(g), done]);
    if(leftN) rows.push(['keep', done ? '남겨 둠' : '남겨 둬요', I18n.t(`${leftN}건`), holdOnly ? '돈이 오간 송금·입금 메일' : '고르지 않은 정보는 계속 답변에 쓰일 수 있어요', done]);
    let html = rows.length ? fxStack(rows) : '';
    // 보관 안내는 처리 전(요약)에도 같은 자리에: 지우기 전에 알아야 할 정보
    if(g.memory && g.memory.on) html += retFoot();
    return html;
  }
  function renderB2Summary(){
    const box = $('#b2Summary'); if(!box) return;
    box.innerHTML = fxGroups(groupState(b2ItemState()), false);
  }
  // 기본 선택: 확인이 필요한 정보(data-hold)는 빼고 모두
  function setDefaultChecks(){ b2Items().forEach(cb => cb.classList.toggle('checked', !cb.dataset.hold)); syncSelectAll(); }
  b1Input.addEventListener('input', syncB1);
  b1Input.addEventListener('keydown', e => { if(e.key === 'Enter' && !e.isComposing){ e.preventDefault(); sendB1(); } });

  /* ---------------- B2 ~ B4 (채팅 자연어 삭제) ---------------- */
  const b2Boxes = () => $$('.screen[data-step="B2"] .check-item .checkbox[data-src]');

  const b2Items = k => $$(`.screen[data-step="B2"] .checkbox[data-isrc${k ? `="${k}"` : ''}]`);
  const headItems = head => $$('.checkbox[data-isrc]', head.closest('.check-item'));   // 출처 체크박스는 자기 묶음만
  function toggleCheckItem(el){
    if($('#b2ProcessBtn').classList.contains('busy')) return;
    const items = headItems(el), next = !items.every(b => b.classList.contains('checked'));
    items.forEach(b => b.classList.toggle('checked', next));
    syncSelectAll();
    Logger.log('check', { step: current, src: el.dataset.src, checked: next });
  }
  // 항목 하나만 고르거나 빼기
  function toggleB2Item(el){
    if($('#b2ProcessBtn').classList.contains('busy')) return;
    el.classList.toggle('checked');
    syncSelectAll();
    Logger.log('check_item', { step: current, src: el.dataset.isrc, item: +el.dataset.item, checked: el.classList.contains('checked') });
  }
  function toggleSelectAll(el){
    if($('#b2ProcessBtn').classList.contains('busy')) return;
    const next = !b2Items().every(b => b.classList.contains('checked'));
    b2Items().forEach(cb => cb.classList.toggle('checked', next));
    syncSelectAll();
    Logger.log('check_all', { step: current, checked: next });
  }
  function syncSelectAll(){
    const items = b2Items();
    const all = items.every(b => b.classList.contains('checked'));
    const any = items.some(b => b.classList.contains('checked'));
    const selAll = $('.screen[data-step="B2"] .select-all-row .checkbox');
    selAll.classList.toggle('checked', all);
    selAll.textContent = all ? '✓' : '';
    selAll.classList.toggle('mixed', any && !all);
    selAll.setAttribute('aria-checked', all ? 'true' : any ? 'mixed' : 'false');
    items.forEach(b => { b.textContent = b.classList.contains('checked') ? '✓' : ''; b.setAttribute('aria-checked', String(b.classList.contains('checked'))); });
    b2Boxes().forEach(b => {
      const its = headItems(b), n = its.filter(x => x.classList.contains('checked')).length;
      b.classList.toggle('checked', n === its.length); b.classList.toggle('mixed', n > 0 && n < its.length);
      b.textContent = n === its.length ? '✓' : '';
      b.setAttribute('aria-checked', n === its.length ? 'true' : n ? 'mixed' : 'false');
      const sub = b.closest('.check-item-head')?.querySelector('.item-count');
      if(sub) sub.textContent = n === its.length || !n ? `${its.length}건` : `${its.length}건 중 ${n}건 선택`;
    });
    const holdSub = $('#holdSub');
    if(holdSub){ const on = items.some(b => b.dataset.hold && b.classList.contains('checked')); holdSub.className = 'ctext-sub ' + (on ? 'fx-block' : 'fx-keep'); holdSub.textContent = I18n.t(on ? '답변에만 안 써요' : '남겨 둬요'); }
    const holdChip = $('.hold-group .check-group-head .st-chip');
    if(holdChip){
      const on = items.some(b => b.dataset.hold && b.classList.contains('checked'));
      holdChip.className = 'st-chip ' + (on ? 'block' : 'keep');
      holdChip.innerHTML = on ? ICON_BLOCK + esc(I18n.t('답변에만 안 써요')) : esc(I18n.t('남겨 둬요'));
    }
    const picked = items.filter(b => b.classList.contains('checked')).length;
    $('#selectionCount').textContent = I18n.t(`선택 ${picked}건`);
    renderB2Summary();
    $('#b2ProcessBtn').textContent = b2ProcessLabel();
    $('#b2ProcessBtn').disabled = !any;
  }
  // 과제 1 처리 줄과 같은 문구: 'N건 처리', 아무것도 안 골랐으면 '처리'(꺼진 회색 버튼)
  function b2ProcessLabel(){
    const n = b2Items().filter(b => b.classList.contains('checked')).length;
    return I18n.t(n ? `${n}건 처리` : '처리');
  }

  function processB2(){
    const btn = $('#b2ProcessBtn');
    const sel = currentSelection();
    if(!Object.values(sel).some(Boolean) || btn.classList.contains('busy')) return;
    btn.classList.add('busy'); btn.textContent = '처리 중…'; btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    $('.screen[data-step="B2"] .ai-card').classList.add('processing');
    b2Items().forEach(box => box.setAttribute('aria-disabled', 'true'));
    Logger.log('b2_process', { step: current, selected: sel, items: b2ItemState(), how: b2Result ? 'detail' : 'list' });
    processTimer = setTimeout(() => {
      btn.classList.remove('busy'); btn.textContent = b2ProcessLabel();
      $('.screen[data-step="B2"] .ai-card').classList.remove('processing');
      b2Items().forEach(box => box.removeAttribute('aria-disabled'));
      if(current !== 'B2') return;
      b2Result = sel; b2Detail = b2ItemState();
      renderB3B4();
      go('B3', 'b2-process');
    }, 900);
  }
  // 목록에서 취소: 이미 처리한 결과가 있으면 그 상태로 결과 카드로, 아니면 채팅으로
  function cancelB2(){
    if(b2Result){ b2Items().forEach((cb, i) => cb.classList.toggle('checked', !!(b2Detail || [])[i])); syncSelectAll(); go('B3', 'b2-cancel'); }
    else go('B1', 'b2-cancel');
  }
  // 되돌리기: 처리한 것을 모두 원래대로 돌리고, 목록에서 다시 고를 수 있게 해요
  function undoB2(){
    Logger.log('b3_cancel', { step: current, selected: b2Result });
    b2Result = null; b2Detail = null;
    setDefaultChecks(); b2View = 'summary'; renderB2View();
    go('B2', 'b3-cancel');
  }
  function openB2Detail(){ b2View = 'detail'; renderB2View(); go('B2', 'b3-detail'); }
  // D6: 남겨 둔 송금·입금 메일도 결과 카드에서 바로 함께 처리
  function processHold(){
    b2Items().filter(cb => cb.dataset.hold).forEach(cb => cb.classList.add('checked')); syncSelectAll();
    b2Result = currentSelection(); b2Detail = b2ItemState();
    Logger.log('b3_hold_process', { step: current, selected: b2Result });
    renderB3B4();
  }

  const SRC = {
    memory:  { name:'메모리',   count:3,  del:true },
    gmail:   { name:'Gmail',    count:8,  del:false },
    calendar:{ name:'캘린더', count:9,  del:false },
  };
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
    Object.keys(SRC).forEach(k => sel[k] = b2Items(k).filter(b => b.classList.contains('checked')).length);
    return sel;
  }
  const b2ItemState = () => b2Items().map(b => b.classList.contains('checked'));

  var ICON_DEL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/></svg>';
  var ICON_BLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-2.6 3.7"/><path d="M6.6 6.6C4.3 8 2.7 10.1 2 12c1 2.5 5 7 10 7 1.7 0 3.2-.5 4.6-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  // B2 화면의 앱 아이콘을 복사해요(그라디언트 id는 화면마다 겹치지 않게 바꿔요).
  function srcIcon(k, sfx){
    const src = $(`.screen[data-step="B2"] [data-src="${k}"]`)?.closest('.check-item-head')?.querySelector('.icon-chip');
    if(!src) return '';
    return src.outerHTML.replace(/id="([^"]+)"/g, `id="$1_${sfx}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_${sfx})`).replace('icon-chip sm', 'icon-chip b3-ic');
  }
  function renderB3B4(){
    const sel = b2Result || currentSelection();
    // v31: 줄은 항목 단위 선택으로 계산해요(송금·입금 메일은 따로 한 줄).
    const st = b2Detail || b2ItemState(), g = groupState(st);
    const total = Object.values(g).reduce((a, x) => a + x.on, 0);
    $('#b3Lines').innerHTML = $('#b5Lines').innerHTML = fxGroups(g, true);
    const nDel = g.memory && g.memory.on ? 1 : 0;
    ['#b3Note', '#b5Note'].forEach(id => { const n = $(id); if(n) n.hidden = true; });
    { const n = $('#b4Note'); if(n) n.hidden = !nDel; }
    const all = Object.values(g).reduce((a, x) => a + x.all, 0);
    $('#b3Title').textContent = $('#b5Title').textContent = I18n.t(`정민 관련 정보 ${total}건을 처리했어요`);

    Object.keys(SRC).forEach(k => {
      const item = $(`.screen[data-step="B4"] [data-b4="${k}"]`);
      const d = $(`.screen[data-step="B4"] [data-b4d="${k}"]`);
      const two = (cls, ic, a, b) => `<span class="st-chip ${cls}">${ic}${a}</span><span class="b4-desc">${b}</span>`;
      if(!sel[k]){ d.innerHTML = two('keep', '', '그대로 유지됨', '계속 답변에 쓰일 수 있어요'); item.classList.remove('dim'); }
      else if(sel[k] < SRC[k].count){ d.innerHTML = two(SRC[k].del ? 'del' : 'block', SRC[k].del ? ICON_DEL : ICON_BLOCK, `${sel[k]}건 ${SRC[k].del ? '삭제됨' : '답변에 안 씀'}`, `나머지 ${SRC[k].count - sel[k]}건은 계속 답변에 쓰일 수 있어요`); item.classList.remove('dim'); }
      else if(SRC[k].del){ d.innerHTML = two('del', ICON_DEL, '삭제됨', '답변에 더 이상 쓰이지 않아요'); item.classList.remove('dim'); }
      else { d.innerHTML = two('block', ICON_BLOCK, '답변에 안 씀', '원본은 그대로, 앞으로 답변에 안 쓰여요'); item.classList.remove('dim'); }
    });
  }

  function applyAll(){
    clearFx();
    chat = { a2: [], b3: [] }; renderChat();
    svIdx = {};
    b1Input.value = ''; syncB1(); renderB1Thread();
    if($('.sv-opt')) renderSurvey();
    $$('.b2-more').forEach(el => el.hidden = true); renderMoreToggles();
    $$('.chip-more[data-src]').forEach(b => b.dataset.shown = 0); renderA4More();
    applyRefs(); fxSig = ''; applyMemory();
    setDefaultChecks();
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
      Logger.log('click', { step: current, tag, x, y }); M.lastClick = performance.now();
      // v31: 답변 배지 외에 다시 물어본 답변의 배지, 채팅 안내 버튼으로도 출처 확인을 열 수 있어요. 처음 연 경로를 같이 남겨요.
      if(/^출처 확인/.test(tag) && M.a2Enter && !M.sourceFoundMs){ M.sourceFoundMs = Math.max(0, Math.round(performance.now() - M.a2Enter)); M.sourcePath = tag; }
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
      ref: refState, refVia, mem: memState, a3: { open: a3Open, detail: a3Detail, apps: a3AppsOpen },
      checks: b2ItemState(),
      b2: b2Result, b2d: b2Detail,
      b1: { draft: b1Input.value, sent: b1Text, asks: b1Asks },
      more: $$('.b2-more').map(el => !el.hidden),
      sv: svDraft,
      chat: chat,
      c: window.TaskC ? TaskC.snapshot() : null,
      open: openables().map((el, i) => el.classList.contains('open') ? i : -1).filter(i => i >= 0),
      snack: bar.classList.contains('show') ? bar.querySelector('.snackbar-msg').textContent : '',
      hold: hold ? { kind: hold.kind, phase: hold.phase, next: hold.next, qs: hold.qs, i: hold.i, overlay: hold.overlay } : null,
      ask: askCur,
      scroll: scrollers().map(el => { const max = el.scrollHeight - el.clientHeight; return max > 0 ? +(el.scrollTop / max).toFixed(3) : 0; }),
    };
  }

  function applySnapshot(s){
    if(!s) return;
    clearFx();
    refState = Object.assign({ memory:true, gmail:true, calendar:true, photos:true }, s.ref);
    refVia = Object.assign({}, s.refVia || {});
    memState = Object.assign({ used:false, all:false, done:{}, a4:{}, via:{} }, s.mem); memState.done = Object.assign({}, memState.done); memState.a4 = Object.assign({}, memState.a4); memState.via = Object.assign({}, memState.via);
    if(s.a3){ a3Open = Object.assign({}, s.a3.open); a3Detail = Object.assign({}, s.a3.detail); a3AppsOpen = !!s.a3.apps; }
    b2Result = s.b2 || null; b2Detail = s.b2d || null;
    if(s.b1){ b1Input.value = s.b1.draft || ''; b1Text = s.b1.sent || ''; b1Asks = (s.b1.asks || []).slice(); syncB1(); renderB1Thread(); }
    if(s.more){ $$('.b2-more').forEach((el, i) => el.hidden = !s.more[i]); renderMoreToggles(); }
    svDraft = Object.assign({}, s.sv || {}); renderSurvey();
    chat = { a2: ((s.chat || {}).a2 || []).slice(), b3: ((s.chat || {}).b3 || []).slice() }; renderChat();
    if(s.c && window.TaskC) TaskC.apply(s.c);
    const checks = Array.isArray(s.checks) ? s.checks : null;
    b2Items().forEach((cb, i) => cb.classList.toggle('checked', checks ? !!checks[i] : !cb.dataset.hold));
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
    remoteAsk = s.ask || null; renderAskBanner(remoteAsk);
    remoteHold = s.hold || null; renderHold(remoteHold);
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
      A_sourcePath: M.sourcePath || null,
      A_hintShown: !!M.hintA,
      A_foundAfterHint: !!(M.hintA && M.sourceFoundMs && M.a2Enter && (M.a2Enter + M.sourceFoundMs) > M.hintA),
      A_visitedA4: ev.some(e => e.type === 'step' && e.step === 'A4'),
      A_memoryDeleted: memState.all ? 'all' : memDeletedN() ? `used(${memDeletedN()})` : 'none',
      A_itemsProcessed: Object.keys(memState.done || {}),
      A_a4MemDeleted: Object.keys(memState.a4 || {}),
      A_jmResult: (n => n === 5 ? '5건 모두' : n ? `일부(${n}건)` : '없음')(aTopicIds('jm').filter(aHandled).length),
      A_otherState: aTopicIds('taste').some(aHandled) ? '함께 막힘' : '그대로',
      A_refsFinal: Object.assign({}, refState),
      A_undoCount: count('undo'),
      order: SEQ,
      B_requestText: b1Text || null,
      B_clarifyCount: b1Asks.length,
      B_clarifiedTexts: b1Asks.slice(),
      B_moreOpened: ev.some(e => e.type === 'more' && e.open),
      B_processed: !!sel,
      B_mode: B_MODE,
      B_holdKept: sel ? b2Items().some((cb, i) => cb.dataset.hold && !(b2Detail || [])[i]) : null,
      B_detailOpened: ev.some(e => e.type === 'step' && e.step === 'B2' && e.via === 'b3-detail'),
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
    const offA = ['gmail', 'calendar', 'memory', 'photos'].filter(k => !refState[k]).map(k => LOG_NAME[k] + ' 끔');
    const memA = (memState.all ? ['Memory 전체 삭제'] : []).concat(Object.keys(memState.a4 || {}).map(id => `A4 메모리 ${id} 삭제`)).concat(Object.keys(memState.done || {}).map(id => `${A_ITEMS[id].label} ${A_ITEMS[id].src === 'memory' ? '삭제' : '차단'}`));
    out.A_action = memA.concat(offA).join(' · ') || '변경 없음';
    out.B_action = sel ? (Object.keys(SRC).filter(k => sel[k]).map(k => `${LOG_NAME[k]} ${sel[k]}/${SRC[k].count}건 ${SRC[k].del ? '삭제' : '차단'}`).join(', ') || '선택 없음') : '처리 안 함';
    out.viewport = Logger.active ? Logger.session.meta.viewport : null;
    out.resizes = ev.filter(e => e.type === 'resize').map(e => e.viewport);
    // 마지막 화면 체류 시간도 지금까지로 채워요.
    if(lastStep && Logger.active) dwell[lastStep] = (dwell[lastStep] || 0) + (ev[ev.length - 1].ms - lastMs);
    out.A_reask = chat.a2.length; out.B_reask = chat.b3.length;
    Object.assign(out, window.TaskC ? TaskC.summary() : {});
    out.C_taskSec = done('C') && done('C').taskMs != null ? +(done('C').taskMs / 1000).toFixed(1) : null;
    out.ids = resultIds(out);
    return out;
  }

  /* ---------------- 과제 직후 설문 (앱 안에서 참가자가 직접 응답) ---------------- */
  const S7 = [1, 2, 3, 4, 5, 6, 7], S5 = [1, 2, 3, 4, 5];
  const SURVEY = {
    A: { badge:'잠깐 설문', title:'저녁 약속 상황에 대해 알려 주세요', sub:'답변에 나온 정민 관련 정보를 확인하고 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'A-13', q:'정민 이야기가 나온 이유를 알아보고, 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'A-14', q:'정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'A-15', q:'앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'A-16', q:"'이 답변에 사용된 정보' 화면에서 보여준 정보의 양은 어땠나요?", scale:S7, lo:'너무 적음', hi:'너무 많음', mid:'4 = 적절함' },
    ]},
    B: { badge:'잠깐 설문', title:'채팅으로 정리한 상황에 대해 알려 주세요', sub:'채팅으로 요청해 정민 관련 정보를 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'B-10', q:'채팅으로 요청해서 정민 관련 정보를 처리하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'B-11', q:'정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'B-12', q:'앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고 얼마나 확신하시나요?', scale:S7, lo:'전혀 확신하지 않음', hi:'매우 확신함' },
      { id:'B-13', q:'Gemini가 보여준 정민 관련 정보 목록과 처리 결과의 정보 양은 어땠나요?', scale:S7, lo:'너무 적음', hi:'너무 많음', mid:'4 = 적절함' },
      { id:'B-14', q:'처리하기 전에 무엇이 처리될지 확인하는 과정은 얼마나 번거롭거나 수월했나요?', scale:S7, lo:'매우 번거로움', hi:'매우 수월함' },
    ]},
    C: { badge:'잠깐 설문', title:'이사 정보를 정리한 상황', sub:'답변에 섞여 있던 이사 관련 정보를 처리한 과정을 떠올리며 답해 주세요', items:[
      { id:'C-10', q:'이사 관련 정보를 골라서 앞으로 쓰이지 않게 하는 과정은 얼마나 어렵거나 쉬웠나요?', scale:S7, lo:'매우 어려움', hi:'매우 쉬움' },
      { id:'C-11', q:'이사 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고 생각하시나요?', choices:['예', '아니오', '모르겠음'] },
      { id:'C-12', q:'방금 처리로 무엇이 지워지거나 막혔고 무엇이 남았는지, 얼마나 확실히 아시나요?', scale:S7, lo:'전혀 모르겠음', hi:'매우 확실히 앎' },
    ]},
    S: { badge:'마지막 설문', title:'기능 전체에 대한 설문', sub:"여기서 '이 기능'은 오늘 써 본 정보 관리 기능 전체예요(답변 아래 출처 확인 화면, 채팅으로 요청). 각 문장에 얼마나 동의하는지 골라 주세요", items:[
      '이 기능을 자주 사용하고 싶다.', '이 기능은 쓸데없이 복잡하다.', '이 기능은 사용하기 쉽다.',
      '이 기능을 쓰려면 다른 사람의 도움이 필요할 것 같다.', '이 기능의 여러 부분이 자연스럽게 잘 연결되어 있다.', '이 기능에는 일관성이 없는 부분이 너무 많다.',
      '대부분의 사람들이 이 기능을 금방 익힐 것 같다.', '이 기능은 사용하기 번거롭다.', '이 기능을 자신 있게 사용할 수 있었다.',
      '이 기능을 쓰기 전에 배워야 할 것이 많았다.',
    ].map((q, i) => ({ id:`S-${String(i + 1).padStart(2, '0')}`, q, scale:S5, lo:'전혀 동의하지 않음', hi:'매우 동의함' })) },
    W: { badge:'마지막 질문', title:'마지막으로 세 가지만 여쭤볼게요', sub:'', items:[
      { id:'W-01', q:'오늘 써 본 기능들이 실제 Gemini에 있다면, Gemini가 내 정보를 답변에 쓰는 것이 지금보다 어떻게 느껴질 것 같나요?', choices:['더 안심돼요', '비슷해요', '더 불안해요'] },
      { id:'W-02', q:'오늘 전에, AI가 메모리나 다른 앱 정보를 답변에 쓴다는 걸 알고 계셨나요?', choices:['예', '아니오'] },
      { id:'W-03', q:'오늘 해 본 두 방법 중 더 편했던 것은 무엇인가요?', choices:['출처 확인 화면에서 고르기', '채팅으로 요청하기', '비슷해요'] },
    ]},
  };
  const SV_SECTION = { A:'저녁 약속 상황', B:'채팅으로 정리한 상황', C:'이사 정보 정리', S:'기능 전체에 대한 설문', W:'마지막 질문' };
  // 문항 단어는 그대로 두고 화면에서만 '맥락(회색) + 핵심 질문(굵게)'으로 나눠 보여 줘요(기록·엑셀은 전체 문장 q).
  const SV_SPLIT = {
    'A-13':['정민 이야기가 나온 이유를 알아보고, 앞으로 쓰이지 않게 하는 과정은', '얼마나 어렵거나 쉬웠나요?'],
    'A-14':['정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고', '생각하시나요?'],
    'A-15':['앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고', '얼마나 확신하시나요?'],
    'A-16':["'이 답변에 사용된 정보' 화면에서 보여준 정보의 양은", '어땠나요?'],
    'B-10':['채팅으로 요청해서 정민 관련 정보를 처리하는 과정은', '얼마나 어렵거나 쉬웠나요?'],
    'B-11':['정민 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고', '생각하시나요?'],
    'B-12':['앞으로 Gemini 답변에 정민 관련 정보가 나오지 않을 거라고', '얼마나 확신하시나요?'],
    'B-13':['Gemini가 보여준 정민 관련 정보 목록과 처리 결과의 정보 양은', '어땠나요?'],
    'B-14':['처리하기 전에 무엇이 처리될지 확인하는 과정은', '얼마나 번거롭거나 수월했나요?'],
    'C-10':['이사 관련 정보를 골라서 앞으로 쓰이지 않게 하는 과정은', '얼마나 어렵거나 쉬웠나요?'],
    'C-11':['이사 관련 정보가 앞으로 답변에 쓰이지 않게 됐다고', '생각하시나요?'],
    'C-12':['방금 처리로 무엇이 지워지거나 막혔고 무엇이 남았는지,', '얼마나 확실히 아시나요?'],
    'W-01':['오늘 써 본 기능들이 실제 Gemini에 있다면,', 'Gemini가 내 정보를 답변에 쓰는 것이 지금보다 어떻게 느껴질 것 같나요?'],
    'W-02':['오늘 전에,', 'AI가 메모리나 다른 앱 정보를 답변에 쓴다는 걸 알고 계셨나요?'],
  };
  const svQ = it => { const sp = SV_SPLIT[it.id] || (/^S-/.test(it.id) ? ['이 문장에 얼마나 동의하세요?', it.q] : [null, it.q]);
    return `<div class="sv-q"><span class="sv-full">${esc(it.q)}</span>${sp[0] ? `<span class="sv-ctx">${esc(sp[0])}</span>` : ''}<span class="sv-core">${esc(sp[1])}</span></div>`; };
  function buildSurveys(){
    const end = $('.screen[data-step="END"]');
    Object.keys(SURVEY).forEach(k => {
      const sv = SURVEY[k];
      const el = document.createElement('div');
      el.className = 'screen intro-screen survey-screen'; el.dataset.step = 'Q' + k;
      const total = sv.items.length;
      el.innerHTML = `<div class="survey-body">
        <div class="sv-top"><span class="sv-title">${esc(SV_SECTION[k] || sv.title)}</span><span class="sv-count" id="svCount${k}">1 / ${total}</span></div>
        <div class="sv-seg" id="svSeg${k}">${sv.items.map(() => '<i></i>').join('')}</div>
        ${sv.items.map((it, n) => `<div class="sv-item" data-sv="${k}" data-n="${n}">${svQ(it)}
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
      $$(`#svSeg${k} i`).forEach((s, n) => s.classList.toggle('on', n <= i));
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
    // SUS는 긍정·부정 문장이 섞여 있어서 자동으로 넘기지 않아요(직접 '다음').
    if(first && k && k !== 'S' && svIdx[k] < SURVEY[k].items.length - 1) svAuto = setTimeout(() => { if(current === 'Q' + k) surveyStep(k, 1); }, 320);
  }
  function submitSurvey(k){
    if(!surveyDone(k)) return;
    survey[k] = Object.fromEntries(SURVEY[k].items.map(it => [it.id, svDraft[it.id]]));
    Logger.log('survey', { step: current, key: k, answers: survey[k] });
    const next = k === 'W' ? 'END' : k === 'S' ? 'QW' : k === FIRST ? firstStep(SECOND) : k === SECOND ? (WITH_SUS ? 'QS' : 'QW') : (WITH_SUS ? 'QS' : 'QW');
    if(k === 'W') holdThen('wrap', 'W', next, 'survey');
    else if(k === 'A' || k === 'B') holdThen('post-survey', k, next, 'survey');
    else go(next, 'survey');
  }
  buildSurveys();

  /* ---------------- 결과 내보내기 (엑셀 '자동 수집' 시트에 붙여넣는 형식) ---------------- */
  const RESULT_IDS = ['A-03', 'A-11', 'A-13', 'A-14', 'A-15', 'A-16', 'A-19', 'A-20', 'A-21', 'B-01', 'B-03', 'B-06', 'B-07', 'B-10', 'B-11', 'B-12', 'B-13', 'B-14', 'B-16', 'B-17', 'L-01', 'L-02', 'L-03', 'L-04', 'L-05', 'L-06', 'C-05', 'C-15', 'C-06', 'C-09', 'C-07', 'C-08', 'C-10', 'C-11', 'C-12', 'L-07', 'L-08', 'W-01', 'W-02', 'W-03']
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
      'C-07': reachedC ? yn(sm.C_verify) : '',
      'A-19': reachedA ? sm.A_jmResult : '',
      'A-20': reachedA ? sm.A_otherState : '',
      'A-21': reachedA ? sm.A_reask : '',
      'C-08': sm.C_sourceSec ?? '',
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
    $('#lmOrder').value = 'ab';   // 순서는 모든 참가자 A→B로 고정 (P01, P02와 같게)
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


  /* ---------------- 진행자 질문 대기 화면 (참가자 모드) ----------------
     화면이 다음으로 바로 넘어가면 진행자가 말로 물을 틈이 없어서, 그 사이에 잠깐 멈춰요.
     과제 완료 직후(설문 전 질문), 과제 설문 직후(이해 질문·다음 과제 전 질문), 마지막 질문 직후(주관식). */
  const HOLD_TEXT = {
    'post-task':   { badge:'과제를 마쳤어요', title:'설문 전에 진행자가 질문을 하나 드릴 거예요', desc:"답하신 뒤 '계속'을 눌러 주세요." },
    'post-survey': { badge:'설문을 마쳤어요', title:'진행자가 몇 가지 질문을 드릴 거예요', desc:"다 답하신 뒤 '계속'을 눌러 주세요." },
    'wrap':        { badge:'거의 끝났어요', title:'마지막으로 진행자가 몇 가지 여쭤볼게요', desc:"다 답하신 뒤 '계속'을 눌러 주세요." },
  };
  /* v31: 필수 질문을 참가자 화면에 순서대로 하나씩 띄워요(프로토콜 '진행' 시트의 필수 질문과 같은 순서).
     참가자는 말로 답하고 '다음'을 눌러요. 진행자는 패널에서 지금 질문을 보고 필요하면 더 물어요.
     q = 참가자 화면 문장, m = 진행자 패널에만 보이는 메모(정답 · 기록 칸). when = 조건이 맞을 때만 물어요. */
  // 질문 문구 원칙: 한 번에 하나만 묻기 · 무엇을 답하면 되는지 분명하게 · 전제 깔지 않기 · 화면에 없는 말(토글·연동) 대신 참가자가 본 말 쓰기
  const offApps = () => Object.keys(refState).filter(k => !refState[k]).map(k => REF_NAME[k]);
  const ASK = {
    // '어떤 생각이 들었나요?'는 무엇을 답할지 막막해서, 경험(무엇을 말했나)과 신경 쓰이는 점(민감도)으로 나눠 구체적으로 물어요.
    intro:  [
      { id:'I-02', q:'AI 챗봇에 다른 사람 이야기나 약속처럼 개인적인 내용을 말해 본 적이 있나요? 있다면 어떤 내용이었나요?', m:'경험 유무와 내용 (없으면 "없다"로 넘어가기)' },
      { id:'I-02b', q:'AI에게 그런 이야기를 할 때 신경 쓰이는 점이 있나요? 있다면 무엇인가요?', m:'민감도 기준선 · 말해 본 적 없어도 답할 수 있게 현재형' },
    ],
    'a-first': [{ id:'A-01', q:'방금 답변을 보고 어떤 생각이 드세요?', m:'첫 반응만 듣고 넘어가기 · A-17 메모' }],
    'a-sheet': [{ id:'A-05', q:'이 화면을 보고, 어떻게 하실 생각이세요?', m:'조작 전 의도 · 이후 조작 중에는 묻지 않기 (A-05, A-06)' }],
    'post-task-A': [{ id:'A-12', q:'지금 정민과 관련된 정보는 어떻게 됐을 것 같나요?', m:'지워진 것 / 그대로 있는 것을 스스로 나눠 말하는지' }],
    'post-survey-A': [
      { id:'A-08', q:'처음 답변에 정민 이야기가 왜 나왔다고 생각하세요?' },
      { id:'A-09', when: () => offApps().length > 0, q: () => `아까 ${offApps().join(', ')} 스위치를 끄셨어요. 끄면 어떤 정보가 답변에 안 쓰이게 될까요?`, m:'정답: 앱 전체 · 스위치를 안 껐으면 이 질문은 안 나오고 "토글 안 씀"' },
      { id:'A-10', when: () => Object.keys(memState.done || {}).length + Object.keys(memState.a4 || {}).length > 0, q:"'삭제'로 처리한 것과 '답변에만 안 씀'으로 처리한 것은 어떻게 다를까요?", m:'정답: 삭제는 사라짐 · 답변에만 안 씀은 원본은 남고 답변에만 안 쓰임' },
    ],
    'pre-B': [{ id:'B-00', q:'실제 Gemini에서 정민 관련 정보가 앞으로 답변에 안 나오게 하고 싶다면, 어떻게 해 보실 것 같으세요?', m:'채팅 요청을 스스로 떠올리는지' }],
    'post-task-B': [{ id:'B-09', q:'지금 정민과 관련된 정보는 어떻게 됐을 것 같나요?', m:'지워진 것 / 그대로 있는 것을 스스로 나눠 말하는지' }],
    'post-survey-B': [{ id:'B-08', q:'Gmail과 캘린더에 있던 정민 관련 메일과 일정은 지금 어떻게 됐을 것 같나요?', m:'정답: 원본은 남고 답변에만 안 쓰임' }],
    wrap: [
      // 고른 답 두 개를 한 번에 묻지 않고 하나씩
      { id:'W-04', q: () => { const v = (survey.W || {})['W-01']; return v ? `방금 '${v}'를 고르셨어요. 왜 그렇게 느끼셨나요?` : '방금 고르신 첫 번째 답은 왜 그렇게 고르셨나요?'; } },
      { id:'W-04b', q: () => { const v = (survey.W || {})['W-03']; return v === '비슷해요' ? '두 방법이 비슷하다고 고르셨어요. 어떤 점에서 그렇게 느끼셨나요?' : v ? `'${v}'가 더 편하다고 고르셨어요. 어떤 점이 더 편했나요?` : '더 편했던 방법은 어떤 점이 편했나요?'; } },
      // 유도하지 않게: 헷갈린 순간이 있었다고 전제하지 않아요.
      { id:'W-05', q:'오늘 써 보면서 막히거나 헷갈린 순간이 있었나요? 있었다면 언제였나요?' },
      // 해결책 대신 좋았던 것·덜 쓸 것 같은 것을, 한 번에 하나씩
      { id:'W-07', q:'오늘 써 본 것 중 가장 좋았던 부분은 어디였나요? 왜 그런가요?' },
      { id:'W-07b', q:'반대로, 실제로는 잘 안 쓸 것 같은 부분이 있었나요? 있다면 왜 그런가요?' },
    ],
  };
  // 시간 남으면 묻는 선택 질문: 세션 시작부터 지난 시간이 기준보다 짧을 때만 붙여요(진행자 패널에 '(선택)')
  const mins = () => M.sessionStart ? (performance.now() - M.sessionStart) / 60000 : 0;
  const ASK_OPT = {
    intro: { within: 99, items: [{ id:'I-01', q:'평소 AI 챗봇을 어떤 일에 주로 쓰세요?' }] },
    'post-survey-A': { within: 25, items: [
      { id:'A-opt1', q: () => { const v = (survey.A || {})['A-13']; return v ? `방금 '얼마나 쉬웠나요' 질문에 ${v}점을 주셨어요. 그렇게 주신 이유는요?` : '쉬운 정도 점수를 그렇게 주신 이유는요?'; } },
      { id:'A-opt2', q:'처리하면서 확신이 덜 든 부분이 있었나요? 있었다면 어디였나요?' },
    ] },
    'post-survey-B': { within: 42, items: [
      { id:'B-opt1', q: () => { const v = (survey.B || {})['B-10']; return v ? `방금 '얼마나 쉬웠나요' 질문에 ${v}점을 주셨어요. 그렇게 주신 이유는요?` : '쉬운 정도 점수를 그렇게 주신 이유는요?'; } },
      { id:'B-15', q:'요청하신 범위와 실제로 처리된 범위를 비교하면 어땠나요?' },
      { id:'B-15b', when: () => !chat.b3.length, q:'처리가 됐는지 확인하고 싶다면 어떻게 하실 것 같으세요?', m:'스스로 다시 묻지 않았을 때만 · 안 떠오르면 진행자가 다시 물어보기 · 되돌리기를 보여 주고 반응 듣기(도움 아님)' },
    ] },
    wrap: { within: 50, items: [{ id:'W-06', q:'실제 Gemini에 이 기능이 있다면, 어떤 상황에서 쓰실 것 같으세요?' }] },
  };
  function askList(kind, phase, next){
    const key = kind === 'post-task' || kind === 'post-survey' ? `${kind}-${phase}` : kind;
    let list = (ASK[key] || []).slice();
    const opt = ASK_OPT[key];
    if(opt && mins() < opt.within) list = key === 'intro' ? opt.items.map(it => Object.assign({ m:'선택' }, it)).concat(list) : list.concat(opt.items.map(it => Object.assign({}, it, { m: '선택' + (it.m ? ' · ' + it.m : '') })));
    if(kind === 'post-survey' && next === firstStep('B')) list = list.concat(ASK['pre-B']);   // 과제 2를 시작하기 전에 B-00
    return list.filter(it => !it.when || it.when()).map(it => ({ id: it.id, q: typeof it.q === 'function' ? it.q() : it.q, m: it.m || '' }));
  }
  /* 과제 도중 질문 배너: 화면을 막지 않고 위쪽에 떠요. 참가자는 말로 답하고 '말로 답했어요'(2초 뒤 눌림) */
  let askCur = null, askAfter = null, askTimers = [];
  function askBanner(id, q, opts){
    opts = opts || {};
    if(askCur) return;
    askCur = { id, q, hint: !!opts.hint, gate: !!opts.gate }; askAfter = opts.after || null;
    Logger.log('ask_show', { step: current, id, mode: 'banner', hint: !!opts.hint });
    renderAskBanner();
    const btn = $('#askDone'); if(btn){ btn.disabled = true; setTimeout(() => { btn.disabled = false; }, 2000); }
    renderGuide();
  }
  function askDone(){
    if(!askCur || $('#askDone').disabled) return;
    Logger.log('ask_next', { step: current, id: askCur.id, mode: 'banner' });
    const after = askAfter; askCur = null; askAfter = null;
    renderAskBanner(); renderGuide();
    if(after) after();
  }
  function renderAskBanner(view){
    const a = view !== undefined ? view : askCur, box = $('#askBanner'); if(!box) return;
    box.hidden = !a;
    const block = $('#askBlock'); if(block) block.hidden = !(a && a.gate);
    // 질문이 떠 있는 동안 과제 카드 전체가 질문 카드가 돼요: 질문 + '말로 답했어요' 버튼 하나(안내 · 할 일은 숨김, 답하면 바로 원래 카드)
    const tb = $('#taskbar'); if(tb) tb.classList.toggle('asking', !!a);
    const mark = $('#taskAskMark'); if(mark && a) mark.textContent = I18n.t(a.hint ? '진행자 질문 · 힌트' : '진행자 질문');
    if(a){ $('#askBadge').textContent = I18n.t(a.hint ? '진행자 질문 · 힌트' : '진행자 질문'); $('#askText').textContent = I18n.t(a.q); }
  }
  // 답하기 전에 프로토타입을 누르면 질문 상자를 깜빡여 알려 줘요
  function askNudge(){
    const box = $('#askBanner'); if(!box || box.hidden) return;
    box.classList.remove('nudge'); void box.offsetWidth; box.classList.add('nudge');
    const bar = $('#taskbar'); if(bar && !bar.classList.contains('peek') && window.innerWidth <= 520) bar.scrollIntoView?.({ block: 'nearest' });
  }
  function clearAsk(){ askTimers.forEach(clearTimeout); askTimers = []; askCur = null; askAfter = null; renderAskBanner(); }
  let hold = null;   // { kind, phase, next, why, qs, i, overlay }
  let holdAfter = null;   // 질문이 끝난 뒤 할 일(이 기기에서만)
  let holdWaitTimer = null;
  function holdThen(kind, phase, next, why, opts){
    opts = opts || {};
    if(MODE !== 'participant'){ if(next) go(next, why); else if(opts.after) opts.after(); return; }
    const qs = askList(kind, phase, next);
    if(!qs.length && !HOLD_TEXT[kind]){ if(next) go(next, why); else if(opts.after) opts.after(); return; }
    hold = { kind, phase, next, why, qs, i: 0, overlay: !!opts.overlay };
    holdAfter = opts.after || null;
    renderHold();
    Logger.log('hold_show', { step: current, kind, phase, next, questions: qs.map(x => x.id) });
    if(qs.length) Logger.log('ask_show', { step: current, id: qs[0].id, n: 1, of: qs.length });
  }
  function holdContinue(){
    if(!hold || $('#holdBtn').disabled) return;
    if(hold.qs.length && hold.i < hold.qs.length - 1){
      Logger.log('ask_next', { step: current, id: hold.qs[hold.i].id });
      hold.i++;
      renderHold();
      Logger.log('ask_show', { step: current, id: hold.qs[hold.i].id, n: hold.i + 1, of: hold.qs.length });
      return;
    }
    const h = hold, after = holdAfter; hold = null; holdAfter = null;
    if(h.qs.length) Logger.log('ask_next', { step: current, id: h.qs[h.i].id });
    Logger.log('hold_continue', { step: current, kind: h.kind, phase: h.phase });
    renderHold();
    $$('.chat-body').forEach(b => b.style.paddingBottom = '');
    if(h.next) go(h.next, h.why); else { if(after) after(); renderPanel(); }
  }
  function renderHold(view){
    const h = view !== undefined ? view : hold;
    const box = $('#holdScreen'); if(!box) return;
    box.hidden = !h;
    box.classList.toggle('overlay', !!(h && h.overlay));
    document.body.classList.toggle('holding', !!h);
    if(h){
      const qs = h.qs || [], q = qs[h.i || 0];
      if(q){
        const last = (h.i || 0) >= qs.length - 1;
        // 프로토타입 화면이 아니라 연구 질문이라는 걸 분명히: 항상 '진행자 질문' 배지(여러 개면 순서도)
        $('#holdBadge').textContent = I18n.t(qs.length > 1 ? `진행자 질문 ${(h.i || 0) + 1} / ${qs.length}` : '진행자 질문');
        $('#holdBadge').hidden = false;
        $('#holdTitle').textContent = I18n.t(q.q);
        $('#holdDesc').textContent = I18n.t('생각나는 대로 말로 답해 주세요. 다 말하면 아래 버튼을 눌러 주세요');
        // P04처럼 대기 화면을 1~6초 만에 넘기지 않도록, 질문이 바뀌면 3초 뒤에 버튼이 눌려요. 그동안 남은 초를 보여 줘요.
        const btn = $('#holdBtn'), key = `${h.kind}:${h.i || 0}`, label = I18n.t(last ? '계속' : '다음 질문');
        if(view === undefined && btn.dataset.qk !== key){
          btn.dataset.qk = key; btn.disabled = true; clearInterval(holdWaitTimer);
          let left = 3;
          const tick = () => { if(left <= 0){ clearInterval(holdWaitTimer); btn.disabled = false; btn.textContent = label; } else btn.textContent = I18n.t(`${left}초 뒤에 누를 수 있어요`); left--; };
          tick(); holdWaitTimer = setInterval(tick, 1000);
        }else if(!btn.disabled) btn.textContent = label;
        if(h.overlay && view === undefined){
          // 아래 카드가 답변 끝을 가리지 않게, 카드 높이만큼 여백을 두고 맨 아래로 내려요.
          requestAnimationFrame(() => {
            const card = $('#holdScreen .intro-body'), body = $('.screen.active .chat-body');
            if(card && body && current === 'A2'){ body.style.paddingBottom = card.offsetHeight + 'px'; body.scrollTop = body.scrollHeight; }
          });
        }
      }else{
        const t = HOLD_TEXT[h.kind];
        $('#holdBadge').textContent = I18n.t(t.badge); $('#holdTitle').textContent = I18n.t(t.title); $('#holdDesc').textContent = I18n.t(t.desc);
        $('#holdBadge').hidden = false;
        $('#holdBtn').textContent = I18n.t('계속'); $('#holdBtn').disabled = false; delete $('#holdBtn').dataset.qk;
      }
    }
    renderGuide();
  }
  // 진행자 패널: 참가자 화면에 지금 떠 있는 질문(▶)과 남은 질문
  function holdQuestions(h){
    if(!h) return [];
    if(h.qs && h.qs.length) return h.qs.map((x, i) => `${i === (h.i || 0) ? '▶ ' : i < (h.i || 0) ? '✓ ' : ''}${x.id} ${x.q}${x.m ? ` (${x.m})` : ''}`);
    if(h.kind === 'post-task') return (GUIDE['Q' + h.phase] || {}).first || [];
    if(h.kind === 'wrap') return (GUIDE.QW || {}).open || [];
    const g = GUIDE['Q' + h.phase] || {};
    let list = (g.post || []).concat(g.probe || []);
    if(h.next === 'SB') list = list.concat((GUIDE.SB || {}).first || []);
    if(h.next === 'SA') list = list.concat((GUIDE.SA || {}).first || []);
    return list;
  }

  /* ---------------- 진행자 패널 렌더 ---------------- */
  // 진행자 안내 카드: 화면이 바뀔 때마다 지금 할 말과 질문을 짧게 보여 줘요(자세한 내용은 아래 스크립트).
  const GUIDE = {
    START: { say:["오늘 화면은 연구용 가상 화면이고, 이름·일정도 모두 가상이에요.","정답은 없어요. 생각나는 걸 소리 내어 말해 주세요.","화면과 목소리를 녹화해도 될까요? → 시작 화면에서 체크"],
          open:["AI에게 사람이나 일정 같은 개인적인 이야기를 해 본 적 있으세요? 그때 어떠셨어요? (I-02)"],
          opt:["평소 AI 챗봇을 어떤 일에 주로 쓰세요? (I-01)"] },
    SA: { watch:["상황 카드를 직접 읽게 두기"] },
    SB: { first:["(꼭 묻기) 정민 관련 정보를 앞으로 안 쓰이게 하고 싶다면, 평소라면 어떻게 하실 것 같으세요? (B-00)"],
          watch:["상황 카드를 직접 읽게 두기"] },
    A1: { watch:["상황 카드를 읽고 참가자가 질문을 보내게 두기"] },
    A1B: { watch:["참가자가 질문을 보내게 두기"] },
    A1C: { watch:["기다리는 동안의 반응"] },
    A2: { now: ASK_INTASK ? null : ["(필수 · 답변을 다 읽은 걸 확인한 뒤, 목표를 주기 전에) 방금 답변을 보고 어떤 생각이 드세요? (A-01)"],
          auto: ASK_INTASK ? ["A-01은 답변이 끝나고 2.5초 뒤, A-04 힌트는 목표 뒤 60초 동안 못 찾으면 과제 안내 카드 안에 자동 표시"] : null,
          say:["참고로 정민은 지금은 연락하지 않는 사람이에요. 이 답변에 정민 이야기가 왜 나왔는지 알아보고, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요."],
          watch:["'출처 확인'을 스스로 찾는지 (A-02)"],
          help:["60초 막히면 한 번: 이 답변이 왜 이렇게 나왔는지 알아볼 방법이 있을까요? (A-04)"] },
    A3: { now: ASK_INTASK ? null : ["(필수 · 시트를 열면 바로, 조작하기 전에) 어떻게 하실 생각이세요? (A-05)"],
          auto: ASK_INTASK ? ["A-05는 시트를 처음 열면 과제 안내 카드 안에 자동 표시 · 조작하는 동안에는 더 묻지 않기"] : null,
          watch:["조작하는 동안에는 묻지 않기 · 이해 질문(A-08~A-10)은 과제 완료 뒤 설문 다음에"] },
    A4: { first:["(스스로 들어왔을 때만) 이 화면은 무엇을 보여 주는 것 같으세요? (A-07)"] },
    QA: { first:["(설문 전) 지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요? (A-12)"],
          say:["화면 설문 4문항 (설명하지 않기)"],
          post:["이 답변에 정민 이야기가 왜 나왔는지 설명해 주실 수 있나요? (A-08)","(앱 연동 토글을 껐을 때만) 그 토글을 끄면 어떤 정보가 영향을 받을까요? (A-09 정답: 앱 전체 · 안 껐으면 묻지 않고 \"토글 안 씀\")","(항목을 처리했을 때만) 지운 것과 '답변에 안 씀'으로 처리한 것은 각각 어떻게 될까요? (A-10 정답: 지운 것은 사라짐 · 답변에 안 씀은 원본은 남고 답변에만 안 쓰임)"],
          watch:["처리를 확인하는 방법은 여기서 묻지 않기 (과제 2에서 스스로 다시 묻는지(B-06)를 보기 위해)"],
          opt:["쉬움 점수를 그렇게 주신 이유는요?","확신이 덜 든 부분이 있었다면 어디였나요?"] },
    B1: { say:["앞과 별개의 새 상황이에요. 이번엔 채팅으로 Gemini에게 직접 요청해서, 앞으로 정민 관련 정보가 답변에 쓰이지 않게 해 보세요."],
          watch:["어떤 문장으로 요청하는지 · 되물으면 어떻게 고쳐 말하는지 (자동)"] },
    B2: { help:["망설이면: 이 목록을 생각하셨던 범위와 비교하면 어떤가요? (B-02)"] },
    B3: { watch:["스스로 입력창에 다시 물어보는지 (B-06 · 먼저 제안하지 않기)","남겨 둔 송금·입금 메일을 함께 처리하는지 · 자세히 고르기를 여는지 (자동)","이해 질문(B-08)은 과제 완료 뒤 설문 다음에"] },
    B4: { first:["(스스로 들어왔을 때만) 이 화면은 무엇을 보여 주는 것 같으세요?"],
          watch:["보관 안내(사람이 검토한 채팅 최대 3년)를 읽는지 · 묻지 않고 관찰 (B-18)"] },
    B5: { watch:["스스로 입력창에 다시 물어보는지 (B-06 · 먼저 제안하지 않기)"] },
    QB: { first:["(설문 전) 지금 정민 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요? (B-09)"],
          say:["화면 설문 5문항"],
          post:["Gmail과 캘린더의 정민 정보는 지금 어떤 상태일까요? (B-08 정답: 원본은 남고 답변에만 안 쓰임)"],
          opt:["방금 무엇이 처리됐나요?","(메모리를 지웠다면) 지운 정보는 어떻게 됐을까요?","점수를 그렇게 주신 이유는요?","요청하신 범위와 실제로 처리된 범위를 비교하면 어땠나요? (B-15)","(스스로 다시 묻지 않았을 때만) 처리가 됐는지 확인하고 싶다면 어떻게 하실 것 같으세요? → 그래도 안 떠오르면 다시 물어보기 · 되돌리기를 보여 주고 반응 듣기 (B-15 메모 · 도움 아님)"] },
    SC: { watch:["상황 카드를 직접 읽게 두기"] },
    C1: { watch:["참가자가 질문을 보내게 두기"] },
    C2: { say:["(필요하면) 얼마 전 이사는 안 가기로 했어요. 앞으로 이사 관련 정보가 답변에 쓰이지 않게 해 보세요. 방법은 자유예요."],
          help:["60초 막히면: 이 답변에 쓰인 정보를 관리할 방법이 있을까요?"],
          after:["방금 무엇이 처리됐나요?","이사 말고 다른 정보도 영향을 받았을까요?","원하셨던 결과와 같은가요? (C-14)"] },
    C3: { first:["이 화면은 무엇을 보여 주는 것 같으세요?"] },
    C5: { watch:["'삭제돼요/답변에만 안 써요' 구분을 보는지"] },
    C6: { after:["방금 무엇이 처리됐나요?","이사 말고 다른 정보도 영향을 받았을까요?","원하셨던 결과와 같은가요? (C-14)"] },
    QC: { first:["(설문 전) 지금 이사 관련 정보 중 사라진 것과 남아 있는 것은 무엇일까요?"],
          say:["화면 설문 3문항"] },
    QS: { say:["화면 설문 10문항 (설명하지 않기 · 다음은 참가자가 직접 누름)"] },
    QW: { say:["화면에서 세 가지를 고르게 두기 (W-01~03)"],
          open:["(화면에서 고른 답을 보며) 그렇게 고르신 이유는요? — 지금 느낌(W-01), 더 편했던 방법(W-03) 순서로 (W-04)","오늘 써 보면서 막히거나 헷갈린 순간이 있었나요? 있었다면 언제였나요? (W-05)","오늘 써 본 것 중 가장 좋았던 부분과, 가장 덜 쓸 것 같은 부분은 어디였나요? 왜 그런가요? (W-07)"],
          opt:["실제 Gemini에 이 기능이 있다면 어떤 상황에서 쓰실 것 같으세요? (W-06)"] },
    END: { bye:["(디브리핑) 오늘 본 이름·일정은 모두 가상이었어요. 참여해 주셔서 감사합니다."] },
  };
  let guideStep = null;
  let remoteHold = null;   // 실시간 보기: 참가자 화면의 대기 상태
  let remoteAsk = null;    // 실시간 보기: 참가자 화면의 질문 배너
  function renderGuide(){
    const box = $('#guideBox'); if(!box) return;
    const g = GUIDE[current] || (hold || remoteHold ? {} : null);
    if(!g){ box.innerHTML = ''; box.hidden = true; return; }
    // 꼭 묻지 않아도 되는 질문은 접어 두고, 시간이 남을 때만 펼쳐서 물어요.
    const optSec = g => { const list = (g.opt || []).concat(g.secOpt ? g.secOpt.map(x => '(보안 종사자) ' + x) : []);
      return list.length ? `<details class="gd-opt"><summary>${esc(I18n.t('시간 남으면 (선택)'))}</summary>${list.map(x => `<div class="gd-line">${esc(x)}</div>`).join('')}</details>` : ''; };
    box.hidden = false;
    const sec = (cls, label, list) => list && list.length ? `<div class="gd-sec ${cls}"><div class="gd-label">${label}</div>${list.map(x => `<div class="gd-line">${esc(x)}</div>`).join('')}</div>` : '';
    const hq = holdQuestions(hold || remoteHold);
    const ab = askCur || remoteAsk;
    if(ab) hq.unshift(`▶ ${ab.id} ${ab.q} (과제 안내 카드${ab.hint ? ' · 힌트 = 도움으로 기록' : ''})`);
    box.innerHTML = (hq.length ? sec('first', '참가자 화면에 뜬 질문 · 답을 듣고 필요하면 더 묻기', hq) : '') + sec('now', '지금 말로 묻기 (필수)', g.now) + sec('watch', '화면에 자동으로 뜨는 질문', g.auto) + sec('first', '먼저 물어보기', g.first) + sec('open', '주관식', g.pre) + sec('say', '말하기', g.say) + sec('watch', '지켜보기', g.watch) + sec('help', '막히면', g.help) + sec('after', '끝나면 하나씩 묻기', g.after) + sec('after', '설문 뒤에 하나씩 묻기', g.post) + sec('open', '주관식', g.open) + sec('probe', '과제 완료 뒤 탐색', g.probe) + sec('sec', '보안 종사자만', g.sec) + sec('say', '말하기', g.bye) + optSec(g);
    if(guideStep !== current){ guideStep = current; box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash'); }
  }

  // 진행자 패널에 보이는 화면 이름(코드는 프로토콜 시트의 '화면' 열과 같게 유지)
  const STEP_NAME = { START:'시작', SA:'상황 1 카드', A1:'첫 화면', A1B:'질문 입력', A1C:'답변 생성 중', A2:'답변', A3:'출처 시트', A4:'개인 인텔리전스',
    SB:'상황 2 카드', B1:'채팅 요청', B2:'정리 목록', B3:'처리 결과', B4:'확인 화면', B5:'과제 종료', QA:'과제 1 설문', QB:'과제 2 설문',
    QW:'마지막 질문', QS:'사용성 설문', SC:'상황 3 카드', C1:'첫 화면', C2:'답변', C3:'출처 시트', C5:'처리 목록', C6:'처리 결과', QC:'과제 3 설문', END:'종료' };
  const stepLabel = s => s === 'START' ? '시작' : s === 'END' ? '종료' : `${s} ${STEP_NAME[s] || ''}`.trim();
  function renderPanel(){
    const d = STEPS[current] || STEPS.START;
    const tag = d.phase === 'a' ? '<span class="phase-tag a">과제 · 출처 확인 화면</span>'
              : d.phase === 'b' ? '<span class="phase-tag b">과제 · 채팅 요청</span>'
              : d.phase === 'c' ? '<span class="phase-tag c">과제 3 · 통합(출처 확인+관리, 채팅)</span>' : '';
    $('#stepTitle').innerHTML = esc(stepLabel(current)) + ' ' + tag;
    $('#scriptBox').textContent = I18n.t(d.script);
    renderGuide();
    $('#interactNote').innerHTML = I18n.t(d.interact);
    if(current === 'A2') $('#interactNote').append(document.createTextNode(' ' + I18n.t('생성 중지·계속, 복사·공유·듣기·평가 버튼도 사용할 수 있어요.')));
    if(current === 'A3') $('#interactNote').append(document.createTextNode(' ' + I18n.t('시트 상단을 아래로 드래그하거나 Esc를 눌러 닫을 수 있어요.')));
    $('#indicatorRow').innerHTML = [1,2,3,4,5].map(i => `<span class="ind-chip ${d.indicators.includes(i)?'active':''}">지표${i}</span>`).join('');
    $('#jumpnav').innerHTML = ORDER.map(s => `<button class="${s===current?'cur':''}" ${s==='START'?'disabled':''} onclick="App.go('${s}','jump')">${esc(stepLabel(s))}</button>`).join('');
    renderMetrics();
  }

  function renderSession(){
    const row = $('#sessionRow');
    if(remote){
      const m = remote.meta || {};
      row.innerHTML = `참가자 <b>${esc(m.participant || '?')}</b> 화면을 실시간으로 보는 중${m.ended ? ' · <b>세션 종료됨</b>' : ''}`;
      return;
    }
    if(!Logger.active){ row.innerHTML = '세션 시작 전'; return; }
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
      ['A · 참조 끈 앱', Object.keys(s.A_refsFinal || {}).filter(k => !s.A_refsFinal[k]).map(k => REF_NAME[k] || k).join(', ') || '없음'],
      ['B · 처리한 항목', s.B_selected ? Object.keys(s.B_selected).filter(k => s.B_selected[k]).map(k => REF_NAME[k] || k).join(', ') : '아직'],
      ['B · 다시 물어봄', s.B_verifyClicked ? `${s.B_verifySec}초 뒤` : '아직'],
      ['오클릭 (전체)', s.misclicksTotal],
      ['기록된 이벤트', src.events.length],
    ];
    box.innerHTML = rows.map(([k,v]) => `<span class="k">${k}</span><span class="v">${esc(v)}</span>`).join('');
  }

  // 진행자 패널: 참가자가 고르는 설문 응답을 실시간으로 보여 주고, 후속 질문 거리를 짚어 줘요.
  const SV_SHORT = { 'A-13':'쉬움 정도 (SEQ)', 'A-14':'완료됐다고 생각', 'A-15':'확신도', 'A-16':'정보량',
    'B-10':'쉬움 정도 (SEQ)', 'B-11':'완료됐다고 생각', 'B-12':'확신도', 'B-13':'정보량', 'B-14':'선택 수월함',
    'C-10':'쉬움 정도 (SEQ)', 'C-11':'완료됐다고 생각', 'C-12':'영향 범위 확신도', 'A-19':'정민 정보 처리', 'A-20':'정민 외 정보', 'W-01':'지금 느낌', 'W-02':'사전 인지', 'W-03':'가장 편한 방법' };
  function svFlag(id, v){
    if(['A-13', 'B-10', 'C-10'].includes(id) && v <= 3) return "어렵다고 답했어요. '어느 부분이 어려웠나요?'";
    if(['A-14', 'B-11', 'C-11'].includes(id) && v !== '예') return "완료에 확신이 없어요. '어떤 점 때문에 그렇게 생각하셨나요?'";
    if(['A-15', 'B-12', 'C-12'].includes(id) && v <= 3) return "확신이 낮아요. '무엇이 확실하지 않게 느껴졌나요?'";
    if(['A-16', 'B-13'].includes(id) && (v <= 2 || v >= 6)) return v <= 2 ? "정보가 적다고 했어요. '어떤 정보가 더 있었으면 했나요?'" : "정보가 많다고 했어요. '어떤 부분이 과했나요?'";
    if(id === 'B-14' && v <= 3) return "고르기가 번거로웠대요. '어떤 점이 번거로웠나요?'";
    return '';
  }
  function renderSurveyLive(src){
    const box = $('#svLive'); if(!box) return;
    const evs = src ? src.events || [] : [];
    const s = src && src.summary ? src.summary : {};
    const ans = {};
    Object.values(s.survey || {}).forEach(o => Object.assign(ans, o));
    evs.forEach(e => { if(e.type === 'survey_pick') ans[e.id] = e.value; });
    const groups = [['A', '저녁 약속 상황 (A)'], ['B', '채팅으로 정리한 상황 (B)'], ['C', '이사 정보 정리 (C)'], ['W', '마지막 질문']].filter(([k]) => SURVEY[k].items.some(it => ans[it.id] !== undefined));
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
      if(k !== 'W' && ans[doneId] === '예' && noAct) html += `<div class="svl-tip warn">완료했다고 답했지만 실제로 바꾼 게 없어요. '어떻게 처리하셨다고 생각하세요?'</div>`;
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

  const EV_NAME = { step:'화면', click:'클릭', misclick:'오클릭', toggle:'토글', check:'체크', check_item:'항목 체크', check_all:'전체 선택',
    b2_process:'처리', delete:'삭제', expand:'펼치기', undo:'되돌리기', more:'더보기', reask:'다시 물어봄', survey:'설문', survey_pick:'설문 응답',
    consent:'동의', session_start:'세션 시작', session_end:'세션 종료', task_done:'과제 완료', task_peek:'과제 보기', task_goal_shown:'목표 표시',
    sheet_close:'시트 닫기', response_complete:'답변 완료', response_cancel:'답변 중지', response_action:'답변 버튼', response_rating:'답변 평가',
    restaurant_save:'식당 저장', scenario_reset:'초기화', resize:'창 크기 변경', language_change:'언어 변경' };
  function renderFeed(){
    const feed = $('#logFeed');
    const all = remote ? remote.events : Logger.active ? Logger.session.events : null;
    if(!all){ feed.innerHTML = '시작하면 이벤트가 여기에 쌓여요'; return; }
    const evs = all.slice(-40);
    const en = I18n.language === 'en';
    feed.innerHTML = evs.map(e => {
      const sec = (e.ms / 1000).toFixed(1).padStart(6, ' ');
      const what = e.type === 'step' ? `→ ${e.step}`
                 : e.type === 'click' || e.type === 'misclick' ? `${e.tag}`
                 : e.type === 'toggle' ? `${REF_NAME[e.ref] || e.ref} ${e.on ? '켬' : '끔'}`
                 : e.type === 'check' ? `${REF_NAME[e.src] || e.src} ${e.checked ? '✓' : '✗'}`
                 : e.type === 'b2_process' ? Object.keys(e.selected || {}).filter(k => e.selected[k]).map(k => REF_NAME[k] || k).join('+')
                 : e.type === 'delete' ? `메모리 (${e.scope === 'all' ? '전체' : e.scope})`
                 : e.type === 'expand' ? `${e.tag} ${e.open ? '열림' : '닫힘'}`
                 : '';
      return `<div class="${e.type === 'misclick' ? 'miss' : ''}">${sec}${en ? 's' : '초'} ${esc(en ? e.type : (EV_NAME[e.type] || e.type))} ${esc(what)}</div>`;
    }).join('');
    feed.scrollTop = feed.scrollHeight;
  }

  function renderArchive(){
    let el = $('#archiveList');
    if(!el){ el = document.createElement('div'); el.id = 'archiveList'; el.className = 'archive-list'; $('#toolsExtra').append(el); }
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
    const doneKey = { QA:'A', QB:'B', QC:'C', QS:'S', QW:'W' }[current] || null;
    bar.classList.toggle('show', MODE === 'participant' && !!(phase || doneKey));
    const wasDone = bar.classList.contains('done');
    if(bar.dataset.step !== current){ bar.classList.remove('peek'); bar.dataset.step = current; }
    bar.classList.toggle('done', !phase && !!doneKey);
    if(!phase && doneKey){
      const n = doneKey === 'S' || doneKey === 'W' ? 2 : (doneKey === FIRST ? 1 : 2);
      $('#taskLabel').textContent = I18n.t(`과제 ${n} / 2`);
      $('#taskText').innerHTML = `<div class="tk-done"><span class="tk-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.2l2.8 2.8L16 9.6"/></svg></span><span>${esc(I18n.t(doneKey === 'S' || doneKey === 'W' ? '두 과제를 모두 마쳤어요' : `과제 ${n}${n === 2 ? '를' : '을'} 마쳤어요`))}</span></div>`
        + `<div class="tk-ctx">${esc(I18n.t(doneKey === 'S' || doneKey === 'W' ? '마지막 설문이에요. 휴대폰 화면에서 답해 주세요' : '휴대폰 화면의 짧은 설문에 답해 주세요'))}</div>`;
      if(!wasDone){ bar.classList.remove('pop'); void bar.offsetWidth; bar.classList.add('pop'); }
      return;
    }
    // A는 답변이 다 나온 뒤 구체적인 목표로 바뀌어요(첫 반응은 자유롭게 보고, 그다음 목표 제시).
    const key = phase === 'A' && (M.aGoal || ['A3', 'A4'].includes(current)) ? 'A2' : phase;
    // A는 목표가 나오기 전(질문 보내고 답변 기다리는 중)에는 '과제 완료'를 숨겨 실수로 끝내지 않게 해요.
    $('#taskDoneBtn').hidden = key === 'A';
    if(phase){
      const t = TASK_TEXT[key];
      const steps = t.steps.length > 1 ? `<ol class="tk-steps">${t.steps.map(x => `<li>${esc(I18n.t(x))}</li>`).join('')}</ol>` : `<div class="tk-main">${esc(I18n.t(t.steps[0]))}</div>`;
      // 상황 카드와 같은 덩어리: 상황(회색 상자) → 할 일(테두리 상자: 라벨 + 굵은 문장)
      $('#taskText').innerHTML = (t.ctx ? `<div class="tk-ctx-box"><div class="tk-sec">${esc(I18n.t('상황'))}</div><div class="tk-ctx">${esc(I18n.t(t.ctx))}</div></div>` : '') + `<div class="tk-todo-box"><div class="tk-sec">${esc(I18n.t('할 일'))}</div>${steps}</div>`
        + `<div class="tk-oneline"><span class="tk-sec">${esc(I18n.t('할 일'))}</span><span class="tk-one">${esc(I18n.t(TASK_BRIEF[key] || t.steps.join(' ')))}</span></div>`;
      $('#taskLabel').textContent = I18n.t(phase === FIRST ? '과제 1 / 2' : '과제 2 / 2');
      if(M.flash){
        M.flash = false;
        if(window.innerWidth <= 520){
          bar.classList.add('peek'); clearTimeout(bar._pt);
          bar._pt = setTimeout(() => { if(bar.dataset.step === current) bar.classList.remove('peek'); }, 8000);
          Logger.log('task_peek', { step: current, open: true, auto: true });
        }
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

  window.App = { ask,
    go, advance, start, newSession, resetScenario, taskDone, finishPhase,
    closeSheet, toggleResponse, stopLoading, expand, toggleRef, deleteMemory, deleteMemoryItem, undoDelete, holdContinue,
    toggleCheckItem, toggleB2Item, a3Pick, a3Process, a3Expand, a3Detail: a3DetailToggle, a3Apps, a3PickTopic, toggleSelectAll, processB2, undoB2, cancelB2, processHold, toggleB2Detail, openB2Detail, askDone, askNudge, sendB1, toggleMore,
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
