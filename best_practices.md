# Adyant Nexa — Elite Developer Manifesto

## 🔒 Execution Protocol (MANDATORY)
- **NO AUTO-RUN**: Do not use `run_command` or `browser_subagent` directly.
- **COMMAND HANDOVER**: Always provide terminal commands to the USER in chat for manual execution.
- **TASK NOTIFICATION**: Inform the USER immediately after any code edit is completed for verification.
- **CREDIT OPTIMIZATION**: Prioritize file edits over complex research/browser tasks.

Follow these rules to keep the codebase modular, secure, and high-performance.

## 1. Modular Architecture (The 200-Line Rule)
- **Rule**: If a component exceeds 200 lines, it must be split.
- **Action**: Separate UI (content) from Logic (canvas/math) and Data.
- **Example**: `HeroSection.tsx` was split into `HeroCanvas.tsx` and `HeroContent.tsx`.

## 2. Data Extraction
- **Rule**: Never hardcode large arrays or static text inside components.
- **Action**: Move all static content (testimonials, service lists, pricing) to `src/data/`.
- **Benefit**: Easier updates without touching core logic.

## 3. Security First (The Vault)
- **Rule**: Never expose API keys or secrets in client-side code.
- **Action**: 
  - Use `.env.local` for all keys.
  - Only access sensitive keys in `src/app/api/` (Server Side).
  - Use `trackEvent` for analytics instead of hardcoding scripts.

## 4. Strict Type Safety
- **Rule**: No `any`. Ever.
- **Action**: Define interfaces in `src/types/index.ts`.
- **Benefit**: Catch errors during development instead of in production.

## 5. Performance Hygiene
- **Rule**: Lazy load anything below the fold.
- **Action**: Use `next/dynamic` for heavy components like the ROI Calculator or Contact form.
- **Action**: Use the `SkeletonLoader` for a premium perceived loading experience.

## 6. Interaction Defense
- **Rule**: Protect public endpoints.
- **Action**: Always implement rate limiting on form submissions (leads/scans).
- **Action**: Validate all user inputs before processing.

---
*Signed,*
**Antigravity AI — Elite Systems Architect**
