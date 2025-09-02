// File: app/api/reverse-geocode/route.ts
// This goes in your app/api/reverse-geocode folder if you're using App Router
// Create folder: app/api/reverse-geocode/ and put this file as route.ts

import { NextRequest, NextResponse } from 'next/server';

interface OpenCageResult {
  formatted: string;
  components: Record<string, string>;
}

interface OpenCageApiResponse {
  results: OpenCageResult[];
  status?: {
    code: number;
    message: string;
  };
}

interface ApiSuccessResponse {
  location: string;
  formatted: string | null;
  components?: Record<string, string>;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    const errorResponse: ApiErrorResponse = { error: 'Latitude and longitude are required' };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    
    if (!apiKey) {
      console.error('OPENCAGE_API_KEY is not set');
      const errorResponse: ApiErrorResponse = { error: 'Geocoding service not configured' };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&limit=1&no_annotations=1`,
      {
        headers: {
          'User-Agent': 'Flowly/1.0',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        const errorResponse: ApiErrorResponse = { error: 'Rate limit exceeded. Please try again later.' };
        return NextResponse.json(errorResponse, { status: 429 });
      }
      throw new Error(`OpenCage API error: ${response.status}`);
    }

    const data = await response.json() as OpenCageApiResponse;

    if (data.status?.code === 402) {
      const errorResponse: ApiErrorResponse = { error: 'API quota exceeded' };
      return NextResponse.json(errorResponse, { status: 402 });
    }

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.formatted || `${lat}, ${lng}`;
      
      const successResponse: ApiSuccessResponse = {
        location,
        formatted: result.formatted || null,
        components: result.components,
      };
      
      return NextResponse.json(successResponse);
    } else {
      const successResponse: ApiSuccessResponse = {
        location: `${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)}`,
        formatted: null,
      };
      return NextResponse.json(successResponse);
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    const errorResponse: ApiErrorResponse = {
      error: 'Failed to fetch location data',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}