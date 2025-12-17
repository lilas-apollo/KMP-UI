import { NextResponse } from "next/server";
import categories from "../_data/categories.json";

export async function GET() {
  return NextResponse.json(categories);
}
