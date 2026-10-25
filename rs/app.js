
// RST (Rich, 23 Oct: "i m not sure why you are not 100 instrumented by now"; "instrument that code so we can see what is the hold up"): the phone's
// own timings, in ms from the moment the page was asked for: each mark, and each call to the app (start, end, and the app's own load and work
// time from its answer). Sent to the Perf log (perfPhone) in parts: what is new since the last part, with the calls still waiting for an answer.
window.RST=window.RST||(function(){var T=function(){return Math.round(performance.now());},R={ev:[],calls:[],fly:{},k:0,sent:0,e0:0,c0:0,url:"",page:location.pathname,id:Math.random().toString(36).slice(2,8),
 mark:function(n){if(R.ev.length<400)R.ev.push([String(n).slice(0,80),T()]);},
 call:function(fn){var s=T(),i=++R.k;R.fly[i]=[String(fn).slice(0,30),s];return function(sv){delete R.fly[i];if(R.calls.length<400)R.calls.push([String(fn).slice(0,30),s,T(),sv&&sv[0]||0,sv&&sv[1]||0]);};},
 send:function(why){if(R.sent>=40||!R.url)return;if(R.e0>=R.ev.length&&R.c0>=R.calls.length&&why!=="leave")return;R.sent++;
  var fly=[];for(var k in R.fly)fly.push([R.fly[k][0],R.fly[k][1]]);
  var o={p:R.page,id:R.id,part:R.sent,why:String(why||""),now:T(),ev:R.ev.slice(R.e0),calls:R.calls.slice(R.c0),fly:fly,tap:-1,nav:0};R.e0=R.ev.length;R.c0=R.calls.length;
  if(R.sent===1){try{var n=performance.getEntriesByType("navigation")[0];if(n)o.nav=[Math.round(n.responseStart),Math.round(n.domInteractive),Math.round(n.domContentLoadedEventEnd)];}catch(e){}
   try{var tp=sessionStorage.getItem("rs_tap");if(tp){o.tap=Math.max(-1,Date.now()-Number(tp)-T());sessionStorage.removeItem("rs_tap");}}catch(e){}}
  try{fetch(R.url,{method:"POST",body:JSON.stringify({fn:"perfPhone",args:[o]}),keepalive:true,credentials:"omit"}).catch(function(){});}catch(e){}}};
 document.addEventListener("DOMContentLoaded",function(){R.mark("page ready");});
 setInterval(function(){R.send("every 30 s");},30000);
 addEventListener("pagehide",function(){R.send("leave");});return R;})();

;

(function(){
var API="https://script.google.com/macros/s/AKfycby2obxweLHic-kW3KuLjCF3aMjoR5-X5qFcR16vc3-geiIdK6RjO3M5E6xXSYySJ2Gc/exec",SPF="1CbXFQlj7QkQTyhfyUQWHyZCr6r-If4OZ",DK="AIzaSyCvm-_NB3jtiHuiK9PxYXQaAJiWhPFBjM8";
if(window.RS_TEST)API=window.RS_TEST;window.RST.url=API;
// sign-in links belong to /admin (dashboard shares, invites, event links, one-time passes)
var Q0=new URLSearchParams(location.search);
if(Q0.get("ref")||Q0.get("pg")||Q0.get("otp")){location.replace("/admin/"+location.search);return;}
var $=function(i){return document.getElementById(i);};
var esc=function(t){return String(t===null||t===undefined?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});};
var LS={get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},set:function(k,v){try{localStorage.setItem(k,v);}catch(e){}},del:function(k){try{localStorage.removeItem(k);}catch(e){}}};
// ---- the phone's ID: localStorage, else the cookie; a new one if neither
function pidOf(){var p=LS.get("rs_pid");if(!/^[a-f0-9]{32}$/.test(p||"")){var m=document.cookie.match(/(?:^|; )rs_pid=([a-f0-9]{32})/);p=m?m[1]:"";}
 if(!p){var a=new Uint8Array(16);try{crypto.getRandomValues(a);}catch(e){for(var i=0;i<16;i++)a[i]=Math.floor(Math.random()*256);}p=Array.prototype.map.call(a,function(x){return("0"+x.toString(16)).slice(-2);}).join("");}
 LS.set("rs_pid",p);try{document.cookie="rs_pid="+p+"; max-age=63072000; path=/; SameSite=Lax; Secure";}catch(e){}return p;}
// the Red Shift pass (rsPass): only a live one (24 h from its stamp, as /admin reads it)
function passOk(t){try{var f=atob(String(t).split(".")[1].replace(/-/g,"+").replace(/_/g,"/")).split("|");return f[0]==="rsp1"&&Number(f[2])+86400000>Date.now()+60000;}catch(e){return false;}}
var PID=pidOf(),PASS=LS.get("rsPass")||"";if(PASS&&!passOk(PASS))PASS="";
function passSet(t){if(!t)return;PASS=t;LS.set("rsPass",t);}
// ---- the server (the same answer shape as /admin)
function call(fn,args){var done=window.RST.call(fn);return fetch(API,{method:"POST",body:JSON.stringify({fn:fn,args:args||[],p:PASS}),credentials:"omit"}).then(function(r){return r.text();}).then(function(t){var j;try{j=JSON.parse(t);}catch(e){done(null);throw new Error("Red Shift is busy. Please try again.");}done(j.sv);if(!j.ok)throw new Error(j.error||"Server error");return j.result;});}
window.RUN=function(){var ok,no,o={withSuccessHandler:function(f){ok=f;return o;},withFailureHandler:function(f){no=f;return o;},rpc:function(fn,a){call(fn,a).then(function(r){if(ok)ok(r);},function(e){if(no)no(e);});}};return o;};
// ---- the measured screen; phone or laptop
function fit(){var vv=window.visualViewport,h=Math.round((vv&&vv.height)||innerHeight||0),S=screen.height||h;if(!h||h>S)h=(screen.availHeight||S)-100;h=Math.max(320,h);
 document.documentElement.style.setProperty("--H",h+"px");
 var fine=false;try{fine=matchMedia("(pointer:fine)").matches;}catch(e){}
 document.body.classList.toggle("wide",innerWidth>innerHeight&&innerWidth>=900&&fine);}
fit();addEventListener("resize",fit);try{visualViewport.addEventListener("resize",fit);}catch(e){}addEventListener("orientationchange",function(){setTimeout(fit,250);});
// ---- the address
function where(){var p=location.pathname.replace(/\/+$/,"").replace(/^\/+/,"").split("/"),a=(p[0]||"").toLowerCase(),q=p.slice(1).join("/");
 try{q=decodeURIComponent(q);}catch(e){}
 /* Rich, 23 Oct ("you should be restful  ..  /splash  /pitstop /admin"; "just build it"): /splash keeps the splash up; /pitstop shows the pit stop alone and keeps it up, live */if(a==="splash")return{splash:1,land:1,page:"home",q:""};if(a==="pitstop")return{pit:1,land:1,page:"home",q:""};/* Rich, 25 Oct ("rs.v/spash  rs.v/pitstop  rs.v/home   etc"): /home is the home screen alone: no splash, no pit stop */if(a==="home")return{home:1,page:"home",q:""};if(a==="qr")return{land:1,page:"new",q:q};if(a==="newbooks")return{page:"new",q:q};if(a==="mybooks")return{page:"mine"};if(a==="dashboard")return{page:"dash"};if(a==="links")return{page:"links"};
 return{land:1,page:"home",q:""};}
var W=where(),S={act:false,books:[],named:false,first:"",q:""};
if(W.q!==undefined&&W.page==="new"){if(W.q)LS.set("rs_q",W.q);else LS.del("rs_q");}
var QN=W.q||LS.get("rs_q")||"",CODE=(Q0.get("c")||"").replace(/[^a-f0-9e]/g,"").slice(0,24);
if(CODE)try{history.replaceState(null,"",location.pathname);}catch(e){}
// ---- icons (the approved mockups, 19 Oct)
var IC={dash:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 54h44" stroke="#0B1A4F" stroke-width="5"/><path d="M16 46V32M28 46V22" stroke="#0B1A4F" stroke-width="6"/><path d="M40 46V12" stroke="#C8102E" stroke-width="6"/><path d="M52 46V28" stroke="#0B1A4F" stroke-width="6"/></svg>',
 mine:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="10" width="40" height="48" rx="6" stroke="#0B1A4F" stroke-width="5"/><rect x="24" y="5" width="16" height="9" rx="3" fill="#C8102E"/><path d="M22 35l7 7 14-15" stroke="#C8102E" stroke-width="5"/></svg>',
 "new":'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="10" width="40" height="48" rx="6" stroke="#0B1A4F" stroke-width="5"/><rect x="24" y="5" width="16" height="9" rx="3" fill="#C8102E"/><path d="M32 26v20M22 36h20" stroke="#C8102E" stroke-width="5"/></svg>',
 door:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30L32 10l24 20" stroke="#0B1A4F" stroke-width="5"/><path d="M15 26v28h34V26" stroke="#0B1A4F" stroke-width="5"/><rect x="27" y="36" width="10" height="18" rx="2" fill="#C8102E"/></svg>',
 call:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="6" width="28" height="52" rx="6" stroke="#0B1A4F" stroke-width="5"/><path d="M28 48h8" stroke="#C8102E" stroke-width="5"/></svg>',
 text:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14h44v28H30l-12 10V42h-8z" stroke="#0B1A4F" stroke-width="5"/><path d="M22 28h2M32 28h2M42 28h2" stroke="#C8102E" stroke-width="5"/></svg>',
 // Rich, 20 Oct: "a small icon of a QR with a door or arrow that is clickable to goto the QR page" (the Owner's home page)
 qr:'<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="18" height="18" rx="3" stroke="#0B1A4F" stroke-width="4"/><rect x="12" y="12" width="6" height="6" fill="#0B1A4F"/><rect x="40" y="6" width="18" height="18" rx="3" stroke="#0B1A4F" stroke-width="4"/><rect x="46" y="12" width="6" height="6" fill="#0B1A4F"/><rect x="6" y="40" width="18" height="18" rx="3" stroke="#0B1A4F" stroke-width="4"/><rect x="12" y="46" width="6" height="6" fill="#0B1A4F"/><path d="M33 49h21M46 41l8 8-8 8" stroke="#C8102E" stroke-width="5"/></svg>'};
var ML={door:"Walk",call:"Call",text:"Text"};
function card(id,label,ic,sub,n){return '<button class="card" data-go="'+esc(id)+'"><span><span class="label">'+esc(label)+'</span>'+(sub?'<span class="sub">'+esc(sub)+'</span>':"")+'</span><span class="ic">'+IC[ic]+(n?'<b class="bub">'+n+'</b>':"")+'</span></button>';}
var FOOT='';   // no sponsor line under the screens (Rich, 19 Oct: "since we have the splash.  remove the BCGOP stuff from the bottom")
// Register, subtle, at the foot of every screen for anyone not registered (Rich, 19 Oct: "put a subtle registere at the bottom for all non0registered")
function foot(){return S.reg?'':'<div class="reg"><a href="'+esc(S.regUrl||"/admin/")+'">Register</a></div>';}
function frame(inner,back,title){$("app").innerHTML='<div class="top"><div class="word"><span class="r">Red</span><span class="s">shift</span></div>'+'</div>'+(title?'<div class="ttl">'+esc(title)+'</div>':"")+inner+foot();
 // 22 Oct (Rich: "a 2nd click was qued and use went from QR to call book"): a tap made while the screen before was still up (a second tap
 // on Continue as guest, or on the QR) lands on whatever is drawn under the finger next; the screen's buttons take no tap for its first 700 ms
 var t0=Date.now();[].forEach.call(document.querySelectorAll("#app [data-go]"),function(b){b.onclick=function(){if(Date.now()-t0<700)return;go(b.getAttribute("data-go"));};});}
