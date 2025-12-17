/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

type SearchParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  filters?: any;
};

export function useSearchDocuments(params: SearchParams) {
  return useQuery({
    queryKey: ["searchDocuments", params],
    queryFn: async () => {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    keepPreviousData: true, // helpful for pagination
  });
}
