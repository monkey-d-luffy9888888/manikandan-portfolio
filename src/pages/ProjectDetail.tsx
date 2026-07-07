import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Section {
  title: string
  content: string | string[]
}

interface ProjectData {
  name: string
  tagline: string
  overview: string
  problem: string
  tech: string[]
  sections: Section[]
  image?: string
  gradient: string
}

const PROJECT_DETAILS: Record<string, ProjectData> = {
  'adm-retail-platform': {
    name: 'ADM Retail Platform',
    tagline: 'Full-stack retail data management platform with AI product enrichment, taxonomy classification, Shopify integration, and AWS pipeline.',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #2563eb 100%)',
    image: '/images/project-1.png',
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'AWS', 'Shopify API', 'PostgreSQL', 'Docker', 'AI/ML', 'OpenPyXL'],
    overview:
      'ADM Retail Platform is a comprehensive full-stack data management system built for retail businesses. It automates the entire product data lifecycle — from raw supplier data ingestion through AI-powered enrichment, intelligent taxonomy classification, and final publication to Shopify stores via AWS-hosted pipelines.',
    problem:
      'Retail teams managing thousands of SKUs face enormous challenges keeping product data accurate, consistently classified, and ready for e-commerce. Manual enrichment is slow, taxonomy inconsistencies hurt search rankings, and pushing data to Shopify without automation is error-prone. ADM Retail Platform solves all three: automate enrichment with AI, enforce taxonomy standards programmatically, and sync to Shopify through a reliable AWS pipeline.',
    sections: [
      {
        title: 'Core Architecture',
        content: [
          'React + TypeScript frontend for data review, editing, and approval workflows',
          'FastAPI Python backend exposing REST endpoints for ingestion, validation, and export',
          'AI enrichment engine that fills missing product attributes using LLMs',
          'Taxonomy classification module that maps products to the correct category tree',
          'Shopify integration layer that pushes approved products via the Shopify Admin API',
          'AWS pipeline (S3 + Lambda / EC2) for scalable batch processing',
          'PostgreSQL database storing product records, classification results, and audit logs',
        ],
      },
      {
        title: 'AI Product Enrichment',
        content:
          'Raw supplier data often arrives with missing titles, incomplete descriptions, or absent specifications. The enrichment engine sends each product record to an LLM with a structured prompt that requests specific attribute values (dimensions, material, brand, model). The response is validated against a JSON schema before being written back to the product record, ensuring no hallucinated or malformed data ever reaches production.',
      },
      {
        title: 'Taxonomy Classification',
        content:
          'Every product must sit in the correct place in the category tree before it can be published. The classification module uses a combination of rule-based matching (on product type keywords) and AI classification to assign each product to its leaf node. Cross-product consistency is enforced — if two products share the same item name they must share the same taxonomy path, and any deviations are flagged for human review.',
      },
      {
        title: 'Shopify Integration',
        content:
          'Once a product passes enrichment and classification review, the platform pushes it to the connected Shopify store through the Shopify Admin REST API. It handles product creation, variant generation, image linking, metafield population, and inventory setup. Failed pushes are logged and retried automatically with exponential backoff.',
      },
      {
        title: 'AWS Pipeline',
        content:
          'Large batch imports (hundreds to thousands of SKUs) run as AWS jobs. Files are uploaded to S3, which triggers processing. Results are written back to the database and surfaced in the React dashboard. This design keeps the FastAPI backend responsive during heavy loads and makes the system horizontally scalable.',
      },
      {
        title: 'Key Features',
        content: [
          'Bulk Excel/CSV ingestion with automatic column detection',
          'AI-powered attribute enrichment with schema validation',
          'Taxonomy classification with cross-row consistency enforcement',
          'Human-in-the-loop review and approval workflow',
          'Shopify Admin API integration with retry logic',
          'AWS S3-triggered batch processing pipeline',
          'Exportable audit reports in Excel format',
        ],
      },
    ],
  },

  'dtlp-data-extraction-extension': {
    name: 'DTLP Data Extraction Extension',
    tagline: 'Chrome extension for AI-powered structured product data extraction using Perplexity sonar-pro and Google Gemini with IndexedDB.',
    gradient: 'linear-gradient(135deg, #3730a3 0%, #2563eb 100%)',
    image: '/images/project-2.png',
    tech: ['JavaScript', 'Chrome Extension API', 'Manifest V3', 'Perplexity sonar-pro', 'Google Gemini', 'IndexedDB', 'HTML/CSS'],
    overview:
      'DTLP Data Extraction Extension is a Chrome browser extension that lets users extract structured product data from any product detail page using AI. With a single click, it sends the visible page content to Perplexity sonar-pro and Google Gemini, receives a structured JSON object of product attributes, and saves it locally using IndexedDB for later export.',
    problem:
      'E-commerce and procurement teams spend hours manually copying product specifications — model numbers, dimensions, weights, materials — from supplier and manufacturer websites into spreadsheets. A single product page can hold dozens of attributes scattered across tabs, tables, and paragraphs. DTLP automates this entirely: the user opens a product page, clicks the extension, and gets a fully structured data record in seconds.',
    sections: [
      {
        title: 'How It Works',
        content: [
          'User navigates to a product page and clicks the extension icon',
          'Extension extracts the visible page text and HTML structure via a content script',
          "Page content is sent to Perplexity sonar-pro's API as a structured extraction prompt",
          'Gemini performs a second-pass verification and fills any gaps left by the first model',
          'The validated JSON record is stored in IndexedDB in the browser',
          'User can review, edit, and export all collected records as a CSV or JSON file',
        ],
      },
      {
        title: 'Dual-AI Extraction',
        content:
          'The extension uses two AI models in sequence. Perplexity sonar-pro performs the primary extraction — it is optimised for web content and produces the initial structured object. Google Gemini then reviews the result, corrects any attribute mismatches it detects, and fills fields that sonar-pro left blank. Using two models in this way significantly reduces extraction errors compared to a single-model approach.',
      },
      {
        title: 'Local Storage with IndexedDB',
        content:
          'All extracted records are saved in the browser\'s IndexedDB — a structured NoSQL store built into Chrome. This means no data ever leaves the user\'s machine except for the AI API calls. Records persist across browser sessions and can be queried, filtered by domain or date, and bulk-exported.',
      },
      {
        title: 'Chrome Manifest V3',
        content:
          'The extension is built on Manifest V3, the current Chrome extension standard. It uses a service worker as the background script (replacing the old persistent background page), declarativeNetRequest for any request handling, and content scripts with a strict content security policy. This ensures compatibility with modern Chrome versions and passes Chrome Web Store review requirements.',
      },
      {
        title: 'Key Features',
        content: [
          'One-click extraction from any product detail page',
          'Dual-AI pipeline: Perplexity sonar-pro + Google Gemini',
          'JSON schema validation on every extracted record',
          'Local IndexedDB storage — data never leaves the browser unnecessarily',
          'Bulk CSV and JSON export of all collected records',
          'Field-level review and manual correction UI',
          'Works on any supplier or manufacturer website',
        ],
      },
    ],
  },

  'ai-trading-extension': {
    name: 'AI Trading Extension',
    tagline: 'Chrome extension with Flask backend for real-time candlestick pattern detection and AI trade recommendations using Binance API.',
    gradient: 'linear-gradient(135deg, #065f46 0%, #0d9488 100%)',
    image: '/images/project-3.png',
    tech: ['Python', 'Flask', 'JavaScript', 'Chrome Extension API', 'Manifest V3', 'Binance API', 'AI/ML', 'Candlestick Pattern Detection'],
    overview:
      'AI Trading Extension is a two-part system: a Chrome extension that overlays a live trading intelligence panel on charting websites, and a Flask backend that pulls real-time OHLCV data from the Binance API, runs candlestick pattern detection algorithms, and returns AI-powered trade recommendations.',
    problem:
      'Retail traders spend significant time switching between a charting platform, a pattern reference guide, and a trade journal. Spotting candlestick patterns manually is slow and error-prone under live market conditions. This extension brings pattern detection and AI recommendations directly into the browser while the user is looking at the chart, eliminating the context switch entirely.',
    sections: [
      {
        title: 'System Architecture',
        content: [
          'Chrome extension (Manifest V3) injects a floating panel into any charting or trading website',
          'The panel communicates with a locally running Flask backend via HTTP',
          'Flask backend calls the Binance API to fetch real-time OHLCV candlestick data for the selected symbol',
          'Pattern detection engine analyses the recent candles for known formations',
          'AI model evaluates the detected patterns in market context and generates a trade recommendation',
          'Recommendation (direction, confidence, key levels) is sent back to the extension panel',
        ],
      },
      {
        title: 'Candlestick Pattern Detection',
        content:
          'The detection engine checks the last N candles against a library of classical candlestick patterns: Doji, Hammer, Engulfing, Morning Star, Evening Star, Shooting Star, Harami, and others. Each pattern is implemented as a deterministic rule function that takes OHLCV values as input. When one or more patterns are confirmed, they are passed to the AI recommendation layer with their context (trend direction, volume, proximity to support/resistance).',
      },
      {
        title: 'Binance API Integration',
        content:
          'The Flask backend uses the Binance REST API to fetch kline (candlestick) data for any trading pair. The user selects a symbol and timeframe in the extension panel; the backend fetches the last 50–200 candles, parses the OHLCV values, and passes them through the detection pipeline. Rate limits are respected with request throttling to avoid API bans during rapid symbol switching.',
      },
      {
        title: 'AI Trade Recommendations',
        content:
          'After pattern detection, the system feeds the pattern names, current price, volume, and recent trend to an AI model. The model returns a structured recommendation: whether the signal is bullish, bearish, or neutral; a confidence score; suggested entry zone; and a brief rationale. This helps traders make faster, more informed decisions without replacing their own judgement.',
      },
      {
        title: 'Key Features',
        content: [
          'Floating extension panel overlaid on any trading or charting page',
          'Real-time OHLCV data from Binance API for any trading pair',
          'Detection of 10+ classical candlestick patterns',
          'AI-generated trade recommendations with confidence scores',
          'User-selectable symbol and timeframe',
          'Flask backend runs locally — no cloud dependency during trading sessions',
          'Clean, minimal UI that does not obstruct the chart',
        ],
      },
    ],
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45 },
  }),
}

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = id ? PROJECT_DETAILS[id] : undefined

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Project not found</h2>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Back to Portfolio
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Hero banner */}
      <div style={{ background: project.gradient, padding: '0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 2rem 0' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px',
              padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 3rem' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}
          >
            {project.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '680px' }}
          >
            {project.tagline}
          </motion.p>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.5rem' }}
          >
            {project.tech.map(t => (
              <span key={t} style={{
                background: 'rgba(255,255,255,0.18)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '100px', padding: '4px 14px',
                fontSize: '0.78rem', fontWeight: 600,
              }}>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>

        {/* Overview */}
        <motion.section
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '2.5rem' }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Overview
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.97rem' }}>
            {project.overview}
          </p>
        </motion.section>

        {/* Problem statement */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          style={{
            marginBottom: '2.5rem',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '1.5rem 1.75rem',
            borderLeft: '4px solid #2563eb',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.6rem' }}>
            The Problem It Solves
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
            {project.problem}
          </p>
        </motion.section>

        {/* Dynamic sections */}
        {project.sections.map((section, i) => (
          <motion.section
            key={section.title}
            custom={i + 2} variants={fadeUp} initial="hidden" animate="visible"
            style={{ marginBottom: '2.5rem' }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border, rgba(128,128,128,0.2))', paddingBottom: '0.5rem' }}>
              {section.title}
            </h2>
            {Array.isArray(section.content) ? (
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.content.map((item, j) => (
                  <li key={j} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
                {section.content}
              </p>
            )}
          </motion.section>
        ))}

        {/* Back button at bottom */}
        <motion.div
          custom={project.sections.length + 3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginTop: '1rem' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: '10px',
              padding: '12px 28px', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </button>
        </motion.div>
      </div>
    </div>
  )
}
