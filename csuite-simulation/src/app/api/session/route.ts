import { NextRequest } from 'next/server';
import { SessionState, TeamState, PitStopResult } from '@/lib/types';
import { getSession, saveSession, storeHealth } from '@/lib/sessionStore';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const action = body.action as string;

  if (action === 'createSession') {
    const code = body.code as string;
    const scenarioId = body.scenarioId as string;
    if (!code || !scenarioId) {
      return Response.json({ error: 'Missing code or scenarioId.' }, { status: 400 });
    }
    const session: SessionState = {
      code,
      scenarioId,
      createdAt: Date.now(),
      teams: {},
    };
    await saveSession(session);
    return Response.json({ ok: true, session: { code, scenarioId, createdAt: session.createdAt } });
  }

  if (action === 'joinTeam') {
    const code = body.code as string;
    const teamName = body.teamName as string;
    if (!code || !teamName) {
      return Response.json({ error: 'Missing code or teamName.' }, { status: 400 });
    }
    const session = await getSession(code);
    if (!session) {
      const health = await storeHealth();
      const hint =
        health.mode === 'memory'
          ? ' The server is using in-memory storage (no Redis connected). Sessions do not persist across requests on serverless platforms. Connect an Upstash Redis database in Vercel → Storage tab, then redeploy.'
          : '';
      return Response.json(
        { error: `Session not found.${hint}` },
        { status: 404 },
      );
    }
    if (session.teams[teamName]) {
      return Response.json({ ok: true, scenarioId: session.scenarioId, message: 'Already joined.' });
    }
    const team: TeamState = {
      teamName,
      scenarioId: session.scenarioId,
      status: 'joined',
      turn: 0,
      messages: [],
      pitStopResults: [],
      finalAssessment: null,
      lastUpdate: Date.now(),
    };
    session.teams[teamName] = team;
    await saveSession(session);
    return Response.json({ ok: true, scenarioId: session.scenarioId });
  }

  if (action === 'updateTeam') {
    const code = body.code as string;
    const teamName = body.teamName as string;
    if (!code || !teamName) {
      return Response.json({ error: 'Missing code or teamName.' }, { status: 400 });
    }
    const session = await getSession(code);
    if (!session || !session.teams[teamName]) {
      return Response.json({ error: 'Session or team not found.' }, { status: 404 });
    }
    const team = session.teams[teamName];
    if (body.status !== undefined) team.status = body.status as TeamState['status'];
    if (body.turn !== undefined) team.turn = body.turn as number;
    if (body.messages !== undefined) team.messages = body.messages as TeamState['messages'];
    if (body.pitStopResult !== undefined) {
      team.pitStopResults.push(body.pitStopResult as PitStopResult);
    }
    if (body.finalAssessment !== undefined) team.finalAssessment = body.finalAssessment as string;
    team.lastUpdate = Date.now();
    await saveSession(session);
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Unknown action.' }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get('code');
  const action = url.searchParams.get('action');

  // Diagnostic endpoint: /api/session?action=health
  if (action === 'health') {
    const health = await storeHealth();
    return Response.json(health);
  }

  if (!code) {
    return Response.json({ error: 'Missing code parameter.' }, { status: 400 });
  }

  const session = await getSession(code);
  if (!session) {
    return Response.json({ error: 'Session not found.' }, { status: 404 });
  }

  if (action === 'allTeams') {
    return Response.json({
      code: session.code,
      scenarioId: session.scenarioId,
      teams: session.teams,
    });
  }

  // Default: return session config (without full message history)
  const teamSummaries = Object.entries(session.teams).map(([name, t]) => ({
    teamName: name,
    status: t.status,
    turn: t.turn,
    pitStopCount: t.pitStopResults.length,
    lastUpdate: t.lastUpdate,
  }));

  return Response.json({
    code: session.code,
    scenarioId: session.scenarioId,
    createdAt: session.createdAt,
    teams: teamSummaries,
  });
}
