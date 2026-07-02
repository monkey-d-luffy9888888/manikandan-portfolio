import { portfolioData } from '@/data/portfolio'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// ── Syntax-highlighted code lines ──────────────────────────────────
type Token = { t: string; c: string }

const CODE: { tokens: Token[] }[] = [
  { tokens: [{ t: '# AI Extraction Pipeline', c: '#4b5563' }] },
  { tokens: [{ t: 'from ', c: '#c084fc' }, { t: 'fastapi ', c: '#e2e8f0' }, { t: 'import ', c: '#c084fc' }, { t: 'FastAPI', c: '#38bdf8' }] },
  { tokens: [{ t: 'from ', c: '#c084fc' }, { t: 'ai_model ', c: '#e2e8f0' }, { t: 'import ', c: '#c084fc' }, { t: 'Gemma, OCR', c: '#38bdf8' }] },
  { tokens: [] },
  { tokens: [{ t: 'app ', c: '#e2e8f0' }, { t: '= ', c: '#94a3b8' }, { t: 'FastAPI()', c: '#fbbf24' }] },
  { tokens: [{ t: 'model ', c: '#e2e8f0' }, { t: '= ', c: '#94a3b8' }, { t: 'Gemma', c: '#38bdf8' }, { t: '.load(', c: '#e2e8f0' }, { t: '"gemma-2b"', c: '#4ade80' }, { t: ')', c: '#e2e8f0' }] },
  { tokens: [] },
  { tokens: [{ t: '@', c: '#f97316' }, { t: 'app', c: '#60a5fa' }, { t: '.post(', c: '#e2e8f0' }, { t: '"/extract"', c: '#4ade80' }, { t: ')', c: '#e2e8f0' }] },
  { tokens: [{ t: 'async ', c: '#c084fc' }, { t: 'def ', c: '#c084fc' }, { t: 'extract', c: '#fbbf24' }, { t: '(doc: bytes):', c: '#e2e8f0' }] },
  { tokens: [{ t: '    result ', c: '#e2e8f0' }, { t: '= ', c: '#94a3b8' }, { t: 'model', c: '#38bdf8' }, { t: '.analyze(doc)', c: '#e2e8f0' }] },
  { tokens: [{ t: '    ', c: '' }, { t: 'return ', c: '#c084fc' }, { t: '{', c: '#e2e8f0' }, { t: '"data"', c: '#4ade80' }, { t: ': result, ', c: '#e2e8f0' }, { t: '"acc"', c: '#4ade80' }, { t: ': ', c: '#e2e8f0' }, { t: '0.992', c: '#fb923c' }, { t: '}', c: '#e2e8f0' }] },
  { tokens: [] },
  { tokens: [{ t: '$ ', c: '#4ade80' }, { t: 'python ', c: '#94a3b8' }, { t: 'pipeline.py', c: '#60a5fa' }] },
  { tokens: [{ t: '✓ ', c: '#4ade80' }, { t: 'Processing ', c: '#6b7280' }, { t: '10,247', c: '#fbbf24' }, { t: ' products...', c: '#6b7280' }] },
  { tokens: [{ t: '✓ ', c: '#4ade80' }, { t: 'Accuracy: ', c: '#6b7280' }, { t: '99.2%', c: '#4ade80' }, { t: '  Speed: ', c: '#6b7280' }, { t: '1.8s avg', c: '#4ade80' }] },
]

const METRICS = [
  { label: 'Accuracy',   value: '99.2%', icon: '🎯', color: '#4ade80', top: '-18px',  right: '-16px', bottom: 'auto', left: 'auto', delay: 0.6 },
  { label: 'Avg Speed',  value: '1.8s',  icon: '⚡', color: '#fbbf24', bottom: '55px', right: '-18px', top: 'auto',    left: 'auto', delay: 0.8 },
  { label: 'Daily Docs', value: '10K+',  icon: '📊', color: '#60a5fa', bottom: '-18px', left: '24px', top: 'auto',    right: 'auto', delay: 1.0 },
]

// ── Animated lines (restart every cycle) ───────────────────────────
const CodeLines = ({ cycle }: { cycle: number }) => (
  <motion.div
    key={cycle}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.25 }}
  >
    {CODE.map((line, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.16, duration: 0.18, ease: 'easeOut' }}
        style={{ minHeight: '22px', display: 'flex', alignItems: 'center' }}
      >
        {line.tokens.length === 0
          ? <span>&nbsp;</span>
          : line.tokens.map((tok, j) => (
              <span key={j} style={{ color: tok.c, fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '0.76rem', lineHeight: '22px' }}>{tok.t}</span>
            ))}
      </motion.div>
    ))}
  </motion.div>
)

