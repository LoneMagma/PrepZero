import { useState } from 'react'
import { useC, F } from '../tokens.jsx'

function fmtP(s) { return s >= 60 ? `${s/60}m` : `${s}s` }

function TimerRow({ C, label, value, onChange, presets, min, max }) {
  const [custom, setCustom] = useState('')
  const [err,    setErr]    = useState('')

  const apply = () => {
    const n = parseInt(custom, 10)
    if (isNaN(n) || n < min || n > max) { setErr(`${min}–${max}`); return }
    setErr(''); onChange(n); setCustom('')
  }

  return (
    <div style={{ marginBottom:22 }}>
      <p style={{ fontSize:13, color:C.muted, marginBottom:10, fontWeight:500 }}>{label}</p>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
        {presets.map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            padding:'7px 13px', borderRadius:20, fontSize:13, minHeight:36,
            border:`1.5px solid ${value===p ? C.sage : C.border}`,
            background: value===p ? C.sage : 'transparent',
            color: value===p ? '#fff' : C.muted,
            transition:'all 0.13s',
            transform: value===p ? 'translateY(-1px)' : 'none',
            boxShadow: value===p ? '0 2px 8px rgba(107,143,114,0.25)' : 'none',
          }}>{fmtP(p)}</button>
        ))}
        <div style={{ display:'flex', gap:5 }}>
          <input value={custom} onChange={e => { setCustom(e.target.value); setErr('') }}
            onKeyDown={e => e.key==='Enter' && apply()}
            placeholder="custom"
            style={{
              width:70, padding:'7px 10px', minHeight:36,
              border:`1.5px solid ${err ? C.terra : C.border}`,
              borderRadius:20, background:C.surfAlt,
              fontSize:13, color:C.ink, transition:'border-color 0.15s',
            }}
          />
          <button onClick={apply} style={{
            padding:'7px 12px', borderRadius:20, minHeight:36,
            border:`1.5px solid ${C.border}`,
            fontSize:12, color:C.muted, background:'transparent', transition:'all 0.13s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.soft}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >set</button>
        </div>
      </div>
      {err && <p style={{ fontSize:11, color:C.terra, marginTop:5 }}>enter a value between {err}</p>}
    </div>
  )
}

export default function SettingsPanel({ settings, onSave, onClose, dark, onToggleDark }) {
  const C = useC()
  const [local, setLocal] = useState({ ...settings })
  const set = (k, v) => setLocal(p => ({ ...p, [k]:v }))

  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.36)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:900, animation:'fadein 0.2s ease' }}
      onClick={e => { if (e.target===e.currentTarget) onClose() }}
    >
      <div style={{
        width:'100%', maxWidth:480, background:C.surf,
        borderRadius:'16px 16px 0 0', border:`1px solid ${C.border}`, borderBottom:'none',
        padding:'24px clamp(18px,4vw,26px) clamp(36px,6vw,52px)',
        animation:'slideup 0.28s ease', maxHeight:'80vh', overflowY:'auto',
        boxShadow:`0 -8px 48px ${C.shadowMd}`,
      }}>
        <div style={{ width:36, height:4, background:C.soft, borderRadius:2, margin:'0 auto 20px' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h2 style={{ fontFamily:F.display, fontSize:'clamp(26px,7vw,30px)', fontWeight:700, color:C.ink, letterSpacing:'-0.5px' }}>
            Settings
          </h2>
          <button onClick={onClose}
            style={{ color:C.faint, fontSize:22, minWidth:44, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color=C.ink}
            onMouseLeave={e => e.currentTarget.style.color=C.faint}
          >✕</button>
        </div>

        {/* Dark mode toggle */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, padding:'14px 16px', background:C.surfAlt, borderRadius:10, border:`1px solid ${C.border}` }}>
          <div>
            <p style={{ fontSize:14, color:C.ink, fontWeight:500 }}>Dark mode</p>
            <p style={{ fontSize:12, color:C.faint, marginTop:2 }}>Easier on the eyes at night</p>
          </div>
          <button onClick={onToggleDark} style={{
            width:46, height:26, borderRadius:13, border:'none',
            background: dark ? C.sage : C.soft,
            position:'relative', transition:'background 0.25s ease', flexShrink:0,
          }}>
            <span style={{
              position:'absolute', top:3, left: dark ? 23 : 3,
              width:20, height:20, borderRadius:'50%',
              background:'#fff', transition:'left 0.22s ease',
              boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        <p style={{ fontSize:11, color:C.faint, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:16 }}>timers</p>

        <TimerRow C={C} label="read time (seconds)"    value={local.readTime}  onChange={v=>set('readTime',v)}  presets={[15,30,45,60]}       min={5}  max={120} />
        <TimerRow C={C} label="think time (seconds)"   value={local.thinkTime} onChange={v=>set('thinkTime',v)} presets={[5,7,10,15]}          min={3}  max={60} />
        <TimerRow C={C} label="speaking time (seconds)" value={local.speakTime} onChange={v=>set('speakTime',v)} presets={[60,90,120,180,300]}  min={30} max={600} />

        <button onClick={() => onSave(local)} style={{
          marginTop:16, width:'100%', padding:'13px', minHeight:48,
          background:C.sage, color:'#fff', borderRadius:10,
          fontSize:16, fontFamily:F.body, fontWeight:600, border:'none',
          transition:'background 0.15s', boxShadow:'0 2px 10px rgba(107,143,114,0.25)',
        }}
          onMouseEnter={e => e.currentTarget.style.background=C.sageDk}
          onMouseLeave={e => e.currentTarget.style.background=C.sage}
        >save</button>
      </div>
    </div>
  )
}
