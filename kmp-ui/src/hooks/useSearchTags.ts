export async function fetchTags(input: string) {
  //   if (!input) return [];
  const res = await fetch(`/api/tags${input ? `?search=${input}` : ""}`);
  return res.json();
}
