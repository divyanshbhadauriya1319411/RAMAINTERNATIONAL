import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ramainternational.in";

  // Base static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/services",
    "/jobs",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic service slugs list
  const services = [
    "permanent-recruitment",
    "temporary-staffing",
    "executive-search",
    "bulk-hiring",
    "international-recruitment",
    "overseas-placement",
    "payroll-management",
    "hr-consultancy",
    "contract-staffing",
    "blue-collar-hiring",
    "white-collar-hiring",
    "skilled-labour-supply",
  ].map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...services];
}
