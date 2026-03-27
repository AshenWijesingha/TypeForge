import { useState, useEffect, useRef, useCallback, useReducer } from "react";

/* ═══════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════ */

const C = {
  bg: "#060810", surface: "#0c0f1a", surface2: "#111528", border: "#1a1f35",
  border2: "#252b45", text: "#d0d4e0", muted: "#5c6380", dim: "#333956",
  accent: "#0ea5e9", accent2: "#8b5cf6", green: "#22c55e", red: "#ef4444",
  amber: "#f59e0b", pink: "#ec4899",
};

const LESSONS = [
  { id: 1, name: "Home Row Basics", keys: "a s d f j k l ;", level: "beginner", xp: 50, desc: "Learn where your fingers rest", text: "asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj asdf fdsa jkl; ;lkj asdf jkl;" },
  { id: 2, name: "Home Row Words", keys: "a s d f j k l ;", level: "beginner", xp: 65, desc: "Real words using home row", text: "ask lad fall flask salad dad all sad asks lads falls flasks salads dads" },
  { id: 3, name: "Vowels E and I", keys: "e i + home row", level: "beginner", xp: 70, desc: "Add the most common vowels", text: "like file side idea life silk slide field dial aisle self idle tile isle" },
  { id: 4, name: "Top Row Letters", keys: "q w e r t y u i o p", level: "beginner", xp: 80, desc: "Reach up from home position", text: "quit ripe tour type riot pier port trip your rope wipe tyre poet wire" },
  { id: 5, name: "Bottom Row Letters", keys: "z x c v b n m", level: "beginner", xp: 80, desc: "Reach down from home position", text: "zinc cave brave move come back vex numb calm zone mix van cab box" },
  { id: 6, name: "Full Alphabet", keys: "a to z", level: "intermediate", xp: 100, desc: "All 26 letters combined", text: "the quick brown fox jumps over a lazy dog and packs my box with five dozen jugs" },
  { id: 7, name: "Common Words", keys: "a to z", level: "intermediate", xp: 110, desc: "Words you type every day", text: "about which their would could other after people think might through because should between" },
  { id: 8, name: "Academic Writing", keys: "a to z", level: "intermediate", xp: 130, desc: "University level sentences", text: "The research methodology required a careful analysis of qualitative and quantitative data." },
  { id: 9, name: "Essay Paragraphs", keys: "a to z", level: "intermediate", xp: 130, desc: "Practice flowing sentences", text: "Critical thinking helps students evaluate multiple sources and build well supported arguments." },
  { id: 10, name: "Numbers and Symbols", keys: "0 to 9 + symbols", level: "advanced", xp: 150, desc: "Digits, punctuation, specials", text: "Order #437 costs $28.95 and item #612 is priced at $31.40 for 5 units (10% off)." },
  { id: 11, name: "Programming Syntax", keys: "all characters", level: "advanced", xp: 180, desc: "Code style character combos", text: "function getData(url) { return fetch(url).then(r => r.json()).catch(e => console.log(e)); }" },
  { id: 12, name: "Long Paragraph", keys: "a to z", level: "advanced", xp: 180, desc: "Sustained speed over length", text: "University students who develop strong typing skills complete their assignments faster and with fewer errors. This advantage compounds over four years of study." },
  { id: 13, name: "Mixed Content", keys: "everything", level: "advanced", xp: 200, desc: "Prose, numbers, and symbols", text: "The API (v2.1) returned a 404 error. Check the base URL at port 8080 and retry with the --verbose flag." },
  { id: 14, name: "Master Challenge", keys: "everything", level: "master", xp: 350, desc: "The ultimate typing test", text: "Professor Zhang's O(n log n) algorithm outperformed 12 baselines by 47.3% on CIFAR-100 [2024 results]." },
];

const SPEED_TEXTS = [
  "Touch typing is a skill that pays dividends throughout your academic career. Students who type fluently can focus on the content of their essays rather than hunting for individual keys. This allows a smoother flow of ideas from mind to screen.",
  "The average university student spends over four hours daily typing on a computer. Whether writing papers, coding assignments, taking lecture notes, or messaging classmates, keyboard proficiency directly impacts productivity and output quality.",
  "Learning to type without looking at the keyboard feels awkward initially. Your fingers will fumble and your speed will temporarily drop below your hunt and peck rate. Within two weeks of practice, muscle memory develops and your fingers begin to move automatically.",
  "Programming requires precise typing of unusual character combinations. Brackets, semicolons, curly braces, and special operators must be typed quickly and accurately. Programmers who can touch type spend more mental energy solving problems rather than entering code.",
  "Taking notes during a fast paced lecture demands quick and accurate typing. Students who can type at seventy words per minute or higher can capture nearly everything the professor says, creating comprehensive study materials that prove invaluable during exams.",
];

const GAME_WORDS = [
  "algorithm","function","variable","boolean","integer","string","object","array",
  "module","class","method","return","import","export","server","client",
  "compile","debug","deploy","iterate","merge","branch","commit","query",
  "lecture","essay","thesis","research","study","campus","library","seminar",
  "project","deadline","submit","review","draft","data","index","cache",
  "python","react","linux","docker","cloud","node","stack","queue",
  "binary","search","graph","tree","hash","sort","loop","scope",
  "grade","exam","note","work","plan","time","test","help","make",
  "code","type","fast","keys","word","play","game","text","speed",
  "the","and","for","not","you","all","can","had","was","one",
  "our","out","get","has","how","its","may","new","now","old",
  "see","way","who","did","let","say","she","too","use","big",
];

