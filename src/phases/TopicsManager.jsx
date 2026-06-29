import { useState } from 'react'
import { useC, F, Btn } from '../tokens.jsx'

const CATS = ['Custom','Current Affairs','Abstract','Debate','Personal']

export default function TopicsManager({ customTopics, onSave, onBack }) {
  const C = useC()
  const [list,  setList]  = useState([...customTopics])
  const [input, setInput] = useState('')
  const [bulk,  setBulk]  = useState('')
  const [cat,   setCat]   = useState('Custom')
  const [mode,  setMode]  = useState('single')

  const update = next => { setList(next); onSave(next) }

  const addSingle = () => {
    const text = input.trim()
    if (!text) return
    update([...list, { id:'u'+Date.now(), text, cat }])
    setInput('')
  }

  const addBulk = () => {
    const lines = bulk.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    const next = lines.map(text => ({ id:'u'+Date.now()+Math.random(), text, cat }))
    update([...list, ...next])
    setBulk('')
  }

  const remove = id => update(list.filter(t => t.id !== id))

  const bulkLineCount = bulk.split('\n').filter(l => l.trim()).length

  return (
    <div style={{ maxWidth:560, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', minHeight:'100vh' }}>

      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:28, gap:12 }}>
        <div>
          <h2 style={{ fontFamily:F.display, fontSize:'clamp(32px,8vw,44px)', fontWeight:700, color:C.ink, letterSpacing:'-1px' }}>
            My Topics
          </h2>
          <p style={{ fontSize:13, color:C.faint, marginTop:4 }}>
            add topics to the pool — or queue them all at once
          </p>
        </div>
        <button onClick={onBack} style={{ fontSize:13, color:C.faint, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3, flexShrink:0, minHeight:44 }}>
          ← back
        </button>
      </div>

      {/* Add section */}
      <div style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:12, padding:'clamp(16px,4vw,22px)', marginBottom:28 }}>

        {/* Mode toggle */}
        <div style={{ display:'flex', gap:2, marginBottom:18, background:C.soft, borderRadius:8, padding:3 }}>
          {[['single','add one'],['bulk','paste many']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1, padding:'7px', borderRadius:7, fontSize:13, fontWeight:500, minHeight:36,
              background: mode===m ? C.surf : 'transparent',
              color: mode===m ? C.ink : C.muted, border:'none', transition:'all 0.13s',
              boxShadow: mode===m ? `0 1px 4px ${C.shadow}` : 'none',
            }}>{label}</button>
          ))}
        </div>

        {/* Category picker */}
        <div style={{ marginBottom:14 }}>
          <p style={{ fontSize:11, color:C.faint, marginBottom:8, fontWeight:500 }}>category</p>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding:'5px 12px', borderRadius:20, fontSize:12, minHeight:32,
                border:`1.5px solid ${cat===c ? C.sage : C.border}`,
                background: cat===c ? C.sage : 'transparent',
                color: cat===c ? '#fff' : C.muted, transition:'all 0.12s',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {mode === 'single' ? (
          <div style={{ display:'flex', gap:8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && addSingle()}
              placeholder="type a topic and press enter..."
              autoFocus
              style={{
                flex:1, padding:'10px 14px', minHeight:44,
                border:`1.5px solid ${C.border}`, borderRadius:8,
                background:C.surfAlt, fontSize:14, color:C.ink,
                transition:'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor=C.sage}
              onBlur={e => e.target.style.borderColor=C.border}
            />
            <button onClick={addSingle} style={{
              width:44, height:44, borderRadius:8, background:C.sage, color:'#fff',
              border:'none', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, transition:'background 0.13s',
            }}
              onMouseEnter={e => e.currentTarget.style.background=C.sageDk}
              onMouseLeave={e => e.currentTarget.style.background=C.sage}
            >+</button>
          </div>
        ) : (
          <div>
            <textarea value={bulk} onChange={e => setBulk(e.target.value)}
              placeholder={'one topic per line:\n\nIs social media toxic?\nWhat is courage?\nShould voting be mandatory?'}
              rows={5}
              style={{
                width:'100%', padding:'10px 14px',
                border:`1.5px solid ${C.border}`, borderRadius:8,
                background:C.surfAlt, fontSize:13, color:C.ink,
                resize:'vertical', lineHeight:1.7, transition:'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor=C.sage}
              onBlur={e => e.target.style.borderColor=C.border}
            />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
              <span style={{ fontSize:12, color:C.faint }}>
                {bulkLineCount > 0 ? `${bulkLineCount} topic${bulkLineCount!==1?'s':''} ready` : 'one topic per line'}
              </span>
              <button onClick={addBulk} disabled={bulkLineCount===0} style={{
                padding:'8px 18px', background: bulkLineCount>0 ? C.sage : C.soft,
                color: bulkLineCount>0 ? '#fff' : C.faint,
                borderRadius:8, fontSize:13, border:'none', fontWeight:500,
                minHeight:38, transition:'all 0.13s',
                cursor: bulkLineCount>0 ? 'pointer' : 'not-allowed',
              }}
                onMouseEnter={e => { if (bulkLineCount>0) e.currentTarget.style.background=C.sageDk }}
                onMouseLeave={e => { e.currentTarget.style.background = bulkLineCount>0 ? C.sage : C.soft }}
              >
                import {bulkLineCount > 0 ? bulkLineCount : ''} topic{bulkLineCount!==1?'s':''}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing topics */}
      {list.length > 0 ? (
        <div>
          <p style={{ fontSize:12, color:C.faint, marginBottom:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {list.length} saved topic{list.length!==1?'s':''}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {list.map((t, i) => (
              <div key={t.id} style={{ animation:`rise 0.25s ${i*0.03}s ease both`, display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px', background:C.surf, border:`1px solid ${C.border}`, borderRadius:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, color:C.ink, lineHeight:1.5 }}>{t.text}</p>
                  <p style={{ fontSize:11, color:C.faint, marginTop:3 }}>{t.cat}</p>
                </div>
                <button onClick={() => remove(t.id)} style={{
                  color:C.faint, fontSize:18, minWidth:32, minHeight:32, display:'flex',
                  alignItems:'center', justifyContent:'center', flexShrink:0, transition:'color 0.13s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color=C.terra}
                  onMouseLeave={e => e.currentTarget.style.color=C.faint}
                >×</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ fontSize:14, color:C.faint, fontStyle:'italic' }}>no topics yet — add some above</p>
      )}
    </div>
  )
}
