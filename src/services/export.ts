// Export conversation as JSON or TXT
import type { SessionConfig, ChatMessage } from '@/types/chat';

interface ExportData {
  exportedAt: string;
  webhookUrl: string;
  sessionId: string;
  userId: string;
  course: string;
  level: string;
  scenario: string;
  messages: ChatMessage[];
}

function buildExportData(config: SessionConfig, messages: ChatMessage[]): ExportData {
  return {
    exportedAt: new Date().toISOString(),
    webhookUrl: config.webhookUrl,
    sessionId: config.sessionId,
    userId: config.userId,
    course: config.course,
    level: config.level,
    scenario: config.scenario,
    messages,
  };
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsJson(config: SessionConfig, messages: ChatMessage[]) {
  const data = buildExportData(config, messages);
  download(JSON.stringify(data, null, 2), `cegos-fase3-${Date.now()}.json`, 'application/json');
}

export function exportAsTxt(config: SessionConfig, messages: ChatMessage[]) {
  const data = buildExportData(config, messages);
  const lines: string[] = [
    '=== Cegos Fase 3 – Registo de Conversa ===',
    `Exportado: ${data.exportedAt}`,
    `Webhook: ${data.webhookUrl}`,
    `Sessão: ${data.sessionId}`,
    `Utilizador: ${data.userId}`,
    `Curso: ${data.course}`,
    `Nível: ${data.level}`,
    `Cenário: ${data.scenario}`,
    '',
    '--- Mensagens ---',
    '',
  ];

  for (const msg of data.messages) {
    const role = msg.role === 'user' ? 'UTILIZADOR' : msg.role === 'assistant' ? 'ASSISTENTE' : msg.role.toUpperCase();
    lines.push(`[${msg.timestamp}] ${role}:`);
    lines.push(msg.content);
    if (msg.guidance) {
      lines.push(`  📘 Orientação: ${msg.guidance}`);
    }
    if (msg.sources?.length) {
      lines.push(`  📄 Fontes: ${msg.sources.join(', ')}`);
    }
    lines.push('');
  }

  download(lines.join('\n'), `cegos-fase3-${Date.now()}.txt`, 'text/plain');
}
