# AURA — COMPLETE PRODUCT ARCHITECTURE
### The Autonomous AI Sales Engine for Luxury Jewellery Brands

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                          ║
║     █████╗ ██╗   ██╗██████╗  █████╗                                                     ║
║    ██╔══██╗██║   ██║██╔══██╗██╔══██╗                                                    ║
║    ███████║██║   ██║██████╔╝███████║                                                    ║
║    ██╔══██║██║   ██║██╔══██╗██╔══██║                                                    ║
║    ██║  ██║╚██████╔╝██║  ██║██║  ██║                                                    ║
║    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                                                   ║
║                                                                                          ║
║    AI-Powered WhatsApp Sales Agent for Luxury Indian Jewellery                          ║
║    Version 0.2.0  ·  Confidential Architecture Document                                 ║
║                                                                                          ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## TABLE OF CONTENTS

```
PART 1  ·  Executive Overview & Product Identity
PART 2  ·  System Architecture & Database Schema
PART 3  ·  AI Engine — LangGraph Pipeline & Agent Network
PART 4  ·  Data Flows — End-to-End Journey Maps
PART 5  ·  Security Architecture — Every Shield Explained
PART 6  ·  Client & Customer Experience
PART 7  ·  Integrations, Queues, Compliance & Conclusion
```

---

# PART 1 — EXECUTIVE OVERVIEW & PRODUCT IDENTITY

---

## 1.1  What Is Aura?

Aura is a **multi-tenant B2B SaaS platform** that deploys fully autonomous AI sales agents
for luxury Indian jewellery brands. The agents operate exclusively through **WhatsApp Business**
— the channel where India's jewellery customers already live — converting inbound enquiries
into verified, confirmed in-store appointments with zero human intervention unless specifically
requested.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        THE AURA VALUE PROPOSITION                           │
│                                                                             │
│   BEFORE AURA                          AFTER AURA                          │
│   ──────────────                       ──────────────                      │
│   Staff answer WhatsApp 9am–9pm    →   AI answers 24 hours, 7 days        │
│   Product queries take 10 min      →   Instant, personalised answers      │
│   Appointments booked by phone     →   Auto-booked with Google Calendar   │
│   No record of customer taste      →   Memory-augmented buyer profiles    │
│   Generic festival broadcasts      →   Occasion-aware lifecycle messages  │
│   No virtual try-on                →   Real-time AI jewellery overlays    │
│   Custom design: weeks of calls    →   AI-generated concepts in minutes   │
│   Manual catalogue updates         →   Semantic vector search + CSV/PDF   │
│   No data compliance               →   DPDP Act 2023 full compliance      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.2  Who Uses Aura?

```
                        ┌──────────────────────────┐
                        │        AURA PLATFORM      │
                        └────────────┬─────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
   │   JEWELLERY       │   │   END CUSTOMERS   │   │  AURA TEAM       │
   │   BRANDS          │   │   (Shoppers)      │   │  (Super Admin)   │
   │   (Tenants)       │   │                  │   │                  │
   │                  │   │  Interact only    │   │  Manages         │
   │  • Upload catalog │   │  via WhatsApp     │   │  rollouts,       │
   │  • Configure AI   │   │  • Ask about      │   │  billing,        │
   │  • View analytics │   │    products       │   │  canary flags,   │
   │  • Launch         │   │  • Book visits    │   │  audit trails    │
   │    campaigns      │   │  • Request VTO    │   │                  │
   │  • Monitor convos │   │  • Get reminders  │   │                  │
   │  • Manage billing │   │  • Save via plans │   │                  │
   └──────────────────┘   └──────────────────┘   └──────────────────┘
          CLIENT                CUSTOMER               OPERATOR
```

---

## 1.3  The One Metric That Matters