// ---- the bottom bar (Rich, 20 Oct: "a tool bar similiar to chrome bottom bar"; "nice large and very simple outline icons"): Back, Home;
// the Owner: the QR (not on the QR page) and Tests (Rich, 21 Oct: "put a test page on the tool bar"); admins: Admin
var TBI={back:'<path d="M15 4l-8 8 8 8"/>',home:'<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v10h13V10"/>',
 qr:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><path d="M13.5 13.5h3v3h-3zM19.5 13.5v.01M13.5 19.5h7"/>',
 admin:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/>',
 test:'<path d="M9 3h6M10 3v6l-5 9.5c-.6 1.1.2 2.5 1.5 2.5h11c1.3 0 2.1-1.4 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>'};
var NAVN=0,ONQR=false,TVID=0,CUR="";
function tbar(){var t=$("tb");if(!t)return;var b=function(k,lab,extra){return '<button type="button" data-tb="'+k+'" aria-label="'+lab+'"'+(extra||"")+'><svg viewBox="0 0 24 24">'+TBI[k]+'</svg></button>';};
 t.innerHTML=b("back","Back",NAVN>0?"":' class="off"')+b("home","Home",!ONQR&&(CUR==="home"||!S.adm&&CUR==="new")?' class="off"':"")+((S.owner||S.qrm)&&!ONQR?b("qr","Event QR code"):"")+(S.owner?b("test","Tests"):"")+(S.admin?'<a href="/admin/" data-tb="admin" aria-label="Admin"><svg viewBox="0 0 24 24">'+TBI.admin+'</svg></a>':"");
 t.hidden=false;document.body.classList.add("tbon");}
document.addEventListener("click",function(e){var x=e.target&&e.target.closest&&e.target.closest("#tb [data-tb]");if(!x)return;var k=x.getAttribute("data-tb");
 if(k==="back"){if(NAVN>0)history.back();}else if(k==="home"){if(ONQR)return location.assign("/home");go("home");}else if(k==="qr")go("qr");
 else if(k==="test")call("testToken",[PASS]).then(function(tk){if(tk)location.href=API+"/tests?tk="+encodeURIComponent(tk);}).catch(function(){});});
var PATHS={home:"/",new:"/newbooks",mine:"/mybooks",dash:"/dashboard",links:"/links"};
function go(id){if(/^(walk|call|text)$/.test(id))return tap(id);if(/^b:/.test(id))return openBook(id.slice(2));
 if(id==="qr"){if(location.pathname.replace(/\/+$/,"")!=="/qr"){history.pushState({p:"qr"},"","/qr");NAVN++;}return qrTry();}
 if(PATHS[id]){var p=PATHS[id]+(id==="new"&&W.q?"/"+encodeURIComponent(W.q):"");if(location.pathname!==p){history.pushState({p:id},"",p);NAVN++;}show(id);}}
addEventListener("popstate",function(){NAVN=Math.max(0,NAVN-1);W=where();/* 25 Oct (Rich: "end up on QR code screen some how"): Back never opens the QR screen again; only the QR icon does */if(/^\/qr\/?$/.test(location.pathname)){try{history.replaceState(null,"","/home");}catch(e){}W=where();return show("home");}show(W.page);});
var NOTE="";
function show(id){QG++;window.RST.mark("show "+id);window.scrollTo(0,0);/* 21 Oct (Rich: "did you chanage the color scheme ?"): the pit stop poster turns the page navy and locks scrolling while it is up; once it is gone, every screen gets the page back */if(!document.getElementById("lnd")){var de0=document.documentElement.style,bd0=document.body.style;de0.overflow="";de0.background="";bd0.overflow="";bd0.background="";bd0.height="";}if(ONQR){ONQR=false;TVID++;document.body.classList.remove("tvm");}setTimeout(tbar,0);
 if(!S.adm&&id!=="links")id="new";
 CUR=id;
 if(id==="home")return frame((NOTE?'<div class="note">'+esc(NOTE)+'</div>':"")+'<div class="list">'+card("dash","Dashboard","dash")+card("mine","My Books","mine","",(S.books||[]).length)+card("new","New Books","new","Call \u00b7 Walk \u00b7 Text")+'</div>');
 if(id==="new"){statGet();var have={};S.books.forEach(function(b){have[b.mode]=b;});
  return frame((S.code==="used"||S.code==="bad"?'<div class="note">This code was already used. Register to join the team.</div>':"")+(S.qbad?'<div class="note bad">That list is not available. These books come from the main list.</div>':"")+'<div class="list">'+["walk","call","text"].map(function(m){var k=m==="walk"?"door":m,b=have[k]&&!have[k].done?have[k]:null;return card(m,ML[k],k,b?"Open your "+ML[k]+" book":"");}).join("")+'</div>'+bcBox(),S.act,S.act?"New Books":"");}
 // Rich, 24 Oct: finished books and "Give back this book" (99zzzye): each book shows Finished or how many are left, with a Give back button
 if(id==="mine"){frame(S.books.length?'<div class="list">'+S.books.map(function(b){var u=b.mode==="door"?"doors":"people";wpFix(b);return card("b:"+b.id,ML[b.mode]+" book",b.mode,b.nick+" · "+(b.done?"Finished":(b.left!=null?b.left+" of "+(b.total!=null?b.total:(b.mode==="door"?b.doors:b.people))+" "+(b.unit||u)+" left":(b.mode==="door"?b.doors:b.people)+" "+u)))+bkIcons(b)+'<button type="button" class="btn alt" data-gb="'+esc(b.id)+'">Give back this book</button>';}).join("")+'</div>'
  :'<div class="note">No books yet on this phone.</div><div class="list">'+card("new","New Books","new")+'</div>',true,"My Books");
  [].forEach.call(document.querySelectorAll("[data-gb]"),function(x){x.onclick=function(){giveBack(x.getAttribute("data-gb"));};});bkWire();return;}
 if(id==="dash"){frame('<div class="list"><div class="spin"></div></div>',true,"Dashboard");return call("vDash",[PID,PASS]).then(dash,function(e){frame('<div class="note bad">'+esc(e.message)+'</div>',true,"Dashboard");});}
 if(id==="links"){frame('<div class="list"><div class="spin"></div></div>',true,"Links");return call("vLinks",[PASS]).then(function(r){
  frame(r.links.map(function(l){var real=l.path.indexOf("<")<0;return '<div class="lk">'+(real?'<a href="'+esc(l.path)+'">redshift.vote'+esc(l.path)+'</a>':'<b>redshift.vote'+esc(l.path)+'</b>')+(l.admin?'<i>ADMIN</i>':"")+'<p>'+esc(l.what)+'</p></div>';}).join(""),true,"Links");},function(e){frame('<div class="note bad">'+esc(e.message)+'</div>',true,"Links");});}
 show("home");}
function dash(r){
 if(r.full){frame('<iframe id="dashf" title="Dashboard"></iframe>',true,"Dashboard");var f=$("dashf");f.setAttribute("sandbox","allow-scripts allow-popups");f.srcdoc=r.html;return;}
 var m=r.mine||{},n=function(x,d){x=Number(x)||0;return d?(Math.round(x*10)/10).toLocaleString("en-US"):Math.round(x).toLocaleString("en-US");};
 frame('<div class="stat"><div><b>'+n(m.doors)+'</b><span>Doors</span></div><div><b>'+n(m.con)+'</b><span>Talked to</span></div><div><b>'+n(m.votes,1)+'</b><span>Votes</span></div><div><b>'+n((m.mins||0)/60,1)+'</b><span>Hours</span></div></div>'+
  '<div class="note">Your own numbers. The whole dashboard opens once you register and are approved, or are marked Trusted.</div>',true,"Dashboard");}
// ---- sheets
// ---- Who the app thinks you are (Rich, 21 Oct: "it would be nice to know if it actually knows me.  should we put up a little provile circle
// in the upper right w a pic?"; "build teh circle w sign out and i can test the round trip"): signed in with Google -> the Google photo
// (kept from the sign-in) or initials; a guest let in -> grey initials; tap -> name, email, Sign out (or Sign in with Google)
function meInfo(){var w=S.who||null,k=null;try{k=JSON.parse(LS.get("rsMe")||"null");}catch(e){}
 if(PASS&&w&&w.email){var pic=k&&k.email===String(w.email).toLowerCase()?k.pic:"";return {signed:true,name:w.name||(k&&k.name)||w.email,email:w.email,pic:pic};}
 if(S.adm)return {signed:false,name:S.name||S.first||"Guest",email:"",pic:""};return null;}
function meIni(n){var p=String(n||"").replace(/@.*/,"").split(/[\s._-]+/).filter(Boolean);return ((p[0]||"G").charAt(0)+(p.length>1?p[p.length-1].charAt(0):"")).toUpperCase();}
function meFace(m){return m.pic?'<img src="'+esc(m.pic)+'" alt="" referrerpolicy="no-referrer">':esc(meIni(m.name));}
function meDraw(){var m=meInfo(),b=$("me");if(!m){if(b)b.hidden=true;return;}
 if(!b){b=document.createElement("button");b.id="me";b.type="button";b.setAttribute("aria-label","Who is signed in");document.body.appendChild(b);b.onclick=mePanel;}
 b.className=m.signed?"in":"";b.innerHTML=meFace(m);b.hidden=false;var im=b.querySelector("img");if(im)im.onerror=function(){b.textContent=meIni(m.name);};}
function mePanel(){var m=meInfo();if(!m)return;
 sheet('<div class="mew"><div class="mec"'+(m.signed?' style="background:var(--navy)"':'')+'>'+meFace(m)+'</div><div><b>'+esc(m.name)+'</b><span>'+(m.signed?esc(m.email)+'<br>Signed in with Google':'Guest on this phone')+'</span></div></div>'+
  (m.signed?'<button class="btn" id="meo">Sign out</button>':'<button class="btn" id="mei">Sign in with Google</button>')+(m.signed?'<button class="btn alt" id="meinv">Invite</button><button class="btn alt" id="mecfg">Configure Campaign</button>':'')+'<button class="btn alt" id="meoc">Record DNC / DNT</button><button class="btn alt" id="mex">Close</button>');
 $("mex").onclick=shut;$("meoc").onclick=optSheet;if($("meinv"))$("meinv").onclick=invSheet;if($("mecfg"))$("mecfg").onclick=function(){shut();cfgOpen();};
 if($("meo"))$("meo").onclick=function(){try{if(window.google&&google.accounts&&google.accounts.id)google.accounts.id.disableAutoSelect();}catch(e){}LS.del("rsPass");LS.del("rsMe");PASS="";location.href="/";};
 if($("mei"))$("mei").onclick=function(){shut();signIn(function(){location.reload();},false);};}
