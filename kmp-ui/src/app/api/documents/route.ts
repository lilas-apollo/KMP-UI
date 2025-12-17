/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // ----- Extract fields -----
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const department = formData.get("department") as string;
    const tagValues = formData.getAll("tags") as string[];
    const files = formData.getAll("files") as File[];

    // ----- Metadata Validation -----
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!department) {
      return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "At least one file required" },
        { status: 400 }
      );
    }

    // ----- File Validation -----
    const ALLOWED_TYPES = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg"
    ];

    for (const file of files) {
      // 50 MB = 50 * 1024 * 1024
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: `File '${file.name}' exceeds max file size (50MB)`
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error: `File '${file.name}' has invalid type: ${file.type}`
          },
          { status: 400 }
        );
      }
    }

    // ----- Normally store database document here -----
    // For now, mock successful response:
    return NextResponse.json(
      {
        id: `doc-${Date.now()}`,
        title,
        message: "Document uploaded successfully",
        receivedFiles: files.length,
        category,
        department,
        tags: tagValues,
      },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
