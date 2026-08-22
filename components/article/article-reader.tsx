import { readFile } from "node:fs/promises";
import path from "node:path";
import type { HTMLAttributes } from "react";
import { ArticleContents, type ArticleHeading } from "@/components/article/article-contents";
import { StudyGuideFooter } from "@/components/article/study-guide-footer";
import {
  ArticlePager,
  SequenceNavigation,
} from "@/components/article/sequence-navigation";
import { SystemTrace } from "@/components/diagrams/system-trace";
import {
  CapabilityBinding,
  ContextAssembly,
  ControlStructures,
  CustodyBoundary,
  FailureChain,
  HarnessHandoff,
  HarnessProgression,
  MemoryLifecycle,
  StateLayers,
  SurfaceMap,
} from "@/components/diagrams/harness-learning-diagrams";
import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";
import { compilePublicMdx } from "@/lib/content/compile-public-mdx";
import { slugifyHeading } from "@/lib/content/slugify";
import { getStudyGuideEntryForEssay } from "@/lib/study-guide/study-guide-registry";

function articleHeadings(source: string): ArticleHeading[] {
  return [...source.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => ({
    label: match[1],
    id: slugifyHeading(match[1]),
  }));
}

type ArticleReaderProps = {
  essay: EssayMetadata;
  revision: RevisionRecord;
  releasedEssays: EssayMetadata[];
};

export async function ArticleReader({
  essay,
  revision,
  releasedEssays,
}: ArticleReaderProps) {
  const guide = getStudyGuideEntryForEssay(essay, releasedEssays);

  const source = await readFile(
    path.join(process.cwd(), "content", "essays", guide.sourcePath),
    "utf8",
  );
  const headings = articleHeadings(source);

  const Heading = ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const label = typeof children === "string" ? children : String(children);
    return (
      <h2 id={slugifyHeading(label)} {...props}>
        <a className="article-heading-anchor" href={`#${slugifyHeading(label)}`}>
          {children}
        </a>
      </h2>
    );
  };

  const HiddenPublicationNote = () => null;
  const ArticleSystemTrace = () => <SystemTrace headingLevel={3} />;

  const { content } = await compilePublicMdx<EssayMetadata>({
    source,
    components: {
      h2: Heading,
      EvidenceBadge: HiddenPublicationNote,
      SystemTrace: ArticleSystemTrace,
      HarnessProgression,
      FailureChain,
      SurfaceMap,
      HarnessHandoff,
      ContextAssembly,
      CapabilityBinding,
      CustodyBoundary,
      StateLayers,
      ControlStructures,
      MemoryLifecycle,
    },
  });

  return (
    <div className="article-reader">
      <SequenceNavigation essay={essay} releasedEssays={releasedEssays} />
      <article className="article-reader__article">
        <header className="article-reader__header">
          <p className="eyebrow interface-text">
            {guide.sequenceName} · {guide.readerPosition}
          </p>
          <h1>{essay.title}</h1>
          <p className="article-reader__description">{essay.description}</p>
          <p className="article-reader__byline interface-text">
            By {essay.authors.join(", ")} · {essay.readingTimeSource}
          </p>
        </header>
        <div className="article-reader__prose prose">{content}</div>
        <StudyGuideFooter essay={essay} revision={revision} />
        <ArticlePager essay={essay} releasedEssays={releasedEssays} />
      </article>
      <ArticleContents headings={headings} />
    </div>
  );
}
