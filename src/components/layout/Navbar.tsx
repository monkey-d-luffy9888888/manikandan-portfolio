import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

const navLinks = [
  { label: 'Skills', href: '#skills' },
  { label: 'Work Experiences', href: '#experience' },
  { label: 'Open Source', href: '#opensource' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Resume', href: '#' },
  { label: 'Contact Me', href: '#contact' },
]

export const Navbar = () => {
  const { toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 1.5rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a
          href="#greeting"
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
            fontWeight: 700,
            color: 'var(--primary)',
            textDecoration: 'none',
          }}
        >
          Manikandan Santhosh
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)' }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title="Toggle theme"
            aria-label="Toggle dark/light mode"
            style={{ marginLeft: '12px' }}
          />
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.5rem', cursor: 'pointer', padding: '4px' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem',
        }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: 'var(--text)',
                textDecoration: 'none',
                padding: '12px 0',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderBottom: '1px solid var(--border)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