// Rich, 24 Oct: "logging a DNC or DNT for a book the person no longer has ... a drop down even better so the user can enter their code";
// "call it DNC and DNT"; then "take the number and write it to the outbox and be done" and a pop-up "no matter what screen the user is on" when
// the server finds the code was not good (99zzzyk ocPost). DNC = no calls, DNT = no texts.
// ---- Invite, under the profile (Rich, 25 Oct: "i want (under my profile) the invite functionality that use to be in admin.  do not cache
// anyting"; 99zzzyz siteinvite.js): the kinds this person may send, the campaign, their name and email, the message; sent by text, by
// Red Shift's email, or as a group link. Every step asks the server (nothing kept on the phone).
var INV=null,IKT={V:"Volunteer",TV:"Volunteer",CA:"Campaign Admin",AA:"App Admin"};
function invShare(t,ph){if(ph){location.href="sms:"+ph+"&body="+encodeURIComponent(t);return;}if(navigator.share){navigator.share({text:t}).catch(function(){});return;}location.href="sms:?&body="+encodeURIComponent(t);}
// the share sheet needs a fresh tap (iPhone refuses it after waiting on the server): one button that opens it
function shareSheet(t,title,ph){BUSY=0;sheet((title?'<h3>'+esc(title)+'</h3>':'')+'<button class="btn" id="shs">Send</button><button class="btn alt" id="shx">Close</button>');$("shs").onclick=function(){invShare(t,ph);shut();};$("shx").onclick=shut;}
function invSheet(){busy("One moment...");call("sInvite",[]).then(function(r){if(!r.ok)return oops(r.msg||"Please try again.");INV=r;BUSY=0;
 sheet('<h3>Invite</h3>'+r.kinds.map(function(k){return '<button class="btn alt" data-ik="'+esc(k.k)+'">'+esc(k.label)+'</button>';}).join("")+'<button class="btn alt" id="ikx">Close</button>');
 $("ikx").onclick=shut;[].forEach.call(document.querySelectorAll("[data-ik]"),function(b){b.onclick=function(){invKind(b.getAttribute("data-ik"));};});},function(e){oops(e.message);});}
function invKind(k){var K=INV.kinds.filter(function(x){return x.k===k;})[0];if(!K)return;
 if(k==="DI"){busy("One moment...");return call("sDashLink",[]).then(function(r){var u=r&&r.url;if(!u)return oops((r&&r.msg)||"No link. Please try again.");BUSY=0;
   sheet('<h3>Dashboard Invite</h3><button class="btn" id="dit">Text</button><button class="btn alt" id="dig">Gmail</button><button class="btn alt" id="dix">Close</button>');
   $("dit").onclick=function(){invShare(u);};/* tapped here: the share sheet is allowed */$("dig").onclick=function(){window.open("https://mail.google.com/mail/?view=cm&fs=1&su="+encodeURIComponent("Red Shift dashboard")+"&body="+encodeURIComponent(u),"_blank");};$("dix").onclick=shut;},function(e){oops(e.message);});}
 var cs=K.camps||[],grp=k==="V"||k==="TV",tpl=(INV.msgs&&INV.msgs[IKT[k]])||INV.def;
 sheet('<h3>'+esc(K.label)+'</h3>'+(cs.length>1?'<label>Campaign</label><select id="ikc">'+cs.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.label)+'</option>';}).join("")+'</select>':'')+
  '<label>Find</label><input id="iks" maxlength="60" autocomplete="off" placeholder="Name"><div id="ikl"></div><label>Their name</label><input id="ikn" maxlength="60"><label>Their email</label><input id="ike" type="email" maxlength="120"><label>Message</label><textarea id="ikm" rows="5" style="width:100%;box-sizing:border-box;font:inherit;padding:10px;border-radius:12px;border:1px solid #DDE2EE"></textarea><div class="msg" id="ikmsg"></div>'+
  '<button class="btn" id="ikt">Text</button><button class="btn alt" id="ikr">Email from Red Shift</button>'+(grp?'<button class="btn alt" id="ikg">Group link</button>':'')+'<button class="btn alt" id="ikb">Back</button>');
 $("ikm").value=tpl;$("ikb").onclick=invSheet;
 /* 25 Oct (Rich: "in the invite, i need the search feature...many invites are to our PDs"): find the person by name (99zzzyz sInvitePeople); a pick fills their name and email, and Text goes to their phone */
 var IPH="",IST=null,ISQ=0;$("iks").oninput=function(){clearTimeout(IST);var v=$("iks").value.trim();if(v.length<2){$("ikl").innerHTML="";return;}IST=setTimeout(function(){var g=++ISQ;call("sInvitePeople",[v]).then(function(r){if(g!==ISQ||!r||!r.ok)return;
   $("ikl").innerHTML=(r.people||[]).map(function(x,i){return '<button type="button" class="btn alt" data-ip="'+i+'" style="text-align:left;font-size:15px;padding:10px 14px">'+esc(x.name)+' <small style="opacity:.6">'+esc(x.badge)+(x.where?' · '+esc(x.where):'')+'</small></button>';}).join("");
   [].forEach.call(document.querySelectorAll("[data-ip]"),function(b){b.onclick=function(){var x=r.people[Number(b.getAttribute("data-ip"))];$("ikn").value=x.name;$("ike").value=x.email||"";IPH=String(x.phone||"").replace(/[^0-9]/g,"");$("ikl").innerHTML="";$("iks").value="";};});});},300);};
 var camp=function(){return cs.length>1?$("ikc").value:(cs[0]?cs[0].id:"");};
 var make=function(ch,then){var em=$("ike").value.trim();if(ch==="red"&&!em){$("ikmsg").textContent="Add their email.";return;}$("ikmsg").textContent="One moment...";
  call("sNewInvite",[{kind:k,campaign:camp(),name:$("ikn").value.trim(),email:em,channel:ch,text:$("ikm").value}]).then(function(r){if(!r.ok){$("ikmsg").textContent=r.msg||"Please try again.";return;}$("ikmsg").textContent=r.msg||"";if(then)then(r);},function(e){$("ikmsg").textContent=e.message;});};
 $("ikt").onclick=function(){make("text",function(r){shareSheet(r.text,K.label,IPH);});};
 $("ikr").onclick=function(){make("red");};
 if($("ikg"))$("ikg").onclick=function(){$("ikmsg").textContent="One moment...";call("sInviteGroup",[{kind:k,campaign:camp()}]).then(function(r){if(!r.ok){$("ikmsg").textContent=r.msg||"Please try again.";return;}$("ikmsg").textContent=(r.uses||0)+" signed up with this link.";shareSheet(r.link,K.label);},function(e){$("ikmsg").textContent=e.message;});};}
// ---- My Books: send a book, a personal nickname (Rich, 25 Oct; 99zzzza booksend.js). The share icon (Trusted only) reserves the book for
// 4, 8, 12 or 24 hours and opens the phone's share sheet with the message and the link (the link last, so the text app shows its card); the
// book stays here, Pending, until someone opens the link; the small x takes the send back. The pencil sets this person's own name for it.
var BKI={share:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7h14v-7"/></svg>',
 pen:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
function bkIcons(b){var h=b.sent?Math.max(0,Math.ceil((b.sent.until-Date.now())/3600000)):0;
 return '<div class="bki" style="display:flex;align-items:center;gap:14px;justify-content:flex-end;margin:-4px 18px 8px;color:var(--navy);font-size:14px">'+
  (b.sent?'<span style="opacity:.75">Pending · '+h+' h</span><button type="button" data-bx="'+esc(b.id)+'" aria-label="Take the send back" style="border:0;background:none;padding:4px;color:inherit;opacity:.6">'+BKI.x+'</button>':
   (S.canSend?'<button type="button" data-bs="'+esc(b.id)+'" aria-label="Send this book" style="border:0;background:none;padding:4px;color:inherit">'+BKI.share+'</button>':''))+
  '<button type="button" data-bn="'+esc(b.id)+'" aria-label="Nickname" style="border:0;background:none;padding:4px;color:inherit;opacity:.7">'+BKI.pen+'</button></div>';}
function bkOf(id){return (S.books||[]).filter(function(b){return b.id===id;})[0];}
function bkWire(){[].forEach.call(document.querySelectorAll("[data-bs]"),function(x){x.onclick=function(){bkSend(x.getAttribute("data-bs"));};});
 [].forEach.call(document.querySelectorAll("[data-bx]"),function(x){x.onclick=function(){var b=bkOf(x.getAttribute("data-bx"));if(!b)return;obAdd("vSendCancel",[PID,b.id]);delete b.sent;show("mine");};});
 [].forEach.call(document.querySelectorAll("[data-bn]"),function(x){x.onclick=function(){bkNick(x.getAttribute("data-bn"));};});}
function bkSend(id){var b=bkOf(id);if(!b)return;BUSY=0;
 sheet('<h3>Send this book</h3><p style="text-align:center">Reserve it for</p><div class="szs">'+[4,8,12,24].map(function(h){return '<button type="button" class="btn alt" data-bh="'+h+'">'+h+' h</button>';}).join("")+'</div><div class="msg" id="bsm"></div><button class="btn alt" id="bsx">Cancel</button>');
 $("bsx").onclick=shut;
 [].forEach.call(document.querySelectorAll("[data-bh]"),function(x){x.onclick=function(){var h=Number(x.getAttribute("data-bh"));$("bsm").textContent="One moment...";
  /* 25 Oct (Rich: "when i share a book, you using a long thread instead to fhte pipe"): the send link is made ahead (b.sk, 99zzzzd); the tap opens the share sheet at once and the send goes into the outbox */
  if(b.sk){var sk=b.sk;delete b.sk;obAdd("vSendRec",[PID,sk,h]);var r0={ok:true,first:S.sf||S.first||"",hours:h,link:location.origin+"/r/?s="+sk};return go(r0);}
  call("vSend",[PID,b.id,h]).then(go,function(e){$("bsm").textContent=e.message;});
  function go(r){if(!r.ok){$("bsm").textContent=r.msg||"Please try again.";return;}
   var nm=String(r.first||S.first||"").trim();
   var t="Hi! "+nm+" is inviting you to help save Michigan by reaching Republicans who tend to skip midterms.\n\nReply IN if we can count on your help, then tap the card below to start.\n\nThis invite expires in "+r.hours+" hours because we are running out of time.\n\n"+r.link;
   b.sent={until:Date.now()+r.hours*3600000,h:r.hours};show("mine");shareSheet(t,"Send this book");}};});}
function bkNick(id){var b=bkOf(id);if(!b)return;BUSY=0;
 sheet('<h3>Nickname</h3><input id="bnn" maxlength="40" value="'+esc(b.nick||"")+'"><button class="btn" id="bns">Save</button><button class="btn alt" id="bnx">Cancel</button>');
 $("bnx").onclick=shut;$("bnn").focus();
 $("bns").onclick=function(){var n=$("bnn").value.replace(/\s+/g," ").trim().slice(0,40);obAdd("vNick",[PID,b.id,n]);if(!b.own)b.own=b.nick;b.nick=n||b.own;shut();show("mine");};}
// ---- Configure Campaign, under the profile (Rich, 25 Oct; 99zzzzc configure.js): a campaign's admins send their files (each button with its
// (i)) and write About [Candidate]. Files go up in 4 MiB pieces, one after another (the pipe), into Imported Files; the Owner is emailed. About
// goes to the Owner for approval: this phone texts the Owner the link.
var CFGI={GOPX:"Your district's voters from GOP Data Center, as a CSV (or the .zip it downloads as).\n\nInclude every voter in your district, with these columns: VoterKey (Voter ID), name, address, precinct, County, Congressional, State Senate and State House districts, School District, County Commissioner District and Township, plus phones and absentee status.\n\nRed Shift builds your walk, call and text books from it. A county export can be 300 MB: keep this page open until the upload says Received.",
 TGT:"Optional: the voters you want contacted.\n\nA CSV with a header row and one column named VoterKey (the GOP Data Center voter key), one voter per row. Other columns are ignored.\n\nExample:\nVoterKey\n123456789\n987654321\n\nLeave it out and Red Shift works from your whole district.",
 ABEV:"How to get this file from GOP Data Center: 1. Open Advanced Counts and select your race's voters (its district), then add Voter Frequency > Absentee for this election. Do not exclude returned ballots: Red Shift counts them. 2. Preview the count, then Export File. 3. List Style: ABEV List. Pick this election from the drop-down. 4. Format: CSV. Export Data Now. 5. My Data > My Exports: download it when it is ready, then choose it here (the zip or the csv). A new export each day keeps Ballot Chase current.",
 VBK:"A list you already keep, in any layout: a spreadsheet or CSV of voters with your own notes or contact results.\n\nInclude a voter ID, or name and full address, on each row so we can match voters. We map the columns for you.",
 SCR:"Call, text or door scripts you already use: Word, Google Doc, PDF or plain text.\n\nWe set them up as your Red Shift scripts; you can edit them after.",
 OTH:"Anything else for your campaign: walk lists, event plans, logos.\n\nName the file so we know what it is (for example: Logo - Smith for Senate.png)."};
var CFG=null,CFGC=null;
function cfgOpen(){frame('<div class="list"><div class="spin"></div></div>',true,"Configure Campaign");call("sConfig",[]).then(function(r){if(!r.ok)return frame('<div class="note bad">'+esc(r.msg||"Please try again.")+'</div>',true,"Configure Campaign");CFG=r;CFGC=CFGC&&r.camps.some(function(c){return c.id===CFGC;})?CFGC:r.camps[0].id;cfgDraw();},function(e){frame('<div class="note bad">'+esc(e.message)+'</div>',true,"Configure Campaign");});}
function cfgDraw(){var c=CFG.camps.filter(function(x){return x.id===CFGC;})[0],A=c.about||{};
 var row=function(t){return '<div class="lk" style="padding:12px 16px"><div style="display:flex;align-items:center;gap:10px"><b style="flex:1">'+esc(t.label)+'</b><button type="button" class="ii" data-ci="'+t.k+'" aria-label="How" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--navy);background:#fff;color:var(--navy);font:700 15px Georgia,serif">i</button><label class="btn alt" style="width:auto;margin:0;padding:8px 14px;font-size:15px">Upload<input type="file" data-cu="'+t.k+'" hidden></label></div><div data-cx="'+t.k+'" hidden style="white-space:pre-line;font-size:14px;line-height:1.45;margin-top:8px;color:#333">'+esc(CFGI[t.k]||"")+'</div><div class="msg" data-cm="'+t.k+'"></div></div>';};
 frame((CFG.camps.length>1?'<div class="lk"><label>Campaign</label><select id="cfc">'+CFG.camps.map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===CFGC?' selected':'')+'>'+esc(x.label)+'</option>';}).join("")+'</select></div>':'<div class="note">'+esc(c.label)+'</div>')+
  CFG.types.map(row).join("")+
  '<div class="lk" style="padding:12px 16px"><b>About '+esc(c.candidate)+'</b>'+(A.status?'<div style="font-size:13px;opacity:.7;margin-top:2px">'+esc(A.status)+(A.notes?': '+esc(A.notes):'')+'</div>':'')+
  '<label>Photo</label>'+(A.photo?'<img src="'+esc(A.photo)+'" alt="" style="max-width:120px;border-radius:10px;display:block;margin:4px 0">':'')+'<input type="file" id="cap" accept="image/*">'+
  '<label>About the candidate</label><textarea id="cat" rows="5" maxlength="1500" style="width:100%;box-sizing:border-box;font:inherit;padding:10px;border-radius:12px;border:1px solid #DDE2EE">'+esc(A.text||"")+'</textarea>'+
  '<label>Website</label><input id="caw" maxlength="300" value="'+esc(A.web||"")+'" placeholder="https://"><label>Facebook page</label><input id="caf" maxlength="300" value="'+esc(A.fb||"")+'" placeholder="https://facebook.com/">'+
  '<div class="msg" id="cam"></div><button class="btn" id="cas">Send for approval</button></div>'+
  (c.files.length?'<div class="lk" style="padding:12px 16px"><b>Sent</b>'+c.files.map(function(f){return '<div style="font-size:14px;margin-top:6px">'+esc(f.file)+' <small style="opacity:.65">'+esc(f.type)+' · '+esc(f.status)+(f.on?' · '+esc(f.on):'')+'</small></div>';}).join("")+'</div>':''),true,"Configure Campaign");
 if($("cfc"))$("cfc").onchange=function(){CFGC=$("cfc").value;cfgDraw();};
 [].forEach.call(document.querySelectorAll("[data-ci]"),function(b){b.onclick=function(){var x=document.querySelector('[data-cx="'+b.getAttribute("data-ci")+'"]');x.hidden=!x.hidden;};});
 [].forEach.call(document.querySelectorAll("[data-cu]"),function(inp){inp.onchange=function(){var f=inp.files&&inp.files[0];if(f)cfgUp(c.id,inp.getAttribute("data-cu"),f);inp.value="";};});
 $("cas").onclick=function(){cfgAbout(c);};}
