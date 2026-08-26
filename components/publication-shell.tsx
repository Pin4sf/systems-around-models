import Link from "next/link";
import type { ReactNode } from "react";
import { publicationEditor } from "@/lib/publication/author-registry";

export function PublicationShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="wordmark" href="/">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Systems Around Models</span>
        </Link>
        <nav aria-label="Publication">
          <Link href="/">Start here</Link>
          <Link href="/fieldbook/harness-engineering-study-guide">Harness</Link>
          <Link href="/fieldbook/memory-engineering-study-guide">Memory</Link>
          <Link href="/architectures">Architectures</Link>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <span>A practical, independent guide to building systems around models.</span>
        <a href={publicationEditor.url} rel="author me">By {publicationEditor.name} · Portfolio</a>
      </footer>
    </>
  );
}
