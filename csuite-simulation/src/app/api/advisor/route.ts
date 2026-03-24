import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  let body: { system: string; messages: { role: string; content: string }[]; simulationContext?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { system, messages, simulationContext } = body;
  if (!system || !messages) {
    return Response.json(
      { error: 'Missing required fields: system, messages.' },
      { status: 400 }
    );
  }

  // Prepend simulation context as a system-level awareness
  const fullSystem = simulationContext
    ? `${system}\n\nCURRENT SIMULATION TRANSCRIPT (for context — do NOT repeat or play these characters):\n${simulationContext}`
    : system;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: fullSystem,
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: `Anthropic API error: ${res.status}`, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: 'Failed to reach Anthropic API.', details: String(err) },
      { status: 502 }
    );
  }
}
