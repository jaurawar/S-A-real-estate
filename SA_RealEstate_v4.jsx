import { useState, useEffect, useRef } from "react";

const C = {
  bg:'#FAFAF7', bg2:'#F2EEE8', bg3:'#EDE8E0',
  card:'#FFFFFF', border:'#DDD9D0', bMid:'#C8C3B8',
  ink:'#1C1814', ink2:'#2C2820', muted:'#6E6A62', muted2:'#A8A49C',
};
const SER = "'Playfair Display', Georgia, serif";
const SAN = "'Outfit', 'Helvetica Neue', sans-serif";
const GF  = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap";

const TICKER = [
  'Delhi NCR Luxury Index  ↑ 18.4% YoY','Dubai Freehold Transactions  ↑ 36% Q1 2024',
  'Gurugram Premium Sector  Avg ₹18,400/sqft','Dubai Marina  Avg Yield 8.9% p.a.',
  'Dwarka Expressway Corridor  ↑ 22% (12 months)','Golden Visa Applications India  ↑ 41% YoY',
  'NCR Luxury Supply Deficit  −34% vs Demand','Business Bay Dubai  Occupancy 96.2%',
];

const PROPS = [
  { id:1, tag:'Exclusive',    title:'Sky Penthouse',      loc:'Golf Course Rd, Gurugram', mkt:'Delhi NCR', price:'₹ 8.5 Cr',  sqft:'4,200', typ:'Penthouse',  yld:7.8, cap:8.2 },
  { id:2, tag:'High ROI',     title:'Aerocity Villa',     loc:'IGI Aerocity, New Delhi',  mkt:'Delhi NCR', price:'₹ 14 Cr',   sqft:'6,800', typ:'Villa',       yld:9.2, cap:7.6 },
  { id:3, tag:'Golden Visa',  title:'Marina Heights',     loc:'Dubai Marina, UAE',        mkt:'Dubai',     price:'AED 3.2M',  sqft:'2,100', typ:'Apartment',   yld:8.5, cap:9.1 },
  { id:4, tag:'Zero Tax',     title:'Business Bay Suite', loc:'Business Bay, Dubai',      mkt:'Dubai',     price:'AED 1.8M',  sqft:'1,400', typ:'Commercial',  yld:10.1,cap:8.8 },
];

const STEPS = [
  { n:'01', t:'Discovery Call',  s:'30 min',    d:'We map your capital, goals, and risk appetite. No pitch decks — pure goal mapping.' },
  { n:'02', t:'Curated Report',  s:'48 hours',  d:'A bespoke shortlist of pre-vetted assets matched exactly to your profile and budget.' },
  { n:'03', t:'Due Diligence',   s:'1–2 weeks', d:'Full legal, financial, and on-site verification. Every number confirmed before you decide.' },
  { n:'04', t:'Close & Manage',  s:'Ongoing',   d:'End-to-end transaction support plus post-purchase management and exit planning.' },
];

const NCR_S = [['18–24%','Appreciation (3Yr)'],['₹2.4L Cr','Market Size'],['7–9%','Rental Yield p.a.'],['#1','Luxury Segment']];
const DXB_S = [['0%','Capital Gains Tax'],['8–11%','Gross Rental Yield'],['10 Yrs','Golden Visa'],['45%','Price Rise 2022–24']];

const MKT_CFG = {
  ncr:{ name:'Delhi NCR', currency:'₹', unit:'Cr', min:1, max:50, def:5, step:0.5, yld:7.2, cap:8.0, sym:'INR', note:'Based on NCR luxury segment averages. Inclusive of rental income and projected appreciation.' },
  dxb:{ name:'Dubai',     currency:'AED',unit:'M',  min:0.5,max:20,def:3, step:0.1, yld:8.8, cap:9.0, sym:'AED', note:'Based on Dubai freehold sector data. Net yield approx. 85% of gross figure shown.' },
};

/* ── label style shared everywhere ── */
const lbl = (extra={}) => ({ color:C.muted, fontSize:'10px', letterSpacing:'0.8px', textTransform:'uppercase', fontFamily:SAN, fontWeight:500, ...extra });
const tag = (extra={}) => ({ color:C.muted, fontSize:'9px', letterSpacing:'0.6px', textTransform:'uppercase', fontFamily:SAN, fontWeight:400, ...extra });

