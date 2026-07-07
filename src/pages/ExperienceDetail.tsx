import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────
interface Section {
  title: string
  content: string | string[]
}

interface Challenge {
  challenge: string
  solution: string
}

interface Decision {
  decision: string
  rationale: string
  tradeoff: string
}

interface ExperienceData {
  role: string
  company: string
  tagline: string
  overview: string
  problem: string
  tech: string[]
  architectureDiagram: string
  sections: Section[]
  challenges: Challenge[]
  decisions: Decision[]
  lessonsLearned: string[]
  gradient: string
}

// ──────────────────────────────────────────────────────────
// Experience data — specific, accurate, no fake numbers
// ──────────────────────────────────────────────────────────
const EXPERIENCE_DETAILS: Record<string, ExperienceData> = {
  'enterprise-product-ai': {
    role: 'Enterprise Product AI',
    company: 'AI Extraction System',
    tagline: 'Production AI pipeline that extracts structured product attributes from enterprise PDFs and images using OCR, multi-model verification, and schema-validated JSON output.',
    gradient: 'linear-gradient(135deg, #1565C0 0%, #1e40af 100%)',
    tech: ['Python', 'FastAPI', 'Tesseract OCR', 'LLMs', 'Pydantic', 'Docker', 'GCP', 'JSON Schema'],

    overview:
      'Built a production-grade AI pipeline for an enterprise client that automatically extracts structured product attributes — model numbers, dimensions, materials, specifications — from large volumes of product PDFs and scanned images. The system uses Tesseract OCR to convert documents to text, and a two-model LLM pipeline to extract and independently verify each attribute, returning clean, schema-validated JSON records ready for downstream systems.',

    problem:
      'The client processed thousands of supplier documents every month. Each document contained product specifications scattered across different layouts — tables, paragraphs, images, and mixed formats with no consistent structure. Manual extraction was too slow and inconsistent to meet enterprise volume. A single extraction system needed to work reliably across all document types without per-document configuration.',

    architectureDiagram:
`Document Upload (PDF / Image)
          │
          ▼
┌─────────────────────┐
│  FastAPI REST       │
│  Endpoint           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Preprocessing      │
│  (deskew, normalise,│
│   page splitting)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Tesseract OCR      │
│  (+ Cloud Vision    │
│   for complex       │
│   layouts)          │
└──────────┬──────────┘
           │ raw text
           ▼
┌─────────────────────┐
│  Primary LLM        │
│  (extraction +      │
│   JSON schema)      │
└──────────┬──────────┘
           │ initial JSON
           ▼
┌─────────────────────┐
│  Verification LLM   │
│  (re-reads source,  │
│   confirms/corrects)│
└──────────┬──────────┘
           │ verified JSON
           ▼
┌─────────────────────┐
│  Pydantic Schema    │
│  Validator          │
└──────┬──────────────┘
       │                │
       ▼                ▼
  Valid → write    Invalid → flag
  to output store  for human review`,

    sections: [
      {
        title: 'Pipeline Architecture',
        content: [
          'Document ingestion via FastAPI REST endpoint — accepts PDF and image uploads',
          'Preprocessing stage: page splitting, image normalisation, deskewing for OCR accuracy',
          'OCR layer: Tesseract for standard documents, Cloud Vision for complex multi-column layouts',
          'Primary LLM receives OCR output and a structured extraction prompt, returns a JSON attribute object',
          'Verification LLM independently re-reads the same document excerpt to confirm each attribute value',
          'Pydantic schema validator rejects any response that does not match the expected field types and required keys',
          'Validated records are written to the output store; conflicting attribute values are flagged for human review',
        ],
      },
      {
        title: 'Multi-LLM Verification Strategy',
        content:
          'The core reliability mechanism uses a two-model pipeline. The primary model performs the initial extraction. A second model then reads the same document section and confirms or corrects the attribute values. If the two models disagree on a specific value, the system flags that field for human review rather than making a choice. This layered approach ensures that only high-confidence values flow through to production, with ambiguous cases visible to reviewers.',
      },
      {
        title: 'OCR Strategy — Handling Mixed Document Types',
        content:
          'Different document types require different OCR approaches. Clean, text-based PDFs are processed with direct text extraction. Scanned PDFs and product images go through Tesseract with preprocessing — contrast adjustment, noise removal, and bounding-box layout detection. For complex multi-column layouts, bounding-box segmentation preserves reading order before feeding text to the LLM, preventing columns from merging and producing mixed attributes.',
      },
      {
        title: 'Deployment on GCP with Docker',
        content:
          'The FastAPI service is containerised with Docker and deployed to Google Cloud Platform. Each container instance processes documents in isolation with no shared in-process state. The deployment scales horizontally — multiple container replicas process documents in parallel during high-load periods. Structured logging captures per-document processing status, failure reasons, and timing, giving visibility into pipeline health.',
      },
    ],

    challenges: [
      {
        challenge: 'Mixed document types — no consistent layout across supplier files',
        solution: 'Different documents require different preprocessing strategies. Built a document classifier that runs before OCR and routes each document to the correct preprocessing path: direct text extraction for clean PDFs, full OCR pipeline for scans, and bounding-box segmentation for multi-column formats. New document types can be added by implementing a new preprocessing handler without changing the core pipeline.',
      },
      {
        challenge: 'LLM attribute conflicts between primary and verification models',
        solution: 'When the two models disagreed on an attribute value, early versions used a simple tie-break rule (primary model wins). Changed the approach: disagreements are not resolved automatically — they are stored as conflicts in the output record with both proposed values and a "review required" flag. Human reviewers see exactly what each model said, making review decisions faster and more accurate.',
      },
      {
        challenge: 'Tesseract reading order on multi-column layouts',
        solution: 'Tesseract reads text in raster order by default, which merges columns and produces incorrect attribute associations in multi-column product specification sheets. Added a bounding-box layout analysis step using OpenCV before Tesseract: the step detects text blocks, sorts them into reading order by column and row, and feeds them to the OCR layer individually. This preserves the logical structure of the document.',
      },
    ],

    decisions: [
      {
        decision: 'Two separate LLM models in sequence rather than one model with self-correction',
        rationale: 'A model correcting its own output is biased toward confirming what it already produced — self-correction cannot catch the model\'s own systematic blind spots. Using a second independent model gives genuine second-opinion coverage. The two models are from different providers where possible to maximise independence of their failure modes.',
        tradeoff: 'Doubles the LLM API cost per document and adds processing time for the second model pass. Mitigated by batching: both models process the document text in the same session without re-running OCR. The reliability improvement justifies the cost for enterprise extraction where data accuracy directly impacts downstream systems.',
      },
      {
        decision: 'Pydantic schema validation as a hard gate — not optional, not configurable off',
        rationale: 'Making schema validation optional (or configurable) means operators will disable it under time pressure, defeating the purpose. LLMs produce inconsistently-typed responses even with strong prompts. Silent schema violations corrupting the output store are harder to debug and costlier to fix than noisy validation failures during processing.',
        tradeoff: 'Records with consistently malformed LLM responses pile up in the human review queue rather than flowing through automatically. In practice, corrective retry prompts resolve the majority of failures, and the review queue catches genuine hard cases that benefit from human judgment.',
      },
    ],

    lessonsLearned: [
      'Schema validation is non-negotiable in production LLM pipelines. Every time I considered making it optional for convenience, I was trading short-term ease for long-term data quality debt.',
      'OCR quality is the true bottleneck in document extraction pipelines — if the text going into the LLM is garbled, no amount of prompt engineering can fix it. Investing time in preprocessing quality pays dividends across the entire pipeline.',
      'Preserving reading order in multi-column documents is a prerequisite for accurate attribute association. Getting this wrong silently mixes unrelated attributes and produces plausible-looking but wrong output.',
    ],
  },

  // ──────────────────────────────────────────────────────────

  'enterprise-audit-ai': {
    role: 'Enterprise Audit AI',
    company: 'Audit Automation System',
    tagline: 'Intelligent audit automation that processes large Excel datasets with deterministic rule validation and AI contextual error detection, producing annotated corrected files and a full PostgreSQL audit trail.',
    gradient: 'linear-gradient(135deg, #4A148C 0%, #6d28d9 100%)',
    tech: ['Python', 'OpenPyXL', 'LLMs', 'FastAPI', 'PostgreSQL', 'Pandas'],

    overview:
      'Built an enterprise audit automation system that replaces manual Excel review. The system ingests large Excel files, applies rule-based validation and AI-driven contextual error detection, annotates all findings with row and column coordinates, generates a cleaned version of the file with error highlighting, and writes a full audit trail to PostgreSQL. Finance teams receive both the cleaned file and a compliance-ready report without any manual review steps.',

    problem:
      'Enterprise finance teams received large Excel datasets from internal departments and external vendors requiring careful validation before use. Each file could contain hundreds of rows with structural errors (wrong formats, missing values, out-of-range numbers) and contextual errors (plausible-but-wrong values that rules cannot catch). Reviewing these files manually took days per file and introduced human error into the audit trail itself.',

    architectureDiagram:
`Excel File Upload
          │
          ▼
┌─────────────────────┐
│  FastAPI Endpoint   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  OpenPyXL Parser    │
│  (sheets, cells,    │
│   merged cells)     │
└──────────┬──────────┘
           │ in-memory model
           ▼
┌─────────────────────┐
│  Rule-Based         │
│  Validator          │
│  (types, ranges,    │
│   required fields,  │
│   cross-column)     │
└──────────┬──────────┘
           │ structural errors
           ▼
┌─────────────────────┐
│  LLM Error Detector │
│  (row batches +     │
│   domain prompt)    │
└──────────┬──────────┘
           │ contextual errors
           ▼
┌─────────────────────┐
│  Error Dedup +      │
│  Annotation         │
└──────┬──────────────┘
       │
       ├──► Cleaned Excel
       │    (highlighted error cells
       │     + summary sheet)
       │
       ├──► PostgreSQL Audit Record
       │    (file hash, errors, timestamp)
       │
       └──► PDF/Excel Export`,

    sections: [
      {
        title: 'Two-Layer Validation Architecture',
        content: [
          'Layer 1 — Rule-Based Validator: fast, deterministic checks for required fields, data types, value ranges, date formats, and cross-column constraints (e.g., "end date must be after start date")',
          'Layer 2 — LLM Error Detector: sends row batches to the model with a domain-specific audit prompt; returns contextual error annotations with field names, descriptions, and severity levels',
          'Error deduplication: rules and LLM may flag the same cell — deduplicated before annotation to avoid duplicate report entries',
          'All findings annotated with source row number, column name, detected error type, severity, and which validation layer found it',
        ],
      },
      {
        title: 'Rule-Based Validation',
        content:
          'The first validation layer is deterministic and fast. It checks every cell against a configurable rule set: required fields must not be blank, numeric columns must fall within defined ranges, date fields must match expected formats, and cross-column constraints (like "end date must be after start date") are enforced. This catches obvious structural errors instantly before the more expensive AI layer runs. The rule set is defined per-dataset type in a YAML configuration file.',
      },
      {
        title: 'AI Contextual Error Detection',
        content:
          'The second validation layer sends row batches to an LLM with the column definitions and a prompt describing what constitutes a valid record for this specific dataset. The model returns error annotations with field names, detected issue descriptions, and severity levels. This catches contextual errors that rules cannot express: a financial figure technically in-range but implausibly large given the other values in the row, or a vendor name that does not match the established naming convention for that dataset.',
      },
      {
        title: 'Automated Cleaning and Reporting',
        content:
          'After validation, the system generates a cleaned Excel file using OpenPyXL. Error cells receive conditional formatting highlighting, and a new summary sheet lists all findings by severity and row number. A separate audit record is written to PostgreSQL capturing the original file hash, all detected errors, the cleaning actions taken, and a timestamp. Finance teams receive both the cleaned file and a full audit trail that satisfies compliance requirements for change documentation.',
      },
    ],

    challenges: [
      {
        challenge: 'LLM contextual errors overlapping with rule-based errors on the same cell',
        solution: 'Early versions produced duplicate error annotations when both the rule validator and the LLM flagged the same cell for different reasons. Added a deduplication pass that groups findings by row and column before annotation, and merges overlapping findings into a single entry with all detected issues listed. The annotation distinguishes which layer found the error — useful for understanding whether it is a structural issue (rules) or a semantic one (LLM).',
      },
      {
        challenge: 'LLM row batching — optimal batch size without token overflow',
        solution: 'Sending all rows to the LLM at once exceeds token limits for large files. Sending one row at a time is too expensive. Implemented adaptive batching: rows are batched by an estimated token count based on column count and average cell width. If a batch would exceed the model\'s context limit, it is split. This keeps API calls manageable while processing all rows.',
      },
      {
        challenge: 'OpenPyXL merged cell handling breaking row iteration',
        solution: 'Excel files from enterprise systems frequently use merged cells in headers and data rows. OpenPyXL\'s standard row iterator skips merged cells, causing column misalignment in the internal model. Added an unmerge pass before validation that expands all merged regions and fills each constituent cell with the original value, producing a clean unambiguous row-column matrix for validation.',
      },
    ],

    decisions: [
      {
        decision: 'Rule-based validation as Layer 1, LLM as Layer 2 — not the reverse',
        rationale: 'Rules catch structural errors instantly and cheaply. Running the LLM on rows that already have obvious structural errors (missing required fields, wrong types) wastes tokens and produces noise in the LLM output — the model gets distracted by format errors when it should be looking for semantic anomalies. Running rules first filters out structural problems so the LLM can focus on contextual analysis.',
        tradeoff: 'Rows that fail rule validation do not get LLM analysis. In practice this is acceptable — a row with a missing required field cannot be meaningfully analysed for contextual errors until the structural problem is fixed.',
      },
      {
        decision: 'PostgreSQL audit trail as a hard requirement, not just a file output',
        rationale: 'A file-based audit output is mutable — it can be overwritten, lost, or accidentally modified. The enterprise compliance context requires an immutable, queryable record of what was found, when, and in which file. PostgreSQL provides this with full SQL queryability, allowing compliance teams to search audit history by file, date, error type, or severity.',
        tradeoff: 'Added a database dependency to the deployment. A file-only output would have been simpler to deploy. For compliance contexts, this tradeoff is non-negotiable.',
      },
    ],

    lessonsLearned: [
      'Rules catch syntax errors; LLMs catch semantic errors. Both layers are necessary — one cannot replace the other. Rules are fast and precise on structural violations; LLMs surface contextual anomalies that no rule could have been written to catch.',
      'Merged cell handling is the most common source of silent correctness bugs when parsing Excel files from enterprise systems. Unmerging before any other processing prevents an entire class of column misalignment errors.',
      'Adaptive batching for LLM calls is worth implementing upfront. Fixed batch sizes invariably hit edge cases with large or unusually wide spreadsheets. Token estimation is imprecise but good enough to prevent overflow.',
    ],
  },

  // ──────────────────────────────────────────────────────────

  'gemma-fine-tuning': {
    role: 'Gemma Fine-Tuning',
    company: 'LLM Pipeline',
    tagline: 'End-to-end fine-tuning pipeline for Google Gemma using LoRA/PEFT on domain-specific datasets, trained on Colab A100, deployed to Hugging Face Hub with a FastAPI inference endpoint.',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #16a34a 100%)',
    tech: ['Python', 'Google Gemma', 'LoRA', 'PEFT', 'Hugging Face Transformers', 'Google Colab A100', 'FastAPI', 'bitsandbytes'],

    overview:
      'Built a complete fine-tuning pipeline for Google Gemma language models targeting domain-specific tasks. The pipeline handles dataset curation and preprocessing, LoRA adapter configuration, training on Colab A100 with mixed-precision, validation monitoring, adapter merging, upload to Hugging Face Hub, and deployment as a FastAPI inference service. The fine-tuned model produces more consistent and domain-appropriate outputs than the base Gemma model on the target task.',

    problem:
      'Base language models respond well to general queries but produce inconsistent results on domain-specific tasks where precise terminology, specific output formats, and handling of domain edge cases are required. A fine-tuned model that has learned the domain vocabulary and expected output structure eliminates the need for increasingly complex prompt engineering — the model\'s base behaviour becomes aligned with the task requirements.',

    architectureDiagram:
`Raw Dataset
(domain-specific text)
     │
     ▼
Data Curation + Preprocessing
(instruction-response pair format)
     │
     ▼
Tokenisation + Train/Val Split
(sequence length analysis)
     │
     ▼
LoRA Configuration
┌─────────────────────────┐
│  rank (r): tuned        │
│  alpha: tuned           │
│  target modules:        │
│    q_proj, v_proj       │
│  dropout: set           │
└─────────────────────────┘
     │
     ▼
Training — Google Colab A100
┌─────────────────────────┐
│  bf16 mixed precision   │
│  gradient checkpointing │
│  per-step logging       │
│  checkpoint saves       │
└─────────────────────────┘
     │
     ├── loss curve check → early stop if overfitting
     │
     ▼
Evaluation (validation set)
Domain-specific metrics
     │
     ▼
LoRA Adapter → Merge into base weights
     │
     ▼
Push to Hugging Face Hub
(private repository)
     │
     ▼
FastAPI Inference Endpoint
(serves merged model for production)`,

    sections: [
      {
        title: 'Fine-Tuning Pipeline Steps',
        content: [
          'Dataset collection: assembled instruction-response pairs covering the target domain tasks',
          'Data preprocessing: tokenisation, sequence length analysis, and train/validation split with stratified sampling',
          'LoRA configuration: rank, alpha, target modules (q_proj, v_proj), and dropout set through systematic experimentation',
          'Training on Google Colab A100 (40GB VRAM) with bfloat16 mixed-precision and gradient checkpointing enabled',
          'Loss curve monitoring: training checkpoints saved every N steps so training can resume without losing progress',
          'Evaluation against a held-out validation set with domain-specific metrics measuring improvement over the base model',
          'LoRA adapter merged into the base Gemma weights after convergence',
          'Merged model pushed to Hugging Face Hub as a private repository',
          'FastAPI inference endpoint deployed, wrapping the model with configurable temperature, max_tokens, and sampling parameters',
        ],
      },
      {
        title: 'LoRA Fine-Tuning Approach',
        content:
          'Low-Rank Adaptation (LoRA) was chosen over full fine-tuning for efficiency. LoRA freezes the original model weights and trains small adapter matrices added to the attention layers. This reduces GPU memory requirements dramatically — making A100 training practical for a large model — while achieving comparable results to full fine-tuning on domain-specific tasks. The rank (r) and alpha values were tuned through experimentation to balance adaptation strength against catastrophic forgetting of general capabilities.',
      },
      {
        title: 'Training on Google Colab A100',
        content:
          'Training ran on a Google Colab A100 (40GB VRAM) instance. Bfloat16 mixed-precision kept memory usage manageable while maintaining numerical stability — bfloat16 is preferred over float16 for fine-tuning because it preserves the dynamic range needed for gradient updates. Gradient checkpointing was enabled to fit longer sequences without VRAM overflow. Training progress was logged per step, with checkpoint saves so training could resume after the Colab session timeout without losing progress.',
      },
      {
        title: 'Hugging Face Hub Deployment',
        content:
          'After training, the LoRA adapter was merged into the base Gemma weights and the resulting model was pushed to Hugging Face Hub as a private repository. A FastAPI inference service wraps the model, loading it once at startup and serving inference requests through a REST endpoint. The endpoint accepts a prompt and returns the model\'s generated response, with configurable parameters for temperature, max_tokens, and sampling strategy to support different use case requirements.',
      },
    ],

    challenges: [
      {
        challenge: 'Catastrophic forgetting of general capabilities during fine-tuning',
        solution: 'High-rank LoRA with aggressive learning rates caused the model to over-specialise and lose general instruction-following ability. Tuned down the LoRA rank and alpha to reduce the adapter\'s influence on the base weights. Validation set included both domain-specific tasks and general capability checks — training was stopped when domain metrics improved but general capability remained stable, not when loss hit its minimum.',
      },
      {
        challenge: 'Colab session timeouts interrupting long training runs',
        solution: 'Colab sessions terminate after a fixed period, losing training state. Enabled checkpoint saves every N steps to Google Drive. If the session terminates, training resumes from the last checkpoint. The training script detects an existing checkpoint on startup and resumes from there automatically.',
      },
      {
        challenge: 'Selecting LoRA target modules — which attention layers to adapt',
        solution: 'Initially targeted only q_proj (query projections). Adding v_proj (value projections) alongside q_proj improved adaptation quality on domain tasks without meaningfully increasing the number of trainable parameters. Systematically tested different module combinations and measured validation performance on the domain task for each, selecting the configuration with the best domain improvement / parameter count tradeoff.',
      },
    ],

    decisions: [
      {
        decision: 'LoRA over full fine-tuning',
        rationale: 'Full fine-tuning of a large model like Gemma requires far more VRAM than a Colab A100 can provide, plus the full model weights must be stored, versioned, and served. LoRA adapters are a fraction of the size — only the adapter weights change during training, and the base model can be shared. For domain adaptation tasks, LoRA achieves comparable performance to full fine-tuning at a fraction of the cost.',
        tradeoff: 'LoRA adapters require the base model to be loaded at inference time alongside the adapter weights. For very large deployment-at-scale scenarios, this could be a concern. For a single inference endpoint, the merged model approach (merge adapter into base before deployment) eliminates this overhead at the cost of producing a full-size model file.',
      },
      {
        decision: 'Bfloat16 mixed precision over Float16 for training',
        rationale: 'bfloat16 has the same range as float32 but with lower precision, making it more numerically stable for gradient updates than float16 (which has smaller range and can overflow on large gradients). The A100 GPU has native bfloat16 support with no performance penalty. Using bfloat16 consistently avoids gradient overflow issues that can cause training to diverge on longer runs.',
        tradeoff: 'bfloat16 has less precision than float16 for very small values, which could theoretically affect training in edge cases. In practice, for Gemma fine-tuning this tradeoff is universally accepted — the stability benefit outweighs the theoretical precision reduction.',
      },
    ],

    lessonsLearned: [
      'LoRA rank is a critical hyperparameter — too low and the adapter underfits; too high and the adapter overwrites general capabilities. There is no universal optimal rank; it must be tuned per-task through validation metrics, not just training loss.',
      'Checkpoint saves to persistent storage are not optional for Colab training — they are mandatory. A training run without checkpoints is a run that will need to restart from scratch when the session times out.',
      'Monitoring general capability alongside domain metrics during training prevents the silent collapse where the model becomes good at the target task but loses its ability to follow instructions reliably — which makes deployment unpredictable.',
    ],
  },

  // ──────────────────────────────────────────────────────────

  'ai-chrome-extension': {
    role: 'AI Chrome Extension',
    company: 'Browser AI Tool',
    tagline: 'Chrome extension (Manifest V3) for AI-powered product attribute extraction from any e-commerce page, with JSON schema validation, corrective retry logic, and chrome.storage.local session history.',
    gradient: 'linear-gradient(135deg, #006064 0%, #0891b2 100%)',
    tech: ['JavaScript', 'Chrome Extension API', 'Manifest V3', 'LLMs', 'JSON Schema', 'chrome.storage.local'],

    overview:
      'Built a Chrome browser extension that extracts structured product attributes from any e-commerce product page using an AI model. The extension captures page content, sends it to an LLM with a structured extraction prompt and JSON schema, validates the returned JSON, and presents the clean data in the extension popup. Session history is persisted to chrome.storage.local. Results can be exported as CSV.',

    problem:
      'E-commerce product managers and procurement teams manually copy product specifications from supplier websites into their systems. A single product can have dozens of attributes scattered across page sections, tabs, and specification tables. This manual process consumes significant time per product and introduces transcription errors that are costly to find and correct downstream.',

    architectureDiagram:
`Browser Tab (Product Page)
          │
          │  user clicks extension icon
          ▼
┌─────────────────────┐
│  Content Script     │
│  (DOM + text capture│
│   + key HTML)       │
└──────────┬──────────┘
           │ message pass
           ▼
┌─────────────────────┐
│  Background         │ ◄── Manifest V3 Service Worker
│  Service Worker     │     (unrestricted network context)
└──────────┬──────────┘
           │ API call
           ▼
┌─────────────────────┐
│  LLM API            │
│  (extraction prompt │
│   + JSON schema)    │
└──────────┬──────────┘
           │ JSON response
           ▼
┌─────────────────────┐
│  JSON Schema        │
│  Validator          │
└──────┬──────────────┘
       │               │
       ▼               ▼
  Valid →         Invalid →
  chrome.storage  corrective retry
  .local          prompt to LLM
       │               │
       └───────┬────────┘
               ▼
        Popup UI display
        + CSV Export`,

    sections: [
      {
        title: 'Extension Architecture',
        content: [
          'Manifest V3 extension with a service worker background script',
          'Content script injected into the active tab to capture page DOM and visible text',
          'Background service worker handles all LLM API calls outside the page context — bypasses page CSP restrictions',
          'Popup UI renders the extracted attribute results and provides copy/export controls',
          'Storage module saves results to chrome.storage.local for session persistence across popup open/close',
        ],
      },
      {
        title: 'AI Extraction Workflow',
        content:
          'When the user clicks the extension icon, the content script serialises the visible page text and key HTML structure (headings, tables, specification lists) and sends it to the background service worker via Chrome runtime message passing. The worker builds a structured extraction prompt that includes the page content and a JSON schema defining the expected attribute fields. The LLM receives this prompt and returns a JSON object. The worker validates the response against the schema before sending it to the popup for display.',
      },
      {
        title: 'JSON Schema Validation with Corrective Retry',
        content:
          'Every extraction response is validated against a product attribute JSON schema before being stored or displayed. The schema defines required fields, data types, and expected value formats. If the LLM returns a malformed response — wrong type, missing required field, unexpected nesting — the extension rejects it and retries with a corrective prompt that names the specific failing field and the expected format. This corrective approach resolves most failures on the second attempt.',
      },
      {
        title: 'Cross-Site Compatibility',
        content:
          'Product pages vary enormously — structured specification tables, prose descriptions with embedded specs, multi-tab layouts, and varying attribute naming conventions. The extraction prompt instructs the model to search the entire captured page content for each attribute rather than assuming a fixed location. This makes the extension work across arbitrary supplier and manufacturer websites without per-site configuration.',
      },
    ],

    challenges: [
      {
        challenge: 'Content script API calls blocked by page Content Security Policy',
        solution: 'Many supplier and manufacturer websites enforce strict CSPs that block cross-origin fetch requests from scripts running in the page context. Moving all LLM API calls to the background service worker (which has its own network context, not subject to the page CSP) eliminates this class of failures entirely. Content scripts only capture page content and pass it to the service worker via message passing.',
      },
      {
        challenge: 'Generic retry prompts producing the same schema errors',
        solution: 'A neutral "please try again" retry prompt fails when the model has a systematic misunderstanding about a specific field\'s expected type or format. Changed the retry prompt to include the exact JSON Schema validation error message and the expected format for the failing field. Example: "The \'price\' field must be a string like \'$29.99\', not a number. Please return the corrected JSON with this field as a string." Specific corrective prompts resolve failures that generic retries cannot.',
      },
    ],

    decisions: [
      {
        decision: 'Background service worker for all API calls — never content scripts',
        rationale: 'Content scripts run inside the page\'s browsing context and are subject to the page\'s Content Security Policy. Pages with strict CSPs (many enterprise and manufacturer websites) block external fetch requests from content scripts. Service workers have their own unrestricted network context — moving all API calls there makes the extension work on any website regardless of its CSP configuration.',
        tradeoff: 'Requires message passing between content script and service worker, adding a communication layer and slight latency overhead. A two-way message channel is more code to maintain than a direct fetch in the content script, but it is the only reliable approach across all websites.',
      },
      {
        decision: 'Mandatory JSON schema validation on every LLM response',
        rationale: 'LLMs produce inconsistently-typed responses. Without validation, the popup UI would silently display wrong data types (a number where the user expects a string with units, a missing field displayed as undefined). Making validation mandatory means the user either sees clean, correct data or gets an explicit error — no silent presentation of malformed results.',
        tradeoff: 'Adds a retry loop on validation failure, increasing extraction latency when the model produces a malformed response. The corrective retry prompt resolves most failures on the first retry. The tradeoff is explicitly preferable to silently showing the user incorrect data.',
      },
    ],

    lessonsLearned: [
      'Content script CSP incompatibility is the most common source of silent failures in Chrome extensions that make external API calls. Designing the extension so content scripts only touch the DOM — and the service worker owns all network operations — eliminates an entire class of site-specific bugs.',
      'Corrective retry prompts that specify exactly which field failed and what format is expected are dramatically more effective than neutral retries. The model knows what it got wrong and can fix the specific field, rather than regenerating a complete response and potentially fixing the wrong thing.',
    ],
  },

  // ──────────────────────────────────────────────────────────

  'trading-ai-platform': {
    role: 'Trading AI Platform',
    company: 'Market Intelligence Tool',
    tagline: 'Multi-site trading intelligence platform with per-site data collectors, unified schema normalisation, AI pattern detection, cross-platform signal correlation, and a WebSocket-connected React dashboard for real-time signal delivery.',
    gradient: 'linear-gradient(135deg, #E65100 0%, #ea580c 100%)',
    tech: ['Python', 'FastAPI', 'React', 'TypeScript', 'WebSocket', 'AI/ML', 'PostgreSQL'],

    overview:
      'Built a full-stack trading intelligence platform that aggregates market data from multiple trading platforms simultaneously, runs AI-powered pattern detection across all feeds, correlates detections that appear across multiple platforms, and delivers ranked signals through a WebSocket-connected React dashboard. The platform gives traders a single interface for multi-market analysis without manually monitoring each platform.',

    problem:
      'Active traders monitor multiple trading platforms, each with its own interface and data format. Detecting the same pattern appearing across multiple platforms simultaneously is especially significant — it signals broad market agreement — but it is impossible to spot manually when switching between tabs. A unified system that aggregates, analyses, and surfaces these correlated signals automatically removes the cognitive load of multi-platform monitoring.',

    architectureDiagram:
`Multiple Trading Platforms
     │
     ▼
Per-Site Python Data Collectors
┌─────────────────────────────┐
│  Site A Collector           │
│  Site B Collector           │
│  Site C Collector           │
│  (each handles site-specific│
│   API or scraping format)   │
└─────────────┬───────────────┘
              │ normalised OHLCV
              ▼
┌─────────────────────────┐
│  Unified Internal Queue │
│  (standardised schema)  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  AI Pattern Detection   │
│  Engine                 │
│  (candlestick, MA cross,│
│   volume spikes)        │
└──────────┬──────────────┘
           │ per-site detections
           ▼
┌─────────────────────────┐
│  Signal Aggregator      │
│  (cross-platform        │
│   correlation + ranking)│
└──────────┬──────────────┘
           │ ranked signals
           ▼
┌─────────────────────────┐
│  FastAPI WebSocket      │
│  Server                 │
└──────────┬──────────────┘
           │ push on new signal
           ▼
┌─────────────────────────┐
│  React Dashboard        │
│  (live signal cards,    │
│   filtering)            │
└──────────┬──────────────┘
           │ historical load
           ▼
┌─────────────────────────┐
│  PostgreSQL             │
│  (signal history,       │
│   backtesting)          │
└─────────────────────────┘`,

    sections: [
      {
        title: 'System Architecture',
        content: [
          'Per-site Python data collector modules fetch and normalise market data from each trading platform',
          'Normalisation layer maps each site\'s data format into a unified internal schema: symbol, timeframe, OHLCV values, volume, timestamp',
          'AI pattern detection engine processes normalised feeds in real time across all active sites',
          'Signal aggregator collects pattern detections across all sites and ranks them: detections appearing on multiple sites simultaneously are elevated to high priority',
          'FastAPI server maintains WebSocket connections and pushes signals to connected React clients',
          'React frontend renders live signal cards that update in real time without polling',
          'PostgreSQL stores historical signal data for backtesting and performance review',
        ],
      },
      {
        title: 'Per-Site Adapter Pattern',
        content:
          'Each supported trading platform has a dedicated Python collector module that implements a shared interface. Collectors handle the platform-specific API format or data layout and output normalised records into a shared internal queue. New platforms can be added by implementing the collector interface without changing any other part of the system. This keeps the aggregation layer extensible as the number of monitored sites grows, and isolates platform-specific failure modes to individual collector modules.',
      },
      {
        title: 'Cross-Platform Signal Correlation',
        content:
          'The signal aggregator cross-references detections by symbol, timeframe, and pattern type across all active collectors. When the same pattern is detected for the same symbol on multiple platforms within the same timeframe, the aggregator creates a correlated signal and elevates its priority rank. Correlated signals indicate broad market agreement on the pattern — they are surface prominently in the dashboard with a multi-platform indicator.',
      },
      {
        title: 'WebSocket Real-Time Dashboard',
        content:
          'The FastAPI backend maintains persistent WebSocket connections with all connected React clients. New signals are broadcast immediately to all connected clients without polling. The React dashboard renders live signal cards that update in real time. Historical signals are loaded from PostgreSQL on initial page load so the dashboard is useful immediately, even before new signals arrive. Users can filter by platform, symbol, timeframe, and signal type.',
      },
    ],

    challenges: [
      {
        challenge: 'Normalising inconsistent data formats across multiple trading platforms',
        solution: 'Each trading platform uses different field names, timestamp formats, OHLCV ordering, and volume units. A rigid normalisation schema upfront would require rewriting all collectors whenever any platform changes. Built a per-collector normalisation function that maps the site\'s native format to the internal schema in one isolated place — changes to a site\'s format require changes only to that site\'s collector, not to the detection engine or aggregator.',
      },
      {
        challenge: 'WebSocket connection management under multiple concurrent clients',
        solution: 'Early WebSocket handling stored all connections in a simple list. Disconnected clients left stale references that caused errors when broadcasting. Replaced the list with a connection registry that removes clients on disconnect events and handles clean shutdown. Broadcasting iterates only active connections and catches individual send failures without taking down the broadcast for all other clients.',
      },
    ],

    decisions: [
      {
        decision: 'Per-site adapter modules over a monolithic multi-site scraper',
        rationale: 'A monolithic scraper for all platforms would be a single point of failure — one site changing its format breaks all data collection. Per-site adapters isolate failures: if Site A changes its API, only the Site A adapter needs updating. Other sites continue operating. The adapter interface makes adding new sites straightforward without understanding the full system.',
        tradeoff: 'More files to maintain (one adapter per site). Offset by the much simpler debugging and update cycle — a site adapter change can be tested in isolation before deployment.',
      },
      {
        decision: 'WebSocket push over REST polling for signal delivery',
        rationale: 'Trading signals have time value — a pattern detected on a live candle is less valuable if the user sees it 30 seconds later during the next polling cycle. WebSocket push delivers signals to the dashboard instantly when they are generated, with no polling overhead and no polling-induced delay. For a real-time signal tool, push is architecturally correct.',
        tradeoff: 'WebSocket connections require more careful lifecycle management than REST — handling reconnection on disconnect, managing connection state, and ensuring clean teardown. The client-side reconnection logic adds complexity to the React dashboard. For a time-sensitive use case, this complexity is worth the instant delivery benefit.',
      },
    ],

    lessonsLearned: [
      'The adapter pattern was the right architectural choice. When one trading platform changed its data format midway through development, updating only the single adapter module took 20 minutes. A monolithic scraper would have required understanding and rewriting entangled logic across the entire data pipeline.',
      'Cross-platform signal correlation turned out to be the highest-value feature — not the individual pattern detection. Users consistently cited multi-platform agreement signals as the ones they acted on. The correlation layer was added after initial development based on user feedback, and it changed the tool\'s primary value proposition.',
      'WebSocket connection state management is more complex than it appears. Stale connection references, reconnection on network interruption, and graceful shutdown all require explicit handling. Build this correctly from the start — retrofitting clean connection lifecycle management is more disruptive than getting it right upfront.',
    ],
  },

  // ──────────────────────────────────────────────────────────

  'pdf-cad-ai-extractor': {
    role: 'PDF + CAD AI Extractor',
    company: 'Document AI System',
    tagline: 'Engineering document processor that uses a custom YOLO model for region detection in CAD drawings, Tesseract OCR with region-specific preprocessing per detected region, and an AI structuring layer for JSON output.',
    gradient: 'linear-gradient(135deg, #880E4F 0%, #be185d 100%)',
    tech: ['Python', 'YOLO (Ultralytics)', 'Tesseract OCR', 'OpenCV', 'PDF.js', 'FastAPI'],

    overview:
      'Built a specialised document processing system for engineering firms. The system ingests engineering PDFs and CAD drawing exports, uses a custom YOLO object detection model to identify structural regions within each drawing (title blocks, revision tables, parts lists, dimension annotations), extracts text from each detected region with region-specific OCR preprocessing, and structures the output into JSON records for downstream integration.',

    problem:
      'Engineering firms archive large volumes of CAD drawings and technical PDFs containing critical specifications: part numbers, tolerances, material grades, revision notes, and dimensional values. These documents have complex visual layouts that standard PDF text extractors and general-purpose OCR cannot handle — title blocks, revision history tables, dimension annotation callouts, and parts lists in varying positions and orientations. A layout-aware system that understands the visual structure of engineering drawings was needed.',

    architectureDiagram:
`Engineering Document Upload
(PDF / CAD image export)
          │
          ▼
┌─────────────────────┐
│  File Type Detector │
└────┬────────────────┘
     │               │
     ▼               ▼
  PDF path      CAD image path
PDF.js render   direct to YOLO
to high-res img
     │               │
     └───────┬────────┘
             │ high-resolution image
             ▼
┌─────────────────────────┐
│  YOLO Region Detector   │
│  (custom-trained model) │
│  Detects:               │
│  - title block          │
│  - revision table       │
│  - parts list           │
│  - dimension callouts   │
└──────────┬──────────────┘
           │ region crops + labels
           ▼
┌─────────────────────────┐
│  Region-Specific        │
│  OCR Preprocessing      │
│  (contrast, deskew,     │
│   PSM per region type)  │
└──────────┬──────────────┘
           │ preprocessed crops
           ▼
┌─────────────────────────┐
│  Tesseract OCR          │
│  (per-region, PSM-tuned)│
└──────────┬──────────────┘
           │ labelled raw text
           ▼
┌─────────────────────────┐
│  AI Structuring Layer   │
│  (text → JSON schema)   │
└──────────┬──────────────┘
           │ part number, material,
           │ revision, tolerance, etc.
           ▼
┌─────────────────────────┐
│  FastAPI Response       │
│  (JSON + provenance)    │
└─────────────────────────┘`,

    sections: [
      {
        title: 'Processing Pipeline',
        content: [
          'File upload via FastAPI endpoint — accepts PDF and common CAD export formats (DXF rendered to image, DWG-rendered images)',
          'File type detection routes the document to the appropriate preprocessing path',
          'PDF.js renders each page to a high-resolution image for consistent YOLO input',
          'Custom YOLO model detects and localises structural regions in the engineering drawing',
          'Each detected region is cropped from the full image and fed to Tesseract with region-specific preprocessing',
          'OCR output from each region is labelled with the region type and combined',
          'AI structuring layer maps labelled region text to the target JSON schema — handling engineering notation and abbreviations',
          'Validated JSON record returned via the API with field provenance (which region each value came from)',
        ],
      },
      {
        title: 'YOLO Region Detection',
        content:
          'The core challenge of engineering document processing is knowing which visual area contains what type of information. A custom YOLO model was trained on engineering drawing samples to detect standard regions: the title block (containing document number, revision, date, and project name), revision history tables, parts lists, and dimension callout zones. Once regions are localised, OCR runs on each isolated crop rather than the full drawing — this dramatically improves accuracy by eliminating background noise from the rest of the drawing.',
      },
      {
        title: 'Region-Specific OCR Preprocessing',
        content:
          'Engineering drawings present OCR challenges: small text sizes, varied fonts, rotated dimension annotations, and low-contrast backgrounds. Each detected region receives preprocessing tailored to its characteristics: contrast enhancement for title blocks, deskewing for rotated dimension text, and threshold adjustment for low-contrast areas. Tesseract is configured with the PSM (page segmentation mode) appropriate for each region type — single-line mode for titles, sparse text mode for dimension callouts, and block mode for tabular revision histories.',
      },
      {
        title: 'AI Structuring Layer',
        content:
          'After OCR, raw text from each region is labelled with its source region type (title block, revision row 3, parts list row 7). An AI structuring step maps this labelled text to the target JSON schema fields — part number, material, revision, drawing number, tolerance, date, and so on. The model handles abbreviations and engineering notation common in technical drawings: "SS 316L" becomes "Stainless Steel 316L", "±0.05" is preserved in its standard engineering format, and "Rev C" maps to the revision field.',
      },
    ],

    challenges: [
      {
        challenge: 'YOLO region detection quality directly determines OCR quality',
        solution: 'If YOLO localises a region boundary incorrectly — cutting off text or including irrelevant background — OCR produces garbage output regardless of the preprocessing quality. Invested significant time on YOLO training data quality and annotation precision. Added a confidence threshold below which regions are not processed but are instead logged as uncertain and flagged for human review. Low-confidence detections that proceed to OCR produce worse output than skipping them.',
      },
      {
        challenge: 'Tesseract PSM mode selection across diverse region types',
        solution: 'Using the same PSM mode for all regions produces poor results — block segmentation mode works well for tabular revision histories but fails on single-line title fields where it misinterprets the single line as a block with word fragments. Built a region-type-to-PSM mapping table that selects the appropriate Tesseract configuration for each detected region type. The correct PSM selection improved extraction accuracy on title block fields significantly.',
      },
      {
        challenge: 'AI structuring layer handling engineering abbreviation variations',
        solution: 'Engineering drawings use many domain abbreviations that vary by company standard and era: "Mat\'l" vs "Material", "Rev" vs "Revision" vs "Rev.", "Tol" vs "Tolerance". A rule-based mapper could not cover all variants. The AI structuring layer prompt includes the expected JSON field names and a set of common abbreviation examples for the target domain, allowing the model to normalise variants it has not explicitly seen by generalising from the examples.',
      },
    ],

    decisions: [
      {
        decision: 'YOLO region detection before OCR rather than running OCR on the full drawing',
        rationale: 'Full-drawing OCR on engineering drawings produces an unstructured text dump that the AI must then parse without knowing where each text element came from. YOLO region detection first produces labelled regions — the AI receives text with its source location and region type already annotated. This gives the structuring layer the context it needs to map raw text to the correct output fields with high confidence.',
        tradeoff: 'Requires a custom YOLO model trained on engineering drawings, which requires annotation effort and training time. For a general-purpose document, full-page OCR would be faster to implement. For engineering drawings with consistent visual structure, the region detection investment pays off in dramatically better structuring accuracy.',
      },
      {
        decision: 'JSON output includes field provenance (source region for each extracted value)',
        rationale: 'When the extraction is wrong, engineers need to know which part of the drawing the incorrect value came from. Including provenance in the output (part number came from title block, revision came from revision table row 2) allows engineers to verify specific extractions quickly by looking at the source region — they do not need to re-examine the entire drawing.',
        tradeoff: 'Larger JSON output per document, and the provenance data must be maintained through the full processing pipeline. Worth the overhead for a system where verification and trust in extracted data are critical requirements.',
      },
    ],

    lessonsLearned: [
      'YOLO detection quality is the primary determinant of end-to-end extraction quality — poor region localisation cannot be compensated by better OCR preprocessing or a stronger AI structuring model. Training data quality for the YOLO model deserves as much attention as any other part of the pipeline.',
      'PSM tuning in Tesseract is not optional for engineering documents. The correct PSM for a dimension callout is different from the correct PSM for a multi-row revision table. Building a region-type-to-PSM mapping was the highest-impact single change to OCR accuracy.',
      'Field provenance in the output is not just a nice-to-have — it is essential for user trust in an automated extraction system. Engineers who can verify "this part number came from the title block" adopt automated extraction much faster than engineers who receive a JSON file with no indication of where each value originated.',
    ],
  },
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────
const SectionHeading = ({ label, title }: { label: string; title: string }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.68rem', fontWeight: 700,
      color: '#2563eb', textTransform: 'uppercase',
      letterSpacing: '1.5px', marginBottom: '4px',
    }}>
      {label}
    </div>
    <h2 style={{
      fontSize: '1.2rem', fontWeight: 800,
      color: 'var(--text)',
      borderBottom: '1px solid rgba(128,128,128,0.15)',
      paddingBottom: '0.6rem',
    }}>
      {title}
    </h2>
  </div>
)

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
}

