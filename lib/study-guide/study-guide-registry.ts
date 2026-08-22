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

const releasedHarnessChapters = [
  ["the-model-is-not-the-agent", "The Model Is Not the Agent"],
  ["the-h0-to-h9-progression", "The H0→H9 Progression"],
  ["twelve-recurring-failure-classes", "Twelve Recurring Failure Classes"],
  ["four-surface-classes", "Four Surface Classes"],
  ["developer-and-product-runtime-harnesses", "Developer and Product-Runtime Harnesses"],
] as const;

function harnessChapterItems(currentSlug?: string): SequenceItem[] {
  return releasedHarnessChapters.map(([slug, label], index) => currentSlug === slug
    ? { kind: "current", eyebrow: `Chapter ${index + 1} of 40`, label }
    : { kind: "link", eyebrow: `Chapter ${index + 1} of 40`, label, href: `/fieldbook/${slug}` });
}

function harnessChapterEntry(slug: string, sourcePath: string, finalLabel?: string): StudyGuideEntry {
  const chapterIndex = releasedHarnessChapters.findIndex(([chapterSlug]) => chapterSlug === slug);
  return {
    sourcePath,
    readerPosition: `Chapter ${chapterIndex + 1} of 40`,
    sequenceName: "Harness Engineering",
    navigation: {
      label: "Harness Engineering chapters",
      mobileLabel: "Harness Engineering chapter list",
      drawerLabel: "Open chapters",
      overview: { label: "Course overview", href: "/#chapters" },
      items: [
        { kind: "link", label: "Course overview", href: "/#chapters" },
        { kind: "link", eyebrow: "Short course", label: "Harness Engineering Study Guide", href: "/fieldbook/harness-engineering-study-guide" },
        ...harnessChapterItems(slug),
        ...(finalLabel ? [{ kind: "forthcoming", eyebrow: "Coming next", label: finalLabel } as const] : []),
      ],
    },
    finalLabel,
  };
}

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
        ...harnessChapterItems(),
      ],
    },
  },
  "the-model-is-not-the-agent": harnessChapterEntry("the-model-is-not-the-agent", "harness/the-model-is-not-the-agent.mdx"),
  "the-h0-to-h9-progression": harnessChapterEntry("the-h0-to-h9-progression", "harness/the-h0-to-h9-progression.mdx"),
  "twelve-recurring-failure-classes": harnessChapterEntry("twelve-recurring-failure-classes", "harness/twelve-recurring-failure-classes.mdx"),
  "four-surface-classes": harnessChapterEntry("four-surface-classes", "harness/four-surface-classes.mdx"),
  "developer-and-product-runtime-harnesses": harnessChapterEntry(
    "developer-and-product-runtime-harnesses",
    "harness/developer-and-product-runtime-harnesses.mdx",
    "Instructions and context assembly",
  ),
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
