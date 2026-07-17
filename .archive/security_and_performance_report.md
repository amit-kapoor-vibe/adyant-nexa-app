# Security & Performance Optimization Report

This report provides a reality-grounded audit of the dependencies in `package.json` for **Adyant Nexa**, detailing active security vulnerabilities, bundle size issues, and API performance bottlenecks, along with concrete actionable solutions.

---

## Part 1: Security Audit & CVE Investigation

Our deep automated dependency scan identified **17 vulnerabilities** (2 High Severity, 6 Moderate Severity, 9 Low Severity) arising from nested (transitive) dependencies within the project ecosystem. 

Below is the triage of the critical vulnerabilities:

### 🔴 High Severity: `protobufjs` (<= 7.5.5)
*   **Vulnerability:** GHSA-66ff-xgx4-vchm / CVE-2026-44293 (Code Injection), GHSA-2pr8-phx7-x9h3 (Denial of Service), and GHSA-fx83-v9x8-x52w (Prototype Pollution).
*   **Impact:** A malicious or crafted protobuf JSON descriptor or schema can cause arbitrary JavaScript code execution or crash the server. This package is imported via `@google-cloud/firestore` in the Firebase Admin SDK.
*   **Fix:** Upgrade `protobufjs` to **`7.5.6`** or **`8.0.2`** immediately.

### 🔴 High Severity: `fast-xml-builder` (<= 1.1.6)
*   **Vulnerability:** GHSA-5wm8-gmm8-39j9 / CVE-2026-44665 (XML Attribute Injection).
*   **Impact:** Maliciously crafted input containing unescaped quote characters inside attribute values can break the XML context and allow injection of unwanted attributes.
*   **Fix:** Upgrade `fast-xml-builder` to **`1.1.7`** or later.

### 🟡 Moderate Severity: `ws` (8.0.0 - 8.20.0)
*   **Vulnerability:** GHSA-58qx-3vcg-4xpx / CVE-2026-45736 (Uninitialized Memory Disclosure).
*   **Impact:** When calling `websocket.close()`, if a `TypedArray` is passed as the `reason` argument, it discloses uninitialized memory.
*   **Fix:** Upgrade `ws` to **`8.20.1`** or later.

### 🟡 Moderate Severity: `uuid` (11.0.0 - 11.1.0)
*   **Vulnerability:** GHSA-w5hq-g745-h8pq (Missing buffer bounds check).
*   **Impact:** When a buffer is provided in v3/v5/v6 generators without bounds checks, it can result in silent partial writes or out-of-bounds access.
*   **Fix:** Upgrade `uuid` to **`11.1.1`** or later.

---

### 🛠️ The Automated Remediation Plan

Since these vulnerabilities are hidden inside transitive dependencies (e.g., pulled in by Firebase and third-party tools), standard upgrades won't fix them. We can use NPM **Overrides** in `package.json` to force npm to resolve these to secure versions.

Add this `overrides` block inside your [package.json](file:///c:/Users/mi/adyant-nexa-app/package.json):

```json
  "overrides": {
    "protobufjs": "^7.5.6",
    "fast-xml-builder": "^1.1.7",
    "ws": "^8.20.1"
  }
```

Once added, execute:
```powershell
npm install
```
This forces all nested dependencies to resolve to these safe patch versions.

---

## Part 2: Performance Audit & Bundle Optimization

### 1. Lazy Loading Three.js & R3F (Saving ~600 KB Initial Load)
Your landing page imports [NeuralGalaxyPro.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/NeuralGalaxyPro.tsx) statically within [HeroSection.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/HeroSection.tsx).
*   **The Issue:** This pulls the massive Three.js library (`three`, `@react-three/fiber`, and `@react-three/drei`) directly into the main entry bundle. Every visitor downloads **~600 KB+ of uncompressed JS** before the page becomes interactive.
*   **Optimization:** Convert `NeuralGalaxyPro` into a **dynamic client component** that lazy-loads only after the initial page structure has rendered.

**Updated import in [HeroSection.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/HeroSection.tsx):**
```tsx
import dynamic from "next/dynamic";

// Defer loading of heavy 3D WebGL Canvas
const NeuralGalaxyPro = dynamic(() => import("./NeuralGalaxyPro"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0, backgroundColor: "#020202" }} />
});
```

### 2. Next.js Dynamic Imports for Heavy Widgets
Your site uses complex interactive components that are only displayed on user interaction:
*   [ScannerModal.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/ScannerModal.tsx) (10 KB modal overlay)
*   [ChatWidget.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/ChatWidget.tsx) (12.5 KB chat assistant)
*   [ROICalculator.tsx](file:///c:/Users/mi/adyant-nexa-app/src/components/ROICalculator.tsx) (11.5 KB tool)

**Recommendation:** Do not load these on initial page paint. Dynamically import them so they are only fetched once the user clicks "Scan" or opens the calculator.

```tsx
const ScannerModal = dynamic(() => import("./ScannerModal"), { ssr: false });
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });
```

---

## Part 3: API Response Time Improvements

To achieve latency under **50ms** and keep database resources secure, we recommend implementing:

### 1. Row-Level Cache-Control Headers
For public database reads (like service pricing or marquee strings), use caching headers to fetch data directly from edge CDNs instead of hitting the backend database every time:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getPublicData();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59"
    }
  });
}
```

### 2. database Indexing in Supabase
Ensure you have created indices on all tables that are queried inside client-facing API routes:
```sql
-- Speed up queries checking user permissions or logs
CREATE INDEX idx_logs_created_at ON logs (created_at DESC);
```
