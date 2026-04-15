import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: "BACKEND_URL is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const uploaded = formData.get("file");

  if (!(uploaded instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }

  try {
    const body = new FormData();
    body.append("file", uploaded, uploaded.name);

    const response = await fetch(`${backendUrl}/detect/image`, {
      method: "POST",
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail ?? "Backend inference failed." },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
