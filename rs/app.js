
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
 /* Rich, 23 Oct ("you should be restful  ..  /splash  /pitstop /admin"; "just build it"): /splash keeps the splash up; /pitstop shows the pit stop alone and keeps it up, live */if(a==="splash")return{splash:1,land:1,page:"home",q:""};if(a==="pitstop")return{pit:1,land:1,page:"home",q:""};if(a==="qr")return{land:1,page:"new",q:q};if(a==="newbooks")return{page:"new",q:q};if(a==="mybooks")return{page:"mine"};if(a==="dashboard")return{page:"dash"};if(a==="links")return{page:"links"};
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
 t.innerHTML=b("back","Back",NAVN>0?"":' class="off"')+b("home","Home",!ONQR&&(CUR==="home"||!S.adm&&CUR==="new")?' class="off"':"")+(S.owner&&!ONQR?b("qr","Event QR code"):"")+(S.owner?b("test","Tests"):"")+(S.admin?'<a href="/admin/" data-tb="admin" aria-label="Admin"><svg viewBox="0 0 24 24">'+TBI.admin+'</svg></a>':"");
 t.hidden=false;document.body.classList.add("tbon");}
document.addEventListener("click",function(e){var x=e.target&&e.target.closest&&e.target.closest("#tb [data-tb]");if(!x)return;var k=x.getAttribute("data-tb");
 if(k==="back"){if(NAVN>0)history.back();}else if(k==="home")go("home");else if(k==="qr")go("qr");
 else if(k==="test")call("testToken",[PASS]).then(function(tk){if(tk)location.href=API+"/tests?tk="+encodeURIComponent(tk);}).catch(function(){});});
var PATHS={home:"/",new:"/newbooks",mine:"/mybooks",dash:"/dashboard",links:"/links"};
function go(id){if(/^(walk|call|text)$/.test(id))return tap(id);if(/^b:/.test(id))return openBook(id.slice(2));
 if(id==="qr"){if(location.pathname.replace(/\/+$/,"")!=="/qr"){history.pushState({p:"qr"},"","/qr");NAVN++;}return qrTry();}
 if(PATHS[id]){var p=PATHS[id]+(id==="new"&&W.q?"/"+encodeURIComponent(W.q):"");if(location.pathname!==p){history.pushState({p:id},"",p);NAVN++;}show(id);}}
addEventListener("popstate",function(){NAVN=Math.max(0,NAVN-1);W=where();if(/^\/qr\/?$/.test(location.pathname)&&S.owner)return qrTry();show(W.page);});
var NOTE="";
function show(id){QG++;window.RST.mark("show "+id);window.scrollTo(0,0);/* 21 Oct (Rich: "did you chanage the color scheme ?"): the pit stop poster turns the page navy and locks scrolling while it is up; once it is gone, every screen gets the page back */if(!document.getElementById("lnd")){var de0=document.documentElement.style,bd0=document.body.style;de0.overflow="";de0.background="";bd0.overflow="";bd0.background="";bd0.height="";}if(ONQR){ONQR=false;TVID++;document.body.classList.remove("tvm");}setTimeout(tbar,0);
 if(!S.adm&&id!=="links")id="new";
 CUR=id;
 if(id==="home")return frame((NOTE?'<div class="note">'+esc(NOTE)+'</div>':"")+'<div class="list">'+card("dash","Dashboard","dash")+card("mine","My Books","mine","",(S.books||[]).length)+card("new","New Books","new","Call \u00b7 Walk \u00b7 Text")+'</div>');
 if(id==="new"){statGet();var have={};S.books.forEach(function(b){have[b.mode]=b;});
  return frame((S.code==="used"||S.code==="bad"?'<div class="note">This code was already used. Register to join the team.</div>':"")+(S.qbad?'<div class="note bad">That list is not available. These books come from the main list.</div>':"")+'<div class="list">'+["walk","call","text"].map(function(m){var k=m==="walk"?"door":m,b=have[k];return card(m,ML[k],k,b?"Open your "+ML[k]+" book":"");}).join("")+'</div>'+bcBox(),S.act,S.act?"New Books":"");}
 if(id==="mine")return frame(S.books.length?'<div class="list">'+S.books.map(function(b){return card("b:"+b.id,ML[b.mode]+" book",b.mode,b.nick+" · "+(b.mode==="door"?b.doors+" doors":b.people+" people"));}).join("")+'</div>'
  :'<div class="note">No books yet on this phone.</div><div class="list">'+card("new","New Books","new")+'</div>',true,"My Books");
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
  (m.signed?'<button class="btn" id="meo">Sign out</button>':'<button class="btn" id="mei">Sign in with Google</button>')+'<button class="btn alt" id="mex">Close</button>');
 $("mex").onclick=shut;
 if($("meo"))$("meo").onclick=function(){try{if(window.google&&google.accounts&&google.accounts.id)google.accounts.id.disableAutoSelect();}catch(e){}LS.del("rsPass");LS.del("rsMe");PASS="";location.href="/";};
 if($("mei"))$("mei").onclick=function(){shut();signIn(function(){location.reload();},false);};}
