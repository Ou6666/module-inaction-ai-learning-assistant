// Core types for the Cegos Fase 3 chatbot demo

export type Level = 'Iniciante' | 'Intermédio' | 'Avançado';
export type Scenario = 'Cenário 1' | 'Cenário 2' | 'Cenário 3';
export type Language = 'Português' | 'English' | 'Français';

export type ConnectionStatus = 'não configurado' | 'pronto' | 'a enviar' | 'erro';

export type MessageRole = 'system' | 'user' | 'assistant' | 'error';

/** The active interaction mode */
export type InteractionMode = 'chat' | 'roleplay';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  guidance?: string;
  sources?: string[];
  isOutOfScope?: boolean;
  isLoading?: boolean;
  score?: number;
  isScenarioQuestion?: boolean;
  isScenarioDescription?: boolean;
  /** Role play: marks AI question */
  isRolePlayQuestion?: boolean;
  /** Role play: marks AI feedback */
  isRolePlayFeedback?: boolean;
  /** Role play: marks final summary */
  isRolePlaySummary?: boolean;
  /** Role play: user went off topic */
  isOffTopic?: boolean;
}

export interface SessionConfig {
  webhookUrl: string;
  sessionId: string;
  userId: string;
  apiKey: string;
  course: string;
  level: Level | '';
  scenario: Scenario | '';
  language: Language | '';
  notes: string;
}

// ─── Role Play State ───

export interface RolePlayState {
  roleplaySessionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  completed: boolean;
  summary?: string;
  finalScore?: number;
  active: boolean;
}

export const INITIAL_ROLEPLAY_STATE: RolePlayState = {
  roleplaySessionId: '',
  currentQuestionIndex: 0,
  totalQuestions: 10,
  completed: false,
  active: false,
};

// ─── Webhook types ───

export type WebhookMode = 'qa' | 'generate_question' | 'generate_scenario' | 'evaluate_answer';

export interface WebhookPayload {
  message: string;
  sessionId: string;
  userId: string;
  course: string;
  level: string;
  scenario: string;
  mode: WebhookMode;
  client: 'lovable-frontend-demo';
  timestamp: string;
  intent?: 'generate_question' | 'generate_scenario' | 'evaluate_answer';
}

export interface RolePlayStartResponse {
  success: boolean;
  roleplaySessionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  question: string;
}

export interface RolePlayAnswerResponse {
  success: boolean;
  roleplaySessionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isOffTopic: boolean;
  feedback?: string;
  score?: number;
  question?: string;
  completed: boolean;
  summary?: string;
}

export interface WebhookResponse {
  answer?: string;
  guidance?: string;
  sources?: string[];
  reply?: string;
  feedback?: string;
  citations?: string[];
  message?: string;
  score?: number;
  grade?: number;
  [key: string]: unknown;
}

export interface ParsedResponse {
  answer: string;
  guidance?: string;
  sources?: string[];
  isOutOfScope: boolean;
  score?: number;
}
