/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import searchData from "../_data/search.json";

type SearchRequest = {
  query?: string;
  page?: number;
  pageSize?: number;
  filters?: {
    categories?: string[];
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body: SearchRequest = await req.json();
    const query = body.query?.toLowerCase() || "";
    const page = body.page || 1;
    const pageSize = body.pageSize || 3;

    let results = searchData;

    // Apply search filter
    if (query) {
      results = results.filter(
        (doc: any) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query)
      );
    }

    // Apply categories filter
    if (body.filters?.categories?.length) {
      results = results.filter((doc: any) =>
        body.filters!.categories?.includes(doc.category)
      );
    }

    // Apply tags filter
    if (body.filters?.tags?.length) {
      results = results.filter((doc: any) =>
        doc.tags.some((tag: string) => body.filters!.tags!.includes(tag))
      );
    }

    // Apply date filter
    if (body.filters?.dateFrom || body.filters?.dateTo) {
      results = results.filter((doc: any) => {
        const createdAt = new Date(doc.createdAt).getTime();
        const from = body.filters?.dateFrom
          ? new Date(body.filters.dateFrom).getTime()
          : 0;
        const to = body.filters?.dateTo
          ? new Date(body.filters.dateTo).getTime()
          : Infinity;
        return createdAt >= from && createdAt <= to;
      });
    }

    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    const paginatedResults = results.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const response = {
      results: paginatedResults,
      pagination: {
        page,
        pageSize,
        totalResults,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
