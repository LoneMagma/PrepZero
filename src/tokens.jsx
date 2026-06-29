import { useState, useContext } from 'react'
import ThemeCtx from './theme.jsx'

export const F = {
  display: "'Caveat', cursive",
  body:    "'Inter', system-ui, sans-serif",
}

export const fmt   = s  => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`
export const wc    = t  => t?.trim().split(/\s+/).filter(Boolean).length || 0
export const fdate = ts => {
  if (!ts) return ''
  try {
    const d = new Date(typeof ts === 'number' ? ts : ts)
    return d.toLocaleDateString('en-IN', { day:'numeric', month:'short' })
         + ' · '
         + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true })
  } catch { return '' }
}

// Hook to get current theme colors
export function useC() {
  return useContext(ThemeCtx).C
}

// ── Btn ──────────────────────────────────────────────────────
export function Btn({ children, onClick, variant='primary', style={}, disabled=false }) {
  const C = useC()
  const [h, setH] = useState(false)
  const [p, setP] = useState(false)

  const base = {
    padding: 'clamp(9px,2vw,11px) clamp(16px,4vw,24px)',
    fontSize: 'clamp(13px,3.5vw,15px)',
    fontFamily: F.body, fontWeight: 500, borderRadius: 8,
    transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6,
    minHeight: 44,
    transform: disabled ? 'none' : p ? 'scale(0.97)' : h ? 'translateY(-1px)' : 'none',
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
  const vs = {
    primary: {
      background: h && !disabled ? C.sageDk : C.sage, color: '#fff', border: 'none',
      boxShadow: h && !disabled ? `0 4px 14px rgba(107,143,114,0.35)` : `0 2px 8px rgba(107,143,114,0.2)`,
    },
    ghost: {
      background: h && !disabled ? C.soft : 'transparent',
      color: h && !disabled ? C.ink : C.muted,
      border: `1.5px solid ${C.border}`,
      boxShadow: 'none',
    },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false) }}
      onMouseDown={() => setP(true)}  onMouseUp={() => setP(false)}
      style={{ ...base, ...vs[variant], ...style }}
    >{children}</button>
  )
}

// ── NavPill ──────────────────────────────────────────────────
export function NavPill({ onHistory, onSettings, onInfo, showHistory }) {
  const C = useC()
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 0,
      background: C.navBg,
      border: `1px solid ${C.border}`,
      borderRadius: 50, padding: '6px 8px',
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      boxShadow: `0 4px 28px ${C.shadow}, 0 1px 4px ${C.shadow}`,
      zIndex: 999, animation: 'navrise 0.38s ease both', whiteSpace: 'nowrap',
    }}>
      {showHistory && <>
        <NavBtn C={C} onClick={onHistory} icon="◷" label="history" />
        <div style={{ width:1, height:24, background:C.soft, margin:'0 2px' }} />
      </>}
      <NavBtn C={C} onClick={onSettings} icon="⚙" label="settings" />
      <div style={{ width:1, height:24, background:C.soft, margin:'0 2px' }} />
      <NavBtn C={C} onClick={onInfo} icon="ⓘ" label="about" />
    </div>
  )
}

function NavBtn({ C, onClick, icon, label }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        padding: '6px 16px', borderRadius: 46, minHeight: 44, minWidth: 60,
        justifyContent: 'center',
        background: h ? C.soft : 'transparent',
        transition: 'all 0.15s', color: h ? C.ink : C.muted,
      }}>
      <span style={{ fontSize:15, lineHeight:1, transition:'transform 0.15s', transform: h ? 'scale(1.18)' : 'scale(1)' }}>{icon}</span>
      <span style={{ fontSize:10, fontWeight:500, letterSpacing:'0.3px' }}>{label}</span>
    </button>
  )
}

// ── QueueProgress ────────────────────────────────────────────
export function QueueProgress({ current, total }) {
  const C = useC()
  if (!total || total <= 1) return null
  const pct = (current / total) * 100
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, animation:'drop 0.3s ease' }}>
      <div style={{ flex:1, height:3, background:C.soft, borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:C.sage, borderRadius:2, transition:'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize:12, color:C.faint, fontWeight:500, flexShrink:0 }}>{current} / {total}</span>
    </div>
  )
}

// ── PillTag ──────────────────────────────────────────────────
export function PillTag({ children, color='muted' }) {
  const C = useC()
  const cols = {
    muted: { bg: C.soft,    fg: C.muted },
    sage:  { bg: C.sageLt,  fg: C.sageDk },
    write: { bg: C.terraLt, fg: C.terra },
  }
  const { bg, fg } = cols[color] || cols.muted
  return (
    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500, background:bg, color:fg, whiteSpace:'nowrap' }}>
      {children}
    </span>
  )
}