// the pipe: 4 MiB pieces, one after another; a piece that fails is sent again (3 tries, then the upload stops and says so)
function cfgUp(el,k,f){var m=document.querySelector('[data-cm="'+k+'"]'),PS=4194304,t0=Date.now();m.textContent="Starting...";
 call("sCfgUpStart",[{el:el,type:k,name:f.name,size:f.size,mime:f.type||"application/octet-stream"}]).then(function(r){if(!r.ok){m.textContent=r.msg||"Please try again.";return;}
  var send=function(at,tries){var b=f.slice(at,Math.min(f.size,at+PS)),rd=new FileReader();rd.onload=function(){var b64=String(rd.result).replace(/^data:[^,]*,/,"");
    call("sCfgUpPart",[at,b64]).then(function(x){if(!x.ok){if(tries<3)return setTimeout(function(){send(at,tries+1);},2000);m.textContent=x.msg||"The upload stopped. Please try again.";return;}
     if(x.done){m.textContent="Received.";BUSY=0;sheet('<h3>Received</h3><p style="text-align:center">We will send you a message when your campaign is ready.</p><button class="btn" id="cfok">OK</button>');$("cfok").onclick=function(){shut();cfgOpen();};return;}
     var nx=x.next||at+b.size;m.textContent=Math.floor(nx*100/f.size)+"% sent";send(nx,0);},function(){if(tries<3)return setTimeout(function(){send(at,tries+1);},3000);m.textContent="No connection. The upload stopped; please try again.";});};
   rd.onerror=function(){m.textContent="This file could not be read.";};rd.readAsDataURL(b);};
  send(0,0);},function(e){m.textContent=e.message;});}
// a photo: made 800 px wide at most (a JPEG), then About goes for approval; the Owner gets the link by text from this phone
function cfgAbout(c){var m=$("cam"),pf=$("cap").files&&$("cap").files[0];m.textContent="One moment...";
 var go=function(ph){call("sAboutSave",[c.id,{text:$("cat").value,web:$("caw").value,fb:$("caf").value,photo:ph}]).then(function(r){if(!r.ok){m.textContent=r.msg||"Please try again.";return;}m.textContent="";
   var t=r.body+"\n\n"+r.link;BUSY=0;sheet('<h3>Send for approval</h3><button class="btn" id="cat2">Text it</button><button class="btn alt" id="catx">Close</button>');
   $("cat2").onclick=function(){location.href="sms:"+(r.to||"")+"?&body="+encodeURIComponent(t);shut();cfgOpen();};$("catx").onclick=function(){shut();cfgOpen();};},function(e){m.textContent=e.message;});};
 if(!pf)return go("");
 var rd=new FileReader();rd.onload=function(){var im=new Image();im.onload=function(){var w=Math.min(800,im.width),h=Math.round(im.height*w/im.width),cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(im,0,0,w,h);go(cv.toDataURL("image/jpeg",0.85));};im.onerror=function(){m.textContent="This photo could not be read.";};im.src=rd.result;};rd.readAsDataURL(pf);}
function optSheet(){BUSY=0;sheet('<h3>Record DNC / DNT</h3><label>Ref code (at the bottom of the text)</label><input id="ocx" maxlength="5" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase"><div class="msg" id="ocm"></div><div class="szs"><button type="button" class="btn alt" data-oc="dnc">DNC</button><button type="button" class="btn alt" data-oc="dnt">DNT</button></div><button class="btn alt" id="ocb">Close</button>');
 $("ocb").onclick=shut;$("ocx").focus();
 [].forEach.call(document.querySelectorAll("[data-oc]"),function(b){b.onclick=function(){var kind=b.getAttribute("data-oc"),code=$("ocx").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,""),L=kind==="dnc"?"DNC":"DNT";
  if(!/^[A-Z0-9]{5}$/.test(code)){$("ocm").textContent="The Ref code is 5 letters and numbers.";return;}
  var q=ocQ();q.push({id:(Date.now().toString(36)+Math.random().toString(36).slice(2,8)),code:code,kind:kind});ocSet(q);
  sheet('<h3>Recorded</h3><p style="text-align:center">'+esc(L)+' for Ref code '+esc(code)+'.</p><button class="btn" id="ocd">OK</button>');$("ocd").onclick=shut;ocDrain();};});}
function ocQ(){try{return JSON.parse(LS.get("rs_ocq")||"[]")||[];}catch(e){return [];}}
function ocSet(q){try{if(q.length)LS.set("rs_ocq",JSON.stringify(q));else LS.del("rs_ocq");}catch(e){}}
var OCB=0;
function ocDrain(){var q=ocQ();if(!q.length||OCB)return;OCB=1;
 call("ocPost",[PID,q.slice(0,20)]).then(function(r){OCB=0;var res=(r&&r.res)||[],done={},bad=[];res.forEach(function(x){if(x.ok||x.bad){done[x.id]=1;if(x.bad)bad.push(x);}});
  ocSet(ocQ().filter(function(x){return !done[x.id];}));
  if(bad.length){var x=bad[0];BUSY=0;sheet('<h3>Check the Ref code</h3><p style="text-align:center">'+esc(x.code)+': '+esc(x.msg||"That code was not found.")+'</p><button class="btn" id="ocr">Try again</button><button class="btn alt" id="ocz">Close</button>');$("ocz").onclick=shut;$("ocr").onclick=function(){optSheet();$("ocx").value=x.code;};}
 },function(){OCB=0;});}
setTimeout(ocDrain,3000);document.addEventListener("visibilitychange",function(){if(!document.hidden)ocDrain();});
// Rich, 24 Oct: "fininished books should be auto released from mybooks"; "i had to go in and out for the CWT page to realize the book was
// actually done": a book page on this phone flags its book done (rs_bookdone:<id>, 97q) the moment nobody is left to text; here the flagged
// books leave this phone's list at once (and are let go on the server, 99zzzye vGiveBack), when the app opens or comes back to the front
// Rich, 24 Oct: "the mybook shows 4 doors left, but inside the book is 21/21": a walk book's count on My Books is the walk app's own count
// on this phone (34 qrwalk paint() writes rs_walkprog:<k>; rs_bookdone:k:<k> when every stop is done).
function wkOf(b){var m=/[?&]k=([A-Za-z0-9]+)/.exec(String(b.launch||""));return m?m[1]:"";}
function wpFix(b){if(b.mode!=="door")return;var k=wkOf(b),w=null;if(!k)return;try{w=JSON.parse(LS.get("rs_walkprog:"+k)||"null");}catch(e){w=null;}
 if(w&&w.t>0){b.total=w.t;b.left=Math.max(0,w.t-w.n);b.unit="doors";b.done=b.left===0;}}
function doneSweep(quiet){if(!S||!S.books||!S.books.length)return;var gone=[];
 S.books=S.books.filter(function(b){var k="rs_bookdone:"+b.id,wk=wkOf(b),k2=wk?"rs_bookdone:k:"+wk:"",f=null;try{f=localStorage.getItem(k)||(k2&&localStorage.getItem(k2));}catch(e){}if(!f)return true;gone.push(b.id);try{localStorage.removeItem(k);if(k2)localStorage.removeItem(k2);}catch(e){}return false;});
 gone.forEach(function(id){gbAdd(id);});
 if(gone.length&&!quiet&&CUR&&/^(home|new|mine)$/.test(CUR))show(CUR);}
