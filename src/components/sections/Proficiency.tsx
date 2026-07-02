import { useRef } from 'react'
import { portfolioData } from '@/data/portfolio'
import { motion, useInView } from 'framer-motion'

// ── Circular ring skill visualization ──────────────────────────────
const SKILL_RINGS = [
  { short: 'AI / ML',     value: 90, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  { short: 'Backend',     value: 82, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  { short: 'Frontend',    value: 72, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  { short: 'Cloud/DevOps',value: 68, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
]

const SZ = 132
const SW = 11
const R  = (SZ - SW * 2) / 2
const C  = 2 * Math.PI * R
const CX = SZ / 2
const CY = SZ / 2

const SkillRing = ({ skill, index }: { skill: typeof SKILL_RINGS[0]; index: number }) => {
  const ref = useRef<SVGCircleElement>(null)
  const inView = useInView(ref as any, { once: true })
  const offset = C * (1 - skill.value / 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.14, type: 'spring', stiffness: 130, damping: 18 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
    >
      <div style={{ position: 'relative', width: SZ, height: SZ }}>
        {/* Glow aura */}
        <motion.div
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 2.8 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: '12px', borderRadius: '50%',
            background: `radial-gradient(circle, ${skill.bg} 0%, transparent 70%)`,
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }}
        />
        <svg width={SZ} height={SZ} style={{ overflow: 'visible' }}>
          {/* Track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth={SW} />
          {/* Fill arc */}
          <motion.circle
            ref={ref}
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke={skill.color}
            strokeWidth={SW}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
            transition={{ duration: 1.7, delay: index * 0.18 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{ filter: `drop-shadow(0 0 7px ${skill.color})` }}
          />
          {/* Pulsing center dot */}
          <motion.circle
            cx={CX} cy={CY} r={5}
            fill={skill.color}
            animate={{ r: [4, 6.5, 4], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.35 }}
            style={{ filter: `drop-shadow(0 0 8px ${skill.color})` }}
          />
        </svg>
      </div>

      {/* Skill label */}
      <span style={{ color: 'var(--text)', fontSize: '0.76rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
        {skill.short}
      </span>

      {/* Mini level bar */}
      <div style={{ width: '56px', height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: index * 0.18 + 0.6 }}
          style={{ height: '100%', background: skill.color, borderRadius: '2px', boxShadow: `0 0 8px ${skill.color}` }}
        />
      </div>
    </motion.div>
  )
}

const SkillVisualization = () => (
  <div style={{ position: 'relative', display: 'inline-block', padding: '16px' }}>
    {/* Decorative cross-hair lines */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}>
      <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 10" />
      <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 10" />
    </svg>

    {/* Slowly rotating outer ring decoration */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <svg width="100%" height="100%" viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="165" stroke="rgba(59,130,246,0.1)" strokeWidth="1.5" fill="none" strokeDasharray="6 18" />
      </svg>
    </motion.div>

    {/* 2×2 grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 20px', position: 'relative', zIndex: 1 }}>
      {SKILL_RINGS.map((skill, i) => (
        <SkillRing key={skill.short} skill={skill} index={i} />
      ))}
    </div>
  </div>
)

// ── Skill bar (no percentage) ───────────────────────────────────────
const Bar = ({ label, value, index }: { label: string; value: number; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, type: 'spring', stiffness: 100, damping: 18 }}
      style={{ marginBottom: '1.6rem' }}
    >
      <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', display: 'block', marginBottom: '8px' }}>
        {label}
      </span>
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.12 + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────────
export const Proficiency = () => {
  const { proficiency } = portfolioData

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="grid-2col">

          {/* Left: bars (no percentage) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 18 }}
          >
            <h2 className="section-heading">Proficiency</h2>
            <p className="section-subheading">SKILL LEVELS IN DIFFERENT DOMAINS</p>
            <div style={{ marginTop: '2rem' }}>
              {proficiency.bars.map((bar, i) => (
                <Bar key={bar.label} label={bar.label} value={bar.value} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Right: ring visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, type: 'spring', stiffness: 80, damping: 18 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <SkillVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
