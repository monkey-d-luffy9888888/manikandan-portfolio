import { portfolioData } from '@/data/portfolio'
import { motion } from 'framer-motion'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { TiltCard } from '@/components/ui/TiltCard'

export const WorkExperience = () => {
  const { experiences } = portfolioData

  return (
    <section id="experience" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <ScrollReveal direction="left">
          <h2 className="section-heading">Experiences</h2>
          <p className="section-subheading">AI SYSTEMS I HAVE BUILT FOR REAL CLIENTS</p>
        </ScrollReveal>

        <StaggerContainer
          className="grid-3col"
          stagger={0.09}
        >
          {experiences.map((exp, i) => (
            <StaggerItem key={i} direction="slideUp">
              <TiltCard style={{ height: '100%' }}>
                <motion.div
                  className="exp-card"
                  whileHover={{
                    y: -10,
                    boxShadow: '0 24px 60px rgba(37,99,235,0.18), 0 0 0 1px rgba(37,99,235,0.12)',
                    transition: { duration: 0.25 },
                  }}
                  style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
                >
                  {/* Image banner */}
                  <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px 12px 0 0', background: '#0d0f1a', flexShrink: 0, position: 'relative' }}>
                    {(exp as any).image ? (
                      <>
                        <img
                          src={(exp as any).image}
                          alt={exp.company}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        {/* Subtle overlay gradient */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2))',
                          pointerEvents: 'none',
                        }} />
                      </>
                    ) : (
                      <div style={{ height: '160px', background: exp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                        {exp.icon}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1rem', marginBottom: '10px' }}>
                      {exp.role}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '12px', flex: 1 }}>
                      {exp.desc}
                    </p>
                    <ul style={{ paddingLeft: '1.1rem', marginBottom: '14px' }}>
                      {exp.descBullets.map((b, j) => (
                        <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '3px' }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {exp.tech.map((t) => (
                        <span key={t} style={{
                          padding: '3px 10px',
                          background: 'rgba(37,99,235,0.1)',
                          color: 'var(--primary)',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: '1px solid rgba(37,99,235,0.2)',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