const KB = [
  [{ k:"`",w:40 },{ k:"1",w:40 },{ k:"2",w:40 },{ k:"3",w:40 },{ k:"4",w:40 },{ k:"5",w:40 },{ k:"6",w:40 },{ k:"7",w:40 },{ k:"8",w:40 },{ k:"9",w:40 },{ k:"0",w:40 },{ k:"-",w:40 },{ k:"=",w:40 },{ k:"Bksp",w:72 }],
  [{ k:"Tab",w:56 },{ k:"q",w:40 },{ k:"w",w:40 },{ k:"e",w:40 },{ k:"r",w:40 },{ k:"t",w:40 },{ k:"y",w:40 },{ k:"u",w:40 },{ k:"i",w:40 },{ k:"o",w:40 },{ k:"p",w:40 },{ k:"[",w:40 },{ k:"]",w:40 },{ k:"\\",w:48 }],
  [{ k:"Caps",w:64 },{ k:"a",w:40 },{ k:"s",w:40 },{ k:"d",w:40 },{ k:"f",w:40 },{ k:"g",w:40 },{ k:"h",w:40 },{ k:"j",w:40 },{ k:"k",w:40 },{ k:"l",w:40 },{ k:";",w:40 },{ k:"'",w:40 },{ k:"Enter",w:76 }],
  [{ k:"Shift",w:84 },{ k:"z",w:40 },{ k:"x",w:40 },{ k:"c",w:40 },{ k:"v",w:40 },{ k:"b",w:40 },{ k:"n",w:40 },{ k:"m",w:40 },{ k:",",w:40 },{ k:".",w:40 },{ k:"/",w:40 },{ k:"Shift2",w:84 }],
  [{ k:"Space",w:280 }],
];

const FM = {
  "`":"lp","1":"lp","2":"lr","3":"lm","4":"li","5":"li",
  "6":"ri","7":"ri","8":"rm","9":"rr","0":"rp","-":"rp","=":"rp",
  "q":"lp","w":"lr","e":"lm","r":"li","t":"li",
  "y":"ri","u":"ri","i":"rm","o":"rr","p":"rp","[":"rp","]":"rp","\\":"rp",
  "a":"lp","s":"lr","d":"lm","f":"li","g":"li",
  "h":"ri","j":"ri","k":"rm","l":"rr",";":"rp","'":"rp",
  "z":"lp","x":"lr","c":"lm","v":"li","b":"li",
  "n":"ri","m":"ri",",":"rm",".":"rr","/":"rp"," ":"th",
};

const FS = {
  lp:{c:"#f87171",l:"L Pinky"},lr:{c:"#fb923c",l:"L Ring"},lm:{c:"#facc15",l:"L Mid"},li:{c:"#4ade80",l:"L Index"},
  ri:{c:"#38bdf8",l:"R Index"},rm:{c:"#818cf8",l:"R Mid"},rr:{c:"#e879f9",l:"R Ring"},rp:{c:"#fb7185",l:"R Pinky"},th:{c:"#94a3b8",l:"Thumbs"},
};

const ACH = [
  { id:"a1",icon:"🎯",name:"First Steps",desc:"Complete 1 lesson",t:s=>s.cIds.length>=1},
  { id:"a2",icon:"📚",name:"Bookworm",desc:"Complete 5 lessons",t:s=>s.cIds.length>=5},
  { id:"a3",icon:"🎓",name:"Graduate",desc:"Complete all 14 lessons",t:s=>s.cIds.length>=14},
  { id:"a4",icon:"🚶",name:"Getting Started",desc:"Reach 30 WPM",t:s=>s.bWpm>=30},
  { id:"a5",icon:"🏃",name:"Speed Runner",desc:"Reach 50 WPM",t:s=>s.bWpm>=50},
  { id:"a6",icon:"⚡",name:"Lightning",desc:"Reach 70 WPM",t:s=>s.bWpm>=70},
  { id:"a7",icon:"💯",name:"Century Club",desc:"Reach 100 WPM",t:s=>s.bWpm>=100},
  { id:"a8",icon:"🎯",name:"Sharpshooter",desc:"95%+ accuracy",t:s=>s.bAcc>=95},
  { id:"a9",icon:"💎",name:"Perfectionist",desc:"100% accuracy",t:s=>s.bAcc>=100},
  { id:"a10",icon:"🔥",name:"On Fire",desc:"3-day streak",t:s=>s.streak>=3},
  { id:"a11",icon:"🌟",name:"Weekly Warrior",desc:"7-day streak",t:s=>s.streak>=7},
  { id:"a12",icon:"🎮",name:"Word Hunter",desc:"300+ game score",t:s=>s.bGame>=300},
  { id:"a13",icon:"💰",name:"XP Collector",desc:"Earn 1,000 XP",t:s=>s.xp>=1000},
  { id:"a14",icon:"👑",name:"XP Royalty",desc:"Earn 5,000 XP",t:s=>s.xp>=5000},
  { id:"a15",icon:"📊",name:"Test Veteran",desc:"5 speed tests",t:s=>s.tests>=5},
  { id:"a16",icon:"🏆",name:"Typing Titan",desc:"Reach Level 10",t:s=>Math.floor(s.xp/300)+1>=10},
];

const LC = {
  beginner:{bg:"rgba(34,197,94,.08)",bd:"rgba(34,197,94,.2)",tx:"#4ade80",lb:"Beginner"},
  intermediate:{bg:"rgba(245,158,11,.08)",bd:"rgba(245,158,11,.2)",tx:"#fbbf24",lb:"Intermediate"},
  advanced:{bg:"rgba(239,68,68,.08)",bd:"rgba(239,68,68,.2)",tx:"#f87171",lb:"Advanced"},
  master:{bg:"rgba(139,92,246,.08)",bd:"rgba(139,92,246,.2)",tx:"#a78bfa",lb:"Master"},
};

/* ═══════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════ */
const INIT = { xp:0,bWpm:0,bAcc:0,cIds:[],tests:0,bGame:0,streak:0,lastDay:null,hist:[],badges:[],tChars:0,tSecs:0 };

function red(s,a) {
  switch(a.type){
    case "LESSON": {
      const ids=s.cIds.includes(a.lid)?s.cIds:[...s.cIds,a.lid];
      return {...s,xp:s.xp+a.xp,bWpm:Math.max(s.bWpm,a.wpm),bAcc:Math.max(s.bAcc,a.acc),cIds:ids,tChars:s.tChars+a.chars,tSecs:s.tSecs+a.secs,hist:[...s.hist.slice(-39),{wpm:a.wpm,acc:a.acc}]};
    }
    case "SPEED": {
      return {...s,xp:s.xp+a.xp,bWpm:Math.max(s.bWpm,a.wpm),bAcc:Math.max(s.bAcc,a.acc),tests:s.tests+1,tChars:s.tChars+a.chars,tSecs:s.tSecs+a.secs,hist:[...s.hist.slice(-39),{wpm:a.wpm,acc:a.acc}]};
    }
    case "GAME": return {...s,xp:s.xp+a.xp,bGame:Math.max(s.bGame,a.score)};
    case "STREAK": {
      const today=new Date().toDateString();
      if(s.lastDay===today) return s;
      const yest=new Date(Date.now()-864e5).toDateString();
      return {...s,streak:s.lastDay===yest?s.streak+1:1,lastDay:today};
    }
    case "BADGE": return s.badges.includes(a.id)?s:{...s,badges:[...s.badges,a.id]};
    case "RESET": return {...INIT};
    default: return s;
  }
}

