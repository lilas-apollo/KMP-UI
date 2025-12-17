/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { SlidersHorizontal, ArrowBigLeft, Search } from "lucide-react";
import { useSearchDocuments } from "@/hooks/useSearchDocuments";
import Filters from "@/components/search/FiltersPanel";
import { useCategories } from "@/hooks/useCategories";
import { fetchTags } from "@/hooks/useSearchTags";
import SkeletonCard from "@/components/search/SkeletonCard";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [filters, setFilters] = useState<any>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const { data, isLoading, isError } = useSearchDocuments({
    query,
    page,
    pageSize,
    filters,
  });

  const debouncedSearch = debounce((value: string) => {
    setQuery(value);
    setPage(1);
  }, 300);

  const { data: categoryData = [] } = useCategories();

  /** ---------------- MAPPED SELECT OPTIONS ---------------- **/
  const categories = categoryData.map((c: any) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  /** --------- LOAD ALL TAGS ON MOUNT --------- */
  useEffect(() => {
    async function load() {
      setIsClient(true);
      const tags = await fetchTags("");
      setAllTags(
        tags.map((t: any) => ({
          value: t.id,
          label: t.name,
        }))
      );
    }
    load();
  }, []);

  return (
    <div className="max-w-[99%] flex justify-center sm:p-10 p-2 m-auto flex-col md:flex-row gap-6 p-6">
      {isClient && (
        <aside
          className={`hidden xl:flex flex-col w-[340px] transition-all duration-300 
         
          `}
        >
          <Link
            href={"/"}
            className=" md:px-4 px-3 py-2.5 md:py-2.5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-xs flex gap-2 w-fit mb-8"
          >
            <ArrowBigLeft />
            Back
          </Link>
          <Filters
            filters={filters}
            setFilters={setFilters}
            refresh={() => setPage(1)}
            categories={categories}
            allTags={allTags}
          />
        </aside>
      )}
      <main className="flex-1">
        <Link
          href={"/"}
          className="xl:hidden block md:px-4 px-3 py-2.5 md:py-2.5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-xs flex gap-2 w-fit"
        >
          <ArrowBigLeft />
          Back
        </Link>
        {/* Search + Filter Button */}
        <div className="flex items-center justify-between mb-4 md:gap-6 gap-3 xl:mt-20 mt-10 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

            <input
              type="text"
              placeholder="Search documents..."
              value={query}
              className="xl:w-1/2 w-full rounded-md border p-3 pl-10 pr-8 text-sm border-gray-300 focus:ring-1 focus:ring-violet-300 outline-none"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            {query && (
              <button
                className="absolute xl:right-1/2 xl:mr-2 right-2 top-2 text-gray-500 cursor-pointer text-lg"
                onClick={() => debouncedSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {/*  Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="xl:hidden bg-violet-600 text-white md:px-3 px-2.5 md:py-2.5 py-2 rounded-md flex items-center gap-1 cursor-pointer"
          >
            <SlidersHorizontal className="md:w-5 w-4" />
            <span className="md:inline hidden">Filters</span>
          </button>
        </div>

        {/*  Filters */}
        {isClient && (
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out
          ${
            showMobileFilters
              ? "max-h-[2000px] xl:max-h-0 opacity-100 scale-100"
              : "max-h-0 opacity-0 scale-[0.98]"
          }
          `}
          >
            <div className="mb-4">
              <Filters
                filters={filters}
                setFilters={setFilters}
                refresh={() => setPage(1)}
                categories={categories}
                allTags={allTags}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {isError && <p className="text-red-500">Failed to load results</p>}

        {/* No Results */}
        {data?.results?.length === 0 && <p>No documents found</p>}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-12">
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : data?.results?.map((doc: any) => (
                <div
                  key={doc.id}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition"
                >
                  <h4 className="font-semibold text-lg">{doc?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {doc?.description.slice(0, 150)}
                  </p>
                  <span className="text-xs text-gray-500">{doc?.category}</span>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.slice(0, 3).map((t: any) => (
                      <span
                        key={t}
                        className="bg-gray-200 px-2 py-0.5 rounded text-xs"
                      >
                        {t}
                      </span>
                    ))}
                    {doc?.tags?.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{doc?.tags?.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        {data?.pagination?.totalResults > pageSize && (
          <div className="flex items-center justify-center mt-14 w-full">
            <div className="flex items-center gap-2 flex-wrap max-w-full justify-center">
              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={`px-4 py-2 rounded-full border transition-all
          ${
            page === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-violet-600 hover:text-white border-violet-600 cursor-pointer"
          }`}
              >
                Prev
              </button>

              {/* Dynamic Number Pages */}
              {(() => {
                const totalPages = Math.ceil(
                  data?.pagination?.totalResults / pageSize
                );

                // show 5 pages only: current -1, current, +1 and first/last
                let pages: (number | "...")[] = [];

                if (totalPages <= 3) {
                  pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                } else {
                  pages = [1];

                  if (page > 3) pages.push("...");

                  if (page > 2) pages.push(page - 1);
                  if (page !== 1 && page !== totalPages) pages.push(page);
                  if (page < totalPages - 1) pages.push(page + 1);

                  if (page < totalPages - 2) pages.push("...");

                  pages.push(totalPages);
                }

                return pages.map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dots-${i}`}
                      className="text-gray-500 px-2 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all md:inline hidden
                ${
                  page === p
                    ? "bg-violet-600 text-white border-violet-600 shadow-md"
                    : "hover:bg-violet-100 border-gray-300 cursor-pointer"
                }`}
                    >
                      {p}
                    </button>
                  )
                );
              })()}

              {/* Next */}
              <button
                disabled={
                  page === Math.ceil(data?.pagination?.totalResults / pageSize)
                }
                onClick={() => setPage((p) => p + 1)}
                className={`px-4 py-2 rounded-full border transition-all
          ${
            page === Math.ceil(data?.pagination?.totalResults / pageSize)
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-violet-600 hover:text-white border-violet-600 cursor-pointer"
          }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
