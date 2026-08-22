import type { EssayMetadata, RevisionRecord } from "@/lib/content/schema";

function correctionUrl(essay: EssayMetadata, revision: RevisionRecord) {
  const issueUrl = new URL("https://github.com/Pin4sf/systems-around-models/issues/new");
  issueUrl.searchParams.set("title", `Correction: ${essay.title}`);
  issueUrl.searchParams.set(
    "body",
    [
      `Page: /fieldbook/${essay.slug}`,
      `Edition: ${revision.id}`,
      "Section: article",
      "Scope: article-wide correction",
      "",
      "What should change?",
      "",
      "Public source or counter-example:",
      "",
      "Please do not include credentials, personal data, health data, private traces, or copyrighted documents.",
    ].join("\n"),
  );
  return issueUrl.toString();
}

export function StudyGuideFooter({
  essay,
  revision,
}: {
  essay: EssayMetadata;
  revision: RevisionRecord;
}) {
  return (
    <footer className="study-guide-footer interface-text">
      <p>Last updated {essay.substantivelyRevisedAt}.</p>
      <a href={correctionUrl(essay, revision)}>Suggest a correction</a>
    </footer>
  );
}