function sheet(h){$("shb").innerHTML=h;$("sh").hidden=false;}
function shut(){$("sh").hidden=true;$("shb").innerHTML="";}
$("sh").onclick=function(e){if(e.target===$("sh")&&!BUSY)shut();};
var BUSY=0;
function busy(t){BUSY=1;sheet('<div class="spin"></div><p style="text-align:center">'+esc(t)+'</p>');}
function oops(t){BUSY=0;sheet('<h3>Sorry</h3><p>'+esc(t)+'</p><button class="btn" id="sx">OK</button>');$("sx").onclick=shut;}
// ---- New Books: a name first (first name, last name, last 4 of the phone), then the book
function tap(m){if(!S.adm){location.href=S.regUrl||"/admin/";return;}
 // Rich, 19 Oct: "admin should get a pop up...is this a preview or are you taking this book as yours"; "admins can previuew the CWT scrresn wo claiming them"
 if(S.admin&&!S.books.some(function(b){return b.mode===(m==="walk"?"door":m);})){var L=ML[m==="walk"?"door":m];sheet('<h3>'+esc(L)+' book</h3><button class="btn" id="pv">Preview</button><button class="btn alt" id="tk">Take a book</button>');
  $("pv").onclick=function(){busy("Opening a preview...");call("vPreview",[PID,m,QN,false,PASS]).then(function(r){if(!r.ok)return oops(r.msg);location.replace(r.launch);},function(e){oops(e.message);});};
  $("tk").onclick=function(){shut();if(!S.named)return nameSheet(function(){build(m);});build(m);};return;}
 if(!S.named)return nameSheet(function(){tap(m);});build(m);}
