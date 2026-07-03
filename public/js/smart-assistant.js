/* ============================================================
   UKF SMART ASSISTANT — Layla / Tariq / Sara / Rania
   Standalone script — include on any page
   ============================================================ */
(function(){
  /* Inject CSS */
  var style=document.createElement('style');
  style.textContent=`
    :root{--ukf-navy:#0a1628;--ukf-navy-light:#1a3560;--ukf-gold:#c9a84c;--ukf-gold-light:#e8c97a;--ukf-gold-pale:#f5edd6;--ukf-surface:#f2f4f8;--ukf-border:#d8dde8;--ukf-text:#1a2540;--ukf-muted:#6b7898;--ukf-white:#ffffff;--ukf-green:#4ade80;}
    #ukf-bubble{position:fixed;bottom:28px;right:28px;width:62px;height:62px;background:var(--ukf-navy);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;z-index:99999;box-shadow:0 4px 20px rgba(10,22,40,0.35),0 0 0 3px rgba(201,168,76,0.25);transition:transform 0.25s ease,box-shadow 0.25s ease;animation:ukfPulse 3s infinite 2s;}
    #ukf-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(10,22,40,0.45),0 0 0 4px rgba(201,168,76,0.35);}
    #ukf-bubble svg{width:26px;height:26px;}
    @keyframes ukfPulse{0%,100%{box-shadow:0 4px 20px rgba(10,22,40,0.35),0 0 0 3px rgba(201,168,76,0.25);}50%{box-shadow:0 4px 20px rgba(10,22,40,0.35),0 0 0 7px rgba(201,168,76,0.10);}}
    #ukf-window{position:fixed;bottom:102px;right:28px;width:370px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:var(--ukf-white);border-radius:18px;box-shadow:0 16px 48px rgba(10,22,40,0.18),0 2px 8px rgba(10,22,40,0.08);display:none;flex-direction:column;overflow:hidden;z-index:99998;border:1px solid var(--ukf-border);font-family:'Inter',sans-serif;animation:ukfSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1);}
    @keyframes ukfSlideIn{from{opacity:0;transform:translateY(16px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
    .ukfw-header{background:var(--ukf-navy);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
    .ukfw-header-left{display:flex;align-items:center;gap:11px;}
    .ukfw-av-wrap{position:relative;width:38px;height:38px;flex-shrink:0;}
    .ukfw-av{width:38px;height:38px;border-radius:50%;background:var(--ukf-gold);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--ukf-navy);}
    .ukfw-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:var(--ukf-green);border-radius:50%;border:2px solid var(--ukf-navy);}
    .ukfw-name{font-size:15px;font-weight:700;color:#fff;}
    .ukfw-role{font-size:11px;color:rgba(255,255,255,0.5);margin-top:1px;}
    .ukfw-hbtns{display:flex;gap:6px;}
    .ukfw-hbtn{background:rgba(255,255,255,0.08);border:none;width:30px;height:30px;border-radius:7px;color:rgba(255,255,255,0.55);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;font-size:13px;}
    .ukfw-hbtn:hover{background:rgba(255,255,255,0.16);color:#fff;}
    .ukfw-msgs{flex:1;overflow-y:auto;padding:16px;background:#f7f9fc;display:flex;flex-direction:column;gap:10px;}
    .ukfw-msgs::-webkit-scrollbar{width:4px;}
    .ukfw-msgs::-webkit-scrollbar-thumb{background:var(--ukf-border);border-radius:4px;}
    .ukfw-row{display:flex;gap:8px;align-items:flex-end;}
    .ukfw-row.u{flex-direction:row-reverse;}
    .ukfw-row-av{width:26px;height:26px;border-radius:50%;background:var(--ukf-gold);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--ukf-navy);flex-shrink:0;}
    .ukfw-col{display:flex;flex-direction:column;}
    .ukfw-row.u .ukfw-col{align-items:flex-end;}
    .ukfw-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;color:var(--ukf-text);}
    .ukfw-row:not(.u) .ukfw-msg{background:var(--ukf-white);border:1px solid var(--ukf-border);border-bottom-left-radius:4px;}
    .ukfw-row.u .ukfw-msg{background:var(--ukf-navy);color:#fff;border-bottom-right-radius:4px;}
    .ukfw-time{font-size:10px;color:var(--ukf-muted);margin-top:3px;padding:0 3px;}
    .ukfw-in{animation:ukfMsgIn 0.22s ease-out;}
    @keyframes ukfMsgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
    .ukfw-typing{display:flex;gap:4px;align-items:center;padding:10px 14px;background:var(--ukf-white);border:1px solid var(--ukf-border);border-radius:16px;border-bottom-left-radius:4px;width:fit-content;}
    .ukfw-typing span{width:6px;height:6px;border-radius:50%;background:var(--ukf-navy);opacity:0.3;animation:ukfDot 1.2s infinite;}
    .ukfw-typing span:nth-child(2){animation-delay:0.2s;}
    .ukfw-typing span:nth-child(3){animation-delay:0.4s;}
    @keyframes ukfDot{0%,60%,100%{transform:translateY(0);opacity:0.3;}30%{transform:translateY(-5px);opacity:1;}}
    .ukfw-quick{padding:10px 14px;border-top:1px solid var(--ukf-border);background:var(--ukf-white);display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;}
    .ukfw-qbtn{background:var(--ukf-surface);border:1px solid var(--ukf-border);color:var(--ukf-navy);padding:6px 13px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
    .ukfw-qbtn:hover,.ukfw-qbtn.on{background:var(--ukf-navy);color:var(--ukf-gold);border-color:var(--ukf-navy);}
    .ukfw-input-row{padding:10px 12px;border-top:1px solid var(--ukf-border);display:flex;gap:8px;background:var(--ukf-white);flex-shrink:0;align-items:center;}
    .ukfw-input{flex:1;padding:9px 14px;border:1px solid var(--ukf-border);border-radius:24px;font-size:13px;color:var(--ukf-text);background:var(--ukf-surface);outline:none;transition:border-color 0.15s;font-family:inherit;}
    .ukfw-input:focus{border-color:var(--ukf-gold);}
    .ukfw-input::placeholder{color:var(--ukf-muted);}
    .ukfw-send{background:var(--ukf-navy);color:var(--ukf-gold);border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s;}
    .ukfw-send:hover{background:var(--ukf-navy-light);}
    .ukfw-card{background:var(--ukf-white);border:1px solid var(--ukf-border);border-radius:12px;overflow:hidden;width:100%;max-width:265px;}
    .ukfw-card-hd{background:var(--ukf-navy);padding:9px 13px;display:flex;align-items:center;gap:7px;}
    .ukfw-card-hd span{font-size:11px;font-weight:700;color:var(--ukf-gold);letter-spacing:0.07em;text-transform:uppercase;}
    .ukfw-card-bd{padding:13px;}
    .ukfw-dim-row{display:flex;align-items:center;gap:5px;margin-bottom:9px;}
    .ukfw-dim-in{width:55px;padding:7px 6px;border:1px solid var(--ukf-border);border-radius:7px;font-size:13px;text-align:center;color:var(--ukf-text);background:var(--ukf-surface);outline:none;transition:border-color 0.15s;}
    .ukfw-dim-in:focus{border-color:var(--ukf-gold);}
    .ukfw-dim-sep{color:var(--ukf-muted);font-size:15px;}
    .ukfw-calc-btn{width:100%;padding:9px;background:var(--ukf-navy);color:var(--ukf-gold);border:none;border-radius:7px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;transition:background 0.15s;}
    .ukfw-calc-btn:hover{background:var(--ukf-navy-light);}
    .ukfw-result{margin-top:10px;padding:10px 12px;background:var(--ukf-gold-pale);border-radius:7px;display:none;}
    .ukfw-result-label{font-size:10px;color:var(--ukf-muted);text-transform:uppercase;letter-spacing:0.06em;}
    .ukfw-result-val{font-size:22px;font-weight:700;color:var(--ukf-navy);display:block;margin:2px 0 8px;}
    .ukfw-cta-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}
    .ukfw-cta{padding:6px 12px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;transition:all 0.15s;border:1px solid var(--ukf-navy);background:transparent;color:var(--ukf-navy);}
    .ukfw-cta:hover{background:var(--ukf-navy);color:var(--ukf-gold);}
    .ukfw-cta.gold{background:var(--ukf-gold);border-color:var(--ukf-gold);color:var(--ukf-navy);}
    .ukfw-cta.gold:hover{background:var(--ukf-gold-light);}
    .ukfw-list{list-style:none;padding:0;margin-top:10px;}
    .ukfw-list li{padding:7px 0;border-bottom:1px solid var(--ukf-border);font-size:13px;color:var(--ukf-text);display:flex;gap:8px;align-items:flex-start;line-height:1.45;}
    .ukfw-list li:last-child{border-bottom:none;}
    .ukfw-num{background:var(--ukf-navy);color:var(--ukf-gold);width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
    .ukfw-inco{padding:9px 11px;border-radius:8px;border:1px solid var(--ukf-border);background:var(--ukf-surface);margin-bottom:7px;}
    .ukfw-inco-code{font-size:14px;font-weight:700;color:var(--ukf-navy);}
    .ukfw-inco-desc{font-size:12px;color:var(--ukf-muted);margin-top:2px;line-height:1.4;}
    .ukfw-corridor{padding:9px 11px;border-radius:8px;border:1px solid var(--ukf-border);background:var(--ukf-surface);margin-bottom:7px;}
    .ukfw-corridor-name{font-size:12px;font-weight:700;color:var(--ukf-navy);letter-spacing:0.06em;text-transform:uppercase;}
    .ukfw-corridor-detail{font-size:12px;color:var(--ukf-muted);margin-top:2px;}
    .ukfw-contact{background:var(--ukf-navy);border-radius:10px;padding:13px 14px;margin-top:8px;max-width:265px;}
    .ukfw-contact-row{display:flex;align-items:flex-start;gap:9px;font-size:12.5px;color:rgba(255,255,255,0.75);margin-bottom:8px;line-height:1.4;}
    .ukfw-contact-row:last-child{margin-bottom:0;}
    .ukfw-contact-icon{color:var(--ukf-gold);font-size:13px;margin-top:1px;flex-shrink:0;}
    .ukfw-contact a{color:var(--ukf-gold);text-decoration:none;}
    .ukfw-contact a:hover{text-decoration:underline;}
  `;
  document.head.appendChild(style);

  /* Inject HTML */
  var TEAM=[{name:'Layla',initials:'LA'},{name:'Tariq',initials:'TQ'},{name:'Sara',initials:'SA'},{name:'Rania',initials:'RN'}];
  var agent=TEAM[Math.floor(Math.random()*TEAM.length)];
  var CONTACT={phone:'+971 55 257 2837',whatsapp:'https://wa.me/971552572837?text=Hi%2C%20I%27d%20like%20a%20freight%20quote',email:'info@ukfservices.com',hours:'Mon-Fri - 9:00 AM - 6:00 PM GST'};
  var leadStep=0,leadData={};
  var LEAD_STEPS=['name','route','cargo'];
  var LEAD_Q={name:"First, what's your name?",route:'Thanks {name}! Origin and destination? (e.g. Dubai - Valencia)',cargo:'What are you shipping? (type + approx. weight or volume)'};

  var html='<button id="ukf-bubble" aria-label="Open UKF Smart Assistant"><svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2C7.477 2 3 6.15 3 11.25c0 2.7 1.23 5.13 3.2 6.84L5.5 22l4.56-2.1A11.1 11.1 0 0013 20.5c5.523 0 10-4.15 10-9.25S18.523 2 13 2z" fill="#c9a84c"/><circle cx="9" cy="11" r="1.3" fill="#0a1628"/><circle cx="13" cy="11" r="1.3" fill="#0a1628"/><circle cx="17" cy="11" r="1.3" fill="#0a1628"/></svg></button>'
  +'<div id="ukf-window" role="dialog" aria-label="UKF Smart Assistant"><div class="ukfw-header"><div class="ukfw-header-left"><div class="ukfw-av-wrap"><div class="ukfw-av" id="ukfw-initials">'+agent.initials+'</div><div class="ukfw-dot"></div></div><div><div class="ukfw-name" id="ukfw-name">'+agent.name+'</div><div class="ukfw-role">UKF Freight Intelligence</div></div></div><div class="ukfw-hbtns"><button class="ukfw-hbtn" id="ukfw-clear-btn" title="New conversation" aria-label="Clear chat"><i class="fas fa-rotate-right" style="font-size:12px;"></i></button><button class="ukfw-hbtn" id="ukfw-close-btn" title="Close" aria-label="Close"><i class="fas fa-xmark"></i></button></div></div><div class="ukfw-msgs" id="ukfw-msgs"></div><div class="ukfw-quick"><button class="ukfw-qbtn" data-act="volumetric">Volumetric Weight</button><button class="ukfw-qbtn" data-act="incoterms">Incoterms</button><button class="ukfw-qbtn" data-act="customs">UAE Customs</button><button class="ukfw-qbtn" data-act="corridors">Trade Corridors</button><button class="ukfw-qbtn" data-act="quote">Get a Quote</button></div><div class="ukfw-input-row"><input class="ukfw-input" id="ukfw-input" type="text" placeholder="Ask about freight, customs, routing..." aria-label="Type a message"><button class="ukfw-send" id="ukfw-send-btn" aria-label="Send"><i class="fas fa-paper-plane" style="font-size:13px;"></i></button></div></div>';

  var wrap=document.createElement('div');
  wrap.innerHTML=html;
  document.body.appendChild(wrap);

  /* Wire up events */
  document.getElementById('ukf-bubble').addEventListener('click',ukfToggle);
  document.getElementById('ukfw-close-btn').addEventListener('click',ukfToggle);
  document.getElementById('ukfw-clear-btn').addEventListener('click',ukfClear);
  document.getElementById('ukfw-send-btn').addEventListener('click',ukfSend);
  document.getElementById('ukfw-input').addEventListener('keydown',function(e){if(e.key==='Enter')ukfSend();});
  document.querySelectorAll('.ukfw-qbtn').forEach(function(b){b.addEventListener('click',function(){ukfAct(b.getAttribute('data-act'));});});

  /* Initial greeting */
  aiMsg('Hi there! I\'m <strong>'+agent.name+'</strong> from the UKF team. I can help with freight calculations, Incoterms, UAE customs, and trade routing.<br><br>What can I help you with today?');

  function ukfToggle(){
    var w=document.getElementById('ukf-window');
    var b=document.getElementById('ukf-bubble');
    var open=w.style.display==='flex';
    w.style.display=open?'none':'flex';
    b.style.display=open?'flex':'none';
    if(!open)scrollMsgs();
  }
  function ukfClear(){
    document.getElementById('ukfw-msgs').innerHTML='';
    leadStep=0;leadData={};
    aiMsg('Chat cleared. How can I help with your shipment today?');
  }
  function ukfAct(type){
    document.querySelectorAll('.ukfw-qbtn').forEach(function(b){b.classList.remove('on');});
    document.querySelectorAll('.ukfw-qbtn').forEach(function(b){if(b.getAttribute('data-act')===type)b.classList.add('on');});
    typing();
    setTimeout(function(){
      rmTyping();
      var h='';
      if(type==='volumetric'){
        h='<div class="ukfw-card"><div class="ukfw-card-hd"><i class="fas fa-box" style="color:var(--ukf-gold);font-size:11px;"></i><span>Air Freight Calculator</span></div><div class="ukfw-card-bd"><div class="ukfw-dim-row"><input type="number" id="ukfw-cl" class="ukfw-dim-in" placeholder="L cm" min="0"><span class="ukfw-dim-sep">x</span><input type="number" id="ukfw-cw" class="ukfw-dim-in" placeholder="W cm" min="0"><span class="ukfw-dim-sep">x</span><input type="number" id="ukfw-ch" class="ukfw-dim-in" placeholder="H cm" min="0"></div><div style="font-size:11px;color:var(--ukf-muted);margin-bottom:9px;">Divisor 6000 - Standard air freight</div><button class="ukfw-calc-btn" id="ukfw-calc-do">Calculate</button><div class="ukfw-result" id="ukfw-res"><span class="ukfw-result-label">Volumetric Weight</span><span class="ukfw-result-val" id="ukfw-res-val">-</span><div class="ukfw-cta-row"><button class="ukfw-cta gold ukfw-qbtn-quote">Request Quote</button></div></div></div></div>';
      }else if(type==='incoterms'){
        h='<strong>Common Incoterms from Jebel Ali:</strong><div style="margin-top:9px;"><div class="ukfw-inco"><div class="ukfw-inco-code">FOB <span style="font-size:11px;font-weight:400;color:var(--ukf-muted);">Free On Board</span></div><div class="ukfw-inco-desc">Seller loads at origin port. Buyer handles freight, insurance & destination costs.</div></div><div class="ukfw-inco"><div class="ukfw-inco-code">DDP <span style="font-size:11px;font-weight:400;color:var(--ukf-muted);">Delivered Duty Paid</span></div><div class="ukfw-inco-desc">UKF handles everything - freight, customs, duties, final delivery.</div></div><div class="ukfw-inco"><div class="ukfw-inco-code">CIF <span style="font-size:11px;font-weight:400;color:var(--ukf-muted);">Cost, Insurance & Freight</span></div><div class="ukfw-inco-desc">Seller covers freight to destination port. Risk transfers at port of loading.</div></div></div><div class="ukfw-cta-row" style="margin-top:8px;"><button class="ukfw-cta gold ukfw-qbtn-quote">Help me choose the right term</button></div>';
      }else if(type==='customs'){
        h='<strong>UAE Customs - Standard Requirements</strong><ul class="ukfw-list"><li><div class="ukfw-num">1</div><div>Commercial Invoice - HS codes, declared value, seller details</div></li><li><div class="ukfw-num">2</div><div>Packing List - weights, dimensions, quantities</div></li><li><div class="ukfw-num">3</div><div>Certificate of Origin - authenticated by Chamber of Commerce</div></li><li><div class="ukfw-num">4</div><div>Bill of Lading or Airway Bill</div></li><li><div class="ukfw-num">5</div><div>Import Permit - required for regulated goods</div></li></ul><div class="ukfw-cta-row" style="margin-top:10px;"><button class="ukfw-cta gold ukfw-qbtn-quote">Get customs support</button></div>';
      }else if(type==='corridors'){
        h='<strong>UKF Active Trade Corridors</strong><div style="margin-top:9px;"><div class="ukfw-corridor"><div class="ukfw-corridor-name">UAE - GCC Hub</div><div class="ukfw-corridor-detail">Dubai - Jebel Ali - Abu Dhabi - Saudi Arabia - Kuwait - Oman</div></div><div class="ukfw-corridor"><div class="ukfw-corridor-name">Spain - Europe</div><div class="ukfw-corridor-detail">Valencia - UAE/Spain - Spain/GCC - North Africa</div></div><div class="ukfw-corridor"><div class="ukfw-corridor-name">Indonesia - ASEAN</div><div class="ukfw-corridor-detail">Jakarta - Indonesia/UAE - ASEAN/GCC - Saudi Arabia</div></div></div><div class="ukfw-cta-row" style="margin-top:8px;"><button class="ukfw-cta gold ukfw-qbtn-quote">Get a corridor quote</button></div>';
      }else if(type==='quote'){
        leadStep=0;leadData={};
        h='Happy to arrange a quote - just need a few quick details for the team.<br><br>'+LEAD_Q.name;
        leadStep=1;
      }
      if(h){
        aiMsg(h);
        /* Wire calc and quote buttons added dynamically */
        var calcBtn=document.getElementById('ukfw-calc-do');
        if(calcBtn)calcBtn.addEventListener('click',ukfCalc);
        document.querySelectorAll('.ukfw-qbtn-quote').forEach(function(b){b.addEventListener('click',function(){ukfAct('quote');});});
      }
    },500);
  }
  function ukfCalc(){
    var l=parseFloat(document.getElementById('ukfw-cl').value);
    var w=parseFloat(document.getElementById('ukfw-cw').value);
    var h=parseFloat(document.getElementById('ukfw-ch').value);
    var res=document.getElementById('ukfw-res');
    var val=document.getElementById('ukfw-res-val');
    if(!l||!w||!h||l<=0||w<=0||h<=0){val.textContent='Enter all dimensions';val.style.fontSize='13px';res.style.display='block';return;}
    val.style.fontSize='22px';
    val.textContent=((l*w*h)/6000).toFixed(2)+' kg';
    res.style.display='block';
    scrollMsgs();
  }
  function ukfSend(){
    var inp=document.getElementById('ukfw-input');
    var txt=inp.value.trim();
    if(!txt)return;
    inp.value='';
    userMsg(txt);
    typing();
    setTimeout(function(){
      rmTyping();
      if(leadStep>0&&leadStep<=LEAD_STEPS.length){
        var field=LEAD_STEPS[leadStep-1];
        leadData[field]=txt;
        if(leadStep<LEAD_STEPS.length){
          leadStep++;
          aiMsg(LEAD_Q[LEAD_STEPS[leadStep-1]].replace('{name}',leadData.name||''));
        }else{
          leadStep=0;
          aiMsg('Thank you, <strong>'+esc(leadData.name)+'</strong>! Here\'s what I\'ve noted:<br><br><strong>Route:</strong> '+esc(leadData.route)+'<br><strong>Cargo:</strong> '+esc(leadData.cargo)+'<br><br>Our team will be in touch with a tailored quote. You can also reach us directly:'+contactCard());
          if(typeof gtag!=='undefined'){gtag('event','ukf_lead_captured',{'event_category':'Lead Generation','event_label':'assistant_lead'});}
        }
        return;
      }
      var lo=txt.toLowerCase();
      if(/(weight|volume|cbm|kg|dimension|heavy)/.test(lo)){ukfAct('volumetric');return;}
      if(/(incoterm|fob|ddp|cif|delivery term)/.test(lo)){ukfAct('incoterms');return;}
      if(/(custom|clearance|document|invoice|certificate)/.test(lo)){ukfAct('customs');return;}
      if(/(corridor|spain|indonesia|valencia|jakarta|asean)/.test(lo)){ukfAct('corridors');return;}
      if(/(quote|price|cost|rate|how much)/.test(lo)){ukfAct('quote');return;}
      if(/(human|person|team|expert|call|email|whatsapp|contact|phone)/.test(lo)){aiMsg('Of course! Here\'s how to reach the UKF team:'+contactCard());return;}
      aiMsg('I specialise in freight calculations, Incoterms, UAE customs, and trade corridor routing. Try one of the quick buttons above or ask me anything about your shipment!');
    },500);
  }
  function contactCard(){
    return '<div class="ukfw-contact"><div class="ukfw-contact-row"><i class="fas fa-phone ukfw-contact-icon"></i><span><a href="tel:+97155257837">'+CONTACT.phone+'</a></span></div><div class="ukfw-contact-row"><i class="fab fa-whatsapp ukfw-contact-icon"></i><span><a href="'+CONTACT.whatsapp+'" target="_blank">WhatsApp us</a></span></div><div class="ukfw-contact-row"><i class="fas fa-envelope ukfw-contact-icon"></i><span><a href="mailto:'+CONTACT.email+'">'+CONTACT.email+'</a></span></div><div class="ukfw-contact-row"><i class="fas fa-clock ukfw-contact-icon"></i><span>'+CONTACT.hours+'</span></div></div>';
  }
  function aiMsg(html){var msgs=document.getElementById('ukfw-msgs');var row=document.createElement('div');row.className='ukfw-row ukfw-in';row.innerHTML='<div class="ukfw-row-av">'+agent.initials+'</div><div class="ukfw-col"><div class="ukfw-msg">'+html+'</div><span class="ukfw-time">'+now()+'</span></div>';msgs.appendChild(row);scrollMsgs();}
  function userMsg(txt){var msgs=document.getElementById('ukfw-msgs');var row=document.createElement('div');row.className='ukfw-row u ukfw-in';row.innerHTML='<div class="ukfw-col"><div class="ukfw-msg">'+esc(txt)+'</div><span class="ukfw-time">'+now()+'</span></div><div class="ukfw-row-av" style="background:var(--ukf-navy);color:var(--ukf-gold);">You</div>';msgs.appendChild(row);scrollMsgs();}
  function typing(){var msgs=document.getElementById('ukfw-msgs');var d=document.createElement('div');d.id='ukfw-typing';d.className='ukfw-row';d.innerHTML='<div class="ukfw-row-av">'+agent.initials+'</div><div class="ukfw-typing"><span></span><span></span><span></span></div>';msgs.appendChild(d);scrollMsgs();}
  function rmTyping(){var t=document.getElementById('ukfw-typing');if(t)t.remove();}
  function scrollMsgs(){var m=document.getElementById('ukfw-msgs');if(m)m.scrollTop=m.scrollHeight;}
  function now(){return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
})();
