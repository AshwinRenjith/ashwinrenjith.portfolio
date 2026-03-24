# SWEEPER — Autonomous Knowledge Janitor
## Product Requirements Document · v1.1 · FINAL (Revised)

> **Revision note:** v1.1 addresses ten gaps identified in the v1.0 review: Argon2/SHA-256 security inconsistency, missing LLM cost model and rate-limit strategy, false-positive calibration methodology, null `owner_email` handling, flag deduplication logic, dual-owner notification on resolution, worker scaling and sweep overlap handling, full deprecation undo propagation, dashboard authentication specification, and a missing "Chunk" glossary entry.

| Field | Value |
|---|---|
| Document Type | Final PRD — Build-Ready |
| Product | SweepR v1.1 |
| Status | Approved — Ready for Development |
| Audience | AI IDE (Antigravity) / Development Team |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Overview](#3-product-overview)
4. [Phased Build Plan](#4-phased-build-plan) *(moved forward as roadmap anchor)*
5. [Technology Stack](#5-technology-stack)
6. [Database Architecture](#6-database-architecture)
7. [System Architecture](#7-system-architecture)
8. [Core Engine — How SweepR Works](#8-core-engine--how-sweepr-works)
9. [LLM Cost Model & Rate Limit Strategy](#9-llm-cost-model--rate-limit-strategy) *(new)*
10. [False Positive Calibration](#10-false-positive-calibration) *(new)*
11. [Complete API Reference](#11-complete-api-reference)
12. [KB Integration — How They Connect](#12-kb-integration--how-they-connect)
13. [Security Architecture](#13-security-architecture)
14. [Complete Workflow Specification](#14-complete-workflow-specification)
15. [Configuration Reference](#15-configuration-reference)
16. [Dashboard UI Specification](#16-dashboard-ui-specification)
17. [Testing Requirements](#17-testing-requirements)
18. [Glossary](#18-glossary)
19. [Build Checklist — AI IDE Reference](#19-build-checklist--ai-ide-reference)

---

## 1. Executive Summary

SweepR is a standalone sidecar microservice that acts as an autonomous knowledge quality layer for any company running an internal AI Knowledge Base. It solves the "Garbage In, Garbage Out" problem inherent in all RAG-based systems by continuously scanning the knowledge corpus for semantic contradictions, outdated facts, and duplicated information — and proactively routing resolution tasks to the humans who own that content.

It does **NOT** modify the main KB product's codebase. SweepR integrates at the data layer (shared PostgreSQL instance, read-only access) and at the API layer (a thin webhook contract). The main KB product can adopt SweepR outputs progressively, making this a zero-risk add-on that enhances the core product's trust and accuracy story.

### The Core Loop in Plain English

1. SweepR reads your embedded knowledge corpus.
2. It auto-generates thousands of questions a real employee would ask.
3. It retrieves the top answers for each question from the same vector DB.
4. It sends those answer chunks to an LLM judge to check for factual conflicts.
5. If a conflict is found, it pings **both** document owners.
6. When the conflict is resolved, SweepR marks the stale content as deprecated.
7. The main KB chatbot now retrieves clean, conflict-free knowledge.

### Why It Exists as a Separate Product

- Zero disruption to the main KB codebase and co-founder's development velocity
- Can be sold as a standalone SKU to companies with any pgvector-based KB, not just yours
- Independent deployment, versioning, and release cycle
- Creates a defensible moat — most KB vendors don't think about data quality proactively

---

## 2. Problem Statement

### 2.1 Knowledge Rot Is Universal

Every company accumulates documentation debt at a faster rate than it audits it. A typical 200-person company that has been operating for 3+ years will have knowledge spread across Notion, Confluence, Google Drive, Slack, Jira, GitHub README files, and email threads. This corpus grows by hundreds of documents a month and is almost never systematically cleaned.

The result is a knowledge graph full of contradictions:

- Policy documents updated in one place but not another
- Slack messages that informally override formal documentation with no audit trail
- API documentation that is months or years behind the actual implementation
- Project timelines that exist in three different states across three different tools

### 2.2 Standard RAG Makes This Worse

A standard RAG pipeline is agnostic to truth. It retrieves the most semantically similar chunks regardless of which one is correct or more recent. When two contradictory chunks both have high cosine similarity to a query, the LLM will either hallucinate a reconciliation, randomly pick one, or produce a hedged non-answer. All three outcomes destroy user trust in the chatbot.

### 2.3 Why Humans Can't Fix This Alone

Manually auditing a 50,000-document corpus is an unbounded task. It requires reading each document, understanding the domain context, cross-referencing related documents, and making a judgment call about which version is authoritative. No team has the time or discipline to do this comprehensively, and it will always be deprioritised against shipping features or serving customers.

---

## 3. Product Overview

### 3.1 What SweepR Is

SweepR is a Python-based microservice deployed as a Docker container alongside the main KB service. It shares the same PostgreSQL database instance but operates in its own schema namespace (`sweeper.*`). It runs on a configurable schedule (default: nightly at 2 AM) or can be triggered on-demand via its REST API.

SweepR is not a user-facing chatbot. It has no end-user interface beyond a web-based operations dashboard used by the KB administrator. Its primary outputs are: flagged contradiction records, Slack/email notifications to document owners, and optional deprecation metadata tags written to a join table readable by the main KB.

### 3.2 What SweepR Is Not

- NOT a chatbot or end-user-facing product
- NOT a document editor or CMS
- NOT a replacement for the main KB's ingestion pipeline
- NOT a service that writes to the main KB's tables directly
- NOT a data governance platform (it's narrowly focused on contradiction detection)

### 3.3 Integration Relationship to the Main KB

SweepR reads from `main_kb` schema (SELECT only). SweepR writes to its own `sweeper` schema. The main KB optionally reads from `sweeper.contradiction_flags` via a LEFT JOIN. Both services communicate via a single internal webhook endpoint. That is the complete integration surface.

---

## 4. Phased Build Plan

> Moved to Section 4 from Section 14 to serve as an upfront roadmap anchor.

### Phase 1 — Core Engine (Weeks 1–3)

**Goal:** A working sweep loop that writes contradiction flags to the database. No UI, no notifications.

- Set up Docker Compose with FastAPI, Celery, Redis, Postgres migrations
- Implement sweeper schema DDL via Alembic
- Implement KB reader (read-only queries on `main_kb.*`)
- Implement QueryForge with Mistral API integration (including embed batching and exponential backoff)
- Implement vector retrieval using pgvector
- Implement Judge with structured JSON output and confidence threshold filtering
- Implement deduplication check before inserting flags
- Wire full `sweep_corpus_task` as a Celery task with overlap guard
- Manual trigger via CLI: `python -m sweeper.run_sweep`
- Verify flags appear in `sweeper.contradiction_flags` table

### Phase 2 — API & Notifications (Weeks 4–5)

**Goal:** REST API live, Slack notifications working, outbound webhook configured.

- Implement FastAPI app with all endpoints from Section 11
- Implement API key authentication middleware using Argon2
- Implement rate limiting with `slowapi`
- Implement Slack notification dispatch (Block Kit messages) to **both** owners
- Implement inbound Slack webhook for resolution actions
- Implement null `owner_email` fallback routing
- Implement email fallback notification
- Implement outbound webhook to main KB (including `tag.removed` event)
- Auto-generated Swagger docs at `/docs`

### Phase 3 — Dashboard (Weeks 6–7)

**Goal:** Admin UI for reviewing and resolving conflicts, with proper authentication.

- React SPA with all 8 pages from Section 16
- JWT session authentication for dashboard (login page + protected routes)
- Flags table with filtering, sorting, pagination
- `ConflictDetail` side-by-side view with both owners shown
- Resolution form with action dropdown, notes field, and confirmation step
- Stats dashboard with charts
- API key management in Settings
- Sweep scheduling config in Settings

### Phase 4 — KB Integration Badge (Week 8)

**Goal:** Main KB retrieval query enriched with SweepR deprecation warnings.

- Grant `kb_svc` role access to `sweeper.kb_deprecation_tags`
- Main KB adds LEFT JOIN to retrieval query (one-line change, coordinate with co-founder)
- KB chatbot prompt updated to handle `sweeper_warning` field
- End-to-end test: ingest conflicting docs → sweep → resolve → confirm KB chatbot shows warning
- End-to-end undo test: remove deprecation tag → confirm warning disappears on next retrieval

---

## 5. Technology Stack

### 5.1 Full Stack Specification

| Layer | Technology | Justification |
|---|---|---|
| Runtime Language | Python 3.11+ | ML ecosystem, async support, team familiarity |
| Web Framework | FastAPI 0.110+ | Async-native, auto OpenAPI docs, fast |
| Task Queue | Celery 5.x + Redis 7 | Distributed async tasks, sweep job management |
| Job Scheduler | Celery Beat | Cron-based scheduling for sweep runs |
| Message Broker | Redis 7 (Alpine) | Lightweight, already common in Python stacks |
| Primary Database | PostgreSQL 15 (shared) | Same instance as KB — `sweeper` schema |
| Vector Operations | pgvector extension | Same as KB — reuse existing embeddings |
| Embeddings API | Mistral AI (`mistral-embed`) | Same model as KB — vector compatibility |
| LLM Judge | Mistral Large / Mixtral 8x7B | Contradiction analysis, structured JSON output |
| ORM | SQLAlchemy 2.0 (async) | Async DB operations, type safety |
| Migrations | Alembic | Schema versioning for `sweeper.*` tables |
| Dashboard Frontend | React 18 + Vite + TailwindCSS | Modern, fast, standalone SPA |
| HTTP Client | httpx (async) | Async API calls to Mistral, Slack, webhooks |
| Data Validation | Pydantic v2 | Request/response models, config validation |
| API Key Hashing | argon2-cffi | Proper password-class hashing for stored keys |
| Containerisation | Docker + Docker Compose | Isolated deployment, easy local dev |
| Reverse Proxy | Nginx (Alpine) | SSL termination, API gateway |
| Secrets Management | Environment variables + python-dotenv | Simple, portable |
| Testing | pytest + pytest-asyncio | Async test support |
| API Documentation | FastAPI auto-docs (Swagger + ReDoc) | Auto-generated from code |
| Logging | structlog + JSON format | Structured logs for observability |
| Monitoring | Prometheus metrics endpoint | Optional — `/metrics` for scraping |

### 5.2 Python Dependencies (`requirements.txt`)

```
# Core
fastapi==0.110.0
uvicorn[standard]==0.29.0
pydantic==2.7.0
pydantic-settings==2.2.1
python-dotenv==1.0.1

# Database
sqlalchemy[asyncio]==2.0.29
asyncpg==0.29.0
alembic==1.13.1
pgvector==0.2.5

# Task Queue
celery[redis]==5.3.6
redis==5.0.3
flower==2.0.1

# AI / ML
mistralai==0.4.2
numpy==1.26.4
tiktoken==0.6.0

# HTTP
httpx==0.27.0

# Security
argon2-cffi==23.1.0
python-jose[cryptography]==3.3.0  # JWT for dashboard sessions
passlib[argon2]==1.7.4

# Utilities
structlog==24.1.0
prometheus-fastapi-instrumentator==6.1.0
python-multipart==0.0.9
slowapi==0.1.9
tenacity==8.2.3  # Exponential backoff for Mistral API calls
```

---

## 6. Database Architecture

### 6.1 Schema Ownership Model

The PostgreSQL instance is shared between the main KB and SweepR. Two distinct schemas enforce the ownership boundary. The main KB owns `main_kb.*`. SweepR owns `sweeper.*`. Cross-schema communication is via a read-only Postgres role and a single optional join table that the main KB can query.

```sql
CREATE ROLE sweeper_svc WITH LOGIN PASSWORD '<secret>';
GRANT USAGE ON SCHEMA main_kb TO sweeper_svc;
GRANT SELECT ON ALL TABLES IN SCHEMA main_kb TO sweeper_svc;
GRANT ALL ON SCHEMA sweeper TO sweeper_svc;
GRANT ALL ON ALL TABLES IN SCHEMA sweeper TO sweeper_svc;
```

### 6.2 SweepR Schema: Complete DDL

```sql
-- =====================================================
-- SWEEPER SCHEMA — Complete DDL
-- =====================================================

CREATE SCHEMA IF NOT EXISTS sweeper;

-- Enum types
CREATE TYPE sweeper.sweep_status AS ENUM
  ('pending', 'running', 'completed', 'failed', 'cancelled');

CREATE TYPE sweeper.conflict_status AS ENUM
  ('open', 'resolved', 'dismissed', 'escalated');

CREATE TYPE sweeper.conflict_severity AS ENUM
  ('low', 'medium', 'high', 'critical');

CREATE TYPE sweeper.resolution_action AS ENUM
  ('chunk_a_wins', 'chunk_b_wins', 'both_outdated',
   'merged', 'dismissed_false_positive');

-- ─── SWEEP RUNS ─────────────────────────────────────
CREATE TABLE sweeper.sweep_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_by    VARCHAR(50) NOT NULL DEFAULT 'scheduler',
  status          sweeper.sweep_status NOT NULL DEFAULT 'pending',
  scope           JSONB NOT NULL DEFAULT '{}',
  total_docs      INTEGER,
  total_queries   INTEGER,
  total_conflicts INTEGER DEFAULT 0,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  error_message   TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SYNTHETIC QUERIES ──────────────────────────────
CREATE TABLE sweeper.synthetic_queries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweep_run_id    UUID REFERENCES sweeper.sweep_runs(id) ON DELETE CASCADE,
  source_chunk_id VARCHAR(255) NOT NULL,
  question_text   TEXT NOT NULL,
  embedding       vector(1024),
  retrieval_done  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONTRADICTION FLAGS ────────────────────────────
-- NOTE: The partial unique index below prevents the same chunk pair from
-- generating duplicate open flags across nightly sweep runs. On conflict,
-- the engine updates the last_seen_at timestamp and increments detection_count
-- rather than inserting a new row.
CREATE TABLE sweeper.contradiction_flags (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sweep_run_id      UUID REFERENCES sweeper.sweep_runs(id),
  query_id          UUID REFERENCES sweeper.synthetic_queries(id),
  chunk_id_a        VARCHAR(255) NOT NULL,
  chunk_id_b        VARCHAR(255) NOT NULL,
  source_a          VARCHAR(500),
  source_b          VARCHAR(500),
  owner_a           VARCHAR(255),
  owner_b           VARCHAR(255),
  conflict_summary  TEXT NOT NULL,
  severity          sweeper.conflict_severity NOT NULL DEFAULT 'medium',
  confidence_score  FLOAT NOT NULL DEFAULT 0.0,
  status            sweeper.conflict_status NOT NULL DEFAULT 'open',
  resolution_action sweeper.resolution_action,
  resolved_by       VARCHAR(255),
  resolved_at       TIMESTAMPTZ,
  notified_at       TIMESTAMPTZ,
  notification_ch   VARCHAR(50),
  detection_count   INTEGER NOT NULL DEFAULT 1,
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  flagged_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deduplication: only one open flag per (chunk_a, chunk_b) pair,
-- regardless of which sweep run detected it. Resolved/dismissed flags
-- are excluded so a re-opened conflict can create a new flag.
CREATE UNIQUE INDEX idx_flags_dedup_open
  ON sweeper.contradiction_flags (
    LEAST(chunk_id_a, chunk_id_b),
    GREATEST(chunk_id_a, chunk_id_b)
  )
  WHERE status = 'open';

-- ─── RESOLUTION LOG ─────────────────────────────────
CREATE TABLE sweeper.resolution_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_id     UUID REFERENCES sweeper.contradiction_flags(id) ON DELETE CASCADE,
  actor           VARCHAR(255) NOT NULL,
  action          sweeper.resolution_action NOT NULL,
  notes           TEXT,
  deprecated_chunk_id VARCHAR(255),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SOURCE REGISTRY ────────────────────────────────
CREATE TABLE sweeper.source_registry (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type     VARCHAR(50) NOT NULL,
  source_name     VARCHAR(255) NOT NULL,
  connection_cfg  JSONB NOT NULL DEFAULT '{}',
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  last_synced_at  TIMESTAMPTZ,
  doc_count       INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── KB DEPRECATION TAGS (readable by main KB) ─────
CREATE TABLE sweeper.kb_deprecation_tags (
  chunk_id        VARCHAR(255) PRIMARY KEY,
  conflict_id     UUID REFERENCES sweeper.contradiction_flags(id),
  tag_type        VARCHAR(50) NOT NULL,
  warning_label   TEXT,
  deprecated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at      TIMESTAMPTZ  -- set when deprecation is undone; retained for audit
);

-- ─── DASHBOARD USERS ────────────────────────────────
CREATE TABLE sweeper.dashboard_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,  -- Argon2id hash
  role            VARCHAR(50) NOT NULL DEFAULT 'operator',  -- admin | operator | read-only
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ
);

-- ─── INDICES ─────────────────────────────────────────
CREATE INDEX idx_flags_status     ON sweeper.contradiction_flags(status);
CREATE INDEX idx_flags_chunk_a    ON sweeper.contradiction_flags(chunk_id_a);
CREATE INDEX idx_flags_chunk_b    ON sweeper.contradiction_flags(chunk_id_b);
CREATE INDEX idx_flags_flagged_at ON sweeper.contradiction_flags(flagged_at DESC);
CREATE INDEX idx_queries_sweep    ON sweeper.synthetic_queries(sweep_run_id);
CREATE INDEX idx_queries_chunk    ON sweeper.synthetic_queries(source_chunk_id);
CREATE INDEX idx_runs_status      ON sweeper.sweep_runs(status);
CREATE INDEX idx_dep_tags_chunk   ON sweeper.kb_deprecation_tags(chunk_id);
-- Partial index: KB integration only needs active (non-removed) tags
CREATE INDEX idx_dep_tags_active  ON sweeper.kb_deprecation_tags(chunk_id)
  WHERE removed_at IS NULL;
```

### 6.3 Deduplication Logic (Application Layer)

The database unique index is the hard constraint. The application layer must implement the following upsert logic to avoid relying solely on the constraint for control flow:

```python
# sweeper_engine.py — deduplication before flag insert
async def upsert_contradiction_flag(session, flag_data: dict) -> str:
    """
    Returns 'created' if a new flag was inserted, 'updated' if an existing
    open flag was found for the same chunk pair (detection_count incremented).
    """
    # Normalise chunk pair order (a = lexicographically smaller)
    id_a = min(flag_data['chunk_id_a'], flag_data['chunk_id_b'])
    id_b = max(flag_data['chunk_id_a'], flag_data['chunk_id_b'])

    existing = await session.execute(
        text('''
            SELECT id FROM sweeper.contradiction_flags
            WHERE LEAST(chunk_id_a, chunk_id_b) = :id_a
              AND GREATEST(chunk_id_a, chunk_id_b) = :id_b
              AND status = 'open'
        '''),
        {'id_a': id_a, 'id_b': id_b}
    )
    row = existing.first()

    if row:
        await session.execute(
            text('''
                UPDATE sweeper.contradiction_flags
                SET detection_count = detection_count + 1,
                    last_seen_at    = NOW(),
                    confidence_score = GREATEST(confidence_score, :new_score)
                WHERE id = :flag_id
            '''),
            {'flag_id': row.id, 'new_score': flag_data['confidence_score']}
        )
        return 'updated'

    # Insert new flag
    await session.execute(
        text('''INSERT INTO sweeper.contradiction_flags
                (chunk_id_a, chunk_id_b, sweep_run_id, query_id, source_a,
                 source_b, owner_a, owner_b, conflict_summary, severity,
                 confidence_score)
               VALUES (:chunk_id_a, :chunk_id_b, :sweep_run_id, :query_id,
                       :source_a, :source_b, :owner_a, :owner_b,
                       :conflict_summary, :severity, :confidence_score)'''),
        {**flag_data, 'chunk_id_a': id_a, 'chunk_id_b': id_b}
    )
    return 'created'
```

### 6.4 Main KB Schema Reference (Read-Only for SweepR)

SweepR assumes the following minimal schema exists in the `main_kb` schema. If your KB schema differs, the only change required is updating the SQL queries in `sweeper/db/kb_reader.py`:

```sql
-- Expected tables in main_kb schema (SweepR reads these)
main_kb.documents (
  id          VARCHAR(255) PRIMARY KEY,
  title       TEXT,
  source_url  TEXT,
  source_type VARCHAR(100),   -- 'notion','gdrive','slack','jira','confluence'
  owner_email VARCHAR(255),   -- MAY BE NULL — see Section 14 for null handling
  created_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ,
  raw_text    TEXT
);

main_kb.embeddings (
  id          VARCHAR(255) PRIMARY KEY,
  document_id VARCHAR(255) REFERENCES main_kb.documents(id),
  chunk_text  TEXT NOT NULL,
  embedding   vector(1024),   -- Mistral embed dimension
  chunk_index INTEGER,
  metadata    JSONB
);
```

---

## 7. System Architecture

### 7.1 Service Components

| Component | Description |
|---|---|
| `sweeper-api` | FastAPI REST service. Exposes all external endpoints. Handles auth, rate limiting, webhook dispatch. |
| `sweeper-worker` | Celery worker process. Executes sweep jobs: query generation, vector retrieval, LLM judging, flag writing. |
| `sweeper-scheduler` | Celery Beat. Triggers nightly sweeps and periodic maintenance tasks via cron. |
| `sweeper-dashboard` | React SPA. Admin UI for viewing flags, managing resolutions, configuring sweep schedules. |
| `redis` | Message broker for Celery tasks. Also used as result backend and cache layer. |
| `nginx` | Reverse proxy. Routes `/api/*` to `sweeper-api`, `/*` to `sweeper-dashboard`. Handles SSL. |

### 7.2 Docker Compose Architecture

```yaml
version: '3.9'

services:
  sweeper-api:
    build: ./sweeper-api
    env_file: .env
    depends_on: [redis]
    ports: ['8001:8001']
    volumes: ['./logs:/app/logs']
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8001/health']
      interval: 30s
      timeout: 10s
      retries: 3

  sweeper-worker:
    build: ./sweeper-api
    # Concurrency: 4 workers suits a corpus up to ~20k chunks in a 4-hour window.
    # For larger corpora, scale horizontally — see Section 7.4 for guidance.
    command: celery -A sweeper.tasks worker --loglevel=info --concurrency=4
    env_file: .env
    depends_on: [redis]
    restart: unless-stopped

  sweeper-scheduler:
    build: ./sweeper-api
    command: celery -A sweeper.tasks beat --loglevel=info
    env_file: .env
    depends_on: [redis]
    restart: unless-stopped

  sweeper-dashboard:
    build: ./sweeper-dashboard
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes: ['redis_data:/data']
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    volumes:
      - './nginx/nginx.conf:/etc/nginx/nginx.conf:ro'
      - './nginx/certs:/etc/nginx/certs:ro'
    ports: ['80:80', '443:443']
    depends_on: [sweeper-api, sweeper-dashboard]
    restart: unless-stopped

volumes:
  redis_data:
```

### 7.3 Directory Structure

```
sweeper/
├── sweeper-api/
│   ├── sweeper/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app entry
│   │   ├── config.py             # Pydantic settings
│   │   ├── auth.py               # API key + dashboard JWT middleware
│   │   ├── tasks.py              # Celery app + task definitions
│   │   ├── scheduler.py          # Celery Beat schedule config
│   │   │
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── sweeps.py     # Sweep run endpoints
│   │   │   │   ├── flags.py      # Contradiction flag endpoints
│   │   │   │   ├── resolve.py    # Resolution endpoints
│   │   │   │   ├── sources.py    # Source registry endpoints
│   │   │   │   ├── dashboard.py  # Dashboard stats endpoints
│   │   │   │   ├── webhook.py    # Outbound webhook config
│   │   │   │   └── auth.py       # Dashboard login/logout endpoints
│   │   │   └── router.py         # API router aggregation
│   │   │
│   │   ├── core/
│   │   │   ├── query_forge.py    # Synthetic question generator
│   │   │   ├── judge.py          # LLM contradiction judge
│   │   │   ├── sweeper_engine.py # Main sweep orchestrator
│   │   │   └── notifier.py       # Slack/email dispatcher
│   │   │
│   │   ├── db/
│   │   │   ├── session.py        # Async SQLAlchemy sessions
│   │   │   ├── models.py         # ORM models for sweeper.*
│   │   │   ├── kb_reader.py      # Read-only queries on main_kb.*
│   │   │   └── crud.py           # CRUD for sweeper.* tables
│   │   │
│   │   └── schemas/
│   │       ├── sweep.py          # Pydantic schemas
│   │       ├── flag.py
│   │       ├── resolution.py
│   │       └── auth.py
│   │
│   ├── alembic/                  # DB migrations
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── sweeper-dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlagsTable.tsx
│   │   │   ├── SweepRunCard.tsx
│   │   │   ├── ResolutionModal.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   └── ConflictDetail.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Flags.tsx
│   │   │   ├── FlagDetail.tsx
│   │   │   ├── Sweeps.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Sources.tsx
│   │   ├── hooks/useAuth.tsx      # JWT session hook
│   │   ├── api/sweeper-client.ts  # Typed API client
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf
│
├── .env.example
├── docker-compose.yml
└── README.md
```

### 7.4 Worker Scaling & Sweep Overlap Handling

#### Horizontal Scaling

The `sweeper-worker` service is stateless. To scale for larger corpora, run multiple worker container replicas. Each replica connects to the same Redis broker and pulls tasks from the shared queue:

```yaml
# docker-compose.override.yml — scale workers for large corpus
services:
  sweeper-worker:
    deploy:
      replicas: 4  # 4 containers × 4 concurrency = 16 parallel judge calls
```

| Corpus size | Recommended worker replicas | Estimated sweep time |
|---|---|---|
| ≤ 10,000 chunks | 1 (4 concurrency) | < 60 min |
| 10,000–50,000 chunks | 2–4 | < 4 hours |
| 50,000–200,000 chunks | 4–8 + local Mixtral judge | < 4 hours |

#### Sweep Overlap Guard

If a scheduled sweep is still running when the next cron tick fires, the scheduler must not start a second full-corpus sweep. The following lock mechanism is implemented in `tasks.py`:

```python
# tasks.py — sweep overlap guard using Redis lock
from celery import shared_task
from redis import Redis

SWEEP_LOCK_KEY = 'sweeper:full_sweep_running'
SWEEP_LOCK_TTL = 5 * 60 * 60  # 5 hours — longer than max sweep timeout

@shared_task(bind=True, max_retries=0)
def sweep_corpus_task(self, scope: dict = None):
    r = Redis.from_url(settings.redis_url)
    acquired = r.set(SWEEP_LOCK_KEY, self.request.id, nx=True, ex=SWEEP_LOCK_TTL)
    if not acquired:
        # Another sweep is running — skip this tick, log warning
        logger.warning('sweep_skipped_overlap', reason='lock_held')
        return {'status': 'skipped', 'reason': 'another_sweep_running'}

    try:
        return run_full_sweep(scope)
    finally:
        r.delete(SWEEP_LOCK_KEY)
```

Manual on-demand sweeps (triggered via API) bypass the lock by default but can be made to respect it via an optional `respect_lock: true` parameter.

---

## 8. Core Engine — How SweepR Works

### 8.1 Phase 1 — Ingestion Read

SweepR never re-embeds documents. It reads from `main_kb.embeddings` directly. At the start of each sweep run, it loads a cursor over all active embeddings, batched in groups of 500 to avoid memory pressure. Each embedding record includes: `chunk_id`, `chunk_text`, source metadata (document title, owner email, source type, last updated timestamp).

```python
# kb_reader.py — Read embeddings from KB
async def stream_kb_embeddings(session, batch_size=500):
    query = text('''
        SELECT
            e.id          AS chunk_id,
            e.chunk_text,
            e.embedding,
            d.owner_email,
            d.source_url,
            d.source_type,
            d.title       AS doc_title,
            d.updated_at
        FROM main_kb.embeddings e
        JOIN main_kb.documents d ON e.document_id = d.id
        ORDER BY e.id
    ''')
    result = await session.stream(query)
    async for partition in result.partitions(batch_size):
        yield partition
```

### 8.2 Phase 2 — QueryForge (Synthetic Question Generation)

For every chunk, SweepR calls Mistral to generate 3–5 synthetic questions that an employee might ask where this chunk would be a relevant answer. The prompt is engineered to produce factual, policy-level questions rather than vague conceptual ones. Generated questions are embedded using `mistral-embed` and stored in `sweeper.synthetic_queries`.

All Mistral API calls are wrapped with `tenacity` for exponential backoff — see Section 9.2 for the full retry strategy.

```python
# query_forge.py
QUERYFORGE_SYSTEM_PROMPT = '''
You are a knowledge auditor. Given a document chunk from an internal
company knowledge base, generate EXACTLY {n} questions that a real
employee would ask, where this chunk contains a partial or complete answer.

RULES:
- Questions must be specific and factual, not vague
- Focus on facts that could change over time (policies, deadlines,
  credentials, ownership, procedures, numbers)
- Do NOT generate opinion questions
- Output ONLY a JSON array of question strings, nothing else

Example output: ["What is the refund policy?", "Who owns the AWS account?"]
'''

async def generate_questions(chunk_text: str, n: int = 4) -> list[str]:
    response = await mistral_client_with_retry.chat.complete_async(
        model='mistral-large-latest',
        messages=[
            {'role': 'system', 'content': QUERYFORGE_SYSTEM_PROMPT.format(n=n)},
            {'role': 'user', 'content': f'CHUNK:\n{chunk_text}'}
        ],
        response_format={'type': 'json_object'},
        temperature=0.3,
        max_tokens=500
    )
    return json.loads(response.choices[0].message.content)
```

### 8.3 Phase 3 — Vector Retrieval

For each synthetic question, SweepR embeds the question text using the same Mistral model used by the main KB (`mistral-embed`). It then queries the pgvector index on `main_kb.embeddings` using cosine distance, retrieving the top 5 most semantically similar chunks.

```python
# sweeper_engine.py — Vector retrieval using pgvector
async def retrieve_top_k(session, question_embedding, k=5) -> list[dict]:
    query = text('''
        SELECT
            e.id AS chunk_id,
            e.chunk_text,
            d.title,
            d.owner_email,
            d.source_url,
            d.updated_at,
            1 - (e.embedding <=> :query_vec::vector) AS similarity
        FROM main_kb.embeddings e
        JOIN main_kb.documents d ON e.document_id = d.id
        ORDER BY e.embedding <=> :query_vec::vector
        LIMIT :k
    ''')
    result = await session.execute(
        query,
        {'query_vec': str(question_embedding), 'k': k}
    )
    return [dict(row) for row in result.mappings()]
```

### 8.4 Phase 4 — The Judge (Contradiction Detection)

This is the core of SweepR's value. For each question and its top-5 retrieved chunks, an LLM judge receives all 5 chunks simultaneously and evaluates them for factual contradictions. The judge is instructed to return a structured JSON response with specific conflicting chunk pairs, a human-readable summary, and a severity rating. Only pairs with confidence above the threshold (default: 0.75) are written as flags.

See Section 10 for guidance on calibrating this threshold and validating the false positive rate.

```python
# judge.py
JUDGE_SYSTEM_PROMPT = '''
You are a knowledge quality auditor. You will be given a question
and 5 document chunks retrieved as answers to that question.

Your job: identify if any two chunks contain FACTUALLY CONTRADICTORY
information about the SAME subject.

A contradiction means: Chunk A states X is true, Chunk B states X is
false OR a different value of X. They cannot both be correct.

NOT a contradiction: different levels of detail, different perspectives,
or complementary information about different aspects.

OUTPUT FORMAT (strict JSON, no other text):
{
  "has_contradiction": boolean,
  "confidence": float (0.0 to 1.0),
  "severity": "low" | "medium" | "high" | "critical",
  "conflicting_pairs": [
    {
      "chunk_id_a": string,
      "chunk_id_b": string,
      "conflict_summary": string (max 200 chars),
      "fact_a": string (the specific claim in chunk A),
      "fact_b": string (the specific claim in chunk B)
    }
  ]
}

If no contradiction, return has_contradiction: false with empty array.
'''
```

### 8.5 Phase 5 — Notification Dispatch

When a contradiction is flagged with sufficient confidence, SweepR looks up `owner_email` from document metadata for **both** conflicting chunks. For each owner, it resolves the Slack user ID via email lookup and sends a structured Slack Block Kit message. If no Slack match is found, it falls back to email. If `owner_email` is null, it routes to the configured fallback channel/address (see Section 8.6).

**Both owners are always notified.** Owner A receives the full interactive message with resolution buttons. Owner B receives a separate informational DM indicating they have a document involved in a conflict and linking to the dashboard, so neither owner resolves a conflict in isolation without the other being aware.

```python
# notifier.py — Slack Block Kit notification (sent to owner A)
def build_slack_message_primary(flag: ConflictFlag, base_url: str) -> dict:
    return {
        'blocks': [
            {'type': 'header', 'text': {
                'type': 'plain_text',
                'text': '⚠️ SweepR found a knowledge conflict'
            }},
            {'type': 'section', 'text': {
                'type': 'mrkdwn',
                'text': f'*Conflict Summary:*\n{flag.conflict_summary}'
            }},
            {'type': 'section', 'fields': [
                {'type': 'mrkdwn', 'text': f'*Your document (Doc A):*\n<{flag.source_a}|{flag.doc_title_a}>'},
                {'type': 'mrkdwn', 'text': f'*Conflicting document (Doc B):*\n<{flag.source_b}|{flag.doc_title_b}>'}
            ]},
            {'type': 'context', 'elements': [
                {'type': 'mrkdwn', 'text': f'ℹ️ {flag.owner_b or "The other document owner"} has also been notified.'}
            ]},
            {'type': 'actions', 'elements': [
                {'type': 'button', 'text': {'type': 'plain_text', 'text': 'My Doc is Correct'},
                 'value': f'{flag.id}:chunk_a_wins', 'style': 'primary'},
                {'type': 'button', 'text': {'type': 'plain_text', 'text': 'Other Doc is Correct'},
                 'value': f'{flag.id}:chunk_b_wins'},
                {'type': 'button', 'text': {'type': 'plain_text', 'text': 'Both Outdated'},
                 'value': f'{flag.id}:both_outdated', 'style': 'danger'},
                {'type': 'button', 'text': {'type': 'plain_text', 'text': 'View in Dashboard'},
                 'url': f'{base_url}/flags/{flag.id}'}
            ]}
        ]
    }

# Awareness-only message sent to owner B
def build_slack_message_secondary(flag: ConflictFlag, base_url: str) -> dict:
    return {
        'blocks': [
            {'type': 'header', 'text': {
                'type': 'plain_text',
                'text': '📋 SweepR: your document is part of a conflict'
            }},
            {'type': 'section', 'text': {
                'type': 'mrkdwn',
                'text': (
                    f'*Your document* <{flag.source_b}|{flag.doc_title_b}> '
                    f'contains information that conflicts with '
                    f'<{flag.source_a}|{flag.doc_title_a}>.\n\n'
                    f'*Conflict:* {flag.conflict_summary}\n\n'
                    f'{flag.owner_a or "The other document owner"} has been '
                    f'asked to resolve this. You will be notified when it is resolved.'
                )
            }},
            {'type': 'actions', 'elements': [
                {'type': 'button', 'text': {'type': 'plain_text', 'text': 'View in Dashboard'},
                 'url': f'{base_url}/flags/{flag.id}'}
            ]}
        ]
    }
```

### 8.6 Null `owner_email` Handling

`owner_email` may be null for auto-ingested sources (Slack messages, Jira tickets, scraped pages). The notification system must never silently drop a flag. The following fallback ladder applies:

| Condition | Notification target |
|---|---|
| `owner_email` is set and Slack user found | Direct Slack DM to owner |
| `owner_email` is set but no Slack user match | Email to `owner_email` |
| `owner_email` is null | Post to `SWEEPER_FALLBACK_CHANNEL` (default: `#knowledge-alerts`) + email to `SWEEPER_FALLBACK_OWNER_EMAIL` if set |
| Both `owner_a` and `owner_b` are null | Post to fallback channel. Flag `notification_ch` = `fallback`. Admin sees unowned conflict in dashboard with a dedicated "Unowned Conflicts" filter. |

```python
# notifier.py — null owner fallback
async def notify_flag(flag: ConflictFlag):
    for side, owner_email, message_fn in [
        ('a', flag.owner_a, build_slack_message_primary),
        ('b', flag.owner_b, build_slack_message_secondary),
    ]:
        if owner_email:
            slack_user = await resolve_slack_user(owner_email)
            if slack_user:
                await send_slack_dm(slack_user, message_fn(flag, settings.base_url))
            else:
                await send_email(owner_email, flag)
        else:
            # Route to fallback
            await send_slack_channel(
                settings.slack_fallback_channel,
                build_slack_message_unowned(flag, side, settings.base_url)
            )
            if settings.fallback_owner_email:
                await send_email(settings.fallback_owner_email, flag)
```

---

## 9. LLM Cost Model & Rate Limit Strategy

> **This section is mandatory reading before deploying SweepR against a production corpus.** The cost and latency of Mistral API calls are the primary operational risk of the product.

### 9.1 Cost Model

The following estimates assume average chunk size of 400 tokens and average question length of 20 tokens. Actual costs will vary.

| Corpus size | QueryForge calls | Judge calls | Embed calls | Estimated cost (Mistral Large) |
|---|---|---|---|---|
| 1,000 chunks | 4,000 | 4,000 | 5,000 | ~$4–$10 |
| 10,000 chunks | 40,000 | 40,000 | 50,000 | ~$40–$100 |
| 50,000 chunks | 200,000 | 200,000 | 250,000 | ~$200–$600 |

**Cost assumptions:**
- QueryForge (Mistral Large): ~$3/1M input tokens, ~600 tokens per call → ~$0.002 per call
- Judge (Mistral Large): ~5 chunks × ~400 tokens input + system prompt → ~2,500 tokens per call → ~$0.007 per call
- Embed (mistral-embed): ~$0.10/1M tokens — negligible relative to judge calls

**Cost control mechanisms:**

1. `max_chunks_per_sweep` config setting (default: 50,000) — hard ceiling on per-run scope
2. Token counting before each Mistral call using `tiktoken` — logs estimated cost per sweep run
3. `dry_run` mode — runs full pipeline without any Mistral API calls (uses mock responses) for cost estimation
4. Scope filtering — run targeted sweeps on recently modified documents only to avoid re-processing stable content

```python
# sweeper_engine.py — pre-flight cost estimate
def estimate_sweep_cost(chunk_count: int, questions_per_chunk: int = 4) -> dict:
    total_queries = chunk_count * questions_per_chunk
    total_judge_calls = total_queries
    queryforge_cost = total_queries * 0.002
    judge_cost = total_judge_calls * 0.007
    embed_cost = (total_queries * 20) / 1_000_000 * 0.10
    return {
        'total_queries': total_queries,
        'estimated_usd_min': round(queryforge_cost + embed_cost, 2),
        'estimated_usd_max': round(queryforge_cost + judge_cost + embed_cost, 2),
        'note': 'Max estimate assumes all judge calls find contradictions (worst-case token usage)'
    }
```

### 9.2 Rate Limit & Retry Strategy

Mistral's API enforces rate limits (requests per minute and tokens per minute). A sweep over a large corpus will hit these limits. All Mistral calls must be wrapped with `tenacity` for exponential backoff with jitter.

```python
# utils/mistral_client.py — retry wrapper
from tenacity import (
    retry, stop_after_attempt, wait_exponential,
    retry_if_exception_type, before_sleep_log
)
from mistralai.exceptions import MistralAPIException
import logging

logger = logging.getLogger(__name__)

@retry(
    retry=retry_if_exception_type(MistralAPIException),
    wait=wait_exponential(multiplier=1, min=2, max=60),
    stop=stop_after_attempt(5),
    before_sleep=before_sleep_log(logger, logging.WARNING),
    reraise=True
)
async def call_mistral_with_retry(fn, *args, **kwargs):
    return await fn(*args, **kwargs)
```

**Embed batching:** The `mistral-embed` API accepts up to 50 texts in a single request. The engine batches question embeddings in groups of 50 to reduce API call volume by ~50x:

```python
# sweeper_engine.py — embed batching
async def embed_questions_batched(questions: list[str], batch_size: int = 50) -> list[list[float]]:
    embeddings = []
    for i in range(0, len(questions), batch_size):
        batch = questions[i:i + batch_size]
        response = await call_mistral_with_retry(
            mistral_client.embeddings.create_async,
            model=settings.mistral_embed_model,
            inputs=batch
        )
        embeddings.extend([d.embedding for d in response.data])
    return embeddings
```

**Local Mixtral fallback:** For highly sensitive environments or cost-sensitive large corpora, SweepR can be configured to use a locally hosted Mixtral instance for the judge step:

```bash
# .env — switch judge to local Mixtral
SWEEPER_MISTRAL_JUDGE_MODEL=local
SWEEPER_LOCAL_JUDGE_URL=http://ollama:11434/api/chat
SWEEPER_LOCAL_JUDGE_MODEL_NAME=mixtral:8x7b
```

When `SWEEPER_MISTRAL_JUDGE_MODEL=local`, the judge routes to the local endpoint instead of the Mistral cloud API. QueryForge and embedding always use the Mistral cloud API (embedding compatibility with the main KB is required).

---

## 10. False Positive Calibration

### 10.1 The Problem

The 0.75 confidence threshold is a starting point, not a validated number. An LLM judge will produce false positives in the following scenarios:

- Complementary documents that use slightly different terminology for the same concept
- Documents written for different audiences (technical vs. non-technical) that appear contradictory but are not
- Versioned documents where both versions are valid in different contexts (e.g., "for EU customers" vs. "for US customers")
- Informally worded Slack messages that paraphrase a policy without contradicting it

### 10.2 Calibration Methodology

Before deploying against a production corpus, run the following calibration process:

**Step 1 — Build a labelled test set.** Manually curate 200 chunk pairs: 100 known true contradictions and 100 known non-contradictions. Store these in `sweeper/tests/calibration/test_pairs.json`.

**Step 2 — Threshold sweep.** Run the judge against the test set at confidence thresholds from 0.50 to 0.95 in 0.05 increments. Record precision, recall, and F1 at each threshold.

```python
# tests/calibration/calibrate_threshold.py
import json, asyncio
from sweeper.core.judge import run_judge

async def calibrate(test_pairs_path: str, thresholds: list[float]):
    with open(test_pairs_path) as f:
        pairs = json.load(f)

    for threshold in thresholds:
        tp = fp = tn = fn = 0
        for pair in pairs:
            result = await run_judge(pair['chunks'], pair['question'])
            predicted = result['has_contradiction'] and result['confidence'] >= threshold
            actual = pair['is_contradiction']
            if predicted and actual: tp += 1
            elif predicted and not actual: fp += 1
            elif not predicted and actual: fn += 1
            else: tn += 1

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall    = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
        print(f'threshold={threshold:.2f}  precision={precision:.2f}  recall={recall:.2f}  F1={f1:.2f}  FP%={fp/(fp+tn):.1%}')
```

**Step 3 — Select threshold.** Choose the threshold that achieves false positive rate ≤ 10% on your corpus. The default 0.75 is calibrated for general English business documents. Domain-specific corpora (legal, medical, technical) may require higher thresholds (0.85+).

**Step 4 — Monitor in production.** Track the `dismissed_false_positive` resolution action rate over time. If >20% of resolved flags are false positives in any 30-day window, raise the threshold by 0.05 and re-evaluate.

### 10.3 Monitoring Alert

Add a Prometheus alert for false positive rate drift:

```python
# Dashboard stat: /api/v1/dashboard/stats returns fp_rate_30d
# Alert: if fp_rate_30d > 0.20, log a warning and surface in dashboard banner

# Computed as:
fp_rate = dismissed_false_positives_last_30d / total_resolved_flags_last_30d
```

---

## 11. Complete API Reference

All endpoints are prefixed with `/api/v1`. Base URL: `https://your-sweeper-host/api/v1`. All API endpoints require an `X-API-Key` header. Dashboard session endpoints use JWT Bearer tokens. All responses are JSON. All list endpoints support pagination via `?page=1&limit=50`.

### 11.1 Health & System

| Endpoint | Description |
|---|---|
| `GET /health` | Service health check. Returns `{status: 'ok', version, db_connected, redis_connected}` |
| `GET /metrics` | Prometheus metrics endpoint (protected by separate metrics API key) |

### 11.2 Authentication (Dashboard)

```
POST /api/v1/auth/login
# Request Body
{ "email": "admin@company.com", "password": "..." }

# Response 200
{ "access_token": "eyJ...", "token_type": "bearer", "expires_in": 3600 }

POST /api/v1/auth/logout
# Invalidates the current session token (stored in Redis blocklist)

GET /api/v1/auth/me
# Returns current user profile: id, email, role, last_login_at
```

### 11.3 Sweep Runs

**`POST /api/v1/sweeps`** — Trigger a new sweep run manually.

```json
// Request Body
{
  "scope": {
    "source_types": ["notion", "gdrive"],  // Optional filter
    "document_ids": [],                      // Optional — specific docs
    "since": "2024-01-01T00:00:00Z"          // Optional — only new docs
  },
  "questions_per_chunk": 4,
  "retrieval_top_k": 5,
  "confidence_threshold": 0.75,
  "dry_run": false,
  "respect_lock": false  // If true, returns 409 if another sweep is running
}

// Response 202 Accepted
{
  "sweep_run_id": "uuid",
  "status": "pending",
  "estimated_duration_minutes": 45,
  "estimated_cost_usd": { "min": 42.0, "max": 105.0 }
}
```

**`GET /api/v1/sweeps`** — List all sweep runs with pagination.

**`GET /api/v1/sweeps/{sweep_id}`** — Get a specific sweep run with full detail including progress.

**`DELETE /api/v1/sweeps/{sweep_id}`** — Cancel a running sweep. Returns 409 if sweep is not in running/pending state.

**`GET /api/v1/sweeps/{sweep_id}/progress`** — Server-Sent Events stream.

```
data: {"phase": "querying", "progress": 0.42, "conflicts_found": 12, "estimated_cost_so_far_usd": 21.5}
```

### 11.4 Contradiction Flags

**`GET /api/v1/flags`** — List contradiction flags with filtering.

```json
// Query params: status, severity, source_type, owner_email, unowned (bool), page, limit
// Response 200
{
  "items": [{
    "id": "uuid",
    "conflict_summary": "Refund policy conflict: Doc A says 30 days, Slack says 14 days",
    "severity": "high",
    "confidence_score": 0.92,
    "status": "open",
    "chunk_id_a": "doc_abc_chunk_3",
    "chunk_id_b": "slack_msg_xyz",
    "source_a": "https://notion.so/...",
    "source_b": "https://slack.com/...",
    "owner_a": "alice@company.com",
    "owner_b": null,
    "detection_count": 3,
    "last_seen_at": "2024-01-18T02:15:00Z",
    "flagged_at": "2024-01-15T03:00:00Z",
    "notified_at": "2024-01-15T03:05:00Z",
    "notification_ch": "fallback"
  }],
  "total": 37,
  "open_count": 22,
  "resolved_count": 15,
  "unowned_count": 3
}
```

**`GET /api/v1/flags/{flag_id}`** — Get full flag detail.

**`POST /api/v1/flags/{flag_id}/resolve`** — Resolve a contradiction flag.

```json
// Request Body
{
  "action": "chunk_a_wins",
  "notes": "CEO confirmed 14-day policy is the new standard as of Jan 2024",
  "actor": "alice@company.com",
  "deprecate_chunk": true
}

// Response 200
{
  "flag_id": "uuid",
  "status": "resolved",
  "deprecated_chunk_id": "doc_abc_chunk_3",
  "deprecation_tag_created": true,
  "secondary_owner_notified": true  // indicates owner_b was sent an awareness DM
}
```

**`POST /api/v1/flags/{flag_id}/dismiss`** — Mark a flag as a false positive.

**`POST /api/v1/flags/{flag_id}/escalate`** — Escalate a flag to a supervisor/admin.

### 11.5 Resolution & Deprecation

**`GET /api/v1/resolutions`** — List all resolution records. Useful for audit trail.

**`GET /api/v1/deprecations`** — List all active deprecation tags (where `removed_at IS NULL`).

```json
// Response 200
{
  "items": [{
    "chunk_id": "doc_abc_chunk_3",
    "conflict_id": "uuid",
    "tag_type": "deprecated",
    "warning_label": "This policy information was superseded by a newer source on 2024-01-15",
    "deprecated_at": "2024-01-15T10:30:00Z"
  }]
}
```

**`DELETE /api/v1/deprecations/{chunk_id}`** — Undo a deprecation decision. See Section 12.5 for full propagation behaviour.

### 11.6 Source Registry

**`GET /api/v1/sources`**, **`POST /api/v1/sources`**, **`PATCH /api/v1/sources/{source_id}`**, **`DELETE /api/v1/sources/{source_id}`**

```json
// POST Request Body
{
  "source_type": "notion",
  "source_name": "Engineering Wiki",
  "connection_cfg": { "workspace_id": "abc123", "page_ids": [] },
  "enabled": true
}
```

### 11.7 Dashboard & Analytics

**`GET /api/v1/dashboard/stats`**

```json
{
  "total_documents_monitored": 12500,
  "total_sweep_runs": 42,
  "open_conflicts": 22,
  "resolved_conflicts": 147,
  "resolution_rate": 0.87,
  "avg_time_to_resolve_hours": 18.4,
  "fp_rate_30d": 0.07,
  "conflicts_by_severity": { "critical": 2, "high": 8, "medium": 10, "low": 2 },
  "conflicts_by_source_type": { "slack": 12, "notion": 6, "gdrive": 4 },
  "unowned_conflicts": 3,
  "last_sweep": {
    "id": "uuid",
    "completed_at": "2024-01-15T03:12:00Z",
    "conflicts_found": 37,
    "estimated_cost_usd": 48.20
  }
}
```

**`GET /api/v1/dashboard/trends`** — Time-series data. Accepts `?days=30`.

### 11.8 Webhooks & Notifications

**`POST /api/v1/webhooks/slack`** — Inbound Slack interactive actions endpoint.

**`POST /api/v1/webhooks/configure`** — Configure outbound webhook URL, secret, and event types.

**`GET /api/v1/webhooks/test`** — Send a test webhook event to verify connectivity.

---

## 12. KB Integration — How They Connect

### 12.1 Integration Contract Summary

| Touchpoint | What It Does | Required? |
|---|---|---|
| Postgres Read Access | SweepR reads `main_kb.embeddings` + documents (SELECT only, no writes) | YES — Core function |
| Outbound Webhook | SweepR notifies KB when a new conflict flag is created | Optional — Phase 2 |
| Deprecation Tag JOIN | KB retrieval query adds `LEFT JOIN` on `sweeper.kb_deprecation_tags` | Optional — Phase 4 |
| KB Webhook to SweepR | KB calls `POST /api/v1/sweeps` when new docs are ingested | Optional — Phase 3 |

### 12.2 Postgres Read Access Setup

```sql
-- Run once as superuser on the shared PostgreSQL instance

-- 1. Create the SweepR service role
CREATE ROLE sweeper_svc WITH LOGIN PASSWORD 'REPLACE_WITH_STRONG_SECRET';

-- 2. Grant read access to main KB schema
GRANT USAGE ON SCHEMA main_kb TO sweeper_svc;
GRANT SELECT ON main_kb.documents TO sweeper_svc;
GRANT SELECT ON main_kb.embeddings TO sweeper_svc;

-- 3. Grant full access to SweepR's own schema
CREATE SCHEMA IF NOT EXISTS sweeper;
GRANT ALL ON SCHEMA sweeper TO sweeper_svc;
ALTER DEFAULT PRIVILEGES IN SCHEMA sweeper
    GRANT ALL ON TABLES TO sweeper_svc;

-- 4. Grant KB service access to read SweepR's deprecation tags (optional)
GRANT USAGE ON SCHEMA sweeper TO kb_svc;
GRANT SELECT ON sweeper.kb_deprecation_tags TO kb_svc;
GRANT SELECT ON sweeper.contradiction_flags TO kb_svc;
```

### 12.3 Outbound Webhook — SweepR → Main KB

```python
# Webhook event payload
{
  "event": "flag.created",            # also: flag.resolved, sweep.completed, tag.removed
  "timestamp": "2024-01-15T03:05:00Z",
  "sweeper_version": "1.1.0",
  "data": {
    "flag_id": "uuid",
    "severity": "high",
    "conflict_summary": "Refund policy conflict detected",
    "chunk_ids": ["doc_abc_chunk_3", "slack_msg_xyz"],
    "owners": ["alice@company.com", null]  # null owner_email is preserved as null
  }
}

# Signature verification (X-SweepR-Signature header)
import hmac, hashlib
def verify_sweeper_webhook(payload: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

### 12.4 Phase 4 — Deprecation Tag JOIN (Main KB Side)

```sql
-- AFTER (with SweepR deprecation awareness)
SELECT
    e.chunk_text,
    e.embedding,
    dt.tag_type        AS sweeper_tag,
    dt.warning_label   AS sweeper_warning
FROM main_kb.embeddings e
LEFT JOIN sweeper.kb_deprecation_tags dt
    ON e.id = dt.chunk_id AND dt.removed_at IS NULL  -- only active tags
ORDER BY e.embedding <=> $1::vector
LIMIT 5;

-- The main KB's LLM prompt optionally includes:
-- if sweeper_warning: prepend '[OUTDATED: {warning_label}]' to chunk
```

### 12.5 Deprecation Undo — Full Propagation

When `DELETE /api/v1/deprecations/{chunk_id}` is called, the following chain executes:

1. `sweeper.kb_deprecation_tags.removed_at` is set to `NOW()` (row is retained for audit history, not hard-deleted)
2. An outbound webhook event `tag.removed` is fired to the configured KB webhook URL
3. The webhook payload includes `chunk_id` and the `conflict_id` that originally created the tag
4. The main KB, on receiving `tag.removed`, should invalidate any retrieval caches that may have included the warning label for that chunk
5. On the next KB retrieval query for any question that previously returned that chunk, the `LEFT JOIN` will return `NULL` for `sweeper_warning` (because `removed_at IS NULL` filter excludes it), so no application-layer change is required in the KB — the warning simply disappears naturally
6. The resolution record in `sweeper.resolution_log` is not deleted — the undo action is itself logged as a new resolution record with `action = 'deprecation_undone'`

```json
// tag.removed webhook payload
{
  "event": "tag.removed",
  "timestamp": "2024-01-20T09:00:00Z",
  "data": {
    "chunk_id": "doc_abc_chunk_3",
    "conflict_id": "uuid",
    "removed_by": "admin@company.com",
    "original_deprecated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 12.6 Inbound Webhook — Main KB → SweepR

```http
POST https://your-sweeper-host/api/v1/sweeps
X-API-Key: your-sweeper-api-key
Content-Type: application/json

{
  "scope": { "document_ids": ["new_doc_id_1", "new_doc_id_2"] },
  "triggered_by": "kb_ingestion_event"
}
```

---

## 13. Security Architecture

### 13.1 Authentication

#### API Key Authentication (External API)

All `X-API-Key` protected endpoints use **SHA-256** for key hashing. SHA-256 is appropriate here because API keys are 256-bit cryptographically random strings — they have inherently high entropy and are not user-chosen passwords. Argon2 is overkill for this use case and would add unnecessary latency to every API request. API keys are stored as `sha256(key)` in the database, never as plaintext.

```python
# auth.py — API Key middleware (SHA-256 for random high-entropy tokens)
import hashlib
from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader

api_key_header = APIKeyHeader(name='X-API-Key', auto_error=True)

async def verify_api_key(api_key: str = Security(api_key_header)):
    hashed = hashlib.sha256(api_key.encode()).hexdigest()
    key_record = await db.get_api_key(hashed)
    if not key_record or not key_record.active:
        raise HTTPException(status_code=403, detail='Invalid API key')
    return key_record
```

#### Dashboard User Authentication (Session-Based JWT)

Dashboard admin accounts use **Argon2id** for password hashing (the correct algorithm for user-chosen passwords, which have low entropy). On login, a short-lived JWT access token (1 hour) is issued. Token invalidation on logout is handled via a Redis blocklist.

```python
# auth.py — Dashboard user login (Argon2id for passwords)
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt
import secrets

ph = PasswordHasher(
    time_cost=2,      # iterations
    memory_cost=65536, # 64 MB
    parallelism=2,
    hash_len=32,
    salt_len=16
)

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return ph.verify(hashed, password)
    except VerifyMismatchError:
        return False

async def login(email: str, password: str) -> dict:
    user = await db.get_user_by_email(email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = jwt.encode(
        {'sub': str(user.id), 'role': user.role, 'exp': now + 3600},
        settings.dashboard_secret_key,
        algorithm='HS256'
    )
    return {'access_token': token, 'token_type': 'bearer', 'expires_in': 3600}
```

> **Summary of the split:** SHA-256 is used for API keys (random, high-entropy). Argon2id is used for dashboard passwords (user-chosen, low-entropy). These are different security problems requiring different solutions.

#### Webhook Signature Verification

All inbound webhooks (Slack interactive actions) are verified using HMAC-SHA256 with constant-time comparison.

### 13.2 Database Security

| Control | Implementation |
|---|---|
| Principle of Least Privilege | `sweeper_svc` role has SELECT-only on `main_kb.*`. Cannot INSERT, UPDATE, DELETE, DROP, or ALTER any main KB table. |
| Schema Isolation | `sweeper.*` and `main_kb.*` schemas act as a hard boundary. |
| No Cross-Schema Writes | SweepR application code only uses SQLAlchemy models mapped to `sweeper.*`. |
| Connection Encryption | All DB connections use SSL (`sslmode=require`). |
| Connection Pooling | SQLAlchemy async pool with `max_size=10`, `timeout=30s`. |
| Query Parameterisation | All queries use SQLAlchemy `text()` with bound parameters. No string concatenation in SQL. |

### 13.3 API Security

| Control | Implementation |
|---|---|
| Rate Limiting | `slowapi`: 100 req/min per API key, 10 req/min for sweep triggers. Returns 429 with `Retry-After` header. |
| Input Validation | All request bodies validated by Pydantic v2 schemas. |
| CORS | Restricted to configured allowed origins. Dashboard domain only by default. |
| HTTPS Only | Nginx configured with TLS 1.2+ only. HSTS header enabled. |
| Request Size Limit | Nginx: `client_max_body_size 1m`. |
| SQL Injection | SQLAlchemy ORM + parameterised `text()` queries. |

### 13.4 Secret Management

```bash
# .env.example
# Database
SWEEPER_DB_URL=postgresql+asyncpg://sweeper_svc:PASSWORD@db-host:5432/production
SWEEPER_DB_SSL=true

# Redis
REDIS_URL=redis://:PASSWORD@redis-host:6379/0

# Mistral AI
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_EMBED_MODEL=mistral-embed
MISTRAL_JUDGE_MODEL=mistral-large-latest
MISTRAL_LOCAL_JUDGE_URL=           # Optional — local Mixtral URL
MISTRAL_LOCAL_JUDGE_MODEL_NAME=    # Optional — e.g. mixtral:8x7b

# Slack
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_FALLBACK_CHANNEL=#knowledge-alerts

# SweepR
SWEEPER_API_KEY_SALT=random-256-bit-salt
SWEEPER_WEBHOOK_SECRET=random-256-bit-secret
SWEEPER_BASE_URL=https://sweeper.yourcompany.com
SWEEPER_FALLBACK_OWNER_EMAIL=kb-admin@yourcompany.com
SWEEPER_DASHBOARD_SECRET_KEY=random-256-bit-secret  # JWT signing key

# Email fallback
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-key
SMTP_FROM=sweeper@yourcompany.com

# App
SWEEPER_ENV=production
LOG_LEVEL=INFO
CORS_ORIGINS=https://sweeper.yourcompany.com
```

### 13.5 LLM Security

| Risk | Mitigation |
|---|---|
| Prompt injection via document content | Chunk text passed as user content, not system prompt. System prompt is hardcoded. |
| Sensitive data exposure to Mistral | Review Mistral DPA. Local Mixtral option available for judge step. |
| LLM cost runaway | `max_chunks_per_run` config limit. Pre-flight cost estimate before each sweep. Celery task timeout (4 hours). |
| Hallucinated conflict detection | `confidence_threshold` filter. Calibration methodology in Section 10. Human review before auto-deprecation. |

---

## 14. Complete Workflow Specification

### 14.1 Scheduled Nightly Sweep (Primary Flow)

1. Celery Beat triggers `sweep_corpus_task` at 2:00 AM UTC (configurable)
2. Overlap guard checks Redis lock — skips with warning if another sweep is running
3. Pre-flight cost estimate is logged and stored in `sweep_runs.metadata`
4. Task creates a `sweep_run` record with `status='running'`
5. Task reads all embeddings from `main_kb.embeddings` in batches of 500
6. For each batch, QueryForge generates 4 synthetic questions per chunk via Mistral (with retry)
7. Questions are batch-embedded (50 per call) using `mistral-embed`
8. For each question, pgvector retrieval fetches top-5 semantically similar chunks
9. The 5-chunk set is sent to the Mistral judge with the contradiction detection prompt
10. Judge responses with confidence ≥ 0.75 are passed to `upsert_contradiction_flag` (deduplication)
11. New flags trigger dual-owner notification (Section 8.5 + 8.6 null handling)
12. Sweep run marked `status='completed'`. Dashboard updated. Outbound webhook `sweep.completed` fired.

### 14.2 Human Resolution Flow (Slack)

1. Owner A receives Slack DM with conflict summary and 4 action buttons
2. Owner B simultaneously receives an awareness-only Slack DM
3. Owner A clicks one of: "My Doc is Correct", "Other Doc is Correct", "Both Outdated", "View in Dashboard"
4. Slack sends interactive action `POST` to `/api/v1/webhooks/slack`
5. SweepR verifies Slack signature, extracts `flag_id` and action from button value
6. Resolution record written to `sweeper.resolution_log`
7. Contradiction flag `status` updated to `'resolved'`
8. Deprecation tag written to `sweeper.kb_deprecation_tags` (if applicable)
9. **Owner B is sent a resolution confirmation DM** indicating which document was deemed authoritative
10. Confirmation message sent to Owner A's Slack DM
11. Outbound webhook fires `flag.resolved` event to main KB

### 14.3 Dashboard Resolution Flow (Alternative)

1. Admin opens SweepR dashboard at `/flags` and reviews open conflicts
2. Admin clicks a conflict row to open the `ConflictDetail` panel
3. Panel shows side-by-side chunk text comparison with source metadata, both owners displayed
4. Admin selects resolution action from dropdown and optionally adds notes
5. Admin clicks "Resolve" — a confirmation dialog appears showing which chunk will be deprecated
6. Admin confirms — calls `POST /api/v1/flags/{flag_id}/resolve`
7. Same downstream effects as Slack resolution flow (steps 6–11 above)

### 14.4 Event-Driven Sweep (Optional Enhancement)

1. Main KB completes ingestion of new documents
2. Main KB calls `POST /api/v1/sweeps` with `scope.document_ids = [new doc IDs]`
3. SweepR bypasses overlap lock (targeted sweep, separate task queue)
4. Sweep runs in minutes rather than hours
5. New conflicts detected and flagged same-day as content ingestion

### 14.5 Deprecation Undo Flow

1. Admin calls `DELETE /api/v1/deprecations/{chunk_id}`
2. `sweeper.kb_deprecation_tags.removed_at` set to `NOW()`
3. Resolution log entry created with `action = 'deprecation_undone'`
4. Outbound webhook fires `tag.removed` event to main KB
5. Main KB invalidates any retrieval caches for affected chunk
6. Next KB retrieval naturally omits the warning label (via `removed_at IS NULL` filter in JOIN)

---

## 15. Configuration Reference

```python
# config.py — Pydantic Settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    db_url: str
    db_ssl: bool = True
    db_pool_size: int = 10
    db_pool_timeout: int = 30

    # Redis
    redis_url: str

    # Mistral
    mistral_api_key: str
    mistral_embed_model: str = 'mistral-embed'
    mistral_judge_model: str = 'mistral-large-latest'
    mistral_embed_batch_size: int = 50
    mistral_max_retries: int = 5
    mistral_local_judge_url: str = ''   # Optional: local Mixtral URL
    mistral_local_judge_model_name: str = ''

    # Sweep defaults
    default_questions_per_chunk: int = 4
    default_retrieval_top_k: int = 5
    default_confidence_threshold: float = 0.75
    max_chunks_per_sweep: int = 50000
    sweep_schedule_cron: str = '0 2 * * *'
    sweep_timeout_seconds: int = 14400  # 4 hours

    # Notifications
    slack_bot_token: str = ''
    slack_signing_secret: str = ''
    slack_fallback_channel: str = '#knowledge-alerts'
    fallback_owner_email: str = ''  # Routes unowned flags to this address
    smtp_host: str = ''
    smtp_port: int = 587
    smtp_user: str = ''
    smtp_password: str = ''
    smtp_from: str = 'sweeper@example.com'

    # API
    api_key_salt: str
    webhook_secret: str
    base_url: str
    cors_origins: list[str] = []
    rate_limit_per_minute: int = 100

    # Dashboard auth
    dashboard_secret_key: str           # JWT signing key
    dashboard_token_expire_seconds: int = 3600

    class Config:
        env_file = '.env'
        env_prefix = 'SWEEPER_'
```

---

## 16. Dashboard UI Specification

### 16.1 Pages Overview

| Page / Route | Description |
|---|---|
| `/login` | Email + password login form. On success, stores JWT in memory (not localStorage for XSS safety). Redirects to `/dashboard`. |
| `/dashboard` | Overview stats: open conflicts, resolution rate, false positive rate (30d), last sweep status and cost, trends chart, severity breakdown donut chart. |
| `/flags` | Paginated, filterable table of all contradiction flags. Filters: status, severity, source type, owner, **unowned** (boolean). Bulk actions: dismiss, escalate. Badge on "Unowned" filter if `unowned_count > 0`. |
| `/flags/:id` | Side-by-side conflict detail view. Shows chunk A and chunk B text with metadata, `detection_count` badge, both owners. Resolution form with action dropdown, notes field, and confirmation dialog before submit. Resolution history log shown below. |
| `/sweeps` | List of all sweep runs with status badges, duration, docs scanned, conflicts found, estimated cost. Manual trigger button (opens config modal). |
| `/sweeps/:id` | Sweep run detail with phase progress, error messages if failed, list of conflicts found, cost breakdown. |
| `/sources` | Source registry management. Add/remove/enable/disable sources. |
| `/settings` | Sections: API Keys (generate/revoke), Dashboard Users (admin only — invite/manage), Notification settings (Slack, email, fallback channel, fallback owner email), Sweep schedule config, Confidence threshold tuning, Danger Zone (reset all flags for a date range). |

### 16.2 Key UX Flows

**Unowned Conflicts** — The `/flags` page shows a persistent amber banner when `unowned_count > 0`: *"N conflicts have no document owner. They were routed to your fallback channel. Review them here."*

**Dual-Owner Transparency** — The `/flags/:id` detail panel shows both owners clearly: "Owner A: alice@company.com" and "Owner B: (unowned — routed to #knowledge-alerts)". The resolution form shows a preview: "This will mark [chunk title] as deprecated and notify [owner_b] of the decision."

**`detection_count` Badge** — Flags detected in multiple consecutive sweeps show a "Seen 3× across 3 sweeps" badge in the detail view. This helps admins prioritise persistent conflicts over one-time detections.

**False Positive Dashboard Banner** — If `fp_rate_30d > 0.20`, a yellow banner appears on `/dashboard`: *"20%+ of resolved flags in the last 30 days were dismissed as false positives. Consider raising your confidence threshold in Settings."*

**Resolution Confirmation Dialog** — Before any resolution that creates a deprecation tag, a modal confirms: *"This will add a deprecation warning to [chunk title]. The main KB chatbot will label this chunk as outdated on its next retrieval. Are you sure?"*

### 16.3 Technology Stack (Frontend)

| Library / Tool | Version / Notes |
|---|---|
| React | 18.x with TypeScript |
| Vite | 5.x — build tool |
| TailwindCSS | 3.x — utility styling |
| shadcn/ui | Component library — tables, dialogs, badges, dropdowns |
| Recharts | Charts — trends line chart, severity donut, sweep history bar, cost trend line |
| TanStack Query | v5 — data fetching, caching, optimistic updates |
| React Router | v6 — client-side routing with protected route guards |
| Axios | HTTP client with interceptors for auth headers (attaches JWT to all requests) |
| date-fns | Date formatting and relative time display |

---

## 17. Testing Requirements

### 17.1 Unit Tests

- **QueryForge:** mock Mistral API, verify question generation with edge cases (empty chunk, code-only chunk, non-English chunk)
- **Judge:** test structured JSON parsing, confidence threshold filtering, false positive rate on the 200-pair calibration set
- **Deduplication:** verify `upsert_contradiction_flag` returns `'updated'` for duplicate open flags, `'created'` for new pairs, and `'created'` again after a flag is resolved
- **Vector retrieval:** test with mock pgvector, verify top-k ordering
- **Notifier:** test dual-owner notification (both A and B called), null `owner_email` fallback routing, email fallback
- **Auth middleware:** API key (SHA-256) — valid key, expired key, wrong key, missing header; dashboard JWT — valid token, expired token, revoked token
- **Cost estimator:** verify `estimate_sweep_cost` returns correct ranges for known inputs

### 17.2 Integration Tests

- Full sweep run on a synthetic dataset of 100 docs with 10 known contradictions and 10 identical-chunk pairs (dedup test). Verify all 10 contradictions flagged, zero duplicate flags.
- Re-run sweep on same dataset — verify `detection_count` incremented, no new flags created.
- Resolution flow: flag created → both owners notified → Slack resolution action → deprecation tag created → owner B receives confirmation DM
- Undo flow: deprecation removed → `tag.removed` webhook fired → KB retrieval query returns no `sweeper_warning` for that chunk
- Webhook delivery: configure test endpoint, verify signed payload received, signature validates
- Null `owner_email` flow: synthetic doc with no owner → verify flag routes to fallback channel

### 17.3 Performance Targets

| Metric | Target |
|---|---|
| 10,000 document corpus sweep time | < 60 minutes |
| 50,000 document corpus sweep time | < 4 hours (with 2 worker replicas) |
| False positive rate (LLM judge, calibrated corpus) | < 10% |
| API response time (p95) | < 200ms |
| Slack notification delivery time | < 30 seconds from flag creation |
| Dashboard load time (1,000 flags) | < 2 seconds |
| Deduplication check overhead per flag | < 5ms (index-covered query) |

---

## 18. Glossary

| Term | Definition |
|---|---|
| **Chunk** | A contiguous passage of text extracted from a source document during the KB ingestion pipeline. Chunks are the atomic unit of knowledge in any RAG system — a document is split into chunks of typically 200–600 tokens, each of which is independently embedded and stored in `main_kb.embeddings`. A chunk's boundaries significantly affect contradiction detection quality: chunks that are too small lose context, chunks that are too large dilute semantic similarity. |
| **Knowledge Rot** | The gradual degradation of a knowledge corpus quality as documents become outdated, contradicted, or orphaned. |
| **Synthetic Query** | A question generated by SweepR from document content, used to probe the corpus for contradictions. |
| **LLM-as-a-Judge** | The pattern of using a large language model to evaluate and compare the outputs of other model calls or documents. |
| **Contradiction Flag** | A record in `sweeper.contradiction_flags` representing a detected semantic conflict between two knowledge chunks. |
| **Deprecation Tag** | A record in `sweeper.kb_deprecation_tags` marking a specific chunk as superseded, readable by the main KB. |
| **Sweep Run** | A single execution of the full or partial contradiction detection pipeline. |
| **QueryForge** | SweepR's module responsible for generating synthetic questions from document chunks. |
| **Confidence Score** | A float (0.0–1.0) returned by the LLM judge indicating its certainty that a contradiction exists. |
| **Sidecar Service** | A deployment pattern where an auxiliary service runs alongside the primary service, sharing infrastructure but maintaining code independence. |
| **Resolution** | The human decision that closes a contradiction flag by marking which source is authoritative. |
| **Source Registry** | SweepR's catalog of knowledge sources being monitored (Notion, Slack, GDrive, etc.). |
| **False Positive Rate** | The proportion of contradiction flags dismissed as incorrect detections, computed over a rolling 30-day window. Monitored in the dashboard as `fp_rate_30d`. |
| **Detection Count** | The number of separate sweep runs in which a given chunk pair was independently flagged as contradictory. A higher detection count increases confidence that the conflict is real. |
| **Unowned Conflict** | A contradiction flag where one or both documents have a null `owner_email`. Routed to the configured fallback channel rather than a specific user. |

---

## 19. Build Checklist — AI IDE Reference

### Infrastructure
- [ ] Docker Compose with all 6 services (api, worker, scheduler, dashboard, redis, nginx)
- [ ] Dockerfile for `sweeper-api` (Python 3.11 base)
- [ ] Dockerfile for `sweeper-dashboard` (Node 20 + Vite build + Nginx serve)
- [ ] Nginx config with reverse proxy rules and SSL
- [ ] `.env.example` with all required variables (including `SWEEPER_FALLBACK_OWNER_EMAIL`, `SWEEPER_DASHBOARD_SECRET_KEY`)

### Database
- [ ] Alembic migrations for sweeper schema DDL (all 7 tables from Section 6.2 including `dashboard_users`)
- [ ] Enum types created before tables
- [ ] Partial unique index `idx_flags_dedup_open` created
- [ ] Partial index `idx_dep_tags_active` on `kb_deprecation_tags WHERE removed_at IS NULL`
- [ ] `removed_at` column on `kb_deprecation_tags`
- [ ] `detection_count` and `last_seen_at` columns on `contradiction_flags`
- [ ] All other indices created
- [ ] Postgres role creation script (separate from migrations)

### Core Engine
- [ ] `kb_reader.py` — async stream of KB embeddings
- [ ] `query_forge.py` — Mistral question generation with retry wrapper
- [ ] `judge.py` — Mistral contradiction judge with structured output
- [ ] `sweeper_engine.py` — orchestrates full sweep loop including deduplication upsert
- [ ] `sweeper_engine.py` — sweep overlap Redis lock
- [ ] `sweeper_engine.py` — pre-flight cost estimation
- [ ] `sweeper_engine.py` — embed batching (50 per call)
- [ ] `notifier.py` — dual-owner Slack notification (primary + secondary messages)
- [ ] `notifier.py` — null `owner_email` fallback routing ladder
- [ ] `notifier.py` — email fallback
- [ ] `utils/mistral_client.py` — `tenacity` retry wrapper with exponential backoff
- [ ] `tasks.py` — Celery task definitions
- [ ] `scheduler.py` — Celery Beat cron config

### API
- [ ] FastAPI app with all routers from Section 11
- [ ] API key middleware using SHA-256 (correct for high-entropy random tokens)
- [ ] Dashboard JWT auth endpoints (`/auth/login`, `/auth/logout`, `/auth/me`)
- [ ] JWT middleware for protected dashboard routes
- [ ] Rate limiting middleware
- [ ] CORS configuration
- [ ] SSE endpoint for sweep progress (including `estimated_cost_so_far_usd`)
- [ ] Slack webhook inbound handler with signature verification
- [ ] Outbound webhook dispatcher with HMAC signing (including `tag.removed` event)
- [ ] `DELETE /api/v1/deprecations/{chunk_id}` with full undo propagation
- [ ] Pydantic v2 schemas for all request/response models

### Dashboard
- [ ] React SPA with all 8 pages from Section 16 (including `/login`)
- [ ] JWT session management (`useAuth` hook, protected route HOC)
- [ ] Flags table with filter/sort/paginate including "unowned" filter
- [ ] Unowned conflicts amber banner
- [ ] `detection_count` badge in `ConflictDetail`
- [ ] Side-by-side `ConflictDetail` view showing both owners
- [ ] Resolution confirmation dialog showing deprecation preview
- [ ] False positive rate banner on dashboard when `fp_rate_30d > 0.20`
- [ ] Stats charts including cost trend (Recharts)
- [ ] API key management in Settings
- [ ] Dashboard user management in Settings (admin only)
- [ ] Fallback owner email + channel config in Settings
- [ ] Confidence threshold tuning in Settings

### Integration
- [ ] Postgres role grant script for main KB DBA
- [ ] Deprecation tag `LEFT JOIN` example including `removed_at IS NULL` filter
- [ ] Inbound trigger endpoint tested with mock KB call
- [ ] Outbound webhook verified with `/webhooks/test` endpoint
- [ ] `tag.removed` webhook event tested end-to-end

### Security
- [ ] All secrets via env vars, never hardcoded
- [ ] API keys hashed with **SHA-256** (high-entropy random tokens)
- [ ] Dashboard passwords hashed with **Argon2id** (user-chosen passwords)
- [ ] JWT signed with `SWEEPER_DASHBOARD_SECRET_KEY`
- [ ] JWT blocklist in Redis for logout
- [ ] HMAC-SHA256 webhook signature on all outbound events
- [ ] Slack signing secret verified on all inbound Slack webhooks
- [ ] Rate limiting active on all mutation endpoints
- [ ] Postgres `sweeper_svc` role has NO write access to `main_kb.*`

### Testing
- [ ] pytest suite with mocked Mistral API
- [ ] 200-pair calibration set for threshold tuning
- [ ] Deduplication test: same conflict on two sweeps → one flag with `detection_count = 2`
- [ ] Null `owner_email` test: flag routes to fallback, not silently dropped
- [ ] Deprecation undo integration test
- [ ] Dual-owner notification test: both A and B Slack DMs verified
- [ ] API endpoint tests with valid and invalid API keys
- [ ] Dashboard JWT tests: login, access protected route, logout, attempt reuse
- [ ] Webhook signature verification tests

---

*— END OF DOCUMENT — SweepR PRD v1.1 · Revised 25 February 2026*
