# Adyant Nexa | Security Protocol 🛡️

This document defines the mandatory security standards for all developers and systems within the Adyant Nexa ecosystem. As we scale to high-value enterprise clients, compliance with these protocols is non-negotiable.

---

## 1. Credential Management (The "Golden Rule")
* **NO HARDCODED SECRETS**: API keys, Database URIs, and private tokens must NEVER be committed to version control.
* **.env Protocol**: All local secrets must reside in `.env.local` (included in `.gitignore`).
* **CI/CD Secrets**: All production tokens for GitHub Actions, Firebase, or Supabase must be stored in **GitHub Repository Secrets**.
* **Key Rotation**: All critical API keys and service accounts must be rotated bi-annually (every 6 months) to invalidate any potentially undiscovered leaks.

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

## 5. AI Safety & Operational Integrity (The "PocketOS Safeguard")
* **Human-in-the-Loop**: AI agents are strictly forbidden from executing destructive database commands (`DROP`, `TRUNCATE`, `DELETE` without WHERE) autonomously. All such operations must be provided as SQL scripts for manual execution by a human administrator.
* **Credential Isolation**: AI must never be granted access to "Service Role" or "Root" credentials. Only `anon` or scoped API keys should be accessible in the development environment.
* **Verification Protocol**: Any AI-generated code affecting infrastructure or data persistence must be peer-reviewed by a human before being deployed to production.

## 6. Proactive Threat Intelligence & "The Impenetrable Door"
* **The "Impenetrable Door" Standard:** Our infrastructure must be designed assuming constant attack. If a human hacker targets the site, the "door" must not just be locked—it must be invisible and unbreakable. We implement defense-in-depth at every layer (Network, App, Database).
* **Preemptive Analysis:** We do not wait for vulnerabilities to be reported. We actively analyze market trends for new attack vectors (e.g., Prompt Injection, Zero-Days) and patch proactively.
* **Client Education (The Journal):** Security is a shared responsibility. We will utilize the Adyant Nexa Journal to educate our clients and the public about emerging threats, reinforcing our position as a trusted, ethical authority in the space.

## 7. Data Resilience (The 3-2-1 Strategy)
* **Asset Protection:** While code is version-controlled, proprietary assets (design files, client branding, high-res media) must follow the 3-2-1 backup protocol: 3 total copies, 2 different local mediums, 1 offsite/cloud backup.
* **Disaster Recovery:** A system rebuild should never take more than 24 hours. Regular audits of the backup integrity are mandatory.

---

## Security Contact 🚨
If you discover a vulnerability, a potential leak, or if an AI agent attempts an unauthorized destructive action, report it immediately.

**"Security is not a state, it is a continuous process of vigilance—especially in the age of AI."** 🕯️📈✨
