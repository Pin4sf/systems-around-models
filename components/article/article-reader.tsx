import { readFile } from "node:fs/promises";
import path from "node:path";
import type { HTMLAttributes } from "react";
import { ArticleContents, type ArticleHeading } from "@/components/article/article-contents";
import { EvidenceBadge } from "@/components/article/evidence-badge";
import { RevisionNotice } from "@/components/article/revision-notice";
import {
  ArticlePager,
  SequenceNavigation,
} from "@/components/article/sequence-navigation";
import { SystemTrace } from "@/components/diagrams/system-trace";
import type {
  ClaimRecord,
  EssayMetadata,
  RevisionRecord,
  SourceRecord,
} from "@/lib/content/schema";
import { compilePublicMdx } from "@/lib/content/compile-public-mdx";
import { slugifyHeading } from "@/lib/content/slugify";

const essayPaths: Record<string, string> = {
  "the-model-is-not-the-agent": "harness/the-model-is-not-the-agent.mdx",
};

function articleHeadings(source: string): ArticleHeading[] {
  return [...source.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => ({
    label: match[1],
    id: slugifyHeading(match[1]),
  }));
}

type ArticleReaderProps = {
  essay: EssayMetadata;
  revision: RevisionRecord;
  claims: Map<string, ClaimRecord>;
  sources: Map<string, SourceRecord>;
  releasedEssays: EssayMetadata[];
};

type MdxEvidenceBadgeProps = {
  claimId: string;
  sectionAnchor?: string;
  challengeLabel?: string;
};

export async function ArticleReader({
  essay,
  revision,
  claims,
  sources,
  releasedEssays,
}: ArticleReaderProps) {
  const relativePath = essayPaths[essay.slug];
  if (!relativePath) throw new Error(`No trusted public essay path for ${essay.slug}`);

  const source = await readFile(
    path.join(process.cwd(), "content", "essays", relativePath),
    "utf8",
  );
  const headings = articleHeadings(source);
  const route = `/fieldbook/${essay.slug}`;

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

  const BoundEvidenceBadge = (props: MdxEvidenceBadgeProps) => (
    <EvidenceBadge
      {...props}
      claims={claims}
      sources={sources}
      route={route}
      revisionId={revision.id}
    />
  );
  const ArticleSystemTrace = () => <SystemTrace headingLevel={3} />;

  const { content } = await compilePublicMdx<EssayMetadata>({
    source,
    components: {
      h2: Heading,
      EvidenceBadge: BoundEvidenceBadge,
      SystemTrace: ArticleSystemTrace,
    },
  });

  return (
    <div className="article-reader">
      <SequenceNavigation />
      <article className="article-reader__article">
        <header className="article-reader__header">
          <p className="eyebrow interface-text">
            {essay.sequence} · Chapter {essay.sequencePosition}
          </p>
          <h1>{essay.title}</h1>
          <p className="article-reader__description">{essay.description}</p>
          <p className="article-reader__byline interface-text">
            By {essay.authors.join(", ")} · {essay.readingTimeSource}
          </p>
          <RevisionNotice essay={essay} revision={revision} placement="beginning" />
        </header>
        <div className="article-reader__prose prose">{content}</div>
        <RevisionNotice essay={essay} revision={revision} placement="end" />
        <ArticlePager essay={essay} releasedEssays={releasedEssays} />
      </article>
      <ArticleContents headings={headings} />
    </div>
  );
}