function nameSheet(then){BUSY=0;
 // Rich, 20 Oct: "do not add cute shit like that. Title that page as: Your info"
 sheet('<h3>Your info</h3><label>First name</label><input id="nf" autocomplete="given-name" maxlength="40"><label>Last name</label><input id="nl" autocomplete="family-name" maxlength="40"><label>Last 4 digits of your phone</label><input id="n4" inputmode="numeric" maxlength="4" pattern="[0-9]*"><div class="msg" id="nm"></div><button class="btn" id="ngo">Continue</button>');
 $("nf").focus();$("ngo").onclick=function(){var f=$("nf").value.trim(),l=$("nl").value.trim(),p=$("n4").value.replace(/\D/g,"");
  if(!f){$("nm").textContent="Add your first name.";return;}if(p.length!==4){$("nm").textContent="Add the last 4 digits of your phone number.";return;}
  this.disabled=true;call("vName",[PID,f,l,p]).then(function(r){
   if(!r.ok){$("nm").textContent=r.msg;$("ngo").disabled=false;return;}
   if(!r.ask){S.named=true;S.first=f;shut();return then();}
   // Rich, 19 Oct: "make the match and them pop up to confirm"; the wording: "perfect"
   sheet('<h3>Welcome back!</h3><p>Continue as '+esc(r.ask)+'?</p><button class="btn" id="ty">That\'s me</button><button class="btn alt" id="tn">Not me</button>');
   var tie=function(yes){busy("One moment...");call("vTie",[PID,r.k,r.s,yes,f,l,p]).then(function(x){if(!x.ok)return oops(x.msg);S.named=true;S.first=(yes?x.name:f).split(" ")[0];shut();then();},function(e){oops(e.message);});};
   $("ty").onclick=function(){tie(true);};$("tn").onclick=function(){tie(false);};
  },function(e){$("nm").textContent=e.message;$("ngo").disabled=false;});};}
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
function build(m){var k=m==="walk"?"door":m;busy("Getting your "+ML[k]+" book...");
 call("vNew",[PID,m,QN]).then(function(r){
  if(r.need==="name"){S.named=false;return nameSheet(function(){build(m);});}
  if(r.reg){location.href=S.regUrl||"/admin/";return;}
  if(!r.ok)return oops(r.msg||"Please try again.");
  var b=r.book;S.books=S.books.filter(function(x){return x.id!==b.id;}).concat([b]);S.act=true;
  if(k==="door"&&r.fresh){BUSY=0;shut();return route(b);}
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
function splashOff(){if(W.splash)return;window.RST.mark("splash off");setTimeout(function(){window.RST.send("home");},4000);var w=$("spw");if(!w)return;w.classList.add("out");setTimeout(function(){if(w.parentNode)w.parentNode.removeChild(w);},700);}
// 22 Oct (Rich: "the pitstop screen should listen to the dashboard proxy so it can update in realtime"): while the pit stop is up, its
// doors, calls and texts are asked for every 15 s (pitLive) and put on screen
var PITT=null,PITS=null;function pitLive(){clearTimeout(PITT);if(!$("lnd-k")){PITT=null;return;}if(!document.hidden)call("pitLive",[PITS]).then(function(x){if(!x||!x.ok)return;PITS=x.sig||null;clearTimeout(PITT);PITT=setTimeout(pitLive,x.held?50:15000);[["lnd-k",x.doors],["lnd-kc",x.calls],["lnd-kt",x.texts]].forEach(function(a){var e=$(a[0]);if(e)e.textContent=Math.max(0,Math.round(Number(a[1])||0)).toLocaleString("en-US");});},function(){clearTimeout(PITT);PITT=setTimeout(pitLive,15000);});PITT=setTimeout(pitLive,40000);}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&$("lnd-k"))pitLive();});
// Rich, 23 Oct ("is pit stop polling ?"): the scoreboard drawn after sign-in had nothing asking for new numbers; any scoreboard on screen starts the asking
setInterval(function(){if($("lnd-k")&&!PITT)pitLive();},3000);
function pit(r){window.RST.mark("pit stop");var p=$("pit");/* Rich, 23 Oct: "i want the pitstop page in all its glory wo the buttons": /pitstop?embed (for Wix): no buttons, no card, no "do not show" box *//* Rich, 23 Oct: "replace that with on the bottom with Volunteer with us Today  At the top, ut CALL to ACTION Patriots"; "take the button outlines off.  remove the orb and make the text stretch accross the screen.  make the doors, calls, and text bigger"; "remove teh spash screen and go straight to the pitstop poster"; "put volunteer w u today in the red ccolor" (the poster's RED, #ba0010); "Teh top line should just be all capps  call to action"; "big white font" (the top line as wide as the screen): the two buttons become labels (no tap, no outline) sized to the width; the numbers sized to fill the width; no orb, no splash */if(W.pit&&Q0.get("embed")!==null){var EH=String(r.html).replace(/<button type="button" class="lnd-b lnd-top"[^>]*>[\s\S]*?<\/button>/g,'<button type="button" class="lnd-b lnd-top" disabled style="cursor:default;opacity:1">CALL TO ACTION</button>').replace(/<button type="button" class="lnd-b lnd-bot[^"]*"[^>]*>[\s\S]*?<\/button>/g,'<button type="button" class="lnd-b lnd-bot" disabled style="cursor:default;opacity:1;color:#ba0010">Volunteer with us Today</button>');var ET='<button type="button" class="lnd-b lnd-top" disabled style="cursor:default;opacity:1">CALL TO ACTION</button>',EB='<button type="button" class="lnd-b lnd-bot" disabled style="cursor:default;opacity:1;color:#ba0010">Volunteer with us Today</button>';/* a signed-in phone's poster has no top button (and may have no bottom one): add them */if(EH.indexOf("lnd-bot")<0){var EP=EH.indexOf('</div><div id="lnd-pt"');if(EP>=0)EH=EH.slice(0,EP)+EB+EH.slice(EP);}if(EH.indexOf("lnd-top")<0){var EQ=EH.indexOf(EB);if(EQ>=0)EH=EH.slice(0,EQ)+ET+EH.slice(EQ);}var EK='<script>(function(){function $(i){return document.getElementById(i);}var p=$("lnd-p");',EI=EH.indexOf(EK);if(EI>=0)EH=EH.slice(0,EI)+"<script>(function(){var c=document.createElement(\"canvas\").getContext(\"2d\");function w(f,t){c.font=f;return c.measureText(t).width;}function F(){var p=document.getElementById(\"lnd-p\");if(!p)return;[].forEach.call(document.querySelectorAll(\"#lnd .lnd-b\"),function(b){var x=w(\"700 100px Poppins,system-ui,sans-serif\",b.textContent);if(x)b.style.setProperty(\"font-size\",\"calc(var(--u)*var(--k)*\"+Math.min(/lnd-top/.test(b.className)?150:82,100000/x)+\")\",\"important\");});var s=54,d=document.querySelectorAll(\"#lnd-nr>div\");[].forEach.call(d,function(x){var n=x.querySelector(\".n\"),l=x.querySelector(\".l\");if(!n||!l)return;var t=l.textContent;s+=Math.max(w(\"400 100px Anton,Impact,sans-serif\",n.textContent),w(\"700 24px Poppins,system-ui,sans-serif\",t)+(t.length-1)*5.33);});if(d.length)p.style.setProperty(\"--fn\",Math.min(230,100000/s));}F();if(document.fonts){document.fonts.ready.then(F);}})();<\/script>"+EH.slice(EI);r.html=EH+"<style>#lnd .lnd-b{border:0!important;padding:0!important;letter-spacing:0!important;font-size:calc(var(--u)*var(--k)*var(--fl,80))!important}#lnd-nr{gap:calc(var(--u)*var(--k)*var(--fn,150)*.27)!important}#lnd-nr .n{font-size:calc(var(--u)*var(--k)*var(--fn,150))!important}#lnd-nr .l{font-size:calc(var(--u)*var(--k)*var(--fn,150)*.24)!important;letter-spacing:calc(var(--u)*var(--k)*var(--fn,150)*.0533)!important;margin-right:calc(var(--u)*var(--k)*var(--fn,150)*-.0533)!important;margin-top:calc(var(--u)*var(--k)*var(--fn,150)*.1)!important}#lnd .lnd-top{height:auto!important;line-height:1.1!important}.lnd-orb,.lnd-rip{display:none!important}.lnd-b.lnd-tap{animation:none!important}#lnd-s,#lnd-ck,#ptc,#lnd-v1,#lnd-v2{display:none!important}</style>";}/* /pitstop: the celebration card (its own id "pit") would take this whole page down after 10 s */if(W.pit)r.html=String(r.html).replace(/<style>#pit\{[\s\S]*?go\(\);\}\)\(\);<\/script>/,"");p.innerHTML=r.html;if(p.querySelector("#lnd"))document.body.classList.add("pitup");PITT=setTimeout(pitLive,15000);
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
function signIn(go,guest){var done=0,fin=function(){if(done)return;done=1;GSIDONE=null;GSITRIED=1;go();};GSIDONE=fin;
 setTimeout(function(){if(done)return;splashOff();
  frame('<div class="list"><div id="gbtn" class="gbtn" style="display:flex;justify-content:center;min-height:46px;margin-top:18px"></div>'+(guest?'<button class="btn alt" id="gsg">Continue as guest</button>':'')+'</div>',false);
  if(guest)$("gsg").onclick=function(){frame('<div class="list"><div class="spin"></div></div>',false);fin();};
  gsiLoad(function(ok){if(!ok||done)return;try{gsiInit();google.accounts.id.renderButton($("gbtn"),{theme:"filled_blue",size:"large",shape:"pill",text:"signin_with",width:Math.max(200,Math.min(320,innerWidth-48))});google.accounts.id.cancel();}catch(e){}});   /* Rich, 21 Oct: one sign-in panel, ours; no Google prompt at the bottom */
 },Math.max(0,1500-(Date.now()-T0)));}
statGet();
// 22 Oct (Rich: "when user came in as guest and then hit arrow, it put him back at the spash and then login screen"): a guest let in by a
// QR code who comes back to its address (/qr/<list>, e.g. Back from the book) got the Owner's QR sign-in; /qr is the event code only for a
// signed-in browser, and anyone else comes in as on every other address
if(W.splash){/* the splash only */}else if(W.pit){call("vPit",[PID,PASS]).then(function(pr){if(pr&&pr.html)pit(pr);splashOff();},function(){splashOff();frame('<div class="note bad">The pit stop could not be reached. Reload.</div>');});}else if(Q0.get("lab")!==null&&PASS){lab();}else if(ISQR&&!CODE&&PASS){qrTry();}else if(!PASS&&!window.RS_TEST){
 // Rich, 21 Oct: "i dont think univited guests should be able to get into redshift.vote.   they can only get in via a book link or a qr";
 // "build that first": Continue as guest only with an event code, or on a phone a QR code or book link already let in
 var BT=function(){if(ISQR&&PASS)return qrTry();boot();};if(CODE)signIn(BT,true);else call("vHome",[PID,QN,PASS,CODE]).then(function(r){signIn(BT,!!(r&&r.adm));},function(){signIn(BT,false);});}
else boot();
// ---- Confirm your info (a guest or a precinct delegate matched by the signed-in email; Rich, 20 Oct)
function confirmSheet(c){BUSY=1;sheet('<h3>Confirm your info</h3><label>First name</label><input value="'+esc(c.first)+'" readonly><label>Last name</label><input value="'+esc(c.last)+'" readonly><div class="msg" id="cm"></div><button class="btn" id="cy">That\'s me</button><button class="btn alt" id="cn">Not me</button>');
 var on=function(x){$("cy").disabled=$("cn").disabled=!x;};
 var ans=function(yes){on(false);call("vConfirm",[PID,yes,c.k,c.s]).then(function(r){if(!r.ok){$("cm").textContent=r.msg;on(true);return;}BUSY=0;shut();
   if(yes){location.reload();return;}if(!r.in){location.href=S.regUrl||"/admin/";return;}nameSheet(function(){location.reload();});},function(e){$("cm").textContent=e.message;on(true);});};
 $("cy").onclick=function(){ans(true);};$("cn").onclick=function(){ans(false);};}
// Rich, 22 Oct night: "redshift.vote and /admin is the same sequence.   spash then pitstop  then contnet"; "all except the QR code": the pit stop
// is asked for at once, beside Home, for everyone (not a QR code); the splash stays until both are in (the pit stop at most 8 s)
function boot(){var pitP=ISQR?Promise.resolve(null):Promise.race([call("vPit",[PID,PASS]).then(null,function(){return null;}),new Promise(function(res){setTimeout(function(){res(null);},8000);})]);
 var home=call("vHome",[PID,QN,PASS,CODE]).then(function(r){if(r&&r.ok!==false){if(r.pass)passSet(r.pass);else if(PASS){PASS="";LS.del("rsPass");}}
 if(r&&r.ok!==false&&!r.adm&&!CODE&&!PASS&&!GSITRIED){GSITRIED=1;return new Promise(function(res){signIn(function(){res(PASS?null:r);},false);});}return r;});   /* one sign-in panel (21 Oct) */
home.then(function(r){if(!r){boot();return "re";}S=r;try{meDraw();}catch(e){}S.qbad=!!QN&&r.qok===false;NOTE=r.note||"";return pitP;}).then(function(pr){if(pr==="re")return;
 setTimeout(function(){
  // Rich, 19 Oct: "admins should goto the broader home page and not directly to WTC"
if(!S.adm||(W.land&&!S.act&&!S.admin))show("new");
  else show(W.land?"home":W.page);
  if(pr&&pr.html&&!ISQR)pit(pr);
  splashOff();if(S.confirm)confirmSheet(S.confirm);},Math.max(0,2200-(Date.now()-T0)));
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