/* ── Ticker ── */
function Ticker() {
  const [x, setX] = useState(0);
  const txt = TICKER.join('   ·   ');
  const w   = txt.length * 6.6;
  useEffect(() => {
    let id; let pos = 0;
    const step = () => { pos -= 0.55; if (pos < -w) pos = 0; setX(pos); id = requestAnimationFrame(step); };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div style={{ background:C.ink, height:'28px', display:'flex', alignItems:'center', overflow:'hidden', userSelect:'none' }}>
      <div style={{ whiteSpace:'nowrap', transform:`translateX(${x}px)`, willChange:'transform' }}>
        <span style={{ color:C.muted2, fontSize:'10px', letterSpacing:'0.8px', fontFamily:SAN, fontWeight:400 }}>{txt}   ·   {txt}</span>
      </div>
    </div>
  );
}

/* ── Nav ── */
function Nav({ scrollTo, sr }) {
  const [scr, setScr] = useState(false);
  const [hov, setHov] = useState('');
  useEffect(() => {
    const el = sr.current;
    if (!el) return;
    const fn = () => setScr(el.scrollTop > 60);
    el.addEventListener('scroll', fn);
    return () => el.removeEventListener('scroll', fn);
  }, [sr]);
  return (
    <div style={{ position:'sticky', top:0, zIndex:100, height:'54px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', background:scr?'rgba(250,250,247,0.97)':'rgba(250,250,247,0.9)', backdropFilter:'blur(14px)', borderBottom:`1px solid ${scr?C.border:'transparent'}`, transition:'all 0.35s' }}>
      <div onClick={() => scrollTo('hero')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
        <div style={{ width:'20px', height:'20px', border:`1.5px solid ${C.ink}`, display:'grid', placeItems:'center', flexShrink:0 }}>
          <span style={{ color:C.ink, fontFamily:SER, fontSize:'10px', lineHeight:1 }}>S</span>
        </div>
        <span style={{ color:C.ink, fontFamily:SER, fontSize:'15px', fontWeight:400, letterSpacing:'0.5px' }}>S&A</span>
        <span style={{ color:C.muted2, ...tag() }}>Real Estate</span>
      </div>
      <div style={{ display:'flex', gap:'1.6rem', alignItems:'center' }}>
        {[['properties','Properties'],['calculator','ROI Calc'],['markets','Markets'],['about','About']].map(([id,l]) => (
          <span key={id} onClick={() => scrollTo(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov('')}
            style={{ color:hov===id?C.ink:C.muted, ...tag(), cursor:'pointer', transition:'color 0.18s', borderBottom:hov===id?`1px solid ${C.ink}`:'1px solid transparent', paddingBottom:'2px' }}>
            {l}
          </span>
        ))}
        <button onClick={() => scrollTo('booking')}
          onMouseEnter={e=>e.target.style.opacity='0.78'} onMouseLeave={e=>e.target.style.opacity='1'}
          style={{ background:C.ink, color:C.bg, border:'none', cursor:'pointer', padding:'6px 14px', ...tag({ color:C.bg }), transition:'opacity 0.18s' }}>
          Book Call
        </button>
      </div>
    </div>
  );
}

/* ── Hero ── */
function Hero({ scrollTo }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setVis(true), 80); return ()=>clearTimeout(t); }, []);
  return (
    <section id="hero" style={{ minHeight:'88vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'4.5rem 2rem 3rem', background:C.bg, position:'relative' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 63px,${C.border} 63px,${C.border} 64px),repeating-linear-gradient(90deg,transparent,transparent 63px,${C.border} 63px,${C.border} 64px)`, opacity:0.3, pointerEvents:'none' }} />
      <div style={{ position:'relative', maxWidth:'640px', opacity:vis?1:0, transform:vis?'none':'translateY(16px)', transition:'opacity 1s ease, transform 1s ease' }}>
        <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'1.8rem', padding:'4px 12px', border:`1px solid ${C.border}` }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#4CAF50', animation:'blink 2s infinite', flexShrink:0 }} />
          <span style={{ ...tag(), color:C.muted }}>Actively Advising — Delhi NCR & Dubai</span>
        </div>

        <h1 style={{ fontFamily:SER, fontSize:'clamp(1.9rem,4.5vw,3.2rem)', fontWeight:400, color:C.ink, lineHeight:1.18, marginBottom:'1rem', letterSpacing:'-0.2px' }}>
          Private Real Estate<br /><em style={{ fontStyle:'italic', color:C.muted }}>Advisory for Serious Investors</em>
        </h1>

        <p style={{ color:C.muted, fontSize:'13px', lineHeight:1.8, maxWidth:'400px', margin:'0 auto 2rem', fontFamily:SAN, fontWeight:300 }}>
          High-yield assets across Delhi NCR and Dubai — curated, verified, and managed end-to-end.
        </p>

        <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap', marginBottom:'2.2rem' }}>
          <button onClick={() => scrollTo('booking')}
            onMouseEnter={e=>e.target.style.opacity='0.8'} onMouseLeave={e=>e.target.style.opacity='1'}
            style={{ background:C.ink, color:C.bg, border:'none', cursor:'pointer', padding:'9px 20px', ...tag({ color:C.bg }), transition:'opacity 0.18s' }}>
            Book Private Consultation
          </button>
          <button onClick={() => scrollTo('calculator')}
            onMouseEnter={e=>e.target.style.background=C.bg2} onMouseLeave={e=>e.target.style.background='transparent'}
            style={{ background:'transparent', color:C.ink, border:`1px solid ${C.border}`, cursor:'pointer', padding:'9px 20px', ...tag({ color:C.ink }), transition:'background 0.18s' }}>
            Calculate My Returns →
          </button>
        </div>

        <div style={{ display:'flex', gap:'2.8rem', justifyContent:'center', flexWrap:'wrap', borderTop:`1px solid ${C.border}`, paddingTop:'1.8rem' }}>
          {[['₹500 Cr+','Under Advisory'],['180+','Active Clients'],['12 Yrs','Track Record']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:SER, fontSize:'1.6rem', color:C.ink, fontWeight:400, lineHeight:1.1 }}>{v}</div>
              <div style={{ ...tag({ color:C.muted2 }), marginTop:'4px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Properties ── */
function Properties({ scrollTo }) {
  const [filter, setFilter] = useState('All');
  const [hov, setHov] = useState(null);
  const shown = filter==='All' ? PROPS : PROPS.filter(p=>p.mkt===filter);
  return (
    <section id="properties" style={{ padding:'4.5rem 2rem', background:C.bg2, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ ...lbl({ marginBottom:'6px' }) }}>Featured Opportunities</p>
            <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink, lineHeight:1.2 }}>
              Curated Assets. <em>Exceptional Returns.</em>
            </h2>
          </div>
          <div style={{ display:'flex', border:`1px solid ${C.border}`, overflow:'hidden' }}>
            {['All','Delhi NCR','Dubai'].map(f => (
              <button key={f} onClick={()=>setFilter(f)}
                style={{ background:filter===f?C.ink:'transparent', color:filter===f?C.bg:C.muted, border:'none', cursor:'pointer', padding:'6px 13px', ...tag({ color:filter===f?C.bg:C.muted }), transition:'all 0.2s' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(234px,1fr))', gap:'1px', background:C.border }}>
          {shown.map(p => (
            <div key={p.id} onMouseEnter={()=>setHov(p.id)} onMouseLeave={()=>setHov(null)}
              style={{ background:hov===p.id?C.card:C.bg2, transition:'background 0.25s', display:'flex', flexDirection:'column' }}>
              <div style={{ height:'12px', background:C.ink, display:'flex', alignItems:'center', paddingLeft:'10px' }}>
                <span style={{ ...tag({ color:C.bg }) }}>{p.tag}</span>
              </div>
              <div style={{ padding:'1rem', flex:1, display:'flex', flexDirection:'column' }}>
                <div style={{ marginBottom:'0.8rem' }}>
                  <div style={{ ...tag({ color:C.muted2, marginBottom:'3px' }) }}>{p.typ} · {p.mkt}</div>
                  <h3 style={{ fontFamily:SER, fontSize:'1.05rem', color:C.ink, fontWeight:400, marginBottom:'2px', lineHeight:1.2 }}>{p.title}</h3>
                  <p style={{ color:C.muted, fontSize:'11px', fontFamily:SAN, fontWeight:300 }}>{p.loc}</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px', marginBottom:'0.9rem' }}>
                  {[['Rental Yield', p.yld+'%'],['Cap. Growth p.a.', p.cap+'%']].map(([k,v])=>(
                    <div key={k} style={{ background:C.bg3, padding:'7px 8px', borderRadius:'2px' }}>
                      <div style={{ fontFamily:SER, fontSize:'0.95rem', color:C.ink, fontWeight:400, lineHeight:1 }}>{v}</div>
                      <div style={{ ...tag({ color:C.muted, marginTop:'3px', fontSize:'8px' }) }}>{k}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:`1px solid ${C.border}`, paddingTop:'0.75rem', marginTop:'auto' }}>
                  <div>
                    <div style={{ fontFamily:SER, fontSize:'1rem', color:C.ink, fontWeight:400 }}>{p.price}</div>
                    <div style={{ color:C.muted, fontSize:'11px', fontFamily:SAN, fontWeight:300 }}>{p.sqft} sq ft</div>
                  </div>
                  <span onClick={()=>scrollTo('booking')}
                    onMouseEnter={e=>{e.target.style.color=C.ink; e.target.style.borderColor=C.ink;}}
                    onMouseLeave={e=>{e.target.style.color=C.muted; e.target.style.borderColor=C.muted2;}}
                    style={{ color:C.muted, ...tag({ color:C.muted }), cursor:'pointer', borderBottom:`1px solid ${C.muted2}`, paddingBottom:'1px', transition:'all 0.15s' }}>
                    Enquire →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color:C.muted2, fontSize:'11px', fontFamily:SAN, fontStyle:'italic', textAlign:'center', marginTop:'1.2rem' }}>
          Curated selection only. Full inventory available to registered clients.
        </p>
      </div>
    </section>
  );
}

/* ── ROI Calculator ── */
function ROICalculator() {
  const [mkt, setMkt] = useState('ncr');
  const [val, setVal] = useState(5);
  const [yr,  setYr]  = useState(5);
  const cfg = MKT_CFG[mkt];
  useEffect(()=>{ setVal(cfg.def); }, [mkt]);

  const principal  = val * 1e7;
  const annualRent = principal * (cfg.yld/100);
  const totalRent  = annualRent * yr;
  const futureVal  = principal * Math.pow(1+cfg.cap/100, yr);
  const capGain    = futureVal - principal;
  const totalRet   = totalRent + capGain;
  const totalROI   = ((totalRet/principal)*100).toFixed(1);

  const fmt = n => {
    if (cfg.sym==='INR') return n>=1e7 ? `₹${(n/1e7).toFixed(2)} Cr` : `₹${(n/1e5).toFixed(1)} L`;
    return n>=1e6 ? `AED ${(n/1e6).toFixed(2)}M` : `AED ${(n/1e3).toFixed(0)}K`;
  };
  const bars = [
    { label:'Principal',     val:principal, color:C.bMid,   fmt:fmt(principal) },
    { label:'Rental Income', val:totalRent, color:'#7B9E87', fmt:fmt(totalRent) },
    { label:'Capital Gain',  val:capGain,   color:C.ink,     fmt:fmt(capGain) },
  ];
  const maxBar = Math.max(...bars.map(b=>b.val));

  return (
    <section id="calculator" style={{ padding:'4.5rem 2rem', background:C.bg, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'940px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <p style={{ ...lbl({ marginBottom:'6px' }) }}>Investment Intelligence</p>
          <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink }}>
            Calculate Your <em>Projected Returns</em>
          </h2>
          <p style={{ color:C.muted, fontSize:'12px', fontFamily:SAN, fontWeight:300, marginTop:'4px' }}>Based on verified market averages — not projections. Not promises.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1px', background:C.border }}>
          {/* Controls */}
          <div style={{ background:C.bg2, padding:'1.8rem' }}>
            <div style={{ marginBottom:'1.6rem' }}>
              <div style={{ ...lbl({ marginBottom:'7px' }) }}>Select Market</div>
              <div style={{ display:'flex', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                {[['ncr','Delhi NCR'],['dxb','Dubai']].map(([k,l])=>(
                  <button key={k} onClick={()=>setMkt(k)}
                    style={{ flex:1, background:mkt===k?C.ink:'transparent', color:mkt===k?C.bg:C.muted, border:'none', cursor:'pointer', padding:'7px', ...tag({ color:mkt===k?C.bg:C.muted }), transition:'all 0.2s' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:'1.6rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                <span style={{ ...lbl() }}>Investment Amount</span>
                <span style={{ fontFamily:SER, fontSize:'1rem', color:C.ink, fontWeight:400 }}>{cfg.currency} {val} {cfg.unit}</span>
              </div>
              <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={val} onChange={e=>setVal(parseFloat(e.target.value))}
                style={{ width:'100%', accentColor:C.ink }} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'3px' }}>
                <span style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>{cfg.currency} {cfg.min} {cfg.unit}</span>
                <span style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>{cfg.currency} {cfg.max} {cfg.unit}</span>
              </div>
            </div>
            <div style={{ marginBottom:'1.6rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'7px' }}>
                <span style={{ ...lbl() }}>Time Horizon</span>
                <span style={{ fontFamily:SER, fontSize:'1rem', color:C.ink }}>{yr} {yr===1?'Year':'Years'}</span>
              </div>
              <div style={{ display:'flex', gap:'4px' }}>
                {[1,3,5,7,10].map(y=>(
                  <button key={y} onClick={()=>setYr(y)}
                    style={{ flex:1, background:yr===y?C.ink:'transparent', color:yr===y?C.bg:C.muted, border:`1px solid ${yr===y?C.ink:C.border}`, cursor:'pointer', padding:'6px 0', fontSize:'10px', fontFamily:SAN, fontWeight:yr===y?600:400, transition:'all 0.18s', borderRadius:'2px' }}>
                    {y}Y
                  </button>
                ))}
              </div>
            </div>
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:'0.9rem', color:C.muted2, fontSize:'10px', fontFamily:SAN, lineHeight:1.65, fontStyle:'italic' }}>
              {cfg.note}
            </div>
          </div>
          {/* Output */}
          <div style={{ background:C.bg, padding:'1.8rem', display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px' }}>
              {[
                { l:'Total Return',       v:fmt(totalRet),  big:true  },
                { l:`ROI over ${yr}Y`,    v:`${totalROI}%`, big:true  },
                { l:'Annual Rental',      v:fmt(annualRent),big:false },
                { l:'Future Asset Value', v:fmt(futureVal), big:false },
              ].map(({l,v,big})=>(
                <div key={l} style={{ background:big?C.ink:C.bg2, padding:big?'0.9rem':'0.75rem', borderRadius:'2px', transition:'all 0.3s' }}>
                  <div style={{ ...tag({ color:big?C.muted2:C.muted, marginBottom:'4px' }) }}>{l}</div>
                  <div style={{ fontFamily:SER, fontSize:big?'1.2rem':'0.95rem', color:big?C.bg:C.ink, fontWeight:400, lineHeight:1 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:'8px' }}>
              <div style={{ ...lbl({ marginBottom:'3px' }) }}>Return Breakdown</div>
              {bars.map(b=>(
                <div key={b.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                    <span style={{ fontSize:'11px', fontFamily:SAN, color:C.muted }}>{b.label}</span>
                    <span style={{ fontSize:'11px', fontFamily:SAN, color:C.ink, fontWeight:500 }}>{b.fmt}</span>
                  </div>
                  <div style={{ height:'4px', background:C.bg3, borderRadius:'2px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.round((b.val/maxBar)*100)}%`, background:b.color, transition:'width 0.45s ease', borderRadius:'2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Process ── */
function Process() {
  return (
    <section id="process" style={{ padding:'4.5rem 2rem', background:C.bg2, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'960px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <p style={{ ...lbl({ marginBottom:'6px' }) }}>Advisory Process</p>
          <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink }}>
            From Vision to <em>Verified Asset</em>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))', gap:'0' }}>
          {STEPS.map((s,i)=>(
            <div key={s.n} style={{ padding:'1.4rem 1.3rem', borderLeft:i>0?`1px solid ${C.border}`:'none' }}>
              <div style={{ fontFamily:SER, fontSize:'1.8rem', color:C.bg3, fontWeight:400, lineHeight:1, marginBottom:'3px', WebkitTextStroke:`1px ${C.border}` }}>{s.n}</div>
              <div style={{ width:'12px', height:'1.5px', background:C.ink, marginBottom:'0.8rem' }} />
              <div style={{ ...tag({ color:C.muted, marginBottom:'4px' }) }}>{s.s}</div>
              <h3 style={{ fontFamily:SER, fontSize:'1rem', color:C.ink, fontWeight:400, marginBottom:'0.45rem', lineHeight:1.2 }}>{s.t}</h3>
              <p style={{ color:C.muted, fontSize:'11px', lineHeight:1.7, fontFamily:SAN, fontWeight:300 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Markets ── */
function MarketFocus() {
  const [act, setAct] = useState('ncr');
  const info = {
    ncr:{ h:'Delhi NCR', em:"India's Luxury Epicenter", stats:NCR_S, p1:'The NCR corridor — Gurugram, Noida, and South Delhi — is seeing its most aggressive luxury expansion in two decades. Dwarka Expressway, Jewar Airport, and Metro Phase 4 are unlocking entirely new micro-markets.', p2:'Ultra-HNI migration from Tier-2 cities combined with NRI repatriation capital is creating structural demand that supply cannot match — a textbook capital appreciation setup.' },
    dxb:{ h:'Dubai', em:'The Zero-Tax Frontier', stats:DXB_S, p1:'Dubai offers what few global cities can: zero income tax, zero capital gains tax, and a maturing framework built to protect foreign investors. The Golden Visa program creates structural incentives for long-term HNI capital.', p2:'For Indian investors, Dubai is a natural hedge — dollar-denominated returns, sovereign stability, and direct connectivity making asset management seamless from anywhere in India.' },
  }[act];
  return (
    <section id="markets" style={{ padding:'4.5rem 2rem', background:C.bg, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <p style={{ ...lbl({ marginBottom:'6px' }) }}>Market Intelligence</p>
          <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink }}>Two Markets. <em>One Strategy.</em></h2>
        </div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:'2.2rem' }}>
          <div style={{ display:'flex', border:`1px solid ${C.border}`, overflow:'hidden' }}>
            {[['ncr','Delhi NCR'],['dxb','Dubai']].map(([k,l])=>(
              <button key={k} onClick={()=>setAct(k)}
                style={{ background:act===k?C.ink:'transparent', color:act===k?C.bg:C.muted, border:'none', cursor:'pointer', padding:'7px 26px', ...tag({ color:act===k?C.bg:C.muted }), transition:'all 0.2s', minWidth:'100px' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(255px,1fr))', gap:'2.8rem', alignItems:'start' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:C.border }}>
            {info.stats.map(([v,l])=>(
              <div key={l} style={{ background:C.bg2, padding:'1.3rem', textAlign:'center' }}>
                <div style={{ fontFamily:SER, fontSize:'1.55rem', color:C.ink, fontWeight:400, marginBottom:'3px', lineHeight:1 }}>{v}</div>
                <div style={{ ...tag({ color:C.muted }) }}>{l}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontFamily:SER, fontSize:'1.4rem', color:C.ink, fontWeight:400, marginBottom:'1rem', lineHeight:1.25 }}>
              {info.h} — <em>{info.em}</em>
            </h3>
            <p style={{ color:C.muted, fontSize:'12px', lineHeight:1.82, fontFamily:SAN, fontWeight:300, marginBottom:'0.8rem' }}>{info.p1}</p>
            <p style={{ color:C.muted, fontSize:'12px', lineHeight:1.82, fontFamily:SAN, fontWeight:300 }}>{info.p2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Founder ── */
function Founder({ scrollTo }) {
  return (
    <section id="about" style={{ padding:'4.5rem 2rem', background:C.bg2, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(235px,1fr))', gap:'3rem', alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <div style={{ paddingBottom:'108%', background:C.bg3, border:`1px solid ${C.border}`, position:'relative' }}>
            <div style={{ position:'absolute', bottom:'-10px', right:'-10px', width:'44%', height:'44%', border:`1px solid ${C.border}` }} />
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'50%', border:`1px solid ${C.bMid}`, display:'grid', placeItems:'center' }}>
                <span style={{ fontFamily:SER, fontSize:'1rem', color:C.ink }}>S</span>
              </div>
              <span style={{ color:C.muted2, fontSize:'9px', letterSpacing:'1.5px', fontFamily:SAN }}>FOUNDER PHOTO</span>
            </div>
          </div>
        </div>
        <div>
          <p style={{ ...lbl({ marginBottom:'7px' }) }}>The Advisory</p>
          <h2 style={{ fontFamily:SER, fontSize:'1.7rem', color:C.ink, fontWeight:400, marginBottom:'3px', lineHeight:1.15 }}>S&A Real Estate</h2>
          <p style={{ color:C.muted2, fontSize:'11px', letterSpacing:'0.5px', fontFamily:SAN, marginBottom:'1.3rem' }}>Founded by practitioners, not theorists.</p>
          <p style={{ color:C.muted, fontSize:'12px', lineHeight:1.82, fontFamily:SAN, fontWeight:300, marginBottom:'1.3rem' }}>S&A was built on one principle: most real estate advisory is driven by inventory, not intelligence. We operate the inverse — every recommendation starts from your capital goals and works backward to the asset.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'1.4rem' }}>
            {['15+ years combined experience in luxury real estate','RERA Registered · DIFC-Compliant advisory framework','Zero commission conflicts — transparent, fee-only structure','Mandates across Gurugram, South Delhi & Dubai Marina'].map(c=>(
              <div key={c} style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                <span style={{ color:C.muted2, fontSize:'9px', marginTop:'3px', flexShrink:0 }}>—</span>
                <span style={{ color:C.muted, fontSize:'11.5px', fontFamily:SAN, fontWeight:300, lineHeight:1.55 }}>{c}</span>
              </div>
            ))}
          </div>
          <div style={{ borderLeft:`2px solid ${C.border}`, paddingLeft:'1rem', marginBottom:'1.4rem' }}>
            <p style={{ fontFamily:SER, fontSize:'0.92rem', color:C.ink, fontStyle:'italic', lineHeight:1.72, marginBottom:'4px' }}>
              "They sourced a Dubai pre-launch asset at 22% below market. Six months later — fully tenanted at 9.8% yield."
            </p>
            <span style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>— Mr. R. Gupta, NCR Client</span>
          </div>
          <button onClick={()=>scrollTo('booking')}
            onMouseEnter={e=>{e.target.style.background=C.ink; e.target.style.color=C.bg;}}
            onMouseLeave={e=>{e.target.style.background='transparent'; e.target.style.color=C.ink;}}
            style={{ background:'transparent', color:C.ink, border:`1px solid ${C.ink}`, cursor:'pointer', padding:'8px 18px', ...tag({ color:C.ink }), transition:'all 0.2s' }}>
            Begin Advisory Journey →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Investment Snapshot ── */
function Snapshot({ scrollTo }) {
  const [step, setStep] = useState(0);
  const [ans,  setAns]  = useState({});
  const [done, setDone] = useState(false);
  const Qs = [
    { k:'goal',     q:'What is your primary investment goal?',    opts:['Rental Income','Capital Growth','Golden Visa / Residency','Wealth Diversification','All of the Above'] },
    { k:'budget',   q:'What is your approximate budget?',         opts:['₹2–5 Cr / AED 1M','₹5–10 Cr / AED 2M','₹10–25 Cr / AED 3–5M','₹25 Cr+ / AED 5M+'] },
    { k:'market',   q:'Which market interests you most?',         opts:['Delhi NCR Only','Dubai Only','Both Markets','Not Sure — Need Guidance'] },
    { k:'timeline', q:'When are you looking to invest?',          opts:['Immediately (< 3 months)','This Year','Next 1–2 Years','Just Exploring'] },
  ];
  const pick = (k,v) => {
    setAns({...ans,[k]:v});
    if (step<Qs.length-1) setTimeout(()=>setStep(step+1), 200);
    else setTimeout(()=>setDone(true), 200);
  };
  const rec = () => {
    if (!ans.market) return 'Dubai + Delhi NCR Portfolio';
    if (ans.market.includes('Dubai')) return 'Dubai Freehold Portfolio';
    if (ans.market.includes('Delhi')) return 'Delhi NCR Luxury Segment';
    return 'Cross-Market Advisory';
  };
  return (
    <section id="snapshot" style={{ padding:'4.5rem 2rem', background:C.bg3, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'640px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <p style={{ ...lbl({ marginBottom:'6px' }) }}>Quick Profile</p>
          <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink }}>
            Get Your <em>Investment Snapshot</em>
          </h2>
          <p style={{ color:C.muted, fontSize:'12px', fontFamily:SAN, fontWeight:300, marginTop:'4px' }}>4 questions. 60 seconds. Personalised market recommendation.</p>
        </div>
        {done ? (
          <div style={{ background:C.bg, border:`1px solid ${C.border}`, padding:'2rem', textAlign:'center' }}>
            <div style={{ width:'38px', height:'38px', border:`1px solid ${C.ink}`, borderRadius:'50%', display:'grid', placeItems:'center', margin:'0 auto 1rem' }}>
              <span style={{ color:C.ink, fontSize:'0.9rem' }}>✓</span>
            </div>
            <p style={{ ...lbl({ marginBottom:'5px' }) }}>Recommended Strategy</p>
            <h3 style={{ fontFamily:SER, fontSize:'1.5rem', color:C.ink, fontWeight:400, marginBottom:'0.9rem', lineHeight:1.2 }}>{rec()}</h3>
            <p style={{ color:C.muted, fontSize:'12px', fontFamily:SAN, lineHeight:1.75, marginBottom:'1.5rem', maxWidth:'360px', margin:'0 auto 1.5rem' }}>
              Based on your profile, our advisors will prepare a curated shortlist of matching assets within 48 hours of your consultation.
            </p>
            <div style={{ display:'flex', gap:'7px', justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={()=>scrollTo('booking')}
                onMouseEnter={e=>e.target.style.opacity='0.8'} onMouseLeave={e=>e.target.style.opacity='1'}
                style={{ background:C.ink, color:C.bg, border:'none', cursor:'pointer', padding:'9px 20px', ...tag({ color:C.bg }), transition:'opacity 0.18s' }}>
                Book Consultation →
              </button>
              <button onClick={()=>{setStep(0);setAns({});setDone(false);}}
                style={{ background:'transparent', color:C.muted, border:`1px solid ${C.border}`, cursor:'pointer', padding:'9px 16px', ...tag({ color:C.muted }) }}>
                Restart
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background:C.bg, border:`1px solid ${C.border}`, padding:'1.8rem' }}>
            <div style={{ display:'flex', gap:'3px', marginBottom:'1.6rem' }}>
              {Qs.map((_,i)=>(
                <div key={i} style={{ flex:1, height:'2px', background:i<=step?C.ink:C.border, transition:'background 0.25s', borderRadius:'1px' }} />
              ))}
            </div>
            <p style={{ ...tag({ color:C.muted, marginBottom:'5px' }) }}>Question {step+1} of {Qs.length}</p>
            <h3 style={{ fontFamily:SER, fontSize:'1.1rem', color:C.ink, fontWeight:400, marginBottom:'1.1rem', lineHeight:1.35 }}>{Qs[step].q}</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
              {Qs[step].opts.map(o=>(
                <button key={o} onClick={()=>pick(Qs[step].k,o)}
                  style={{ background:ans[Qs[step].k]===o?C.ink:'transparent', color:ans[Qs[step].k]===o?C.bg:C.ink, border:`1px solid ${ans[Qs[step].k]===o?C.ink:C.border}`, cursor:'pointer', padding:'9px 13px', fontSize:'12px', fontFamily:SAN, fontWeight:ans[Qs[step].k]===o?500:400, textAlign:'left', transition:'all 0.16s', lineHeight:1 }}
                  onMouseEnter={e=>{if(ans[Qs[step].k]!==o){e.target.style.borderColor=C.ink; e.target.style.background=C.bg2;}}}
                  onMouseLeave={e=>{if(ans[Qs[step].k]!==o){e.target.style.borderColor=C.border; e.target.style.background='transparent';}}}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Booking ── */
function Booking() {
  const [form, setForm] = useState({ name:'', phone:'', budget:'', market:'', msg:'' });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState('');
  const valid = form.name.trim().length>0 && form.phone.trim().length>0;
  const submit = async () => {
    if (!valid||loading) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false); setDone(true);
  };
  const iS = f => ({ width:'100%', background:'transparent', border:'none', borderBottom:`1px solid ${focus===f?C.ink:C.border}`, color:C.ink, padding:'8px 0', fontSize:'12px', fontFamily:SAN, outline:'none', transition:'border-color 0.2s', boxSizing:'border-box' });
  return (
    <section id="booking" style={{ padding:'4.5rem 2rem', background:C.bg, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:'1020px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'2.8rem' }}>
          <p style={{ ...lbl({ marginBottom:'6px' }) }}>Private Consultation</p>
          <h2 style={{ fontFamily:SER, fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:400, color:C.ink, marginBottom:'4px' }}>
            Your Portfolio. <em>Our Priority.</em>
          </h2>
          <p style={{ color:C.muted, fontSize:'12px', fontFamily:SAN, fontWeight:300 }}>No obligation. Strictly confidential. 48-hour response.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(255px,1fr))', gap:'3rem', alignItems:'start' }}>
          <div>
            {done ? (
              <div style={{ textAlign:'center', padding:'2.5rem 1.5rem', background:C.bg2, border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.9rem' }}>
                <div style={{ width:'38px', height:'38px', border:`1px solid ${C.ink}`, borderRadius:'50%', display:'grid', placeItems:'center' }}>
                  <span style={{ color:C.ink, fontSize:'0.9rem' }}>✓</span>
                </div>
                <h3 style={{ fontFamily:SER, fontSize:'1.3rem', color:C.ink, fontWeight:400 }}>Request Received</h3>
                <p style={{ color:C.muted, fontSize:'12px', fontFamily:SAN, lineHeight:1.75, maxWidth:'210px' }}>Our advisory team will contact you within 48 hours for your private consultation.</p>
              </div>
            ) : (
              <div style={{ background:C.bg2, border:`1px solid ${C.border}`, padding:'1.6rem', display:'flex', flexDirection:'column', gap:'1.2rem' }}>
                {[{k:'name',lbl:'Full Name *',ph:'Your full name'},{k:'phone',lbl:'Phone *',ph:'+91 or +971'}].map(({k,lbl,ph})=>(
                  <div key={k}>
                    <label style={{ ...tag({ color:C.muted, display:'block', marginBottom:'4px' }) }}>{lbl}</label>
                    <input value={form[k]} placeholder={ph} onChange={e=>setForm({...form,[k]:e.target.value})} onFocus={()=>setFocus(k)} onBlur={()=>setFocus('')} style={iS(k)} />
                  </div>
                ))}
                {[{k:'budget',lbl:'Budget',opts:['Select range','₹2–5 Cr','₹5–10 Cr','₹10–20 Cr','₹20 Cr+','AED 1–3M','AED 3M+']},{k:'market',lbl:'Market',opts:['Select','Delhi NCR','Dubai','Both']}].map(({k,lbl,opts})=>(
                  <div key={k}>
                    <label style={{ ...tag({ color:C.muted, display:'block', marginBottom:'4px' }) }}>{lbl}</label>
                    <select value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} onFocus={()=>setFocus(k)} onBlur={()=>setFocus('')} style={{ ...iS(k), background:'transparent', cursor:'pointer' }}>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label style={{ ...tag({ color:C.muted, display:'block', marginBottom:'4px' }) }}>Message</label>
                  <textarea value={form.msg} placeholder="Investment goals or questions..." rows={2} onChange={e=>setForm({...form,msg:e.target.value})} onFocus={()=>setFocus('msg')} onBlur={()=>setFocus('')} style={{ ...iS('msg'), resize:'none', lineHeight:1.6 }} />
                </div>
                <button onClick={submit} disabled={!valid||loading}
                  style={{ background:valid?C.ink:C.bg3, color:valid?C.bg:C.muted2, border:`1px solid ${valid?C.ink:C.border}`, cursor:valid?'pointer':'not-allowed', padding:'10px', ...tag({ color:valid?C.bg:C.muted2 }), width:'100%', transition:'all 0.2s' }}>
                  {loading ? 'Submitting...' : 'Request Private Consultation'}
                </button>
                <p style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN, textAlign:'center', fontStyle:'italic' }}>Strictly confidential.</p>
              </div>
            )}
          </div>
          <div>
            <div style={{ background:C.bg2, border:`1px solid ${C.border}`, padding:'1.5rem', marginBottom:'7px' }}>
              <h3 style={{ fontFamily:SER, fontSize:'1.05rem', color:C.ink, fontWeight:400, marginBottom:'1rem', lineHeight:1.2 }}>What to Expect</h3>
              {[['30-min discovery call','No pitch. Pure goal mapping.'],['Curated shortlist in 48 hrs','Pre-vetted assets matched to your profile.'],['Full due diligence support','Legal, financial, and site verification.'],['Transparent fee structure','Zero brokerage games from day one.']].map(([t,d],i,a)=>(
                <div key={t} style={{ display:'flex', gap:'9px', alignItems:'flex-start', paddingBottom:'0.8rem', marginBottom:'0.8rem', borderBottom:i<a.length-1?`1px solid ${C.border}`:'none' }}>
                  <div style={{ width:'3px', height:'3px', background:C.ink, marginTop:'5px', flexShrink:0 }} />
                  <div>
                    <div style={{ color:C.ink, fontSize:'12px', fontFamily:SAN, fontWeight:500, marginBottom:'2px' }}>{t}</div>
                    <div style={{ color:C.muted, fontSize:'11px', fontFamily:SAN, fontWeight:300, lineHeight:1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/919999999999?text=Hi%2C+interested+in+S%26A+advisory" target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'9px', background:'#075E54', color:'#fff', padding:'0.85rem 1rem', textDecoration:'none' }}>
              <span style={{ fontSize:'0.95rem' }}>💬</span>
              <div>
                <div style={{ fontSize:'11px', fontFamily:SAN, fontWeight:600, letterSpacing:'0.3px' }}>WhatsApp Direct Line</div>
                <div style={{ fontSize:'10px', opacity:0.6, fontFamily:SAN }}>Response within 2 hours</div>
              </div>
              <span style={{ marginLeft:'auto', fontSize:'11px' }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer({ scrollTo }) {
  return (
    <footer style={{ background:C.bg2, borderTop:`1px solid ${C.border}`, padding:'1.6rem 2rem' }}>
      <div style={{ maxWidth:'1060px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.8rem' }}>
        <div onClick={()=>scrollTo('hero')} style={{ cursor:'pointer' }}>
          <div style={{ fontFamily:SER, fontSize:'0.95rem', color:C.ink, marginBottom:'2px' }}>S&A Real Estate</div>
          <div style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>Private Advisory · Delhi NCR & Dubai</div>
        </div>
        <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap' }}>
          {['RERA Registered','DIFC Compliant','Fee-Only Advisory'].map(t=>(
            <span key={t} style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>{t}</span>
          ))}
        </div>
        <div style={{ color:C.muted2, fontSize:'10px', fontFamily:SAN }}>© 2024 S&A Real Estate Advisory</div>
      </div>
    </footer>
  );
}

/* ── Float WA ── */
function FloatWA() {
  const [h, setH] = useState(false);
  return (
    <a href="https://wa.me/919999999999?text=Hi" target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ position:'fixed', bottom:'1.3rem', right:'1.3rem', zIndex:999, background:'#25D366', borderRadius:'50%', width:'44px', height:'44px', display:'grid', placeItems:'center', textDecoration:'none', transform:h?'scale(1.1)':'scale(1)', transition:'transform 0.2s' }}>
      <span style={{ fontSize:'1.1rem', lineHeight:1 }}>💬</span>
    </a>
  );
}

/* ── App ── */
export default function App() {
  const sr = useRef(null);
  useEffect(()=>{
    const l = document.createElement('link');
    l.href=GF; l.rel='stylesheet';
    document.head.appendChild(l);
    return ()=>document.head.removeChild(l);
  },[]);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  return (
    <div ref={sr} style={{ background:C.bg, color:C.ink, fontFamily:SAN, overflowY:'auto', height:'100vh', WebkitOverflowScrolling:'touch' }}>
      <Ticker />
      <Nav scrollTo={scrollTo} sr={sr} />
      <Hero scrollTo={scrollTo} />
      <Properties scrollTo={scrollTo} />
      <ROICalculator />
      <Process />
      <MarketFocus />
      <Founder scrollTo={scrollTo} />
      <Snapshot scrollTo={scrollTo} />
      <Booking />
      <Footer scrollTo={scrollTo} />
      <FloatWA />
    </div>
  );
}
