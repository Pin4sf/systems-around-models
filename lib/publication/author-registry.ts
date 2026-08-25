export type AuthorIdentity = Readonly<{
  id: string;
  name: string;
  url: string;
  role: string;
  sameAs: readonly string[];
}>;

const shivanshFulper = Object.freeze({
  id: "author-shivansh-fulper",
  name: "Shivansh Fulper",
  url: "https://shivansh-portfolio-one.vercel.app",
  role: "Founder and AI systems researcher",
  sameAs: Object.freeze([
    "https://shivansh-portfolio-one.vercel.app",
    "https://github.com/Pin4sf",
    "https://www.linkedin.com/in/shivansh-fulper/",
  ]),
});

const authorRegistry = new Map<string, AuthorIdentity>([
  ["author-shivansh-fulper", shivanshFulper],
  // Preserve already-published essay bytes while resolving the legacy byline token.
  ["Systems Around Models", shivanshFulper],
]);

export const publicationEditor = authorRegistry.get("author-shivansh-fulper")!;

export function resolveAuthorIdentities(authorIds: readonly string[]): AuthorIdentity[] {
  return authorIds.map((authorId) => {
    const author = authorRegistry.get(authorId);
    if (!author) throw new Error(`Unknown author identifier: ${authorId}`);
    return author;
  });
}
