import { portfolioData } from '@/data/portfolio'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export const Blogs = () => {
  const { blogs } = portfolioData

  return (
    <section id="blogs" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Technical Writing</h2>
          <p className="section-subheading">ENGINEERING NOTES FROM PRODUCTION AI SYSTEMS</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(blogs as any[]).map((blog, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '24px 28px',
                cursor: 'default',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
              whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(37,99,235,0.1)' }}
            >
              {/* Topic tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  background: 'rgba(37,99,235,0.08)',
                  border: '1px solid rgba(37,99,235,0.15)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                }}>
                  {blog.topic}
                </span>

                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  color: 'var(--text-secondary)',
                  letterSpacing: '1px',
                }}>
                  Coming soon
                </span>
              </div>

              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.02rem', marginBottom: '8px', lineHeight: 1.45, paddingRight: '32px' }}>
                {blog.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>
                {blog.desc}
              </p>

              <ArrowUpRight
                size={16}
                style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--text-secondary)', opacity: 0.4 }}
              />
            </motion.article>
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <a
            href={`mailto:${portfolioData.contactEmail}?subject=Notify me when you publish`}
            style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Get notified when I publish →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
