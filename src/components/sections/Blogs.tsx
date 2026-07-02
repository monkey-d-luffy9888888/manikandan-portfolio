import { portfolioData } from '@/data/portfolio'
import { motion } from 'framer-motion'

export const Blogs = () => {
  const { blogs } = portfolioData

  return (
    <section id="blogs" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Blogs</h2>
          <p className="section-subheading">I LOVE SHARING WHAT I LEARN ABOUT AI ENGINEERING</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="max-md:grid-cols-1">
          {blogs.map((blog, i) => (
            <motion.div
              key={i}
              className="blog-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Arrow icon top right */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
              }}>
                →
              </div>

              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '12px', paddingRight: '40px', lineHeight: 1.5 }}>
                {blog.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {blog.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
