import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    if (!process.env.ULTRAVOX_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    if (!process.env.AGENT_ID) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing Agent ID' },
        { status: 500 }
      );
    }

    const { firstName, lastCallTranscript } = await request.json();

    const apiUrl = `https://api.ultravox.ai/api/agents/${process.env.AGENT_ID}/calls`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY,
      },
      body: JSON.stringify({
        templateContext: {
          userFirstname: firstName || 'User',
          lastCallTranscript: lastCallTranscript || 'No previous call. This is the first call'
        },
        initialMessages: [],
        metadata: {},
        medium: {
          webRtc: {}
        },
        joinTimeout: "300s",
        maxDuration: "3600s",
        recordingEnabled: false,
        initialOutputMedium: "MESSAGE_MEDIUM_VOICE",
        firstSpeakerSettings: {
          agent: {}
        },
        experimentalSettings: {}
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to create call: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ joinUrl: data.joinUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