/* ═══════════════════════════════════════════════
   SOUND
   ═══════════════════════════════════════════════ */
function useBeep(on) {
  const ctx = useRef(null);
  return useCallback((freq,dur=.05,type="sine")=>{
    if(!on) return;
    try {
      if(!ctx.current) ctx.current = new (window.AudioContext||window.webkitAudioContext)();
      const c=ctx.current; if(c.state==="suspended") c.resume();
      const o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);o.type=type;o.frequency.value=freq;
      g.gain.setValueAtTime(.022,c.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);
      o.start(c.currentTime);o.stop(c.currentTime+dur);
    } catch{}
  },[on]);
}

/* ═══════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("home");
  const [st, dp] = useReducer(red, INIT);
  const [lid, setLid] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [snd, setSnd] = useState(true);
  const [fg, setFg] = useState(true);
  const [sOpen, setSOpen] = useState(false);

  const lv = Math.floor(st.xp/300)+1;
  const lvP = (st.xp%300)/300;

  const toast = useCallback((msg,v="ok")=>{
    const id=Date.now()+Math.random();
    setToasts(p=>[...p,{id,msg,v}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3500);
  },[]);

  const chkBadges = useCallback((ns)=>{
    ACH.forEach(a=>{
      if(!ns.badges.includes(a.id)&&a.t(ns)){
        dp({type:"BADGE",id:a.id});
        setTimeout(()=>toast(a.icon+" "+a.name+" unlocked!","badge"),400);
      }
    });
  },[toast]);

  const onLesson = useCallback((id,wpm,acc,chars,secs)=>{
    dp({type:"STREAK"});
    const les=LESSONS.find(l=>l.id===id);
    const xp=les?les.xp:50;
    dp({type:"LESSON",lid:id,wpm,acc,chars,secs,xp});
    toast("+"+xp+" XP!");
    const olv=Math.floor(st.xp/300)+1,nlv=Math.floor((st.xp+xp)/300)+1;
    if(nlv>olv) setTimeout(()=>toast("Level "+nlv+"!","lv"),500);
    setTimeout(()=>{
      let ns=red(red(st,{type:"STREAK"}),{type:"LESSON",lid:id,wpm,acc,chars,secs,xp});
      chkBadges(ns);
    },200);
  },[st,toast,chkBadges]);

  const onSpeed = useCallback((wpm,acc,chars,secs)=>{
    dp({type:"STREAK"});
    const xp=Math.max(10,Math.round(wpm*(acc/100)*1.5));
    dp({type:"SPEED",wpm,acc,chars,secs,xp});
    toast("+"+xp+" XP!");
    const olv=Math.floor(st.xp/300)+1,nlv=Math.floor((st.xp+xp)/300)+1;
    if(nlv>olv) setTimeout(()=>toast("Level "+nlv+"!","lv"),500);
    setTimeout(()=>{
      let ns=red(red(st,{type:"STREAK"}),{type:"SPEED",wpm,acc,chars,secs,xp});
      chkBadges(ns);
    },200);
  },[st,toast,chkBadges]);

  const onGame = useCallback((score)=>{
    dp({type:"STREAK"});
    const xp=Math.max(5,Math.round(score/4));
    dp({type:"GAME",score,xp});
    toast("+"+xp+" XP!");
    setTimeout(()=>{
      let ns=red(red(st,{type:"STREAK"}),{type:"GAME",score,xp});
      chkBadges(ns);
    },200);
  },[st,toast,chkBadges]);

  const go = id=>{setLid(id);setView("lesson");};

  const tCol={ok:{bg:"rgba(14,165,233,.12)",bd:"rgba(14,165,233,.3)",tx:"#38bdf8"},badge:{bg:"rgba(245,158,11,.12)",bd:"rgba(245,158,11,.3)",tx:"#fbbf24"},lv:{bg:"rgba(139,92,246,.12)",bd:"rgba(139,92,246,.3)",tx:"#a78bfa"},info:{bg:"rgba(100,116,139,.12)",bd:"rgba(100,116,139,.3)",tx:"#94a3b8"}};
  const nav=[{id:"home",l:"Home",i:"⌂"},{id:"lessons",l:"Learn",i:"✎"},{id:"speed",l:"Test",i:"⚡"},{id:"game",l:"Play",i:"▶"},{id:"stats",l:"Stats",i:"◆"},{id:"achievements",l:"Awards",i:"★"}];

  return (
    <div style={{fontFamily:"'DM Mono','Fira Code',monospace",background:C.bg,color:C.text,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0}button,input,textarea{font-family:inherit}
        @keyframes ti{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes pu{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes bg{from{transform:scaleY(0)}to{transform:scaleY(1)}}
      `}</style>

      {/* Dot grid */}
      <div style={{position:"fixed",inset:0,opacity:.025,pointerEvents:"none",backgroundImage:"radial-gradient(#0ea5e9 .5px,transparent 0)",backgroundSize:"28px 28px"}}/>

      {/* Toasts */}
      <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:999,display:"flex",flexDirection:"column",gap:6,alignItems:"center"}}>
        {toasts.map(t=>{const c=tCol[t.v]||tCol.ok;return(
          <div key={t.id} style={{padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:500,background:c.bg,border:"1px solid "+c.bd,color:c.tx,boxShadow:"0 8px 32px rgba(0,0,0,.4)",animation:"ti .3s ease-out",whiteSpace:"nowrap"}}>{t.msg}</div>
        );})}
      </div>

      {/* Settings */}
      {sOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)"}} onClick={()=>setSOpen(false)}>
          <div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:18,padding:24,width:"100%",maxWidth:380,margin:"0 16px"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontFamily:"Outfit",fontSize:17,fontWeight:700}}>Settings</span>
              <button onClick={()=>setSOpen(false)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0}}>×</button>
            </div>
            <Tog label="Sound Effects" val={snd} set={()=>setSnd(!snd)}/>
            <div style={{height:8}}/>
            <Tog label="Finger Guide" val={fg} set={()=>setFg(!fg)}/>
            <button onClick={()=>{if(confirm("Reset ALL progress?")){dp({type:"RESET"});toast("Reset done.","info");}}} style={{marginTop:20,width:"100%",padding:"10px 0",borderRadius:10,background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",color:"#f87171",fontSize:12,fontWeight:500,cursor:"pointer"}}>Reset All Progress</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,borderBottom:"1px solid "+C.border,background:C.bg+"dd",backdropFilter:"blur(16px)"}}>
        <div style={{maxWidth:1060,margin:"0 auto",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <button onClick={()=>setView("home")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",color:C.text,padding:0}}>
            <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:800,boxShadow:"0 3px 10px rgba(14,165,233,.25)"}}>T</div>
            <span style={{fontFamily:"Outfit",fontWeight:700,fontSize:14}}><span style={{color:C.accent}}>Type</span>Forge</span>
          </button>
          <div style={{display:"flex",gap:1}}>
            {nav.map(n=>{const a=view===n.id||(n.id==="lessons"&&view==="lesson");return(
              <button key={n.id} onClick={()=>setView(n.id)} style={{padding:"5px 8px",borderRadius:7,fontSize:11,fontWeight:500,cursor:"pointer",border:"none",whiteSpace:"nowrap",background:a?"rgba(14,165,233,.1)":"transparent",color:a?C.accent:C.muted}}>{n.i} {n.l}</button>
            );})}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:16,background:"rgba(139,92,246,.07)",border:"1px solid rgba(139,92,246,.2)"}}>
              <span style={{fontSize:10,color:"#a78bfa",fontWeight:600}}>Lv.{lv}</span>
              <div style={{width:40,height:4,background:C.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:(lvP*100)+"%",background:"linear-gradient(90deg,#8b5cf6,#a78bfa)",borderRadius:3,transition:"width .4s"}}/>
              </div>
            </div>
            {st.streak>0&&<span style={{fontSize:10,color:C.amber,fontWeight:600}}>🔥{st.streak}</span>}
            <button onClick={()=>setSOpen(true)} style={{width:30,height:30,borderRadius:7,background:"none",border:"1px solid "+C.border,color:C.muted,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>⚙</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{maxWidth:1060,margin:"0 auto",padding:"20px 14px 60px"}} key={view+(lid||"")}>
        <div style={{animation:"fu .35s ease-out"}}>
          {view==="home"&&<Home st={st} lv={lv} setView={setView} go={go}/>}
          {view==="lessons"&&<Lessons st={st} go={go}/>}
          {view==="lesson"&&lid!=null&&<Typer mode="lesson" lid={lid} onDone={onLesson} onBack={()=>setView("lessons")} snd={snd} fg={fg}/>}
          {view==="speed"&&<Typer mode="speed" onDone={onSpeed} onBack={()=>setView("home")} snd={snd} fg={fg}/>}
          {view==="game"&&<Game onDone={onGame} onBack={()=>setView("home")} snd={snd}/>}
          {view==="stats"&&<Stats st={st} lv={lv}/>}
          {view==="achievements"&&<Badges st={st}/>}
        </div>
      </main>
    </div>
  );
}

