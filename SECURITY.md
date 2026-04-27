# Adyant Nexa | Security Protocol 🛡️

This document defines the mandatory security standards for all developers and systems within the Adyant Nexa ecosystem. As we scale to high-value enterprise clients, compliance with these protocols is non-negotiable.

---

## 1. Credential Management (The "Golden Rule")
* **NO HARDCODED SECRETS**: API keys, Database URIs, and private tokens must NEVER be committed to version control.
* **.env Protocol**: All local secrets must reside in `.env.local` (included in `.gitignore`).
* **CI/CD Secrets**: All production tokens for GitHub Actions, Firebase, or Supabase must be stored in **GitHub Repository Secrets**.

## 2. Data & Database Security (RLS)
* **Row Level Security (RLS)**: Must be enabled on all Supabase/Firebase tables. No client should ever be able to query another client's data via the client-side SDK.
* **Least Privilege**: Service roles (Admin keys) should only be used in Server-Side environments (Edge Functions / API Routes), never exposed to the frontend.

## 3. API & Infrastructure
* **Input Sanitization**: All incoming data from the frontend (Forms, Scanners) must be sanitized and validated on the backend before being processed or stored.
* **Rate Limiting**: Critical API endpoints (Leads, Auth) must be protected by rate-limiters to prevent DDoS and brute-force attacks.
* **SSR/SSG Advantage**: Use Server-Side Rendering whenever possible to keep sensitive logic away from the client's browser.

## 4. Third-Party Integrations
* **Audit**: Any new npm package or external library must be audited for security vulnerabilities (`npm audit`) before being added to the project.
* **Minimal Scope**: Only request the minimum necessary permissions when integrating with external APIs (Google, Meta, Stripe).

---

## Security Contact 🚨
If you discover a vulnerability or a potential leak, report it immediately.

**"Security is not a state, it is a continuous process of vigilance."** 🕯️📈✨
