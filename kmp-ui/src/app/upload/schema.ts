import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "image/png",
  "image/jpeg",
];

export const uploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file")
    .refine(
      (files) => files.every((file) => ALLOWED_TYPES.includes(file.type)),
      "Only PDF, DOCX, XLSX, PNG, JPG, JPEG files are allowed"
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Each file must be smaller than 50MB"
    ),

  title: z
    .string()
    .min(1, "Title is required!")
    .max(200, "Title should be less than 200 letters!"),
  description: z
    .string()
    .max(2000, "Description should be less than 2000 letters!")
    .optional(),
  categoryId: z.string("Category is required!").min(1, "Category is required!"),
  departmentId: z
    .string("Category is required!")
    .min(1, "Department is required!"),
  tags: z.array(z.string("Category is required!")).optional(),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
