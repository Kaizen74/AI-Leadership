export interface Character {
  name: string;
  type: 'human' | 'agent';
  role: string;
  personality: string;
}

export interface Scenario {
  id: string;
  name: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  track: 'Strategic' | 'Human Dilemma';
  shiftsTested: string;
  description: string;
  context: string;
  characters: Character[];
  assessmentCriteria: string[];
  pitStopQuestions: string[];
  reflectionPrompt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CriterionScore {
  criterion: string;
  score: number;
  note: string;
}

export interface PitStopResult {
  scores: CriterionScore[];
  totalScore: number;
  pattern: string;
}

export interface TeamState {
  teamName: string;
  scenarioId: string;
  status: 'joined' | 'briefing' | 'playing' | 'pitstop' | 'completed';
  turn: number;
  messages: Message[];
  pitStopResults: PitStopResult[];
  finalAssessment: string | null;
  lastUpdate: number;
}

export interface SessionState {
  code: string;
  scenarioId: string;
  industryId: string;
  createdAt: number;
  openingMessage: string | null;
  teams: Record<string, TeamState>;
}

// Analytics types
export interface SessionRecord {
  id: string;
  scenarioId: string;
  industryId: string;
  mode: 'team' | 'solo';
  completedAt: number;
  turns: number;
  pitStopResults: PitStopResult[];
  finalAssessment: string | null;
  criteriaScores: { criterion: string; score: number }[];
}

export interface PlayerProfile {
  playerId: string;
  displayName: string;
  createdAt: number;
  sessions: SessionRecord[];
}