function Tog({label,val,set}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",borderRadius:10,background:C.surface2,border:"1px solid "+C.border}}>
      <span style={{fontSize:12}}>{label}</span>
      <button onClick={set} style={{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",position:"relative",background:val?C.accent:C.border2,transition:"background .2s",padding:0}}>
        <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:3,left:val?21:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════ */
function Home({st,lv,setView,go}){
  const next=LESSONS.find(l=>!st.cIds.includes(l.id));
  const pct=Math.round((st.cIds.length/LESSONS.length)*100);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <section style={{position:"relative",borderRadius:18,border:"1px solid "+C.border,background:"linear-gradient(135deg,"+C.surface+","+C.bg+")",padding:"32px 28px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,background:"radial-gradient(circle,rgba(14,165,233,.05),transparent)",borderRadius:"50%"}}/>
        <div style={{position:"relative",zIndex:2,maxWidth:500}}>
          <div style={{fontSize:10,color:C.accent,fontWeight:600,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>TypeForge</div>
          <h1 style={{fontFamily:"Outfit",fontSize:"clamp(24px,4vw,36px)",fontWeight:800,lineHeight:1.2,marginBottom:14}}>
            Master <span style={{color:"transparent",backgroundClip:"text",WebkitBackgroundClip:"text",backgroundImage:"linear-gradient(135deg,#0ea5e9,#8b5cf6)"}}>Touch Typing</span>
          </h1>
          <p style={{color:C.muted,lineHeight:1.7,fontSize:13,marginBottom:24}}>Build keyboard fluency through structured lessons, timed speed tests, and an arcade word game designed for university students.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {next&&<Btn p onClick={()=>go(next.id)}>Continue Lesson {next.id}</Btn>}
            <Btn onClick={()=>setView("speed")}>⚡ Speed Test</Btn>
            <Btn onClick={()=>setView("game")}>▶ Word Game</Btn>
          </div>
        </div>
      </section>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        <IC l="Best WPM" v={st.bWpm} c={C.accent}/><IC l="Best Accuracy" v={st.bAcc+"%"} c={C.green}/>
        <IC l="Lessons" v={st.cIds.length+"/"+LESSONS.length} c="#a78bfa"/><IC l="Achievements" v={st.badges.length+"/"+ACH.length} c={C.amber}/>
      </div>
      <section style={{borderRadius:18,border:"1px solid "+C.border,background:C.surface,padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontFamily:"Outfit",fontWeight:600,fontSize:14}}>Curriculum</span>
          <span style={{fontSize:10,color:C.muted}}>{pct}%</span>
        </div>
        <div style={{width:"100%",height:5,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:18}}>
          <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,#0ea5e9,#8b5cf6)",borderRadius:3,transition:"width .5s"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {LESSONS.slice(0,6).map(l=><LC2 key={l.id} l={l} done={st.cIds.includes(l.id)} go={()=>go(l.id)}/>)}
        </div>
        <button onClick={()=>setView("lessons")} style={{marginTop:14,background:"none",border:"none",color:C.accent,fontSize:12,fontWeight:500,cursor:"pointer",padding:0}}>View all {LESSONS.length} lessons →</button>
      </section>
    </div>
  );
}

function IC({l,v,c}){return(<div style={{padding:16,borderRadius:12,border:"1px solid "+C.border,background:C.surface}}><div style={{fontFamily:"Outfit",fontSize:24,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{l}</div></div>);}

function Btn({children,onClick,p}){
  return <button onClick={onClick} style={{padding:"9px 18px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",border:p?"none":"1px solid "+C.border,background:p?"linear-gradient(135deg,#0ea5e9,#0284c7)":C.surface2,color:p?"#fff":C.text,boxShadow:p?"0 3px 12px rgba(14,165,233,.2)":"none",transition:"all .15s"}}>{children}</button>;
}

function LC2({l,done,go}){
  const lc=LC[l.level];
  return(
    <button onClick={go} style={{textAlign:"left",padding:14,borderRadius:12,cursor:"pointer",transition:"all .15s",border:"1px solid "+(done?"rgba(14,165,233,.2)":C.border),background:done?"rgba(14,165,233,.03)":C.surface2}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:9,padding:"2px 7px",borderRadius:5,fontWeight:500,background:lc.bg,color:lc.tx,border:"1px solid "+lc.bd}}>{lc.lb}</span>
        {done?<span style={{fontSize:10,color:C.green}}>✓</span>:<span style={{fontSize:9,color:C.dim}}>+{l.xp}xp</span>}
      </div>
      <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{l.name}</div>
      <div style={{fontSize:10,color:C.dim}}>{l.desc}</div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   LESSONS LIST
   ═══════════════════════════════════════════════ */
function Lessons({st,go}){
  const gps=[{lv:"beginner",t:"Beginner — Home Row & Basics"},{lv:"intermediate",t:"Intermediate — Full Keyboard"},{lv:"advanced",t:"Advanced — Speed & Symbols"},{lv:"master",t:"Master — Ultimate Challenge"}];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:28}}>
      <div><h1 style={{fontFamily:"Outfit",fontSize:"clamp(20px,3vw,28px)",fontWeight:700}}>Curriculum</h1><p style={{fontSize:12,color:C.muted,marginTop:3}}>{st.cIds.length}/{LESSONS.length} complete</p></div>
      {gps.map(g=>{const items=LESSONS.filter(l=>l.level===g.lv);return(
        <div key={g.lv}>
          <h2 style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>{g.t}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
            {items.map(l=><LC2 key={l.id} l={l} done={st.cIds.includes(l.id)} go={()=>go(l.id)}/>)}
          </div>
        </div>
      );})}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TYPING ENGINE
   ═══════════════════════════════════════════════ */
function Typer({mode,lid,onDone,onBack,snd,fg}){
  const les = mode==="lesson"?LESSONS.find(l=>l.id===lid):null;
  const [text] = useState(()=>mode==="speed"?SPEED_TEXTS[Math.floor(Math.random()*SPEED_TEXTS.length)]:(les?les.text:""));
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("wait");
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);
  const [errs, setErrs] = useState(0);
  const ref = useRef(null);
  const timer = useRef(null);
  const beep = useBeep(snd);
  const doneRef = useRef(false);

  const elapsed = phase==="wait"?0:((phase==="done"?now:Date.now())-t0)/1000;
  const wpm = elapsed>0.5?Math.round((typed.length/5)/(elapsed/60)):0;
  let errInTyped=0;for(let i=0;i<typed.length;i++)if(typed[i]!==text[i])errInTyped++;
  const acc = typed.length>0?Math.round(((typed.length-errInTyped)/typed.length)*100):100;

  useEffect(()=>{
    const t=setTimeout(()=>ref.current&&ref.current.focus(),120);
    return()=>{clearTimeout(t);clearInterval(timer.current);};
  },[]);

  useEffect(()=>{
    if(phase==="go"){
      timer.current=setInterval(()=>setNow(Date.now()),200);
      return()=>clearInterval(timer.current);
    }
  },[phase]);

  const onChange = useCallback(e=>{
    if(phase==="done"||doneRef.current) return;
    const val=e.target.value;
    if(val.length>text.length) return;

    if(phase==="wait"){setPhase("go");const n=Date.now();setT0(n);setNow(n);}

    if(val.length>typed.length){
      const i=val.length-1;
      if(val[i]===text[i]) beep(780,.04);
      else { beep(220,.08); setErrs(c=>c+1); }
    }
    setTyped(val);

    if(val.length===text.length&&!doneRef.current){
      doneRef.current=true;
      clearInterval(timer.current);
      const end=Date.now();setNow(end);setPhase("done");
      const s=(end-(phase==="wait"?end:t0))/1000||1;
      const fw=Math.round((text.length/5)/(s/60));
      let fe=0;for(let i=0;i<val.length;i++)if(val[i]!==text[i])fe++;
      const fa=Math.round(((val.length-fe)/val.length)*100);
      if(mode==="lesson") onDone(lid,fw,fa,text.length,s);
      else onDone(fw,fa,text.length,s);
    }
  },[phase,typed,text,t0,beep,mode,lid,onDone]);

  const reset = useCallback(()=>{
    doneRef.current=false;
    clearInterval(timer.current);
    setTyped("");setPhase("wait");setT0(0);setNow(0);setErrs(0);
    setTimeout(()=>ref.current&&ref.current.focus(),60);
  },[]);

  const nCh=text[typed.length]||"";
  const nF=FM[nCh.toLowerCase()]||"";
  const nFS=FS[nF];
  const accC=acc>=95?C.green:acc>=80?C.amber:C.red;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",padding:0,marginBottom:3}}>← Back</button>
        <h1 style={{fontFamily:"Outfit",fontSize:"clamp(18px,3vw,24px)",fontWeight:700}}>{mode==="lesson"?les?.name:"Speed Test"}</h1>
        {mode==="lesson"&&les&&<p style={{fontSize:11,color:C.dim,marginTop:2}}>{les.desc} · +{les.xp} XP</p>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
        <MS l="WPM" v={wpm} c={C.accent}/><MS l="ACCURACY" v={acc+"%"} c={accC}/><MS l="ERRORS" v={errs} c={errs===0?C.green:C.red}/><MS l="TIME" v={fmtT(elapsed)} c={C.text}/>
      </div>

      {/* Typing area */}
      <div onClick={()=>ref.current&&ref.current.focus()} style={{position:"relative",borderRadius:16,border:"1px solid "+C.border,background:C.surface,padding:"24px 22px",cursor:"text",minHeight:100}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:C.border,borderRadius:"16px 16px 0 0",overflow:"hidden"}}>
          <div style={{height:"100%",width:(typed.length/text.length*100)+"%",background:"linear-gradient(90deg,#0ea5e9,#8b5cf6)",transition:"width .12s"}}/>
        </div>
        <div style={{fontSize:"clamp(14px,1.8vw,17px)",lineHeight:2,letterSpacing:".02em",wordBreak:"break-word",userSelect:"none",paddingTop:4}}>
          {text.split("").map((ch,i)=>{
            let s={};
            if(i<typed.length){s=typed[i]===ch?{color:C.green}:{color:C.red,background:"rgba(239,68,68,.1)",borderRadius:2};}
            else if(i===typed.length){s={color:"#fff",background:"rgba(14,165,233,.2)",borderRadius:2,borderBottom:"2px solid "+C.accent,padding:"0 1px"};}
            else{s={color:C.dim};}
            return <span key={i} style={s}>{ch===" "&&i===typed.length?"·":ch}</span>;
          })}
        </div>
        <textarea ref={ref} value={typed} onChange={onChange} disabled={phase==="done"} autoFocus autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"text",resize:"none",fontSize:16}}/>
        {phase==="wait"&&(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:C.surface+"cc",backdropFilter:"blur(2px)",borderRadius:16}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8,animation:"pu 2s infinite"}}>⌨️</div>
              <div style={{fontSize:13,fontWeight:500}}>Click here and start typing</div>
              <div style={{fontSize:10,color:C.muted,marginTop:3}}>Timer starts on first keystroke</div>
            </div>
          </div>
        )}
      </div>

      {fg&&phase==="go"&&nCh&&nFS&&(
        <div style={{textAlign:"center",fontSize:12,color:C.muted}}>
          Next: <span style={{fontWeight:600,padding:"2px 8px",borderRadius:5,background:nFS.c+"18",color:nFS.c,border:"1px solid "+nFS.c+"33",fontSize:11}}>{nCh===" "?"SPACE":nCh}</span>
          <span style={{marginLeft:6,color:C.dim}}>({nFS.l})</span>
        </div>
      )}

      <KBD ak={nCh} fg={fg} phase={phase}/>

      {phase==="done"&&<Res wpm={wpm} acc={acc} errs={errs} time={elapsed} retry={reset} back={onBack}/>}
      {phase!=="done"&&<button onClick={reset} style={{width:"100%",padding:11,borderRadius:12,background:C.surface,border:"1px solid "+C.border,color:C.muted,fontSize:12,cursor:"pointer"}}>↺ Reset</button>}
    </div>
  );
}

function MS({l,v,c}){return(<div style={{textAlign:"center",padding:"10px 6px",borderRadius:10,border:"1px solid "+C.border,background:C.surface}}><div style={{fontFamily:"Outfit",fontSize:"clamp(16px,2.5vw,22px)",fontWeight:700,color:c}}>{v}</div><div style={{fontSize:8,color:C.dim,marginTop:2,letterSpacing:1.5,textTransform:"uppercase"}}>{l}</div></div>);}
function fmtT(s){return s<60?Math.floor(s)+"s":Math.floor(s/60)+"m "+Math.floor(s%60)+"s";}

/* ═══════════════════════════════════════════════
   KEYBOARD
   ═══════════════════════════════════════════════ */
function KBD({ak,fg,phase}){
  if(phase==="done") return null;
  const isA=k=>{if(!ak)return false;if(k==="Space")return ak===" ";if(k==="Shift"||k==="Shift2")return/[A-Z]/.test(ak);return k.toLowerCase()===ak.toLowerCase();};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center",userSelect:"none"}}>
      {KB.map((row,ri)=>(
        <div key={ri} style={{display:"flex",gap:3,justifyContent:"center"}}>
          {row.map((o,ki)=>{
            const a=isA(o.k);
            const f=FM[o.k.toLowerCase()]||FM[o.k==="Space"?" ":""];
            const fs=fg&&f?FS[f]:null;
            let lb=o.k;if(o.k==="Bksp")lb="⌫";else if(o.k==="Space")lb="";else if(o.k==="Shift"||o.k==="Shift2")lb="⇧";else if(o.k.length===1)lb=o.k.toUpperCase();
            return(
              <div key={ki} style={{width:o.w,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,transition:"all .08s",
                background:a?"rgba(14,165,233,.18)":(fs?fs.c+"08":C.surface),
                border:"1px solid "+(a?"rgba(14,165,233,.5)":(fs?fs.c+"25":C.border)),
                color:a?"#38bdf8":(fs?fs.c+"88":C.dim),
                transform:a?"scale(.93)":"none",
                boxShadow:a?"0 0 10px rgba(14,165,233,.12)":"none",
              }}>{lb}</div>
            );
          })}
        </div>
      ))}
      {fg&&<div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap",justifyContent:"center"}}>{Object.entries(FS).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:6,height:6,borderRadius:"50%",background:v.c}}/><span style={{fontSize:8,color:C.dim}}>{v.l}</span></div>))}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RESULTS
   ═══════════════════════════════════════════════ */
function Res({wpm,acc,errs,time,retry,back}){
  const g=wpm>=80&&acc>=95?"S":wpm>=60&&acc>=90?"A":wpm>=40&&acc>=80?"B":wpm>=25&&acc>=70?"C":"D";
  const gd={S:{gr:"linear-gradient(135deg,#f59e0b,#fbbf24)",m:"Outstanding!"},A:{gr:"linear-gradient(135deg,#22c55e,#4ade80)",m:"Excellent!"},B:{gr:"linear-gradient(135deg,#0ea5e9,#38bdf8)",m:"Good job!"},C:{gr:"linear-gradient(135deg,#8b5cf6,#a78bfa)",m:"Keep at it!"},D:{gr:"linear-gradient(135deg,#64748b,#94a3b8)",m:"Don't give up!"}};
  const d=gd[g];
  return(
    <div style={{borderRadius:18,border:"1px solid "+C.border,background:C.surface,padding:"32px 24px",textAlign:"center"}}>
      <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:68,height:68,borderRadius:16,background:d.gr,fontSize:34,fontFamily:"Outfit",fontWeight:800,color:C.bg}}>{g}</div>
      <h2 style={{fontFamily:"Outfit",fontSize:22,fontWeight:700,margin:"14px 0 4px"}}>{d.m}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,maxWidth:360,margin:"20px auto"}}>
        <div><div style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,color:C.accent}}>{wpm}</div><div style={{fontSize:9,color:C.dim}}>WPM</div></div>
        <div><div style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,color:C.green}}>{acc}%</div><div style={{fontSize:9,color:C.dim}}>Accuracy</div></div>
        <div><div style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,color:C.red}}>{errs}</div><div style={{fontSize:9,color:C.dim}}>Errors</div></div>
        <div><div style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,color:C.text}}>{fmtT(time)}</div><div style={{fontSize:9,color:C.dim}}>Time</div></div>
      </div>
      <div style={{fontSize:10,color:C.dim,marginBottom:18}}>S: 80+ WPM & 95%+ · A: 60+ & 90%+ · B: 40+ & 80%+ · C: 25+ & 70%+</div>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <Btn p onClick={retry}>Try Again</Btn><Btn onClick={back}>Back</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FALLING WORDS GAME (DOM-based)
   ═══════════════════════════════════════════════ */
