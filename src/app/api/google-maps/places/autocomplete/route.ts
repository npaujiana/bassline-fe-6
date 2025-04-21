import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input") || "";

  if (!input) {
    return new Response(JSON.stringify({ error: "Missing input parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Construct URL to external API with only input parameter
  const externalUrl = new URL("https://ameera-org.my.id/api/google-maps/places/autocomplete/");
  externalUrl.searchParams.append("input", input);

  try {
    const response = await fetch(externalUrl.toString());
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch autocomplete data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
