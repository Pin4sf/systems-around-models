import type { ArchitectureRecord } from "@/lib/content/schema";

export function ArchitectureComparison({ records }: { records: ArchitectureRecord[] }) {
  return (
    <div className="comparison-table-well" tabIndex={0} aria-label="Scrollable comparison table">
      <table className="architecture-comparison" aria-label="Agent architecture comparison">
        <caption>Read across, not down: the same responsibility questions applied to different systems.</caption>
        <thead>
          <tr>
            <th scope="col">System</th>
            <th scope="col">Primary job</th>
            <th scope="col">Control</th>
            <th scope="col">Durable state</th>
            <th scope="col">Authority</th>
            <th scope="col">Recovery</th>
            <th scope="col">Verification</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <th scope="row">
                <a href={`#system-${record.slug}`} aria-label={`${record.name} profile`}>
                  {record.name}
                </a>
              </th>
              <td>{record.primaryJob}</td>
              <td>{record.controlOwner}</td>
              <td>{record.stateModel}</td>
              <td>{record.authorityBoundary}</td>
              <td>{record.recoveryModel}</td>
              <td>{record.verificationModel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
