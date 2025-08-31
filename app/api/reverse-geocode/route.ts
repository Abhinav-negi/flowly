import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // Validate coordinates
  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Missing latitude or longitude coordinates" },
      { status: 400 }
    );
  }

  // Validate that coordinates are numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid coordinates format" },
      { status: 400 }
    );
  }

  // Check if API key exists
  if (!process.env.OPENCAGE_API_KEY) {
    console.error("Missing OPENCAGE_API_KEY environment variable");
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    );
  }

  try {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.OPENCAGE_API_KEY}&limit=1`;
    
    console.log('Calling OpenCage API:', apiUrl.replace(process.env.OPENCAGE_API_KEY, 'API_KEY_HIDDEN'));
    
    const apiRes = await fetch(apiUrl);
    
    // Check if the API response is ok
    if (!apiRes.ok) {
      console.error(`OpenCage API error: ${apiRes.status} ${apiRes.statusText}`);
      return NextResponse.json(
        { error: "Geocoding service unavailable" },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    // Check if we got results
    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    console.log('Successfully geocoded location:', data.results[0]?.formatted);

    // Return the formatted location
    return NextResponse.json({ 
      location: data.results[0]?.formatted || "Unknown location",
      coordinates: { lat: latitude, lng: longitude }
    });

  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json(
      { error: "Failed to fetch location data" },
      { status: 500 }
    );
  }
}