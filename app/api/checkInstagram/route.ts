// app/api/checkInstagram/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { exists: false, error: "No username provided" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "X-IG-App-ID": "936619743392459", // required
          "Accept": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Instagram API failed:", res.status, res.statusText);
      return NextResponse.json({ exists: false }, { status: res.status });
    }

    const data = await res.json();
    const exists = !!data?.data?.user;

    return NextResponse.json({ exists, data });
  } catch (err) {
    console.error("Instagram fetch error:", err);
    return NextResponse.json(
      { exists: false, error: "Server error" },
      { status: 500 }
    );
  }
}
