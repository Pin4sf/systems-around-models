type SiteEnvironment = {
  NODE_ENV?: string;
  SITE_URL?: string;
};

const localSiteUrl = "http://localhost:3000";

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
  return siteUrl;
}

export function canonicalUrl(pathname: string, environment?: SiteEnvironment): string {
  return new URL(pathname, resolveSiteUrl(environment)).toString();
}
