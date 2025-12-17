/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";
import { fetchTags } from "@/hooks/useSearchTags";

const STEP_FIELDS = ["title", "categoryId", "departmentId", "tags"] as const;

type Option = {
  id: number | string;
  name: string;
};

export default function StepMetadata({
  onNext,
  onBack,
  allTags,
  categories,
  departments,
  catLoading,
  catError,
  depLoading,
  depError,
}: {
  onNext: () => void;
  onBack: () => void;
  allTags: Array<any>;
  categories: Array<any>;
  departments: Array<any>;
  catLoading?: boolean;
  catError?: boolean;
  depLoading?: boolean;
  depError?: boolean;
}) {
  const {
    register,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const titleLength = watch("title")?.length || 0;

  /** ---------------- NEXT BUTTON HANDLER ---------------- **/
  async function handleNext() {
    const valid = await trigger(STEP_FIELDS);
    if (valid) onNext();
  }

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

  /** ---------------- LOADING/ERROR UI ---------------- **/
  if (catLoading || depLoading)
    return <p className="text-sm text-gray-500">Loading metadata...</p>;

  if (catError || depError)
    return (
      <p className="text-sm text-red-500">
        Failed to load metadata — try refreshing.
      </p>
    );

  return (
    <div className="p-8 bg-white rounded-xl shadow space-y-6 border border-gray-200">
      {/* MOBILE HEADER */}
      <h2 className="text-xl font-semibold text-violet-700 border-b pb-2 md:hidden block">
        Metadata Entry
      </h2>
      {/* TITLE + TAGS */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* TITLE */}
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>

          <input
            {...register("title")}
            placeholder="Enter document title"
            className={clsx(
              "w-full rounded-md border px-3 py-2 text-sm",
              errors.title
                ? "border-red-500 focus:ring-red-200"
                : "focus:ring-1 focus:ring-violet-300 outline-none"
            )}
          />

          <div className="flex justify-between text-xs">
            {errors.title ? (
              <p className="text-red-500">{errors.title.message as string}</p>
            ) : (
              <p className="text-gray-500">{titleLength}/200</p>
            )}
          </div>
        </div>

        {/* TAGS */}
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-sm font-medium text-gray-700">Tags</label>

          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, value } }) => (
              <AsyncSelect
                isMulti
                cacheOptions
                loadOptions={searchTags}
                defaultOptions={allTags}
                onChange={(selected) => onChange(selected.map((x) => x.value))}
                // value={value?.map((id: any) => ({ value: id, label: id }))}
                value={value?.map((id: any) => ({
                  value: id,
                  label: allTags.find((x) => x.value === id)?.label || id,
                }))}
                placeholder="Search or select tags"
                classNames={{
                  control: () =>
                    "border rounded-md px-3  focus:ring-1 focus:ring-violet-300 outline-none shadow-none",
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
            )}
          />

          {errors.tags && (
            <p className="text-xs text-red-500">
              {errors.tags.message as string}
            </p>
          )}
        </div>
      </div>

      {/* CATEGORY + DEPARTMENT */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* CATEGORY */}
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <Select
                options={categories}
                placeholder="Select category"
                value={categories.find(
                  (x: any) => x.value.toString() == String(value)
                )}
                onChange={(v) => onChange(v?.value ?? null)}
                classNames={{
                  control: () =>
                    "border rounded-md px-3 focus:ring-1 focus:ring-violet-300 outline-none shadow-none",
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
            )}
          />

          {errors.categoryId && (
            <p className="text-xs text-red-500">
              {errors.categoryId.message as string}
            </p>
          )}
        </div>

        {/* DEPARTMENT */}
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>

          <Controller
            control={control}
            name="departmentId"
            render={({ field: { onChange, value } }) => (
              <Select
                options={departments}
                placeholder="Select department"
                value={
                  departments.find(
                    (x) => x.value.toString() == String(value)
                  ) ?? null
                }
                onChange={(v) => onChange(v?.value ?? null)}
                classNames={{
                  control: () =>
                    "border rounded-md px-3 focus:ring-1 focus:ring-violet-300 outline-none shadow-none",
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
            )}
          />

          {errors.departmentId && (
            <p className="text-xs text-red-500">
              {errors.departmentId?.message as string}
            </p>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Description</label>

        <textarea
          {...register("description")}
          rows={4}
          placeholder="Optional description"
          className="w-full border rounded-md px-3 py-2 text-sm border-gray-300 focus:ring-1 focus:ring-violet-300 outline-none"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-sm"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 rounded-md bg-violet-600 text-white cursor-pointer md:text-base text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