// ──────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────
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

  const textStyle = { color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 as number | string }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── Hero Banner ── */}
      <div style={{ background: experience.gradient }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 2rem 0' }}>
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
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 2rem 3rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}
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
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '700px' }}
          >
            {experience.tagline}
          </motion.p>
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

      {/* ── Content ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>

        {/* Overview */}
        <motion.section
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label="01 — Overview" title="What I Built" />
          <p style={textStyle}>{experience.overview}</p>
        </motion.section>

        {/* Problem */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label="02 — Problem" title="The Problem It Solves" />
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px', padding: '1.5rem 1.75rem',
            borderLeft: '4px solid #2563eb',
          }}>
            <p style={{ ...textStyle, margin: 0 }}>{experience.problem}</p>
          </div>
        </motion.section>

        {/* Architecture Diagram */}
        <motion.section
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label="03 — Architecture" title="System Architecture" />
          <pre style={{
            background: '#0d1117',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            overflowX: 'auto',
            fontSize: '0.78rem',
            lineHeight: 1.7,
            color: '#c9d1d9',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            margin: 0,
          }}>
            {experience.architectureDiagram}
          </pre>
        </motion.section>

        {/* Dynamic sections */}
        {experience.sections.map((section, i) => (
          <motion.section
            key={section.title}
            custom={i + 3} variants={fadeUp} initial="hidden" animate="visible"
            style={{ marginBottom: '3rem' }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', borderBottom: '1px solid rgba(128,128,128,0.15)', paddingBottom: '0.5rem' }}>
              {section.title}
            </h2>
            {Array.isArray(section.content) ? (
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.content.map((item, j) => (
                  <li key={j} style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.93rem' }}>
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

        {/* Engineering Challenges */}
        <motion.section
          custom={experience.sections.length + 3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label={`0${experience.sections.length + 4} — Challenges`} title="Engineering Challenges" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.challenges.map((c, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px', padding: '1.25rem 1.5rem',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px', paddingTop: '2px', flexShrink: 0 }}>Problem</span>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5 }}>{c.challenge}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px', paddingTop: '2px', flexShrink: 0 }}>Solution</span>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.7 }}>{c.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Engineering Decisions */}
        <motion.section
          custom={experience.sections.length + 4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label={`0${experience.sections.length + 5} — Decisions`} title="Engineering Decisions and Trade-offs" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {experience.decisions.map((d, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px', padding: '1.5rem',
                border: '1px solid rgba(37,99,235,0.15)',
                borderTop: '3px solid #2563eb',
              }}>
                <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.93rem', marginBottom: '12px' }}>
                  {d.decision}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontFamily: "'JetBrains Mono', monospace" }}>Rationale</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>{d.rationale}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px', fontFamily: "'JetBrains Mono', monospace" }}>Trade-off</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>{d.tradeoff}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Lessons Learned */}
        <motion.section
          custom={experience.sections.length + 5} variants={fadeUp} initial="hidden" animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <SectionHeading label={`0${experience.sections.length + 6} — Retrospective`} title="Lessons Learned" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {experience.lessonsLearned.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: '22px', height: '22px',
                  background: 'rgba(37,99,235,0.15)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {i + 1}
                </span>
                <p style={{ ...textStyle, margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Back button */}
        <motion.div
          custom={experience.sections.length + 6} variants={fadeUp} initial="hidden" animate="visible"
          style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}
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
