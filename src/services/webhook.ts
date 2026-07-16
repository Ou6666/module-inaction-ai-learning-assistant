// Webhook API service
import type {
  SessionConfig,
  WebhookPayload,
  WebhookResponse,
  ParsedResponse,
  WebhookMode,
  RolePlayStartResponse,
  RolePlayAnswerResponse,
} from '@/types/chat';

const OUT_OF_SCOPE_PATTERNS = [
  'unknown',
  'no evidence found',
  'não consigo responder',
  'fora do âmbito',
  'não tenho informação',
  'sem evidência',
  'não encontrei',
  'não disponho',
];

export function isWebhookConfigured(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function parseResponse(data: WebhookResponse): ParsedResponse {
  const answer = data.answer || data.reply || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
  const guidance = data.guidance || data.feedback || undefined;
  const sources = data.sources || data.citations || undefined;
  const score = typeof data.score === 'number' ? data.score : typeof data.grade === 'number' ? data.grade : undefined;

  const lowerAnswer = (answer || '').toLowerCase();
  const isOutOfScope = OUT_OF_SCOPE_PATTERNS.some(p => lowerAnswer.includes(p));

  return {
    answer: String(answer),
    guidance: guidance ? String(guidance) : undefined,
    sources: sources ? (Array.isArray(sources) ? sources.map(String) : [String(sources)]) : undefined,
    isOutOfScope,
    score,
  };
}

export interface SendMessageOptions {
  intent?: 'generate_question' | 'generate_scenario' | 'evaluate_answer';
}

// ─── Chat mode (action: chat) ───

export async function sendMessage(
  config: SessionConfig,
  message: string,
  options?: SendMessageOptions
): Promise<ParsedResponse> {
  if (!isWebhookConfigured(config.webhookUrl)) {
    throw new Error('URL do webhook não configurado ou inválido.');
  }

  const mode: WebhookMode =
    options?.intent === 'generate_question'
      ? 'generate_question'
      : options?.intent === 'generate_scenario'
        ? 'generate_scenario'
        : options?.intent === 'evaluate_answer'
          ? 'evaluate_answer'
          : 'qa';

  const payload: WebhookPayload = {
    message,
    sessionId: config.sessionId,
    userId: config.userId,
    course: config.course,
    level: config.level,
    scenario: config.scenario,
    mode,
    client: 'lovable-frontend-demo',
    timestamp: new Date().toISOString(),
    ...(options?.intent && { intent: options.intent }),
  };

  // Also send action: 'chat' for the new Switch-based backend
  const body = { ...payload, action: 'chat' };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.apiKey) headers['x-api-key'] = config.apiKey;

  const res = await fetch(config.webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Erro do webhook: ${res.status} ${res.statusText}`);
  }

  const data: WebhookResponse = await res.json();
  return parseResponse(data);
}

// ─── Role Play: start session ───

export async function startRolePlay(
  webhookUrl: string,
  userId: string,
  scenarioId: string = 'commercial_negotiation',
  totalQuestions: number = 10,
  apiKey?: string,
): Promise<RolePlayStartResponse> {
  if (!isWebhookConfigured(webhookUrl)) {
    throw new Error('URL do webhook não configurado ou inválido.');
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'start',
      userId,
      scenarioId,
      totalQuestions,
    }),
  });

  if (!res.ok) {
    throw new Error(`Erro ao iniciar role play: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<RolePlayStartResponse>;
}

// ─── Role Play: send answer ───

export async function sendRolePlayAnswer(
  webhookUrl: string,
  userId: string,
  roleplaySessionId: string,
  message: string,
  apiKey?: string,
): Promise<RolePlayAnswerResponse> {
  if (!isWebhookConfigured(webhookUrl)) {
    throw new Error('URL do webhook não configurado ou inválido.');
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-api-key'] = apiKey;

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      action: 'answer',
      userId,
      roleplaySessionId,
      message,
    }),
  });

  if (!res.ok) {
    throw new Error(`Erro ao enviar resposta: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<RolePlayAnswerResponse>;
}
