import { NextResponse } from "next/server";
import departments from "../_data/departments.json";

export async function GET() {
  return NextResponse.json(departments);
}
