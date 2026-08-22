import Link from "next/link";
import type { ReactNode } from "react";

export function PublicationShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="wordmark" href="/">
          Systems Around Models
        </Link>
        <nav aria-label="Publication">
          <Link href="/">Start here</Link>
          <Link href="/fieldbook/harness-engineering-study-guide">Harness</Link>
          <Link href="/fieldbook/memory-engineering-study-guide">Memory</Link>
          <Link href="/architectures">Architectures</Link>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">A practical, independent guide to building systems around models.</footer>
    </>
  );
}
