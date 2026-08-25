export const sourceLicenseStatuses = Object.freeze([
  "MIT",
  "Apache-2.0",
  "AGPL-3.0",
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "all-rights-reserved",
  "unknown",
]);

const sourceIdPattern = /^source-[a-z0-9-]+$/;
const manifestUrlPattern = /^\/manifests\/[a-z0-9-]+\.json$/;

export function isSourceId(value) {
  return typeof value === "string" && sourceIdPattern.test(value);
}

export function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function isCanonicalSourceUrl(value) {
  if (typeof value !== "string") return false;
  if (manifestUrlPattern.test(value)) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function isSourceLicenseStatus(value) {
  return typeof value === "string" && sourceLicenseStatuses.includes(value);
}
