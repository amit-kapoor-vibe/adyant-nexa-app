"use client";

import { NexaProtocol } from "./architecture/NexaProtocol";
import { EliteMatrix } from "./architecture/EliteMatrix";
import { CaseStudies } from "./architecture/CaseStudies";

/**
 * ArchitectureSection — Orchestrates the three architecture sub-sections.
 * Data lives in src/data/architectureData.ts
 * Sub-components live in src/components/architecture/
 */
export const ArchitectureSection = () => {
  return (
    <>
      <NexaProtocol />
      <EliteMatrix />
      <CaseStudies />
    </>
  );
};
