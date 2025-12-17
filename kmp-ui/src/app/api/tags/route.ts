import { NextResponse } from "next/server";
import tags from "../_data/tags.json";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const search = params.get("search")?.toLowerCase() ?? "";

  if (!search || search == "") return NextResponse.json(tags);

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search));

  return NextResponse.json(filtered);
}
