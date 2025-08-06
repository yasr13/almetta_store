// src/lib/graphql/fetch.ts
import { print } from "graphql";

export async function executeGraphQL<T>(url: RequestInfo | URL, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Saleor-Domain": "https://store-dglxxmc9.saleor.cloud",
      ...options.headers,
    },
  });

  const result = await res.json();

  if (result.errors) {
    console.error("GraphQL Error:", result.errors);
    throw new Error("Failed to fetch GraphQL data");
  }

  return result as T;
}