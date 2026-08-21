export type ArticleHeading = {
  id: string;
  label: string;
};

function ContentsLinks({ headings }: { headings: ArticleHeading[] }) {
  return (
    <ol>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a href={`#${heading.id}`}>{heading.label}</a>
        </li>
      ))}
    </ol>
  );
}

export function ArticleContents({ headings }: { headings: ArticleHeading[] }) {
  return (
    <aside className="article-contents interface-text">
      <nav className="article-contents__desktop" aria-label="On this page">
        <p className="eyebrow">Contents</p>
        <ContentsLinks headings={headings} />
      </nav>
      <details className="article-contents__mobile">
        <summary role="button">Open contents</summary>
        <div aria-label="On this page links">
          <ContentsLinks headings={headings} />
        </div>
      </details>
    </aside>
  );
}
