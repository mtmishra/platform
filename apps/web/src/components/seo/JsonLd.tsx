import React from "react";

export interface JsonLdProps {
  /** One or more Schema.org JSON-LD objects. */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders Schema.org structured data as a <script type="application/ld+json">.
 * Safe to use in Server Components.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