document.addEventListener("visibilitychange",function(){if(!document.hidden)doneSweep();});addEventListener("pageshow",function(){doneSweep();});
function sheet(h){$("shb").innerHTML=h;$("sh").hidden=false;}
function shut(){$("sh").hidden=true;$("shb").innerHTML="";}
$("sh").onclick=function(e){if(e.target===$("sh")&&!BUSY)shut();};
var BUSY=0;
function busy(t){BUSY=1;sheet('<div class="spin"></div><p style="text-align:center">'+esc(t)+'</p>');}
function oops(t){BUSY=0;sheet('<h3>Sorry</h3><p>'+esc(t)+'</p><button class="btn" id="sx">OK</button>');$("sx").onclick=shut;}
// ---- New Books: a name first (first name, last name, last 4 of the phone), then the book
function tap(m){if(!S.adm){if(PASS){location.href=S.regUrl||"/admin/";return;}return knownSheet(function(){location.reload();});}
 // Rich, 19 Oct: "admin should get a pop up...is this a preview or are you taking this book as yours"; "admins can previuew the CWT scrresn wo claiming them"
 // 25 Oct (Rich: "get rid of book preview.  no need"): no Preview / Take a book choice for admins
 if(!S.named)return nameSheet(function(){tap(m);});size(m);}
// Rich, 24 Oct: "add a selection of 5, 25, 50, 75, 100 and let people choose what size of book they want ... The size of 5 is to be inviting":
// a book of this kind already held opens as before; otherwise the size first (the standard size, from the ready queue, is marked)
var SZ=[5,25,50,75,100],SZD={door:25,call:100,text:100};
function size(m){var k=m==="walk"?"door":m,hb=S.admin?null:S.books.filter(function(b){return b.mode===k&&!b.done;})[0];   /* 25 Oct (Rich: "n books of each kind for a total of 200 voters per kind"; "admin only.  non admin gets one of each"; the server holds the quota, 99zzzzb) */
 // Rich, 24 Oct: one book of each kind at a time; New Books with an unfinished one asks: open it, or give it back and get a new one ("that is smart")
 if(hb){sheet('<h3>Your '+esc(ML[k])+' book</h3><p style="text-align:center">'+(hb.left!=null?esc(hb.left+" "+(hb.unit||(k==="door"?"doors":"people"))+" left"):"")+'</p><button class="btn" id="hbo">Open my book</button><button class="btn alt" id="hbn">Give it back and get a new one</button>');
  $("hbo").onclick=function(){shut();build(m);};
  $("hbn").onclick=function(){gbAdd(hb.id);BUSY=0;shut();size(m);};return;}
 sheet('<h3>'+esc(ML[k])+' book</h3><p style="text-align:center">'+(k==="door"?"How many doors?":"How many people?")+'</p><div class="szs">'+SZ.map(function(n){return '<button type="button" class="btn'+(n===SZD[k]?"":" alt")+'" data-sz="'+n+'">'+n+'</button>';}).join("")+'</div>');
 [].forEach.call(document.querySelectorAll("[data-sz]"),function(b){b.onclick=function(){shut();build(m,Number(b.getAttribute("data-sz")));};});}
// a guest on a browser not let in yet: Your info -> vKnown (a guest let in before comes in; anyone else: scan the event QR code or sign in)
function knownSheet(done){BUSY=0;
 sheet('<h3>Your info</h3><label>First name</label><input id="kf" autocomplete="given-name" maxlength="40"><label>Last name</label><input id="kl" autocomplete="family-name" maxlength="40"><label>Last 4 digits of your phone</label><input id="k4" inputmode="numeric" maxlength="4" pattern="[0-9]*"><div class="msg" id="km"></div><button class="btn" id="kgo">Continue</button><button class="btn alt" id="kgg">Sign in with Google</button>');
 $("kgg").onclick=function(){location.href=S.regUrl||"/admin/";};
 $("kgo").onclick=function(){var f=$("kf").value.trim(),l=$("kl").value.trim(),p=$("k4").value.replace(/\D/g,""),bt=this;
  if(!f){$("km").textContent="Add your first name.";return;}if(p.length!==4){$("km").textContent="Add the last 4 digits of your phone number.";return;}
  bt.disabled=true;call("vKnown",[PID,f,l,p]).then(function(r){if(!r.ok||!r.in){$("km").textContent=r.msg||"Please try again.";bt.disabled=false;return;}shut();done();},function(e){$("km").textContent=e.message;bt.disabled=false;});};}
// give a book back (99zzzye vGiveBack): it comes off the phone and its voters not yet reached go back for other volunteers
function giveBack(id){BUSY=0;sheet('<h3>Give back this book?</h3><p>The people you have not reached go back for other volunteers.</p><button class="btn" id="gby">Give it back</button><button class="btn alt" id="gbn">Keep it</button>');
 $("gbn").onclick=shut;$("gby").onclick=function(){gbAdd(id);BUSY=0;shut();show("mine");};}
// 25 Oct (Rich: "why does give back this book not just go into the outbox command que?  why does it wait on http"): a give-back is a command in
// the phone's outbox (rs_gbq), as DNC / DNT are (rs_ocq): the book leaves the phone at once and the outbox sends it, again until the server has
// it. A new book asked for meanwhile carries the give-backs still waiting, so the server lets them go first.
function gbQ(){try{return JSON.parse(LS.get("rs_gbq")||"[]")||[];}catch(e){return [];}}
function gbSet(q){try{if(q.length)LS.set("rs_gbq",JSON.stringify(q));else LS.del("rs_gbq");}catch(e){}}
function gbOut(){var q=gbQ();if(q.length&&S&&S.books)S.books=S.books.filter(function(b){return q.indexOf(b.id)<0;});}
var GBB=0;
function gbAdd(id){var q=gbQ();if(q.indexOf(id)<0)q.push(id);gbSet(q);gbOut();setTimeout(gbDrain,0);}
function gbDrain(){var q=gbQ();if(!q.length||GBB)return;GBB=1;var id=q[0];
 call("vGiveBack",[PID,id]).then(function(){GBB=0;gbSet(gbQ().filter(function(x){return x!==id;}));gbDrain();},function(){GBB=0;setTimeout(gbDrain,15000);});}
setTimeout(gbDrain,3000);document.addEventListener("visibilitychange",function(){if(!document.hidden)gbDrain();});
// 25 Oct (Rich: "so another button that does not use the outbox ?"): every command button (That's me, the Welcome back tie) goes into one outbox
// on the phone (rs_ob): the screen goes on at once; the outbox sends in order, again until the server has it. A new book waits for the
// outbox to be sent first (only while something is in it), so the server knows who is asking. then: "reload" = the page reloads once sent.
function obQ(){try{return JSON.parse(LS.get("rs_ob")||"[]")||[];}catch(e){return [];}}
function obSet(q){try{if(q.length)LS.set("rs_ob",JSON.stringify(q));else LS.del("rs_ob");}catch(e){}}
var OBB=0,OBW=[];
function obAdd(fn,args,then){var q=obQ();q.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),fn:fn,args:args,then:then||""});obSet(q);setTimeout(obDrain,0);}
function obDrain(){var q=obQ();if(!q.length){if(OBHOLD)return;var w=OBW;OBW=[];w.forEach(function(f){f();});return;}if(OBB)return;OBB=1;var x=q[0];
 call(x.fn,x.args).then(function(r){OBB=0;obSet(obQ().filter(function(y){return y.id!==x.id;}));if(x.then==="name"){obName(x,r);return obDrain();}if(x.then==="reload"&&r&&r.ok!==false){if(!obQ().length)return location.reload();}if(r&&r.ok===false&&r.msg)oops(r.msg);obDrain();},function(){OBB=0;setTimeout(obDrain,15000);});}
function obFlush(){return new Promise(function(res){if(!obQ().length)return res();OBW.push(res);setTimeout(function(){if(!OBHOLD)res();},10000);obDrain();});}
setTimeout(obDrain,3000);document.addEventListener("visibilitychange",function(){if(!document.hidden)obDrain();});
function nameSheet(then){BUSY=0;
 // Rich, 20 Oct: "do not add cute shit like that. Title that page as: Your info"
 sheet('<h3>Your info</h3><label>First name</label><input id="nf" autocomplete="given-name" maxlength="40"><label>Last name</label><input id="nl" autocomplete="family-name" maxlength="40"><label>Last 4 digits of your phone</label><input id="n4" inputmode="numeric" maxlength="4" pattern="[0-9]*"><div class="msg" id="nm"></div><button class="btn" id="ngo">Continue</button>');
 $("nf").focus();$("ngo").onclick=function(){var f=$("nf").value.trim(),l=$("nl").value.trim(),p=$("n4").value.replace(/\D/g,"");
  if(!f){$("nm").textContent="Add your first name.";return;}if(p.length!==4){$("nm").textContent="Add the last 4 digits of your phone number.";return;}
  /* 25 Oct (Rich: "yes"): the name goes into the outbox and the screen goes on; a match on file asks Welcome back when the server answers (obName) */
  obAdd("vName",[PID,f,l,p],"name");S.named=true;S.first=f;shut();then();};}
// the server's answer to a name in the outbox: a match asks Welcome back; the outbox (and a new book waiting on it) holds until answered
var OBHOLD=0;
function obName(x,r){if(!r||r.ok===false){S.named=false;return oops((r&&r.msg)||"Please try again.");}if(!r.ask)return;var f=x.args[1],l=x.args[2],p=x.args[3];OBHOLD=1;BUSY=0;
 sheet('<h3>Welcome back!</h3><p>Continue as '+esc(r.ask)+'?</p><button class="btn" id="ty">That\'s me</button><button class="btn alt" id="tn">Not me</button>');
 var tie=function(yes){obAdd("vTie",[PID,r.k,r.s,yes,f,l,p]);S.first=(yes?String(r.ask||f):f).split(" ")[0];OBHOLD=0;shut();obDrain();};
 $("ty").onclick=function(){tie(true);};$("tn").onclick=function(){tie(false);};}
// Rich, 19 Oct: "on the C W T page, put a checkbox for Ballot Chase. and put a Stat for XX contact YY Not Contacted"; "the check box switches the XX and YY totals"
// Rich, 19 Oct: "on the New Books page you will put one of those down up arrows that expands an info pane. It wil lbe called the Targets: The title
// will be Krieger Targets inside SJPS and then you will list the stats as bullets. So drop the checkbox ... But it starts with the total pool"
function statTxt(){var t=STAT;if(!t||!t.q)return '';var n=function(x){return (Number(x)||0).toLocaleString("en-US");};
 var wct=function(X){return '<div class="wct"><div><b>'+n(X.d)+'</b><span>Doors</span></div><div><b>'+n(X.c)+'</b><span>Calls</span></div><div><b>'+n(X.t)+'</b><span>Texts</span></div></div>';};
 var hd=function(lb,X){return '<h4>'+lb+' = '+n(X.n)+'</h4><p class="cn">Contacted <b>'+n(X.att)+'</b> · Not contacted <b>'+n(X.n-X.att)+'</b></p>';};
 return '<div class="tgx">'+esc(tgTitle())+'</div><div class="sec">'+hd("Target Voters",t.q)+wct(t.q)+'</div><div class="sec">'+hd("AB Target Voters",t.qa)+wct(t.qa)+'</div>';}
