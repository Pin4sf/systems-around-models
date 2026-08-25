import type { EssayMetadata } from "@/lib/content/schema";
import { harnessCourse } from "@/lib/study-guide/harness-course";

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

const allHarnessChapters = harnessCourse.flatMap((part) => part.chapters);

function publicHarnessChapters(releasedEssays: EssayMetadata[]) {
  return releasedEssays
    .filter((essay) =>
      essay.status === "public" &&
      essay.sequence === "Harness Engineering" &&
      essay.sequencePosition > 1,
    )
    .sort((left, right) => left.sequencePosition - right.sequencePosition);
}

function harnessChapterItems(
  releasedEssays: EssayMetadata[],
  currentSlug?: string,
): SequenceItem[] {
  return publicHarnessChapters(releasedEssays).map((essay) => {
    const chapterNumber = essay.sequencePosition - 1;
    return currentSlug === essay.slug
      ? { kind: "current", eyebrow: `Chapter ${chapterNumber}`, label: essay.title }
      : {
          kind: "link",
          eyebrow: `Chapter ${chapterNumber}`,
          label: essay.title,
          href: `/fieldbook/${essay.slug}`,
        };
  });
}

function harnessNavigation(
  releasedEssays: EssayMetadata[],
  currentSlug?: string,
): StudyGuideEntry["navigation"] {
  return {
    label: "Harness Engineering chapters",
    mobileLabel: "Harness Engineering chapter list",
    drawerLabel: "Open chapters",
    overview: { label: "Course overview", href: "/#chapters" },
    items: [
      { kind: "link", label: "Course overview", href: "/#chapters" },
      currentSlug === "harness-engineering-study-guide"
        ? { kind: "current", eyebrow: "Short course", label: "Harness Engineering Study Guide" }
        : {
            kind: "link",
            eyebrow: "Short course",
            label: "Harness Engineering Study Guide",
            href: "/fieldbook/harness-engineering-study-guide",
          },
      ...harnessChapterItems(releasedEssays, currentSlug),
    ],
  };
}

function harnessGuideEntry(releasedEssays: EssayMetadata[]): StudyGuideEntry {
  return {
    sourcePath: "harness/harness-engineering-study-guide.mdx",
    readerPosition: "Complete short course",
    sequenceName: "Harness Engineering",
    navigation: harnessNavigation(releasedEssays, "harness-engineering-study-guide"),
  };
}

function harnessChapterEntry(
  essay: EssayMetadata,
  releasedEssays: EssayMetadata[],
): StudyGuideEntry {
  const chapterNumber = essay.sequencePosition - 1;
  const nextChapter = allHarnessChapters.find((candidate) => candidate.number === chapterNumber + 1);
  const nextIsReleased = Boolean(
    essay.nextEssaySlug && releasedEssays.some((candidate) => candidate.slug === essay.nextEssaySlug),
  );
  const navigation = harnessNavigation(releasedEssays, essay.slug);

  return {
    sourcePath: `harness/${essay.slug}.mdx`,
    readerPosition: `Chapter ${chapterNumber}`,
    sequenceName: "Harness Engineering",
    navigation: {
      ...navigation,
      items: [
        ...navigation.items,
        ...(!nextIsReleased && nextChapter
          ? [{ kind: "forthcoming", eyebrow: "Coming next", label: nextChapter.title } as const]
          : []),
      ],
    },
    finalLabel: !nextIsReleased ? nextChapter?.title : undefined,
  };
}

const memoryGuideEntry: StudyGuideEntry = {
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
};

export function getStudyGuideEntryForEssay(
  essay: EssayMetadata,
  releasedEssays: EssayMetadata[],
): StudyGuideEntry {
  if (essay.slug === "memory-engineering-study-guide") return memoryGuideEntry;
  if (essay.slug === "harness-engineering-study-guide") return harnessGuideEntry(releasedEssays);
  if (essay.sequence === "Harness Engineering") return harnessChapterEntry(essay, releasedEssays);
  throw new Error(`No trusted public study-guide entry for ${essay.slug}`);
}
