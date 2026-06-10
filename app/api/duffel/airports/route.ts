import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  const apiKey = process.env.DUFFEL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing Duffel API Key in environment." }, { status: 500 });
  }

  try {
    // Duffel Places Suggestion API
    const response = await fetch(`https://api.duffel.com/places/suggestions?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "Duffel-Version": "v2",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Duffel API Error (Airports):", errorData);
      return NextResponse.json({ error: "Failed to fetch from Duffel API", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching airports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