// ── Terminal window ─────────────────────────────────────────────────
const CodeTerminal = () => {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const delay = CODE.length * 160 + 2800
    const t = setTimeout(() => setCycle(c => c + 1), delay)
    return () => clearTimeout(t)
  }, [cycle])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>

      {/* Glow behind terminal */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute', inset: '-20px',
          borderRadius: '20px',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Terminal box */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.93 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
        style={{
          position: 'relative',
          background: '#0d1117',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          zIndex: 1,
        }}
      >
        {/* Title bar */}
        <div style={{
          padding: '11px 16px',
          background: '#161b22',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ color: '#4b5563', fontSize: '0.72rem', fontFamily: 'monospace', marginLeft: '10px' }}>
            ~/manikandan/ai_pipeline.py
          </span>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ color: '#4ade80', fontSize: '0.62rem', fontFamily: 'monospace' }}>running</span>
          </motion.div>
        </div>

        {/* Code area */}
        <div style={{ padding: '18px 20px 14px', position: 'relative', overflow: 'hidden' }}>
          {/* Scan line effect */}
          <motion.div
            animate={{ y: [-10, 380, -10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            style={{
              position: 'absolute', left: 0, right: 0, height: '60px',
              background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.04), rgba(59,130,246,0.07), rgba(59,130,246,0.04), transparent)',
              pointerEvents: 'none', zIndex: 2,
            }}
          />

          {/* Line number + code */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#374151', fontFamily: 'monospace', fontSize: '0.74rem', lineHeight: '22px', userSelect: 'none', minWidth: '18px', textAlign: 'right', flexShrink: 0 }}>
              {CODE.map((_, i) => (
                <div key={i} style={{ minHeight: '22px' }}>{i + 1}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <CodeLines cycle={cycle} />
            </div>
          </div>

          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.75, repeat: Infinity }}
            style={{ display: 'inline-block', width: '7px', height: '16px', background: '#60a5fa', borderRadius: '1px', marginTop: '6px', verticalAlign: 'middle' }}
          />
        </div>

        {/* Bottom status bar */}
        <div style={{
          padding: '6px 16px',
          background: '#1c2433',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', gap: '16px', alignItems: 'center',
        }}>
          {[
            { label: 'Python 3.11', color: '#fbbf24' },
            { label: 'FastAPI', color: '#38bdf8' },
            { label: 'UTF-8', color: '#6b7280' },
            { label: 'LF', color: '#6b7280' },
          ].map(s => (
            <span key={s.label} style={{ color: s.color, fontSize: '0.62rem', fontFamily: 'monospace' }}>{s.label}</span>
          ))}
          <motion.div
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ duration: CODE.length * 0.16 + 1, repeat: Infinity }}
            style={{ marginLeft: 'auto', height: '3px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)', borderRadius: '2px', minWidth: '0', maxWidth: '80px' }}
          />
        </div>
      </motion.div>

      {/* Floating metric cards */}
      {METRICS.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: m.delay, type: 'spring', stiffness: 130 }}
          style={{
            position: 'absolute',
            top: m.top, right: m.right, bottom: m.bottom, left: m.left,
            zIndex: 10,
          }}
        >
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            style={{
              background: 'rgba(10, 14, 26, 0.92)',
              border: `1px solid ${m.color}45`,
              borderRadius: '12px',
              padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: '10px',
              backdropFilter: 'blur(12px)',
              boxShadow: `0 8px 32px ${m.color}22, 0 0 0 1px ${m.color}18`,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
            <div>
              <div style={{ color: m.color, fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ color: '#4b5563', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Section ─────────────────────────────────────────────────────────
export const WhatIDo = () => {
  const { whatIDo } = portfolioData

  return (
    <section id="skills" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="max-md:grid-cols-1">

          {/* Left: animated terminal */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <CodeTerminal />
          </div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
          >
            <h2 className="section-heading">{whatIDo.title}</h2>
            <p className="section-subheading">{whatIDo.subtitle}</p>

            {/* Tech icon grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '2rem' }}>
              {whatIDo.techStack.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className="tech-icon-wrapper"
                  title={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 150 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                >
                  <i className={tech.icon} />
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Bullet points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {whatIDo.bullets.map((b, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}
                >
                  {b}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
