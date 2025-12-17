/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormContext } from "react-hook-form";
import { useCreateDocument } from "@/hooks/useCreateDocument";
import { toast } from "@/components/ui/toast";

export default function StepReview({
  onBack,
  allTags,
  categories,
  departments,
}: {
  onBack: () => void;
  allTags: Array<any>;
  categories: Array<any>;
  departments: Array<any>;
}) {
  const { getValues } = useFormContext();
  const data = getValues();
  const { mutate, isPending } = useCreateDocument();

  // Extract values
  const { title, description, categoryId, tags, departmentId, files } = data;

  function getLabelById(list: Array<any>, id: any) {
    return list.find((item) => item.value === id)?.label || "-";
  }

  function getLabelsByIds(list: Array<any>, ids: any[]) {
    return (
      ids
        ?.map((id) => list.find((item) => item.value === id)?.label || id)
        .join(", ") || "-"
    );
  }

  async function onSubmit() {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", categoryId);
    formData.append("department", departmentId);

    tags?.forEach((tag: string) => formData.append("tags", tag));

    files?.forEach((file: File) => formData.append("files", file));

    mutate(formData, {
      onSuccess: (res) => {
        toast.success(res?.message || "Document uploaded successfully!");
      },
      onError: (err: Error) => {
        toast.error("Upload failed: " + err.message);
      },
    });
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6 border border-gray-200">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 md:block hidden">
        Review & Submit
      </h2>
      <h2 className="text-xl font-semibold text-violet-700 border-b pb-2 md:hidden block">
        Review & Submit
      </h2>
      {/* File Summary */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Files to Upload</h3>

        {files?.length ? (
          <ul className="space-y-1 text-gray-700">
            {files.map((file: File, index: number) => (
              <li key={index} className="flex justify-between">
                <span>{file.name}</span>
                <span className="text-gray-500 text-sm">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No files selected</p>
        )}
      </div>

      {/* Metadata Summary */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
        <h3 className="font-medium text-gray-700 mb-2">Metadata</h3>
        <Row label="Title" value={title} />
        <Row label="Description" value={description} />
        <Row label="Category" value={getLabelById(categories, categoryId)} />
        <Row
          label="Department"
          value={getLabelById(departments, departmentId)}
        />
        <Row label="Tags" value={getLabelsByIds(allTags, tags)} />{" "}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-sm"
        >
          Back 
        </button>

        <button
          onClick={onSubmit}
          disabled={isPending}
          className="px-6 py-2 rounded-lg bg-violet-600 text-white shadow hover:bg-primary-700 disabled:opacity-50 cursor-pointer md:text-base text-sm"
        >
          {isPending ? "Uploading..." : "Submit Document"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex text-sm">
      <span className="font-medium w-32 text-gray-600">{label}:</span>
      <span className="text-gray-800">{value || "-"}</span>
    </div>
  );
}
