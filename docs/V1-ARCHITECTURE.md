# Adyant Nexa V1 Architecture Specification (Validation-First Edition)

**Date:** August 27, 2026  
**System:** Product-Led Business Growth Intelligence Platform  
**Target Focus:** Indian Fashion & Apparel Retailers (₹2Cr - ₹50Cr Revenue Scope)

---

## 1. System Architecture Overview

Adyant Nexa V1 is structured as a lean, validation-first product-led web application built on Next.js 16 (App Router), Supabase PostgreSQL, and Upstash Redis.

```
+-----------------------------------------------------------------------------------+
|                           CLIENT LAYER (Validation-First)                         |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  |  Public Web App     |   | Free Growth         |   | 2 Core Tools            |  |
|  |  (Fashion Focus)    |   | Assessment (/assess)|   | (/tools/profit & stock) |  |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  +---------------------+   +---------------------+                                |
|  | Admin Lead Viewer   |   | Result Experience & |                                |
|  | (/admin)            |   | Lead Unlock Modal   |                                |
|  +---------------------+   +---------------------+                                |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / REST / Server Actions
+-----------------------------------------v-----------------------------------------+
|                                 APPLICATION LAYER                                 |
|  +-----------------------------------------------------------------------------+  |
|  | Next.js App Router API Routes & Server Actions                               |  |
|  |  - Auth Middleware & RLS Verification                                       |  |
|  |  - Upstash Rate Limiting & Input Validation (Zod)                           |  |
|  +-----------------------------------------------------------------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | Fashion Retail Calculation Engine (src/lib/engine/)                         |  |
|  |  - Inventory & Dead Stock Capital Engine                                     |  |
|  |  - Margin & Discount Erosion Engine                                         |  |
|  |  - Customer Retention & Repeat Purchase Engine                              |  |
|  |  - Marketing Acquisition Efficiency Engine                                  |  |
|  |  - Composite Growth Score Synthesizer (0-100)                                |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                                  DATA & SERVICES                                  |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  | Supabase PostgreSQL |   | Upstash Redis       |   | Telegram Real-Time      |  |
|  | (Leads & Diagnostic)|   | (Rate Limiting)     |   | Lead Alerts             |  |
|  +---------------------+   +---------------------+   +-------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Information Architecture (Validation-First)

### Public Core Routes
- `/` — Homepage: Business Growth Positioning ("Find Where Your Fashion Retail Business Is Losing Money")
- `/solutions/fashion-retail` — Dedicated Fashion & Apparel Growth Solutions Landing Page
- `/how-it-works` — Diagnostic Method & Architecture Explanation

### Primary Diagnostic Routes
- `/assessment` — Multi-Step Diagnostic Assessment Wizard (Steps 1-7: Business, Sales, Inventory, Marketing, Customers, Margins, Review)
- `/assessment/result` — Instant Growth Score (0-100), Estimated Profit Opportunity (₹), and Top 3 Opportunities

### Core Supporting Tools (2 Validation Tools)
- `/tools` — Interactive Tools Directory
- `/tools/profit-opportunity` — Overall Profit Opportunity & Leakage Calculator
- `/tools/dead-stock` — Dead Stock & Capital Lock Calculator

### Admin & Auth Routes
- `/login` — Admin & Auth Portal
- `/admin` — Admin Intelligence & Lead Management Console

---

## 3. Deferred Features (Post-Validation V1.1 / V2 Roadmap)

To maintain extreme focus on user validation, the following features are explicitly deferred until post-launch user validation:
- Customer Dashboard (`/dashboard`)
- Additional industry verticals (Footwear, General Retail)
- 3 additional calculators (`marketing-roi`, `customer-retention`, `break-even`)
- Automated paid blueprint checkout & payment gateways (Razorpay/Stripe)
- Complex AI recommendation integrations
