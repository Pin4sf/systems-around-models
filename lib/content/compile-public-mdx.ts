import { parse } from "@babel/parser";
import { compileMDX, type MDXRemoteProps } from "next-mdx-remote/rsc";

type MdxAstNode = {
  type: string;
  children?: MdxAstNode[];
  position?: {
    start: { line: number; offset?: number };
    end: { offset?: number };
  };
};

function containsEsmDeclaration(value: string): boolean {
  try {
    const program = parse(value, {
      allowUndeclaredExports: true,
      sourceType: "module",
    });
    return program.program.body.some(
      (statement) =>
        statement.type === "ImportDeclaration" || statement.type.startsWith("Export"),
    );
  } catch {
    return false;
  }
}

const rejectMdxEsm = () => (tree: MdxAstNode, file: { value: unknown }) => {
  const source = String(file.value);
  const remaining = [tree];

  while (remaining.length > 0) {
    const node = remaining.pop();
    if (!node) continue;
    const esmNode = node.type === "mdxjsEsm";
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    const parserBlindEsm =
      node.type === "paragraph" &&
      typeof start === "number" &&
      typeof end === "number" &&
      containsEsmDeclaration(source.slice(start, end));
    if (esmNode || parserBlindEsm) {
      const line = node.position?.start.line;
      throw new Error(
        `Public MDX ESM is not allowed${line ? ` at line ${line}` : ""}`,
      );
    }
    if (node.children) remaining.push(...node.children);
  }
};

export function compilePublicMdx<TFrontmatter = Record<string, unknown>>({
  source,
  components,
}: Pick<MDXRemoteProps, "source" | "components">) {
  return compileMDX<TFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [rejectMdxEsm] },
    },
  });
}
