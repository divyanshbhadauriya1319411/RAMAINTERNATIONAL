import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RAMA INTERNATIONAL-INDIA",
    short_name: "RAMA",
    description: "From Interview to Visa: Your Complete Global Recruitment Partner.",
    start_url: "/",
    display: "standalone",
    background_color: "#051B3D",
    theme_color: "#051B3D",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
