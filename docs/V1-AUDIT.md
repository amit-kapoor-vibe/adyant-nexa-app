# Adyant Nexa V1 Audit Document

**Date:** August 27, 2026  
**Status:** Complete  
**Target:** Transformation from Agency Website to Product-Led Business Growth Intelligence Platform

---

## 1. Executive Summary

Adyant Nexa is undergoing a strategic transformation from a productized agency into a **product-led Business Growth Intelligence Platform** focused on Indian SMBs, starting with retailers (fashion, footwear, general retail). 

The platform's core value proposition is:
> **"Find where your business is losing money."**

This document provides a comprehensive technical audit of the current Adyant Nexa codebase, evaluating its readiness, stack compatibility, reusable assets, technical debt, and required architectural extensions for V1.

---

## 2. Technical Stack Audit

| Category | Current Implementation | Audit & Compatibility Evaluation |
|---|---|---|
| **Framework** | Next.js 16.2.6 (App Router) | **Preserve.** Latest Next.js App Router with Server Components & API routes. |
| **Language** | TypeScript 5.x | **Preserve.** Strict typing configured in `tsconfig.json`. |
| **UI & Styling** | Tailwind CSS v4 + Inline Styles + Custom CSS | **Preserve Design Tokens.** Uses `#020202` void black, `#00F2FF` electric cyan, `#E5E5E5` platinum white. Inline styles + named CSS classes in `globals.css`. |
| **Animations** | Framer Motion 12.x, GSAP 3.15, Lenis Scroll | **Preserve.** High-end smooth animations and spatial UI present across components. |
| **3D / Visuals** | Three.js, `@react-three/fiber`, `@react-three/drei` | **Preserve.** Used in `ThreeSwirl.tsx` and neural background graphics. |
| **Database** | Supabase PostgreSQL (`@supabase/supabase-js` 2.104.1) | **Preserve & Extend.** Raw SQL scripts present (`supabase_invoices_schema.sql`, `supabase_vault_schema.sql`). High compatibility for relational schemas. |
| **Auth** | Supabase Auth (PKCE flow) | **Preserve & Extend.** PKCE flow setup in `src/lib/supabase.ts` and `src/lib/auth.ts`. |
| **Security & Rate Limiting** | `@upstash/ratelimit`, `@upstash/redis` | **Preserve.** Server-side rate limiting active in API routes (`/api/leads`, `/api/audit`). |
| **Validation** | Zod 4.x (`src/lib/validation.ts`) | **Preserve & Extend.** Safe schemas for leads, audit, and chat. |
| **AI Integration** | `@google/generative-ai` 0.24.1 | **Preserve.** Server-side Gemini API integration present in `/api/chat`. |
| **Alerts / Notifications** | Telegram Bot API integration | **Preserve & Extend.** Instant notification engine active on lead submission. |

---

## 3. Existing Routes & Structural Inventory

| Route | File Location | Purpose | Reusability / Action for V1 |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Main Homepage | **Update Copy & Layout.** Re-position from agency services to Business Growth Engine. |
| `/login` | `src/app/login/page.tsx` | Auth Portal | **Extend.** Adapt for customer & admin authentication. |
| `/admin` | `src/app/admin/page.tsx` | Admin Control Center | **Refactor.** Upgrade from lead reviewer to Business Growth Intelligence Admin. |
| `/journal` | `src/app/journal/page.tsx` | Content / Blog | **Keep.** Content marketing foundation. |
| `/legal`, `/privacy`, `/terms`, `/refund-policy` | `src/app/...` | Compliance Pages | **Keep.** Essential legal pages. |
| `/api/leads` | `src/app/api/leads/route.ts` | Lead Submission | **Extend.** Link to assessment output and report generation. |
| `/api/admin/verify` | `src/app/api/admin/verify/route.ts` | Admin Check | **Keep.** Admin verification logic. |

---

## 4. Reusable Assets & Core Components

1. **Design Tokens & System (`src/app/globals.css`)**
   - Palette: Void Black (`#020202`), Electric Cyan (`#00F2FF`), Platinum White (`#E5E5E5`), Dark Surface (`#080808`).
   - Custom utility classes: `.editorial-tag`, `.glass-panel`, `.btn-primary`, `.btn-secondary`, `.pulse-dot`, `.text-glow-cyan`.
2. **Layout Components (`src/components/Navbar.tsx`, `src/components/SkeletonLoader.tsx`, `src/components/CustomCursor.tsx`)**
   - Responsive header, smooth cursor, skeleton loaders ready for dashboard and assessment steps.
3. **Interactive Visuals (`src/components/ROICalculator.tsx`, `src/components/ServicesSection.tsx`)**
   - Visual slider patterns and glassmorphic card designs to be repurposed for the multi-step Growth Assessment and interactive business tools.

---

## 5. Technical Debt & Gaps for V1 Platform

1. **Agency-Focused Messaging:** Current copy emphasizes custom web development and AI automation consulting rather than diagnostic profit leakage discovery.
2. **Calculation Logic Location:** Early calculation visualizers in `ROICalculator.tsx` reside in client components rather than a testable, deterministic backend calculation engine.
3. **Database Schema Gaps:** Current schema (`leads` table) lacks structured relational support for `users`, `businesses`, `assessments`, `assessment_answers`, `growth_scores`, `opportunities`, and `reports`.
4. **Missing V1 Product Routes:**
   - Multi-step assessment: `/assessment`, `/assessment/result`
   - Interactive business tools: `/tools`, `/tools/profit-opportunity`, `/tools/dead-stock`, `/tools/marketing-roi`, `/tools/customer-retention`, `/tools/break-even`
   - Industry solutions: `/solutions`, `/solutions/fashion-retail`, `/solutions/footwear`, `/solutions/retail`
   - Core product pages: `/how-it-works`, `/pricing`, `/about`, `/contact`, `/dashboard`

---

## 6. Key Architectural Recommendations

1. **Keep Next.js + Supabase Architecture:** No need to switch frameworks. Next.js 16 App Router combined with Supabase PostgreSQL provides optimal developer speed, security, and Vercel hosting compatibility.
2. **Domain-Driven Calculation Engine:** Move all financial opportunity logic into a dedicated domain package (`src/lib/engine/`) with zero UI dependencies, complete unit test coverage, and strict versioning.
3. **Relational Database Migration:** Deploy structured PostgreSQL schemas via Supabase SQL migrations to cleanly model users, businesses, multi-step assessments, calculated growth scores, profit leakages, and generated reports.
4. **Responsive Lead-to-Account Flow:** Allow visitors to complete the assessment, view immediate high-level growth scores and leakage estimates, and capture leads seamlessly before optional account creation.
