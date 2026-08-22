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
import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";
import { compilePublicMdx } from "@/lib/content/compile-public-mdx";
import { slugifyHeading } from "@/lib/content/slugify";
import { harnessChapterCount } from "@/lib/study-guide/harness-course";

const essayPaths: Record<string, string> = {
  "harness-engineering-study-guide": "harness/harness-engineering-study-guide.mdx",
  "the-model-is-not-the-agent": "harness/the-model-is-not-the-agent.mdx",
};

function readerPosition(essay: EssayMetadata) {
  if (essay.slug === "harness-engineering-study-guide") return "Complete short course";
  return `Chapter 1 of ${harnessChapterCount}`;
}

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
  const relativePath = essayPaths[essay.slug];
  if (!relativePath) throw new Error(`No trusted public essay path for ${essay.slug}`);

  const source = await readFile(
    path.join(process.cwd(), "content", "essays", relativePath),
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
    },
  });

  return (
    <div className="article-reader">
      <SequenceNavigation essay={essay} />
      <article className="article-reader__article">
        <header className="article-reader__header">
          <p className="eyebrow interface-text">
            {essay.sequence} · {readerPosition(essay)}
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
