import type { ArchitectureRecord } from "@/lib/content/schema";

export function NativeArchitectureDiagram({ record }: { record: ArchitectureRecord }) {
  if (record.study?.nativeDiagram !== "deepseek-session-lifecycle") return null;
  return (
    <figure className="native-architecture" role="img" aria-label="DeepSeek Harness native session and plugin lifecycle">
      <div className="native-architecture__lane">
        <span>CLI / web / SDK</span><span>Turn + step loop</span><span>Model + tools</span><strong>Session events</strong><span>Requests / trajectory / UI</span>
      </div>
      <div className="native-architecture__ownership">
        <span>Cordis context</span><span>service dependency appears</span><span>plugin fiber owns effects</span><strong>drain → reverse dispose</strong>
      </div>
      <figcaption>The session lane preserves causal facts; the lifecycle lane owns in-process capabilities and their cleanup. Neither lane grants product acceptance.</figcaption>
    </figure>
  );
}