function Game({onDone,onBack,snd}){
  const [phase,setPhase]=useState("idle");
  const [input,setInput]=useState("");
  const [words,setWords]=useState([]);
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(5);
  const [combo,setCombo]=useState(0);
  const [maxC,setMaxC]=useState(0);
  const [gLv,setGLv]=useState(1);
  const [wCt,setWCt]=useState(0);
  const iRef=useRef(null);
  const spRef=useRef(null);
  const tkRef=useRef(null);
  const sr=useRef({score:0,lives:5,combo:0,maxC:0,lv:1,w:0});
  const beep=useBeep(snd);

  const start=useCallback(()=>{
    sr.current={score:0,lives:5,combo:0,maxC:0,lv:1,w:0};
    setPhase("play");setInput("");setWords([]);setScore(0);setLives(5);setCombo(0);setMaxC(0);setGLv(1);setWCt(0);
    setTimeout(()=>iRef.current&&iRef.current.focus(),100);
  },[]);

  const end=useCallback(()=>{
    clearInterval(spRef.current);clearInterval(tkRef.current);
    setPhase("over");
    onDone(sr.current.score);
  },[onDone]);

  // Spawn
  useEffect(()=>{
    if(phase!=="play") return;
    const spawn=()=>{
      const w=GAME_WORDS[Math.floor(Math.random()*GAME_WORDS.length)];
      const x=8+Math.random()*72;
      setWords(p=>[...p,{id:Date.now()+Math.random(),text:w,x,y:-6,sp:.16+sr.current.lv*.035+Math.random()*.1}]);
    };
    spawn();
    const iv=Math.max(600,1700-sr.current.lv*90);
    spRef.current=setInterval(spawn,iv);
    return()=>clearInterval(spRef.current);
  },[phase,gLv]);

  // Tick
  useEffect(()=>{
    if(phase!=="play") return;
    tkRef.current=setInterval(()=>{
      setWords(prev=>{
        let nl=sr.current.lives;
        const out=[];
        for(const w of prev){
          const ny=w.y+w.sp;
          if(ny>=98){nl--;sr.current.lives=nl;sr.current.combo=0;}
          else out.push({...w,y:ny});
        }
        if(nl!==lives){setLives(sr.current.lives);setCombo(0);}
        if(sr.current.lives<=0){setTimeout(end,30);return[];}
        return out;
      });
    },50);
    return()=>clearInterval(tkRef.current);
  },[phase,end,lives]);

  const onIn=useCallback(e=>{
    const val=e.target.value.toLowerCase().trim();
    setInput(val);
    setWords(prev=>{
      const idx=prev.findIndex(w=>w.text===val);
      if(idx===-1) return prev;
      const s=sr.current;
      s.combo++;s.maxC=Math.max(s.maxC,s.combo);
      const pts=Math.round(val.length*10*(1+s.combo*.1));
      s.score+=pts;s.w++;
      if(s.w%8===0){s.lv++;setGLv(s.lv);}
      setScore(s.score);setCombo(s.combo);setMaxC(s.maxC);setWCt(s.w);
      beep(600+s.combo*20,.06,"square");
      setInput("");
      return[...prev.slice(0,idx),...prev.slice(idx+1)];
    });
  },[beep]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",padding:0,marginBottom:3}}>← Back</button>
          <h1 style={{fontFamily:"Outfit",fontSize:"clamp(18px,3vw,24px)",fontWeight:700}}>Falling Words</h1>
        </div>
        {phase==="play"&&(
          <div style={{display:"flex",gap:12,alignItems:"center",fontSize:11}}>
            <span style={{color:C.muted}}>Score <span style={{color:C.accent,fontWeight:700}}>{score}</span></span>
            <span style={{color:C.muted}}>Lv <span style={{color:"#a78bfa",fontWeight:700}}>{gLv}</span></span>
            <span style={{color:C.muted}}>×<span style={{color:C.amber,fontWeight:700}}>{combo}</span></span>
            <span>{Array.from({length:Math.max(0,lives)},()=>"❤️").join("")}</span>
          </div>
        )}
      </div>

      <div style={{position:"relative",borderRadius:16,border:"1px solid "+C.border,background:"#080a14",height:370,overflow:"hidden"}} onClick={()=>iRef.current&&iRef.current.focus()}>
        {phase==="play"&&words.map(w=>{
          const m=input.length>0&&w.text.startsWith(input);
          return(
            <div key={w.id} style={{position:"absolute",left:w.x+"%",top:w.y+"%",padding:"4px 10px",borderRadius:7,fontSize:12,fontWeight:500,whiteSpace:"nowrap",
              background:m?"rgba(14,165,233,.14)":"rgba(26,31,53,.7)",border:"1px solid "+(m?"rgba(14,165,233,.35)":"rgba(26,31,53,.3)"),color:m?"#38bdf8":C.muted,transition:"background .1s,border .1s,color .1s",transform:"translateX(-50%)"}}>
              {m?(<><span style={{color:C.accent}}>{w.text.slice(0,input.length)}</span><span>{w.text.slice(input.length)}</span></>):w.text}
            </div>
          );
        })}
        {phase==="play"&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"linear-gradient(90deg,rgba(239,68,68,.3),rgba(239,68,68,.1),rgba(239,68,68,.3))"}}/>}

        {phase==="idle"&&(
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#080a14ee"}}>
            <div style={{fontSize:44,marginBottom:14}}>▶</div>
            <h2 style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,marginBottom:6}}>Falling Words</h2>
            <p style={{fontSize:12,color:C.muted,marginBottom:22,textAlign:"center",maxWidth:280,lineHeight:1.6}}>Type falling words before they hit the bottom. Build combos for bonus points!</p>
            <Btn p onClick={start}>Start Game</Btn>
          </div>
        )}
        {phase==="over"&&(
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#080a14ee"}}>
            <div style={{fontSize:36,marginBottom:10}}>💀</div>
            <h2 style={{fontFamily:"Outfit",fontSize:20,fontWeight:700,marginBottom:18}}>Game Over</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,marginBottom:22}}>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"Outfit",fontSize:24,fontWeight:700,color:C.accent}}>{score}</div><div style={{fontSize:9,color:C.dim}}>Score</div></div>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"Outfit",fontSize:24,fontWeight:700,color:C.amber}}>{maxC}</div><div style={{fontSize:9,color:C.dim}}>Max Combo</div></div>
              <div style={{textAlign:"center"}}><div style={{fontFamily:"Outfit",fontSize:24,fontWeight:700,color:"#a78bfa"}}>{wCt}</div><div style={{fontSize:9,color:C.dim}}>Words</div></div>
            </div>
            <Btn p onClick={start}>Play Again</Btn>
          </div>
        )}
      </div>

      {phase==="play"&&(
        <input ref={iRef} value={input} onChange={onIn} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="Type the words here..."
          style={{width:"100%",padding:"12px 18px",borderRadius:12,background:C.surface,border:"1px solid "+C.border,color:C.text,fontSize:14,outline:"none"}}/>
      )}

      <div style={{borderRadius:12,border:"1px solid "+C.border,background:C.surface,padding:16}}>
        <div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:6}}>How to Play</div>
        <div style={{fontSize:11,color:C.dim,lineHeight:1.8}}>
          Words fall from the top — type each one fully to destroy it before it reaches the bottom.
          Consecutive correct words build a combo multiplier for extra points.
          Every 8 words increases the difficulty level. You start with 5 lives.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════════ */
