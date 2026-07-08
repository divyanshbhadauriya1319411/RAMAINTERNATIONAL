import React from "react";

interface SchemaProps {
  type: "Organization" | "LocalBusiness" | "JobPosting";
  data: Record<string, any>;
}

export default function SchemaMarkup({ type, data }: SchemaProps) {
  let schemaData: Record<string, any> = {};

  if (type === "Organization") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RAMA INTERNATIONAL-INDIA",
      "alternateName": "RAMA INTERNATIONAL",
      "url": "https://ramainternational.in",
      "logo": "https://ramainternational.in/logo.png",
      "foundingDate": "2018",
      "founder": {
        "@type": "Person",
        "name": "Deepak Chauhan"
      },
      "tagline": "From Interview to Visa: Your Complete Global Recruitment Partner",
      "sameAs": [
        "https://www.linkedin.com/company/rama-international-india",
        "https://twitter.com/ramainternational"
      ]
    };
  } else if (type === "LocalBusiness") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "RAMA INTERNATIONAL-INDIA",
      "image": "https://ramainternational.in/office-facade.png",
      "telephon": "+91 11 4056 9385",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Dwarka",
        "addressLocality": "New Delhi",
        "addressRegion": "DL",
        "postalCode": "110075",
        "addressCountry": "IN"
      },
      "priceRange": "$$$",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    };
  } else if (type === "JobPosting") {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": data.title,
      "description": data.description,
      "datePosted": data.datePosted || new Date().toISOString(),
      "validThrough": data.validThrough || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      "employmentType": data.employmentType || "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "RAMA INTERNATIONAL-INDIA",
        "sameAs": "https://ramainternational.in"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": data.country
        }
      },
      "baseSalary": data.salary ? {
        "@type": "MonetaryAmount",
        "currency": data.currency || "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": data.salary,
          "unitText": "MONTH"
        }
      } : undefined
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
