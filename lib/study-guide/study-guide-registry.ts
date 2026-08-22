import type { EssayMetadata } from "@/lib/content/schema";

type StudyGuideEntry = {
  sourcePath: string;
  navigationKind: "harness" | "single-guide";
  readerPosition: string;
  sequenceName: string;
  navigationLabel: string;
  mobileNavigationLabel: string;
  overviewLabel: string;
  currentLabel: string;
  finalLabel?: string;
};

const studyGuideRegistry: Record<string, StudyGuideEntry> = {
  "harness-engineering-study-guide": {
    sourcePath: "harness/harness-engineering-study-guide.mdx",
    navigationKind: "harness",
    readerPosition: "Complete short course",
    sequenceName: "Harness Engineering",
    navigationLabel: "Harness Engineering chapters",
    mobileNavigationLabel: "Harness Engineering chapter list",
    overviewLabel: "Course overview",
    currentLabel: "Harness Engineering Study Guide",
  },
  "the-model-is-not-the-agent": {
    sourcePath: "harness/the-model-is-not-the-agent.mdx",
    navigationKind: "harness",
    readerPosition: "Chapter 1 of 40",
    sequenceName: "Harness Engineering",
    navigationLabel: "Harness Engineering chapters",
    mobileNavigationLabel: "Harness Engineering chapter list",
    overviewLabel: "Course overview",
    currentLabel: "The Model Is Not the Agent",
    finalLabel: "The H0→H9 progression",
  },
  "memory-engineering-study-guide": {
    sourcePath: "memory/memory-engineering-study-guide.mdx",
    navigationKind: "single-guide",
    readerPosition: "Complete short course",
    sequenceName: "Memory Engineering",
    navigationLabel: "Memory Engineering guide",
    mobileNavigationLabel: "Memory Engineering guide list",
    overviewLabel: "Fieldbook overview",
    currentLabel: "Memory Engineering Study Guide",
  },
};

export function getStudyGuideEntry(slug: string): StudyGuideEntry {
  const entry = studyGuideRegistry[slug];
  if (!entry) throw new Error(`No trusted public study-guide entry for ${slug}`);
  return entry;
}

export function getStudyGuideEntryForEssay(essay: EssayMetadata): StudyGuideEntry {
  return getStudyGuideEntry(essay.slug);
}
