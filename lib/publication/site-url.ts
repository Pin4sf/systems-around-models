type SiteEnvironment = {
  NODE_ENV?: string;
  SITE_URL?: string;
};

const localSiteUrl = "http://localhost:3000";

function parseIpv6Groups(address: string): number[] | undefined {
  const halves = address.split("::");
  if (halves.length > 2) return undefined;
  const parseHalf = (half: string) => half === ""
    ? []
    : half.split(":").map((group) => Number.parseInt(group, 16));
  const left = parseHalf(halves[0]);
  const right = parseHalf(halves[1] ?? "");
  if (
    [...left, ...right].some((group) => !Number.isInteger(group) || group < 0 || group > 0xffff)
  ) {
    return undefined;
  }
  if (halves.length === 1) return left.length === 8 ? left : undefined;
  const omittedGroups = 8 - left.length - right.length;
  if (omittedGroups < 1) return undefined;
  return [...left, ...Array<number>(omittedGroups).fill(0), ...right];
}

function isLocalOrLoopbackHostname(rawHostname: string): boolean {
  const hostname = rawHostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");
  if (hostname === "localhost" || hostname.endsWith(".localhost")) return true;

  const ipv4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(hostname);
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number);
    return octets[0] === 127 || octets.every((octet) => octet === 0);
  }

  const groups = parseIpv6Groups(hostname);
  if (!groups) return false;
  if (groups.every((group) => group === 0)) return true;
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) return true;

  const mappedIpv4Prefix = groups.slice(0, 5).every((group) => group === 0)
    && (groups[5] === 0 || groups[5] === 0xffff);
  const firstIpv4Octet = groups[6] >> 8;
  return mappedIpv4Prefix && (firstIpv4Octet === 127 || groups.slice(6).every((group) => group === 0));
}

export function resolveSiteUrl(environment: SiteEnvironment = process.env): URL {
  const configured = environment.SITE_URL?.trim();
  if (!configured) {
    if (environment.NODE_ENV === "production") {
      throw new Error("SITE_URL is required for production metadata");
    }
    return new URL(localSiteUrl);
  }

  let siteUrl: URL;
  try {
    siteUrl = new URL(configured);
  } catch {
    throw new Error("SITE_URL must be an absolute http(s) origin");
  }
  if (
    !["http:", "https:"].includes(siteUrl.protocol) ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.pathname !== "/"
  ) {
    throw new Error("SITE_URL must be an absolute http(s) origin");
  }
  if (
    environment.NODE_ENV === "production"
    && isLocalOrLoopbackHostname(siteUrl.hostname)
  ) {
    throw new Error("SITE_URL must not use localhost or a loopback origin in production");
  }
  return siteUrl;
}

export function canonicalUrl(pathname: string, environment?: SiteEnvironment): string {
  return new URL(pathname, resolveSiteUrl(environment)).toString();
}
