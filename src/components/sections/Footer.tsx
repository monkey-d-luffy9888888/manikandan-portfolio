import { Heart } from 'lucide-react'

export const Footer = () => (
  <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
      Made with <Heart size={16} fill="currentColor" style={{ color: '#ef4444' }} /> by Manikandan
    </p>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
      AI Engineer · Full Stack Developer · LLM Engineer
    </p>
  </footer>
)