function Stats({st,lv}){
  const aW=st.hist.length>0?Math.round(st.hist.reduce((s,h)=>s+h.wpm,0)/st.hist.length):0;
  const aA=st.hist.length>0?Math.round(st.hist.reduce((s,h)=>s+h.acc,0)/st.hist.length):0;
  const cMax=st.hist.length>0?Math.max(...st.hist.map(h=>h.wpm),20):20;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div><h1 style={{fontFamily:"Outfit",fontSize:"clamp(20px,3vw,28px)",fontWeight:700}}>Stats</h1><p style={{fontSize:12,color:C.muted,marginTop:3}}>Your typing journey</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        <IC l="Level" v={lv} c="#a78bfa"/><IC l="Total XP" v={st.xp.toLocaleString()} c={C.amber}/>
        <IC l="Best WPM" v={st.bWpm} c={C.accent}/><IC l="Best Accuracy" v={st.bAcc+"%"} c={C.green}/>
      </div>
      <div style={{borderRadius:18,border:"1px solid "+C.border,background:C.surface,padding:22}}>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:14}}>WPM History ({st.hist.length})</div>
        {st.hist.length>0?(
          <div style={{paddingLeft:32,position:"relative"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:20,display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:8,color:C.dim,width:28,textAlign:"right"}}>
              <span>{cMax}</span><span>{Math.round(cMax/2)}</span><span>0</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:2,height:140}}>
              {st.hist.map((h,i)=>{const pct=Math.max(3,(h.wpm/cMax)*100);return(
                <div key={i} title={h.wpm+" WPM · "+h.acc+"%"} style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",height:"100%",minWidth:3,cursor:"pointer"}}>
                  <div style={{width:"100%",borderRadius:"2px 2px 0 0",background:"linear-gradient(180deg,#38bdf8,#0ea5e9)",height:pct+"%",animation:"bg .4s ease-out",animationDelay:i*15+"ms",animationFillMode:"backwards",transformOrigin:"bottom"}}/>
                </div>
              );})}
            </div>
          </div>
        ):(
          <div style={{height:140,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,fontSize:12}}>Complete tests to see chart</div>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
        <IC l="Avg WPM" v={aW} c={C.text}/><IC l="Avg Accuracy" v={aA+"%"} c={C.text}/>
        <IC l="Lessons" v={st.cIds.length+"/"+LESSONS.length} c={C.text}/><IC l="Speed Tests" v={st.tests} c={C.text}/>
        <IC l="Game Best" v={st.bGame} c={C.text}/><IC l="Streak" v={st.streak+"d"} c={C.amber}/>
        <IC l="Chars Typed" v={st.tChars.toLocaleString()} c={C.text}/>
        <IC l="Practice Time" v={st.tSecs<60?Math.round(st.tSecs)+"s":st.tSecs<3600?Math.round(st.tSecs/60)+"m":(Math.round(st.tSecs/360)/10)+"h"} c={C.text}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ACHIEVEMENTS
   ═══════════════════════════════════════════════ */
function Badges({st}){
  const u=st.badges.length,t=ACH.length;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <h1 style={{fontFamily:"Outfit",fontSize:"clamp(20px,3vw,28px)",fontWeight:700}}>Achievements</h1>
        <p style={{fontSize:12,color:C.muted,marginTop:3}}>{u}/{t} unlocked</p>
        <div style={{marginTop:10,width:"100%",height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:(u/t*100)+"%",background:"linear-gradient(90deg,#f59e0b,#f97316)",borderRadius:3,transition:"width .5s"}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
        {ACH.map(a=>{const done=st.badges.includes(a.id);return(
          <div key={a.id} style={{padding:16,borderRadius:12,border:"1px solid "+(done?"rgba(245,158,11,.2)":C.border),background:done?"rgba(245,158,11,.03)":C.surface,opacity:done?1:.4,transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{fontSize:24,filter:done?"none":"grayscale(100%)",flexShrink:0}}>{a.icon}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600}}>{a.name}</div>
                <div style={{fontSize:10,color:C.dim,marginTop:2}}>{a.desc}</div>
                {done&&<div style={{fontSize:9,color:C.amber,marginTop:5,fontWeight:600}}>✓ Unlocked</div>}
              </div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}
