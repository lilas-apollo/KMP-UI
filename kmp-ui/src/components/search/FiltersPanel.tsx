/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { fetchTags } from "@/hooks/useSearchTags";

type Option = {
  id: number | string;
  name: string;
};

export default function FiltersPanel({
  filters,
  setFilters,
  refresh,
  categories,
  allTags,
}: any) {
  // Local editable state before applying filters
  const [localFilters, setLocalFilters] = useState({
    categories: filters.categories ?? [],
    tags: filters.tags ?? [],
    dateFrom: filters.dateFrom ?? "",
    dateTo: filters.dateTo ?? "",
  });

  const update = (key: string, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    refresh();
  };

  const clearFilters = () => {
    setLocalFilters({
      categories: [],
      tags: [],
      dateFrom: "",
      dateTo: "",
    });
    setFilters({});
    refresh();
  };

  const quickDate = (days: number) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - days);

    update("dateFrom", past.toISOString().split("T")[0]);
    update("dateTo", now.toISOString().split("T")[0]);
  };

  /** ---------------- TAG SEARCH ---------------- **/
  async function searchTags(input: string) {
    if (!input.length) {
      return allTags;
    }
    const tags = await fetchTags(input);
    return tags.map((t: Option) => ({
      value: t.id,
      label: `${t.name}`,
    }));
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow space-y-6">
      <h2 className="font-semibold text-gray-800 text-lg">Filters</h2>
      <div className="flex xl:flex-col md:flex-row flex-col gap-2">
        {/* CATEGORIES MULTI-SELECT  */}
        <div className="space-y-2 xl:w-full md:w-1/2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Categories
          </label>

          <div className="space-y-1">
            <Select
              options={categories}
              placeholder="Select category"
              isMulti
              // value={localFilters.categories.map((id: any) => ({
              //   value: id,
              //   label: categories.find((x) => x.label === id)?.label || id,
              // }))}
              value={localFilters.categories.map((label: string) => {
                const option = categories.find((c) => c.label === label);
                return { value: option?.value ?? label, label };
              })}
              onChange={(selected) =>
                update(
                  "categories",
                  selected ? selected.map((x: any) => x.label) : []
                )
              }
              classNames={{
                control: () =>
                  "border rounded-md px-1 py-0.5 focus:ring-1 focus:ring-violet-300 outline-none shadow-none",
                placeholder: () => "text-gray-300",
                input: () => "text-gray-700",
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "lab(90.952% -.0000596046 0)",

                  ":hover": { borderColor: "#c4b4ff", borderWidth: "2px" },
                  boxShadow: "none",
                  borderRadius: "8px",
                }),
              }}
            />
          </div>
        </div>

        {/* --------------------- */}
        {/* TAG MULTI-SELECT SEARCH */}
        {/* --------------------- */}
        <div className="space-y-2 xl:w-full md:w-1/2 w-full">
          <label className="text-sm font-medium text-gray-700">Tags</label>

          <AsyncSelect
            isMulti
            cacheOptions
            loadOptions={searchTags}
            defaultOptions={allTags}
            placeholder="Search or select tags"
            // value={localFilters.tags.map((id: any) => ({
            //   value: id,
            //   label: allTags.find((x) => x.label === id)?.label || id,
            // }))}
            value={localFilters.tags.map((label: string) => {
              const option = allTags.find((t) => t.label === label);
              return { value: option?.value ?? label, label };
            })}
            onChange={(selected) =>
              update("tags", selected ? selected.map((x: any) => x.label) : [])
            }
            classNames={{
              control: () =>
                "border rounded-md px-1 py-0.5 focus:ring-1 focus:ring-violet-300 outline-none shadow-none",
              placeholder: () => "text-gray-300",
              input: () => "text-gray-700",
            }}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "lab(90.952% -.0000596046 0)",

                ":hover": { borderColor: "#c4b4ff", borderWidth: "2px" },
                boxShadow: "none",
                borderRadius: "8px",
              }),
            }}
          />
        </div>
      </div>

      {/* --------------------- */}
      {/* DATE RANGE */}
      {/* --------------------- */}
      <div className="space-y-3 ">
        <label className="text-sm font-medium text-gray-700">Date Range</label>

        <div className="flex xl:flex-col md:flex-row flex-col gap-2">
          <input
            type="date"
            className="border rounded-md px-4 py-2 xl:w-full md:w-1/2 w-full focus:ring-1 focus:ring-violet-300 outline-none"
            value={localFilters.dateFrom}
            onChange={(e) => update("dateFrom", e.target.value)}
          />

          <input
            type="date"
            className="border rounded-md px-4 py-2 xl:w-full md:w-1/2 w-full focus:ring-1 focus:ring-violet-300 outline-none"
            value={localFilters.dateTo}
            onChange={(e) => update("dateTo", e.target.value)}
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            className="px-2 py-1 rounded border text-xs hover:bg-gray-100 cursor-pointer"
            onClick={() => quickDate(7)}
          >
            Last 7 days
          </button>

          <button
            className="px-2 py-1 rounded border text-xs hover:bg-gray-100 cursor-pointer"
            onClick={() => quickDate(30)}
          >
            Last 30 days
          </button>

          <button
            className="px-2 py-1 rounded border text-xs hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const now = new Date();
              const first = new Date(now.getFullYear(), 0, 1);
              update("dateFrom", first.toISOString().split("T")[0]);
              update("dateTo", now.toISOString().split("T")[0]);
            }}
          >
            This year
          </button>
        </div>
      </div>

      {/* --------------------- */}
      {/* ACTION BUTTONS */}
      {/* --------------------- */}
      <div className="flex gap-3 pt-3">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 rounded-md bg-violet-600 text-white cursor-pointer md:text-base text-sm"
        >
          Apply
        </button>

        <button
          onClick={clearFilters}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
