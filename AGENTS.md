<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🔒 UI DESIGN LOCK — DO NOT CHANGE WITHOUT EXPLICIT USER PERMISSION

**Status: LOCKED as of 2026-04-15**

## ⚠️ CRITICAL RULES FOR ALL AI AGENTS

The UI/UX design of this project is **FROZEN**. You MUST follow these rules at all times:

1. **DO NOT redesign, restyle, or "improve" any UI component** unless the user explicitly says "redesign this" or "change the look".
2. **DO NOT change colors** — the design uses `#020202` void black, `#00F2FF` electric cyan, `#E5E5E5` platinum white. Keep them exactly.
3. **DO NOT replace inline styles with Tailwind classes** or vice versa — the current approach (inline styles + minimal named CSS classes) is intentional and working.
4. **DO NOT add, remove, or restructure sections** without a direct user request.
5. **DO NOT change fonts** — Syne (headings), Inter (body), Geist Mono (code/tags) are locked.
6. **DO NOT touch `globals.css`** unless fixing a specific bug the user reported.

## ✅ What you ARE allowed to do

- Fix specific bugs the user reports
- Add new content/data (e.g. new testimonials, new client names)
- Update text copy if user requests it
- Add new **sections** only if user explicitly asks
- Performance/SEO fixes that don't affect visual output
- Fix TypeScript/lint errors

## 🏗️ Architecture — What's Working (Don't Break It)

- **Framework**: Next.js 16, React 19, TypeScript
- **Styling**: Inline `style={{}}` props + a few named CSS classes in `globals.css`
- **Animation**: Framer Motion (keep all existing animations)
- **Scroll**: Lenis smooth scroll
- **Fonts**: Google Fonts via `next/font/google` in `layout.tsx`
- **NO Tailwind utility classes in JSX** — Tailwind v4 + Turbopack had processing issues

## 📁 File Map

| File | Purpose | Touch? |
|---|---|---|
| `src/app/page.tsx` | Main page — all sections inline | Only for content edits |
| `src/app/globals.css` | Named CSS classes only | Only for bug fixes |
| `src/app/layout.tsx` | Fonts + metadata | Only for metadata updates |
| `src/components/CustomCursor.tsx` | Custom cursor | Do NOT touch |
| `src/components/HeroSection.tsx` | Hero canvas + animations | Do NOT touch |
| `src/components/NeuralMarquee.tsx` | Scrolling marquee strip | Do NOT touch |
| `src/components/ServicesSection.tsx` | Services cards | Do NOT touch |

## 🎨 Design System Reference

```
Colors:
  Background:  #020202  (void black)
  Text:        #E5E5E5  (platinum white)
  Accent:      #00F2FF  (electric cyan)
  Surface:     #080808  (alternate sections)

Typography:
  Headings:    Syne, weight 800, tracking -0.03em
  Body:        Inter, weight 400-600
  Mono/Tags:   Geist Mono, weight 600-700, letter-spacing 0.4em, UPPERCASE

Spacing:
  Section padding: 7rem (112px) vertical, 28px horizontal
  Max content width: 1280px
  Narrow content: 800px

Named CSS Classes (in globals.css):
  .editorial-tag     — monospace uppercase cyan label
  .glitch-shimmer    — hero headline shimmer animation
  .glitch-text       — hero headline glitch effect
  .glass-panel       — glassmorphism card
  .pulse-dot         — animated cyan dot
  .text-glow-cyan    — cyan text glow
  .ghost-text        — large watermark background text
  .scan-overlay      — cinematic scanline overlay
  .btn-primary       — primary CTA button
  .btn-secondary     — secondary ghost button
  .ambient-orb       — background glow orb
```
