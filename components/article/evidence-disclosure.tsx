"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";

const subscribeToHydration = () => () => undefined;

type EvidenceDisclosureProps = {
  buttonLabel: string;
  detailsId: string;
  children: ReactNode;
};

export function EvidenceDisclosure({
  buttonLabel,
  detailsId,
  children,
}: EvidenceDisclosureProps) {
  const [open, setOpen] = useState(false);
  const enhanced = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return (
    <div className="evidence-disclosure">
      <button
        type="button"
        className="evidence-disclosure__button trace-text"
        aria-controls={detailsId}
        aria-expanded={open}
        hidden={!enhanced}
        onClick={() => setOpen((current) => !current)}
      >
        {buttonLabel}
        <span aria-hidden="true"> {open ? "−" : "+"}</span>
      </button>
      <div
        className="evidence-disclosure__details"
        id={detailsId}
        hidden={enhanced && !open}
      >
        {children}
      </div>
    </div>
  );
}
