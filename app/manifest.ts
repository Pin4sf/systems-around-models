import type { MetadataRoute } from "next";
import { publicationDescription, publicationTitle } from "@/lib/publication/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${publicationTitle} — The Agent Systems Fieldbook`,
    short_name: publicationTitle,
    description: publicationDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f0e6",
    theme_color: "#28513d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
