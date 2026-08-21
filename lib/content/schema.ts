import { z } from "zod";

export const EvidenceLabel = z.enum([
  "observed",
  "author-reported",
  "inferred",
  "proposed",
  "unproved",
]);

export const EvidenceGrade = z.enum(["IP", "FD", "FL", "W"]);

const Identifier = (prefix: string) => z.string().regex(new RegExp(`^${prefix}-[a-z0-9-]+$`));
const DateString = z.iso.date();

export const ClaimSchema = z.object({
  id: Identifier("claim"),
  statement: z.string().min(20),
  label: EvidenceLabel,
  scope: z.string().min(2),
  sourceIds: z.array(Identifier("source")).min(1),
  falsifiers: z.array(z.string().min(10)).min(1),
  lastReviewed: DateString,
  revision: z.number().int().positive(),
});

const SourceMechanismSchema = z.object({
  description: z.string().min(10),
  evidenceGrade: EvidenceGrade,
  basis: z.string().min(10),
});

export const SourceSchema = z.object({
  id: Identifier("source"),
  title: z.string().min(3),
  author: z.string().min(2),
  canonicalUrl: z.url(),
  publishedAt: DateString,
  retrievedAt: DateString,
  repositoryCommit: z.string().regex(/^[a-f0-9]{7,40}$/).optional(),
  inspectedPaths: z.array(z.string().min(1)),
  sourceType: z.enum(["first-party-essay", "publication-synthesis"]),
  licenseStatus: z.enum(["MIT", "CC-BY-4.0", "all-rights-reserved", "unknown"]),
  evidenceGrade: EvidenceGrade,
  observedMechanisms: z.array(SourceMechanismSchema),
  authorReportedClaims: z.array(z.string().min(10)),
  unknowns: z.array(z.string().min(10)),
  falsifiers: z.array(z.string().min(10)),
  lastValidated: DateString,
  correctionLedgerStatus: z.enum(["not-reviewed", "reviewed", "needs-update"]),
});

export const RevisionSchema = z.object({
  id: Identifier("revision"),
  targetSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  revision: z.number().int().positive(),
  publishedAt: DateString,
  substantivelyRevisedAt: DateString,
  summary: z.string().min(20),
  affectedClaimIds: z.array(Identifier("claim")),
  correctionDisposition: z.enum(["publication", "accepted", "qualified", "rejected", "unresolved"]),
});

export const EssayMetadataSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  description: z.string().min(20),
  sequence: z.string().min(2),
  sequencePosition: z.number().int().positive(),
  authors: z.array(z.string().min(2)).min(1),
  publishedAt: DateString,
  substantivelyRevisedAt: DateString,
  readingTimeSource: z.string().min(2),
  status: z.enum(["draft", "public"]),
  sourceManifestIds: z.array(Identifier("source")).min(1),
  revisionId: Identifier("revision"),
  previousEssaySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  nextEssaySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

export type ClaimRecord = z.infer<typeof ClaimSchema>;
export type SourceRecord = z.infer<typeof SourceSchema>;
export type RevisionRecord = z.infer<typeof RevisionSchema>;
export type EssayMetadata = z.infer<typeof EssayMetadataSchema>;
