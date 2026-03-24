# foundeV — Product Requirements Document
### Autonomous AI Development Agency — Powered by Ashwin's Vibe Development Framework
**Version:** 1.1.0 — Production Ready  
**Classification:** Internal Build Document — AI Vibe Coding Reference  
**IDE Target:** Antigravity AI IDE (VSCode + GitHub Copilot compatible)  
**Prepared for:** Full-stack production build from scratch

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Core Goals](#2-product-vision--core-goals)
3. [Complete Tech Stack](#3-complete-tech-stack)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Agent Orchestration System](#5-agent-orchestration-system)
6. [Database Schema — Complete](#6-database-schema--complete)
7. [Security Architecture](#7-security-architecture)
8. [Backend Services & API Layer](#8-backend-services--api-layer)
9. [Frontend Architecture](#9-frontend-architecture)
10. [The /docs Memory System](#10-the-docs-memory-system)
11. [GitHub Integration & CI/CD Pipeline](#11-github-integration--cicd-pipeline)
12. [Infrastructure & Deployment](#12-infrastructure--deployment)
13. [User Experience — Complete Flows](#13-user-experience--complete-flows)
14. [Real-time Communication Layer](#14-real-time-communication-layer)
15. [Database Provisioning System](#15-database-provisioning-system)
16. [Billing & Subscription System](#16-billing--subscription-system)
17. [Error Handling & Observability](#17-error-handling--observability)
18. [Environment Configuration](#18-environment-configuration)
19. [User App Deployment Service](#19-user-app-deployment-service)
20. [Notification & Email Service](#20-notification--email-service)
21. [Stalled Job Recovery System](#21-stalled-job-recovery-system)
22. [Auth Edge Cases & Account Management](#22-auth-edge-cases--account-management)
23. [LLM Cost Model & Unit Economics](#23-llm-cost-model--unit-economics)
24. [Local Development Setup](#24-local-development-setup)
25. [Non-Functional Requirements](#25-non-functional-requirements)

---

## 1. EXECUTIVE SUMMARY

The AVDF Platform is an **Autonomous AI Development Agency** — a full-stack SaaS web application that takes a user from a raw idea in natural language all the way to a live, production-deployed software product. It does this by automating Ashwin's Vibe Development Framework: a five-stage, blueprint-first, multi-agent orchestration pipeline that enforces senior-level software engineering discipline on every project.

The platform wraps multiple AI models into a single seamless workflow with zero tool-switching, zero copy-pasting, and zero architectural guesswork. The user talks to the system. The system plans, architects, phases, builds, tests, and deploys — with the human approving gates at critical checkpoints.

**What this product is NOT:**
- Not a code generator like Cursor, Copilot, or Bolt
- Not a no-code tool like Bubble or Webflow
- Not a prompt-to-website one-shot tool

**What this product IS:**
- A process governance platform that enforces blueprint-first discipline
- A multi-agent orchestration engine where each agent has a single responsibility
- A persistent memory system that solves AI context collapse at the architectural level
- A phase-locked execution environment where no step can be skipped

---

## 2. PRODUCT VISION & CORE GOALS

### Primary Goal
Transform "Idea to Production" from a chaotic, expert-only process into a reliable, repeatable, governed pipeline accessible to any technical-adjacent founder.

### The Five Framework Laws (Enforced by the Platform — Not Guidelines)
1. **Code Never Leads** — The system cannot begin code generation before Discovery, PRD, and Phases are fully locked and human-approved.
2. **Docs Are Truth** — The /docs folder is the authoritative source of all architectural decisions. Every agent reads from it before every session. Nothing overrides it.
3. **One Phase at a Time** — Phase N+1 is database-locked until Phase N passes its QA Gate. Not UI-hidden — data-layer locked.
4. **Agents Are Specialists** — Each agent has a single role and is system-prompted to refuse tasks outside it. The Discovery Agent cannot write code. The Developer Agent cannot modify the PRD.
5. **Human Approves Gates** — The human validates output and unlocks progression at five critical gates. The system proposes. The human approves. Control is preserved without requiring technical expertise.

### Target User (ICP)
- Technical-adjacent founders: understand product thinking, have shipped things before, do not want to babysit AI or pay $100k+ for an agency
- Solo developers who want a structured, agentic workflow
- Small teams building MVPs under resource constraints

---

## 3. COMPLETE TECH STACK

Every technology choice below is made with specific reasoning. The Developer Agent must understand WHY each choice was made to correctly implement it.

### 3.1 Frontend

| Layer | Technology | Version | Why |
|---|---|---|---|
| Framework | **Next.js** | 14 (App Router) | Server components reduce client bundle, built-in API routes simplify architecture, excellent SSR for SEO, Vercel-native deployment |
| Language | **TypeScript** | 5.x | Type safety is non-negotiable for a complex multi-agent orchestration product. Catches contract violations at compile time. |
| Styling | **Tailwind CSS** | 3.x | Utility-first eliminates CSS file proliferation. Consistent design tokens. No runtime style injection. |
| UI Components | **shadcn/ui** | Latest | Unstyled, accessible, copy-paste components. Not a dependency — code lives in the repo. Fully customizable. |
| State Management | **Zustand** | 4.x | Lightweight, hook-based, no boilerplate. Sufficient for local UI state. Server state handled by React Query. |
| Server State | **TanStack Query (React Query)** | 5.x | Handles API caching, background refetch, optimistic updates, and loading states. Critical for real-time project status polling. |
| Real-time UI | **Socket.io Client** | 4.x | Receives live build logs, agent status updates, and phase progression events from the backend. |
| Forms | **React Hook Form + Zod** | Latest | Schema-validated forms with TypeScript inference. Used for all user input: onboarding, settings, revision requests. |
| Code Display | **Monaco Editor (read-only)** | Latest | Display generated code files with syntax highlighting. Read-only viewer for the phase output review screen. |
| Animations | **Framer Motion** | 11.x | Agent activity animations, phase transition effects, loading states. |
| Charts | **Recharts** | 2.x | Build progress visualization, phase completion timelines. |

### 3.2 Backend

| Layer | Technology | Version | Why |
|---|---|---|---|
| Runtime | **Node.js** | 20 LTS | Long-term support, excellent async I/O for agent orchestration, massive ecosystem. |
| Framework | **Express.js** | 4.x | Minimal, battle-tested. Not NestJS because we need raw control over middleware for the orchestration layer. |
| Language | **TypeScript** | 5.x | Shared types between frontend and backend via a monorepo structure. |
| Job Queue | **BullMQ** | 4.x | Redis-backed job queue for agent task orchestration. Handles retries, delays, concurrency limits, and job dependencies. Critical infrastructure. |
| WebSockets | **Socket.io Server** | 4.x | Real-time event emission to the frontend: agent status changes, log streaming, phase completions. |
| ORM | **Prisma** | 5.x | Type-safe database access, migration management, and schema-as-code. Eliminates raw SQL errors. |
| Validation | **Zod** | 3.x | Runtime request validation at API boundaries. Shared schemas with frontend via shared package. |
| File System | **Node fs + archiver** | Native | Managing the /docs folder structure, zipping project exports. |
| Process Management | **PM2** | Latest | Production process management on server. Handles crashes, restarts, and log aggregation. |
| Testing | **Vitest** | 1.x | Fast unit tests for service layer, agent prompt chains, and orchestration logic. |
| E2E Testing | **Playwright** | Latest | End-to-end flow testing for critical user journeys. |

### 3.3 Database

| Layer | Technology | Why |
|---|---|---|
| Primary Database | **PostgreSQL 16** | Relational integrity for project data, user accounts, phase records, and audit logs. JSONB columns for flexible agent output storage. Excellent with Prisma. |
| Cache / Queue Backend | **Redis 7** | BullMQ requires Redis. Also used for session caching, rate limiting counters, and ephemeral agent context windows. |
| File Storage | **AWS S3 (or Cloudflare R2)** | Document storage for generated PRD.md, phases.md, and project archives. R2 preferred for zero egress costs. |
| Vector Store | **pgvector (PostgreSQL extension)** | Stores embeddings of project documentation for semantic similarity search. Used by the Developer Agent to find relevant sections of /docs without loading the entire context. |

### 3.4 AI / LLM Layer

| Agent | Model | Why |
|---|---|---|
| Discovery Agent | **Claude claude-sonnet-4-6** | Best conversational reasoning. Excellent at asking clarifying questions and detecting ambiguity. |
| Architect Agent | **Claude claude-opus-4-6** | Highest reasoning capability. Architecture design requires the most powerful model available. PRD quality is the foundation of everything. |
| Planner Agent | **Claude claude-sonnet-4-6** | Balanced capability for structured decomposition of PRD into phases. |
| Developer Agent | **Claude claude-sonnet-4-6** (primary) | Code generation with strong instruction-following. Reads /docs context before every code task. |
| QA Gate Agent | **Claude claude-sonnet-4-6** | Validation, test writing, and PRD contract checking. |
| Orchestrator | **Internal Logic (no LLM)** | The orchestrator is deterministic code — not AI. It reads job status from BullMQ and the database and makes routing decisions based on hard rules. No AI decides whether a phase passes or fails — that is the QA Agent's job, but the routing decision is a database query. |

**Anthropic SDK:** `@anthropic-ai/sdk` — Used for all Claude API calls. Streaming enabled for all agent outputs to support real-time display.

**LangChain:** NOT used. Direct SDK calls give more control over prompt structure, token management, and error handling. LangChain abstractions hide too much for a production-critical orchestration system.

### 3.5 Infrastructure

| Component | Technology | Why |
|---|---|---|
| Frontend Hosting | **Vercel** | Next.js native. Edge network, zero-config CI/CD, preview deployments per PR. |
| Backend Hosting | **Railway** or **Render** | Simple container-based deployment, built-in PostgreSQL and Redis, environment variable management, auto-scaling. Lower ops overhead than AWS EC2 for MVP. |
| Container | **Docker** | Backend + workers containerized. Consistent environments from dev to prod. |
| GitHub Integration | **GitHub Apps API** | Creates repos, manages branches, reads/writes files, triggers CI/CD on user's behalf. |
| DNS / CDN | **Cloudflare** | DDoS protection, SSL, and edge caching. Free tier covers MVP. |
| Monitoring | **Sentry** | Error tracking across frontend and backend. Agent failure capture with full context. |
| Logging | **Logtail (BetterStack)** | Structured log aggregation. Critical for debugging agent chains. |
| Analytics | **PostHog** | Product analytics, funnel tracking, feature flags. Self-hostable. |
| Email | **Resend** | Transactional email delivery. React Email for template rendering. Simple API, generous free tier. |

### 3.6 Monorepo Structure

The project uses a **pnpm monorepo** with the following packages:

```
/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # Express.js backend
├── packages/
│   ├── shared/       # Shared TypeScript types, Zod schemas, constants
│   ├── ai/           # All agent definitions, prompts, and LLM utilities
│   └── db/           # Prisma schema, migrations, and client
├── package.json      # Root workspace config
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo build orchestration
```

**Why monorepo:** Shared types between frontend and backend prevent API contract drift. The `packages/ai` package can be tested in isolation. `packages/shared` ensures Zod schemas are identical on both sides of every API boundary.

---

## 4. SYSTEM ARCHITECTURE OVERVIEW

### 4.1 High-Level Data Flow

```
USER (Browser)
    │
    │  HTTPS + WSS
    ▼
NEXT.JS FRONTEND (Vercel)
    │
    │  REST API calls + WebSocket connection
    ▼
EXPRESS.JS API SERVER
    │
    ├──► PostgreSQL (Prisma) — persistent state
    ├──► Redis — queue + cache
    ├──► S3/R2 — document storage
    │
    │  Job enqueue
    ▼
BULLMQ WORKER PROCESSES
    │
    ├──► Discovery Worker   → Claude Sonnet (Anthropic API)
    ├──► Architect Worker   → Claude Opus  (Anthropic API)
    ├──► Planner Worker     → Claude Sonnet (Anthropic API)
    ├──► Developer Worker   → Claude Sonnet (Anthropic API)
    └──► QA Worker          → Claude Sonnet (Anthropic API)
    │
    │  Status events (Socket.io emit)
    ▼
SOCKET.IO SERVER → FRONTEND (real-time UI updates)
    │
    ▼
GITHUB APPS API
    └──► Creates repos, writes files, manages branches, triggers CI/CD
```

### 4.2 Service Separation

The API server and the BullMQ workers are **separate processes** (but can share a container in dev). This is critical:

- The API server handles HTTP requests and WebSocket connections. It is stateless and horizontally scalable.
- The worker processes handle AI agent tasks. They are CPU/IO intensive, long-running, and must be independently scalable.
- If an agent call takes 3 minutes, it does not block the API server. The API server returns immediately after enqueuing the job.
- Workers emit real-time progress via Socket.io to keep the frontend updated.

### 4.3 Request Lifecycle Example (Discovery Phase)

1. User submits message in chat interface
2. Frontend sends `POST /api/v1/projects/:id/messages` to API server
3. API server validates the request with Zod, saves the message to PostgreSQL, returns `202 Accepted`
4. API server enqueues a `discovery:process_message` job in BullMQ
5. Worker picks up job, constructs the full conversation history from PostgreSQL
6. Worker calls Claude API with system prompt + full conversation history
7. Claude streams a response — worker emits each chunk via Socket.io to the user's room
8. When stream completes, worker saves the full response to PostgreSQL
9. Worker checks if discovery is complete (conversation length, question coverage). If complete, enqueues `discovery:generate_brief` job
10. Brief generation job runs Claude to produce structured Discovery Brief, saves to PostgreSQL and S3
11. Worker updates project status in PostgreSQL to `DISCOVERY_COMPLETE`
12. Socket.io emits `project:status_changed` event to the frontend
13. Frontend updates UI to show "Review your Discovery Brief" screen

---

## 5. AGENT ORCHESTRATION SYSTEM

### 5.1 Orchestrator Architecture

The Orchestrator is **not an AI**. It is a deterministic state machine implemented as a set of BullMQ job processors and database state checks. The Orchestrator reads project status from PostgreSQL and decides which worker to activate next. It enforces all five Framework Laws at the code level.

**Orchestrator State Machine:**

```
CREATED
  → [User starts chat] → DISCOVERY_ACTIVE
  → [Discovery complete, brief generated] → DISCOVERY_COMPLETE
  → [User approves brief] → ARCHITECTURE_QUEUED
  → [Architect agent completes PRD] → ARCHITECTURE_COMPLETE
  → [User approves PRD] → PLANNING_QUEUED
  → [Planner generates phases, repo created] → PLANNING_COMPLETE
  → [User approves phases] → DB_PROVISIONING
  → [Neon DB provisioned, credentials injected] → BUILD_ACTIVE (Phase 1)
  → [Phase N QA passes, user approves] → BUILD_ACTIVE (Phase N+1)
  → [All phases complete] → DEPLOYMENT_QUEUED
  → [Deployment succeeds] → DEPLOYED
  → [Any critical failure] → ERROR (with specific error_code)
```

Each state transition is a database write. The frontend polls `/api/v1/projects/:id/status` every 10 seconds AND receives push events via Socket.io. The dual-channel approach ensures no state is missed if a WebSocket disconnects.

**The Gate Lock:** In the database, `project.current_phase_id` is a foreign key to the `phases` table. The field `phases.status` must be `COMPLETE` before the Orchestrator will process the next phase's job. This is enforced at the database constraint level — not in application code alone.

### 5.2 Discovery Agent

**Role:** Product Manager. Maps the problem. Refuses to discuss solutions.

**System Prompt Architecture:**
```
IDENTITY: You are the Discovery Agent for the AVDF Platform. Your sole purpose is to deeply understand a user's problem and target market before any solution is discussed.

HARD RULES:
1. Never suggest technical solutions, architectures, or tech stacks in this phase.
2. Never write code.
3. Never say "you could build X" — only ask questions about the problem.
4. Continue asking questions until ALL items in REQUIRED_COVERAGE are confirmed.

REQUIRED_COVERAGE (track internally — do not show user):
- [ ] Who specifically has this problem (job title, context, situation)
- [ ] What their current workflow looks like (step by step)
- [ ] Where the pain point occurs in that workflow (the exact friction moment)
- [ ] What they have tried to solve it (existing tools, workarounds)
- [ ] Why those solutions fail them
- [ ] What a "solved" version of this problem looks like in their day
- [ ] How many people have this problem (rough scale)
- [ ] Any hard constraints (budget, compliance, geography, platform)
- [ ] What the user's own relationship to this problem is (are they the target user?)
- [ ] Monetization intent (are they building for revenue? Internal use? Personal?)

COMPLETION SIGNAL: When all REQUIRED_COVERAGE items are confirmed, output a JSON block wrapped in <discovery_complete> tags with all gathered data. Do NOT tell the user you are doing this. Continue the conversation naturally.

TONE: Warm, curious, like a smart product manager on a first discovery call. Not clinical. Not a form.
```

**Discovery Brief Generation:**
After the conversation, a second Claude call (not streaming) generates the structured Discovery Brief using the full conversation as context. This brief is saved as `discovery-brief.md` to S3 and the project record.

**Completeness Checker:**
After every agent response in the discovery phase, the worker runs a lightweight completeness check — a simple Claude call with a strict JSON output format asking: "Given this conversation, which of the 10 required coverage items are confirmed? Return a JSON array of confirmed item indices." This drives the progress indicator in the UI and determines when the transition to Architecture is triggered.

### 5.3 Architect Agent

**Role:** Senior System Architect. Takes Discovery Brief as input. Produces PRD.md.

**This is the most critical agent in the system.** The PRD it produces is the foundation that every other agent reads. Errors here propagate to every subsequent phase.

**Input Context:**
- Full discovery-brief.md (injected at start of system prompt)
- Current date, target deployment environment
- Platform constraints (what the AVDF Platform supports for CI/CD and deployment)

**System Prompt Architecture:**
```
IDENTITY: You are a Senior System Architect with 15+ years of experience building production SaaS applications. You are creating a Product Requirements Document that will be used by AI coding agents to build this product from scratch.

CRITICAL CONTEXT: This PRD will be read by an AI Developer Agent, not a human engineer. It must be:
- Extremely explicit (no assumptions)
- Self-contained (no "see standard practices" — spell everything out)
- Precise (exact table names, exact field names, exact API routes)
- Opinionated (make choices — do not leave decisions to the Developer Agent)

INPUT: You have been given the Discovery Brief for a new product. Design the complete production-ready technical architecture.

YOUR PRD MUST INCLUDE ALL OF THE FOLLOWING SECTIONS IN EXACTLY THIS ORDER:
[... full section list with exact expected format for each ...]

TECHNOLOGY SELECTION RULES:
- Always prefer widely-used, well-documented technologies
- Always specify exact versions
- Always explain WHY each technology was chosen
- Never choose bleeding-edge unproven libraries for production-critical components

OUTPUT FORMAT: A single Markdown document. No code blocks around the entire document. Use proper Markdown heading hierarchy (H1 for title, H2 for sections, H3 for subsections). All code examples must be in fenced code blocks with language tags.
```

**PRD Section Requirements (the agent is instructed to produce all of these):**
1. Product Overview (3-5 sentences)
2. Core User Flows (numbered, step by step)
3. Complete Tech Stack Table (framework, library, version, why)
4. System Architecture Diagram (in ASCII or Mermaid)
5. Database Schema (every table, every column, type, constraints, indexes, foreign keys)
6. Authentication & Authorization Design
7. API Routes (method, path, request body, response body, auth requirement)
8. Security Architecture (all layers)
9. Third-party Integration Specifications
10. Environment Variables Required (name, type, description, where obtained)
11. File/Storage Architecture
12. Error Handling Strategy
13. Non-Functional Requirements (performance, scalability, availability)

### 5.4 Planner Agent

**Role:** Technical Project Manager. Takes PRD as input. Produces phases.md.

**System Prompt Architecture:**
```
IDENTITY: You are a Senior Technical Project Manager. You are given a finalized PRD for a software product and must decompose it into an optimally sequenced, phase-by-phase build plan.

PHASE DESIGN RULES:
1. Each phase must be independently buildable and testable. No phase should depend on code from a future phase.
2. Phases must follow this sequence pattern:
   a. Infrastructure & Environment Setup (ALWAYS Phase 1)
   b. Database schema creation and migration (ALWAYS Phase 2)
   c. Authentication system (ALWAYS Phase 3 if auth is required)
   d. Core backend API (before any frontend)
   e. Frontend shells and routing (before feature-specific UI)
   f. Feature-by-feature implementation (one major feature per phase)
   g. Third-party integrations
   h. Security hardening and audit
   i. Production deployment configuration (ALWAYS last phase)

3. Each phase entry must contain:
   - Phase number and name
   - Objective (one sentence)
   - Scope (bullet list of exactly what is built in this phase)
   - Out of scope (bullet list of what is explicitly NOT built yet)
   - Entry criteria (what must be true before this phase starts)
   - Exit criteria (what automated tests must pass for this phase to be COMPLETE)
   - Files to create/modify (exact file paths)
   - Dependencies (which third-party services/APIs are needed for this phase)

4. Security and auth phases are NEVER merged with feature phases.
5. The final phase is ALWAYS a production hardening phase.

OUTPUT: A single Markdown document named phases.md. Each phase as an H2 heading. Follow the exact format required for the Developer Agent to parse and execute.
```

### 5.5 Developer Agent

**Role:** Full-Stack Senior Engineer. Takes one phase at a time from phases.md. Reads /docs before every task. Writes code, tests, commits.

**This agent is session-based.** Every time it starts a new coding task within a phase, it receives:
1. The full PRD.md as system context (injected via the docs injection layer)
2. The current phase specification from phases.md
3. The current state of the repository (via GitHub API file listing)
4. The Phase Log for all completed phases (what was built, what tests passed)

**The Docs Injection Layer:** This is the technical implementation of "permanent memory." Before every Developer Agent call, the worker runs `docs_injector.ts` which:
1. Fetches all files from the project's /docs folder in S3
2. Fetches the current phase from phases.md
3. Fetches the phase log (audit trail of completed work)
4. Constructs a context object and injects it into the system prompt
5. Includes a vector similarity search against pgvector to find the most relevant sections of docs if the context window would be exceeded

**System Prompt Architecture:**
```
IDENTITY: You are a Senior Full-Stack Developer. You are building [PROJECT_NAME] according to the architecture defined in the documents below.

MANDATORY BEHAVIOR:
1. Before writing ANY code, state which file you are creating/modifying and why.
2. Every function must have a JSDoc comment explaining what it does.
3. Every API route must have input validation (using the validation library specified in the PRD).
4. Every database query must use the ORM specified in the PRD. No raw SQL unless the PRD explicitly requires it.
5. Every file you create must match the exact path specified in the current phase's "Files to create/modify" list.
6. After writing all code for a task, write the unit tests for that code.
7. Never modify files outside the current phase's scope. If you discover a bug in a previous phase, log it to a bug_report.md file in /docs and continue.

CURRENT PHASE: [Injected from phases.md]

ARCHITECTURE DOCUMENT:
[Full PRD.md content injected here]

REPOSITORY CURRENT STATE:
[File tree from GitHub API injected here]

COMPLETED PHASES LOG:
[phase-log.md content injected here]

OUTPUT FORMAT: For each file you write, output a code block with the exact file path as the code block language tag:
```path/to/file.ts
// file content here
```
After all files, output a summary block in JSON:
{
  "files_created": [...],
  "files_modified": [...],
  "tests_written": [...],
  "notes": "..."
}
```

**File Writing Process:**
1. Developer Agent streams its response
2. Worker parses the response in real-time, extracting code blocks
3. Each code block is written to the GitHub repository via GitHub API
4. Once all files are committed, the QA Agent is triggered

### 5.6 QA Gate Agent

**Role:** QA Engineer and Contract Validator. Runs after each Developer Agent phase completion.

**Two-Part QA Process:**

**Part 1 — Automated Test Execution:**
1. Worker triggers a GitHub Actions workflow via the GitHub API
2. The workflow runs the test suite for the current phase (the Developer Agent wrote these tests)
3. GitHub Actions returns pass/fail and test output to the worker via webhook
4. Results stored in PostgreSQL

**Part 2 — PRD Contract Validation (AI-Assisted):**
```
IDENTITY: You are a QA Engineer. You are validating whether the code written in this phase correctly implements the specifications in the PRD.

YOUR TASK:
1. Review the PRD specifications for the components built in this phase
2. Review the code files written (provided below)
3. Check each PRD specification against the implementation
4. Output a structured validation report

VALIDATION REPORT FORMAT:
{
  "overall_result": "PASS" | "FAIL",
  "checks": [
    {
      "spec": "PRD specification text",
      "status": "PASS" | "FAIL" | "WARNING",
      "finding": "What was found in the code",
      "severity": "CRITICAL" | "MAJOR" | "MINOR" (only for FAIL/WARNING)
    }
  ],
  "blockers": [...],  // CRITICAL failures that prevent phase advancement
  "warnings": [...],  // Non-blocking issues for human review
  "pass_conditions_met": boolean
}
```

**Gate Logic:**
- If `overall_result === "FAIL"` AND there are `blockers` → Job re-queued for Developer Agent with full failure report as context. Phase status remains `IN_PROGRESS`.
- If `overall_result === "FAIL"` with only warnings → Phase status set to `REVIEW_REQUIRED`. Human can override or request fixes.
- If `overall_result === "PASS"` → Phase status set to `QA_PASSED`. Human approval gate is shown in UI. Human must click "Approve" to set status to `COMPLETE` and unlock next phase.

**Retry Limit:** Maximum 3 automatic QA retries per phase. On the 3rd failure, phase is set to `BLOCKED` and the user is notified to provide guidance via a revision request.

### 5.7 PRD Summary Agent

**Role:** Translator. Converts the raw technical PRD.md into plain-language explanation for non-technical users at the Blueprint Review gate.

**When invoked:** Once, immediately after the Architect Agent completes the PRD. Runs as a separate non-streaming Claude call. Output cached in `project_documents` as type `prd_summary`. Re-runs only if the PRD is revised.

**Input:** Full PRD.md content.

**System Prompt:**
```
IDENTITY: You are a product translator. You convert deeply technical software architecture documents into clear, jargon-free explanations that a non-technical founder can understand and make decisions from.

YOUR TASK: Read the PRD below and produce a plain-language summary structured as follows:

1. WHAT IS BEING BUILT (2-3 sentences — what the product does for its users)
2. WHO IT'S FOR (1-2 sentences on target user)
3. HOW IT WORKS — THE KEY FLOWS (3-5 bullet points describing the main user journeys in plain language)
4. THE TECHNOLOGY CHOICES (for each major tech choice, one sentence: "We're using X because Y" — no jargon)
5. THE DATABASE (describe what data is stored and why, no schema details)
6. HOW USERS LOG IN (auth description in plain English)
7. INTEGRATIONS (list third-party services and what they do in plain terms)
8. WHAT GETS BUILT IN EACH PHASE (one sentence per phase — "Phase 1 sets up the foundation", etc.)

RULES:
- Never use the words: schema, endpoint, API, JWT, OAuth, ORM, migration, frontend, backend, middleware, payload, async
- If you must reference a technical concept, explain it in parentheses: e.g. "the database (where all your app's data is stored)"
- Maximum 600 words total
- Use second person: "your app", "your users"
- Tone: friendly, confident, like a senior developer explaining to a smart non-technical co-founder

OUTPUT: Markdown with the 8 sections above as H3 headings. No preamble.
```

**Output stored as:** `project_documents` record with `document_type = 'prd_summary'`, version mirrors the PRD version.

### 5.8 Impact Analysis Agent

**Role:** Change analyst. When a user requests a revision to a locked document, this agent determines exactly which pipeline stages are affected and what re-work is required.

**When invoked:** Every time a `revision_request` is created. Runs as a non-streaming Claude call. Completes before the user sees the revision confirmation modal — they need the impact analysis to make an informed decision about whether to proceed.

**Input context:**
- The full current PRD.md
- The full current phases.md
- The user's revision description (from `revision_requests.description`)
- The current project status (which phases are already COMPLETE)

**System Prompt:**
```
IDENTITY: You are a software change analyst. You assess the impact of requested changes to a software project's architecture and determine what must be re-done.

INPUT: You have a finalized PRD, a phases.md build plan, the project's current build status, and a user's requested change.

YOUR TASK: Analyse the requested change and output a structured impact report.

IMPACT REPORT FORMAT (JSON only, no prose outside the JSON):
{
  "change_summary": "One sentence describing what the user wants to change",
  "affected_documents": ["prd", "phases"],  // which locked docs must be regenerated
  "affected_phases": [1, 2, 3],             // phase numbers that must be re-run (already-COMPLETE phases)
  "phases_to_revert": [2, 3],               // subset of affected_phases that are already COMPLETE and must revert to LOCKED
  "estimated_rework_level": "LOW" | "MEDIUM" | "HIGH",
  "rework_explanation": "Plain English: what will be regenerated and why",
  "warning": "Any critical side effects the user should know about (null if none)",
  "can_proceed_without_rebuild": false,     // true only if change is cosmetic/documentation-only
  "recommendation": "PROCEED" | "RECONSIDER",
  "recommendation_reason": "One sentence explaining the recommendation"
}

RULES:
- Be conservative: if in doubt, mark a phase as affected
- A change to the database schema always affects all phases that touch the database
- A change to auth always affects all phases built after the auth phase
- A purely cosmetic change (colour, copy, naming) can have can_proceed_without_rebuild: true
- Never suggest the user should not make the change — only inform them of the consequences
```

**After impact analysis completes:**
1. `revision_requests.impact_analysis` is populated with the JSON report
2. `revision_requests.status` set to `ANALYZING → PENDING` (awaiting user decision)
3. Frontend shows the revision confirmation modal with human-readable version of the impact report
4. User sees exactly: which documents regenerate, which completed phases revert, estimated time
5. Two buttons: "Proceed with Revision" or "Cancel"
6. On proceed: affected phases set back to `LOCKED`, affected documents unlocked, relevant agents re-queued

---

## 6. DATABASE SCHEMA — COMPLETE

All tables use PostgreSQL with Prisma ORM. UUIDs for all primary keys.

### 6.1 users

```sql
Table: users
Purpose: Platform user accounts

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
email           VARCHAR(255) UNIQUE NOT NULL
email_verified  BOOLEAN     DEFAULT false
name            VARCHAR(255)
avatar_url      TEXT
created_at      TIMESTAMP   DEFAULT now()
updated_at      TIMESTAMP   DEFAULT now()
last_login_at   TIMESTAMP
stripe_customer_id  VARCHAR(255) UNIQUE  -- links to Stripe
subscription_tier   VARCHAR(50) DEFAULT 'free'  -- 'free' | 'pro' | 'enterprise'
subscription_status VARCHAR(50) DEFAULT 'inactive'  -- 'active' | 'inactive' | 'past_due' | 'canceled'

INDEX: users(email)
INDEX: users(stripe_customer_id)
```

### 6.2 sessions

```sql
Table: sessions
Purpose: Auth session management (used by the auth system)

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
token_hash      VARCHAR(255) UNIQUE NOT NULL  -- SHA-256 hash of session token
expires_at      TIMESTAMP   NOT NULL
created_at      TIMESTAMP   DEFAULT now()
ip_address      VARCHAR(45)
user_agent      TEXT
is_revoked      BOOLEAN     DEFAULT false

INDEX: sessions(token_hash)
INDEX: sessions(user_id)
INDEX: sessions(expires_at)
```

### 6.3 projects

```sql
Table: projects
Purpose: The core entity — one per product being built

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
name            VARCHAR(255) NOT NULL  -- user-provided or auto-generated from discovery
slug            VARCHAR(255) UNIQUE    -- URL-safe identifier
status          VARCHAR(50) NOT NULL DEFAULT 'CREATED'
  -- CREATED | DISCOVERY_ACTIVE | DISCOVERY_COMPLETE | ARCHITECTURE_QUEUED
  -- ARCHITECTURE_ACTIVE | ARCHITECTURE_COMPLETE | PLANNING_QUEUED
  -- PLANNING_ACTIVE | PLANNING_COMPLETE | BUILD_ACTIVE | DEPLOYMENT_QUEUED | DEPLOYED | ERROR

current_phase_number  INT DEFAULT 0
error_code      VARCHAR(100)   -- populated when status = ERROR
error_message   TEXT
docs_folder_s3_prefix  TEXT   -- S3 path prefix for this project's /docs folder
github_repo_url TEXT
github_repo_name VARCHAR(255)
github_installation_id  BIGINT  -- GitHub App installation ID for this user
deployment_url  TEXT           -- live URL after deployment
created_at      TIMESTAMP   DEFAULT now()
updated_at      TIMESTAMP   DEFAULT now()

INDEX: projects(user_id)
INDEX: projects(status)
INDEX: projects(slug)
```

### 6.4 project_documents

```sql
Table: project_documents
Purpose: Stores all generated documents (discovery brief, PRD, phases, etc.)

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
document_type   VARCHAR(100) NOT NULL
  -- 'discovery_brief' | 'prd' | 'phases' | 'architecture' | 'db_schema'
  -- 'api_contracts' | 'phase_log' | 'bug_report'
version         INT         NOT NULL DEFAULT 1  -- increments on revision
content         TEXT        NOT NULL  -- raw Markdown content
s3_key          TEXT        -- S3 object key for large docs
is_locked       BOOLEAN     DEFAULT false  -- locked documents cannot be edited
content_hash    VARCHAR(64) -- SHA-256 of content for integrity verification
approved_at     TIMESTAMP
approved_by     UUID        REFERENCES users(id)
created_at      TIMESTAMP   DEFAULT now()
updated_at      TIMESTAMP   DEFAULT now()

UNIQUE: (project_id, document_type, version)
INDEX: project_documents(project_id, document_type)
```

### 6.5 discovery_messages

```sql
Table: discovery_messages
Purpose: Full conversation history for the Discovery phase

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
role            VARCHAR(20) NOT NULL  -- 'user' | 'assistant'
content         TEXT        NOT NULL
sequence_number INT         NOT NULL  -- ordering within conversation
coverage_check  JSONB       -- result of completeness check after this message
  -- { "confirmed_items": [0,1,3,5], "completion_percentage": 60 }
created_at      TIMESTAMP   DEFAULT now()

INDEX: discovery_messages(project_id, sequence_number)
```

### 6.6 phases

```sql
Table: phases
Purpose: Individual build phases parsed from phases.md

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
phase_number    INT         NOT NULL
name            VARCHAR(255) NOT NULL
objective       TEXT
scope_markdown  TEXT        -- the full phase specification from phases.md
status          VARCHAR(50) NOT NULL DEFAULT 'LOCKED'
  -- LOCKED | ACTIVE | IN_PROGRESS | QA_RUNNING | QA_PASSED | REVIEW_REQUIRED
  -- BLOCKED | COMPLETE | FAILED
qa_attempt_count  INT       DEFAULT 0
started_at      TIMESTAMP
completed_at    TIMESTAMP
approved_at     TIMESTAMP
approved_by     UUID        REFERENCES users(id)
created_at      TIMESTAMP   DEFAULT now()

UNIQUE: (project_id, phase_number)
INDEX: phases(project_id, status)
INDEX: phases(project_id, phase_number)

CONSTRAINT: phases_qa_attempt_check CHECK (qa_attempt_count <= 3)
```

### 6.7 phase_jobs

```sql
Table: phase_jobs
Purpose: Tracks each BullMQ job run for a phase (developer + QA runs)

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
phase_id        UUID        NOT NULL REFERENCES phases(id) ON DELETE CASCADE
job_type        VARCHAR(50) NOT NULL  -- 'DEVELOPMENT' | 'QA'
bullmq_job_id   VARCHAR(255)         -- BullMQ job ID for status lookup
status          VARCHAR(50) NOT NULL DEFAULT 'QUEUED'
  -- QUEUED | ACTIVE | COMPLETED | FAILED | STALLED
attempt_number  INT         NOT NULL DEFAULT 1
input_context   JSONB       -- what was passed to the agent (truncated for storage)
output_summary  JSONB       -- structured summary of agent output
qa_report       JSONB       -- full QA Gate Agent report (when job_type = 'QA')
files_changed   TEXT[]      -- array of file paths written in this job
tokens_used     INT         -- LLM token consumption for billing tracking
error_details   TEXT
started_at      TIMESTAMP
completed_at    TIMESTAMP
created_at      TIMESTAMP   DEFAULT now()

INDEX: phase_jobs(phase_id)
INDEX: phase_jobs(bullmq_job_id)
```

### 6.8 project_logs

```sql
Table: project_logs
Purpose: Append-only event log for every project — the audit trail

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
event_type      VARCHAR(100) NOT NULL
  -- 'status_changed' | 'phase_started' | 'phase_completed' | 'phase_failed'
  -- 'qa_passed' | 'qa_failed' | 'human_approved' | 'document_generated'
  -- 'document_locked' | 'error' | 'revision_requested' | 'deployed'
event_data      JSONB       -- event-specific payload
actor           VARCHAR(50) NOT NULL  -- 'user' | 'system' | agent name
actor_id        UUID        -- user_id if actor = 'user'
created_at      TIMESTAMP   DEFAULT now()

INDEX: project_logs(project_id, created_at)
INDEX: project_logs(event_type)
```

### 6.9 revision_requests

```sql
Table: revision_requests
Purpose: When a user requests a change after a document is locked

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
document_type   VARCHAR(100) NOT NULL  -- which document is being revised
requested_by    UUID        NOT NULL REFERENCES users(id)
description     TEXT        NOT NULL   -- user's description of the change
impact_analysis TEXT        -- AI-generated analysis of what the change affects
status          VARCHAR(50) NOT NULL DEFAULT 'PENDING'
  -- PENDING | ANALYZING | APPROVED | REJECTED | APPLIED
approved_by     UUID        REFERENCES users(id)
created_at      TIMESTAMP   DEFAULT now()
resolved_at     TIMESTAMP

INDEX: revision_requests(project_id, status)
```

### 6.10 project_environments

```sql
Table: project_environments
Purpose: Encrypted environment variables for each user project being built.
         These are the runtime secrets the Developer Agent injects into the
         generated project — NOT the AVDF platform's own env vars.

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
key             VARCHAR(255) NOT NULL   -- e.g. DATABASE_URL, STRIPE_SECRET_KEY
value_encrypted TEXT        NOT NULL   -- AES-256-GCM encrypted value
value_hint      VARCHAR(50)            -- last 4 chars of value for UI display (e.g. "...x4aB")
source          VARCHAR(50) NOT NULL   -- 'auto_provisioned' | 'user_provided' | 'agent_generated'
  -- auto_provisioned: set by AVDF (e.g. Neon DATABASE_URL)
  -- user_provided: manually entered by user at a gate
  -- agent_generated: set by Developer Agent during build (e.g. JWT_SECRET)
is_secret       BOOLEAN     DEFAULT true   -- if false, safe to display in UI
is_required     BOOLEAN     DEFAULT true   -- if true, deployment blocks until set
github_secret_synced  BOOLEAN DEFAULT false  -- whether pushed to GitHub repo secrets
created_at      TIMESTAMP   DEFAULT now()
updated_at      TIMESTAMP   DEFAULT now()

UNIQUE: (project_id, key)
INDEX: project_environments(project_id)
```

### 6.11 database_integrations

```sql
Table: database_integrations
Purpose: Tracks the Neon database provisioned for each user project.
         Stores provisioning metadata, branch IDs, and current connection state.

id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id          UUID        NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE
provider            VARCHAR(50) NOT NULL DEFAULT 'neon'  -- 'neon' | 'user_provided'
status              VARCHAR(50) NOT NULL DEFAULT 'PENDING'
  -- PENDING | PROVISIONING | ACTIVE | MIGRATION_RUNNING | MIGRATION_FAILED
  -- SWAPPED_TO_USER | ERROR | DELETED

-- Neon-specific fields (null if provider = 'user_provided')
neon_project_id     VARCHAR(255)  -- Neon project UUID
neon_branch_id_dev  VARCHAR(255)  -- Neon branch ID for dev/build environment
neon_branch_id_prod VARCHAR(255)  -- Neon branch ID for production (created at deploy gate)
neon_database_name  VARCHAR(255) DEFAULT 'main'
neon_role_name      VARCHAR(255) DEFAULT 'avdf_user'
neon_region         VARCHAR(100) DEFAULT 'aws-us-east-2'

-- Connection info (stored as reference only — actual credentials in project_environments)
connection_pooler_url_hint  VARCHAR(100)  -- masked hint e.g. "ep-cool-name-******.us-east-2.aws.neon.tech"
database_type       VARCHAR(50) DEFAULT 'postgresql'  -- 'postgresql' | 'mysql' (future)
database_version    VARCHAR(20) DEFAULT '16'

-- Migration tracking
last_migration_run_at   TIMESTAMP
last_migration_result   VARCHAR(50)   -- 'success' | 'failed'
last_migration_error    TEXT
migration_count         INT DEFAULT 0

-- Production swap
swapped_to_user_db_at   TIMESTAMP     -- when user replaced Neon with their own DB at deploy gate
user_db_type            VARCHAR(50)   -- 'postgresql' | 'mysql' | 'planetscale' | 'other'

created_at          TIMESTAMP   DEFAULT now()
updated_at          TIMESTAMP   DEFAULT now()

INDEX: database_integrations(project_id)
INDEX: database_integrations(neon_project_id)
INDEX: database_integrations(status)
```

### 6.12 github_installations

```sql
Table: github_installations
Purpose: GitHub App installation records per user

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
installation_id BIGINT      UNIQUE NOT NULL
account_login   VARCHAR(255)  -- GitHub username/org
account_type    VARCHAR(50)   -- 'User' | 'Organization'
access_token    TEXT          -- encrypted GitHub App access token
token_expires_at TIMESTAMP
created_at      TIMESTAMP   DEFAULT now()
updated_at      TIMESTAMP   DEFAULT now()

INDEX: github_installations(user_id)
INDEX: github_installations(installation_id)
```

### 6.13 usage_events

```sql
Table: usage_events
Purpose: Granular LLM token and feature usage tracking for billing

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id)
project_id      UUID        REFERENCES projects(id)
event_type      VARCHAR(100) NOT NULL  -- 'llm_tokens' | 'project_created' | 'deployment'
model           VARCHAR(100)   -- which Claude model was used
input_tokens    INT
output_tokens   INT
cost_usd_cents  INT            -- computed cost in cents (100 = $1.00)
metadata        JSONB
created_at      TIMESTAMP   DEFAULT now()

INDEX: usage_events(user_id, created_at)
INDEX: usage_events(project_id)
```

### 6.14 document_embeddings

```sql
Table: document_embeddings
Purpose: Stores chunked embeddings of /docs content per project for pgvector
         semantic search. Used by the Docs Injection Layer when full docs exceed
         the Developer Agent's context window. Each document is split into
         overlapping chunks; each chunk gets an embedding vector.

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID        NOT NULL REFERENCES projects(id) ON DELETE CASCADE
document_id     UUID        NOT NULL REFERENCES project_documents(id) ON DELETE CASCADE
document_type   VARCHAR(100) NOT NULL   -- mirrors project_documents.document_type
chunk_index     INT         NOT NULL    -- 0-based ordering of chunks within a document
chunk_text      TEXT        NOT NULL    -- raw text of this chunk (for returning to agent)
embedding       vector(1536) NOT NULL   -- OpenAI text-embedding-3-small or equivalent
token_count     INT         NOT NULL    -- tokens in this chunk
document_version INT        NOT NULL    -- mirrors project_documents.version
created_at      TIMESTAMP   DEFAULT now()

UNIQUE: (document_id, chunk_index)
INDEX: document_embeddings(project_id)
INDEX: document_embeddings(document_id)
-- pgvector HNSW index for fast ANN search (created after table):
-- CREATE INDEX ON document_embeddings USING hnsw (embedding vector_cosine_ops)
--   WITH (m = 16, ef_construction = 64);
```

**Chunking Strategy:**
- Chunk size: 512 tokens with 64-token overlap between consecutive chunks
- Splitting boundary: prefer paragraph breaks over mid-sentence splits
- Re-embedding trigger: whenever `project_documents.version` increments (document revised)
- Embedding model: `text-embedding-3-small` via OpenAI API (1536 dimensions, cheapest at $0.02/1M tokens)
- Embedding generation: runs as a BullMQ job `docs:embed_document` immediately after any document is saved to `project_documents`

**New BullMQ job to add to JOBS enum:**
```typescript
DOCS_EMBED_DOCUMENT: 'docs:embed_document',  // triggered after every document save
```

**New env var required:**
```bash
OPENAI_API_KEY=   # Used only for text-embedding-3-small. No GPT calls — embeddings only.
```

**vectorSearch() implementation reference:**
```typescript
// packages/ai/src/vector-search.ts
export async function vectorSearch(
  projectId: string,
  query: string,
  topK: number = 10
): Promise<string[]> {
  const queryEmbedding = await embedText(query)  // calls OpenAI embeddings API
  const results = await prisma.$queryRaw<{ chunk_text: string; similarity: number }[]>`
    SELECT chunk_text, 1 - (embedding <=> ${queryEmbedding}::vector) AS similarity
    FROM document_embeddings
    WHERE project_id = ${projectId}
    ORDER BY embedding <=> ${queryEmbedding}::vector
    LIMIT ${topK}
  `
  return results.map(r => r.chunk_text)
}
```

### 6.15 oauth_accounts

```sql
Table: oauth_accounts
Purpose: Links OAuth provider identities to AVDF user accounts.
         Supports multiple OAuth providers per user and account linking.

id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
provider            VARCHAR(50) NOT NULL   -- 'github' | 'google'
provider_id         VARCHAR(255) NOT NULL  -- provider's unique user ID
provider_email      VARCHAR(255)           -- email from provider at time of linking
provider_username   VARCHAR(255)           -- GitHub username, Google name, etc.
created_at          TIMESTAMP   DEFAULT now()

UNIQUE: (provider, provider_id)
INDEX: oauth_accounts(user_id)
INDEX: oauth_accounts(provider, provider_id)
```

### 6.16 deployment_integrations

```sql
Table: deployment_integrations
Purpose: Stores user credentials for deployment providers (Vercel, Railway, Render).
         Full schema defined in Section 19.5.

id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id                 UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
project_id              UUID        REFERENCES projects(id) ON DELETE CASCADE
provider                VARCHAR(50) NOT NULL   -- 'vercel' | 'railway' | 'render'
access_token_encrypted  TEXT        NOT NULL
token_type              VARCHAR(50) DEFAULT 'oauth'
provider_account_id     VARCHAR(255)
provider_account_name   VARCHAR(255)
scopes                  TEXT[]
expires_at              TIMESTAMP
last_used_at            TIMESTAMP
created_at              TIMESTAMP   DEFAULT now()
updated_at              TIMESTAMP   DEFAULT now()

UNIQUE: (user_id, provider)
INDEX: deployment_integrations(user_id, provider)
INDEX: deployment_integrations(project_id)
```

### 6.17 notifications

```sql
Table: notifications
Purpose: In-app notification inbox per user. Full schema defined in Section 20.2.

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
type            VARCHAR(100) NOT NULL
title           VARCHAR(255) NOT NULL
body            TEXT        NOT NULL
action_url      TEXT
is_read         BOOLEAN     DEFAULT false
project_id      UUID        REFERENCES projects(id)
created_at      TIMESTAMP   DEFAULT now()

INDEX: notifications(user_id, is_read, created_at)
INDEX: notifications(project_id)
```

---

## 7. SECURITY ARCHITECTURE

Security is not a phase — it is a layer that runs through every other component.

### 7.1 Authentication System

**Method:** JWT + Refresh Token rotation with HTTP-only cookies

**Flow:**
1. User authenticates via OAuth (GitHub or Google) or email/password
2. On successful auth, server generates:
   - Access Token: JWT, signed with RS256, 15-minute expiry
   - Refresh Token: cryptographically random UUID, 30-day expiry, stored as SHA-256 hash in `sessions` table
3. Access Token stored in memory (not localStorage — XSS protection)
4. Refresh Token stored in HTTP-only, Secure, SameSite=Strict cookie
5. Every API request includes the Access Token in the Authorization header
6. When Access Token expires, the frontend automatically calls `POST /api/v1/auth/refresh`
7. Server validates Refresh Token hash, generates new Access Token, rotates Refresh Token (old token is invalidated)
8. On logout, the session record is soft-deleted (is_revoked = true)

**JWT Claims Structure:**
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "tier": "pro",
  "iat": 1234567890,
  "exp": 1234568790,
  "jti": "unique_jwt_id"  // for revocation tracking
}
```

**OAuth Integration:** Passport.js with `passport-github2` and `passport-google-oauth20` strategies. OAuth state parameter includes CSRF token.

### 7.2 Authorization (RBAC)

**Roles:** `user` (all authenticated users), `admin` (internal staff only)

**Resource Ownership:** Every project, document, and phase record has a `user_id` foreign key. Every API route that touches project data runs a middleware check: `if (project.user_id !== req.user.id) throw 403`. This is enforced at the middleware level — NOT in individual route handlers.

**Middleware Stack for protected routes:**
```
authenticate() → verifyProjectOwnership() → checkSubscriptionTier() → handler()
```

### 7.3 API Security

**Input Validation:** All request bodies validated with Zod schemas at the route level before any business logic executes. Invalid input returns 400 with detailed error messages. Validation errors never reach the database.

**Rate Limiting:** Redis-backed rate limiting via `express-rate-limit` + `rate-limit-redis`:
- Global: 100 req/min per IP
- Auth endpoints: 5 req/min per IP (brute force protection)
- AI-triggering endpoints: 10 req/min per user (cost protection)
- Discovery chat: 30 messages per discovery session

**CORS:** Configured to allow only the exact frontend origin. In production, wildcard origins are rejected.

**Helmet.js:** Sets all security headers:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: same-origin`
- `Permissions-Policy` (disables camera, microphone, geolocation)

**CSRF Protection:** Double-submit cookie pattern for state-changing requests. CSRF token generated on session creation, verified on POST/PUT/PATCH/DELETE.

**SQL Injection:** Prisma uses parameterized queries exclusively. No string concatenation in database queries. Raw queries explicitly forbidden except where Prisma cannot express the query, in which case Prisma's `$queryRaw` with tagged templates is used.

**API Key Storage:** All third-party API keys (Anthropic, GitHub App private key, Stripe) stored exclusively in environment variables. Never in the database. Never logged. Never in version control.

### 7.4 LLM Security

**Prompt Injection Prevention:**
- All user-provided content injected into prompts is wrapped in XML-style tags: `<user_input>...</user_input>`
- System prompts instruct agents to ignore instructions within user_input tags
- User input is HTML-escaped before injection
- Agent outputs are validated to ensure they don't contain shell commands or file system operations outside the defined scope

**Agent Output Sandboxing:**
- Developer Agent code output is parsed and only code blocks are extracted. Free-form text outside code blocks is displayed to the user but never executed.
- File paths in code blocks are validated against an allowlist based on the current phase's file scope. Files outside the phase scope are rejected and flagged.
- No agent can write to `/docs` — only the Planner Agent writes docs, and only during the Planning phase. This is enforced by worker-level permission checks.

**Token Budget Management:**
- Each agent call has a max_tokens budget based on the task type
- Discovery: 2000 tokens output per message
- Architect: 8000 tokens output (PRD generation)
- Planner: 6000 tokens output (phases generation)
- Developer: 8000 tokens per coding task
- QA: 4000 tokens per validation report
- Context windows are managed by the Docs Injection Layer — if /docs content exceeds 80% of the context window, the most relevant sections are selected via pgvector similarity search

### 7.5 Data Security

**Encryption at Rest:**
- PostgreSQL data encrypted at rest at the infrastructure level (managed database)
- S3/R2 buckets use server-side encryption (AES-256)
- Sensitive columns (GitHub access tokens, Stripe keys) additionally encrypted at the application level using AES-256-GCM before storage

**Encryption in Transit:**
- All connections use TLS 1.3 minimum
- Internal service-to-service communication (API → Redis, API → PostgreSQL) uses TLS if services are in different subnets

**GitHub Token Security:**
- GitHub App generates short-lived installation access tokens (1-hour expiry)
- Tokens are fetched fresh before each GitHub API call — never stored long-term
- Token refresh is handled by the `github_service.ts` module which checks expiry before every operation

### 7.6 Infrastructure Security

**Environment Isolation:** Production, staging, and development environments are completely isolated — separate databases, separate S3 buckets, separate API keys, separate GitHub App installations.

**Secrets Management:** Environment variables only. No `.env` files in the Docker image. Secrets injected at runtime via the hosting platform's secret management (Railway/Render environment variables or AWS Secrets Manager in enterprise tier).

**Container Security:**
- Docker containers run as non-root users
- Read-only filesystem where possible
- No shell access in production containers
- Resource limits (CPU/memory) set per container

### 7.7 Multi-Tenancy Data Isolation

The AVDF Platform is a multi-tenant system where every user's projects, documents, phases, and environment variables must be completely invisible to all other users. This is enforced at three independent layers — any one layer alone is insufficient.

**Layer 1 — Database Schema (structural isolation):**
Every table that contains user-owned data has a `user_id` or `project_id` foreign key with `NOT NULL`. No cross-user query is structurally possible without explicitly joining through these keys. The schema itself makes accidental data leakage structurally difficult.

**Layer 2 — Service Function Pattern (enforced convention):**
Every service function that reads or writes project-scoped data MUST accept `userId` as a parameter and include it in the WHERE clause. This is not optional — it is the enforced pattern for all service functions:

```typescript
// ✅ CORRECT — userId always scoped in query
async function getProject(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, userId }  // userId always included
  })
}

// ❌ WRONG — never query by ID alone
async function getProject(projectId: string) {
  return prisma.project.findUnique({ where: { id: projectId } })
}
```

The Developer Agent must follow this pattern for every single data access function in every service file. If a service function does not have `userId` in its signature and WHERE clause, it is a bug.

**Layer 3 — Middleware Authorization (HTTP enforcement):**
The `verifyProjectOwnership` middleware runs on every project-scoped route. It fetches the project, checks `project.userId === req.user.id`, and throws 403 before the route handler executes. This is the last line of defense — if the service layer somehow had a bug, the middleware still blocks the request.

```typescript
// middleware/authorize.ts
export async function verifyProjectOwnership(req, res, next) {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  })
  if (!project) return res.status(403).json({ error: { code: 'AUTH_INSUFFICIENT_PERMISSIONS' } })
  req.project = project  // attach for use in handler
  next()
}
```

**BullMQ Worker Isolation:**
Every BullMQ job payload includes `projectId` AND `userId`. Workers validate ownership against the database before processing. A job with a mismatched userId is rejected and logged as a security event — it should never happen, but if it does, it is caught.

---

## 8. BACKEND SERVICES & API LAYER

### 8.1 API Server Structure

```
apps/api/
├── src/
│   ├── server.ts              # Express app initialization + middleware registration
│   ├── routes/
│   │   ├── auth.routes.ts     # /api/v1/auth/*
│   │   ├── projects.routes.ts # /api/v1/projects/*
│   │   ├── messages.routes.ts # /api/v1/projects/:id/messages
│   │   ├── documents.routes.ts # /api/v1/projects/:id/documents
│   │   ├── phases.routes.ts   # /api/v1/projects/:id/phases
│   │   ├── github.routes.ts   # /api/v1/github/*
│   │   ├── webhooks.routes.ts # /api/v1/webhooks/* (GitHub, Stripe)
│   │   └── billing.routes.ts  # /api/v1/billing/*
│   ├── middleware/
│   │   ├── authenticate.ts    # JWT verification
│   │   ├── authorize.ts       # Project ownership check
│   │   ├── rate-limit.ts      # Per-endpoint rate limits
│   │   ├── validate.ts        # Zod request validation
│   │   └── error-handler.ts   # Global error handler
│   ├── services/
│   │   ├── auth.service.ts    # Auth logic, token generation
│   │   ├── project.service.ts # Project CRUD, status management
│   │   ├── orchestrator.service.ts  # State machine logic
│   │   ├── github.service.ts  # GitHub API wrapper
│   │   ├── neon.service.ts    # Neon database provisioning + management
│   │   ├── environment.service.ts  # project_environments CRUD + encryption + GitHub secret sync
│   │   ├── deployment.service.ts  # User app deployment orchestration
│   │   ├── notification.service.ts # In-app + email notifications
│   │   ├── storage.service.ts # S3/R2 operations
│   │   ├── socket.service.ts  # Socket.io room management + event emission
│   │   └── billing.service.ts # Stripe integration
│   ├── workers/
│   │   ├── discovery.worker.ts
│   │   ├── architect.worker.ts
│   │   ├── planner.worker.ts
│   │   ├── developer.worker.ts
│   │   ├── qa.worker.ts
│   │   ├── notifications.worker.ts
│   │   ├── orphan-detector.worker.ts
│   │   └── docs-embed.worker.ts
│   ├── queues/
│   │   ├── queue.config.ts    # BullMQ Redis connection, queue definitions
│   │   └── job-names.ts       # Enum of all job names
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── redis.ts           # Redis client singleton
│       └── logger.ts          # Structured logger (Logtail)
```

### 8.2 Complete API Routes

#### Authentication Routes

```
POST   /api/v1/auth/register
Body:  { email: string, password: string, name: string }
Auth:  None
Returns: { user: UserDTO, accessToken: string }
Notes: Sets refresh token as HTTP-only cookie

POST   /api/v1/auth/login
Body:  { email: string, password: string }
Auth:  None
Returns: { user: UserDTO, accessToken: string }

POST   /api/v1/auth/refresh
Body:  None (reads refresh token from cookie)
Auth:  None (uses cookie)
Returns: { accessToken: string }

POST   /api/v1/auth/logout
Auth:  Bearer token
Returns: { success: true }
Notes: Revokes session in DB, clears cookie

GET    /api/v1/auth/github          # OAuth redirect
GET    /api/v1/auth/github/callback # OAuth callback
GET    /api/v1/auth/google          # OAuth redirect
GET    /api/v1/auth/google/callback # OAuth callback
GET    /api/v1/auth/me              # Get current user
```

#### Project Routes

```
GET    /api/v1/projects
Auth:  Required
Returns: { projects: ProjectDTO[] }

POST   /api/v1/projects
Body:  { name?: string }
Auth:  Required
Returns: { project: ProjectDTO }
Notes: Creates project, initializes in CREATED status

GET    /api/v1/projects/:id
Auth:  Required + Owner
Returns: { project: ProjectDTO, recentLogs: LogDTO[] }

GET    /api/v1/projects/:id/status
Auth:  Required + Owner
Returns: { status: string, currentPhase: PhaseDTO | null }
Notes: Lightweight endpoint, polled every 10s

DELETE /api/v1/projects/:id
Auth:  Required + Owner
Returns: { success: true }

POST   /api/v1/projects/:id/archive
Auth:  Required + Owner
Returns: { downloadUrl: string }  # Signed S3 URL to zip
```

#### Discovery Routes

```
GET    /api/v1/projects/:id/messages
Auth:  Required + Owner
Returns: { messages: MessageDTO[], coverageStatus: CoverageDTO }

POST   /api/v1/projects/:id/messages
Body:  { content: string }
Auth:  Required + Owner
Returns: { message: MessageDTO }  # User message (202 Accepted)
Notes: Enqueues discovery:process_message job. Response streams via WebSocket.

POST   /api/v1/projects/:id/discovery/approve
Auth:  Required + Owner
Returns: { success: true }
Notes: Locks discovery brief, triggers architecture phase
```

#### Document Routes

```
GET    /api/v1/projects/:id/documents
Auth:  Required + Owner
Returns: { documents: DocumentDTO[] }

GET    /api/v1/projects/:id/documents/:type
Auth:  Required + Owner
Returns: { document: DocumentDTO }

POST   /api/v1/projects/:id/documents/:type/approve
Auth:  Required + Owner
Returns: { success: true }
Notes: Locks the document, triggers next pipeline stage

POST   /api/v1/projects/:id/documents/revision
Body:  { documentType: string, description: string }
Auth:  Required + Owner
Returns: { revisionRequest: RevisionRequestDTO }
```

#### Phase Routes

```
GET    /api/v1/projects/:id/phases
Auth:  Required + Owner
Returns: { phases: PhaseDTO[] }

GET    /api/v1/projects/:id/phases/:phaseNumber
Auth:  Required + Owner
Returns: { phase: PhaseDTO, jobs: PhaseJobDTO[] }

POST   /api/v1/projects/:id/phases/:phaseNumber/approve
Auth:  Required + Owner
Returns: { success: true }
Notes: Sets phase to COMPLETE, unlocks next phase, enqueues next dev job

POST   /api/v1/projects/:id/phases/:phaseNumber/revision
Body:  { description: string }
Auth:  Required + Owner
Returns: { success: true }
Notes: Creates revision request, re-queues developer job with revision context
```

#### GitHub Routes

```
GET    /api/v1/github/install
Auth:  Required
Returns: Redirect to GitHub App installation page

GET    /api/v1/github/callback
Auth:  Required (via state param)
Returns: Redirect to frontend with installation success

GET    /api/v1/github/repos
Auth:  Required
Returns: { repos: RepoDTO[] }  # User's existing repos

POST   /webhooks/github
Auth:  GitHub webhook signature verification
Notes: Handles GitHub App events (push, check_suite, etc.)

POST   /webhooks/stripe
Auth:  Stripe webhook signature verification
Notes: Handles subscription events
```

### 8.3 BullMQ Queue Architecture

**Queue Definitions:**

```typescript
// packages/ai/src/queues.ts

const QUEUES = {
  DISCOVERY: 'discovery',
  ARCHITECTURE: 'architecture',
  PLANNING: 'planning',
  DEVELOPMENT: 'development',
  QA: 'qa',
  DEPLOYMENT: 'deployment',
  NOTIFICATIONS: 'notifications',
}

const JOBS = {
  DISCOVERY_PROCESS_MESSAGE: 'discovery:process_message',
  DISCOVERY_GENERATE_BRIEF: 'discovery:generate_brief',
  ARCHITECT_GENERATE_PRD: 'architect:generate_prd',
  PLANNER_GENERATE_PHASES: 'planner:generate_phases',
  PLANNER_PROVISION_REPO: 'planner:provision_repo',
  PLANNER_PROVISION_DATABASE: 'planner:provision_database',
  DEVELOPER_EXECUTE_PHASE: 'developer:execute_phase',
  QA_VALIDATE_PHASE: 'qa:validate_phase',
  ORCHESTRATOR_ADVANCE: 'orchestrator:advance',
  DEPLOY_TRIGGER: 'deploy:trigger',
  NOTIFICATIONS_SEND_EMAIL: 'notifications:send_email',
  NOTIFICATIONS_IN_APP: 'notifications:in_app',
  ORPHAN_DETECT: 'orphan:detect',
  DOCS_EMBED_DOCUMENT: 'docs:embed_document',
}
```

**Worker Concurrency:**

```typescript
// Each worker type has independent concurrency limits
DISCOVERY worker: concurrency 10    (lightweight, fast)
ARCHITECTURE worker: concurrency 3  (heavy, expensive, slow)
PLANNING worker: concurrency 5
DEVELOPMENT worker: concurrency 5   (long-running, parallel per project)
QA worker: concurrency 5
DEPLOYMENT worker: concurrency 5    (external API calls, moderate duration)
NOTIFICATIONS worker: concurrency 20 (fast, fire-and-forget email/in-app)
DOCS_EMBED worker: concurrency 10   (OpenAI API calls, fast)
ORPHAN_DETECTOR worker: concurrency 1 (singleton cron — only one instance should run)
```

**Retry Policies:**

```typescript
// BullMQ job options per queue
DISCOVERY: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } }
ARCHITECTURE: { attempts: 2, backoff: { type: 'fixed', delay: 5000 } }
DEVELOPMENT: { attempts: 1, backoff: null }  // Dev failures go through QA loop
QA: { attempts: 2, backoff: { type: 'fixed', delay: 3000 } }
```

**Stalled Job Configuration & Recovery:**

A BullMQ job becomes "stalled" when a worker picks it up (moves to ACTIVE) but crashes or hangs before completing. With long-running LLM calls that can take 2–5 minutes, stalled jobs are a real operational concern.

```typescript
// Queue-level stall detection settings (set on each QueueScheduler / Worker)
const workerOptions = {
  stalledInterval: 30_000,   // Check for stalled jobs every 30 seconds
  maxStalledCount: 2,        // Allow a job to stall twice before marking FAILED
  lockDuration: 300_000,     // Worker must renew lock within 5 minutes (covers longest LLM call)
  lockRenewTime: 150_000,    // Renew lock every 2.5 minutes (half of lockDuration)
}
```

**Worker heartbeat pattern** — long-running workers must renew their lock during streaming:
```typescript
// workers/developer.worker.ts — lock renewal during streaming
const stream = await anthropic.messages.stream({ ... })
const lockRenewalInterval = setInterval(() => job.extendLock(300_000), 150_000)

try {
  for await (const chunk of stream) { /* process */ }
} finally {
  clearInterval(lockRenewalInterval)
}
```

**Stalled Job Recovery Flow:**
1. BullMQ detects stalled job → moves job back to WAITING (automatic, up to `maxStalledCount`)
2. On `maxStalledCount` exceeded → job moves to FAILED state
3. Worker's `failed` event handler fires:
   a. Sets `phase_jobs.status = 'STALLED'` in DB
   b. Sets `phases.status = 'ERROR'` if it was an ACTIVE dev/QA phase
   c. Sets `projects.status = 'ERROR'` with `error_code = 'AGENT_STALLED'`
   d. Emits `notification:error` via Socket.io to the user's room
   e. Enqueues `notifications:send_email` job: "Your build paused — click to retry"
4. User sees error state in UI with a "Retry Phase" button
5. Retry button calls `POST /api/v1/projects/:id/phases/:num/retry`
6. Handler resets `phase_jobs.status`, `phases.status`, `projects.status`, re-enqueues the job

**Orphaned Project Detection (background cron):**
A cron job runs every 15 minutes via BullMQ's repeatable jobs:
```typescript
// Finds projects stuck in ACTIVE states with no recent job activity (> 30 min)
// These are projects whose worker crashed without emitting a failure event
ORPHAN_DETECTOR: { repeat: { every: 900_000 } }  // every 15 minutes
```
For each orphaned project found: sets status to `ERROR`, notifies user, logs the event.

## 9. FRONTEND ARCHITECTURE

### 9.1 App Directory Structure (Next.js 14)

```
apps/web/
├── app/
│   ├── layout.tsx            # Root layout (providers, global styles)
│   ├── page.tsx              # Landing page (/)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx        # Auth layout (no sidebar)
│   ├── (dashboard)/
│   │   ├── layout.tsx        # Dashboard layout (sidebar + header)
│   │   ├── dashboard/page.tsx  # Project list
│   │   └── projects/
│   │       ├── new/page.tsx    # Start new project
│   │       └── [id]/
│   │           ├── page.tsx    # Project overview (redirects to active step)
│   │           ├── discovery/page.tsx    # Chat interface
│   │           ├── blueprint/page.tsx    # PRD review
│   │           ├── phases/page.tsx       # Phase plan review
│   │           ├── build/page.tsx        # Live build dashboard
│   │           ├── deploy/page.tsx       # Deployment screen
│   │           └── settings/page.tsx     # Project settings
│   └── api/                  # Next.js API routes (only for auth callbacks, no business logic)
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── discovery/
│   │   ├── chat-interface.tsx  # The main discovery chat UI
│   │   ├── message-bubble.tsx
│   │   ├── coverage-indicator.tsx  # Shows discovery progress
│   │   └── brief-preview.tsx
│   ├── blueprint/
│   │   ├── prd-viewer.tsx      # Split-panel PRD display
│   │   ├── prd-summary.tsx     # Plain-language summary
│   │   └── approval-gate.tsx   # Approve/Request Changes buttons
│   ├── build/
│   │   ├── phase-timeline.tsx  # Visual phase roadmap
│   │   ├── phase-card.tsx      # Individual phase status card
│   │   ├── build-log.tsx       # Live streaming log viewer
│   │   ├── file-tree.tsx       # GitHub repo file tree
│   │   ├── code-viewer.tsx     # Monaco editor (read-only)
│   │   └── qa-report.tsx       # QA Gate validation results
│   ├── agents/
│   │   ├── agent-status.tsx    # Shows which agent is active
│   │   └── typing-indicator.tsx
│   └── shared/
│       ├── loading-states.tsx
│       ├── error-states.tsx
│       └── gate-button.tsx     # The approve/reject gate UI
├── hooks/
│   ├── useProject.ts           # Project data with React Query
│   ├── useSocket.ts            # Socket.io connection management
│   ├── useDiscovery.ts         # Discovery phase state
│   ├── useBuildStream.ts       # Real-time build log streaming
│   └── useAuth.ts              # Auth state, token management
├── stores/
│   ├── auth.store.ts           # Zustand: current user, access token
│   └── socket.store.ts         # Zustand: socket connection state
├── lib/
│   ├── api.ts                  # Axios instance with interceptors (token refresh)
│   └── socket.ts               # Socket.io client factory
└── types/
    └── index.ts                # Frontend-specific type extensions
```

### 9.2 Real-time State Strategy

**Hybrid Approach: Polling + WebSocket**
- On project page load, React Query fetches initial state
- Socket.io connection established and joined to `project:{id}` room
- Socket events update React Query cache directly (no separate state)
- Fallback: If WebSocket disconnects, React Query polling at 10s interval maintains consistency

```typescript
// hooks/useProject.ts pattern
export function useProject(id: string) {
  const queryClient = useQueryClient()
  const { socket } = useSocket()

  // Initial data + fallback polling
  const query = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`),
    refetchInterval: 10_000,  // fallback polling
  })

  // Real-time updates via Socket.io
  useEffect(() => {
    socket.on(`project:${id}:updated`, (data) => {
      queryClient.setQueryData(['project', id], data)
      queryClient.invalidateQueries(['project', id, 'phases'])
    })
    return () => socket.off(`project:${id}:updated`)
  }, [socket, id, queryClient])

  return query
}
```

### 9.3 Key UI Screens

**Discovery Chat Screen:**
- Full-screen chat interface
- Agent "typing" indicator during streaming
- Coverage progress bar (animated, updates after each message)
- Right panel: live Discovery Brief preview as it builds up
- Bottom: "Approve & Continue to Architecture" button (locked until coverage = 100%)

**Blueprint Review Screen:**
- Split-panel layout
- Left: Plain-language summary (translated by a summary agent call)
- Right: Full PRD.md rendered as formatted Markdown
- Toggle to show/hide full technical document
- "Request Changes" → opens modal with text input
- "Approve Blueprint" → triggers Architecture approval gate

**Build Dashboard Screen:**
- Phase timeline (horizontal or vertical) showing all phases with status badges
- Active phase panel: agent status, live log stream, progress indicator
- File tree panel: GitHub repo structure, updates in real-time as files are committed
- Code viewer: click any file in the tree to see its content (Monaco, read-only)
- QA Report panel: shown when phase enters QA_RUNNING state
- Phase approval card: shown when status = QA_PASSED

---

## 10. THE /DOCS MEMORY SYSTEM

### 10.1 Architecture

The /docs memory system is the technical solution to AI context collapse. It is implemented as a combination of:

1. **S3 File Storage:** All documents stored as Markdown files in S3 under `projects/{project_id}/docs/`
2. **PostgreSQL Records:** `project_documents` table tracks all documents, versions, lock status
3. **pgvector Embeddings:** All document sections are chunked and embedded for semantic search
4. **Docs Injection Layer:** TypeScript module that assembles the correct context before each agent call

### 10.2 Document Hierarchy

```
S3: projects/{project_id}/docs/
├── discovery-brief.md     # Locked after Discovery approval
├── PRD.md                 # Locked after Blueprint approval  
├── phases.md              # Locked after Phases approval
├── architecture.md        # Extracted from PRD, standalone reference
├── db-schema.md           # Extracted from PRD, standalone reference
├── api-contracts.md       # Extracted from PRD, standalone reference
├── phase-log.md           # Updated after each phase completion (NOT locked)
└── bug-report.md          # Append-only log of bugs found during build (NOT locked)
```

### 10.3 Docs Injection Layer

```typescript
// packages/ai/src/docs-injector.ts

interface DocsContext {
  discoveryBrief: string
  prd: string
  currentPhase: string
  phaseLog: string
  repoFileTree: string
  tokenCount: number
}

export async function buildDocsContext(
  projectId: string,
  currentPhaseNumber: number,
  maxTokens: number = 100_000
): Promise<DocsContext> {
  // 1. Always include: current phase + phase log (small, critical)
  const currentPhase = await getPhaseSpec(projectId, currentPhaseNumber)
  const phaseLog = await getPhaseLog(projectId)
  const repoFileTree = await getRepoFileTree(projectId)

  // 2. Try to fit full PRD
  const prd = await getDocument(projectId, 'prd')
  const totalTokens = estimateTokens(currentPhase + phaseLog + prd)

  if (totalTokens <= maxTokens * 0.8) {
    // Full context fits — inject everything
    return { prd, currentPhase, phaseLog, repoFileTree, ... }
  }

  // 3. Context too large — use semantic search to find relevant sections
  const query = `${currentPhase.objective} ${currentPhase.scope}`
  const relevantSections = await vectorSearch(projectId, query, topK=10)

  return {
    prd: relevantSections.join('\n\n---\n\n'),
    currentPhase,
    phaseLog,
    repoFileTree,
    ...
  }
}
```

### 10.4 Document Locking

A document is locked when the user approves it via the gate. The lock is:
1. `project_documents.is_locked = true` set in PostgreSQL
2. A `document_locked` event written to `project_logs`
3. A content hash stored in `project_documents.content_hash`

Any attempt to write to a locked document via the API returns 403. The only way to modify a locked document is via a `revision_request` which triggers the full Revision Gate flow (re-run planner, re-approve).

---

## 11. GITHUB INTEGRATION & CI/CD PIPELINE

### 11.1 GitHub App Setup

The platform uses a **GitHub App** (not OAuth App) for the following reasons:
- GitHub Apps have their own identity (not tied to the user's account)
- Fine-grained permissions (only repos the user explicitly grants)
- Higher API rate limits
- Webhook events tied to the App, not user

**Required GitHub App Permissions:**
- Contents: Read & Write (create repos, write files)
- Metadata: Read (list repos, read repo info)
- Checks: Read & Write (read CI/CD results)
- Actions: Read & Write (trigger workflow runs)
- Workflows: Read & Write (create/update CI/CD workflows)

### 11.2 Repo Provisioning

When the Planner phase completes and the user approves the phase plan:

```typescript
// services/github.service.ts - provisionProjectRepo()

1. getInstallationToken(installationId)  // Fresh token from GitHub API
2. createRepository({ name, description, private: true })
3. initializeWithReadme(repoName)
4. createBranch('main')
5. createDocsFolder(repoName)
   - Write discovery-brief.md
   - Write PRD.md
   - Write phases.md
   - Write phase-log.md (empty)
6. createGitHubActionsWorkflow(repoName, projectStack)
   - Generates .github/workflows/ci.yml based on the tech stack in the PRD
7. createEnvironments(repoName, ['staging', 'production'])
8. updateProjectRecord(projectId, { githubRepoUrl, githubRepoName })

After repo provisioning completes, the Orchestrator immediately enqueues a `planner:provision_database` job. This job runs the NeonService flow (see Section 15) and is a prerequisite before Phase 1 of development can begin. Project status during this window is `DB_PROVISIONING`. Once complete, status advances to `BUILD_ACTIVE`.
```

### 11.3 CI/CD Workflow Generation

The Planner Agent generates a `.github/workflows/ci.yml` file appropriate for the project's tech stack. The Developer Agent writes code that passes this CI pipeline. The QA Gate Agent triggers the workflow and reads the results.

**Standard workflow structure:**
```yaml
name: AVDF CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup runtime         # Node.js, Python, etc. — from PRD tech stack
      - name: Install dependencies
      - name: Run linter
      - name: Run unit tests
      - name: Run integration tests
      - name: Build check
  security:
    needs: test
    steps:
      - name: Dependency audit
      - name: SAST scan (CodeQL)
```

### 11.4 GitHub Webhook Handling

The platform registers a webhook on each provisioned repo to receive push and check_suite events:

```
POST /webhooks/github
Signature: GitHub HMAC-SHA256 signature verified before processing

Events handled:
- check_suite.completed → update phase_jobs record with CI results
- push → update project_logs with commit info
- repository → handle repo deletion/transfer
```

---

## 12. INFRASTRUCTURE & DEPLOYMENT

### 12.1 Environments

| Environment | Frontend | Backend | Database | Use |
|---|---|---|---|---|
| Development | localhost:3000 | localhost:4000 | Local PostgreSQL + Redis | Local dev with hot reload |
| Staging | staging.avdf.app (Vercel) | staging-api.avdf.app (Railway) | Managed staging DB | Integration testing, preview |
| Production | avdf.app (Vercel) | api.avdf.app (Railway) | Managed prod DB | Live users |

### 12.2 Docker Configuration

**API Server Dockerfile:**
```dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser
COPY --from=builder --chown=apiuser:nodejs /app/dist ./dist
COPY --from=builder --chown=apiuser:nodejs /app/node_modules ./node_modules
USER apiuser
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

### 12.3 Database Migration Strategy

Prisma handles all migrations:
```bash
# Generate migration (in development)
pnpm prisma migrate dev --name descriptive_name

# Apply migrations (in production, CI step before server start)
pnpm prisma migrate deploy

# Rollback: Prisma does not support automatic rollback.
# Each migration must be designed to be forward-only.
# For rollback, write a new migration that reverses the changes.
```

**Migration rule:** Never modify existing column types in a single migration. Always: add new column → backfill data → remove old column. This prevents downtime.

### 12.4 Production Checklist

Before deploying, the deployment system verifies:
- [ ] All environment variables set and non-empty
- [ ] Database migrations applied cleanly
- [ ] Health check endpoint (`GET /health`) returns 200
- [ ] Redis connection healthy
- [ ] S3 bucket accessible
- [ ] GitHub App credentials valid
- [ ] Anthropic API key valid (test call)
- [ ] Stripe webhook secret set
- [ ] Full test suite passing (CI run)
- [ ] No known CRITICAL security vulnerabilities in dependencies (`pnpm audit`)

### 12.5 Local Development Setup

**Prerequisites:** Node.js 20+, pnpm 8+, Docker Desktop

**Step 1 — Clone and install:**
```bash
git clone https://github.com/your-org/avdf-platform.git
cd avdf-platform
pnpm install        # installs all workspace packages
```

**Step 2 — Start local infrastructure (docker-compose):**

File location: `/docker-compose.dev.yml` (root of monorepo)

```yaml
version: '3.9'
services:
  postgres:
    image: pgvector/pgvector:pg16   # includes pgvector extension
    environment:
      POSTGRES_USER: avdf
      POSTGRES_PASSWORD: avdf_dev
      POSTGRES_DB: avdf_development
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --save 20 1 --loglevel warning

volumes:
  postgres_dev_data:
```

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Step 3 — Configure environment:**
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Fill in required values — see Section 18 for full list
# Minimum required for local dev:
#   DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY,
#   JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
#   GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY (use a dev GitHub App),
#   NEON_API_KEY, OPENAI_API_KEY, FIELD_ENCRYPTION_KEY
```

**Step 4 — Run database migrations and seed:**
```bash
cd packages/db
pnpm prisma migrate dev      # applies all migrations
pnpm prisma db seed          # seeds dev data (see prisma/seed.ts)
```

**Seed data created (`prisma/seed.ts`):**
- 1 admin user: `admin@avdf.dev` / `password: avdf_dev_2024`
- 1 regular user: `user@avdf.dev` / `password: avdf_dev_2024`
- 1 sample project in `DISCOVERY_ACTIVE` state with 3 seeded messages
- 1 sample project in `BUILD_ACTIVE` state (Phase 2) with full docs in S3-mock

**Step 5 — Start all services concurrently:**

File location: `/package.json` (root turbo scripts)

```bash
pnpm dev    # starts all services via turbo
```

This runs concurrently:
- `apps/web`: Next.js on `localhost:3000` (hot reload)
- `apps/api`: Express + Socket.io on `localhost:4000` (ts-node-dev, hot reload)
- `apps/api workers`: BullMQ workers on `localhost:4001` (separate process, hot reload)

**Turbo pipeline config (`turbo.json`):**
```json
{
  "pipeline": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": {}
  }
}
```

**Step 6 — Verify setup:**
```bash
curl http://localhost:4000/health
# Expected: { "status": "ok", "checks": { "database": "ok", "redis": "ok", ... } }
```

**Local S3 mock:** For local dev, S3/R2 calls use **MinIO** running in Docker (add to docker-compose.dev.yml):
```yaml
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: avdf_minio
      MINIO_ROOT_PASSWORD: avdf_minio_secret
    ports:
      - "9000:9000"   # S3 API
      - "9001:9001"   # MinIO console (browser UI)
    volumes:
      - minio_dev_data:/data
```
Set in local `.env`: `R2_ENDPOINT=http://localhost:9000` — the `storage.service.ts` uses the endpoint override when set.

**Testing strategy for local dev:**
```bash
pnpm test              # run all unit tests (Vitest)
pnpm test:e2e          # run Playwright E2E (requires all services running)
pnpm test --filter=api # run only API tests
pnpm test --filter=web # run only frontend tests
```

**Environment variable `.env.example` files** must be kept up to date whenever new env vars are added. This is enforced by a CI check that diffs `.env.example` against the Zod env validation schema in `apps/api/src/lib/env.ts`. Any new `process.env.X` access without a corresponding `.env.example` entry fails CI.

---

## 13. USER EXPERIENCE — COMPLETE FLOWS

### 13.1 Onboarding Flow

```
1. User lands on homepage (/)
2. Clicks "Start Building" → /register
3. Email/password registration OR GitHub/Google OAuth
4. Email verification (if email registration)
5. GitHub App installation screen
   - User is redirected to GitHub App install page
   - Grants access to personal repos (or org repos)
   - Redirected back to /dashboard
6. Dashboard: empty state → "Start your first project"
```

### 13.2 New Project Flow

```
/dashboard → New Project button → /projects/new
  └→ Discovery Phase (/projects/:id/discovery)
      └→ Blueprint Review (/projects/:id/blueprint)
          └→ Phase Plan Review (/projects/:id/phases)
              └→ Build Dashboard (/projects/:id/build)
                  └→ Deployment (/projects/:id/deploy)
```

### 13.3 Gate Interactions

**Gate 1: Discovery Brief Approval**
- Trigger: Discovery coverage = 100%, agent emits completion signal
- UI: Brief preview panel expands, "Review Your Discovery Brief" banner appears
- User action: Read brief → "Approve & Continue" or "I want to change something" (text input)
- System response: Brief locked, Architecture phase queued

**Gate 2: PRD Approval**
- Trigger: Architect Agent completes PRD generation
- UI: Two-panel Blueprint Review screen. Left: plain-language summary. Right: full PRD.md
- User action: Approve or Request Changes
- System response: PRD locked, Planning phase queued

**Gate 3: Phase Plan Approval**
- Trigger: Planner Agent completes phases.md, repo provisioned
- UI: Visual phase timeline with all phases listed, expandable phase cards
- User action: Approve or Request Changes
- System response: phases.md locked. Immediately after approval, two parallel automated steps run and are shown as a progress screen to the user:
  1. **Repo Setup** — GitHub repo created, /docs folder populated, CI/CD workflow written
  2. **Database Provisioning** — Neon PostgreSQL instance spun up, dev branch created, `DATABASE_URL` encrypted and stored, GitHub repo secret set
  Both steps must complete before Phase 1 unlocks. The user sees a live status card for each step. On completion: "Your project environment is ready. Phase 1 is now active."

**Gate 4 (repeating): Phase Completion Approval**
- Trigger: QA Gate Agent returns PASS
- UI: Phase summary card with test results, files changed, QA report
- User action: Approve Phase (unlock next) or Request Revision
- System response: Phase status = COMPLETE, next phase queued

**Gate 5: Production Deployment**
- Trigger: All phases COMPLETE
- UI: Deployment checklist with all checks and their status, plus a **Database** section
- **Database Decision (new):** User sees two options:
  - "Use AVDF-managed database" — The Neon database already provisioned during build. Zero setup. A production branch is created from the dev branch.
  - "Connect your own production database" — User pastes their own connection string (PostgreSQL, MySQL, PlanetScale, etc.). The system validates connectivity, runs all migrations against it, and confirms all tables are created before proceeding. If migration fails, deployment is blocked with the exact error.
- After database decision is made, remaining deployment checks run
- User action: "Deploy to Production"
- System response: Deployment pipeline triggered, live URL returned, database tab in project dashboard activated

### 13.4 Revision Request Flow

At any gate, the user can request changes:
1. User clicks "Request Changes" and describes the change in a text input
2. API creates `revision_request` record
3. Impact Analysis Agent (a lightweight Claude call) determines which stages are affected
4. User sees: "This change affects the PRD and phases.md. The Architecture Agent will regenerate these sections. Do you want to proceed? This will pause your current build."
5. User confirms → affected stages re-run
6. User sees results → approves or requests further changes

---

## 14. REAL-TIME COMMUNICATION LAYER

### 14.1 Socket.io Room Strategy

Each user has a personal room: `user:{userId}`
Each project has a project room: `project:{projectId}`

On WebSocket connection, the server:
1. Authenticates the connection (JWT from handshake auth)
2. Joins the user to their personal room
3. Joins the user to all their project rooms

### 14.2 Event Catalog

All Socket.io events follow the pattern `entity:event_name`:

```typescript
// Server → Client events (all typed in packages/shared)

'project:status_changed'    // { projectId, status, previousStatus }
'project:phase_updated'     // { projectId, phase: PhaseDTO }
'agent:started'             // { projectId, agentType, phaseNumber? }
'agent:stream_chunk'        // { projectId, content: string }  — streaming text
'agent:completed'           // { projectId, agentType }
'agent:failed'              // { projectId, agentType, error }
'document:generated'        // { projectId, documentType }
'document:locked'           // { projectId, documentType }
'phase:qa_started'          // { projectId, phaseNumber }
'phase:qa_completed'        // { projectId, phaseNumber, result: 'PASS' | 'FAIL' }
'phase:gate_ready'          // { projectId, phaseNumber }  — human approval needed
'github:file_committed'     // { projectId, filePath, commitSha }
'deployment:started'        // { projectId }
'deployment:completed'      // { projectId, deploymentUrl }
'notification:error'        // { projectId, message, severity }
```

### 14.3 Log Streaming

The Developer Agent's output is streamed token by token via Socket.io:

```typescript
// workers/developer.worker.ts - streaming pattern

const stream = await anthropic.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 8000,
  system: systemPrompt,
  messages: conversationHistory,
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    socketService.emit(projectId, 'agent:stream_chunk', {
      content: chunk.delta.text
    })
    buffer += chunk.delta.text
  }
}
```

---

---

## 15. DATABASE PROVISIONING SYSTEM

### 15.1 Architecture Overview

When the AVDF Platform builds a product for a user, that product needs a real, live database from day one of the build phase — not a mock, not a local SQLite file, but a cloud-hosted PostgreSQL instance that the Developer Agent's migration scripts can actually run against and that CI tests can connect to.

The platform uses **Neon** as the managed PostgreSQL provider for all auto-provisioned databases. Every user project gets its own isolated Neon project with two branches:
- `dev` branch — used during the entire build phase
- `production` branch — created at the deployment gate (either from the dev branch, or replaced by the user's own DB)

This architecture mirrors how professional engineering teams work: a development database and a production database, with migrations run against both before any deployment.

**Why Neon specifically:**
- Serverless PostgreSQL: spins up via API call in under 10 seconds
- Branching model: `dev` and `prod` are branches of the same project, migrations can be verified on dev before production
- pgvector extension: available with one API call — the Developer Agent's schema can use it immediately if the PRD requires it
- Generous free tier: enough for MVP-scale projects without cost to the user
- Clean REST API: easy to wrap in `NeonService`
- Compatible with Prisma, Drizzle, and raw `pg` driver — works with any ORM the Architect Agent specifies

### 15.2 NeonService — Complete Specification

**File location:** `apps/api/src/services/neon.service.ts`

**External dependency:** Neon API (`@neondatabase/api-client` or direct fetch to `https://console.neon.tech/api/v2`)

**Required environment variable:** `NEON_API_KEY` (obtained from Neon console, stored in AVDF platform env)

```typescript
// Full interface for NeonService

interface NeonProvisionResult {
  neonProjectId: string
  neonBranchId: string        // dev branch ID
  connectionString: string    // full postgresql:// URL with pooler
  host: string
  databaseName: string
  roleName: string
  region: string
}

interface NeonService {
  // Called by planner:provision_database worker
  provisionForProject(projectId: string, projectName: string): Promise<NeonProvisionResult>

  // Called by QA worker after each phase that includes DB migrations
  runMigrations(projectId: string, migrationsPath: string): Promise<MigrationResult>

  // Called at deployment gate — creates a clean production branch
  createProductionBranch(projectId: string): Promise<{ branchId: string, connectionString: string }>

  // Called when user chooses "Connect your own DB" at deployment gate
  validateUserDatabase(connectionString: string): Promise<{ valid: boolean, error?: string, dbType: string }>
  runMigrationsOnUserDatabase(projectId: string, connectionString: string): Promise<MigrationResult>

  // Called on project deletion (cleanup)
  deleteNeonProject(neonProjectId: string): Promise<void>

  // Called when Neon token needs refresh (they expire)
  getConnectionString(projectId: string): Promise<string>  // fetches fresh from project_environments
}
```

### 15.3 Provisioning Flow — Step by Step

This is the complete sequence executed by the `planner:provision_database` BullMQ worker when the user approves the Phase Plan:

```
1. Worker reads project record — gets projectId, project name, PRD tech stack
2. Read PRD to determine database requirements:
   - Database type (PostgreSQL assumed; future: MySQL support)
   - Database version (default: 16)
   - Required extensions (pgvector? uuid-ossp? etc.)
   - Preferred region (derive from user's location or default to aws-us-east-2)

3. Call Neon API: POST /projects
   Body: {
     name: "avdf-{projectId-slug}",
     region_id: "aws-us-east-2",
     pg_version: 16,
     default_endpoint_settings: { autoscaling_limit_min_cu: 0.25, autoscaling_limit_max_cu: 1 }
   }
   Response: neon_project_id, default branch ID, connection details

4. Call Neon API: enable required extensions on default branch
   POST /projects/{neon_project_id}/branches/{branch_id}/endpoints/{endpoint_id}/query
   Body: { query: "CREATE EXTENSION IF NOT EXISTS vector; CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" }

5. Construct full connection string (pooler URL for production use):
   postgresql://{role}:{password}@{pooler_host}/{database}?sslmode=require

6. Encrypt connection string using AES-256-GCM with FIELD_ENCRYPTION_KEY

7. Store in project_environments table:
   {
     project_id: projectId,
     key: 'DATABASE_URL',
     value_encrypted: encryptedConnectionString,
     value_hint: '...last-4-chars',
     source: 'auto_provisioned',
     is_secret: true,
     is_required: true
   }

8. Store metadata in database_integrations table:
   {
     project_id: projectId,
     provider: 'neon',
     status: 'ACTIVE',
     neon_project_id: ...,
     neon_branch_id_dev: ...,
     neon_region: 'aws-us-east-2',
     ...
   }

9. Push DATABASE_URL as a GitHub Actions secret to the project repo:
   PUT /repos/{owner}/{repo}/actions/secrets/DATABASE_URL
   Value: encrypted with repo's public key (GitHub's format, not AVDF's)

10. Update project_environments record: github_secret_synced = true

11. Emit Socket.io event: 'database:provisioned' with { projectId, hint: connectionHint }

12. Update project status: DB_PROVISIONING → BUILD_ACTIVE
    Enqueue first developer:execute_phase job
```

### 15.4 Docs Injection Layer Update for Database Context

When the Developer Agent is building a phase that involves database work (migrations, schema creation, queries), the Docs Injection Layer adds a `DATABASE_CONTEXT` block to the system prompt:

```
DATABASE_CONTEXT:
- Provider: Neon (serverless PostgreSQL 16)
- Connection: Available via process.env.DATABASE_URL (already set as GitHub secret and deployment env var — do NOT hardcode)
- Extensions available: uuid-ossp, vector (pgvector)
- ORM: [from PRD — e.g. Prisma]
- Migration strategy: [from PRD — e.g. Prisma migrations in /prisma/migrations/]
- IMPORTANT: Never log the DATABASE_URL value. Never commit it to the repo. It is injected at runtime via environment variable only.
```

This ensures the Developer Agent writes migration files correctly and never attempts to hardcode or expose the connection string.

### 15.5 Migration Validation in QA Gate

After any phase that includes database migrations, the QA Gate Agent triggers a migration validation step before running code tests:

```
1. QA worker detects migration files in the phase's committed files
   (any file matching /prisma/migrations/**/*.sql or /migrations/*.sql)

2. Worker calls NeonService.runMigrations(projectId, migrationsPath):
   a. Fetch current DATABASE_URL from project_environments (decrypt)
   b. Run `prisma migrate deploy` (or equivalent) against the Neon dev branch
   c. Capture stdout/stderr

3. If migration fails:
   - Update database_integrations: last_migration_result = 'failed', last_migration_error = stderr
   - Include migration error in QA report as a CRITICAL blocker
   - QA result = FAIL → routes back to Developer Agent with exact migration error

4. If migration succeeds:
   - Update database_integrations: last_migration_result = 'success', migration_count++
   - Continue to code tests
```

### 15.6 Deployment Gate — Database Decision UI

The deployment screen has a dedicated **Database** section that appears before the deployment checklist can be completed. The user sees:

**Option A — AVDF-Managed Database (Neon)**
```
✓ Your database is already set up and running
  Provider: Neon PostgreSQL 16
  Region: us-east-2
  Connection: ep-cool-name-******.us-east-2.aws.neon.tech
  Migrations: 7 applied successfully

  [Use this database for production]
```
Clicking this button calls `NeonService.createProductionBranch(projectId)` which:
- Creates a `production` branch in the same Neon project (branches from `dev`, inheriting all migrated schema)
- Stores the production branch connection string as `DATABASE_URL_PRODUCTION` in project_environments
- Updates `database_integrations.neon_branch_id_prod`

**Option B — Connect Your Own Database**
```
  [+ Connect your own database]
  → Opens modal with connection string input field
  → "Validate Connection" button
  → System runs: connectivity check, version check, migration dry-run
  → If valid: shows "7 migrations ready to apply" confirmation
  → "Apply Migrations & Use This Database" button
  → Runs full migration → swaps DATABASE_URL → records swap in database_integrations
```

### 15.7 Database API Routes

```
GET    /api/v1/projects/:id/database
Auth:  Required + Owner
Returns: { integration: DatabaseIntegrationDTO, environments: EnvironmentSummaryDTO[] }
Notes: Returns DB status, connection hint, migration count. Never returns raw connection string.

POST   /api/v1/projects/:id/database/validate
Body:  { connectionString: string }
Auth:  Required + Owner
Returns: { valid: boolean, dbType: string, error?: string, migrationCount?: number }
Notes: Validates user-provided DB. Rate limited to 10/min per user.

POST   /api/v1/projects/:id/database/swap
Body:  { connectionString: string }
Auth:  Required + Owner
Returns: { success: boolean, migrationsApplied: number }
Notes: Runs migrations on user DB, swaps DATABASE_URL in project_environments and GitHub secrets.

POST   /api/v1/projects/:id/database/provision-production
Auth:  Required + Owner
Returns: { success: boolean, connectionHint: string }
Notes: Creates Neon production branch. Called when user selects Option A at deploy gate.

GET    /api/v1/projects/:id/environments
Auth:  Required + Owner
Returns: { environments: EnvironmentSummaryDTO[] }
Notes: Returns all env vars with hints only. Never returns decrypted values.

POST   /api/v1/projects/:id/environments
Body:  { key: string, value: string }
Auth:  Required + Owner
Returns: { environment: EnvironmentSummaryDTO }
Notes: User can add their own env vars (e.g. STRIPE_KEY, SENDGRID_KEY) for the Developer Agent to use.
```

### 15.8 EnvironmentService — Specification

**File location:** `apps/api/src/services/environment.service.ts`

This service is the single access point for all project environment variable operations. It handles encryption/decryption and GitHub secret synchronization.

```typescript
interface EnvironmentService {
  // Store a new env var (encrypts before writing to DB)
  set(projectId: string, key: string, value: string, source: EnvSource): Promise<void>

  // Get decrypted value — ONLY called server-side by workers, never returned to frontend
  getDecrypted(projectId: string, key: string): Promise<string>

  // Get all env vars for a project (hints only, no decrypted values) — safe for frontend
  listSummary(projectId: string): Promise<EnvironmentSummaryDTO[]>

  // Build the full env object for injecting into a worker's agent context
  // Returns: { DATABASE_URL: "postgresql://...", ... } — decrypted, in memory only
  buildAgentContext(projectId: string): Promise<Record<string, string>>

  // Sync all is_required env vars to GitHub Actions secrets for the project repo
  syncToGitHub(projectId: string): Promise<{ synced: string[], failed: string[] }>

  // Delete all env vars for a project (called on project deletion)
  deleteAll(projectId: string): Promise<void>
}
```

**Encryption implementation:**
```typescript
// lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.FIELD_ENCRYPTION_KEY!, 'hex')  // 32 bytes

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Store as: iv:authTag:ciphertext (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`
}

export function decrypt(ciphertext: string): string {
  const [ivB64, authTagB64, encryptedB64] = ciphertext.split(':')
  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(authTagB64, 'base64')
  const encrypted = Buffer.from(encryptedB64, 'base64')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(encrypted) + decipher.final('utf8')
}
```

### 15.9 New Environment Variables Required (Platform-level)

Add these to the backend `.env` alongside the existing variables from Section 18:

```bash
# Neon Database Provisioning
NEON_API_KEY=           # From Neon console → Account Settings → API Keys
NEON_DEFAULT_REGION=aws-us-east-2   # Default region for provisioned databases

# Field-level encryption for project_environments table
FIELD_ENCRYPTION_KEY=   # 32 random bytes as hex string (openssl rand -hex 32)
                        # CRITICAL: if this key is lost, all stored env vars are unrecoverable
                        # Back this up separately from the application
```

### 15.10 Project Dashboard — Database Tab

After a project has a provisioned database, the project dashboard shows a **Database** tab with:

- Connection status (green/red indicator)
- Provider (Neon / User-provided)
- Database type and version
- Region
- Connection hint (masked host, no password)
- Migration history (count, last run timestamp, last result)
- "View in Neon Console" link (if Neon-managed)
- "Environment Variables" sub-section showing all project env vars with hints only (no values)
- "Add Environment Variable" button (for user to add their own API keys the Developer Agent will need)

---

## 16. BILLING & SUBSCRIPTION SYSTEM

### 16.1 Pricing Tiers

| Feature | Free | Pro ($49/mo) | Enterprise (Custom) |
|---|---|---|---|
| Projects | 1 active | Unlimited | Unlimited |
| Phases per project | Up to 5 | Unlimited | Unlimited |
| LLM token budget/mo | 500K tokens | 5M tokens | Custom |
| GitHub repos | 1 | Unlimited | Unlimited |
| Team members | 1 | 5 | Custom |
| Deployments | Manual | Automated | Automated + Custom infra |

### 16.2 Stripe Integration

- **Stripe Products & Prices:** Created in Stripe dashboard, referenced by Price ID in env vars
- **Checkout:** `POST /api/v1/billing/checkout` → creates Stripe Checkout session
- **Customer Portal:** `POST /api/v1/billing/portal` → creates Stripe Customer Portal session
- **Webhooks:** Handle `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- **Token Usage Tracking:** Every LLM call records tokens to `usage_events`. At billing period end, usage is reconciled against plan limits.

---

## 17. ERROR HANDLING & OBSERVABILITY

### 17.1 Error Classification

```typescript
enum ErrorCode {
  // Auth errors (4xx)
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN = 'AUTH_EXPIRED_TOKEN',
  AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
  
  // Project errors
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  PROJECT_INVALID_STATE = 'PROJECT_INVALID_STATE',  // action not valid in current status
  PHASE_LOCKED = 'PHASE_LOCKED',
  DOCUMENT_LOCKED = 'DOCUMENT_LOCKED',
  
  // Agent errors
  AGENT_LLM_ERROR = 'AGENT_LLM_ERROR',         // Anthropic API error
  AGENT_OUTPUT_INVALID = 'AGENT_OUTPUT_INVALID', // Agent returned unparseable output
  AGENT_RETRY_EXCEEDED = 'AGENT_RETRY_EXCEEDED', // Max retries hit
  
  // Integration errors
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  GITHUB_INSTALLATION_MISSING = 'GITHUB_INSTALLATION_MISSING',
  STORAGE_ERROR = 'STORAGE_ERROR',
  
  // Billing errors
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  TOKEN_BUDGET_EXCEEDED = 'TOKEN_BUDGET_EXCEEDED',
}
```

### 17.2 Error Response Format

Every API error returns a consistent structure:
```json
{
  "error": {
    "code": "PROJECT_INVALID_STATE",
    "message": "Human-readable description",
    "detail": "Technical detail for debugging",
    "requestId": "uuid"
  }
}
```

### 17.3 Agent Failure Handling

When an agent fails:
1. Error captured by BullMQ job failure handler
2. Error logged to `project_logs` with full context
3. If retry available: job re-queued with exponential backoff
4. If retry exhausted: project status set to `ERROR`, user notified via Socket.io
5. Error + full job context sent to Sentry with project_id and user_id tags
6. User sees: "Your [Agent Name] encountered an error. Our team has been notified. You can retry or contact support."

### 17.4 Health Check Endpoint

```typescript
GET /health
Returns:
{
  "status": "ok" | "degraded" | "down",
  "checks": {
    "database": "ok" | "error",
    "redis": "ok" | "error",
    "storage": "ok" | "error",
    "anthropic": "ok" | "error"  // lightweight ping to API
  },
  "version": "1.0.0",
  "uptime": 12345
}
```

---

## 18. ENVIRONMENT CONFIGURATION

All environment variables required for production. None have defaults that are safe for production.

### 18.1 Backend (.env)

```bash
# Server
NODE_ENV=production
PORT=4000
API_BASE_URL=https://api.avdf.app
FRONTEND_URL=https://avdf.app
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@host:5432/avdf_production

# Redis
REDIS_URL=redis://user:pass@host:6379

# Auth
JWT_ACCESS_SECRET=<RS256 private key — min 2048 bit>
JWT_ACCESS_PUBLIC=<RS256 public key>
JWT_REFRESH_SECRET=<random 64 byte hex string>
SESSION_SECRET=<random 64 byte hex string>

# OAuth
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
OAUTH_CALLBACK_BASE_URL=https://api.avdf.app

# GitHub App
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=<PEM format, base64 encoded>
GITHUB_APP_WEBHOOK_SECRET=
GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=avdf-production
R2_PUBLIC_URL=

# Neon Database Provisioning (see Section 15.9 for full details)
NEON_API_KEY=
NEON_DEFAULT_REGION=aws-us-east-2
FIELD_ENCRYPTION_KEY=   # openssl rand -hex 32

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@avdf.app

# Embeddings (OpenAI — embeddings only, no GPT)
OPENAI_API_KEY=

# Deployment integrations
VERCEL_CLIENT_ID=       # Vercel OAuth App client ID
VERCEL_CLIENT_SECRET=   # Vercel OAuth App client secret

# Billing
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Observability
SENTRY_DSN=
LOGTAIL_TOKEN=
POSTHOG_KEY=
```

### 18.2 Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://api.avdf.app
NEXT_PUBLIC_WS_URL=wss://api.avdf.app
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_GITHUB_APP_URL=https://github.com/apps/avdf-platform
```

---

---

## 19. USER APP DEPLOYMENT SERVICE

### 19.1 Overview

When the user clicks "Deploy to Production" at Gate 5, the AVDF Platform must deploy the *user's generated application* to a live hosting provider — not the AVDF platform itself. This requires a `DeploymentService` that authenticates with third-party hosting APIs on the user's behalf and triggers the correct deployment pipeline.

The deployment target is determined by the Architect Agent when it writes the PRD — based on the tech stack, it selects the most appropriate provider. The Developer Agent writes the deployment configuration files (e.g. `vercel.json`, `railway.json`, `Dockerfile`) during the final hardening phase.

### 19.2 Supported Deployment Targets (MVP)

| Target | Supported App Types | Authentication Method |
|---|---|---|
| **Vercel** | Next.js, React, static sites, serverless APIs | Vercel OAuth (user connects account) |
| **Railway** | Node.js, Python, any Dockerized backend | Railway API token (user provides) |
| **Render** | Node.js, Python, static sites, Docker | Render API key (user provides) |

The Architect Agent's PRD generation prompt is updated to include: "Select the deployment target from the supported list based on the tech stack. Include the target in the PRD under `deployment.target`."

### 19.3 Vercel Deployment Flow

**Authentication:** User connects their Vercel account via Vercel OAuth during the GitHub installation step (or separately before deployment). The Vercel access token is stored in a new `deployment_integrations` table.

**Deployment trigger sequence:**
```typescript
// services/deployment.service.ts — deployToVercel()

1. Fetch Vercel access token for user (from deployment_integrations, decrypt)
2. Check repo has vercel.json (written by Developer Agent in final phase)
3. Call Vercel API: POST /v13/deployments
   Body: {
     name: projectSlug,
     gitSource: {
       type: 'github',
       repoId: githubRepoId,
       ref: 'main'
     },
     projectSettings: {
       framework: 'nextjs',
       buildCommand: 'pnpm build',
       outputDirectory: '.next',
       installCommand: 'pnpm install'
     }
   }
4. Poll Vercel deployment status: GET /v13/deployments/:deploymentId
   → Poll every 5s, timeout at 10 minutes
   → Emit 'deployment:progress' via Socket.io on each poll
5. On READY state: extract deployment URL
6. Update projects.deployment_url
7. Emit 'deployment:completed' with { deploymentUrl }
```

**Environment variables injection:**
Before triggering deployment, all `project_environments` entries for the project are pushed to Vercel as environment variables:
```typescript
// For each env var in project_environments where is_required = true:
POST /v10/projects/{vercelProjectId}/env
Body: { key, value (decrypted), target: ['production'], type: 'encrypted' }
```

### 19.4 Railway Deployment Flow

```typescript
// services/deployment.service.ts — deployToRailway()

1. User provides Railway API token at deployment gate (stored encrypted in deployment_integrations)
2. Call Railway GraphQL API to create project linked to GitHub repo
3. Set environment variables via Railway API (from project_environments)
4. Trigger deployment via Railway API: deploymentCreate mutation
5. Poll deployment status via Railway API
6. On SUCCESS: extract Railway-provided URL
7. Update projects.deployment_url
```

### 19.5 New Database Table: deployment_integrations

```sql
Table: deployment_integrations
Purpose: Stores user's credentials for deployment providers (Vercel, Railway, Render)

id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
project_id          UUID        REFERENCES projects(id) ON DELETE CASCADE
  -- NULL means account-level integration (shared across projects)
  -- non-NULL means project-specific credential
provider            VARCHAR(50) NOT NULL  -- 'vercel' | 'railway' | 'render'
access_token_encrypted  TEXT    NOT NULL
token_type          VARCHAR(50) DEFAULT 'oauth'  -- 'oauth' | 'api_key'
provider_account_id VARCHAR(255)   -- Vercel user/team ID, Railway team ID, etc.
provider_account_name VARCHAR(255) -- Display name for UI
scopes              TEXT[]         -- OAuth scopes granted
expires_at          TIMESTAMP      -- NULL for API keys (no expiry)
last_used_at        TIMESTAMP
created_at          TIMESTAMP   DEFAULT now()
updated_at          TIMESTAMP   DEFAULT now()

UNIQUE: (user_id, provider)   -- one integration per provider per user
INDEX: deployment_integrations(user_id, provider)
INDEX: deployment_integrations(project_id)
```

### 19.6 New API Routes for Deployment

```
GET    /api/v1/integrations/deployment
Auth:  Required
Returns: { integrations: DeploymentIntegrationDTO[] }  # connected providers

GET    /api/v1/auth/vercel           # OAuth redirect to Vercel
GET    /api/v1/auth/vercel/callback  # Vercel OAuth callback

POST   /api/v1/integrations/deployment/railway
Body:  { apiToken: string }
Auth:  Required
Returns: { integration: DeploymentIntegrationDTO }

POST   /api/v1/projects/:id/deploy
Auth:  Required + Owner
Returns: { deploymentId: string }   # 202 Accepted, deployment async
Notes: Validates all deployment prerequisites before enqueuing DEPLOY_TRIGGER job

GET    /api/v1/projects/:id/deploy/status
Auth:  Required + Owner
Returns: { status: string, deploymentUrl?: string, logs?: string[] }
```

### 19.7 DeploymentService File Structure

```
apps/api/src/services/
├── deployment.service.ts        # Orchestrates the deployment flow
├── providers/
│   ├── vercel.provider.ts       # Vercel API wrapper
│   ├── railway.provider.ts      # Railway GraphQL API wrapper
│   └── render.provider.ts       # Render API wrapper
```

### 19.8 Developer Agent — Deployment File Generation

During the final hardening phase, the Developer Agent is instructed (via phases.md) to generate deployment configuration files. The Planner Agent must always include a final phase with these explicit file targets based on the deployment provider in the PRD:

**For Vercel deployment:**
- `vercel.json` — framework config, build settings, environment variable references
- `.github/workflows/deploy.yml` — CI trigger for production deployment on main branch merge

**For Railway deployment:**
- `railway.json` — service configuration
- `Dockerfile` — production container definition
- `.github/workflows/deploy.yml` — CI deployment trigger

The Developer Agent's system prompt is updated with: "The deployment target for this project is `[from PRD: deployment.target]`. Generate the correct deployment configuration files as specified in the current phase."

---

## 20. NOTIFICATION & EMAIL SERVICE

### 20.1 Email Provider

**Provider: Resend** (`resend` npm package)
- Modern transactional email API, developer-first
- React Email for template rendering (HTML emails built as React components)
- Free tier: 3,000 emails/month — sufficient for MVP
- Simple API: `resend.emails.send({ from, to, subject, react: <Template /> })`

**New env var:** `RESEND_API_KEY=` and `EMAIL_FROM=noreply@avdf.app`

### 20.2 Notifications BullMQ Worker

The existing `NOTIFICATIONS` queue now has a defined worker:

**File:** `apps/api/src/workers/notifications.worker.ts`

```typescript
// Job types handled by notifications worker:
'notifications:send_email'      // Send transactional email
'notifications:in_app'          // Create in-app notification record
```

**New database table:**

```sql
Table: notifications
Purpose: In-app notification inbox per user

id              UUID        PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE
type            VARCHAR(100) NOT NULL
title           VARCHAR(255) NOT NULL
body            TEXT        NOT NULL
action_url      TEXT        -- deep link into the app
is_read         BOOLEAN     DEFAULT false
project_id      UUID        REFERENCES projects(id)
created_at      TIMESTAMP   DEFAULT now()

INDEX: notifications(user_id, is_read, created_at)
```

### 20.3 Email Templates (React Email components)

All templates live in `packages/shared/src/emails/`:

**`welcome.tsx`** — Triggered: user registration
- Subject: "Welcome to AVDF — let's build something"
- Content: name, getting started CTA, link to create first project

**`email-verification.tsx`** — Triggered: email registration
- Subject: "Verify your email address"
- Content: 6-digit OTP code (valid 15 minutes), or magic link (valid 15 minutes)

**`password-reset.tsx`** — Triggered: forgot password request
- Subject: "Reset your AVDF password"
- Content: reset link (valid 1 hour), security notice

**`phase-completed.tsx`** — Triggered: phase QA_PASSED (only if user not active in app)
- Subject: "Phase [N] complete — your approval is needed"
- Content: phase name, what was built, link to approval gate

**`build-error.tsx`** — Triggered: project enters ERROR state
- Subject: "Your build needs attention"
- Content: project name, error summary, retry link

**`phase-blocked.tsx`** — Triggered: phase enters BLOCKED (3 QA failures)
- Subject: "Your build is blocked — action required"
- Content: what failed, link to provide guidance

**`deployment-success.tsx`** — Triggered: project DEPLOYED
- Subject: "🚀 [Project Name] is live!"
- Content: live URL, project dashboard link

**`subscription-payment-failed.tsx`** — Triggered: Stripe `invoice.payment_failed`
- Subject: "Payment failed — update your billing details"
- Content: amount, retry link, Stripe customer portal link

### 20.4 Email Sending Rules

**Active user suppression:** If a user has been active in the app (last Socket.io `heartbeat` event within 5 minutes), phase completion emails are suppressed — they can see the update in real-time. Only send if they're away.

**Unsubscribe handling:** All transactional emails include a one-click unsubscribe link (per CAN-SPAM/GDPR). Resend handles list-unsubscribe headers automatically. Marketing emails (if any) require explicit opt-in — not built in MVP.

**Email rate limiting:** Maximum 10 emails per user per hour. If limit exceeded, emails are queued with delay, not dropped.

### 20.5 New API Routes for Notifications

```
GET    /api/v1/notifications
Auth:  Required
Returns: { notifications: NotificationDTO[], unread_count: number }

POST   /api/v1/notifications/:id/read
Auth:  Required
Returns: { success: true }

POST   /api/v1/notifications/read-all
Auth:  Required
Returns: { updated: number }
```

---

## 21. STALLED JOB RECOVERY SYSTEM

*The BullMQ-level stall configuration is defined in Section 8.3. This section defines the application-level recovery UI and the user-facing retry system.*

### 21.1 Error States in the UI

When a project enters `ERROR` status, the build dashboard shows a dedicated error state:

```
┌─────────────────────────────────────────────────────┐
│  ⚠️  Your build encountered a problem               │
│                                                     │
│  Phase 3 (Authentication System)                   │
│  Error: Agent response timed out after 5 minutes   │
│                                                     │
│  This sometimes happens with complex code tasks.   │
│  Your progress is saved — retry to continue.       │
│                                                     │
│  [Retry Phase 3]    [Contact Support]              │
└─────────────────────────────────────────────────────┘
```

### 21.2 Retry API Route

```
POST   /api/v1/projects/:id/phases/:phaseNumber/retry
Auth:  Required + Owner
Body:  { hint?: string }   -- optional user guidance to add to agent context
Returns: { success: true, jobId: string }

Validation:
- Phase must be in status: ERROR | BLOCKED | STALLED
- Project must be in status: ERROR
- No active jobs currently running for this project
- Max 5 manual retries per phase (tracked in phases.qa_attempt_count)

On success:
- Resets phase.status to ACTIVE
- Resets project.status to BUILD_ACTIVE
- Clears project.error_code, project.error_message
- Enqueues fresh developer:execute_phase job
- If hint provided: prepended to agent context as "USER GUIDANCE: ..."
```

### 21.3 Orphan Recovery Cron Definition

```typescript
// workers/orphan-detector.worker.ts
// Runs every 15 minutes as a BullMQ repeatable job

async function detectOrphanedProjects() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

  // Find projects in active states with no recent job activity
  const orphans = await prisma.project.findMany({
    where: {
      status: { in: ['DISCOVERY_ACTIVE', 'ARCHITECTURE_ACTIVE', 'PLANNING_ACTIVE', 'BUILD_ACTIVE', 'DB_PROVISIONING'] },
      updatedAt: { lt: thirtyMinutesAgo },
    },
    include: {
      phase_jobs: {
        where: { status: 'ACTIVE' },
        orderBy: { created_at: 'desc' },
        take: 1
      }
    }
  })

  for (const project of orphans) {
    // Check if there's genuinely an active BullMQ job for this project
    const bullJob = await getActiveBullJob(project.id)
    if (bullJob) continue  // Worker is fine, just slow

    // No active job found — project is orphaned
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'ERROR', error_code: 'AGENT_ORPHANED', error_message: 'Build process lost contact. Click retry to resume.' }
    })

    await prisma.project_logs.create({
      data: { project_id: project.id, event_type: 'error', actor: 'system',
              event_data: { error_code: 'AGENT_ORPHANED', detected_at: new Date() } }
    })

    // Notify user
    await enqueueNotification(project.user_id, 'build-error', project.id)
  }
}
```

---

## 22. AUTH EDGE CASES & ACCOUNT MANAGEMENT

### 22.1 Email Verification Flow

Triggered when a user registers with email/password (OAuth users are considered verified via their provider).

```
1. User submits registration form
2. Server creates user record with email_verified = false
3. Server generates 6-digit OTP, stores SHA-256 hash in Redis with key
   "email_verify:{userId}" and TTL 900 (15 minutes)
4. Enqueues notifications:send_email job for email-verification template
5. User redirected to /verify-email screen
6. User enters OTP
7. POST /api/v1/auth/verify-email { otp: "123456" }
8. Server fetches hash from Redis, validates OTP
9. Sets users.email_verified = true, deletes Redis key
10. Returns new access token with verified claim
11. Redirect to dashboard

Resend: POST /api/v1/auth/verify-email/resend
- Rate limited: max 3 resends per hour per user
- Invalidates previous OTP, generates new one
- Returns 200 even if email not found (security: no user enumeration)
```

### 22.2 Password Reset Flow

```
1. User visits /forgot-password, enters email
2. POST /api/v1/auth/forgot-password { email }
3. Server ALWAYS returns 200 (no user enumeration)
4. If email exists: generate 64-byte cryptographically random token
   Store SHA-256 hash in Redis: "pwd_reset:{userId}" TTL 3600 (1 hour)
   Enqueue password-reset email with token in URL: /reset-password?token=...
5. User clicks link → /reset-password?token=...
6. POST /api/v1/auth/reset-password { token, newPassword }
7. Server finds userId by hash lookup in Redis
8. Validates: token not expired, password meets requirements (min 8 chars, 1 number, 1 uppercase)
9. Hashes new password with bcrypt (cost factor 12)
10. Updates users.password_hash
11. Deletes all active sessions for this user (force re-login everywhere)
12. Deletes Redis key
13. Returns 200 + new access token
14. Enqueues security notification email: "Your password was changed"
```

### 22.3 OAuth Account Linking

**The conflict scenario:** User registers with email `jane@example.com`. Later tries to log in with GitHub OAuth where their GitHub email is also `jane@example.com`.

**Resolution strategy: auto-link with security confirmation**

```typescript
// services/auth.service.ts — handleOAuthCallback()

1. OAuth callback received with provider profile (email: jane@example.com, provider: github, providerId: "gh_12345")

2. Look up user by email: users WHERE email = 'jane@example.com'

3. If user found AND no existing OAuth link for this provider:
   a. Check if this account was created via email/password (has password_hash)
   b. If yes: DO NOT auto-link silently
      → Create a pending_oauth_links Redis entry: "oauth_pending:{token}" TTL 600
      → Redirect to /auth/link-account?token=... with message:
        "An account with this email already exists. Log in with your password to link your GitHub account."
   c. User logs in with password → POST /api/v1/auth/link-oauth { password, linkToken }
   d. Validates password, creates oauth_accounts record linking GitHub to this user
   e. Future GitHub logins go directly to this user

4. If user found AND OAuth link already exists for this provider → standard login

5. If no user found → create new user, create oauth_accounts record → standard onboarding

New table: oauth_accounts
  id, user_id, provider, provider_id, provider_email, created_at
  UNIQUE: (provider, provider_id)
  INDEX: (user_id)
```

### 22.4 Account Deletion Flow (GDPR)

```
DELETE /api/v1/users/me
Auth:  Required
Body:  { password: string } OR { confirmPhrase: "DELETE MY ACCOUNT" }
Returns: 200 { success: true }

Deletion cascade (in order):
1. Verify identity (password check or confirmation phrase)
2. Cancel active Stripe subscription (if any) — Stripe customer remains for invoice records
3. Delete all Neon databases provisioned for this user's projects
4. Delete all S3/R2 objects under projects/{userId}/*
5. Revoke all GitHub App installations for this user
6. Hard delete all PostgreSQL records (cascade via FK):
   users → projects → all project children (CASCADE defined in schema)
7. Delete all Redis keys prefixed with user:{userId}:*
8. Log deletion event to a separate immutable audit_deletions table
   (kept for 7 years for legal compliance — contains only userId, deletion timestamp, no PII)
9. Invalidate all sessions
10. Return 200

Soft delete option (30-day recovery window):
- Instead of immediate hard delete, set users.deleted_at = now()
- Cron job hard-deletes after 30 days
- User can email support to recover within 30 days
- MVP: implement hard delete only, add soft delete in v1.1
```

### 22.5 Session Management API

```
GET    /api/v1/auth/sessions
Auth:  Required
Returns: { sessions: SessionDTO[] }   # all active sessions for current user
Notes: Returns device info (user_agent, ip_address, created_at) — NOT token hashes

DELETE /api/v1/auth/sessions/:id
Auth:  Required
Returns: { success: true }
Notes: Revokes a specific session (user can log out a device remotely)

DELETE /api/v1/auth/sessions
Auth:  Required
Returns: { revoked: number }
Notes: Revoke all sessions except current one ("log out all other devices")
```

---

## 23. LLM COST MODEL & UNIT ECONOMICS

### 23.1 Per-Project Cost Estimate

Understanding the LLM cost per project build is critical for setting tier limits and maintaining unit economics. All prices based on Anthropic's current pricing (verify before launch — prices change).

**Claude claude-opus-4-6 pricing:** ~$15 / 1M input tokens, ~$75 / 1M output tokens
**Claude claude-sonnet-4-6 pricing:** ~$3 / 1M input tokens, ~$15 / 1M output tokens
**text-embedding-3-small pricing:** ~$0.02 / 1M tokens

**Cost per agent call (estimates):**

| Agent | Model | Avg Input Tokens | Avg Output Tokens | Cost per Call |
|---|---|---|---|---|
| Discovery (per message) | Sonnet | 8,000 | 800 | ~$0.036 |
| Discovery Brief generation | Sonnet | 20,000 | 3,000 | ~$0.105 |
| Architect (PRD) | Opus | 15,000 | 8,000 | ~$0.825 |
| PRD Summary | Sonnet | 8,000 | 1,500 | ~$0.046 |
| Planner (phases) | Sonnet | 18,000 | 6,000 | ~$0.144 |
| Developer (per phase) | Sonnet | 30,000 | 8,000 | ~$0.210 |
| QA Gate (per phase) | Sonnet | 35,000 | 4,000 | ~$0.165 |
| Impact Analysis | Sonnet | 25,000 | 1,000 | ~$0.090 |

**Full project build cost estimate (10 phases, 15 discovery messages):**

| Step | Calls | Cost |
|---|---|---|
| Discovery conversation (15 msgs) | 15 × $0.036 | $0.54 |
| Discovery brief | 1 × $0.105 | $0.11 |
| Architecture (PRD) | 1 × $0.825 | $0.83 |
| PRD Summary | 1 × $0.046 | $0.05 |
| Planner | 1 × $0.144 | $0.14 |
| Development (10 phases) | 10 × $0.210 | $2.10 |
| QA Gates (10 phases, avg 1.3 runs) | 13 × $0.165 | $2.15 |
| Embeddings (all docs) | ~300K tokens × $0.02/1M | $0.01 |
| **Total per project** | | **~$5.93** |

**Tier economics:**

| Tier | Price/mo | Token Budget | Projects/mo | LLM Cost | Margin |
|---|---|---|---|---|---|
| Free | $0 | 500K tokens | ~0.08 projects | ~$0.47 | -$0.47 (lead gen cost) |
| Pro | $49 | 5M tokens | ~0.8 projects | ~$4.74 | ~$44.26 |
| Heavy Pro user | $49 | 5M tokens | 2 full builds | ~$11.86 | ~$37.14 |

**Token budget translation:**
- 500K tokens ≈ supports ~1 Discovery + PRD generation (no full build)
- 5M tokens ≈ supports ~0.8 full builds (one build costs ~6.3M tokens across all agents)
- Note: Pro tier is intentionally slightly below one full build to incentivize enterprise for power users

### 23.2 cost_usd_cents Calculation in usage_events

The `cost_usd_cents` column must be populated by the worker after each agent call:

```typescript
// packages/ai/src/cost-calculator.ts

const PRICING = {
  'claude-opus-4-6':    { input: 15.00, output: 75.00 },   // per 1M tokens
  'claude-sonnet-4-6': { input: 3.00,  output: 15.00 },
  'text-embedding-3-small': { input: 0.02, output: 0 },
}

export function calculateCostCents(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const price = PRICING[model]
  if (!price) return 0
  const costUsd = (inputTokens / 1_000_000) * price.input
                + (outputTokens / 1_000_000) * price.output
  return Math.ceil(costUsd * 100)  // round up to nearest cent
}
```

### 23.3 Token Budget Enforcement

The `checkSubscriptionTier()` middleware checks token usage before any AI-triggering endpoint:

```typescript
// middleware/authorize.ts — checkTokenBudget()

async function checkTokenBudget(req, res, next) {
  const { user } = req
  const limits = TIER_LIMITS[user.subscription_tier]  // { monthly_tokens: 500_000 | 5_000_000 }

  const periodStart = startOfMonth(new Date())
  const usage = await prisma.usage_events.aggregate({
    where: { user_id: user.id, created_at: { gte: periodStart } },
    _sum: { input_tokens: true, output_tokens: true }
  })

  const totalUsed = (usage._sum.input_tokens || 0) + (usage._sum.output_tokens || 0)
  if (totalUsed >= limits.monthly_tokens) {
    return res.status(402).json({ error: { code: 'TOKEN_BUDGET_EXCEEDED',
      message: `You've used ${totalUsed.toLocaleString()} of your ${limits.monthly_tokens.toLocaleString()} monthly tokens. Upgrade to Pro to continue.` }
    })
  }
  next()
}
```

---

## 24. LOCAL DEVELOPMENT SETUP

*The docker-compose and step-by-step local setup guide is defined in Section 12.5. This section covers the testing architecture and CI pipeline configuration.*

### 24.1 Testing Architecture

**Unit Tests (Vitest):**

Location: `*.test.ts` files co-located with source files.

Required test coverage for each module:

```
services/auth.service.ts      → token generation, refresh rotation, revocation
services/project.service.ts   → status transitions, ownership validation
workers/discovery.worker.ts   → coverage completeness check, brief generation
workers/developer.worker.ts   → file parsing from agent output, path validation
workers/qa.worker.ts          → gate logic (PASS/FAIL routing)
lib/encryption.ts             → encrypt/decrypt roundtrip, key rotation
lib/cost-calculator.ts        → token cost calculation accuracy
middleware/authenticate.ts    → valid token, expired token, revoked token
middleware/authorize.ts       → owner match, non-owner rejection
```

**Integration Tests (Vitest + real DB):**

Use a dedicated test database (`avdf_test`). Tests run migrations fresh before the suite, seed minimal data, run tests, truncate tables. Never use production or development database.

```typescript
// vitest.config.ts
export default {
  test: {
    globalSetup: './tests/setup.ts',      // migrate + seed test DB
    globalTeardown: './tests/teardown.ts', // truncate tables
    environment: 'node',
    poolOptions: { threads: { singleThread: true } }  // sequential — DB state
  }
}
```

**E2E Tests (Playwright):**

Critical paths that must have E2E coverage:

```
auth.spec.ts          → register, login, logout, password reset
discovery.spec.ts     → full discovery conversation, brief approval
blueprint.spec.ts     → PRD display, approval gate, revision request
build.spec.ts         → phase progression, QA pass, phase approval
deployment.spec.ts    → deployment trigger, URL display
billing.spec.ts       → upgrade flow, portal access
```

### 24.2 CI Pipeline Configuration

**File:** `.github/workflows/ci.yml` (AVDF platform's own CI, not the generated app's CI)

```yaml
name: AVDF Platform CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:env-check   # validates .env.example completeness

  test-unit:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --reporter=verbose

  test-integration:
    needs: validate
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env: { POSTGRES_USER: avdf, POSTGRES_PASSWORD: avdf, POSTGRES_DB: avdf_test }
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
    env:
      DATABASE_URL: postgresql://avdf:avdf@localhost:5432/avdf_test
      REDIS_URL: redis://localhost:6379
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm prisma migrate deploy
      - run: pnpm test:integration

  build:
    needs: [test-unit, test-integration]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm audit --audit-level=high
```

---

## 25. NON-FUNCTIONAL REQUIREMENTS

### Performance
- API response time (p95): < 200ms for all non-AI-triggering endpoints
- API response time for AI-triggering endpoints: < 500ms (returns 202 immediately, work is async)
- Frontend Time to Interactive: < 2.5s on 4G connection
- Database queries: all queries with indexes, no full-table scans in hot paths
- Agent streaming latency: < 1s from job start to first streamed token on UI

### Reliability
- API uptime target: 99.9% (Railway/Render SLA)
- Database uptime: 99.95% (managed PostgreSQL SLA)
- BullMQ jobs: at-least-once delivery guarantee. All jobs are idempotent (safe to retry)
- Socket.io reconnection: automatic reconnection with exponential backoff, max 30s interval

### Scalability
- The API server is stateless and horizontally scalable (multiple instances behind a load balancer)
- Socket.io uses Redis adapter (`@socket.io/redis-adapter`) to support multi-instance deployments
- BullMQ workers scale independently of the API server
- Database connection pooling via Prisma (max 10 connections per server instance in prod)

### Security Compliance
- All user passwords hashed with bcrypt (cost factor 12)
- No PII in logs (email addresses, names are redacted to `user:uuid` in log output)
- GDPR: user data deletion endpoint clears all PostgreSQL records and S3 documents
- SOC 2 preparation: full audit log in `project_logs`, no data mutation without a log entry

---

*End of AVDF Platform PRD v1.1.0*

*This document is the single source of truth for the development of the AVDF Platform. All agents, all developers, and all architectural decisions reference this document. Any change to this document requires a formal revision process. The document version is incremented on every approved revision.*

**Changelog:**
- v1.0.0 — Initial PRD
- v1.1.0 — Added: Database Provisioning System (Neon), document_embeddings table + pgvector pipeline, PRD Summary Agent, Impact Analysis Agent, User App Deployment Service (Vercel/Railway/Render), Notification & Email Service (Resend), Stalled Job Recovery System, Auth Edge Cases (verification/reset/OAuth linking/account deletion), LLM Cost Model & Unit Economics, Local Development Setup (docker-compose, seed data, CI pipeline), Multi-Tenancy Data Isolation pattern
