import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Section {
  title: string
  content: string | string[]
}

interface ExperienceData {
  role: string
  company: string
  tagline: string
  overview: string
  problem: string
  tech: string[]
  sections: Section[]
  gradient: string
}

const EXPERIENCE_DETAILS: Record<string, ExperienceData> = {
  'enterprise-product-ai': {
    role: 'Enterprise Product AI',
    company: 'AI Extraction System',
    tagline: 'Production AI pipeline for extracting structured product attributes from PDFs and images at enterprise scale.',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #1e40af 100%)',
    tech: ['Python', 'FastAPI', 'OCR', 'LLMs', 'Docker', 'GCP', 'Tesseract', 'JSON Schema'],
    overview:
      'Built a production-grade AI pipeline for an enterprise client that automatically extracts structured product attributes — model numbers, dimensions, materials, specifications — from large volumes of product PDFs and images. The system uses OCR to read document content and multiple LLMs to extract and verify the data, returning clean JSON records ready for downstream systems.',
    problem:
      'The client processed thousands of supplier documents every month. Each document contained product specifications scattered across different layouts — tables, paragraphs, images, and mixed formats. Manual extraction was too slow and inconsistent to meet enterprise volume. A single extraction system that worked reliably across all document types was needed.',
    sections: [
      {
        title: 'Pipeline Architecture',
        content: [
          'Document ingestion via FastAPI REST endpoint — accepts PDF and image uploads',
          'Preprocessing stage: page splitting, image normalisation, deskewing for OCR accuracy',
          'OCR layer extracts raw text using Tesseract (and Cloud Vision for complex layouts)',
          'Primary LLM receives OCR output and a structured extraction prompt, returns a JSON attribute object',
          'Verification LLM independently re-reads the document excerpt to confirm attribute values',
          'JSON schema validator rejects any response that does not match the expected structure',
          'Validated records are written to the output store and returned via the API response',
        ],
      },
      {
        title: 'Multi-LLM Verification',
        content:
          'The core reliability mechanism is a two-model verification approach. The primary model performs the initial extraction. A second model then reads the same document section and confirms or corrects the attribute values. If the two models disagree on a value, the system flags the field for human review rather than guessing. This layered approach ensures that only high-confidence values flow through to production.',
      },
      {
        title: 'OCR Strategy',
        content:
          'Different document types required different OCR approaches. Clean, text-based PDFs were processed with direct text extraction. Scanned PDFs and product images went through Tesseract with preprocessing — contrast adjustment, noise removal, and layout detection. For complex multi-column layouts, a bounding-box approach was used to preserve reading order before feeding text to the LLM, preventing attribute mixing.',
      },
      {
        title: 'Deployment on GCP with Docker',
        content:
          'The FastAPI service was containerised with Docker and deployed to Google Cloud Platform. Each container instance handles document processing in isolation. The pipeline scales horizontally — multiple container replicas process documents in parallel during high-load periods. Health checks and structured logging give visibility into per-document processing status and failure reasons.',
      },
      {
        title: 'Key Features',
        content: [
          'Handles PDFs, scanned images, and mixed document types in a single pipeline',
          'Two-model verification layer for high-confidence extraction',
          'JSON schema validation ensuring clean, consistent output structure',
          'FastAPI REST API with async processing for high throughput',
          'Docker-based deployment on GCP for horizontal scaling',
          'Human review flag for low-confidence and conflicting attribute extractions',
          'Structured logging and per-document status tracking',
        ],
      },
    ],
  },

  'enterprise-audit-ai': {
    role: 'Enterprise Audit AI',
    company: 'Audit Automation System',
    tagline: 'Intelligent audit automation that processes Excel datasets with AI validation and bulk error detection for enterprise finance teams.',
    gradient: 'linear-gradient(135deg, #4A148C 0%, #6d28d9 100%)',
    tech: ['Python', 'OpenPyXL', 'LLMs', 'FastAPI', 'PostgreSQL', 'Excel', 'Pandas'],
    overview:
      'Built an enterprise audit automation system that replaces manual Excel review. The system ingests large Excel files, applies rule-based validation and AI-driven error detection, flags issues with detailed annotations, automatically generates a cleaned version of the file, and produces a full audit report — all without manual intervention.',
    problem:
      'Enterprise finance teams received large Excel datasets from internal departments and external vendors that required careful validation before use. Each file could contain hundreds of rows with errors: wrong formats, duplicate entries, missing required values, out-of-range numbers, and cross-row inconsistencies. Reviewing these manually took days per file and introduced human error into the audit trail.',
    sections: [
      {
        title: 'How the System Works',
        content: [
          'Excel file is uploaded via the FastAPI endpoint',
          'OpenPyXL parses the file and loads each sheet into a structured in-memory model',
          'Rule-based validator applies configured checks: required fields, data types, value ranges, duplicate detection',
          'LLM validation engine sends row batches to the model with a domain-specific audit prompt',
          'AI identifies contextual errors that rules miss: implausible values, mismatched cross-column data, anomalous patterns',
          'All findings are collected, deduplicated, and annotated against the original row/column coordinates',
          'Cleaned Excel file is generated with error cells highlighted and a summary tab appended',
          'Audit report is written to PostgreSQL and can be exported as a formatted Excel or PDF',
        ],
      },
      {
        title: 'Rule-Based Validation',
        content:
          'The first validation layer is deterministic and fast. It checks every cell against a configurable rule set: required fields must not be blank, numeric columns must fall within defined ranges, date fields must match expected formats, and cross-column constraints (like "end date must be after start date") are enforced. This catches obvious structural errors instantly before the more expensive AI layer runs.',
      },
      {
        title: 'AI Error Detection',
        content:
          'The second validation layer sends row batches to an LLM with the column definitions and a prompt describing what constitutes a valid record for this dataset. The model returns error annotations with field names, detected issue descriptions, and severity levels. This catches contextual errors that rules cannot express: a financial figure that is technically in-range but implausibly large given the other values in the row, or a vendor name that does not match any known format.',
      },
      {
        title: 'Automated Cleaning and Reporting',
        content:
          'Once validation is complete, the system generates a cleaned Excel file. Error cells are highlighted with conditional formatting, and a new sheet summarises all findings by severity and row number. A separate audit record is written to PostgreSQL, capturing the original file hash, all detected errors, the cleaning actions taken, and a timestamp. Finance teams receive both the cleaned file and a full audit trail, satisfying compliance requirements.',
      },
      {
        title: 'Key Features',
        content: [
          'Configurable rule-based validation for any Excel schema',
          'AI-powered contextual error detection beyond rule coverage',
          'Automatic cleaned file generation with highlighted error cells',
          'PostgreSQL audit trail for compliance and history',
          'FastAPI REST endpoint for programmatic integration',
          'Supports files with multiple sheets and cross-sheet references',
          'Exportable audit report in Excel and PDF formats',
        ],
      },
    ],
  },

  'gemma-fine-tuning': {
    role: 'Gemma Fine-Tuning',
    company: 'LLM Pipeline',
    tagline: 'Custom fine-tuning pipeline for Google Gemma models on domain-specific datasets with LoRA and full API deployment.',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #16a34a 100%)',
    tech: ['Python', 'Google Gemma', 'LoRA', 'PEFT', 'Hugging Face', 'Google Colab A100', 'FastAPI', 'Transformers'],
    overview:
      'Built a complete fine-tuning pipeline for Google Gemma language models. The pipeline handles dataset preparation, LoRA adapter training on Google Colab A100 GPUs, model evaluation, upload to Hugging Face Hub, and deployment as a FastAPI inference endpoint. The fine-tuned model shows significant improvement over the base Gemma model on domain-specific tasks.',
    problem:
      'Base language models like Gemma respond well to general queries but produce inconsistent results on domain-specific tasks where precise terminology and structured output formats are required. A fine-tuned model that has learned the domain vocabulary, expected output structure, and edge-case handling produces far more reliable results — eliminating the need for complex prompt engineering on every query.',
    sections: [
      {
        title: 'Fine-Tuning Pipeline Steps',
        content: [
          'Dataset collection and curation: assembled instruction-response pairs covering the target domain',
          'Data preprocessing: tokenisation, sequence length analysis, and train/validation split',
          'LoRA configuration: selected rank, alpha, target modules (q_proj, v_proj), and dropout',
          'Training on Google Colab A100 GPU with mixed-precision (bf16) and gradient checkpointing',
          'Loss curve monitoring and early stopping to prevent overfitting',
          'Evaluation against held-out validation set with domain-specific metrics',
          'Adapter merge into base model weights and upload to Hugging Face Hub',
          'FastAPI inference endpoint wrapping the deployed model for production use',
        ],
      },
      {
        title: 'LoRA Fine-Tuning Approach',
        content:
          'Low-Rank Adaptation (LoRA) was chosen over full fine-tuning for efficiency. LoRA freezes the original model weights and adds small trainable adapter matrices to the attention layers. This reduces GPU memory requirements dramatically — making A100 training practical — while achieving comparable results to full fine-tuning on domain-specific tasks. The rank and alpha values were tuned through experimentation to balance adaptation strength against catastrophic forgetting of general capabilities.',
      },
      {
        title: 'Training on Google Colab A100',
        content:
          'Training ran on a Google Colab A100 (40GB VRAM) instance. Mixed-precision training (bfloat16) kept memory usage manageable while maintaining numerical stability. Gradient checkpointing was enabled to fit longer sequences without running out of VRAM. Training progress was logged per step, with checkpoint saves every N steps so training could resume after interruptions without losing progress.',
      },
      {
        title: 'Hugging Face Hub Deployment',
        content:
          'After training, the LoRA adapter was merged into the base Gemma weights and the resulting model was pushed to Hugging Face Hub as a private repository. A FastAPI inference service wraps the model, loading it once at startup and serving inference requests through a REST endpoint. The endpoint accepts a prompt and returns the model\'s generated response, with configurable parameters for temperature, max tokens, and sampling strategy.',
      },
      {
        title: 'Key Features',
        content: [
          'End-to-end fine-tuning pipeline from raw data to deployed model',
          'LoRA/PEFT fine-tuning with configurable rank, alpha, and target modules',
          'Mixed-precision training on Google Colab A100 for memory efficiency',
          'Gradient checkpointing for long-sequence training',
          'Hugging Face Hub integration for model versioning and storage',
          'FastAPI REST inference endpoint with configurable generation parameters',
          'Domain-specific evaluation metrics to measure improvement over base model',
        ],
      },
    ],
  },

  'ai-chrome-extension': {
    role: 'AI Chrome Extension',
    company: 'Browser AI Tool',
    tagline: 'Browser extension for AI-powered product attribute extraction with JSON schema validation across e-commerce websites.',
    gradient: 'linear-gradient(135deg, #006064 0%, #0891b2 100%)',
    tech: ['JavaScript', 'Chrome Extension API', 'Manifest V3', 'LLMs', 'JSON Schema', 'IndexedDB', 'HTML/CSS'],
    overview:
      'Built a Chrome browser extension that extracts structured product attributes from any e-commerce product page using an AI model. The extension reads the page content, sends it to an LLM with a structured extraction prompt, validates the returned JSON against a schema, and presents the clean data to the user in the extension popup. Results can be copied or exported for use in product databases and spreadsheets.',
    problem:
      'E-commerce product managers and procurement teams manually copy product specifications — dimensions, weights, materials, model numbers, certifications — from supplier websites into their own systems. A single product can have dozens of attributes scattered across page sections, tabs, and specification tables. This manual process consumes significant working time per product and introduces transcription errors.',
    sections: [
      {
        title: 'Extension Architecture',
        content: [
          'Manifest V3 extension with a service worker background script',
          'Content script injected into the active tab to capture page DOM and visible text',
          'Background service worker handles all LLM API calls outside the page context',
          'Popup UI renders the extracted attribute results and provides copy/export controls',
          'Storage module saves results to chrome.storage.local for session persistence',
        ],
      },
      {
        title: 'AI Extraction Workflow',
        content:
          'When the user clicks the extension icon, the content script serialises the visible page text and the key HTML structure (headings, tables, specification lists) and sends it to the background service worker. The worker builds a structured extraction prompt that includes the page content and a JSON schema defining the expected attribute fields. The LLM receives this prompt and returns a JSON object. The worker validates the response against the schema before sending it to the popup for display.',
      },
      {
        title: 'JSON Schema Validation',
        content:
          'Every extraction response is validated against a product attribute JSON schema before being shown to the user. The schema defines required fields, data types, and expected value formats for each attribute. If the LLM returns a field in an unexpected format (a number where a string is required, or a missing required field), the extension rejects the response and retries the extraction with a corrective prompt. This ensures consistent, clean output regardless of the source website.',
      },
      {
        title: 'Cross-Site Compatibility',
        content:
          'Product pages vary enormously across websites — some use structured specification tables, others embed attributes in description paragraphs, and some split data across multiple tabs. The extraction prompt is written to handle all of these cases: it instructs the model to search the entire page content for each attribute rather than assuming a fixed layout. This makes the extension work reliably across a wide range of supplier and manufacturer websites.',
      },
      {
        title: 'Key Features',
        content: [
          'One-click extraction from any product page',
          'AI-powered extraction that handles all page layouts',
          'JSON schema validation ensuring clean, consistent attribute output',
          'Retry logic with corrective prompting on schema validation failures',
          'Session result history via chrome.storage.local',
          'Copy-to-clipboard and CSV export for extracted attributes',
          'Manifest V3 compliant — passes Chrome Web Store review requirements',
        ],
      },
    ],
  },

  'trading-ai-platform': {
    role: 'Trading AI Platform',
    company: 'Market Intelligence Tool',
    tagline: 'Multi-site trading intelligence platform aggregating data from multiple sources with AI pattern detection and a real-time WebSocket dashboard.',
    gradient: 'linear-gradient(135deg, #E65100 0%, #ea580c 100%)',
    tech: ['Python', 'FastAPI', 'React', 'WebSocket', 'AI/ML', 'PostgreSQL', 'TypeScript'],
    overview:
      'Built a full-stack trading intelligence platform that aggregates market data from multiple trading platforms simultaneously, runs AI-powered pattern detection across all feeds, and delivers live signals through a WebSocket-connected React dashboard. The platform gives traders a single interface to monitor, analyse, and act on opportunities across many markets at once.',
    problem:
      'Active traders monitor multiple trading platforms, each with its own interface and data format. Keeping track of signals across all of them simultaneously is cognitively demanding and slow. Patterns that appear across multiple platforms at the same time are especially significant, but impossible to spot manually when switching between tabs. A unified system that aggregates, analyses, and surfaces signals automatically removes this burden.',
    sections: [
      {
        title: 'System Architecture',
        content: [
          'Per-site Python data collectors fetch and normalise market data from each trading platform',
          'Normalisation layer maps each site\'s data format into a unified internal schema',
          'AI pattern detection engine processes the normalised feeds in real time',
          'Signal aggregator collects pattern detections across all sites and ranks them by confidence',
          'FastAPI server manages WebSocket connections and pushes signals to connected clients',
          'React frontend renders the live dashboard with per-symbol signal cards and filtering controls',
          'PostgreSQL stores historical signal data for backtesting and performance analysis',
        ],
      },
      {
        title: 'Multi-Site Data Aggregation',
        content:
          'Each supported trading platform has a dedicated Python collector module. Collectors handle the platform-specific API or data format and output normalised records — symbol, timeframe, OHLCV values, volume, timestamp — into a shared internal queue. New platforms can be added by implementing the collector interface without changing any other part of the system. This keeps the aggregation layer extensible as the number of monitored sites grows.',
      },
      {
        title: 'AI Pattern Detection',
        content:
          'The pattern detection engine processes incoming market data in real time. It runs both deterministic technical analysis (candlestick pattern matching, moving average crossovers, volume spikes) and AI-based signal generation. Detected patterns are tagged with the source platform, symbol, timeframe, pattern type, and a confidence score. The signal aggregator then cross-references these detections — a pattern appearing across multiple platforms simultaneously is elevated to a high-priority signal.',
      },
      {
        title: 'WebSocket Real-Time Dashboard',
        content:
          'The FastAPI backend maintains WebSocket connections with all connected React clients. When new signals are generated, they are broadcast instantly to connected clients without polling. The React frontend renders a live dashboard with signal cards that update in real time. Users can filter by platform, symbol, timeframe, and signal type. Historical signals are loaded from PostgreSQL on initial page load, so the dashboard is immediately useful even before new signals arrive.',
      },
      {
        title: 'Key Features',
        content: [
          'Data aggregation from multiple trading platforms with per-platform adapters',
          'Unified normalisation schema for consistent cross-platform analysis',
          'Real-time AI pattern detection with confidence scoring',
          'Cross-platform signal correlation — elevated priority for multi-platform signals',
          'WebSocket push architecture for zero-latency signal delivery',
          'React dashboard with live signal cards and multi-dimension filtering',
          'PostgreSQL signal history for backtesting and performance review',
        ],
      },
    ],
  },

  'pdf-cad-ai-extractor': {
    role: 'PDF + CAD AI Extractor',
    company: 'Document AI System',
    tagline: 'AI document processor that extracts structured data from engineering PDFs and CAD files using YOLO object detection and Tesseract OCR.',
    gradient: 'linear-gradient(135deg, #880E4F 0%, #be185d 100%)',
    tech: ['Python', 'YOLO', 'Tesseract OCR', 'PDF.js', 'FastAPI', 'OpenCV', 'Ultralytics'],
    overview:
      'Built a specialised document processing system for engineering firms. The system ingests engineering PDFs and CAD drawing files, uses a YOLO object detection model to identify relevant regions within CAD drawings, extracts text from those regions using Tesseract OCR, and structures the output into JSON records for downstream integration. It handles the complex visual layouts of technical drawings that standard PDF text extractors cannot process.',
    problem:
      'Engineering firms deal with large archives of CAD drawings and technical PDFs containing critical specifications: part numbers, tolerances, material grades, revision notes, and dimensional values. These documents have complex visual layouts — title blocks, revision tables, dimension annotations, and callout labels — that are impossible to extract reliably with standard PDF text tools or simple OCR. A layout-aware system that understands the structure of engineering drawings was needed.',
    sections: [
      {
        title: 'Processing Pipeline',
        content: [
          'File upload via FastAPI endpoint — accepts PDF and common CAD export formats (DXF, DWG-rendered images)',
          'File type detection routes the document to the appropriate processing path',
          'For PDFs: PDF.js renders each page to a high-resolution image',
          'YOLO object detection model identifies key regions: title block, revision table, parts list, dimension annotations',
          'Each detected region is cropped and fed to Tesseract OCR with region-specific preprocessing',
          'OCR output is cleaned (noise removal, character correction) and labelled with region type',
          'AI structuring layer maps labelled text to a defined JSON schema',
          'Validated JSON record is returned via the API and optionally stored',
        ],
      },
      {
        title: 'YOLO Region Detection',
        content:
          'The core challenge of engineering document processing is knowing which part of the drawing contains what information. A custom YOLO model was trained on engineering drawing samples to detect standard regions: the title block (containing document number, revision, date, and project name), revision history tables, parts lists, and dimension callout zones. Once regions are localised, OCR runs on each isolated crop rather than the full image — this dramatically improves text extraction accuracy by eliminating background noise from the rest of the drawing.',
      },
      {
        title: 'Tesseract OCR with Region-Specific Preprocessing',
        content:
          'Engineering drawings present OCR challenges: small text sizes, varied fonts, rotated text in dimension lines, and low-contrast backgrounds. Each detected region receives preprocessing tailored to its characteristics: contrast enhancement for title blocks, deskewing for rotated text, and threshold adjustment for low-contrast areas. Tesseract is configured with the PSM (page segmentation mode) appropriate for each region type — single-line mode for titles, sparse text mode for dimension annotations.',
      },
      {
        title: 'AI Structuring Layer',
        content:
          'After OCR, the raw extracted text is labelled with its source region (e.g., "title block", "revision table row 3"). An AI structuring step maps this labelled text to the target JSON schema fields — part number, material, revision, drawing number, tolerance, and so on. The model handles abbreviations and formatting variations common in engineering notation, converting values like "±0.05" or "SS 316L" into their canonical structured form.',
      },
      {
        title: 'Key Features',
        content: [
          'Handles engineering PDFs and CAD drawing exports in a single pipeline',
          'Custom YOLO model for engineering drawing region detection',
          'Region-specific OCR preprocessing for high accuracy on technical drawings',
          'AI text structuring to handle engineering notation and abbreviations',
          'FastAPI REST API for integration with engineering document management systems',
          'Structured JSON output with field provenance (which region each value came from)',
          'Supports multi-page documents with per-page region detection',
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

export const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const experience = id ? EXPERIENCE_DETAILS[id] : undefined

  if (!experience) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Experience not found</h2>
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
      <div style={{ background: experience.gradient, padding: '0' }}>
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
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}
          >
            {experience.company}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}
          >
            {experience.role}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '680px' }}
          >
            {experience.tagline}
          </motion.p>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.5rem' }}
          >
            {experience.tech.map(t => (
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
            {experience.overview}
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
            {experience.problem}
          </p>
        </motion.section>

        {/* Dynamic sections */}
        {experience.sections.map((section, i) => (
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
          custom={experience.sections.length + 3} variants={fadeUp} initial="hidden" animate="visible"
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
