import { PlayerProfile, SessionRecord } from './types';

const STORAGE_KEY = 'csuite_player_profile';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return null;
  }
}

export function createProfile(displayName: string): PlayerProfile {
  const profile: PlayerProfile = {
    playerId: generateId(),
    displayName,
    createdAt: Date.now(),
    sessions: [],
  };
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function addSessionRecord(record: SessionRecord): PlayerProfile | null {
  let profile = getProfile();
  if (!profile) {
    profile = createProfile('Leader');
  }
  profile.sessions.push(record);
  saveProfile(profile);
  return profile;
}

export function createSessionRecord(
  scenarioId: string,
  industryId: string,
  mode: 'team' | 'solo',
  turns: number,
  pitStopResults: SessionRecord['pitStopResults'],
  finalAssessment: string | null,
  criteriaScores: SessionRecord['criteriaScores'],
): SessionRecord {
  return {
    id: generateId(),
    scenarioId,
    industryId,
    mode,
    completedAt: Date.now(),
    turns,
    pitStopResults,
    finalAssessment,
    criteriaScores,
  };
}

// Compute aggregated stats
export function getStats(profile: PlayerProfile) {
  const sessions = profile.sessions;
  const totalSessions = sessions.length;
  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      scenariosCompleted: [] as string[],
      industriesExplored: [] as string[],
      criteriaAverages: {} as Record<string, number>,
      recentTrend: [] as { date: number; score: number }[],
    };
  }

  // Average final scores
  let totalScore = 0;
  let scoreCount = 0;
  const criteriaMap: Record<string, { sum: number; count: number }> = {};

  for (const s of sessions) {
    for (const cs of s.criteriaScores) {
      totalScore += cs.score;
      scoreCount++;
      const key = cs.criterion.split(' — ')[0];
      if (!criteriaMap[key]) criteriaMap[key] = { sum: 0, count: 0 };
      criteriaMap[key].sum += cs.score;
      criteriaMap[key].count++;
    }
  }

  const criteriaAverages: Record<string, number> = {};
  for (const [key, val] of Object.entries(criteriaMap)) {
    criteriaAverages[key] = val.sum / val.count;
  }

  const scenariosCompleted = [...new Set(sessions.map((s) => s.scenarioId))];
  const industriesExplored = [...new Set(sessions.map((s) => s.industryId))];

  const recentTrend = sessions
    .filter((s) => s.criteriaScores.length > 0)
    .map((s) => ({
      date: s.completedAt,
      score: s.criteriaScores.reduce((sum, c) => sum + c.score, 0) / s.criteriaScores.length,
    }))
    .sort((a, b) => a.date - b.date);

  return {
    totalSessions,
    averageScore: scoreCount > 0 ? totalScore / scoreCount : 0,
    scenariosCompleted,
    industriesExplored,
    criteriaAverages,
    recentTrend,
  };
}
