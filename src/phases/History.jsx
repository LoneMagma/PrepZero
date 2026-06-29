import { useState } from 'react'
import { useC, F, fmt, wc, fdate } from '../tokens.jsx'

export default function History({ sessions, onBack }) {
  const C = useC()
  const [sel,    setSel]    = useState(null)
  const [search, setSearch] = useState('')

  const filtered = sessions.filter(s =>
    !search || s.topicText.toLowerCase().includes(search.toLowerCase())
  )

  if (sel) return <Detail s={sel} onBack={() => setSel(null)} C={C} />

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', animation:'rise 0.32s ease' }}>

      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:28, gap:12 }}>
        <h2 style={{ fontFamily:F.display, fontSize:'clamp(36px,10vw,50px)', fontWeight:700, color:C.ink, letterSpacing:'-1px' }}>History</h2>
        <button onClick={onBack} style={{ fontSize:13, color:C.faint, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3, flexShrink:0, minHeight:44 }}>
          ← home
        </button>
      </div>

      {sessions.length > 4 && (
        <div style={{ marginBottom:16, position:'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search topics..."
            style={{
              width:'100%', padding:'10px 14px 10px 36px',
              border:`1.5px solid ${C.border}`, borderRadius:8, background:C.surf,
              fontSize:14, color:C.ink, transition:'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor=C.sage}
            onBlur={e => e.target.style.borderColor=C.border}
          />
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.faint, fontSize:15 }}>⌕</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <p style={{ color:C.faint, fontStyle:'italic', marginTop:24 }}>{sessions.length===0?'no sessions yet':'no matches'}</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {filtered.map((s,i) => (
            <div key={s.id} style={{ animation:`rise 0.3s ${i*0.035}s ease both` }}>
              <Row s={s} onClick={() => setSel(s)} C={C} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ s, onClick, C }) {
  const [h, setH] = useState(false)
  const isWritten = s.sessionType === 'written'
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        textAlign:'left', padding:'clamp(12px,3vw,16px) clamp(14px,3vw,18px)',
        background: h ? C.surfAlt : C.surf, border:`1px solid ${h ? C.border : C.soft}`,
        borderRadius:10, transition:'all 0.15s', width:'100%', minHeight:64,
        display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12,
        transform: h ? 'translateY(-1px)' : 'none',
        boxShadow: h ? `0 4px 16px ${C.shadow}` : 'none',
      }}>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'clamp(13px,3.5vw,14px)', color:C.ink, lineHeight:1.55, marginBottom:5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {s.topicText}
        </p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:12, color:C.faint }}>{s.topicCat}</span>
          {isWritten && <span style={{ fontSize:11, color:C.terra, fontWeight:500 }}>✍ written</span>}
          {s.transcript && !isWritten && <span style={{ fontSize:12, color:C.faint }}>{wc(s.transcript)} words</span>}
          {s.audioURL && <span style={{ fontSize:12, color:C.sage, fontWeight:500 }}>● audio</span>}
        </div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        {!isWritten && <p style={{ fontFamily:F.display, fontSize:'clamp(18px,5vw,22px)', color:C.muted, lineHeight:1 }}>{fmt(s.duration)}</p>}
        {isWritten && <p style={{ fontSize:12, color:C.terra }}>✍</p>}
        <p style={{ fontSize:11, color:C.faint, marginTop:4 }}>{fdate(s.createdAt)}</p>
      </div>
    </button>
  )
}

function Detail({ s, onBack, C }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (!s.transcript) return
    navigator.clipboard.writeText(s.transcript).then(() => { setCopied(true); setTimeout(()=>setCopied(false),1800) })
  }
  const isWritten = s.sessionType === 'written'

  return (
    <div style={{ maxWidth:640, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', animation:'rise 0.3s ease' }}>
      <button onClick={onBack} style={{ fontSize:13, color:C.faint, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3, marginBottom:28, display:'block', minHeight:44 }}>← back</button>

      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
        <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500, background:C.soft, color:C.muted }}>{s.topicCat}</span>
        {isWritten && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500, background:C.terraLt, color:C.terra }}>written</span>}
        <span style={{ fontSize:12, color:C.faint }}>{fdate(s.createdAt)}</span>
      </div>

      <div style={{ padding:'clamp(14px,3vw,18px) clamp(16px,4vw,22px)', borderLeft:`3px solid ${C.sage}`, background:C.surf, borderRadius:'0 10px 10px 0', marginBottom:16, boxShadow:`0 2px 12px ${C.shadow}` }}>
        <p style={{ fontSize:'clamp(14px,3.5vw,16px)', lineHeight:1.7, color:C.ink }}>{s.topicText}</p>
      </div>

      {!isWritten && <p style={{ fontSize:13, color:C.faint, marginBottom:20 }}>{fmt(s.duration)} · {wc(s.transcript)} words</p>}

      {s.audioURL && (
        <div style={{ marginBottom:24 }}>
          <p style={{ fontSize:11, color:C.faint, marginBottom:8, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.4px' }}>recording</p>
          <audio controls src={s.audioURL} />
        </div>
      )}

      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <p style={{ fontSize:11, color:C.faint, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.4px' }}>
            {isWritten ? 'what you wrote' : 'transcript'}
          </p>
          {s.transcript && (
            <button onClick={copy} style={{ fontSize:12, color:copied?C.sage:C.faint, transition:'color 0.2s', minHeight:36, padding:'0 4px' }}>
              {copied ? '✓ copied' : 'copy'}
            </button>
          )}
        </div>
        <div style={{ padding:'clamp(14px,3vw,18px) clamp(16px,4vw,20px)', background:C.surf, border:`1px solid ${C.border}`, borderRadius:10, lineHeight:2.1, fontSize:'clamp(13px,3.5vw,15px)', color:s.transcript?C.ink:C.faint, fontStyle:s.transcript?'normal':'italic' }}>
          {s.transcript || 'no content saved'}
        </div>
      </div>
    </div>
  )
}
