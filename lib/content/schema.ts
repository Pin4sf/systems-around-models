import { z } from "zod";
import { isCanonicalSourceUrl, isSourceLicenseStatus } from "./publication-values.mjs";

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
const CanonicalSourceUrl = z.string().refine(isCanonicalSourceUrl, "invalid canonical source URL");
const SourceLicenseStatus = z.string().refine(isSourceLicenseStatus, "invalid source license status");

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
  canonicalUrl: CanonicalSourceUrl,
  publishedAt: DateString,
  retrievedAt: DateString,
  repositoryCommit: z.string().regex(/^[a-f0-9]{7,40}$/).optional(),
  inspectedPaths: z.array(z.string().min(1)),
  sourceType: z.enum([
    "first-party-essay",
    "first-party-article",
    "first-party-course",
    "first-party-repository",
    "publication-synthesis",
  ]),
  basis: z.string().min(20),
  licenseStatus: SourceLicenseStatus,
  evidenceGrade: EvidenceGrade,
  observedMechanisms: z.array(SourceMechanismSchema),
  authorReportedClaims: z.array(z.string().min(10)),
  unknowns: z.array(z.string().min(10)),
  falsifiers: z.array(z.string().min(10)),
  lastValidated: DateString,
  correctionLedgerStatus: z.enum(["not-reviewed", "reviewed", "needs-update"]),
});

const RevisionSourceSnapshotSchema = z.object({
  id: Identifier("source"),
  title: z.string().min(3),
  canonicalUrl: CanonicalSourceUrl,
  lastValidated: DateString,
  licenseStatus: SourceLicenseStatus,
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
  contentHash: z.string().regex(/^sha256-[a-f0-9]{64}$/).optional(),
  sourceSnapshots: z.array(RevisionSourceSnapshotSchema).min(1).optional(),
}).superRefine((record, context) => {
  if (Boolean(record.contentHash) !== Boolean(record.sourceSnapshots)) {
    context.addIssue({
      code: "custom",
      path: ["contentHash"],
      message: "historical revision content and source snapshots must be supplied together",
    });
  }
  const ids = record.sourceSnapshots?.map((source) => source.id) ?? [];
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: "custom", path: ["sourceSnapshots"], message: "snapshot source identifiers must be unique" });
  }
});

export const EssayMetadataSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  description: z.string().min(20),
  sequence: z.string().min(2),
  sequencePosition: z.number().int().positive(),
  revision: z.number().int().positive(),
  authors: z.array(z.union([Identifier("author"), z.literal("Systems Around Models")])).min(1),
  publishedAt: DateString,
  substantivelyRevisedAt: DateString,
  readingTimeSource: z.string().min(2),
  status: z.enum(["draft", "public"]),
  sourceManifestIds: z.array(Identifier("source")).min(1),
  revisionId: Identifier("revision"),
  previousEssaySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  nextEssaySlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
});

export const ArchitectureProductClass = z.enum([
  "frontier-coding-harness",
  "general-agent-runtime",
  "memory-framework",
]);

export const CoordinationShape = z.enum([
  "iterative-loop",
  "workflow-graph",
  "durable-runtime",
  "memory-service",
]);

export const TopologyStage = z.enum([
  "admit",
  "assemble",
  "bind",
  "run",
  "recover",
  "verify-close",
]);

const topologyStages = TopologyStage.options;

const TopologyStepSchema = z.object({
  stage: TopologyStage,
  label: z.string().min(2),
  ownership: z.enum(["owned", "delegated", "external", "not-established"]),
  description: z.string().min(10),
});

const LifecycleStepSchema = z.object({
  order: z.number().int().positive(),
  label: z.string().min(2),
  owner: z.string().min(2),
  outcome: z.string().min(10),
});

