"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import clsx from "clsx";
import { formatFileSize } from "@/lib/formatFileSize";
import Link from "next/link";

export default function StepFiles({ onNext }: { onNext: () => void }) {
  const {
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const files: File[] = watch("files") || [];
  const [isDragging, setIsDragging] = useState(false);

  /* ---------- ADD FILES ---------- */
  function addFiles(newFiles: File[]) {
    setValue("files", [...files, ...newFiles], {
      shouldValidate: true,
    });
  }

  /* ---------- REMOVE FILE ---------- */
  function removeFile(index: number) {
    const updated = [...files];
    updated.splice(index, 1);
    setValue("files", updated, { shouldValidate: true });
  }

  /* ---------- NEXT STEP ---------- */
  async function handleNext() {
    const valid = await trigger("files");
    if (valid) onNext();
  }

  /* ---------- INPUT HANDLER ---------- */
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  /* ---------- DROP HANDLERS ---------- */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow space-y-6 border border-gray-200">
      {/* MOBILE HEADER */}
      <h2 className="text-xl font-semibold text-violet-700 border-b pb-2 md:hidden block">
        File Selection
      </h2>
      {/* Dropzone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition",
          isDragging ? "border-violet-600 bg-violet-50" : "border-gray-300"
        )}
      >
        <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
        <p className="text-sm text-gray-600 text-center">
          Drag & drop files here or{" "}
          <span className="text-violet-600">browse</span>
        </p>

        <input type="file" multiple hidden onChange={handleInputChange} />
      </label>

      {/* Error Message */}
      {errors.files && (
        <p className="text-sm text-red-600">{errors.files.message as string}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2"
            >
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between">
        <Link
          href={"/"}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer md:text-base text-sm"
        >
          Back to Home
        </Link>
        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className={clsx(
            "px-6 py-2 rounded-md text-white transition md:text-base text-sm",
            errors.files
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700 cursor-pointer"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
