import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.DUFFEL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Duffel API Key in environment." }, { status: 500 });
    }

    const response = await fetch("https://api.duffel.com/air/offer_requests", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
        "Duffel-Version": "v2",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Duffel API Error (Offers):", errorData);
      return NextResponse.json({ error: "Failed to fetch offers from Duffel API", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating offer request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
