// localStorage persistence service
import type { SessionConfig, ChatMessage, RolePlayState, InteractionMode } from '@/types/chat';
import { INITIAL_ROLEPLAY_STATE } from '@/types/chat';

const KEYS = {
  config: 'cegos-config',
  messages: 'cegos-messages',
  setupDone: 'cegos-setup-done',
  roleplay: 'cegos-roleplay',
  mode: 'cegos-mode',
} as const;

const OLD_KEYS = {
  config: 'cegoc-config',
  messages: 'cegoc-messages',
  setupDone: 'cegoc-setup-done',
} as const;

const DEFAULT_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL ?? '';

const defaultConfig: SessionConfig = {
  webhookUrl: DEFAULT_WEBHOOK_URL,
  sessionId: '',
  userId: 'utilizador-demo',
  apiKey: '',
  course: 'Commercial Negotiation',
  level: '',
  scenario: '',
  language: '',
  notes: 'Exemplos de perguntas:\n• Quais são as fases da negociação comercial?\n• Que técnicas de fecho são recomendadas?\n• Como preparar uma proposta de valor?\n• Qual a diferença entre negociação distributiva e integrativa?',
};

export function generateSessionId(): string {
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Config ───

export function loadConfig(): SessionConfig {
  try {
    const raw = localStorage.getItem(KEYS.config);
    if (!raw) {
      const oldRaw = localStorage.getItem(OLD_KEYS.config);
      if (oldRaw) {
        const parsed = JSON.parse(oldRaw) as SessionConfig;
        const merged = { ...defaultConfig, ...parsed };
        if (!merged.sessionId) merged.sessionId = generateSessionId();
        saveConfig(merged);
        return merged;
      }
      const cfg = { ...defaultConfig, sessionId: generateSessionId() };
      saveConfig(cfg);
      return cfg;
    }
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return { ...defaultConfig, sessionId: generateSessionId() };
  }
}

export function saveConfig(config: SessionConfig): void {
  localStorage.setItem(KEYS.config, JSON.stringify(config));
}

// ─── Messages ───

export function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.messages);
    if (raw) return JSON.parse(raw) as ChatMessage[];
    const oldRaw = localStorage.getItem(OLD_KEYS.messages);
    if (oldRaw) {
      const parsed = JSON.parse(oldRaw) as ChatMessage[];
      saveMessages(parsed);
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  localStorage.setItem(KEYS.messages, JSON.stringify(messages));
}

// ─── Setup done ───

export function loadSetupDone(): boolean {
  const raw = localStorage.getItem(KEYS.setupDone);
  if (raw !== null) return raw === 'true';
  const oldRaw = localStorage.getItem(OLD_KEYS.setupDone);
  if (oldRaw !== null) return oldRaw === 'true';
  return false;
}

export function saveSetupDone(done: boolean): void {
  localStorage.setItem(KEYS.setupDone, done ? 'true' : 'false');
}

// ─── Role Play State ───

export function loadRolePlayState(): RolePlayState {
  try {
    const raw = localStorage.getItem(KEYS.roleplay);
    if (raw) return { ...INITIAL_ROLEPLAY_STATE, ...JSON.parse(raw) };
    return { ...INITIAL_ROLEPLAY_STATE };
  } catch {
    return { ...INITIAL_ROLEPLAY_STATE };
  }
}

export function saveRolePlayState(state: RolePlayState): void {
  localStorage.setItem(KEYS.roleplay, JSON.stringify(state));
}

export function clearRolePlayState(): void {
  localStorage.removeItem(KEYS.roleplay);
}

// ─── Mode ───

export function loadMode(): InteractionMode {
  const raw = localStorage.getItem(KEYS.mode);
  if (raw === 'roleplay') return 'roleplay';
  return 'chat';
}

export function saveMode(mode: InteractionMode): void {
  localStorage.setItem(KEYS.mode, mode);
}

// ─── Reset ───

export function resetAll(): void {
  localStorage.removeItem(KEYS.config);
  localStorage.removeItem(KEYS.messages);
  localStorage.removeItem(KEYS.setupDone);
  localStorage.removeItem(KEYS.roleplay);
  localStorage.removeItem(KEYS.mode);
  localStorage.removeItem(OLD_KEYS.config);
  localStorage.removeItem(OLD_KEYS.messages);
  localStorage.removeItem(OLD_KEYS.setupDone);
}