Aura's entire system is engineered to maximise a **single North-Star metric**:

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          ★  VERIFIED IN-STORE APPOINTMENTS  ★                ║
║                                                               ║
║   Every feature — product search, VTO, AI design,            ║
║   lifecycle nudges, savings plans, memory recall —            ║
║   funnel toward one outcome: the customer walks in.           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 1.4  High-Level Architecture — The 30,000-Foot View

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                 EXTERNAL ACTORS                                        ║
║                                                                                        ║
║   ┌──────────────┐     ┌──────────────────┐     ┌─────────────┐    ┌───────────────┐  ║
║   │  END CUSTOMER│     │  JEWELLERY BRAND  │     │ META CLOUD  │    │ GOOGLE / PAY  │  ║
║   │  (WhatsApp)  │     │  (Web Dashboard) │     │  API (WA)   │    │ STRIPE/RAZOR  │  ║
║   └──────┬───────┘     └────────┬─────────┘     └──────┬──────┘    └───────┬───────┘  ║
╚══════════│══════════════════════│══════════════════════│═══════════════════│═══════════╝
           │  Message sent        │  Dashboard actions   │  Webhook/API      │  Webhooks
           ▼                      ▼                      ▼                   ▼
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                               AURA — CORE PLATFORM                                    ║
║                                                                                        ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐  ║
║  │                       FASTIFY API SERVER  (TypeScript)                          │  ║
║  │                                                                                 │  ║
║  │  /webhooks/meta   /api/conversations   /api/campaigns   /api/tenants           │  ║
║  │  /api/knowledge   /api/products        /api/billing     /api/appointments       │  ║
║  │  /api/lifecycle   /api/templates       /api/customers   /api/admin              │  ║
║  └────────────────────────────┬────────────────────────────────────────────────────┘  ║
║                               │                                                        ║
║         ┌─────────────────────┼──────────────────────┐                                ║
║         │                     │                      │                                 ║
║         ▼                     ▼                      ▼                                 ║
║  ┌─────────────┐    ┌──────────────────┐   ┌─────────────────┐                        ║
║  │  REDIS      │    │  PYTHON AI        │   │  SUPABASE       │                        ║
║  │  (BullMQ)   │    │  MICROSERVICE     │   │  (PostgreSQL +  │                        ║
║  │             │    │  (FastAPI +       │   │   pgvector +    │                        ║
║  │  4 Queues:  │    │   LangGraph +     │   │   RLS + RPC)    │                        ║
║  │  ai-jobs    │    │   Mistral AI)     │   │                 │                        ║
║  │  campaigns  │◄──►│                  │◄──►│  20+ Tables     │                        ║
║  │  embedding  │    │  /process         │   │  10+ RPCs       │                        ║
║  │  lifecycle  │    │  /embed           │   │  Storage Buckets│                        ║
║  └─────────────┘    │  /search          │   └─────────────────┘                        ║
║                     └──────────────────┘                                               ║
║                                                                                        ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐  ║
║  │                     NEXT.JS DASHBOARD  (React / App Router)                     │  ║
║  │                                                                                 │  ║
║  │  Clerk Auth  ·  Real-time via Supabase  ·  Conversations  ·  Campaigns         │  ║
║  │  Catalog  ·  Knowledge Base  ·  Billing  ·  Analytics  ·  AI Designer          │  ║
║  └─────────────────────────────────────────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 1.5  Technology Stack — Complete Reference

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           AURA TECHNOLOGY STACK                              │
├─────────────────┬────────────────────────────────────────────────────────────┤
│ LAYER           │ TECHNOLOGY                                                 │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Repo Structure  │ npm Workspaces Monorepo (apps/* + packages/*)              │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ API Server      │ Fastify 4 (TypeScript) — High-performance HTTP framework   │
│                 │ Zod — Schema validation / type safety                      │
│                 │ Pino — Structured JSON logging                             │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ AI Service      │ FastAPI + Uvicorn (Python 3.14)                            │
│                 │ LangGraph — Stateful multi-agent graph orchestration       │
│                 │ LangChain — Tool-calling abstractions                      │
│                 │ Mistral AI — LLM (small/large) + Embeddings (1024-dim)    │
│                 │ Pydantic — Request/response validation                     │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Frontend        │ Next.js 14+ (App Router, Server Components)                │
│                 │ Clerk — Auth & multi-tenancy (org-scoped JWTs)             │
│                 │ Supabase JS — Realtime websocket subscriptions             │
│                 │ Lucide React — Icon system                                 │
│                 │ PapaParse — CSV parsing for catalog import                 │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Database        │ Supabase / PostgreSQL 15+                                  │
│                 │ pgvector — 1024-dim vector similarity (HNSW indexes)       │
│                 │ Row Level Security (RLS) — tenant isolation                │
│                 │ Stored RPCs — business-logic in DB layer                   │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Queue / Cache   │ BullMQ — Job queue framework (on Redis)                   │
│                 │ IORedis — Redis client                                     │
│                 │ Redis — Idempotency locks, circuit breakers, caching       │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Auth            │ Clerk — Dashboard SSO, org management, RBAC               │
│                 │ Custom HMAC-SHA256 — Internal service-to-service tokens    │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Payments        │ Stripe — Subscription billing (global cards)               │
│                 │ Razorpay — UPI, Indian debit/credit card billing          │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Messaging       │ Meta WhatsApp Business Cloud API                           │
│                 │ Template management, interactive lists, image send         │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Calendar        │ Google Calendar API (OAuth 2.0 PKCE flow)                 │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ VTO / AI Design │ Nano Banana API — AI jewellery try-on engine               │
│                 │ Supabase Storage — Selfie + result image buckets           │
│                 │ Pillow/PIL — EXIF strip, image validation                  │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Doc Processing  │ Mammoth — DOCX → text extraction                          │
│                 │ pdf-parse — PDF → text extraction                          │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ Compliance      │ DPDP Act 2023 (India) — Right to Erasure, Right to Access │
├─────────────────┴────────────────────────────────────────────────────────────┤
│ Deployment      │ Monorepo · 3 services deploy independently                 │
│                 │ ai/ → Python/Uvicorn  ·  api/ → Node.js  ·  web/ → Next   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.6  Subscription plans

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          AURA PRICING TIERS                                   │
├────────────────┬────────────────────┬────────────────────┬────────────────────┤
│                │     STARTER        │      GROWTH        │    ENTERPRISE      │
│                │    ₹4,999/mo       │    ₹14,999/mo      │    ₹39,999/mo      │
├────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ AI Convos/mo   │       500          │       2,500        │      25,000        │
│ VTO Tries/mo   │        50          │        250         │       2,500        │
│ Messages/mo    │ Platform-wide      │ Platform-wide      │ Platform-wide      │
│ Custom Designs │  50 /mo            │  250 /mo           │ 2,500 /mo          │
│ Trial          │      —             │   14-day free      │      —             │
│ Payments       │ Stripe or Razorpay │ Stripe or Razorpay │ Stripe or Razorpay │
└────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

---

*End of Part 1*
# PART 2 — SYSTEM ARCHITECTURE & DATABASE SCHEMA

---

## 2.1  Three-Service Architecture

Aura is composed of **three independently deployable services** in a monorepo, each with
a distinct responsibility boundary.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        THREE-SERVICE DECOMPOSITION                          ║
║                                                                              ║
║   ┌───────────────────┐   ┌───────────────────┐   ┌──────────────────────┐ ║
║   │   apps/web        │   │    apps/api        │   │     apps/ai          │ ║
║   │   (Next.js)       │   │    (Fastify)       │   │     (FastAPI)        │ ║
║   │                   │   │                    │   │                      │ ║
║   │  • Dashboard UI   │   │  • REST API        │   │  • LangGraph agents  │ ║
║   │  • Clerk auth     │   │  • Webhook intake  │   │  • Mistral LLM calls │ ║
║   │  • Realtime subs  │   │  • Job enqueueing  │   │  • Vector embeddings │ ║
║   │  • No direct DB   │   │  • DB persistence  │   │  • RAG retrieval     │ ║
║   │    writes         │   │  • Payment events  │   │  • NO DB writes      │ ║
║   │                   │   │  • RBAC middleware │   │    (returns updates) │ ║
║   └─────────┬─────────┘   └────────┬───────────┘   └──────────┬───────────┘ ║
║             │                      │                           │             ║
║             │ HTTPS                │ Supabase JS               │ HMAC token  ║
║             ▼                      ▼                           │             ║
║   ┌─────────────────────────────────────────────────────────┐ │             ║
║   │              SUPABASE  (PostgreSQL + pgvector)          │◄┘             ║
║   │                  Row Level Security per tenant          │               ║
║   └─────────────────────────────────────────────────────────┘               ║
║   ┌─────────────────────────────────────────────────────────┐               ║
║   │                      REDIS                              │               ║
║   │   BullMQ queues  ·  Idempotency locks  ·  Breakers     │               ║
║   └─────────────────────────────────────────────────────────┘               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Key Architectural Rule:**
The AI microservice (`apps/ai`) is intentionally **stateless** with respect to the database.
It reads context at the start of each call and returns `state_updates` — a diff object the
API worker then persists. This keeps AI logic pure and testable, and keeps write authority
in the API layer.

---

## 2.2  API Server — Route Map

```
┌───────────────────────────────────────────────────────────────────────────┐
│                       FASTIFY API ROUTE TOPOLOGY                          │
├──────────────────────────┬────────────────────────────────────────────────┤
│ ROUTE GROUP              │ KEY ENDPOINTS                                  │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /webhooks/meta           │ GET (hub verify)  POST (inbound WA messages)   │
│ /webhooks/stripe         │ POST (billing events)                          │
│ /webhooks/razorpay       │ POST (billing events)                          │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/health              │ GET (DB + Redis liveness)                      │
│ /api/tenants             │ setup · waba-connect · agent-config · me       │
│                          │ meta-config · vto-config · ai-designer-config  │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/conversations       │ list · get · takeover · return-to-ai          │
│                          │ message · whisper                              │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/customers           │ list · import (bulk upsert) · delete           │
│ /api/products            │ list · patch · bulk-action · stats             │
│ /api/knowledge           │ upload · list · delete                         │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/templates           │ list · create · sync · delete                  │
│ /api/campaigns           │ list · create · launch · pause · resume        │
│                          │ audience-count · delete                        │
│ /api/appointments        │ create · patch-status · availability           │
│ /api/stores              │ list · create · availability · block-dates     │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/billing             │ status · create-subscription · manage          │
│                          │ invoices · razorpay-subscription               │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/lifecycle           │ programs CRUD · savings CRUD                   │
│                          │ admin: scheduler · health · canary             │
│ /api/design-sessions     │ analytics · list · detail · handoff            │
│ /api/integrations        │ google/auth · google/callback                  │
├──────────────────────────┼────────────────────────────────────────────────┤
│ /api/admin               │ queues/failed · queues/stats                   │
│                          │ design-audit · canary control                  │
│ /catalog                 │ search (semantic proxy) · import-jobs          │
│                          │ media-upload-sessions                          │
└──────────────────────────┴────────────────────────────────────────────────┘
```

---

## 2.3  Multi-Tenant Isolation Model

Every request through the API is **tenant-scoped** before touching the database.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    MULTI-TENANT REQUEST LIFECYCLE                         │
│                                                                           │
│  1. HTTP Request arrives                                                  │
│            │                                                              │
│            ▼                                                              │
│  2. Clerk JWT verified → extracts clerk_org_id                           │
│            │                                                              │
│            ▼                                                              │
│  3. Lookup: tenants WHERE clerk_org_id = ?  → resolves tenant_id (UUID)  │
│            │                                                              │
│            ▼                                                              │
│  4. PostgreSQL SET app.tenant_id = '<uuid>'                               │
│            │                                                              │
│            ▼                                                              │
│  5. ALL queries filtered by RLS policy:                                   │
│       USING (tenant_id = current_setting('app.tenant_id')::uuid)         │
│            │                                                              │
│     ┌──────┴──────────────────────────────────────────────┐              │
│     │  Customer A's data is PHYSICALLY IMPOSSIBLE to       │              │
│     │  reach from Customer B's session at the DB level    │              │
│     └─────────────────────────────────────────────────────┘              │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2.4  Complete Database Schema

The database has **17 migration phases** and **20+ production tables**.

### 2.4.1  Core Identity Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: tenants                                                                   │
│  Description: One row per jewellery brand. Master config for the entire tenant.  │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  COLUMN              │  PURPOSE                                                 │
├──────────────────────┼─────────────────────────────────────────────────────────┤
│  id UUID PK          │  Tenant identity                                         │
│  name TEXT           │  Brand name displayed in UI                              │
│  clerk_org_id TEXT   │  Maps Clerk org → tenant (lookup key)                   │
│  waba_id TEXT        │  WhatsApp Business Account ID (Meta)                    │
│  phone_number_id     │  META WA phone number for sending messages               │
│  meta_access_token   │  Encrypted; never returned to frontend                  │
│  stripe_customer_id  │  Stripe identity                                         │
│  stripe_sub_id       │  Active subscription                                     │
│  razorpay_sub_id     │  Indian payment subscription                             │
│  plan TEXT           │  starter / growth / enterprise                           │
│  plan_status TEXT    │  trialing / active / past_due / cancelled / inactive     │
│  trial_ends_at       │  14-day trial expiry                                     │
│  google_*tokens      │  OAuth tokens for Calendar sync                          │
│  ai_designer_enabled │  Feature flag for AI custom design                       │
│  vto_enabled         │  Feature flag for Virtual Try-On                         │
│  nano_banana_api_key │  Encrypted; never returned to frontend                  │
│  lifecycle_enabled   │  Lifecycle messaging feature gate                        │
│  lifecycle_rollout   │  internal/canary_1/canary_5/canary_25/ga                │
│  agent_persona JSONB │  AI name, brand tone, signature style                   │
│  onboarding_complete │  Onboarding wizard completion gate                       │
└──────────────────────┴─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: customers                                                                 │
│  Description: Every WhatsApp user who has messaged a tenant.                     │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  id UUID PK          │  Customer identity                                        │
│  tenant_id UUID FK   │  Owning brand (RLS key)                                  │
│  whatsapp_number     │  E.164 format (+91XXXXXXXXXX) — unique per tenant        │
│  full_name TEXT      │  Resolved from contact or set by AI                      │
│  lifetime_value      │  NUMERIC — total purchase value in INR                   │
│  last_visited        │  Last physical store visit timestamp                      │
│  opted_out BOOLEAN   │  GDPR/DPDP opt-out flag                                  │
│  marketing_opt_in    │  Explicit marketing consent                               │
│  date_of_birth DATE  │  For Birthday lifecycle triggers                         │
│  anniversary_date    │  For Anniversary lifecycle triggers                      │
│  timezone TEXT       │  For quiet-hours calculation                             │
│  preferred_language  │  For multilingual responses                              │
│  UNIQUE(tenant_id, whatsapp_number)                                             │
└──────────────────────┴─────────────────────────────────────────────────────────┘
```

### 2.4.2  Conversation & Messaging Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: conversations                                                             │
│  Description: Active or historical sales conversations per customer.             │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  id UUID PK          │  Conversation identity                                   │
│  status TEXT         │  ACTIVE / BOOKED / CLOSED / HUMAN_TAKEOVER               │
│  message_history     │  JSONB[] — full chat log with metadata                   │
│  session_window_     │  24h rolling window (WhatsApp policy)                    │
│   expires_at         │                                                           │
│  hitl_requested      │  True when human agent stepped in                        │
│  buyer_profile TEXT  │  LOOKER / WARM_LEAD / HOT_BUYER                         │
│  buyer_score INT     │  0–100 purchase intent score                             │
│  expressed_interests │  JSONB[] — product categories + attributes              │
│  last_products_shown │  JSONB[] — last catalog results shown                   │
│  consecutive_low_    │  Counter; ≥2 triggers HITL escalation                   │
│   confidence         │                                                           │
│  active_design_*     │  AI Designer session tracking fields                     │
│  campaign_id UUID    │  If conversation started from a campaign                 │
└──────────────────────┴─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: outbound_messages                                                         │
│  Description: Central ledger of every message sent to customers.                 │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  meta_message_id     │  UNIQUE — Meta's message ID for deduplication            │
│  delivery_status     │  sent / delivered / read / failed                        │
│  message_type TEXT   │  text / image / template / interactive                   │
│  payload_snapshot    │  JSONB snapshot of what was sent                         │
└──────────────────────┴─────────────────────────────────────────────────────────┘
```

### 2.4.3  Product Catalogue Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: products                                                                  │
│  Description: The jewellery catalogue — the AI's product knowledge base.         │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  sku_id TEXT         │  Brand's own SKU identifier                              │
│  name TEXT           │  Product name                                             │
│  category TEXT       │  Necklace / Ring / Bangle / Earring etc.                 │
│  metal_type TEXT     │  Gold / Silver / Platinum / Kundan etc.                  │
│  purity TEXT         │  22K / 18K / 925 etc.                                    │
│  stone_type TEXT     │  Diamond / Emerald / Ruby etc.                           │
│  price_inr NUMERIC   │  Base price                                               │
│  making_charges      │  Making charge component                                 │
│  stock_count INT     │  Live inventory count                                    │
│  wa_image_url TEXT   │  WhatsApp-optimised image (sent to customer)             │
│  high_res_image_url  │  High-res image (used for VTO/AI design)                 │
│  custom_description  │  Brand's curated description (used in embeddings)        │
│  embedding vector    │  1024-dimensional semantic vector (pgvector)             │
│   (1024)             │                                                           │
│  media_sync_status   │  ready / partial / failed                                │
└──────────────────────┴─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: product_media                 (Catalog Phase 11)                         │
│  Deduplication-aware image asset registry with SHA256 de-dup constraint.        │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  variant TEXT        │  high_res / wa / gallery                                 │
│  sha256 TEXT         │  Prevents duplicate uploads of same image                │
│  source TEXT         │  url_import / file_upload / derived                      │
│  UNIQUE(tenant_id, sku_id, variant, sha256)                                     │
└──────────────────────┴─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: catalog_import_jobs / catalog_import_rows   (Phase 12-13)                │
│  Async bulk CSV/XLSX/JSON import with per-row diagnostics.                       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.4  Knowledge Base Table

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: knowledge_chunks                                                          │
│  Description: Chunked + embedded brand documents for RAG retrieval.              │
├──────────────────────┬─────────────────────────────────────────────────────────┤
│  document_id UUID    │  Groups chunks from same source document                 │
│  document_name TEXT  │  Human-readable source name                              │
│  category TEXT       │  policy / faq / brand_story / custom_instructions        │
│  chunk_text TEXT     │  2000-char chunk with 200-char overlap                   │
│  chunk_index INT     │  Position in source document                             │
│  embedding vector    │  1024-dim semantic vector                               │
│   (1024)             │                                                           │
│  priority INT        │  1–10 relevance weight (higher = retrieved first)        │
│  language TEXT       │  For multilingual KB                                     │
└──────────────────────┴─────────────────────────────────────────────────────────┘
```

### 2.4.5  Campaign & Template Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: wa_templates                                                              │
│  Mirrors Meta's approved templates with local status tracking.                   │
│  status: draft → pending → approved → (rejected / paused)                       │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: campaigns                                                                 │
│  Broadcast send configurations with audience filters and batch settings.         │
│  Live counters: messages_sent / delivered / read / conversations_started         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.6  Appointment & Store Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: appointments                                                              │
│  Every confirmed in-store visit. Connected to Google Calendar.                   │
│  status: confirmed → completed / no_show / cancelled                             │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  TABLE: stores                                                                    │
│  Physical store locations with availability config and block-dates.              │
│  Slot logic: max_slots_per_hour × slot_duration_min                              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.7  AI Designer Tables (Phase 7)

```
┌──────────────────────────────────────────────────────────────────┐
│  AI DESIGNER TABLE GROUP — Custom jewellery design pipeline       │
│                                                                   │
│  design_sessions                                                  │
│   └── One per AI design conversation                             │
│       • allowed_turns / turns_used (quota enforcement)           │
│       • consent_given (explicit data consent gate)               │
│       • selfie_storage_expires_at (DPDP TTL)                     │
│                                                                   │
│  design_generations                                               │
│   └── One per AI concept generated                               │
│       • idempotency_key (UNIQUE) — replay-safe                   │
│       • generation_latency_ms (SLO tracking)                     │
│       • status: succeeded / failed                               │
│                                                                   │
│  design_handoffs                                                  │
│   └── When customer selects a concept for production             │
│       • handoff_payload JSONB                                    │
│                                                                   │
│  design_consents                                                  │
│   └── Immutable consent audit record per session                 │
│                                                                   │
│  design_turn_reservations                                         │
│   └── UNIQUE(session_id, idempotency_key) + UNIQUE(session, turn)│
│       Prevents double-counting turns on concurrent requests       │
└──────────────────────────────────────────────────────────────────┘
```

### 2.4.8  Lifecycle & Savings Tables (Phase 8–9)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LIFECYCLE TABLE GROUP — Automated customer re-engagement engine                 │
│                                                                                   │
│  lifecycle_programs                                                               │
│   └── Occasion (Birthday/Anniversary/Festival) or Savings program config         │
│       cooldown_days · quiet_hours · timezone-aware scheduling                    │
│                                                                                   │
│  customer_savings_plans                                                           │
│   └── Individual enrolment in a jewellery savings scheme                         │
│       installment_amount × tenure_months = (n-1 paid + 1 merchant bonus)         │
│                                                                                   │
│  customer_savings_installments                                                    │
│   └── Full installment schedule, auto-generated at plan creation                 │
│       status: pending → due → paid / overdue / waived_by_merchant               │
│                                                                                   │
│  lifecycle_dispatches                                                             │
│   └── The outbound scheduler queue                                               │
│       • FOR UPDATE SKIP LOCKED (no queue thundering-herd)                        │
│       • idempotency_key UNIQUE per tenant (no duplicate sends)                   │
│       • attempt_count tracked for retry                                          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.9  Customer Memory Tables (Phase 10)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  CUSTOMER MEMORY TABLE GROUP — Persistent, vector-searchable buyer context       │
│                                                                                   │
│  customer_memory_events                                                           │
│   └── Raw extracted signals from conversations                                   │
│       event_type: budget_signal / occasion_signal / style_preference /           │
│                   objection_signal / purchase_intent / savings_intent /           │
│                   language_preference / profile_update / retrieval_trace         │
│       salience NUMERIC — importance weight (0–1)                                 │
│       expires_at TIMESTAMPTZ — configurable TTL per tenant                      │
│       UNIQUE fingerprint index — prevents duplicate memory inserts               │
│                                                                                   │
│  customer_memory_chunks                                                           │
│   └── Embedded vectors for each memory event                                    │
│       rank_score = 0.70×similarity + 0.20×salience + 0.10×freshness             │
│       HNSW index on embedding column for fast ANN search                         │
│                                                                                   │
│  rag_query_logs                                                                   │
│   └── Every RAG call audited: used_v2, fallback, hit counts, similarity scores  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.10  Compliance & Security Tables

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  COMPLIANCE TABLE GROUP — Legal obligations baked into the schema                │
│                                                                                   │
│  data_deletion_jobs                                                               │
│   └── DPDP Act 2023 Right to Erasure                                             │
│       customer_id SET NULL on customer delete (ensures erasure completes)        │
│       status: pending → processing → completed / failed                          │
│       72-hour SLA confirmation sent to customer via WhatsApp                     │
│                                                                                   │
│  oauth_state_nonces                                                               │
│   └── Google OAuth CSRF replay protection                                        │
│       nonce TEXT PK · expires_at · consumed_at (atomic, single-use)             │
│                                                                                   │
│  usage_events                                                                     │
│   └── Metering table: every billable event recorded                              │
│       event_type: ai_conversation / vto_generation / message_sent /              │
│                   custom_design_generation / custom_design_handoff               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.5  PostgreSQL Stored Functions (RPCs)

Aura pushes critical performance and concurrency logic into the database layer as stored
functions, ensuring atomicity and preventing application-level race conditions.

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│                      AURA DATABASE RPC CATALOGUE                                   │
├─────────────────────────────────────┬──────────────────────────────────────────────┤
│  FUNCTION                           │  PURPOSE                                     │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  search_products_v2(               │  Semantic product search with:               │
│    query_embedding,                │  • cosine distance on pgvector               │
│    target_tenant_id,               │  • min_similarity threshold filter           │
│    match_count,                    │  • max_per_source category diversity         │
│    filter_category,                │  • price + metal_type filters                │
│    filter_max_price,               │                                              │
│    filter_metal_type,              │                                              │
│    min_similarity,                 │                                              │
│    max_per_source)                 │                                              │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  search_knowledge_v2(...)          │  Semantic KB search with diversity controls  │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  search_customer_memory_v1(        │  Customer-scoped memory vector search        │
│    query_embedding,                │  with TTL filter (expired memories ignored)  │
│    target_customer_id,             │                                              │
│    min_similarity)                 │                                              │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  append_conversation_history_      │  Atomic chat log append                      │
│    entry(p_entry,                  │  with meta_message_id deduplication          │
│           p_dedupe_id)             │  (prevents duplicate messages in history)    │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  claim_lifecycle_dispatches(       │  SELECT ... FOR UPDATE SKIP LOCKED           │
│    batch_size,                     │  Horizontal-safe batch claiming —            │
│    scheduler_id)                   │  no two workers claim the same dispatch      │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  acquire_lifecycle_scheduler_lock  │  pg_try_advisory_lock — distributed mutex    │
│  release_lifecycle_scheduler_lock  │  pg_advisory_unlock                          │
├─────────────────────────────────────┼──────────────────────────────────────────────┤
│  increment_campaign_stats(         │  Atomic counter update on campaigns          │
│    campaign_id,                    │  (avoids read-modify-write races)            │
│    sent, conversations)            │                                              │
└─────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2.6  Migration Timeline — How The Platform Grew

```
Phase 1  ────●── Core schema: tenants, customers, conversations, products
Phase 2  ────●── search_products / search_knowledge RPCs; campaign foundations
Phase 6  ────●── Google Calendar OAuth; Stripe/Razorpay billing; DPDP deletion jobs
Phase 6b ────●── OAuth CSRF nonce table (replay protection)
Phase 7  ────●── AI Designer: sessions, generations, handoffs, consents
Phase 7b ────●── Designer idempotency hardening: turn reservations, gen de-dup
Phase 8  ────●── Outbound message ledger; lifecycle scheduler foundations
Phase 8b ────●── SKIP LOCKED RPCs; advisory locks; savings plans + installments
Phase 9  ────●── Lifecycle scale hardening; rollout columns; performance indexes
Phase 10 ────●── Customer memory engine: events, chunks, RAG logs; v2 RPCs
Phase 11 ────●── Product media table (SHA256 dedup)
Phase 12 ────●── Catalog import jobs + per-row diagnostics
Phase 13 ────●── Catalog operations hardening; media sync status tracking
Phase 10P2 ──●── Memory dedup fingerprint index (AI-worker write-safety)
```

---

*End of Part 2*
# PART 3 — AI ENGINE: LANGGRAPH PIPELINE & AGENT NETWORK

---

## 3.1  The AI Brain — Architecture Overview

The AI service is designed as a **multi-agent graph** where a Router determines intent, then
hands off to the single most appropriate specialist. Each agent is isolated and focused.

```
╔══════════════════════════════════════════════════════════════════════════════════════════╗
║                        AURA AI PIPELINE — LANGGRAPH STATE MACHINE                      ║
║                                                                                          ║
║   ENTRY                                                                                  ║
║     │                                                                                    ║
║     ▼                                                                                    ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐    ║
║  │                         ROUTER AGENT                                            │    ║
║  │              Model: mistral-small-latest  (temp=0.1, max_tokens=100)           │    ║
║  │              JSON mode — outputs one of 11 decision labels                      │    ║
║  │                                                                                 │    ║
║  │   Fast-path (no LLM call):                                                      │    ║
║  │   [MANAGER WHISPER] → bypass classification                                    │    ║
║  │   LTV ≥ ₹10L + no prior HITL → HITL escalation                                │    ║
║  │   deletion keywords → DATA_DELETION_REQUEST                                    │    ║
║  │   access keywords → DATA_ACCESS_REQUEST                                        │    ║
║  │   design keywords + feature gate → CUSTOM_DESIGN_REQUEST                       │    ║
║  │   complex/high-value → HITL                                                    │    ║
║  └──────────────────────────┬──────────────────────────────────────────────────────┘    ║
║                             │                                                            ║
║         ┌───────────────────┼─────────────────────────────────────────────┐            ║
║         │                   │                          │                   │            ║
║         ▼                   ▼                          ▼                   ▼            ║
║  ┌─────────────┐   ┌─────────────────┐   ┌──────────────────┐   ┌──────────────────┐  ║
║  │   SALES     │   │    SUPPORT      │   │  VTO ORCHESTRAT  │   │  CUSTOM DESIGNER │  ║
║  │  CONSULTANT │   │   CONCIERGE     │   │      OR          │   │     AGENT        │  ║
║  │             │   │                 │   │                  │   │                  │  ║
║  │ CATALOG_    │   │ GENERAL_CHAT    │   │ VTO_REQUEST_     │   │ CUSTOM_DESIGN_   │  ║
║  │   QUERY     │   │ COMPLAINT(→HITL)│   │   WITH_MEDIA     │   │   REQUEST        │  ║
║  │ VTO_REQUEST │   │ UNKNOWN         │   │                  │   │                  │  ║
║  │ BOOKING     │   │                 │   │  Full selfie      │   │ Multi-turn       │  ║
║  │   INTENT    │   │  Retrieves KB   │   │  + VTO pipeline  │   │ concept design   │  ║
║  └──────┬──────┘   └────────┬────────┘   └────────┬─────────┘   └────────┬─────────┘  ║
║         │                   │                     │                      │             ║
║         └────────────┬──────┴─────────────────────┴──────────────────────┘             ║
║                      │                                                                  ║
║         ┌────────────┴──────────────────────────────────────────┐                      ║
║         │              OPT-OUT / DATA / HITL                    │                      ║
║         │                                                       │                      ║
║         │  opt_out_handler  data_deletion  data_access          │                      ║
║         │  hitl_escalation_handler                              │                      ║
║         └────────────────────────────────────────────────────────┘                     ║
║                             │                                                           ║
║                             ▼                                                           ║
║                    ┌─────────────────┐                                                  ║
║                    │   STATE SAVER   │  ← NEVER writes DB directly                     ║
║                    │                 │    Returns state_updates diff only               ║
║                    └────────┬────────┘                                                  ║
║                             │                                                           ║
║                            END                                                          ║
╚══════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 3.2  Router Agent — Classification Logic

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     ROUTER DECISION TREE                                         │
│                                                                                  │
│  Incoming message                                                                │
│        │                                                                         │
│        ├── Contains "[MANAGER WHISPER RECEIVED]"?                                │
│        │        └── YES → bypass → sales_consultant (whisper mode)              │
│        │                                                                         │
│        ├── Customer LTV ≥ ₹10,00,000 + never had HITL before?                  │
│        │        └── YES → HITL escalation (VIP auto-escalation)                │
│        │                                                                         │
│        ├── Contains: "delete my data" / "erase" / "forget me" / "remove data"? │
│        │        └── YES → DATA_DELETION_REQUEST                                 │
│        │                                                                         │
│        ├── Contains: "my data" / "what data" / "data you have"?                │
│        │        └── YES → DATA_ACCESS_REQUEST                                   │
│        │                                                                         │
│        ├── Contains: "design" / "bespoke" / "custom" / "unique design"?         │
│        │   + ai_designer_enabled = true?                                         │
│        │        └── YES → CUSTOM_DESIGN_REQUEST                                 │
│        │                                                                         │
│        ├── Appears very complex OR price mentioned > ₹10 lakh?                 │
│        │        └── YES → HITL                                                  │
│        │                                                                         │
│        └── → LLM CLASSIFICATION (mistral-small, JSON output)                   │
│                   ┌─────────────────────────────────────────────┐              │
│                   │  Returns one of:                            │              │
│                   │  CATALOG_QUERY  · BOOKING_INTENT            │              │
│                   │  VTO_REQUEST  · GENERAL_CHAT                │              │
│                   │  COMPLAINT  · OPT_OUT                       │              │
│                   │  LOW_CONFIDENCE (ai_confidence < threshold) │              │
│                   └─────────────────────────────────────────────┘              │
│                                                                                  │
│  Post-LLM checks:                                                               │
│    └── consecutive_low_confidence ≥ 2 → force LOW_CONFIDENCE                   │
│    └── VTO_REQUEST + media_id present → upgrade to VTO_REQUEST_WITH_MEDIA      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.3  Sales Consultant Agent

The primary revenue engine. Handles product discovery, booking, and conversion.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   SALES CONSULTANT AGENT — EXECUTION FLOW                        │
│                                                                                  │
│  Model: mistral-large-latest  (temp=0.7, max_tokens=300)                         │
│  Tools available:                                                                │
│    • search_catalog        — semantic product search via RAG                    │
│    • get_product_details   — full spec of a specific product                    │
│    • check_inventory       — live stock count                                   │
│    • log_customer_interest — records style/budget signals to memory             │
│    • book_appointment      — creates verified appointment (advisory lock)       │
│    • get_store_availability — lists free slots for interactive booking          │
│                                                                                  │
│  FLOW:                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  1. Initial LLM call with system prompt + conversation context          │    │
│  │         │                                                               │    │
│  │         ├── Returns tool_calls?                                         │    │
│  │         │        YES → Execute tools (search_catalog, etc.)             │    │
│  │         │              └── Inject tool results into messages            │    │
│  │         │                                                               │    │
│  │         └── 2. Second LLM call → synthesise final WhatsApp response    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  HOT BUYER AUTO-TRIGGER:                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  buyer_score ≥ 70 AND no appointment yet offered                        │    │
│  │         → Force-fetch store availability                                │    │
│  │         → Build WhatsApp interactive list (max 5 time slots)            │    │
│  │         → Message IDs: "BOOK_2026-04-15T11:00" format                  │    │
│  │         → Customer taps a slot → instantly booked                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.4  Support Concierge Agent

Handles all non-sales conversations: FAQs, brand story, policies, and general chat.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   SUPPORT CONCIERGE AGENT                                        │
│                                                                                  │
│  Model: mistral-large-latest  (temp=0.6, max_tokens=220)                         │
│                                                                                  │
│  On every call, retrieves a CONTEXT BUNDLE:                                      │
│    • 2 semantically relevant products (via search_products_v2 RPC)              │
│    • 3 KB chunks (via search_knowledge_v2 RPC)                                  │
│    • Customer memory context (via search_customer_memory_v1)                    │
│    • Every RAG call logged to rag_query_logs for audit                          │
│                                                                                  │
│  Personality:                                                                    │
│    → Reads tenant's agent_persona JSONB (name, tone, signature)                 │
│    → Adapts language to customer's preferred_language                           │
│    → Stays warm and helpful, never promises what it cannot deliver              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.5  Virtual Try-On (VTO) Orchestrator — Full Pipeline

This is the most technically complex agent. It coordinates 10 sequential steps.

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                      VTO ORCHESTRATOR — 10-STEP PIPELINE                             │
│                                                                                       │
│  Input: Customer sends WhatsApp photo + product request                              │
│                                                                                       │
│  STEP 1: Product Resolution                                                          │
│    └── Extract SKU from message → history → expressed_interests                     │
│                                                                                       │
│  STEP 2: Circuit Breaker Check                                                       │
│    └── Redis key: "nanobana:status"                                                  │
│        OPEN → graceful fallback ("Service temporarily unavailable")                 │
│                                                                                       │
│  STEP 3: Latency Bridge Message                                                      │
│    └── Redis SETNX: "vto:bridge:{convo_id}:{media_fingerprint}"                    │
│        Only sent ONCE even if webhook replays arrive                                │
│        "⏳ Preparing your virtual try-on, this takes ~15 seconds..."               │
│                                                                                       │
│  STEP 4: Download Selfie                                                             │
│    └── Fetch from Meta Graph API with auth header                                   │
│                                                                                       │
│  STEP 5: Image Validation                                                            │
│    └── Strip EXIF metadata (privacy)                                                │
│        Min resolution check: 300×300 px                                             │
│        BAD_IMAGE → graceful fallback                                                │
│                                                                                       │
│  STEP 6: Secure Upload                                                               │
│    └── Upload to Supabase "vto-selfies" bucket                                      │
│        48-hour signed URL (automatically expires)                                   │
│                                                                                       │
│  STEP 7: Start Nano Banana Job                                                       │
│    └── POST to NanaBanana API with product + selfie ref                             │
│        Exponential backoff on retry                                                 │
│                                                                                       │
│  STEP 8: Poll Until Complete                                                         │
│    └── Polls until: complete / failed / timeout                                     │
│                                                                                       │
│  STEP 9: Upload Result                                                               │
│    └── Compress result image                                                         │
│        Upload to "vto-results" bucket: 7-day signed URL                            │
│                                                                                       │
│  STEP 10: Update Buyer Profile                                                       │
│    └── Set buyer_profile = HOT_BUYER                                                │
│        buyer_score += 35                                                             │
│        Sales consultant auto-triggers booking flow                                  │
│                                                                                       │
│  FAILURE CODES:                                                                       │
│    NO_PRODUCT · NANO_BANANA_DOWN · BAD_IMAGE · IMAGE_FETCH_FAILED                  │
│    TIMEOUT · FAILED — each has a warm, brand-appropriate fallback message           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.6  Custom AI Designer Agent

Enables customers to design bespoke jewellery through a guided multi-turn conversation.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      AI DESIGNER AGENT — CAPABILITY MAP                          │
│                                                                                  │
│  Model: mistral-large-latest  (temp=0.7, max_tokens=600)                         │
│  Up to 5 tool-call iterations per message                                       │
│                                                                                  │
│  GATE 1 — FEATURE CHECK                                                          │
│    └── ai_designer_enabled = true on tenant? No → fallback to support           │
│                                                                                  │
│  GATE 2 — CONSENT COLLECTION                                                     │
│    └── First time: present consent request                                      │
│        On consent: record in design_consents table (immutable audit)            │
│                                                                                  │
│  GATE 3 — SESSION MANAGEMENT                                                     │
│    └── create or resume design_sessions record                                  │
│        Track turns_used vs allowed_turns                                         │
│                                                                                  │
│  GATE 4 — IDEMPOTENCY                                                            │
│    └── idempotency_key = hash(conv_id + history_len + media_id + message)       │
│        Stable across webhook replays — safe to retry                            │
│        design_turn_reservations UNIQUE constraint prevents double-billing       │
│                                                                                  │
│  DESIGN TOOLS:                                                                   │
│    • analyze_face_for_design — optical analysis for flattering suggestions      │
│    • generate_jewelry_concepts — AI concept generation (image + description)    │
│    • save_design_generation — persists to design_generations                    │
│    • list_design_generations — shows customer all concepts this session         │
│    • mark_design_selected — customer picks a concept                            │
│    • create_design_handoff — packages for production handoff to brand team      │
│                                                                                  │
│  PLAN QUOTAS (custom_design_generations/month):                                  │
│    Starter: 50  ·  Growth: 250  ·  Enterprise: 2,500                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.7  Data Compliance Handlers

Built natively into the AI pipeline — compliance is not an afterthought.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  DATA DELETION HANDLER  (DPDP Act 2023 — Right to Erasure)                       │
│                                                                                  │
│  Trigger: Customer says "delete my data" / "erase me" / "forget me"            │
│                                                                                  │
│  Steps:                                                                          │
│  1. Create data_deletion_jobs record (status: pending)                          │
│  2. Set conversation opted_out = true, status = CLOSED                          │
│  3. Send WhatsApp confirmation:                                                  │
│     "Your request has been received. All your personal data                     │
│      will be permanently deleted within 72 hours."                              │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  DATA ACCESS HANDLER  (DPDP Act 2023 — Right to Access)                          │
│                                                                                  │
│  Trigger: Customer asks "what data do you have about me?"                       │
│                                                                                  │
│  Returns formatted summary:                                                      │
│  • Name, phone number                                                            │
│  • Purchase history count + total lifetime value                                │
│  • Preferred product category                                                   │
│  • Number of conversations on record                                            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.8  RAG System — Three-Layer Retrieval

Aura's Retrieval-Augmented Generation is the most advanced part of the AI pipeline.
It has three retrieval layers that cascade with progressively relaxed constraints.

```
╔═══════════════════════════════════════════════════════════════════════════════════╗
║                        THE THREE-LAYER RAG SYSTEM                               ║
║                                                                                   ║
║  Query arrives ("Show me gold necklaces under 50,000")                          ║
║       │                                                                           ║
║       ▼                                                                           ║
║  ┌──────────────────────────────────────────────────────────────────────────┐    ║
║  │  LAYER 1: VECTOR SEARCH (Primary)                                        │    ║
║  │                                                                          │    ║
║  │  Query → 1024-dim Mistral embedding                                     │    ║
║  │  pgvector cosine distance on products.embedding                         │    ║
║  │  RPC: search_products_v2                                                 │    ║
║  │  Threshold: min_similarity = 0.35 (configurable)                        │    ║
║  │  Diversity: max_per_source = 3 per category                             │    ║
║  └──────────────────────┬───────────────────────────────────────────────────┘    ║
║                          │                                                        ║
║                          ├── Top similarity ≥ 0.65? → Use vector results        ║
║                          │                                                        ║
║                          └── Top similarity < 0.65? → trigger Layer 2           ║
║                                                                                   ║
║  ┌──────────────────────────────────────────────────────────────────────────┐    ║
║  │  LAYER 2: LEXICAL FALLBACK                                               │    ║
║  │                                                                          │    ║
║  │  Extract up to 4 search terms from query                                │    ║
║  │  Supabase .ilike() on: name, sku_id, custom_description,               │    ║
║  │                         category, metal_type                            │    ║
║  │  Tags result rows with: retrieval_source = "lexical_fallback"           │    ║
║  └──────────────────────┬───────────────────────────────────────────────────┘    ║
║                          │                                                        ║
║                          └── Both layers return results?                         ║
║                               → Merge: vector first, lexical supplements        ║
║                                                                                   ║
║  ┌──────────────────────────────────────────────────────────────────────────┐    ║
║  │  LAYER 3: CUSTOMER MEMORY CONTEXT                                        │    ║
║  │                                                                          │    ║
║  │  Separately retrieved for every AI call                                  │    ║
║  │  search_customer_memory_v1 with customer-scoped filter                  │    ║
║  │  Rank score: 0.70 × similarity                                          │    ║
║  │            + 0.20 × salience (importance signal)                        │    ║
║  │            + 0.10 × freshness (recency of memory)                       │    ║
║  │  Expired memories (past TTL) excluded                                   │    ║
║  │  Max per event_type: prevents one signal type dominating                │    ║
║  └──────────────────────────────────────────────────────────────────────────┘    ║
║                                                                                   ║
║  EVERYTHING retrieved is injected into the specialist agent's context window    ║
╚═══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 3.9  Customer Memory Engine

Each conversation automatically builds a persistent memory profile for the customer.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│               CUSTOMER MEMORY EXTRACTION PIPELINE (ai-worker.ts)                 │
│                                                                                  │
│  After every AI response, the API worker analyses the conversation for:         │
│                                                                                  │
│  SIGNAL TYPE           EXTRACTION METHOD                          SALIENCE       │
│  ────────────────────  ────────────────────────────────────────   ──────────    │
│  budget_signal         INR regex (₹X / X lakh / X thousand)       High          │
│  occasion_signal       Wedding / Diwali / Birthday keywords        High          │
│  style_preference      Gold/Diamond/Kundan + adjectives            Medium        │
│  objection_signal      "too expensive" / "need to think"          High          │
│  purchase_intent       "book" / "want to buy" / "come tomorrow"    Very High    │
│  savings_intent        "savings plan" / "monthly installment"      High          │
│  language_preference   Detected language of customer messages      Medium        │
│  profile_update        Name / DOB / location mentions              Medium        │
│  retrieval_trace       Products / KB chunks shown this session     Low           │
│                                                                                  │
│  Deduplication: Max 8 candidates, deduped on (event_type + text)               │
│  Storage: customer_memory_events + customer_memory_chunks (embedded)            │
│  TTL: configurable per tenant (ai_designer_retention_days)                      │
│  Fingerprint UNIQUE index: prevents duplicate AI-worker writes                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.10  Buyer Scoring Model

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      BUYER INTENT SCORING SYSTEM                                 │
│                                                                                  │
│   Score Range     Profile         AI Behaviour                                  │
│   ───────────     ──────────────  ─────────────────────────────────────────    │
│   0 – 39          LOOKER          Show products, answer questions               │
│   40 – 69         WARM_LEAD       More direct CTAs, ask about occasion          │
│   70 – 100        HOT_BUYER       Auto-trigger appointment booking flow         │
│                                                                                  │
│   Score Updates:                                                                 │
│   +35 → After completing a Virtual Try-On session                              │
│   +N  → Sales consultant adjusts based on conversation signals                 │
│                                                                                  │
│   Auto-triggers when score ≥ 70:                                                │
│     1. Fetch store availability                                                  │
│     2. Send WhatsApp interactive list with 5 time slots                         │
│     3. One tap → confirmed appointment                                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.11  AI Model Configuration

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     AI MODEL USAGE ACROSS AGENTS                                 │
├──────────────────────┬─────────────────────────────┬────────┬───────────────────┤
│ AGENT                │ MODEL                       │ TEMP   │ MAX TOKENS        │
├──────────────────────┼─────────────────────────────┼────────┼───────────────────┤
│ Router               │ mistral-small-latest        │ 0.1    │ 100               │
│                      │ (fast, deterministic)        │        │                   │
│ Sales Consultant     │ mistral-large-latest        │ 0.7    │ 300               │
│                      │ (creative, persuasive)      │        │                   │
│ Support Concierge    │ mistral-large-latest        │ 0.6    │ 220               │
│                      │ (env configurable)          │        │                   │
│ Custom Designer      │ mistral-large-latest        │ 0.7    │ 600               │
│                      │ (most creative)             │        │                   │
│ Embeddings           │ Mistral embed 1024-dim      │ N/A    │ N/A               │
└──────────────────────┴─────────────────────────────┴────────┴───────────────────┘
```

---

*End of Part 3*
# PART 4 — DATA FLOWS: END-TO-END JOURNEY MAPS

---

## 4.1  The Primary Flow — Inbound WhatsApp Message to AI Response

This is the core loop of the entire system.

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║           INBOUND WHATSAPP MESSAGE → AI RESPONSE — COMPLETE DATA FLOW             ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  CUSTOMER                                                                            ║
║  (WhatsApp app)                                                                      ║
║       │                                                                              ║
║       │  1. Customer types/sends message                                            ║
║       ▼                                                                              ║
║  META CLOUD API                                                                      ║
║       │                                                                              ║
║       │  2. POST /webhooks/meta  (within 5 seconds of message)                     ║
║       ▼                                                                              ║
║  ┌───────────────────────────────────────────────────────────────────────────────┐  ║
║  │  FASTIFY API — WEBHOOK HANDLER  (synchronous, <50ms)                         │  ║
║  │                                                                               │  ║
║  │  3.  ← Returns HTTP 200 immediately (Meta requires ≤5s or it retries)       │  ║
║  │  4.  HMAC-SHA256 verify x-hub-signature-256 header                          │  ║
║  │  5.  Redis SETNX idempotency lock: key=(tenant_id+message_id), TTL=24h     │  ║
║  │      → Already exists? STOP. Duplicate webhook ignored.                     │  ║
║  │  6.  Lookup tenant by phone_number_id                                        │  ║
║  │  7.  Check customer opted_out → TRUE? Skip AI, no response                  │  ║
║  │  8.  Resolve customer (by phone): upsert if new                              │  ║
║  │  9.  Get or create conversation (rolling 24h session window)                 │  ║
║  │  10. append_conversation_history_entry RPC                                   │  ║
║  │      → Atomic insert + meta_message_id dedup check                          │  ║
║  │  11. Enqueue to BullMQ ai-jobs queue                                         │  ║
║  │      jobId = "{conversationId}__{messageId}"  (prevents queue duplication)  │  ║
║  └───────────────────────────────────────────────────────────────────────────────┘  ║
║                               │                                                      ║
║                               │  (async, from Redis queue)                          ║
║                               ▼                                                      ║
║  ┌───────────────────────────────────────────────────────────────────────────────┐  ║
║  │  BULLMQ AI WORKER  (concurrency=5, 3 attempts, exponential backoff)          │  ║
║  │                                                                               │  ║
║  │  12. HITL guard: hitl_requested=true AND not a whisper? → SKIP               │  ║
║  │  13. checkPlanLimits() — monthly quota exceeded? → Block + notify brand      │  ║
║  │  14. VTO guard: image message + vto_enabled=false? → Reject                  │  ║
║  │  15. Generate HMAC internal service token (5-min TTL)                        │  ║
║  │  16. POST /process to Python AI service (timeout: AI_PROCESS_TIMEOUT_MS)    │  ║
║  └───────────────────────────────────────────────────────────────────────────────┘  ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌───────────────────────────────────────────────────────────────────────────────┐  ║
║  │  PYTHON AI MICROSERVICE                                                       │  ║
║  │                                                                               │  ║
║  │  17. Verify HMAC token + tenant scope                                         │  ║
║  │  18. load_processing_context(): batch-load                                   │  ║
║  │        • conversation (history, status, buyer_profile)                       │  ║
║  │        • tenant_config (persona, hours, feature flags)                       │  ║
║  │        • customer_profile (LTV, interests, language, memory)                 │  ║
║  │        • savings_summary + personalization_brief                             │  ║
║  │  19. Build ConversationState TypedDict                                        │  ║
║  │  20. aura_pipeline.ainvoke(state)                                             │  ║
║  │        ├── router_agent → classify intent                                    │  ║
║  │        ├── specialist_agent → generate response + tool calls                │  ║
║  │        └── state_saver → normalise state_updates                            │  ║
║  │  21. Return ProcessResponse:                                                  │  ║
║  │        outbound_message · outbound_media_url                                 │  ║
║  │        outbound_interactive_list · outbound_pre_messages                    │  ║
║  │        state_updates · retrieval_meta · hitl_requested                      │  ║
║  └───────────────────────────────────────────────────────────────────────────────┘  ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌───────────────────────────────────────────────────────────────────────────────┐  ║
║  │  API WORKER — POST-AI PROCESSING                                              │  ║
║  │                                                                               │  ║
║  │  22. Send to customer via Meta API (in order):                               │  ║
║  │        a. outbound_pre_messages (one by one, e.g. "⏳ Checking...")          │  ║
║  │        b. outbound_interactive_list (appointment slots)                      │  ║
║  │        c. image + caption (if VTO result)                                   │  ║
║  │        d. text message (main AI response)                                   │  ║
║  │        → Each sent message logged to outbound_messages                      │  ║
║  │                                                                               │  ║
║  │  23. Persist state_updates to conversations + customers tables               │  ║
║  │                                                                               │  ║
║  │  24. persistCustomerMemory():                                                 │  ║
║  │        • Extract up to 8 memory event candidates from conversation           │  ║
║  │        • Insert customer_memory_events                                        │  ║
║  │        • Enqueue embedding-jobs for vector generation                        │  ║
║  │                                                                               │  ║
║  │  25. HITL: if hitl_requested=true                                             │  ║
║  │        • Notify dashboard (realtime via Supabase subscription)              │  ║
║  │        • Set conversation status = HUMAN_TAKEOVER                           │  ║
║  │                                                                               │  ║
║  │  26. Usage metering:                                                          │  ║
║  │        • Insert usage_events row (ai_conversation)                          │  ║
║  │        • Report to Stripe metered billing                                   │  ║
║  │                                                                               │  ║
║  │  ON FINAL FAILURE (all 3 attempts exhausted):                                │  ║
║  │        • Auto-escalate to HUMAN_TAKEOVER                                    │  ║
║  │        • Send bridge message: "Connecting you with our team..."             │  ║
║  └───────────────────────────────────────────────────────────────────────────────┘  ║
║                               │                                                      ║
║                               ▼                                                      ║
║  META CLOUD API  →  CUSTOMER'S WHATSAPP                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 4.2  Appointment Booking Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      APPOINTMENT BOOKING — DATA FLOW                             │
│                                                                                  │
│  1. Customer indicates intent ("I want to visit tomorrow")                       │
│     OR buyer_score reaches 70 (auto-trigger)                                    │
│         │                                                                        │
│         ▼                                                                        │
│  2. Sales consultant calls: get_store_availability(store_id, date)              │
│     → AvailabilityService: queries stores.availability JSONB                    │
│       counts existing booked slots for that hour                                │
│       max_slots_per_hour limit enforcement                                      │
│         │                                                                        │
│         ▼                                                                        │
│  3. Returns WhatsApp Interactive List:                                           │
│     "Available slots — please select one:"                                      │
│     [ Mon 14 Apr · 11:00 AM ]  BOOK_2026-04-14T11:00                           │
│     [ Mon 14 Apr · 12:00 PM ]  BOOK_2026-04-14T12:00                           │
│     [ Tue 15 Apr · 10:00 AM ]  BOOK_2026-04-15T10:00                           │
│         │                                                                        │
│         ▼                                                                        │
│  4. Customer taps one slot → webhook receives interactive button reply          │
│         │                                                                        │
│         ▼                                                                        │
│  5. POST /api/appointments                                                       │
│     → pg_advisory_xact_lock(store_hash + hour_hash)  ← prevents race condition │
│     → Validate slot availability (double-check after lock acquired)             │
│     → Insert appointments row                                                   │
│     → Google Calendar event created (if token is valid)                         │
│     → Conversation.status = BOOKED                                              │
│     → WhatsApp confirmation sent to customer                                    │
│     → WhatsApp notification sent to brand (optional)                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.3  Campaign Broadcast Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                       CAMPAIGN BROADCAST — DATA FLOW                             │
│                                                                                  │
│  BRAND MANAGER (Dashboard)                                                       │
│    1. Create campaign: name, occasion, select approved template, set audience    │
│    2. Choose audience: All / High-Value (LTV≥₹1L) / Dormant (>12mo)            │
│    3. Preview audience count: GET /api/campaigns/audience-count                 │
│    4. Set batch_size + batch_interval_seconds (throttle to avoid Meta limits)  │
│    5. POST /api/campaigns/:id/launch                                             │
│         │                                                                        │
│         ▼                                                                        │
│  API validates: template.status = 'approved'                                    │
│  Loads audience customers matching filters                                      │
│  Splits into batches of batch_size                                              │
│         │                                                                        │
│         ▼                                                                        │
│  For each batch → BullMQ campaign-jobs                                          │
│    delay = batchIndex × batch_interval_seconds × 1000                          │
│    (staggered to avoid rate-limit spikes)                                       │
│         │                                                                        │
│         ▼                                                                        ║
│  Campaign worker processes each job:                                            │
│    → Substitute template variables (customer name, etc.)                       │
│    → POST to Meta API (template send)                                           │
│    → create outbound_messages record                                            │
│    → increment_campaign_stats RPC (atomic counter)                             │
│         │                                                                        │
│         ▼                                                                        │
│  Meta delivery webhook → POST /webhooks/meta (status update event)             │
│  → Updates outbound_messages.delivery_status: sent → delivered → read          │
│  → Contributes to campaign analytics                                            │
│         │                                                                        │
│         ▼                                                                        │
│  If customer replies to campaign message:                                       │
│  → Regular inbound webhook received                                             │
│  → Conversation created with campaign_id reference                             │
│  → AI agent engages normally                                                    │
│  → campaign.conversations_started counter +1                                   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.4  Lifecycle Dispatch Flow (Occasion & Savings)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     LIFECYCLE MESSAGING — SCHEDULER FLOW                         │
│                                                                                  │
│  SETUP (Brand Manager)                                                           │
│    1. Create lifecycle_program (Birthday/Anniversary/Diwali/Savings)            │
│    2. Set template_id, cooldown_days, quiet_hours, timezone                     │
│    3. Activate program                                                           │
│         │                                                                        │
│         ▼                                                                        │
│  SCHEDULING LOGIC                                                                │
│    When customer DOB/anniversary is within trigger window:                      │
│    → Insert lifecycle_dispatches row (status=pending, scheduled_for=datetime)  │
│    → idempotency_key = UNIQUE per tenant (no duplicate dispatch ever)          │
│         │                                                                        │
│         ▼                                                                        │
│  SCHEDULER (node-cron / lifecycle-jobs worker)                                  │
│    acquire_lifecycle_scheduler_lock(lock_key) — only ONE scheduler runs        │
│         │                                                                        │
│         ▼                                                                        │
│    claim_lifecycle_dispatches(batch_size=50)                                    │
│    → SELECT ... FOR UPDATE SKIP LOCKED                                          │
│      (safe for horizontal scaling — no two workers claim same dispatch)        │
│         │                                                                        │
│         ▼                                                                        │
│    For each claimed dispatch:                                                   │
│    → Respect customer quiet_hours and timezone                                  │
│    → Render template variable substitutions                                     │
│    → POST to Meta API                                                           │
│    → Insert outbound_messages record                                            │
│    → UPDATE dispatch.status = 'sent'                                           │
│    → release_lifecycle_scheduler_lock()                                         │
│         │                                                                        │
│         ▼                                                                        │
│  SAVINGS PLAN REMINDERS                                                          │
│    → installment due_date approaching → trigger savings_reminder dispatch      │
│    → If goal met → trigger savings_milestone dispatch (congratulations!)       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.5  Knowledge Base Ingestion Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     KNOWLEDGE BASE UPLOAD — DATA FLOW                            │
│                                                                                  │
│  Brand uploads document (PDF / DOCX / TXT / MD / CSV)                          │
│    via dashboard or API                                                          │
│         │                                                                        │
│         ▼                                                                        │
│  POST /api/knowledge/upload                                                      │
│    → Max 6MB file size check                                                    │
│    → File type detection and extraction:                                         │
│         PDF → pdf-parse → raw text                                              │
│         DOCX → mammoth → raw text                                               │
│         TXT/MD/CSV → direct text                                                │
│         │                                                                        │
│         ▼                                                                        │
│  SEMANTIC CHUNKING:                                                              │
│    → Split by headings first (## / # / ---) to preserve document structure     │
│    → Each segment chunked at max 2000 chars with 200-char overlap               │
│      (ensures context continuity across chunk boundaries)                       │
│         │                                                                        │
│         ▼                                                                        │
│  BATCH INSERT:                                                                   │
│    → All chunks inserted into knowledge_chunks                                  │
│    → document_id groups them, chunk_index preserves order                       │
│    → status: 'processing' (no embedding yet)                                   │
│         │                                                                        │
│         ▼                                                                        │
│  ASYNC EMBEDDING:                                                                │
│    → Enqueue embedding-jobs to BullMQ for each chunk                           │
│    → (Falls back to direct inline embed if Redis is down)                      │
│         │                                                                        │
│         ▼                                                                        │
│  Embedding worker:                                                               │
│    → POST /embed to Python AI service                                           │
│    → Mistral generates 1024-dim vector                                         │
│    → UPDATE knowledge_chunks.embedding = <vector>                              │
│    → status becomes 'ready' (dashboard shows embedded_count / chunk_count)     │
│         │                                                                        │
│         ▼                                                                        │
│  Knowledge is now semantically searchable by all AI agents                     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.6  HITL (Human-in-the-Loop) Escalation & Return Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      HITL — FULL ESCALATION LIFECYCLE                            │
│                                                                                  │
│  ESCALATION TRIGGERS:                                                            │
│  • Router returns COMPLAINT                                                      │
│  • Router returns LOW_CONFIDENCE (consecutive_low_confidence ≥ 2)              │
│  • Customer LTV ≥ ₹10L on first contact (VIP auto-escalation)                 │
│  • All 3 AI job retries fail                                                    │
│  • Manager manually clicks "HUMAN OVERRIDE" button                             │
│         │                                                                        │
│         ▼                                                                        │
│  POST /api/conversations/:id/takeover                                            │
│    → conversation.hitl_requested = true                                         │
│    → conversation.status = HUMAN_TAKEOVER                                      │
│    → Supabase realtime pushes update to ALL connected dashboard sessions        │
│    → Dashboard shows URGENT red card in Kanban column                          │
│    → Audio alert fires (Web Audio API oscillator)                              │
│         │                                                                        │
│         ▼                                                                        │
│  MANAGER ACTIONS AVAILABLE:                                                     │
│  1. Direct Message: POST /api/conversations/:id/message                        │
│     → Sends directly to customer via WhatsApp                                  │
│     → Logged with role: "manager" in message_history                           │
│                                                                                  │
│  2. Whisper: POST /api/conversations/:id/whisper                                │
│     → Hidden instruction injected into AI context                              │
│     → Re-enqueues AI job with "[MANAGER WHISPER RECEIVED]" prefix             │
│     → AI processes with manager's guidance, as if it was its own thought      │
│     → Only 2 attempts (whispers are higher-priority)                           │
│                                                                                  │
│  3. Return to AI: POST /api/conversations/:id/return-to-ai                     │
│     → AI resumes autonomous mode                                                │
│     → Appends sentinel "[HITL_PREVIOUSLY_HANDLED]" to history                 │
│     → Optional handoff note recorded                                           │
│     → Router sees sentinel → knows to be extra careful                         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.7  New Tenant Onboarding Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     BRAND ONBOARDING — STEP-BY-STEP                              │
│                                                                                  │
│  Step 1: Identity (POST /api/tenants/setup)                                      │
│    → Create tenant record (clerk_org_id mapped)                                 │
│    → Set brand name                                                              │
│         │                                                                        │
│  Step 2: WhatsApp (POST /api/tenants/waba-connect)                               │
│    → Enter WABA ID + phone_number_id + Meta System User Token                  │
│    → Stored server-side only (never returned in responses)                     │
│         │                                                                        │
│  Step 3: Catalogue Upload (via /api/products or /catalog/import-jobs)           │
│    → Upload CSV/XLSX with product data                                          │
│    → AI embeds each product description                                         │
│         │                                                                        │
│  Step 4: Knowledge Base (via /api/knowledge/upload)                              │
│    → Upload brand story, policies, FAQs                                         │
│    → Documents chunked + embedded automatically                                 │
│         │                                                                        │
│  Step 5: Agent Config (POST /api/tenants/agent-config)                           │
│    → Set AI agent name, tone, signature                                         │
│    → Configure business hours                                                   │
│    → Set stores + availability                                                  │
│    → marks onboarding_complete = true                                           │
│         │                                                                        │
│  LIVE: AI agent now responds autonomously to all WhatsApp messages              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

*End of Part 4*
# PART 5 — SECURITY ARCHITECTURE: EVERY SHIELD EXPLAINED

---

## 5.0  Security Overview

Aura handles customer PII (names, phone numbers, purchase behaviour), sensitive business data
(product pricing, inventory, credentials), financial transactions and WhatsApp API keys.
Security is implemented at **every layer** of the stack — not as a single gate, but as a
defence-in-depth model.

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                         AURA DEFENCE-IN-DEPTH SECURITY MODEL                         ║
║                                                                                        ║
║   ██████████████████████████████████████████████████████████████████████████████     ║
║   █                    LAYER 1: PERIMETER                                      █     ║
║   █      HTTPS/TLS everywhere  ·  Clerk JWT on all dashboard routes            █     ║
║   ██████████████████████████████████████████████████████████████████████████████     ║
║         ██████████████████████████████████████████████████████████████████████       ║
║         █                 LAYER 2: API GATEWAY                                 █     ║
║         █   RBAC (5 roles)  ·  Webhook HMAC  ·  Internal service tokens       █     ║
║         ██████████████████████████████████████████████████████████████████████       ║
║               ██████████████████████████████████████████████████████████████         ║
║               █              LAYER 3: DATA ISOLATION                         █       ║
║               █   Row Level Security  ·  Tenant scoping  ·  RLS policies    █       ║
║               ██████████████████████████████████████████████████████████████         ║
║                     ████████████████████████████████████████████████████             ║
║                     █            LAYER 4: BUSINESS LOGIC                    █       ║
║                     █  Dedup locks  ·  Advisory locks  ·  Idempotency       █       ║
║                     ████████████████████████████████████████████████████             ║
║                           ████████████████████████████████████████                   ║
║                           █          LAYER 5: COMPLIANCE                   █        ║
║                           █   DPDP Act  ·  Data TTLs  ·  Consent audit    █        ║
║                           ████████████████████████████████████████                   ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 5.1  Dashboard Authentication — Clerk JWT (Layer 1)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              DASHBOARD AUTH FLOW — CLERK JWT + MULTI-TENANCY                     │
│                                                                                  │
│  Browser                   Clerk Auth               Aura API                    │
│     │                          │                        │                       │
│     │── Sign In ──────────────►│                        │                       │
│     │◄─ Signed JWT ────────────│                        │                       │
│     │   (contains org_id)      │                        │                       │
│     │                                                   │                       │
│     │── API Request (Bearer JWT) ──────────────────────►│                       │
│                                                         │                       │
│                                                    Verify JWT                   │
│                                               (Clerk public key)               │
│                                               Extract clerk_org_id             │
│                                               Lookup tenant_id                 │
│                                               Check requireRole()              │
│                                                         │                       │
│                                               ┌─────────────────┐              │
│                                               │  ROLE HIERARCHY │              │
│                                               │                 │              │
│                                               │ aura:read_only  │  Level 0    │
│                                               │ aura:agent      │  Level 1    │
│                                               │ aura:manager    │  Level 2    │
│                                               │ aura:owner      │  Level 3    │
│                                               │ aura:super_admin│  Level 4    │
│                                               └─────────────────┘              │
│                                                                                  │
│  403 returned if role level < required minimum                                  │
│                                                                                  │
│  NOTE: Clerk org_id → tenant_id resolution means even if a user                │
│  has access to two brands, they CANNOT cross-access data.                      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.2  Internal Service Token — API ↔ AI Authentication

The API server and AI microservice communicate over an internal network.
Even if an attacker could reach the AI service's port, they cannot call it
without a valid, tenant-scoped, time-limited cryptographic token.

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                   HMAC-SHA256 INTERNAL SERVICE TOKEN SCHEME                    ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  GENERATION (API worker, before calling /process)                               ║
║                                                                                  ║
║  1. Build payload JSON:                                                          ║
║     {                                                                            ║
║       "tenant_id": "<uuid>",         ← scope token to specific tenant          ║
║       "iss": "aura-api",             ← issuer claim                            ║
║       "aud": "aura-ai",              ← audience claim                          ║
║       "iat": <unix_ms_now>,          ← issued at                               ║
║       "exp": <unix_ms_now + 300000>  ← expires in 5 minutes                   ║
║     }                                                                            ║
║                                                                                  ║
║  2. payload_b64 = base64url(JSON.stringify(payload))                            ║
║  3. signature = HMAC-SHA256(INTERNAL_SERVICE_SECRET, payload_b64).hex()        ║
║  4. token = payload_b64 + "." + signature                                       ║
║  5. Header: X-Internal-Authorization: Bearer <token>                           ║
║                                                                                  ║
║  VERIFICATION (Python AI service, on every request)                             ║
║                                                                                  ║
║  1. Extract token from X-Internal-Authorization header                          ║
║  2. Split on "." → payload_b64, signature                                       ║
║  3. Recompute: expected = HMAC-SHA256(secret, payload_b64)                     ║
║  4. hmac.compare_digest(signature, expected)  ← TIMING-SAFE comparison        ║
║  5. Decode payload_b64 → JSON                                                   ║
║  6. Assert iss == "aura-api"  AND  aud == "aura-ai"                            ║
║  7. Assert tenant_id is valid UUID string                                       ║
║  8. Assert iat ≤ now + 60s  (clock skew tolerance)                            ║
║  9. Assert exp > now  (not expired)                                             ║
║  10. Assert exp - iat ≤ 300,000ms  (max 5 min TTL)                             ║
║  11. _enforce_tenant_scope: payload.tenant_id == request.tenant_id             ║
║                                                                                  ║
║  PRODUCTION SAFETY:                                                              ║
║  If INTERNAL_SERVICE_SECRET is empty → AI service REFUSES TO START            ║
║        raise RuntimeError("Missing INTERNAL_SERVICE_SECRET...")                ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 5.3  Webhook Security — Meta, Stripe, Razorpay

All three external webhook providers are authenticated with HMAC-based signatures.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     WEBHOOK SIGNATURE VERIFICATION MATRIX                        │
├────────────────┬───────────────────────────────────────────────────────────────┤
│  PROVIDER      │  MECHANISM                                                     │
├────────────────┼───────────────────────────────────────────────────────────────┤
│                │                                                                 │
│  Meta WhatsApp │  Header: X-Hub-Signature-256: sha256=<hex>                   │
│                │  Computed: HMAC-SHA256(META_APP_SECRET, raw_body)             │
│                │  Comparison: timing-safe byte comparison                      │
│                │  Failure: HTTP 403 returned, event discarded                  │
│                │                                                                 │
├────────────────┼───────────────────────────────────────────────────────────────┤
│                │                                                                 │
│  Stripe        │  stripe.webhooks.constructEvent(body, sig, STRIPE_SECRET)    │
│                │  Official Stripe SDK handles HMAC + replay protection         │
│                │  Includes timestamp-based tolerance window                    │
│                │                                                                 │
├────────────────┼───────────────────────────────────────────────────────────────┤
│                │                                                                 │
│  Razorpay      │  Header: X-Razorpay-Signature: <hex>                         │
│                │  Computed: HMAC-SHA256(RAZORPAY_WEBHOOK_SECRET, raw_body)    │
│                │  Comparison: custom timing-safe compare                       │
│                │  Failure: HTTP 400 returned, event discarded                  │
│                │                                                                 │
└────────────────┴───────────────────────────────────────────────────────────────┘

TIMING-SAFE COMPARISON:
  Standard == comparison leaks execution time, enabling timing attacks.
  All HMAC comparisons use constant-time algorithms (crypto.timingSafeEqual
  in Node.js, hmac.compare_digest in Python) to prevent signature oracle attacks.
```

---

## 5.4  Row Level Security — Database-Layer Tenant Isolation

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                    ROW LEVEL SECURITY — HOW IT WORKS                           ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  Every table in Aura has this policy:                                           ║
║                                                                                  ║
║  CREATE POLICY tenant_isolation ON <table>                                      ║
║    USING (tenant_id = current_setting('app.tenant_id', true)::uuid);            ║
║                                                                                  ║
║  Before any DB query, the API sets:                                             ║
║    SET app.tenant_id = '<caller_tenant_uuid>'                                   ║
║                                                                                  ║
║  WHAT THIS MEANS IN PRACTICE:                                                   ║
║                                                                                  ║
║  SELECT * FROM customers;                                                        ║
║                                                                                  ║
║  ← With RLS active, PostgreSQL automatically adds:                              ║
║  ← WHERE tenant_id = current_setting('app.tenant_id')::uuid                    ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────┐    ║
║  │  Brand A's database session:                                            │    ║
║  │  SELECT * FROM products → returns ONLY Brand A's products              │    ║
║  │                                                                         │    ║
║  │  Brand B's database session:                                            │    ║
║  │  SELECT * FROM products → returns ONLY Brand B's products              │    ║
║  │                                                                         │    ║
║  │  Even if a bug existed in the API, the DATABASE LAYER would            │    ║
║  │  still prevent cross-tenant data exposure.                              │    ║
║  └─────────────────────────────────────────────────────────────────────────┘    ║
║                                                                                  ║
║  This is a SECOND WALL behind the application-level tenant scoping.            ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 5.5  Message Deduplication — Idempotency Lock

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              REDIS IDEMPOTENCY LOCK — DUPLICATE WEBHOOK PREVENTION               │
│                                                                                  │
│  Problem: Meta retries webhooks if it doesn't receive a 200 within 5 seconds.  │
│  Without protection: same message processed twice → duplicate AI responses.     │
│                                                                                  │
│  Solution:                                                                       │
│                                                                                  │
│  On each webhook received:                                                       │
│    key = "msg:" + tenant_id + ":" + meta_message_id                            │
│    SETNX key "1" EX 86400  (SET if Not eXists, expire in 24h)                 │
│         │                                                                        │
│         ├── SETNX returns 1 (key was NEW) → process the message               │
│         └── SETNX returns 0 (key EXISTS) → STOP, already processed            │
│                                                                                  │
│  This is also enforced at DB level:                                             │
│    append_conversation_history_entry RPC checks meta_message_id deduplication  │
│    ensuring history never has duplicate entries even if Redis is bypassed.      │
│                                                                                  │
│  Double protection: Redis (fast) + PostgreSQL RPC (authoritative)              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.6  Double-Booking Prevention — PostgreSQL Advisory Locks

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              APPOINTMENT DOUBLE-BOOKING PREVENTION                               │
│                                                                                  │
│  Problem: Two customers may simultaneously book the last available slot,        │
│  both passing the availability check before either inserts.                     │
│                                                                                  │
│  Solution: pg_advisory_xact_lock                                                │
│                                                                                  │
│  lock_key = hash(store_id_bytes XOR hour_timestamp_bytes)                      │
│  pg_advisory_xact_lock(lock_key)                                                │
│  → PostgreSQL acquires an exclusive lock for this transaction                   │
│  → Any concurrent transaction requesting the same lock BLOCKS until first done │
│  → Lock released automatically when transaction commits or rolls back           │
│                                                                                  │
│  BOOKING TRANSACTION:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  BEGIN                                                                   │    │
│  │    pg_advisory_xact_lock(store_hour_hash)  ← acquires exclusive lock   │    │
│  │    SELECT COUNT(*) FROM appointments WHERE ...  ← count again INSIDE   │    │
│  │    IF count < max_slots THEN INSERT appointment                         │    │
│  │    ELSE RAISE 'slot_full'                                               │    │
│  │  COMMIT  ←  lock released here                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  Guarantees: even with 100 concurrent book attempts for the same slot,         │
│  exactly max_slots appointments are created — never more.                       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.7  Google OAuth CSRF Replay Protection

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              OAUTH STATE NONCE — CSRF + REPLAY PROTECTION                        │
│                                                                                  │
│  Attack prevented: CSRF — adversary tricks user into authorizing their          │
│  Google account to be linked to a legitimate brand's Aura account.             │
│                                                                                  │
│  Attack prevented: Replay — valid OAuth callback URL used more than once.      │
│                                                                                  │
│  FLOW:                                                                           │
│  1. GET /api/integrations/google/auth                                            │
│     → Generate cryptographically random nonce                                   │
│     → INSERT INTO oauth_state_nonces:                                           │
│         nonce, tenant_id, user_id, expires_at = now() + 10 minutes             │
│     → Redirect to Google OAuth with state=nonce                                │
│                                                                                  │
│  2. Google redirects back: GET /api/integrations/google/callback?code=...&state=│
│     → Look up oauth_state_nonces WHERE nonce = state                           │
│     → Check: not expired                                                        │
│     → Check: consumed_at IS NULL (not yet used)                                │
│     → UPDATE SET consumed_at = now()  ← ATOMIC, single-use                   │
│     → Process OAuth code exchange                                               │
│                                                                                  │
│  If nonce is missing, expired, or already consumed → 400 error                │
│  Nonce cannot be reused — the consumed_at update is atomic.                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.8  Secret Management — API Keys Never Exposed

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     SENSITIVE SECRET HANDLING POLICY                             │
│                                                                                  │
│  SECRET                        STORAGE           RETURN TO FRONTEND?           │
│  ──────────────────────────    ──────────────    ──────────────────            │
│  Meta System User Token        DB (tenants)      NEVER                         │
│  Nano Banana API Key           DB (tenants)      NEVER                         │
│  Google OAuth Tokens           DB (tenants)      NEVER                         │
│  Razorpay Subscription ID      DB (tenants)      NEVER                         │
│  INTERNAL_SERVICE_SECRET       Env variable      NEVER                         │
│  Stripe API Keys               Env variable      NEVER                         │
│  Razorpay API Keys             Env variable      NEVER                         │
│                                                                                  │
│  sanitizeTenantForClient():                                                     │
│    Before ANY tenant object is returned to the dashboard, this function        │
│    strips all secrets and replaces them with presence indicators:              │
│                                                                                  │
│    meta_access_token: "sk_abc123..." → REMOVED                                │
│    has_meta_access_token: false       → ADDED                                 │
│    nano_banana_api_key: "nb_key..."  → REMOVED                                │
│    has_nano_banana_api_key: true      → ADDED                                 │
│                                                                                  │
│  This ensures that even if XSS occurred on the dashboard, no secrets          │
│  could be extracted from the API responses.                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.9  VTO Image Privacy

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│              SELFIE IMAGE PRIVACY CONTROLS                                       │
│                                                                                  │
│  When customer sends a selfie for Virtual Try-On:                               │
│                                                                                  │
│  1. Image downloaded from Meta (temporary URL, expires quickly)                 │
│                                                                                  │
│  2. EXIF metadata stripped immediately                                           │
│     (EXIF can contain GPS coordinates, device info, timestamps)                │
│                                                                                  │
│  3. Minimum resolution check: 300×300px                                         │
│     (rejects degraded images that won't produce good results)                  │
│                                                                                  │
│  4. Uploaded to Supabase "vto-selfies" bucket                                   │
│     48-hour signed URL (selfie automatically expires and is inaccessible)      │
│                                                                                  │
│  5. VTO result uploaded to "vto-results" bucket                                 │
│     7-day signed URL (enough for customer to view/share)                       │
│                                                                                  │
│  6. design_sessions.selfie_storage_expires_at tracks per-tenant TTL            │
│     (configurable via ai_designer_retention_days setting)                       │
│                                                                                  │
│  Customer data never leaves Supabase storage except via                         │
│  time-limited signed URLs. No permanent public URLs are created.               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5.10  Security Feature Summary Visual

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                      COMPLETE SECURITY SHIELD MAP                                   ║
║                                                                                      ║
║  THREAT                          MITIGATION                         WHERE           ║
║  ──────────────────────────────  ────────────────────────────────   ─────────────  ║
║  Unauthorized dashboard access   Clerk JWT verification            API middleware  ║
║  Privilege escalation            5-tier RBAC requireRole()         API middleware  ║
║  Cross-tenant data access        Row Level Security policies        PostgreSQL      ║
║                                  + clerk_org_id → tenant resolution API layer     ║
║  Forged webhook from Meta        HMAC-SHA256 x-hub-signature-256   Webhook route  ║
║  Forged Stripe webhook           Stripe SDK constructEvent          Webhook route  ║
║  Forged Razorpay webhook         HMAC-SHA256 timing-safe compare   Webhook route  ║
║  AI service unauthenticated call HMAC-SHA256 internal tokens        AI service    ║
║  Token replay (AI service)       5-min TTL + exp/iat validation    AI service     ║
║  Token wrong tenant (AI service) tenant_id scope enforcement        AI service    ║
║  Duplicate webhook processing    Redis SETNX idempotency lock      API + DB       ║
║  Double appointment booking      pg_advisory_xact_lock             PostgreSQL      ║
║  OAuth CSRF attack               State nonce table                 API route      ║
║  OAuth callback replay           consumed_at atomic update         API route      ║
║  Secret leakage via API          sanitizeTenantForClient()         API response   ║
║  API key extraction              Env vars, never returned          All services   ║
║  Selfie location exposure        EXIF stripping                    VTO agent      ║
║  Permanent selfie storage        48h signed URL TTL                Supabase       ║
║  Design data oversharing         consent gate + per-session TTL   AI Designer    ║
║  Replay of lifecycle dispatch    idempotency_key UNIQUE constraint  PostgreSQL     ║
║  Concurrent scheduler conflicts  pg_try_advisory_lock (mutex)      PostgreSQL     ║
║  Design turn double-counting     design_turn_reservations UNIQUE   PostgreSQL     ║
║  Data retention violation        DPDP deletion jobs + auto-TTL     DB compliance  ║
║  Customer data request refusal   Data access handler (Right to     AI agent      ║
║                                   Access DPDP Act 2023)                           ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

*End of Part 5*
# PART 6 — CLIENT & CUSTOMER EXPERIENCE

---

## 6.1  The Two User Experience Surfaces

Aura has exactly two user-facing interfaces — one for each persona.
There is no app download, no portal login for customers. The entire
customer experience lives inside a channel they already use every day.

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                        TWO EXPERIENCE SURFACES                                       ║
║                                                                                      ║
║   ┌──────────────────────────────────────────────────────────────────────────────┐  ║
║   │  SURFACE 1: CLIENT DASHBOARD                                                 │  ║
║   │  WHO:   Jewellery brand owners, managers, staff                              │  ║
║   │  WHERE: Next.js web app at dashboard URL                                     │  ║
║   │  AUTH:  Clerk SSO (email / Google / org-invite)                              │  ║
║   │  ROLES: Owner · Manager · Agent · Read-Only                                 │  ║
║   └──────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                      ║
║   ┌──────────────────────────────────────────────────────────────────────────────┐  ║
║   │  SURFACE 2: CUSTOMER WHATSAPP                                                │  ║
║   │  WHO:   End shoppers (jewellery buyers)                                     │  ║
║   │  WHERE: WhatsApp (any device — zero installation)                            │  ║
║   │  AUTH:  Phone number (inherent in WhatsApp)                                  │  ║
║   │  FLOW:  Fully autonomous AI ↔ human takeover when needed                   │  ║
║   └──────────────────────────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 6.2  Client Dashboard — Full Page Map

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                     DASHBOARD PAGE MAP — 13 SECTIONS                                ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                      ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐    ║
║  │  SIDEBAR NAVIGATION                                                         │    ║
║  │                                                                             │    ║
║  │   📊  Overview           ← North Star metric + stat cards                 │    ║
║  │   💬  Control Room       ← Live conversations (Kanban + real-time)        │    ║
║  │   📢  Campaigns          ← Broadcast campaign management                 │    ║
║  │   📋  Templates          ← WhatsApp message template builder             │    ║
║  │   📅  Appointments       ← Appointment calendar                          │    ║
║  │   📈  Analytics          ← Performance metrics                           │    ║
║  │   💎  Catalog            ← Product management + import                   │    ║
║  │   👥  Customers          ← Customer CRM + bulk import                    │    ║
║  │   📚  Knowledge Base     ← Upload brand docs for AI reference            │    ║
║  │   🔄  Lifecycle          ← Occasion programs + savings plans             │    ║
║  │   🎨  Design Studio      ← AI designer session analytics                │    ║
║  │   ⚙️  Settings           ← VTO / Meta / AI Designer config              │    ║
║  │   💳  Billing            ← Plan selection + usage + invoices             │    ║
║  └─────────────────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 6.3  Dashboard Overview — The North Star

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD OVERVIEW PAGE                                         │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                                │ │
│  │    ★  VERIFIED STORE VISITS THIS MONTH:  47                                  │ │
│  │    (Conversations with status = BOOKED)                                       │ │
│  │                                                                                │ │
│  │    This is the single metric your AI is optimised to maximise.               │ │
│  │                                                                                │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│  │ Active       │ │ Appointments │ │ Messages     │ │    Total     │              │
│  │ Conversations│ │  This Week   │ │ Sent (Month) │ │    Convos    │              │
│  │    12        │ │     8        │ │   2,847      │ │    342       │              │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘              │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │  HITL QUEUE ALERT                                                              │ │
│  │  ┌──────┐                                                                     │ │
│  │  │  0   │ conversations need human attention                                  │ │
│  │  └──────┘ ← Green when clear, RED PULSE when > 0                            │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  Quick Actions: [Go to Control Room]  [Launch Campaign]  [View Analytics]          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.4  Control Room — Live Conversation Management

The most mission-critical page. Real-time Kanban board with WebSocket updates.

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                           LIVE CONTROL ROOM                                          ║
║                                                                                      ║
║  KANBAN COLUMNS (real-time via Supabase postgres_changes WebSocket):                ║
║                                                                                      ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────┐    ║
║  │  HUMAN       │ │    NEEDS     │ │  AI SELLING  │ │  BOOKED  │ │  CLOSED  │    ║
║  │  TAKEOVER    │ │  ATTENTION   │ │   (Active)   │ │          │ │          │    ║
║  │  ⚠️ URGENT   │ │              │ │              │ │          │ │          │    ║
║  │  (red glow)  │ │              │ │              │ │          │ │          │    ║
║  │              │ │  Low-conf    │ │  AI is auto- │ │ Appt.    │ │ Resolved │    ║
║  │  Requires    │ │  warning     │ │  managing    │ │ confirmed│ │ or opted │    ║
║  │  human to    │ │  signals     │ │  this chat   │ │ ✓        │ │ out      │    ║
║  │  take over   │ │              │ │              │ │          │ │          │    ║
║  │  ♪ AUDIO     │ │              │ │              │ │          │ │          │    ║
║  │    ALERT     │ │              │ │              │ │          │ │          │    ║
║  └──────────────┘ └──────────────┘ └──────────────┘ └──────────┘ └──────────┘    ║
║                                                                                      ║
║  CONVERSATION DETAIL PANEL (when a card is clicked):                                ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  Full chat history with role indicators:                                     │   ║
║  │    👤 Customer: "Do you have temple necklaces under 80,000?"               │   ║
║  │    🤖 AI:       "Yes! Here are three beautiful options..."                 │   ║
║  │    👔 Manager:  "[whisper] Mention the new Lakshmi collection"             │   ║
║  │    💻 System:   "[HITL_PREVIOUSLY_HANDLED]"                                │   ║
║  │                                                                             │   ║
║  │  ┌──────────────────────────────────────────────────────────────────────┐   │   ║
║  │  │  MANAGER TOOLS                                                       │   │   ║
║  │  │                                                                      │   │   ║
║  │  │  [🔴 TAKE OVER]     ← Sets HUMAN_TAKEOVER status                   │   │   ║
║  │  │  [💬 WHISPER]        ← Inject hidden instruction to AI context     │   │   ║
║  │  │                       (AI reads it, customer never sees it)         │   │   ║
║  │  │  [📤 DIRECT MESSAGE] ← Send message as the brand (while HITL=on)  │   │   ║
║  │  │  [🤖 RETURN TO AI]   ← Hand back to autopilot with handoff note   │   │   ║
║  │  └──────────────────────────────────────────────────────────────────────┘   │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 6.5  Campaign Manager

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                       CAMPAIGN WORKFLOW — CLIENT VIEW                            │
│                                                                                  │
│  1. CREATE CAMPAIGN                                                              │
│  ┌──────────────────────────────────────────────────────┐                       │
│  │ Name: "Diwali Gold Rush 2026"                        │                       │
│  │ Occasion: Diwali                                     │                       │
│  │ Template: [Select from approved WA templates ▼]     │                       │
│  │ Audience:  ○ All Customers                           │                       │
│  │            ○ High-Value (LTV ≥ ₹1,00,000)           │                       │
│  │            ○ Dormant (not visited in 12+ months)     │                       │
│  │ Batch Size: 50    Interval: 30 seconds               │                       │
│  │ AI Instructions: "Focus on gold coins and Lakshmi..." │                       │
│  └──────────────────────────────────────────────────────┘                       │
│                                                                                  │
│  2. AUDIENCE PREVIEW → "234 customers match this segment"                      │
│                                                                                  │
│  3. [LAUNCH]  →  Batches dispatched via BullMQ with staggered delays           │
│                                                                                  │
│  4. LIVE TRACKING                                                                │
│  ┌──────────────────────────────────────────────────────┐                       │
│  │  Sent: 234/234  ·  Delivered: 219  ·  Read: 187     │                       │
│  │  Conversations Started: 42                           │                       │
│  │  [PAUSE]  [RESUME]  [DELETE]                        │                       │
│  └──────────────────────────────────────────────────────┘                       │
│                                                                                  │
│  5. WHEN CUSTOMER REPLIES:                                                       │
│     Campaign response → AI picks up automatically with ai_instructions context  │
│     campaign_id tracked on conversation for attribution                          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.6  Knowledge Base Management

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      KNOWLEDGE BASE — CLIENT UPLOAD FLOW                         │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────┐                   │
│  │  UPLOAD DOCUMENT                                         │                   │
│  │                                                          │                   │
│  │  [ Drag & drop file or paste text ]                      │                   │
│  │                                                          │                   │
│  │  Supported formats:                                      │                   │
│  │    .txt  .md  .csv   → Text mode (FileReader)           │                   │
│  │    .pdf  .docx        → Binary mode (base64 encoded)    │                   │
│  │    Max file size: 6 MB                                   │                   │
│  │                                                          │                   │
│  │  Category:  ○ Policy (return, exchange, warranty)        │                   │
│  │             ○ FAQ (frequently asked questions)           │                   │
│  │             ○ Brand Story (heritage, craftsmanship)      │                   │
│  │             ○ Custom Instructions (AI behaviour rules)  │                   │
│  └──────────────────────────────────────────────────────────┘                   │
│                                                                                  │
│  PROCESSING PIPELINE:                                                            │
│    File → Extract text (pdf-parse / mammoth) →                                  │
│    Semantic chunking (by headings, then 2000 chars / 200 overlap) →             │
│    Write knowledge_chunks rows → Enqueue embedding jobs →                       │
│    Each chunk gets 1024-dim Mistral vector → ready for AI retrieval             │
│                                                                                  │
│  DOCUMENT LIST:                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  Document Name              Chunks    Embedded    Status     Actions    │   │
│  │  ─────────────────────────  ──────    ────────    ──────     ───────   │   │
│  │  Return Policy 2026.pdf       12         12      ✅ Ready   [Delete]  │   │
│  │  Brand Heritage.docx          8          5       ⏳ Processing        │   │
│  │  Pricing FAQ.txt              3          3       ✅ Ready   [Delete]  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.7  Catalog Management

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         CATALOG — PRODUCT MANAGEMENT                             │
│                                                                                  │
│  BULK IMPORT:                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  1. Upload CSV/XLSX/JSON file                                          │     │
│  │  2. Column mapping wizard (map your headers → Aura fields)            │     │
│  │  3. Parse preview (first 5 rows)                                       │     │
│  │  4. Import job created → async processing in background               │     │
│  │  5. Per-row diagnostics: imported ✅ / skipped ⏩ / failed ❌         │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  MEDIA MANAGEMENT:                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Upload sessions (batch image upload):                                 │     │
│  │  • Expected files / uploaded files progress                           │     │
│  │  • SHA-256 deduplication prevents redundant uploads                   │     │
│  │  • Auto-link by SKU to existing products                              │     │
│  │  • Variants: high_res · wa (WhatsApp optimised) · gallery            │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  EMBEDDING STATUS:                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Products with embeddings: 847/850                                     │     │
│  │  Products without: 3 (queued for embedding)                            │     │
│  │  [Re-embed All]  [Set Active/Inactive in Bulk]                        │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.8  Settings Page — Three Configuration Panels

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         SETTINGS — THREE CONFIG PANELS                           │
│                                                                                  │
│  PANEL 1: VIRTUAL TRY-ON (VTO)                                                  │
│  ┌────────────────────────────────────────────────────────────┐                 │
│  │  [✅] Enable Virtual Try-On                                │                 │
│  │  Nano Banana API Key: ●●●●●●●●●●●● (never displayed)     │                 │
│  │  Status indicator: has_nano_banana_api_key = true/false    │                 │
│  └────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
│  PANEL 2: META WHATSAPP                                                         │
│  ┌────────────────────────────────────────────────────────────┐                 │
│  │  WABA ID: [__________]                                     │                 │
│  │  Phone Number ID: [__________]                              │                 │
│  │  System User Token: ●●●●●●●●●●●● (masked, never returned) │                 │
│  │  Status: has_meta_access_token = true/false                │                 │
│  └────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
│  PANEL 3: AI DESIGNER                                                            │
│  ┌────────────────────────────────────────────────────────────┐                 │
│  │  [✅] Enable AI Designer                                   │                 │
│  │  Turn Limit: [━━━━━━━━●━━━] 10 turns per session          │                 │
│  │               (range: 1 – 20)                              │                 │
│  │  Retention Days: [━━━━━━●━━━━━] 30 days                   │                 │
│  │               (range: 1 – 365, DPDP compliance)           │                 │
│  │  [  ] Enable Try-On Bridge                                 │                 │
│  │       (disabled when AI Designer is off)                   │                 │
│  └────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
│  SECURITY NOTE: API keys are ONLY submitted, never retrieved.                  │
│  The dashboard shows boolean indicators (has_*_key) instead of actual values.  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.9  Billing & Subscription Page

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                           BILLING DASHBOARD                                         ║
║                                                                                      ║
║  CURRENT PLAN:                                                                       ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  Plan: GROWTH                         Status: [🟢 Active]                   │   ║
║  │  ₹14,999 / month                     Trial ends: N/A (on paid plan)        │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  USAGE THIS BILLING CYCLE:                                                           ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  AI Conversations   [████████████░░░░░░░░░░░░░]   1,247 / 2,500    49.9%   │   ║
║  │  VTO Generations    [████░░░░░░░░░░░░░░░░░░░░░]      78 / 250     31.2%    │   ║
║  │  Messages Sent      [██████████████░░░░░░░░░░░]   2,847 / ∞       on-demand│   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  UPGRADE OPTIONS:                                                                    ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                              ║
║  │   STARTER    │  │    GROWTH    │  │  ENTERPRISE  │                              ║
║  │  ₹4,999/mo   │  │  ₹14,999/mo  │  │  ₹39,999/mo  │                              ║
║  │  500 convos   │  │  2,500 convos│  │ 25,000 convos│                              ║
║  │   50 VTOs     │  │   250 VTOs   │  │  2,500 VTOs  │                              ║
║  │              │  │  14-day trial │  │              │                              ║
║  │ [PAY: CARD]  │  │ ✅ CURRENT   │  │ [PAY: CARD]  │                              ║
║  │ [PAY: UPI]   │  │              │  │ [PAY: UPI]   │                              ║
║  └──────────────┘  └──────────────┘  └──────────────┘                              ║
║                                                                                      ║
║  Stripe → global cards  ·  Razorpay → UPI + Indian debit/credit                   ║
║  Metered billing via usage_events table + Stripe reporting                          ║
║                                                                                      ║
║  INVOICE HISTORY:                                                                    ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  Date         Amount     Status     Invoice                                  │   ║
║  │  2026-03-01   ₹14,999    Paid       [📄 Download PDF]                       │   ║
║  │  2026-02-01   ₹14,999    Paid       [📄 Download PDF]                       │   ║
║  │  2026-01-01   ₹0         Trial      [📄 Download PDF]                       │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 6.10  Lifecycle Management — Occasion Programs + Savings

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     LIFECYCLE MANAGEMENT — 5 TABS                                │
│                                                                                  │
│  [Overview]  [Programs]  [Savings]  [Dispatch Queue]  [Ops Health]             │
│                                                                                  │
│  PROGRAMS TAB:                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Program: "Birthday Wishes"                                            │     │
│  │  Type: Occasion                                                        │     │
│  │  Trigger: customer.date_of_birth matches current date                 │     │
│  │  Template: "Happy Birthday" approved WA template                      │     │
│  │  Cooldown: 365 days (once per year!)                                  │     │
│  │  Quiet Hours: 9 PM – 8 AM IST (respectful messaging)                 │     │
│  │  Status: ✅ Active                                                     │     │
│  │  [Pause]  [Edit]                                                       │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  SAVINGS TAB:                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Customer: Priya Sharma   |  Plan: Gold Savings                       │     │
│  │  ₹5,000/month × 11 months  |  Merchant bonus: 1 free installment     │     │
│  │  Paid: 7/11  |  Next due: 2026-04-01  |  Status: Active              │     │
│  │  [Record Payment]  [View Schedule]  [Close Plan]                      │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  OPS HEALTH TAB:                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Scheduler: ✅ Healthy     Last Tick: 2 min ago                       │     │
│  │  Dispatches Pending: 12   Dispatches Failed (24h): 0                 │     │
│  │  Canary Rollout Stage: GA (general availability)                      │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.11  Customer WhatsApp Journey — What the Shopper Experiences

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                  CUSTOMER WHATSAPP JOURNEY — END-TO-END                             ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  STAGE 1: FIRST CONTACT                                                      │   ║
║  │                                                                              │   ║
║  │  Customer sends: "Hi, do you have gold necklaces?"                          │   ║
║  │                                                                              │   ║
║  │  AI responds (as the brand persona):                                        │   ║
║  │  "Welcome to [Brand Name]! ✨ We have a beautiful collection of             │   ║
║  │   gold necklaces. Let me show you some of our finest pieces.               │   ║
║  │   What's the occasion and your preferred budget range?"                    │   ║
║  │                                                                              │   ║
║  │  Memory captured: style_preference="gold necklaces"                         │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  STAGE 2: PRODUCT DISCOVERY                                                  │   ║
║  │                                                                              │   ║
║  │  Customer: "For my daughter's wedding, budget around 2 lakh"                │   ║
║  │                                                                              │   ║
║  │  AI: Searches catalog (vector + lexical) → finds 3 matching necklaces      │   ║
║  │  [Product Image 1]  "Lakshmi Temple Necklace — ₹1,85,000"                 │   ║
║  │  [Product Image 2]  "Antique Mango Mala — ₹2,10,000"                      │   ║
║  │  [Product Image 3]  "Bridal Choker Set — ₹1,95,000"                        │   ║
║  │                                                                              │   ║
║  │  Memory captured: budget_signal="₹2L", occasion_signal="daughter wedding"  │   ║
║  │  Buyer score: 0 → 35 (WARM_LEAD)                                           │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  STAGE 3: VIRTUAL TRY-ON (Optional)                                          │   ║
║  │                                                                              │   ║
║  │  Customer: "Can I try on the Lakshmi necklace?"                             │   ║
║  │  AI: "Of course! Please send me a clear selfie and I'll show you how       │   ║
║  │       the Lakshmi Temple Necklace looks on you! 📸"                        │   ║
║  │  Customer: [Sends selfie photo]                                              │   ║
║  │  AI: "Creating your virtual try-on... this takes about 15 seconds ⏳"      │   ║
║  │  ...                                                                         │   ║
║  │  AI: [VTO Result Image] "Here's how the Lakshmi Temple Necklace looks!     │   ║
║  │       Absolutely stunning for a wedding! Would you like to visit our        │   ║
║  │       store to see it in person?"                                            │   ║
║  │                                                                              │   ║
║  │  Buyer score: 35 → 70 (HOT_BUYER) — auto-triggers booking flow            │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  STAGE 4: APPOINTMENT BOOKING (Auto-triggered for HOT_BUYER)                 │   ║
║  │                                                                              │   ║
║  │  AI sends WhatsApp interactive list:                                         │   ║
║  │  ┌──────────────────────────────────────────────┐                           │   ║
║  │  │  "Choose a convenient time to visit:"        │                           │   ║
║  │  │                                              │                           │   ║
║  │  │  ○ Tomorrow 11:00 AM                        │                           │   ║
║  │  │  ○ Tomorrow 2:00 PM                         │                           │   ║
║  │  │  ○ Wednesday 11:00 AM                       │                           │   ║
║  │  │  ○ Wednesday 3:00 PM                        │                           │   ║
║  │  │  ○ Thursday 10:00 AM                        │                           │   ║
║  │  └──────────────────────────────────────────────┘                           │   ║
║  │                                                                              │   ║
║  │  Customer taps: "Tomorrow 11:00 AM"                                         │   ║
║  │  → Advisory lock acquired (prevents double-booking)                         │   ║
║  │  → Appointment created in database                                           │   ║
║  │  → Google Calendar event synced                                              │   ║
║  │  → Conversation status: BOOKED                                              │   ║
║  │                                                                              │   ║
║  │  AI: "Your appointment is confirmed for tomorrow at 11:00 AM at            │   ║
║  │       [Store Name], [City]. We look forward to welcoming you! 🙏"         │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                               │                                                      ║
║                               ▼                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  STAGE 5: POST-VISIT RELATIONSHIP                                            │   ║
║  │                                                                              │   ║
║  │  Lifecycle programs automatically engage:                                    │   ║
║  │  • Birthday wishes (occasion program)                                       │   ║
║  │  • Anniversary reminders                                                    │   ║
║  │  • Savings plan reminders (if enrolled)                                     │   ║
║  │  • Milestone celebrations                                                    │   ║
║  │                                                                              │   ║
║  │  All future conversations retrieve memory context:                          │   ║
║  │  "This customer is interested in temple jewellery for her daughter's        │   ║
║  │   wedding, budget around ₹2 lakh, previously tried on Lakshmi necklace"   │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 6.12  Human-In-The-Loop Interaction Model

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│               HUMAN-IN-THE-LOOP (HITL) — MANAGER ↔ AI ↔ CUSTOMER               │
│                                                                                  │
│  SCENARIO 1: AI REQUESTS HELP                                                   │
│  ──────────────────────────────                                                 │
│  Customer asks complex question or LTV ≥ ₹10L                                  │
│  → AI auto-escalates: status = HUMAN_TAKEOVER                                   │
│  → Card appears in red HITL column on Control Room                             │
│  → Audio alert plays (Web Audio API oscillator)                                │
│  → Manager clicks [Take Over] → can message customer directly                 │
│  → When done: [Return to AI] with handoff note                                │
│  → AI resumes, aware of human intervention via [HITL_PREVIOUSLY_HANDLED]       │
│                                                                                  │
│  SCENARIO 2: MANAGER WHISPERS TO AI                                             │
│  ──────────────────────────────────                                             │
│  Manager sees an active AI conversation and wants to guide the AI              │
│  → Types whisper: "Mention the 20% Diwali discount on gold coins"             │
│  → System prepends "[MANAGER WHISPER RECEIVED]" + whisper text                 │
│  → AI re-processes with new instruction injected into context                  │
│  → Customer never sees the whisper — only sees AI's updated response          │
│  → Manager stays invisible; AI gets smarter per-conversation                   │
│                                                                                  │
│  SCENARIO 3: COMPLETE FAILURE FALLBACK                                          │
│  ──────────────────────────────────────                                         │
│  If AI job fails all 3 retry attempts:                                          │
│  → Auto-escalate to HUMAN_TAKEOVER                                              │
│  → Send customer: "I'm connecting you with our team..."                        │
│  → No customer message is ever left unanswered                                 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.13  Onboarding Journey — 5-Step Brand Setup

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT ONBOARDING — 5 STEPS                                  │
│                                                                                  │
│  STEP 1: Organisation Setup                                                      │
│  POST /api/tenants/setup                                                        │
│  → Brand name, Clerk org created                                                │
│  → Tenant record created in database                                            │
│                                                                                  │
│  STEP 2: WhatsApp Business Connection                                           │
│  POST /api/tenants/waba-connect                                                  │
│  → Enter WABA ID, Phone Number ID, System User Token                           │
│  → Token stored encrypted, never returned to frontend                          │
│                                                                                  │
│  STEP 3: Catalog Upload                                                          │
│  → Upload CSV/XLSX of products or add manually                                 │
│  → Products embedded for semantic search                                       │
│                                                                                  │
│  STEP 4: Knowledge Base                                                          │
│  → Upload brand policies, FAQ, brand story                                     │
│  → Documents chunked and embedded                                              │
│                                                                                  │
│  STEP 5: AI Agent Configuration                                                  │
│  POST /api/tenants/agent-config                                                  │
│  → Set agent persona (name, tone, signature)                                   │
│  → Set business hours                                                           │
│  → Marks onboarding_complete = true                                            │
│  → AI is now LIVE on their WhatsApp number                                     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

*End of Part 6*
# PART 7 — INTEGRATIONS, QUEUES, COMPLIANCE & CONCLUSION

---

## 7.1  External Integration Architecture

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                     EXTERNAL INTEGRATION MAP                                        ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                      META WHATSAPP BUSINESS CLOUD API                        │   ║
║  │                                                                              │   ║
║  │  INBOUND:                                                                    │   ║
║  │   • POST /webhooks/meta — receives all customer messages                    │   ║
║  │   • GET  /webhooks/meta — hub verification challenge                        │   ║
║  │   • Status webhooks — delivery/read receipts → outbound_messages update     │   ║
║  │   • Template status webhooks → wa_templates status sync                     │   ║
║  │   Auth: HMAC-SHA256 signature (X-Hub-Signature-256)                         │   ║
║  │                                                                              │   ║
║  │  OUTBOUND:                                                                   │   ║
║  │   • Send text messages (POST /{phone_number_id}/messages)                   │   ║
║  │   • Send images with captions (pre-uploaded media)                          │   ║
║  │   • Send interactive lists (appointment slot picker)                        │   ║
║  │   • Send template messages (campaigns, lifecycle dispatches)                │   ║
║  │   • Submit new templates for approval                                       │   ║
║  │   • Sync existing templates from Meta                                       │   ║
║  │   Auth: Bearer token (meta_access_token from tenant record)                 │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                        STRIPE PAYMENT GATEWAY                                │   ║
║  │                                                                              │   ║
║  │  OUTBOUND:                                                                   │   ║
║  │   • Create checkout session (with trial if Growth plan)                     │   ║
║  │   • Create billing portal session (self-service management)                 │   ║
║  │   • List invoices (last 24, with PDF download URLs)                         │   ║
║  │   • Report metered usage events                                             │   ║
║  │                                                                              │   ║
║  │  INBOUND (webhook POST /webhooks/stripe):                                   │   ║
║  │   • checkout.session.completed → activate plan, detect trial                │   ║
║  │   • invoice.payment_succeeded → confirm active status                       │   ║
║  │   • invoice.payment_failed → set plan_status = past_due                    │   ║
║  │   • customer.subscription.deleted → cancel plan                            │   ║
║  │   • customer.subscription.updated → sync latest status                     │   ║
║  │   Auth: stripe.webhooks.constructEvent (SDK-level replay-safe verify)       │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                      RAZORPAY PAYMENT GATEWAY                                │   ║
║  │                                                                              │   ║
║  │  OUTBOUND:                                                                   │   ║
║  │   • Create subscription (UPI + Indian card support)                         │   ║
║  │                                                                              │   ║
║  │  INBOUND (webhook POST /webhooks/razorpay):                                 │   ║
║  │   • subscription.authenticated → plan activated                             │   ║
║  │   • subscription.activated → confirmed active                               │   ║
║  │   • subscription.charged → payment confirmed                                │   ║
║  │   • subscription.pending → set past_due                                     │   ║
║  │   • subscription.halted/cancelled → cancel plan                            │   ║
║  │   Auth: HMAC-SHA256 timing-safe compare (X-Razorpay-Signature)             │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                     GOOGLE CALENDAR API (OAuth 2.0)                          │   ║
║  │                                                                              │   ║
║  │  SETUP:                                                                      │   ║
║  │   • GET /api/integrations/google/auth → redirects to Google consent         │   ║
║  │   • GET /api/integrations/google/callback → receives code, exchanges tokens │   ║
║  │   • Tokens stored on tenant: google_access_token, google_refresh_token      │   ║
║  │   • CSRF protection: signed state nonce in oauth_state_nonces table         │   ║
║  │                                                                              │   ║
║  │  RUNTIME:                                                                    │   ║
║  │   • On appointment create → create Google Calendar event                    │   ║
║  │   • On appointment cancel → delete Google Calendar event                    │   ║
║  │   • On appointment update → update Google Calendar event                    │   ║
║  │   • Token refresh: automatic via google_refresh_token                       │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                     NANO BANANA API (Virtual Try-On)                         │   ║
║  │                                                                              │   ║
║  │   • POST — start VTO job (selfie + product reference)                       │   ║
║  │   • GET — poll job status (pending/complete/failed)                          │   ║
║  │   • Exponential backoff retry strategy                                      │   ║
║  │   • Circuit breaker: Redis key "nanobana:status"                           │   ║
║  │     OPEN → all VTO requests gracefully declined until health restored       │   ║
║  │   Auth: API key (nano_banana_api_key from tenant, never exposed to client)  │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                      MISTRAL AI (LLM + Embeddings)                           │   ║
║  │                                                                              │   ║
║  │   Models used:                                                               │   ║
║  │   • mistral-small-latest → Router agent (classification, temp=0.1)          │   ║
║  │   • mistral-large-latest → Sales, Support, Designer agents (creative)       │   ║
║  │   • Mistral embeddings → 1024-dimensional vectors for RAG                   │   ║
║  │   Auth: MISTRAL_API_KEY environment variable                                │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                      CLERK (Authentication & RBAC)                           │   ║
║  │                                                                              │   ║
║  │   • Dashboard SSO (email, Google, invite links)                             │   ║
║  │   • Organisation management (multi-tenant isolation)                        │   ║
║  │   • JWT verification on every API call                                      │   ║
║  │   • Role assignment: read_only / agent / manager / owner / super_admin      │   ║
║  │   • clerk_org_id → tenant_id resolution at API layer                       │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                      SUPABASE (Database + Storage)                           │   ║
║  │                                                                              │   ║
║  │   • PostgreSQL 15+ with pgvector extension                                  │   ║
║  │   • Row Level Security on every table                                       │   ║
║  │   • 10+ stored functions (RPCs) for business logic                          │   ║
║  │   • Realtime engine: postgres_changes → WebSocket to dashboard             │   ║
║  │   • Storage buckets: vto-selfies (48h TTL), vto-results (7-day TTL)        │   ║
║  │   Auth: service_role key (backend only, never exposed to client)            │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 7.2  Queue Architecture — BullMQ on Redis

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                      FOUR-QUEUE JOB PROCESSING ARCHITECTURE                        ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │                                 REDIS                                        │   ║
║  │                          (IORedis connection)                                │   ║
║  └──────┬───────────────┬──────────────────┬───────────────────┬────────────────┘   ║
║         │               │                  │                   │                     ║
║         ▼               ▼                  ▼                   ▼                     ║
║  ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐ ┌─────────────────┐         ║
║  │  QUEUE 1    │ │  QUEUE 2    │ │    QUEUE 3       │ │   QUEUE 4       │         ║
║  │  ai-jobs    │ │  campaign-  │ │  embedding-jobs  │ │  lifecycle-jobs │         ║
║  │             │ │  jobs       │ │                  │ │                 │         ║
║  │ Concurrency │ │             │ │                  │ │                 │         ║
║  │ = 5         │ │  Staggered  │ │  Async vector    │ │  Scheduled      │         ║
║  │             │ │  batch      │ │  embedding       │ │  occasion/      │         ║
║  │ Processes   │ │  dispatch   │ │  generation      │ │  savings        │         ║
║  │ WhatsApp    │ │  with       │ │  for products,   │ │  message        │         ║
║  │ messages    │ │  interval   │ │  knowledge, and  │ │  dispatch       │         ║
║  │ through     │ │  delays     │ │  customer memory │ │                 │         ║
║  │ AI pipeline │ │             │ │                  │ │  claim via      │         ║
║  │             │ │             │ │  Fallback:       │ │  FOR UPDATE     │         ║
║  │ 3 attempts  │ │             │ │  inline embed    │ │  SKIP LOCKED    │         ║
║  │ exp backoff │ │             │ │  if Redis down   │ │                 │         ║
║  │ base 3s     │ │             │ │                  │ │  Advisory lock  │         ║
║  │             │ │             │ │                  │ │  mutex          │         ║
║  │ On final    │ │             │ │                  │ │                 │         ║
║  │ failure:    │ │             │ │                  │ │                 │         ║
║  │ auto-HITL   │ │             │ │                  │ │                 │         ║
║  │ escalation  │ │             │ │                  │ │                 │         ║
║  └─────────────┘ └─────────────┘ └──────────────────┘ └─────────────────┘         ║
║                                                                                      ║
║  REDIS ALSO USED FOR:                                                                ║
║    • Message idempotency locks: SETNX (tenant_id, message_id) TTL 24h              ║
║    • VTO circuit breaker: key "nanobana:status"                                     ║
║    • VTO bridge idempotency: SETNX "vto:bridge:{convo}:{fingerprint}"              ║
║                                                                                      ║
║  ADMIN MONITORING (aura:owner role):                                                 ║
║    GET /api/admin/queues/stats → job counts by state per queue                     ║
║    GET /api/admin/queues/failed → last 10 failures with error details              ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 7.3  Retry & Failure Strategy

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     RETRY & FAILURE HANDLING MATRIX                               │
├────────────────────────┬─────────────────────────────────────────────────────────┤
│ COMPONENT              │ STRATEGY                                                │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ AI message processing  │ 3 attempts, exponential backoff (3s base)              │
│ (ai-jobs queue)        │ On final failure: auto-HITL escalation                 │
│                        │ Customer receives bridge message                       │
│                        │ "Connecting you with our team..."                      │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ Nano Banana VTO        │ Exponential backoff retries on job submission          │
│                        │ Circuit breaker (Redis) prevents stampede              │
│                        │ Timeout → graceful fallback message                   │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ Embedding generation   │ Queue-based retry. If Redis is down:                   │
│                        │ inline direct-embed fallback (synchronous)             │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ Lifecycle dispatch     │ attempt_count tracked per dispatch                     │
│                        │ Failed dispatches can be retried via ops dashboard     │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ Campaign messages      │ Batch-level retry. Paused campaigns can be            │
│                        │ resumed (only re-targets un-contacted customers)      │
├────────────────────────┼─────────────────────────────────────────────────────────┤
│ RAG retrieval          │ Three-layer cascade: v2 vector → v1 vector → lexical  │
│                        │ If all fail: agent responds from general knowledge    │
├────────────────────────┴─────────────────────────────────────────────────────────┤
│ DESIGN PRINCIPLE: No customer message is ever left unanswered.                   │
│ If AI fails completely, a human is notified and the customer gets a bridge msg. │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.4  DPDP Act 2023 Compliance — India's Data Protection Law

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                DPDP ACT 2023 COMPLIANCE — BUILT INTO EVERY LAYER                   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  RIGHT TO ERASURE (Section 12)                                               │   ║
║  │                                                                              │   ║
║  │  Customer says: "Delete my data" / "Forget me" / "Erase everything"         │   ║
║  │                                                                              │   ║
║  │  1. Router fast-path detects deletion keywords → DATA_DELETION_REQUEST      │   ║
║  │  2. data_deletion_handler creates data_deletion_jobs record (pending)       │   ║
║  │  3. Customer receives confirmation with 72-hour SLA                         │   ║
║  │  4. Conversation marked CLOSED, customer marked opted_out                   │   ║
║  │  5. data_deletion_jobs.customer_id is FK with SET NULL on delete            │   ║
║  │     → actual DELETE of customer record doesn't break audit trail            │   ║
║  │  6. records_deleted JSONB logs what was erased (audit-compliant)            │   ║
║  │                                                                              │   ║
║  │  Privacy check endpoint (admin):                                             │   ║
║  │  POST /api/admin/design-audit/privacy-check                                 │   ║
║  │  → Verifies ZERO residual data across all 20+ tables for deleted customer   │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  RIGHT TO ACCESS (Section 11)                                                │   ║
║  │                                                                              │   ║
║  │  Customer asks: "What data do you have about me?"                           │   ║
║  │                                                                              │   ║
║  │  1. Router fast-path detects access keywords → DATA_ACCESS_REQUEST          │   ║
║  │  2. data_access_handler calls get_customer_data_summary tool                │   ║
║  │  3. Returns formatted summary directly in WhatsApp:                         │   ║
║  │     • Name, phone number                                                    │   ║
║  │     • Purchase history count + lifetime value                               │   ║
║  │     • Preferred product category                                            │   ║
║  │     • Number of conversations on record                                     │   ║
║  │  4. Customer can then request deletion if desired                           │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  DATA MINIMISATION & TTL                                                     │   ║
║  │                                                                              │   ║
║  │  • Selfie images: 48-hour signed URL (auto-expire)                          │   ║
║  │  • VTO results: 7-day signed URL                                            │   ║
║  │  • Design session data: configurable retention (1–365 days)                 │   ║
║  │  • Customer memory events: expires_at column for automatic TTL              │   ║
║  │  • EXIF metadata stripped from selfies immediately (location privacy)       │   ║
║  │  • Design consent: immutable audit record (design_consents table)           │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                      ║
║  ┌──────────────────────────────────────────────────────────────────────────────┐   ║
║  │  OPT-OUT MANAGEMENT                                                          │   ║
║  │                                                                              │   ║
║  │  • Customer says "STOP" / "opt out" / "unsubscribe"                        │   ║
║  │  • Router classifies as OPT_OUT                                             │   ║
║  │  • opt_out_handler: sets customer.opted_out = true                          │   ║
║  │  • All future webhook processing checks opted_out flag FIRST               │   ║
║  │  • Opted-out customers excluded from campaigns and lifecycle programs       │   ║
║  │  • marketing_opt_in tracked separately for granular consent control         │   ║
║  └──────────────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 7.5  Canary Rollout & Feature Gating System

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    CANARY ROLLOUT SYSTEM — GRADUAL FEATURE EXPOSURE              │
│                                                                                  │
│  Used for: Lifecycle Programs, AI Designer                                      │
│                                                                                  │
│  STAGES:                                                                         │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐                           │
│  │ internal│canary_1 │canary_5 │canary_25│   GA    │                           │
│  │         │         │         │         │         │                           │
│  │ Aura    │ 1 pilot │ 5       │ 25      │  All    │                           │
│  │ team    │ tenant  │ tenants │ tenants │ tenants │                           │
│  │ only    │         │         │         │         │                           │
│  └────►────┴────►────┴────►────┴────►────┴────►────┘                           │
│                                                                                  │
│  CONTROLS (admin-only):                                                          │
│  • GET /api/admin/canary/status      → current stage + tenant count            │
│  • POST /api/admin/canary/enable     → add up to 50 tenants per call           │
│  • POST /api/admin/canary/disable    → remove tenants from canary              │
│  • POST /api/admin/canary/promotion-check → verify metrics before promotion   │
│                                                                                  │
│  AI Designer SLO (Service Level Objectives):                                    │
│  • Generation success rate threshold: ≥ 92%                                    │
│  • P95 latency threshold: ≤ 45 seconds                                         │
│  • Duplicate turn allocation threshold: 0                                       │
│  • GET /api/design-sessions/slo/health → HEALTHY or DEGRADED                   │
│                                                                                  │
│  Cross-tenant audit:                                                             │
│  GET /api/admin/design-audit/cross-tenant                                       │
│  → Verifies sessions / generations / handoffs all belong to same tenant        │
│  → Catches any potential data isolation bugs before they reach production       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.6  Monitoring & Observability

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     MONITORING & OBSERVABILITY STACK                             │
│                                                                                  │
│  HEALTH CHECKS:                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  GET /health (API)                                                     │     │
│  │    • Supabase connectivity (tenants.select probe)                     │     │
│  │    • Redis URL format validation                                       │     │
│  │    • Returns: { status, timestamp, version: "0.1.0", db, redis }     │     │
│  │                                                                        │     │
│  │  GET /health (AI)                                                      │     │
│  │    • Returns: { status: "ok", version: "0.2.0" }                     │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  STRUCTURED LOGGING:                                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  Pino (JSON) — every log includes:                                     │     │
│  │    • timestamp · level · msg                                          │     │
│  │    • tenant_id (for multi-tenant filtering)                           │     │
│  │    • conversation_id / customer_id (for trace correlation)            │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  RAG AUDIT:                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  rag_query_logs table captures every retrieval:                        │     │
│  │    • query_type · used_v2 · fallback_used                             │     │
│  │    • hit_count · top_similarity_score                                  │     │
│  │    → Enables monitoring of retrieval quality degradation              │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  QUEUE METRICS (owner-only):                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  GET /api/admin/queues/stats → per-queue job counts by state          │     │
│  │  GET /api/admin/queues/failed → last 10 failures + error traces      │     │
│  │  Across all 4 queues: ai-jobs, campaign-jobs, embedding-jobs,         │     │
│  │                        lifecycle-jobs                                  │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  USAGE METERING:                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  usage_events table → every AI conversation, VTO, message, design    │     │
│  │  → Drives plan limit enforcement (checkPlanLimits before processing) │     │
│  │  → Feeds Stripe metered usage reporting                              │     │
│  │  → Powers billing dashboard usage bars                               │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.7  Full Feature Inventory

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                      COMPLETE FEATURE INVENTORY                                     ║
╠═════════════════════════════════╦════════════════════════════════════════════════════╣
║  CATEGORY                       ║  FEATURES                                         ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Autonomous AI conversations via WhatsApp       ║
║  AI SALES ENGINE                ║  • Intent classification (11 categories)           ║
║                                 ║  • Tool-calling sales consultant                   ║
║                                 ║  • Knowledge-grounded support concierge            ║
║                                 ║  • Dynamic buyer scoring (0–100)                  ║
║                                 ║  • Automatic hotlead → booking trigger            ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • 1024-dim Mistral vector embeddings              ║
║  SEMANTIC SEARCH (RAG)          ║  • Three-layer retrieval cascade                   ║
║                                 ║  • pgvector HNSW indexes                           ║
║                                 ║  • Category diversity caps                         ║
║                                 ║  • Lexical fallback for edge cases                ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Persistent per-customer memory                  ║
║  CUSTOMER MEMORY                ║  • 9 memory signal types extracted automatically  ║
║                                 ║  • Salience + freshness ranking                   ║
║                                 ║  • TTL-based expiry                               ║
║                                 ║  • Dedup fingerprint prevents duplicates           ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Real-time selfie → AI jewellery overlay        ║
║  VIRTUAL TRY-ON (VTO)           ║  • EXIF stripping (privacy)                        ║
║                                 ║  • Circuit breaker + bridge messages               ║
║                                 ║  • Signed URL storage with TTL                    ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Multi-turn bespoke design conversations         ║
║  AI DESIGNER                    ║  • Consent gate (DPDP compliance)                  ║
║                                 ║  • Concept image generation                       ║
║                                 ║  • Production handoff packaging                   ║
║                                 ║  • Idempotent turn accounting                     ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Advisory-lock–protected booking                ║
║  APPOINTMENTS                   ║  • Google Calendar bidirectional sync              ║
║                                 ║  • WhatsApp interactive slot picker                ║
║                                 ║  • Store availability + block-date management      ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • CSV/XLSX/JSON bulk import with mapping          ║
║  CATALOG MANAGEMENT             ║  • Per-row error diagnostics                       ║
║                                 ║  • Media upload sessions with SHA-256 dedup        ║
║                                 ║  • Auto-embedding on insert/update                ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • PDF / DOCX / TXT / MD / CSV upload              ║
║  KNOWLEDGE BASE                 ║  • Semantic chunking (headings + fixed-size)       ║
║                                 ║  • Category-tagged retrieval                       ║
║                                 ║  • Priority weighting (1–10)                      ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Template-based broadcasts                       ║
║  CAMPAIGNS                      ║  • Audience segmentation                           ║
║                                 ║  • Batch dispatch with rate limiting               ║
║                                 ║  • Pause / Resume / Live tracking                 ║
║                                 ║  • AI picks up campaign replies automatically     ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Occasion programs (birthday/anniversary)        ║
║  LIFECYCLE MANAGEMENT           ║  • Gold savings plans with installments            ║
║                                 ║  • Automated dispatch scheduling                  ║
║                                 ║  • Cooldown + quiet hours + timezone respect       ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Kanban control room (5 columns)                 ║
║  HUMAN-IN-THE-LOOP              ║  • Real-time WebSocket updates                     ║
║                                 ║  • Manager whisper (invisible AI guidance)        ║
║                                 ║  • Direct messaging during takeover                ║
║                                 ║  • Audio alerts for urgent HITL cards             ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Stripe + Razorpay dual gateway                  ║
║  BILLING                        ║  • Three plans with metered usage                  ║
║                                 ║  • Trial support (14-day Growth plan)             ║
║                                 ║  • Invoice history with PDF download              ║
╠═════════════════════════════════╬════════════════════════════════════════════════════╣
║                                 ║  • Right to Erasure (72h SLA)                      ║
║  COMPLIANCE (DPDP ACT)          ║  • Right to Access (instant via WhatsApp)          ║
║                                 ║  • Opt-out management                              ║
║                                 ║  • Data minimisation (TTL on all PII storage)     ║
║                                 ║  • Consent audit trail (immutable records)        ║
║                                 ║  • Privacy check endpoint (admin)                 ║
╚═════════════════════════════════╩════════════════════════════════════════════════════╝
```

---

## 7.8  Why This Architecture Wins

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║    WHY AURA IS BUILT TO WIN                                                         ║
║                                                                                      ║
║    1. ZERO-FRICTION CHANNEL                                                          ║
║       Customers don't download an app. They don't visit a website.                 ║
║       They just text on WhatsApp — the channel they use 100+ times a day.          ║
║                                                                                      ║
║    2. AI THAT REMEMBERS                                                              ║
║       Every conversation builds a memory profile. When a customer comes             ║
║       back months later, the AI remembers their taste, budget, and occasion.       ║
║                                                                                      ║
║    3. HUMAN WHEN IT MATTERS                                                          ║
║       AI handles 95%+ of conversations. For VIP customers or complex cases,        ║
║       a human seamlessly takes over — and whispers guide the AI to improve.        ║
║                                                                                      ║
║    4. SECURITY-FIRST, NOT SECURITY-BOLTED                                           ║
║       5 security layers. Row-level isolation. HMAC verification on every            ║
║       webhook. Secrets never returned to frontend. DPDP Act compliance baked in.   ║
║                                                                                      ║
║    5. BUILT FOR INDIA                                                                ║
║       INR pricing. Razorpay UPI payments. Indian mobile number validation.         ║
║       DPDP Act 2023 compliance. Hindi + regional language support.                 ║
║       Lifecycle programs designed for Indian gold savings traditions.               ║
║                                                                                      ║
║    6. EVERY FEATURE FUNNELS TO ONE METRIC                                           ║
║       Product search → VTO → booking. Memory → relevance → booking.               ║
║       Campaigns → conversations → booking. Savings plans → store visits.           ║
║       Everything optimises for in-store appointments.                               ║
║                                                                                      ║
║    7. GRADUATING AUTONOMY                                                            ║
║       Start with AI handling simple queries. As confidence grows, enable VTO,       ║
║       AI Designer, lifecycle programs. Canary rollouts ensure safe expansion.       ║
║       Every feature has a kill switch.                                               ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

---

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                   END OF DOCUMENT                                   ║
║                                                                                      ║
║           AURA — Autonomous AI Sales Engine for Luxury Jewellery                    ║
║                                                                                      ║
║                          Architecture v0.2.0                                        ║
║                          Confidential — Not for public distribution                 ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```
