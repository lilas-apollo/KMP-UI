"use client";

import UploadWizard from "@/components/upload/UploadWizard";

export default function UploadPage() {
  return (
    <div className="xl:max-w-[80%] md:max-w-[90%] max-w-[99%] flex justify-center sm:p-10 p-4 m-auto">
      <div className="w-full sm:pt-2 pt-6">
        <UploadWizard />
      </div>
    </div>
  );
}