function tgTitle(){return (STAT&&STAT.query||S.q||"")==="38-sjps"?"SJPS within HD-38":"Target Voters";}
// Rich, 20 Oct: "if collapsed. only show target voters. The second line is the title of the expanded section, centered"
function bcBox(){return '<div class="bc'+(S.tgo?' open':'')+'"><button type="button" class="tgh" id="tgh" aria-expanded="'+(S.tgo?"true":"false")+'"><span><span>Target Voters</span></span><i aria-hidden="true">&#9662;</i></button><div class="bcs" id="bcs"'+(S.tgo?'':' hidden')+'>'+statTxt()+'</div></div>';}
// Rich, 20 Oct: "this needs to be cached during spash": asked for while the splash shows, kept in the page (no new cache)
var STAT=null,STATASK=0;function statGet(){if(STATASK)return;STATASK=1;call("vStat",[QN]).then(function(r){if(r&&r.ok){STAT=r;var e=$("bcs");if(e)e.innerHTML=statTxt();}else STATASK=0;},function(){STATASK=0;});}
document.addEventListener("click",function(e){var b=e.target&&e.target.closest&&e.target.closest("#tgh");if(!b)return;S.tgo=!S.tgo;var x=$("bcs");if(x)x.hidden=!S.tgo;b.setAttribute("aria-expanded",S.tgo?"true":"false");b.parentNode.className="bc"+(S.tgo?" open":"");});
function build(m,sz){var k=m==="walk"?"door":m;busy("Getting your "+ML[k]+" book...");
 obFlush().then(function(){return call("vNew",[PID,m,QN,false,sz||SZD[k],null,gbQ(),LS.get("rs_wid")||""]);}).then(function(r){
  if(r.need==="name"){S.named=false;return nameSheet(function(){build(m,sz);});}
  if(r.reg){if(PASS){location.href=S.regUrl||"/admin/";return;}return knownSheet(function(){location.reload();});}
  if(!r.ok)return oops(r.msg||"Please try again.");
  var b=r.book;S.books=S.books.filter(function(x){return x.id!==b.id;}).concat([b]);S.act=true;
  /* 25 Oct (Rich: "you are basically rendering the same mape in two different apps"; "i want it faster"): no route pop-up; a new walk book brings its walk page and its walk (99zzzyu), kept in the tab for the walk page on /m/ */
  if(k==="door"&&r.fresh&&r.walk&&r.walk.k){try{sessionStorage.setItem("rs_wp:"+r.walk.k,JSON.stringify(r.walk));}catch(e){}}
  /* 25 Oct: a Call / Text book just handed out carries its link: straight to it (the open call was a second round trip, about 3 s) */
  if(r.fresh&&b.launch){try{if(r.page&&r.page.t&&r.page.r)sessionStorage.setItem("rs_bp:"+r.page.t,JSON.stringify(r.page.r));}catch(e){}window.RST.mark("tap book");try{sessionStorage.setItem("rs_tap",String(Date.now()));}catch(e){}window.RST.mark("book link");window.RST.send("open book");return location.replace(b.launch);}
  openBook(b.id);
 },function(e){oops(e.message);});}
function openBook(id){busy("Opening your book...");window.RST.mark("tap book");try{sessionStorage.setItem("rs_tap",String(Date.now()));}catch(e){}call("vOpen",[PID,id]).then(function(r){if(!r.ok)return oops(r.msg);window.RST.mark("book link");window.RST.send("open book");location.replace(r.launch);},function(e){oops(e.message);});}
// ---- the route pop-up
var LF=null;
function leaflet(done){if(window.L&&L.map)return done();if(LF)return LF.push(done);LF=[done];
 var c=document.createElement("link");c.rel="stylesheet";c.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";document.head.appendChild(c);
 var s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";s.onload=function(){var f=LF;LF=null;f.forEach(function(x){x();});};s.onerror=function(){var f=LF;LF=null;f.forEach(function(x){x(true);});};document.head.appendChild(s);}
function route(b){var R=$("rt"),ord=b.stops.slice(),mk=[],line=null,map=null;
 R.className="";R.hidden=false;
 R.innerHTML='<div class="rh"><b>Your route</b><span>'+ord.length+' doors</span></div><div id="rmap"></div><div id="rtc" hidden></div>'+
  '<div class="ra" id="ra1"><button class="btn red" id="rok">Approve</button><button class="btn alt" id="rch">Change order</button></div>'+
  '<div class="ra" id="ra2" hidden><button class="btn" id="rsv">Save</button><button class="btn alt" id="rcx">Cancel</button></div>';
 function pins(){if(!map)return;mk.forEach(function(m){map.removeLayer(m);});mk=[];if(line)map.removeLayer(line);var pts=[];
  ord.forEach(function(s,i){if(!s[2]||!s[3])return;pts.push([s[2],s[3]]);mk.push(L.marker([s[2],s[3]],{icon:L.divIcon({className:"",html:'<div class="pin'+(i===0?" f":"")+'">'+(i+1)+'</div>',iconSize:[26,26],iconAnchor:[13,13]})}).addTo(map));});
  line=L.polyline(pts,{color:"#0B1A4F",weight:3,opacity:.55}).addTo(map);return pts;}
 leaflet(function(bad){if(bad){$("rmap").innerHTML='<p style="padding:20px;color:#4a5578">The map could not load. The order is below.</p>';return;}
  map=L.map("rmap",{zoomControl:true,tap:true});L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
  var pts=pins();if(pts&&pts.length)map.fitBounds(pts,{padding:[24,24]});else map.setView([42.06,-86.5],13);});
 function chart(){$("rtc").innerHTML='<table><thead><tr><th>Address</th><th>Order</th><th>New order</th></tr></thead><tbody>'+
   ord.map(function(s,i){return '<tr><td>'+esc(s[1])+'</td><td class="n">'+s[0]+'</td><td><input inputmode="numeric" data-i="'+i+'" value="'+(i+1)+'"></td></tr>';}).join("")+'</tbody></table>';
  [].forEach.call(document.querySelectorAll("#rtc [data-i]"),function(x){x.onchange=function(){var i=Number(x.getAttribute("data-i")),n=Math.round(Number(x.value));
   if(!(n>=1))n=1;if(n>ord.length)n=ord.length;var s=ord.splice(i,1)[0];ord.splice(n-1,0,s);chart();pins();};});}
 $("rok").onclick=function(){R.hidden=true;openBook(b.id);};
 $("rch").onclick=function(){R.className="ch";$("rtc").hidden=false;$("ra1").hidden=true;$("ra2").hidden=false;chart();setTimeout(function(){if(map)map.invalidateSize();},60);};
 $("rcx").onclick=function(){ord=b.stops.slice();R.className="";$("rtc").hidden=true;$("ra1").hidden=false;$("ra2").hidden=true;pins();setTimeout(function(){if(map)map.invalidateSize();},60);};
 $("rsv").onclick=function(){var btn=this;btn.disabled=true;btn.textContent="Saving...";
  call("vOrder",[PID,b.id,ord.map(function(s){return s[4];})]).then(function(r){btn.disabled=false;btn.textContent="Save";
   if(!r.ok){alertIn(r.msg);return;}b=r.book||b;ord=b.stops.slice();R.className="";$("rtc").hidden=true;$("ra1").hidden=false;$("ra2").hidden=true;pins();setTimeout(function(){if(map)map.invalidateSize();},60);},
   function(e){btn.disabled=false;btn.textContent="Save";alertIn(e.message);});};
 function alertIn(t){var p=document.createElement("p");p.style.cssText="margin:0 18px;color:#C8102E;font-size:14px";p.textContent=t;R.insertBefore(p,$("ra2"));setTimeout(function(){p.remove();},4000);}}
// ---- the splash (every load), then New Books (a new phone), or the pit stop and home
var T0=Date.now(),SPL=null;
(function(){var put=function(h){if(!h||h===SPL)return;SPL=h;var w=$("spw");if(w&&!w.classList.contains("out"))w.innerHTML=h;};put(LS.get("rsSplash"));
 if(!window.RS_TEST)fetch("https://www.googleapis.com/drive/v3/files/"+SPF+"?alt=media&key="+DK).then(function(r){return r.ok?r.text():null;}).then(function(h){if(h){LS.set("rsSplash",h);put(h);}},function(){});})();
function splashOff(){if(W.splash)return;try{sessionStorage.setItem("rsSpl","1");}catch(e){}window.RST.mark("splash off");setTimeout(function(){window.RST.send("home");},4000);var w=$("spw");if(!w)return;w.classList.add("out");setTimeout(function(){if(w.parentNode)w.parentNode.removeChild(w);},700);}
// 22 Oct (Rich: "the pitstop screen should listen to the dashboard proxy so it can update in realtime"): while the pit stop is up, its
// doors, calls and texts are asked for every 15 s (pitLive) and put on screen
var PITT=null,PITS=null;function pitLive(){clearTimeout(PITT);if(!$("lnd-k")){PITT=null;return;}if(!document.hidden)call("pitLive",[PITS]).then(function(x){if(!x||!x.ok)return;PITS=x.sig||null;clearTimeout(PITT);PITT=setTimeout(pitLive,x.held?50:15000);[["lnd-k",x.doors],["lnd-kc",x.calls],["lnd-kt",x.texts]].forEach(function(a){var e=$(a[0]);if(e)e.textContent=Math.max(0,Math.round(Number(a[1])||0)).toLocaleString("en-US");});},function(){clearTimeout(PITT);PITT=setTimeout(pitLive,15000);});PITT=setTimeout(pitLive,40000);}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&$("lnd-k"))pitLive();});
// Rich, 23 Oct ("is pit stop polling ?"): the scoreboard drawn after sign-in had nothing asking for new numbers; any scoreboard on screen starts the asking
setInterval(function(){if($("lnd-k")&&!PITT)pitLive();},3000);
/* 25 Oct (Rich: "your pitstop cache is not working.  that thing should be instant"): the phone keeps its last pit stop and draws it at once; the
// server's fresh copy is kept for next time and, while the poster is still up, gives it the card's words and the numbers (no second draw) */
function pitK(){return "rsPit:"+(PID||"")+(PASS?":s":"");}
function pitKept(){var h=LS.get(pitK());return h?{html:h,kept:1}:null;}
function pitFresh(pr){if(!pr||!pr.html)return;LS.set(pitK(),pr.html);if(!$("lnd"))return;try{var t=document.createElement("template");t.innerHTML=pr.html;var a=t.content.querySelector("#ptc .pt-c"),b=document.querySelector("#ptc .pt-c");if(a&&b)b.innerHTML=a.innerHTML;["lnd-k","lnd-kc","lnd-kt"].forEach(function(i){var x=t.content.getElementById?t.content.getElementById(i):t.content.querySelector("#"+i),y=$(i);if(x&&y)y.textContent=x.textContent;});}catch(e){}}
function pit(r){window.RST.mark("pit stop");var p=$("pit");/* Rich, 23 Oct: "i want the pitstop page in all its glory wo the buttons": /pitstop?embed (for Wix): no buttons, no card, no "do not show" box *//* Rich, 23 Oct: "replace that with on the bottom with Volunteer with us Today  At the top, ut CALL to ACTION Patriots"; "take the button outlines off.  remove the orb and make the text stretch accross the screen.  make the doors, calls, and text bigger"; "remove teh spash screen and go straight to the pitstop poster"; "put volunteer w u today in the red ccolor" (the poster's RED, #ba0010); "Teh top line should just be all capps  call to action"; "big white font" (the top line as wide as the screen); "spread those 3 stats out.  put some horizontal space between them" (the gap between the numbers more than doubled); "Call to acton shoud be 2x" (twice, or as wide as the page allows); "reduce that top font to fit w the logo there" (clear of the logo, run again after the poster is placed); "need another adjustment" (a wide, short window: the line ran into VOTE RED; it now stops above the art); "spread those numbers out at the bottom" (across 90% of the BERRIEN COUNTY line); "make it a red bar/banner all the way acrross and mke the letters white w read banner background": the two buttons become labels (no tap, no outline) sized to the width; the numbers sized to fill the width; no orb, no splash */if(W.pit&&Q0.get("embed")!==null){var EH=String(r.html).replace(/<button type="button" class="lnd-b lnd-top"[^>]*>[\s\S]*?<\/button>/g,'<button type="button" class="lnd-b lnd-top" disabled style="cursor:default;opacity:1">CALL TO ACTION</button>').replace(/<button type="button" class="lnd-b lnd-bot[^"]*"[^>]*>[\s\S]*?<\/button>/g,'<button type="button" class="lnd-b lnd-bot" disabled style="cursor:default;opacity:1;color:#fff;background:#ba0010;width:100vw;border-radius:0;justify-content:center">Volunteer with us Today</button>');var ET='<button type="button" class="lnd-b lnd-top" disabled style="cursor:default;opacity:1">CALL TO ACTION</button>',EB='<button type="button" class="lnd-b lnd-bot" disabled style="cursor:default;opacity:1;color:#fff;background:#ba0010;width:100vw;border-radius:0;justify-content:center">Volunteer with us Today</button>';/* a signed-in phone's poster has no top button (and may have no bottom one): add them */if(EH.indexOf('class="lnd-b lnd-bot')<0){var EP=EH.indexOf('</div><div id="lnd-pt"');if(EP>=0)EH=EH.slice(0,EP)+EB+EH.slice(EP);}if(EH.indexOf('class="lnd-b lnd-top"')<0){var EQ=EH.indexOf(EB);if(EQ>=0)EH=EH.slice(0,EQ)+ET+EH.slice(EQ);}EH=EH.replace("sbt=bt-(92-52*t)*k-312*k,pt=top+100*k+g","sbt=bt-(152-52*t)*k-312*k,pt=top+134*k+g");/* Rich, 24 Oct: "make those same changes to the actual url graphic" (the link picture: "save michigan can be bigger"; "the blue part of the flag should be expanded to ew dont have red on red"): the star field only behind the poster (/pitstop-stars.jpg), and on a wide screen SAVE MICHIGAN as tall as VOTE RED less 5% */var BM=EH.match(/#lnd-p\{[^}]*?url\("([^"]+)"\)/);if(BM)EH=EH.split(BM[1]).join("/pitstop-stars.jpg");EH=EH.replace("sS=av/S[4],need=V[3]*sT+S[3]*sS+M[3]*sT+2*gap+2*mg,f=Math.min(1,FW/need);sT*=f;sS*=f;","sS=av/S[4],sM=0.95*av/M[4],need=V[3]*sT+S[3]*sS+M[3]*sM+2*gap+2*mg,f=Math.min(1,FW/need);sT*=f;sS*=f;sM*=f;").replace("var tot=V[3]*sT+S[3]*sS+M[3]*sT+2*gap","var tot=V[3]*sT+S[3]*sS+M[3]*sM+2*gap").replace('put("sm",x,mid-M[4]*sT/2,M[3]*sT,M[4]*sT,u);','put("sm",x,mid-M[4]*sM/2,M[3]*sM,M[4]*sM,u);');/* Rich, 23 Oct: "move the Berrien county line up some to get some space between teh stat lines and the bottom line in Red": the scoreboard 60 higher; the poster starts below the taller top line */var EK='<script>(function(){function $(i){return document.getElementById(i);}var p=$("lnd-p");',EI=EH.indexOf(EK);if(EI>=0)EH=EH.slice(0,EI)+"<script>(function(){var c=document.createElement(\"canvas\").getContext(\"2d\");function w(f,t){c.font=f;return c.measureText(t).width;}function F(){var p=document.getElementById(\"lnd-p\");if(!p)return;[].forEach.call(document.querySelectorAll(\"#lnd .lnd-b\"),function(b){var x=w(\"700 100px Poppins,system-ui,sans-serif\",b.textContent);if(!x)return;var tp=/lnd-top/.test(b.className);b.style.setProperty(\"font-size\",\"calc(var(--u)*var(--k)*\"+Math.min(tp?150:82,100000/x)+\")\",\"important\");if(tp){var f=parseFloat(getComputedStyle(b).fontSize),cw=document.documentElement.clientWidth,av=0.94*cw,lg=document.getElementById(\"lnd-e-logo\");if(lg){var A=lg.getBoundingClientRect(),C=b.getBoundingClientRect();if(A.width&&A.bottom>C.top&&A.top<C.bottom){var m=(A.left<cw/2?A.right:cw-A.left)+0.02*cw;av=Math.min(av,cw-2*m);}}var hv=1e9,at=1e9;[\"vr\",\"state\",\"sm\"].forEach(function(n){var e=document.getElementById(\"lnd-e-\"+n);if(e){var r=e.getBoundingClientRect();if(r.height)at=Math.min(at,r.top);}});if(at<1e9)hv=Math.max(12,(at-b.getBoundingClientRect().top-0.01*innerHeight)/1.1);b.style.setProperty(\"font-size\",Math.min(2*f,av*100/x,hv)+\"px\",\"important\");}});var s=120,d=document.querySelectorAll(\"#lnd-nr>div\");[].forEach.call(d,function(x){var n=x.querySelector(\".n\"),l=x.querySelector(\".l\");if(!n||!l)return;var t=l.textContent;s+=Math.max(w(\"400 100px Anton,Impact,sans-serif\",n.textContent),w(\"700 24px Poppins,system-ui,sans-serif\",t)+(t.length-1)*5.33);});if(d.length)p.style.setProperty(\"--fn\",Math.min(230,100000/s));var ti=document.getElementById(\"lnd-ti\"),nr=document.getElementById(\"lnd-nr\");if(ti&&nr){var tw=ti.getBoundingClientRect().width;if(tw>nr.scrollWidth){nr.style.width=Math.round(0.9*tw)+\"px\";nr.style.justifyContent=\"space-between\";nr.style.position=\"relative\";nr.style.left=\"0px\";var A=ti.getBoundingClientRect(),B=nr.getBoundingClientRect();nr.style.left=Math.round((A.left+A.right-B.left-B.right)/2)+\"px\";}}}F();if(document.fonts){document.fonts.ready.then(F);}addEventListener(\"resize\",function(){setTimeout(F,300);});setTimeout(F,400);if(document.fonts)document.fonts.ready.then(function(){setTimeout(F,300);});})();<\/script>"+EH.slice(EI);r.html=EH+"<style>#lnd .lnd-b{border:0!important;padding:0!important;letter-spacing:0!important;font-size:calc(var(--u)*var(--k)*var(--fl,80))!important}#lnd-nr{gap:calc(var(--u)*var(--k)*var(--fn,150)*.6)!important}#lnd-nr .n{font-size:calc(var(--u)*var(--k)*var(--fn,150))!important}#lnd-nr .l{font-size:calc(var(--u)*var(--k)*var(--fn,150)*.24)!important;letter-spacing:calc(var(--u)*var(--k)*var(--fn,150)*.0533)!important;margin-right:calc(var(--u)*var(--k)*var(--fn,150)*-.0533)!important;margin-top:calc(var(--u)*var(--k)*var(--fn,150)*.1)!important}#lnd .lnd-top{height:auto!important;line-height:1.1!important}.lnd-orb,.lnd-rip{display:none!important}.lnd-b.lnd-tap{animation:none!important}#lnd-s,#lnd-ck,#ptc,#lnd-v1,#lnd-v2{display:none!important}</style>";}/* /pitstop: the celebration card (its own id "pit") would take this whole page down after 10 s */if(W.pit)r.html=String(r.html).replace(/<style>#pit\{[\s\S]*?go\(\);\}\)\(\);<\/script>/,"");p.innerHTML=r.html;if(p.querySelector("#lnd"))document.body.classList.add("pitup");PITT=setTimeout(pitLive,15000);
 [].forEach.call(p.querySelectorAll("script"),function(s){var n=document.createElement("script");n.text=s.text;s.parentNode.replaceChild(n,s);});
 var rg=$("lnd-rg");if(rg)rg.onclick=function(){location.href=r.reg||"/admin/";};if(W.pit){var lg=$("lnd-go");if(lg)lg.hidden=true;}try{if(!window.PITMO){window.PITMO=new MutationObserver(function(){if(document.getElementById("lnd"))return;document.body.classList.remove("pitup");var de0=document.documentElement.style,bd0=document.body.style;if(!de0.background&&!bd0.background&&!bd0.height)return;de0.overflow="";de0.background="";bd0.overflow="";bd0.background="";bd0.height="";});window.PITMO.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["style"]});}}catch(e){}}
