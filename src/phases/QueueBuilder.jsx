import { useState } from 'react'
import { TOPICS, CATS } from '../topics.js'
import { useC, F } from '../tokens.jsx'

export default function QueueBuilder({ customTopics, onStart, onBack }) {
  const C = useC()
  const [selected, setSelected] = useState(new Set())
  const [filter,   setFilter]   = useState('All')

  const allTopics = [
    ...TOPICS,
    ...customTopics.map(t => ({ ...t, isCustom:true })),
  ]
  const cats = ['All', ...CATS.filter(c => c!=='All'), ...(customTopics.length ? ['Custom'] : [])]
  const filtered = filter==='All' ? allTopics : allTopics.filter(t => t.cat===filter)
  const count = selected.size

  const toggle = id => setSelected(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  const toggleAll = () => {
    const allOn = filtered.every(t => selected.has(t.id))
    setSelected(prev => {
      const n = new Set(prev)
      filtered.forEach(t => allOn ? n.delete(t.id) : n.add(t.id))
      return n
    })
  }

  const handleStart = () => {
    const queue = allTopics.filter(t => selected.has(t.id))
    if (!queue.length) return
    onStart(queue, 'Custom Queue')
  }

  const allOn = filtered.length > 0 && filtered.every(t => selected.has(t.id))

  return (
    <div style={{ maxWidth:580, margin:'0 auto', padding:'clamp(40px,8vh,64px) clamp(20px,5vw,32px) 110px', minHeight:'100vh' }}>

      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:24, gap:12 }}>
        <div>
          <h2 style={{ fontFamily:F.display, fontSize:'clamp(32px,8vw,44px)', fontWeight:700, color:C.ink, letterSpacing:'-1px' }}>Build a queue</h2>
          <p style={{ fontSize:13, color:C.faint, marginTop:4 }}>pick topics, practice them in order</p>
        </div>
        <button onClick={onBack} style={{ fontSize:13, color:C.faint, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:3, flexShrink:0, minHeight:44 }}>
          ← back
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding:'5px 13px', borderRadius:20, minHeight:34, fontSize:12,
            border:`1.5px solid ${filter===c ? C.sage : C.border}`,
            background: filter===c ? C.sage : 'transparent',
            color: filter===c ? '#fff' : C.muted, transition:'all 0.13s',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <button onClick={toggleAll} style={{ fontSize:12, color:C.faint, textDecoration:'underline', textDecorationStyle:'dotted', textUnderlineOffset:2, minHeight:36 }}>
          {allOn ? 'deselect all' : 'select all'}
        </button>
        {count > 0 && <span style={{ fontSize:12, color:C.sage, fontWeight:500 }}>{count} selected</span>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:3, marginBottom:28 }}>
        {filtered.map((t, i) => {
          const on = selected.has(t.id)
          return (
            <button key={t.id} onClick={() => toggle(t.id)}
              style={{
                textAlign:'left', padding:'12px 14px', borderRadius:8, minHeight:52,
                border:`1.5px solid ${on ? C.sage : C.soft}`,
                background: on ? C.sageLt : C.surf,
                transition:'all 0.13s', display:'flex', alignItems:'flex-start', gap:12,
                animation:`rise 0.25s ${i*0.025}s ease both`,
              }}>
              <div style={{
                width:18, height:18, borderRadius:4, flexShrink:0, marginTop:2,
                border:`2px solid ${on ? C.sage : C.border}`,
                background: on ? C.sage : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.13s',
              }}>
                {on && <span style={{ color:'#fff', fontSize:11, lineHeight:1 }}>✓</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:14, color: on ? C.sageDk : C.ink, lineHeight:1.5, fontWeight: on ? 500 : 400 }}>{t.text}</p>
                <p style={{ fontSize:11, color:C.faint, marginTop:3 }}>{t.cat}{t.isCustom ? ' · yours' : ''}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Fixed start pill */}
      <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:10, animation:'navrise 0.3s ease' }}>
        <button onClick={handleStart} disabled={count===0} style={{
          padding:'12px clamp(24px,5vw,36px)', borderRadius:50, fontSize:15,
          background: count>0 ? C.sage : C.soft,
          color: count>0 ? '#fff' : C.faint,
          border:'none', fontWeight:600, fontFamily:F.body,
          boxShadow: count>0 ? '0 4px 20px rgba(107,143,114,0.3)' : 'none',
          transition:'all 0.2s', minHeight:50, whiteSpace:'nowrap',
          cursor: count>0 ? 'pointer' : 'not-allowed',
        }}
          onMouseEnter={e => { if (count>0) { e.currentTarget.style.background=C.sageDk; e.currentTarget.style.transform='translateY(-2px)' } }}
          onMouseLeave={e => { e.currentTarget.style.background = count>0 ? C.sage : C.soft; e.currentTarget.style.transform='none' }}
        >
          {count===0 ? 'select topics to start' : `start queue · ${count} topic${count!==1?'s':''}`}
        </button>
      </div>
    </div>
  )
}
