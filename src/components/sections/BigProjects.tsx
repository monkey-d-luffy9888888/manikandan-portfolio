import { portfolioData } from '@/data/portfolio'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal'
import { TiltCard } from '@/components/ui/TiltCard'

export const BigProjects = () => {
  const { bigProjects } = portfolioData

  return (
    <section id="projects" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <ScrollReveal direction="right">
          <h2 className="section-heading">Projects</h2>
          <p className="section-subheading">END-TO-END AI SYSTEMS BUILT IN PRODUCTION</p>
        </ScrollReveal>

        <StaggerContainer
          className="grid-auto"
          stagger={0.1}
        >
          {bigProjects.map((project, i) => (
            <StaggerItem key={i} direction="flip">
              <TiltCard style={{ height: '100%' }}>
                <motion.div
                  className="dev-card"
                  whileHover={{
                    y: -10,
                    boxShadow: '0 28px 70px rgba(37,99,235,0.22), 0 0 0 1px rgba(37,99,235,0.15)',
                    transition: { duration: 0.25 },
                  }}
                  style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
                >
                  {/* Image banner */}
                  <div style={{ width: '100%', overflow: 'hidden', borderRadius: '12px 12px 0 0', background: '#0d0f1a', flexShrink: 0, position: 'relative' }}>
                    {(project as any).image ? (
                      <>
                        <img
                          src={(project as any).image}
                          alt={project.name}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))',
                          pointerEvents: 'none',
                        }} />
                      </>
                    ) : (
                      <div style={{ height: '200px', background: 'linear-gradient(135deg, #1565C0, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                        🤖
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '10px' }}>
                      {project.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
                      {project.desc}
                    </p>
                    <Link
                      to={`/project/${(project as any).id}`}
                      style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
                    >
                      <motion.span
                        className="btn-primary"
                        style={{ display: 'inline-flex', fontSize: '0.85rem', padding: '10px 20px', cursor: 'pointer' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ExternalLink size={15} />
                        View Project
                      </motion.span>
                    </Link>
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
