export const memoryClaimCoverage = [
  {
    claimId: "claim-memory-function-before-database",
    heading: "2. Choose the memory function before the database",
    sourceIds: [
      "source-memory-memgpt",
      "source-memory-anthropic-context-engineering",
    ],
  },
  {
    claimId: "claim-memory-capture-not-belief",
    heading: "4. Capture is not belief",
    sourceIds: [
      "source-memory-memgpt",
      "source-memory-owasp-memory-attack-surface",
    ],
  },
  {
    claimId: "claim-memory-decision-scoped-retrieval",
    heading: "5. Retrieve for a decision, not merely for similarity",
    sourceIds: [
      "source-memory-anthropic-context-engineering",
      "source-memory-longmemeval",
    ],
  },
] as const;
