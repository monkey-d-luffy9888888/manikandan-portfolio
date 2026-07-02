import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { Navbar } from '@/components/layout/Navbar'
import { Greeting } from '@/components/sections/Greeting'
import { WhatIDo } from '@/components/sections/WhatIDo'
import { Proficiency } from '@/components/sections/Proficiency'
import { Education } from '@/components/sections/Education'
import { WorkExperience } from '@/components/sections/WorkExperience'
import { OpenSource } from '@/components/sections/OpenSource'
import { BigProjects } from '@/components/sections/BigProjects'
import { Achievements } from '@/components/sections/Achievements'
import { Blogs } from '@/components/sections/Blogs'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { motion, AnimatePresence } from 'framer-motion'

function PortfolioApp() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Manikandan Santhosh — AI Engineer & Full Stack Developer'
  }, [])

  return (
    <>
      <LoadingScreen onDone={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}
          >
            <Navbar />
            <Greeting />
            <WhatIDo />
            <Proficiency />
            <Education />
            <WorkExperience />
            <OpenSource />
            <BigProjects />
            <Achievements />
            <Blogs />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  )
}

export default App
