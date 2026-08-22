import type { EssayMetadata } from "@/lib/content/schema";

type SequenceItem =
  | { kind: "link"; label: string; href: string; eyebrow?: string }
  | { kind: "current"; label: string; eyebrow?: string }
  | { kind: "forthcoming"; label: string; eyebrow: string };

type StudyGuideEntry = {
  sourcePath: string;
  readerPosition: string;
  sequenceName: string;
  navigation: {
    label: string;
    mobileLabel: string;
    drawerLabel: string;
    overview: { label: string; href: string };
    items: SequenceItem[];
  };
  finalLabel?: string;
};

const studyGuideRegistry: Record<string, StudyGuideEntry> = {
  "harness-engineering-study-guide": {
    sourcePath: "harness/harness-engineering-study-guide.mdx",
    readerPosition: "Complete short course",
    sequenceName: "Harness Engineering",
    navigation: {
      label: "Harness Engineering chapters",
      mobileLabel: "Harness Engineering chapter list",
      drawerLabel: "Open chapters",
      overview: { label: "Course overview", href: "/#chapters" },
      items: [
        { kind: "link", label: "Course overview", href: "/#chapters" },
        { kind: "current", eyebrow: "Short course", label: "Harness Engineering Study Guide" },
        {
          kind: "link",
          eyebrow: "Chapter 1 of 40",
          label: "The Model Is Not the Agent",
          href: "/fieldbook/the-model-is-not-the-agent",
        },
      ],
    },
  },
  "the-model-is-not-the-agent": {
    sourcePath: "harness/the-model-is-not-the-agent.mdx",
    readerPosition: "Chapter 1 of 40",
    sequenceName: "Harness Engineering",
    navigation: {
      label: "Harness Engineering chapters",
      mobileLabel: "Harness Engineering chapter list",
      drawerLabel: "Open chapters",
      overview: { label: "Course overview", href: "/#chapters" },
      items: [
        { kind: "link", label: "Course overview", href: "/#chapters" },
        {
          kind: "link",
          eyebrow: "Short course",
          label: "Harness Engineering Study Guide",
          href: "/fieldbook/harness-engineering-study-guide",
        },
        { kind: "current", eyebrow: "Chapter 1 of 40", label: "The Model Is Not the Agent" },
        { kind: "forthcoming", eyebrow: "Up next", label: "The H0→H9 progression" },
      ],
    },
    finalLabel: "The H0→H9 progression",
  },
  "memory-engineering-study-guide": {
    sourcePath: "memory/memory-engineering-study-guide.mdx",
    readerPosition: "Complete short course",
    sequenceName: "Memory Engineering",
    navigation: {
      label: "Memory Engineering guide",
      mobileLabel: "Memory Engineering guide list",
      drawerLabel: "Open Memory guide",
      overview: { label: "Memory guide overview", href: "/#memory-guide-title" },
      items: [
        { kind: "link", label: "Memory guide overview", href: "/#memory-guide-title" },
        { kind: "current", eyebrow: "Short course", label: "Memory Engineering Study Guide" },
      ],
    },
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
