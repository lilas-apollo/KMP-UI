/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";

async function uploadDocument(formData: FormData) {
  const res = await fetch("/api/documents", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Upload failed");
  }

  return res.json();
}

export const useCreateDocument = () => {
  return useMutation<any, Error, FormData>({
    mutationFn: uploadDocument,
  });
};
