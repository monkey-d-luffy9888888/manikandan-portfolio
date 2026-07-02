import { portfolioData } from '@/data/portfolio'
import { motion } from 'framer-motion'
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Mail, MapPin } from 'lucide-react'

export const Contact = () => {
  const { socialLinks, location, openToOpportunities } = portfolioData

  return (
    <section id="contact" style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Reach Out to me!</h2>
          <p className="section-subheading">
            DISCUSS A PROJECT OR JUST WANT TO SAY HI? MY INBOX IS OPEN FOR ALL.
          </p>
        </motion.div>

        <div className="grid-contact">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
              "AI Engineer & Full Stack Developer | Building production AI systems that actually ship"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: openToOpportunities ? '#22c55e' : '#ef4444',
                display: 'inline-block',
              }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Open for opportunities: <strong style={{ color: 'var(--text)' }}>{openToOpportunities ? 'Yes' : 'No'}</strong>
              </span>
            </div>

            {/* Social icon buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  style={{ background: s.bg }}
                  title={s.label}
                >
                  {s.icon === 'github' && <GithubIcon size={20} />}
                  {s.icon === 'linkedin' && <LinkedinIcon size={20} />}
                  {s.icon === 'mail' && <Mail size={20} />}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
            className="max-md:hidden"
          >
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: '-5px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, var(--primary), #60a5fa, #818cf8, #38bdf8, var(--primary))',
                }}
              />
              <div style={{
                position: 'absolute', inset: '-2px',
                borderRadius: '50%',
                background: 'var(--bg)',
              }} />
              <div style={{
                position: 'relative', zIndex: 2,
                width: '200px', height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 16px 50px rgba(37,99,235,0.25)',
              }}>
                <img
                  src="/manikandan.jpeg"
                  alt="Manikandan Santhosh"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
