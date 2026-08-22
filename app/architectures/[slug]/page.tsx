import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NormalizedTopology } from "@/components/architectures/normalized-topology";
import { createCorrectionUrl } from "@/components/article/evidence-badge";
import { loadContent } from "@/lib/content/load-content";
import { publicationTitle } from "@/lib/publication/metadata";
import { canonicalUrl } from "@/lib/publication/site-url";
import { listArchitectureStudies, resolveArchitectureStudy } from "@/lib/study-guide/architecture-study-registry";

type ArchitectureDetailProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await loadContent();
  return listArchitectureStudies().map((study) => {
    const architecture = content.architectures.get(study.architectureId);
    if (!architecture || architecture.status !== "public") {
      throw new Error(`Architecture study does not resolve a public record: ${study.architectureId}`);
    }
    return { slug: architecture.slug };
  });
}

export async function generateMetadata({ params }: ArchitectureDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await loadContent();
  const resolved = resolveArchitectureStudy(slug, content.architectures, content.sources);
  if (!resolved) return {};
  const route = `/architectures/${slug}`;
  return {
    title: `${resolved.architecture.name} Architecture Study | ${publicationTitle}`,
    description: resolved.study.deck,
    alternates: { canonical: route },
    openGraph: {
      type: "article",
      title: `${resolved.architecture.name} Architecture Study`,
      description: resolved.study.deck,
      url: canonicalUrl(route),
      publishedTime: resolved.architecture.lastReviewed,
      modifiedTime: resolved.architecture.lastReviewed,
    },
  };
}

export default async function ArchitectureDetailPage({ params }: ArchitectureDetailProps) {
  const { slug } = await params;
  const content = await loadContent();
  const resolved = resolveArchitectureStudy(slug, content.architectures, content.sources);
  if (!resolved) notFound();
  const { architecture, study, sourceRecords } = resolved;
  const route = `/architectures/${slug}`;
  const correctionUrl = createCorrectionUrl({
    route,
    revisionId: `${architecture.id}@${architecture.revision}`,
    sectionAnchor: "system-boundary",
    claimId: architecture.id,
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${architecture.name} Architecture Study`,
    description: study.deck,
    datePublished: architecture.lastReviewed,
    dateModified: architecture.lastReviewed,
    mainEntityOfPage: canonicalUrl(route),
    isAccessibleForFree: true,
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <article className="architecture-study">
      <header className="architecture-study__hero prose">
        <p className="eyebrow interface-text">Architecture study · {architecture.evidenceFidelity.replaceAll("-", " ")}</p>
        <h1>{architecture.name}</h1>
        <p className="architecture-study__deck">{study.deck}</p>
        <p className="architecture-study__pin interface-text">Inspected {architecture.inspectedVersion} · {architecture.evidenceGrade} · {architecture.dossierStatus.replaceAll("-", " ")}</p>
        <p className="architecture-study__boundary"><strong>Evidence boundary.</strong> {study.evidenceBoundary}</p>
        {study.refreshTarget ? <p className="architecture-study__refresh interface-text">{study.refreshTarget}</p> : null}
      </header>

      <section className="architecture-study__section prose" aria-labelledby="system-boundary">
        <p className="eyebrow interface-text">Responsibility map</p>
        <h2 id="system-boundary">System boundary</h2>
        {study.systemBoundary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <section className="architecture-study__section architecture-study__section--topology" aria-labelledby="normalized-topology">
        <div className="prose"><p className="eyebrow interface-text">Common comparison grammar</p><h2 id="normalized-topology">Normalized topology</h2></div>
        <NormalizedTopology record={architecture} />
      </section>

      <section className="architecture-study__section" aria-labelledby="mechanisms">
        <div className="prose"><p className="eyebrow interface-text">Mechanisms worth retaining</p><h2 id="mechanisms">How the system carries responsibility</h2></div>
        <div className="architecture-study__mechanisms">{study.mechanismNotes.map((note, index) => <article key={note.title}><span className="trace-text">{String(index + 1).padStart(2, "0")}</span><h3>{note.title}</h3><p>{note.body}</p></article>)}</div>
      </section>

      <section className="architecture-study__section prose" aria-labelledby="failure-boundary">
        <p className="eyebrow interface-text">Limits, not footnotes</p>
        <h2 id="failure-boundary">Failure boundary</h2>
        <ul>{study.failureBoundary.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="architecture-study__section architecture-study__retrieval prose" aria-labelledby="retrieval-check">
        <p className="eyebrow interface-text">Test your model</p>
        <h2 id="retrieval-check">Retrieval check</h2>
        <p>{study.retrievalCheck}</p>
      </section>

      <footer className="architecture-study__section architecture-study__sources prose">
        <h2>Sources and refresh status</h2>
        <ul>{sourceRecords.map((source) => <li key={source.id}><a href={source.canonicalUrl}>{source.title}</a> · {source.repositoryCommit?.slice(0, 12) ?? "documented source"} · {source.correctionLedgerStatus.replaceAll("-", " ")}</li>)}</ul>
        <p><Link href="/architectures">Return to the architecture comparison</Link> · <a href={correctionUrl}>Suggest a correction</a></p>
      </footer>
    </article>
  </>;
}