// ---- Google sign-in on the volunteer pages (Rich, 20 Oct: the front door): no live pass -> the browser's Google account, the same check as /admin
var CID="40747318643-55gkq2jreqtaf9ec80qvtt35jrt81dpa.apps.googleusercontent.com",GSIQ=null,GSIDONE=null,GSITRIED=0,GSIWAIT=30000;
function gsiLoad(cb){if(window.google&&google.accounts&&google.accounts.id)return cb(true);if(GSIQ)return GSIQ.push(cb);GSIQ=[cb];
 var s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;
 s.onload=function(){var q=GSIQ;GSIQ=null;q.forEach(function(f){f(true);});};s.onerror=function(){var q=GSIQ;GSIQ=null;q.forEach(function(f){f(false);});};document.head.appendChild(s);}
function gsiInit(){google.accounts.id.initialize({client_id:CID,callback:gsiCred,auto_select:true,cancel_on_tap_outside:false,itp_support:true,use_fedcm_for_prompt:true});}
function gsiCred(c){try{var pl=JSON.parse(decodeURIComponent(escape(atob(String(c&&c.credential||"").split(".")[1].replace(/-/g,"+").replace(/_/g,"/")))));LS.set("rsMe",JSON.stringify({email:String(pl.email||"").toLowerCase(),name:pl.name||"",pic:pl.picture||""}));}catch(e){}call("vPass",[c&&c.credential||""]).then(function(r){if(!r||!r.ok)return;passSet(r.pass);if(GSIDONE){var d=GSIDONE;GSIDONE=null;d();}else{GSITRIED=1;boot();}},function(){});}
// Rich, 20 Oct: "you are not blocking on the google login": the splash stays until Google answers (a sign-in, or its prompt skipped or closed)
function gsi(done){var fired=0,fin=function(){if(fired)return;fired=1;GSIDONE=null;done();};GSIDONE=fin;setTimeout(fin,GSIWAIT);
 gsiLoad(function(ok){if(!ok)return fin();try{gsiInit();google.accounts.id.prompt(function(n){try{if(n.isSkippedMoment()||n.isDismissedMoment())setTimeout(function(){if(GSIDONE===fin)fin();},400);}catch(e){}});}catch(e){fin();}});}
// ---- /qr: the Owner's event code; a browser not signed in is told so, with Google's button (Rich, 20 Oct)
var ISQR=location.pathname.replace(/\/+$/,"")==="/qr"||/^\/qr\//.test(location.pathname);
// 22 Oct (Rich: "while waiting on QR code to render first page, a 2nd click was qued and use went from QR to call book"): the screen under
// the QR stayed up and could be tapped while the code was fetched; the wait now covers it, and an answer that comes after the person went
// elsewhere is dropped
var QG=0;
function qrTry(){var g=++QG;frame('<div class="list"><div class="spin"></div></div>',true);call("qrTv",[PASS,W.q||"",1]).then(function(r){if(g!==QG)return;if(r&&r.ok)return tv(r);if(r&&r.why==="signin"){PASS="";LS.del("rsPass");return qrSign();}boot();},function(){if(g===QG)boot();});}
function qrSign(){splashOff();frame('<div class="note">This browser is not signed in to Red Shift.</div><div id="gbtn" class="gbtn"></div>',true);
 gsiLoad(function(ok){if(!ok)return;try{gsiInit();google.accounts.id.renderButton($("gbtn"),{theme:"filled_blue",size:"large",shape:"pill",text:"signin_with",width:Math.max(200,Math.min(320,innerWidth-48))});}catch(e){}});}