const ArchitectureStudySchema = z.object({
  deck: z.string().min(20),
  evidenceBoundary: z.string().min(20),
  systemBoundary: z.array(z.string().min(20)).min(2),
  mechanismNotes: z.array(z.object({ title: z.string().min(3), body: z.string().min(20) })).min(2),
  failureBoundary: z.array(z.string().min(20)).min(2),
  retrievalCheck: z.string().min(20),
  refreshTarget: z.string().min(20).optional(),
  nativeDiagram: z.enum(["deepseek-session-lifecycle"]).optional(),
  adoptAdaptReject: z.object({
    adopt: z.string().min(20),
    adapt: z.string().min(20),
    reject: z.string().min(20),
  }),
});

export const ArchitectureSchema = z.object({
  id: Identifier("architecture"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(2),
  recordKind: z.enum(["system", "synthetic-baseline", "bounded-case-study"]),
  productClass: ArchitectureProductClass,
  status: z.enum(["draft", "public"]),
  summary: z.string().min(20),
  primaryJob: z.string().min(10),
  teachingQuestion: z.string().min(10),
  coordinationShape: CoordinationShape,
  controlOwner: z.string().min(10),
  contextModel: z.string().min(10),
  stateModel: z.string().min(10),
  authorityBoundary: z.string().min(10),
  recoveryModel: z.string().min(10),
  verificationModel: z.string().min(10),
  transferableLesson: z.string().min(20),
  deliberateOmissions: z.array(z.string().min(10)).min(1),
  topologySteps: z.array(TopologyStepSchema).length(topologyStages.length),
  lifecycleTrace: z.array(LifecycleStepSchema).min(3),
  evidenceGrade: EvidenceGrade.optional(),
  evidenceFidelity: z.enum(["implementation-pinned", "first-party-documented", "working-profile"]),
  dossierStatus: z.enum(["ready", "refresh-needed", "deep-dive-needed"]),
  sourceIds: z.array(Identifier("source")).min(1),
  inspectedVersion: z.string().min(7),
  unknowns: z.array(z.string().min(10)).min(1),
  lastReviewed: DateString,
  revision: z.number().int().positive(),
  study: ArchitectureStudySchema.optional(),
}).superRefine((record, context) => {
  const seenStages = new Set(record.topologySteps.map((step) => step.stage));
  if (seenStages.size !== topologyStages.length) {
    context.addIssue({ code: "custom", path: ["topologySteps"], message: "topology must include every stage exactly once" });
  }
  const orders = record.lifecycleTrace.map((step) => step.order);
  if (new Set(orders).size !== orders.length) {
    context.addIssue({ code: "custom", path: ["lifecycleTrace"], message: "lifecycle trace orders must be unique" });
  }
  if (record.recordKind === "synthetic-baseline" && record.evidenceGrade !== undefined) {
    context.addIssue({ code: "custom", path: ["evidenceGrade"], message: "synthetic baselines do not receive evidence grades" });
  }
  if (record.recordKind !== "synthetic-baseline" && record.evidenceGrade === undefined) {
    context.addIssue({ code: "custom", path: ["evidenceGrade"], message: "named systems require an evidence grade" });
  }
  if (record.status === "public" && record.evidenceGrade && !["IP", "FD"].includes(record.evidenceGrade)) {
    context.addIssue({ code: "custom", path: ["evidenceGrade"], message: "public systems require IP or FD evidence" });
  }
});

export const LessonSchema = z.object({
  id: Identifier("lesson"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(3),
  status: z.enum(["draft", "public"]),
  problem: z.string().min(20),
  mechanism: z.string().min(20),
  failureBoundary: z.string().min(20),
  transferableLesson: z.string().min(20),
  architectureIds: z.array(Identifier("architecture")).min(1),
  sourceIds: z.array(Identifier("source")).min(1),
  lastReviewed: DateString,
  revision: z.number().int().positive(),
});

export type ClaimRecord = z.infer<typeof ClaimSchema>;
export type SourceRecord = z.infer<typeof SourceSchema>;
export type RevisionRecord = z.infer<typeof RevisionSchema>;
export type EssayMetadata = z.infer<typeof EssayMetadataSchema>;
export type ArchitectureRecord = z.infer<typeof ArchitectureSchema>;
export type LessonRecord = z.infer<typeof LessonSchema>;
