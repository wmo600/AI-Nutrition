export const API =
  "https://e7sgerybl5.execute-api.ap-southeast-1.amazonaws.com";

export async function ping() {
  const r = await fetch(`${API}/ping`);
  return r.json();
}

export async function geocode(q: string) {
  const r = await fetch(`${API}/geocode?q=${encodeURIComponent(q)}`);
  if (!r.ok) throw new Error("geocode failed");
  return r.json();
}