// ---- the Perf Lab (Owner; redshift.vote/?lab): each mechanic 5 times cold and 5 times warm, best / middle / worst; Save keeps them
function lab(){splashOff();S.reg=true;var L=null,R=[],run=false;
 var draw=function(msg){frame('<div class="note">'+esc(msg||"Each mechanic runs 5 times cold (only its own kept copy dropped) and 5 times warm.")+'</div><div class="list"><button class="btn" id="lbgo"'+(run?" disabled":"")+'>Run</button>'+(R.length&&!run?'<button class="btn alt" id="lbsv">Save</button>':"")+'</div>'+
  (R.length?'<table class="lbt"><thead><tr><th>Mechanic</th><th></th><th>Best</th><th>Middle</th><th>Worst</th></tr></thead><tbody>'+R.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td><td>'+r[5]+'</td></tr>';}).join("")+'</tbody></table>':""),true,"Perf Lab");
  var g=$("lbgo");if(g)g.onclick=go;var v=$("lbsv");if(v)v.onclick=function(){v.disabled=true;call("perfLabSave",[PASS,R]).then(function(r){draw(r&&r.ok?"Saved to 1 Main > Perf Lab ("+r.n+" rows).":"Not saved.");});};};
 var one=function(name,how){return call("perfLab",[PASS,name,how]).then(function(r){return r&&r.ok?r.ms:-1;},function(){return -1;});};
 var go=function(){if(!L)return;run=true;R=[];var i=0,hows=["cold","warm"];
  var next=function(){if(i>=L.length*2){run=false;return draw("Done. "+R.length+" rows.");}var name=L[Math.floor(i/2)],how=hows[i%2],ms=[],k=0;draw("Running "+name+" ("+how+")...");
   var rep=function(){if(k>=5){var g=ms.filter(function(x){return x>=0;}).sort(function(a,b){return a-b;});R.push([name,how,g.length,g[0]||0,g[Math.floor(g.length/2)]||0,g[g.length-1]||0,ms.length-g.length?(ms.length-g.length)+" failed":""]);i++;return next();}
    one(name,how).then(function(x){ms.push(x);k++;rep();});};rep();};next();};
 call("perfLab",[PASS]).then(function(r){if(!r||!r.ok){frame('<div class="note bad">'+esc((r&&r.msg)||"For the Owner.")+'</div>',true,"Perf Lab");return;}L=r.list;draw();},function(e){frame('<div class="note bad">'+esc(e.message)+'</div>',true,"Perf Lab");});}
// ---- Sign in (Rich, 21 Oct: "i want our app to always challenge for the google login. and allow the user to contine on as a guest wo it.
// and when a user hits a qr: same thing"): a browser with no live pass gets Google's button and Continue as guest (Google's automatic
// prompt alone does not work on iPhone: "the normal One Tap UX doesn't work on Chrome on iOS, Safari, or Firefox", Google's One Tap guide)
// Rich, 24 Oct: "always give them guest option and if they are a recognized guest, then they should never have to re-enter": Continue as guest
// is always there; a browser not let in yet asks Your info and comes in when it matches a guest let in before (99zzzyd vKnown)
function signIn(go,guest,inn){var done=0,fin=function(){if(done)return;done=1;GSIDONE=null;GSITRIED=1;go();};GSIDONE=fin;
 setTimeout(function(){if(done)return;splashOff();
  frame('<div class="list"><div id="gbtn" class="gbtn" style="display:flex;justify-content:center;min-height:46px;margin-top:18px"></div>'+(guest?'<button class="btn alt" id="gsg">Continue as guest</button>':'')+'</div>',false);
  if(guest)$("gsg").onclick=function(){var on=function(){frame('<div class="list"><div class="spin"></div></div>',false);fin();};if(inn===false)return knownSheet(on);on();};
  gsiLoad(function(ok){if(!ok||done)return;try{gsiInit();google.accounts.id.renderButton($("gbtn"),{theme:"filled_blue",size:"large",shape:"pill",text:"signin_with",width:Math.max(200,Math.min(320,innerWidth-48))});google.accounts.id.cancel();}catch(e){}});   /* Rich, 21 Oct: one sign-in panel, ours; no Google prompt at the bottom */
 },Math.max(0,1500-(Date.now()-T0)));}
statGet();
// 22 Oct (Rich: "when user came in as guest and then hit arrow, it put him back at the spash and then login screen"): a guest let in by a
// QR code who comes back to its address (/qr/<list>, e.g. Back from the book) got the Owner's QR sign-in; /qr is the event code only for a
// signed-in browser, and anyone else comes in as on every other address
if(W.splash){/* the splash only */}else if(W.pit){var PK0=pitKept();if(PK0){pit(PK0);splashOff();pitLive();}call("vPit",[PID,PASS]).then(function(pr){if(PK0)return pitFresh(pr);if(pr&&pr.html){LS.set(pitK(),pr.html);pit(pr);}splashOff();},function(){if(PK0)return;splashOff();frame('<div class="note bad">The pit stop could not be reached. Reload.</div>');});}else if(Q0.get("lab")!==null&&PASS){lab();}else if(ISQR&&!CODE&&PASS){qrTry();}else if(!PASS&&!window.RS_TEST){
 // Rich, 21 Oct: "i dont think univited guests should be able to get into redshift.vote.   they can only get in via a book link or a qr";
 // "build that first": Continue as guest only with an event code, or on a phone a QR code or book link already let in
 var BT=function(){if(ISQR&&PASS)return qrTry();boot();};if(CODE)signIn(BT,true,true);else call("vHome",[PID,QN,PASS,CODE]).then(function(r){signIn(BT,true,!!(r&&r.adm));},function(){signIn(BT,true,false);});}
else boot();
// ---- Confirm your info (a guest or a precinct delegate matched by the signed-in email; Rich, 20 Oct)
function confirmSheet(c){BUSY=1;sheet('<h3>Confirm your info</h3><label>First name</label><input value="'+esc(c.first)+'" readonly><label>Last name</label><input value="'+esc(c.last)+'" readonly><div class="msg" id="cm"></div><button class="btn" id="cy">That\'s me</button><button class="btn alt" id="cn">Not me</button>');
 var on=function(x){$("cy").disabled=$("cn").disabled=!x;};
 var ans=function(yes){on(false);call("vConfirm",[PID,yes,c.k,c.s]).then(function(r){if(!r.ok){$("cm").textContent=r.msg;on(true);return;}BUSY=0;shut();
   if(yes){location.reload();return;}if(!r.in){location.href=S.regUrl||"/admin/";return;}nameSheet(function(){location.reload();});},function(e){$("cm").textContent=e.message;on(true);});};
 /* 25 Oct (Rich: "the yes it's me button does not work"): That's me closes at once; the page reloads when the server has it */
 $("cy").onclick=function(){BUSY=0;shut();obAdd("vConfirm",[PID,true,c.k,c.s],"reload");};$("cn").onclick=function(){ans(false);};}
// Rich, 22 Oct night: "redshift.vote and /admin is the same sequence.   spash then pitstop  then contnet"; "all except the QR code": the pit stop
// is asked for at once, beside Home, for everyone (not a QR code); the splash stays until both are in (the pit stop at most 8 s)
function boot(){/* 25 Oct: /home asks for no pit stop; elsewhere the kept pit stop is used at once and the fresh one fills it in (pitFresh) */var PK=ISQR||W.home?null:pitKept(),pitF=ISQR||W.home?null:call("vPit",[PID,PASS]).then(null,function(){return null;});
 var pitP=ISQR||W.home?Promise.resolve(null):PK?Promise.resolve(PK):Promise.race([pitF,new Promise(function(res){setTimeout(function(){res(null);},8000);})]);
 /* a phone already let in (its home screen kept) gets the kept pit stop at once, before Home answers */var PE=false;if(PK){var HK0=null;try{HK0=JSON.parse(LS.get("rsHome:"+(PID||""))||"null");}catch(e){}if(HK0&&HK0.adm){pit(PK);pitLive();PE=true;}}
 var PF=null;if(pitF)pitF.then(function(pr){if(pr&&pr.html)PF=pr;if(PK)pitFresh(pr);else if(pr&&pr.html)LS.set(pitK(),pr.html);});
 /* /home: the phone's last home screen at once (a tap made on it is not undone when the fresh one comes) */var HK=null,HG=-1;if(W.home){try{HK=JSON.parse(LS.get("rsHome:"+(PID||""))||"null");}catch(e){HK=null;}if(HK&&HK.adm){S=HK;gbOut();NOTE=HK.note||"";try{meDraw();}catch(e){}show("home");HG=QG;splashOff();}}
 var home=call("vHome",[PID,QN,PASS,CODE]).then(function(r){if(r&&r.ok!==false){if(r.pass)passSet(r.pass);else if(PASS){PASS="";LS.del("rsPass");}}
 if(r&&r.ok!==false&&!r.adm&&!CODE&&!PASS&&!GSITRIED){GSITRIED=1;return new Promise(function(res){signIn(function(){res(PASS?null:r);},true,false);});}return r;});   /* one sign-in panel (21 Oct) */
home.then(function(r){if(!r){boot();return "re";}S=r;gbOut();try{if(r.adm){var r2={};Object.keys(r).forEach(function(k){if(k!=="pass"&&k!=="confirm")r2[k]=r[k];});LS.set("rsHome:"+(PID||""),JSON.stringify(r2));}}catch(e){}doneSweep(true);try{meDraw();}catch(e){}S.qbad=!!QN&&r.qok===false;NOTE=r.note||"";return pitP;}).then(function(pr){if(pr==="re")return;
 setTimeout(function(){
  // Rich, 19 Oct: "admins should goto the broader home page and not directly to WTC"
if(HG>=0&&QG!==HG){/* /home: the person already went on from the kept home screen */}
  else if(!S.adm||(W.land&&!S.act&&!S.admin))show("new");
  else show(W.land?"home":W.page);
  if(pr&&pr.html&&!ISQR&&!PE){if(pr.kept&&PF)pr=PF;pit(pr);if(pr.kept)pitLive();}
  splashOff();if(S.confirm)confirmSheet(S.confirm);},Math.max(0,(W.home||!$("spw")?0:2200)-(Date.now()-T0)));
},function(e){setTimeout(function(){frame('<div class="note bad">Red Shift could not be reached ('+esc(e.message)+'). Check your signal and reload.</div>');splashOff();},Math.max(0,1500-(Date.now()-T0)));});}
// the Owner's TV page (Rich, 19 Oct: "it will be rendered on a TV from my laptop"; "scan and burn"): one code on screen; when a phone uses it,
// a new one comes up within about 2 seconds
function tv(r){var QRC=null;try{QRC=new Function(r.lib+";return qrcode;")();}catch(e){}
 splashOff();document.body.classList.add("tvm");
 var me=++TVID;ONQR=true;if(NAVN>0||S.act!==undefined&&S.adm)tbar();else{$("tb").hidden=true;document.body.classList.remove("tbon");}
 var draw=function(x){var svg="";try{var q=QRC(0,"M");q.addData(x.url);q.make();svg=q.createSvgTag({cellSize:8,margin:2,scalable:true});}catch(e){svg='<p>'+esc(x.url)+'</p>';}
  $("app").innerHTML='<div class="tv"><div class="word"><span class="r">Red</span><span class="s">shift</span></div><div class="tvq">'+svg+'</div><div class="tvn">'+x.joined+(x.joined===1?' volunteer':' volunteers')+' today</div></div>';};
 var cur=r;draw(cur);
 var tick=function(){if(me!==TVID)return;call("qrTvSeen",[PASS,cur.code]).then(function(s){if(s&&s.used)return call("qrTv",[PASS,W.q||"",0]).then(function(n){if(n&&n.ok){cur=n;draw(cur);}});},function(){}).then(function(){setTimeout(tick,2000);},function(){setTimeout(tick,2000);});};
 setTimeout(tick,2000);}
})();
