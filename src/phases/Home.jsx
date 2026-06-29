import { useState } from 'react'
import { TOPICS, CATS } from '../topics.js'
import { useC, F, Btn } from '../tokens.jsx'

export default function Home({ cat, setCat, sessionCount, onStart, onQueue, customTopics, onManageTopics }) {
  const C = useC()
  const [customText, setCustomText] = useState('')
  const [showInput,  setShowInput]  = useState(false)

  const pick = () => {
    if (showInput && customText.trim())
      return { id:'c'+Date.now(), text:customText.trim(), cat:'Custom' }
    const pool = [
      ...(cat==='All' ? TOPICS : TOPICS.filter(t => t.cat===cat)),
      ...customTopics.filter(t => cat==='All' || t.cat===cat),
    ]
    return pool[Math.floor(Math.random()*pool.length)]
  }

  const hasCustom = customTopics.length > 0

  return (
    <div style={{
      maxWidth:520, margin:'0 auto',
      padding:'0 clamp(20px,5vw,32px) 110px',
      minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center',
    }}>

      {/* Wordmark */}
      <div style={{ marginBottom:'clamp(36px,6vh,56px)', animation:'rise 0.4s ease both' }}>
        <h1 style={{ fontFamily:F.display, fontSize:'clamp(52px,13vw,72px)', fontWeight:700, letterSpacing:'-2px', lineHeight:1, color:C.ink }}>
          PrepZero
        </h1>
        <p style={{ color:C.muted, fontSize:'clamp(14px,3.5vw,16px)', marginTop:10 }}>
          Think on your feet. Say what you mean.
        </p>
        {sessionCount > 0 && (
          <p style={{ color:C.faint, fontSize:13, marginTop:5 }}>
            {sessionCount} session{sessionCount!==1?'s':''} logged
          </p>
        )}
      </div>

      {/* Category chips */}
      <div style={{ marginBottom:22, animation:'rise 0.4s 0.07s ease both' }}>
        <p style={{ fontSize:11, color:C.faint, marginBottom:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px' }}>topic type</p>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {CATS.map(c => {
            const active = cat===c
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:'7px 14px', borderRadius:20, minHeight:36,
                border:`1.5px solid ${active ? C.sage : C.border}`,
                background: active ? C.sage : 'transparent',
                color: active ? '#fff' : C.muted,
                fontSize:13, fontWeight: active ? 500 : 400,
                transition:'all 0.15s',
                transform: active ? 'translateY(-1px)' : 'none',
                boxShadow: active ? '0 3px 10px rgba(107,143,114,0.25)' : 'none',
              }}>{c}</button>
            )
          })}
        </div>
      </div>

      {/* Quick topic input */}
      <div style={{ marginBottom:36, animation:'rise 0.4s 0.14s ease both' }}>
        {!showInput ? (
          <button onClick={() => setShowInput(true)} style={{
            display:'flex', alignItems:'center', gap:6,
            fontSize:13, color:C.faint, minHeight:36,
            textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3,
          }}>
            <span style={{ fontSize:16, fontWeight:300, lineHeight:1 }}>+</span> speak on your own topic
          </button>
        ) : (
          <div style={{ animation:'pop 0.2s ease' }}>
            <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
              <textarea value={customText} onChange={e => setCustomText(e.target.value)}
                placeholder="what do you want to speak on?" rows={2} autoFocus
                style={{
                  flex:1, padding:'11px 14px',
                  border:`1.5px solid ${C.sage}`,
                  borderRadius:8, background:C.surf,
                  fontSize:14, color:C.ink, resize:'none', lineHeight:1.6,
                  boxShadow:'0 0 0 3px rgba(107,143,114,0.12)',
                }}
              />
              <button onClick={() => { setShowInput(false); setCustomText('') }}
                style={{ color:C.faint, fontSize:20, minWidth:36, minHeight:36, display:'flex', alignItems:'center', justifyContent:'center', marginTop:4, transition:'color 0.13s' }}
                onMouseEnter={e => e.currentTarget.style.color=C.ink}
                onMouseLeave={e => e.currentTarget.style.color=C.faint}
              >×</button>
            </div>
            <p style={{ fontSize:12, color:C.faint, marginTop:6 }}>
              hit begin — we'll skip the topic bank and use this
            </p>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, animation:'rise 0.4s 0.2s ease both' }}>

        {/* Begin */}
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <button onClick={() => onStart(pick())} style={{
            padding:'clamp(11px,2.5vw,13px) clamp(24px,5vw,32px)',
            background:C.sage, color:'#fff', borderRadius:10,
            fontSize:'clamp(15px,4vw,18px)', fontFamily:F.body, fontWeight:600,
            border:'none', minHeight:48,
            boxShadow:'0 3px 14px rgba(107,143,114,0.3)',
            transition:'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background=C.sageDk; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(107,143,114,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background=C.sage; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 3px 14px rgba(107,143,114,0.3)' }}
            onMouseDown={e => e.currentTarget.style.transform='scale(0.97)'}
          >
            begin
          </button>
          <span style={{ fontSize:13, color:C.faint }}>
            {showInput && customText.trim() ? 'your topic' : cat==='All' ? 'random topic' : cat.toLowerCase()}
          </span>
        </div>

        {/* Your topics section */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, paddingTop:4 }}>

          {/* My topics queue */}
          {hasCustom && (
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => onQueue(customTopics, 'My Topics')} style={{
                padding:'clamp(9px,2vw,11px) clamp(16px,4vw,22px)',
                background:'transparent', color:C.muted,
                border:`1.5px solid ${C.border}`, borderRadius:10,
                fontSize:'clamp(13px,3.5vw,14px)', fontFamily:F.body, fontWeight:500,
                minHeight:44, transition:'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background=C.soft; e.currentTarget.style.borderColor=C.muted; e.currentTarget.style.color=C.ink }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted }}
              >
                practice my topics →
              </button>
              <span style={{ fontSize:13, color:C.faint }}>
                {customTopics.length} topic{customTopics.length!==1?'s':''}, shuffled
              </span>
            </div>
          )}

          {/* Bottom row: manage topics + build queue */}
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <button onClick={onManageTopics} style={{
              display:'flex', alignItems:'center', gap:5,
              fontSize:13, color:C.faint, minHeight:36,
              textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3,
              transition:'color 0.13s',
            }}
              onMouseEnter={e => e.currentTarget.style.color=C.muted}
              onMouseLeave={e => e.currentTarget.style.color=C.faint}
            >
              <span style={{ fontSize:16, fontWeight:300, lineHeight:1 }}>+</span>
              {hasCustom ? 'manage my topics' : 'add your own topics'}
            </button>

            {hasCustom && (
              <>
                <span style={{ color:C.soft, fontSize:14 }}>·</span>
                <button onClick={() => onQueue(null, 'build')} style={{
                  fontSize:13, color:C.faint, minHeight:36,
                  textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3,
                  transition:'color 0.13s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color=C.muted}
                  onMouseLeave={e => e.currentTarget.style.color=C.faint}
                >
                  build a queue
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
