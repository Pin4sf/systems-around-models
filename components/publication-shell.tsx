import type { ReactNode } from "react";

export function PublicationShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="/">
          Systems Around Models
        </a>
        <nav aria-label="Publication">
          <a href="/">Fieldbook</a>
          <span aria-disabled="true">Architectures</span>
          <span aria-disabled="true">Sources</span>
          <span aria-disabled="true">Revisions</span>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer>Independent research on systems around models.</footer>
    </>
  );
}
