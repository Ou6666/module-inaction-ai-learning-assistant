import { Copy, BookOpen, FileText, AlertTriangle, Bot, Swords, Target, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import mascotImg from '@/assets/mascot.png';
import type { ChatMessage } from '@/types/chat';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: ChatMessage;
  isRolePlayMode?: boolean;
}

export function MessageBubble({ message, isRolePlayMode }: MessageBubbleProps) {
  const {
    role, content, timestamp, guidance, sources,
    isOutOfScope, isLoading, score,
    isScenarioQuestion, isScenarioDescription,
    isRolePlayQuestion, isRolePlayFeedback, isOffTopic,
  } = message;
  const time = new Date(timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  const handleCopy = () => {
    navigator.clipboard.writeText(content + (guidance ? `\n\nOrientação: ${guidance}` : ''));
    toast.success('Copiado!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-end gap-2.5">
        <img src={mascotImg} alt="" className="h-8 w-8 rounded-lg object-contain shrink-0" />
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-border/60 shadow-card">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/50 pulse-dot-1" />
              <span className="h-2 w-2 rounded-full bg-primary/50 pulse-dot-2" />
              <span className="h-2 w-2 rounded-full bg-primary/50 pulse-dot-3" />
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {isRolePlayMode ? 'O cliente está a pensar...' : 'A processar...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // System message
  if (role === 'system') {
    return (
      <div className="flex justify-center py-1">
        <div className="px-4 py-1.5 rounded-full bg-system-bubble text-system-bubble-foreground text-[11px] font-medium">
          {content}
        </div>
      </div>
    );
  }

  // Error message
  if (role === 'error') {
    return (
      <div className="flex items-end gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-error-bubble flex items-center justify-center shrink-0">
          <AlertTriangle className="h-4 w-4 text-error-bubble-foreground" />
        </div>
        <div className="max-w-[80%] p-3 rounded-2xl rounded-bl-md bg-error-bubble border border-error-bubble-foreground/15">
          <p className="text-xs font-semibold text-error-bubble-foreground mb-0.5">Erro na comunicação</p>
          <p className="text-xs text-error-bubble-foreground/80">{content}</p>
        </div>
      </div>
    );
  }

  // User message
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-user-bubble text-user-bubble-foreground shadow-card">
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
          <p className="text-[10px] text-muted-foreground text-right mt-1 mr-1">{time}</p>
        </div>
      </div>
    );
  }

  // ─── Assistant message ───
  // Determine label and icon
  let labelText = 'Resposta';
  let LabelIcon = Bot;

  if (isRolePlayQuestion) {
    labelText = 'Cliente';
    LabelIcon = Swords;
  } else if (isRolePlayFeedback && isOffTopic) {
    labelText = 'Fora do tema';
    LabelIcon = XCircle;
  } else if (isRolePlayFeedback) {
    labelText = 'Feedback';
    LabelIcon = Target;
  } else if (isScenarioQuestion) {
    labelText = 'Pergunta de prática';
  } else if (isScenarioDescription) {
    labelText = 'Cenário';
  }

  // Determine border accent for role play
  const borderColor = isRolePlayQuestion
    ? 'border-accent/30'
    : isOffTopic
      ? 'border-red-300'
      : isRolePlayFeedback
        ? 'border-green-300'
        : 'border-border/60';

  return (
    <div className="flex items-start gap-2.5">
      <img src={mascotImg} alt="" className="h-8 w-8 rounded-lg object-contain shrink-0 mt-0.5" />
      <div className="max-w-[80%] space-y-2">
        {/* Main answer */}
        <div className={`bg-card border ${borderColor} rounded-2xl rounded-bl-md shadow-card overflow-hidden`}>
          <div className="p-4">
            <p className={`text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
              isRolePlayQuestion ? 'text-accent' : isOffTopic ? 'text-red-500' : 'text-primary'
            }`}>
              <LabelIcon className="h-3 w-3" />
              {labelText}
            </p>
            <div className="chat-markdown text-sm leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-border/40 bg-muted/30 flex items-center justify-between gap-2">
            <span className="text-[10px] text-muted-foreground">{time}</span>
            {typeof score === 'number' && score > 0 && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isRolePlayMode
                  ? score >= 7
                    ? 'text-green-700 bg-green-100'
                    : score >= 4
                      ? 'text-yellow-700 bg-yellow-100'
                      : 'text-red-700 bg-red-100'
                  : 'text-primary bg-primary/10'
              }`}>
                {isRolePlayMode ? `${score}/10` : `Pontuação: ${score}/100`}
              </span>
            )}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              aria-label="Copiar resposta"
            >
              <Copy className="h-3 w-3" /> Copiar
            </button>
          </div>
        </div>

        {/* Off-topic warning */}
        {isOffTopic && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700">Resposta fora do tema</p>
              <p className="text-[11px] text-red-600/75 mt-0.5 leading-relaxed">
                A sua resposta não está relacionada com a negociação em curso. Tente focar nos pontos do cliente.
              </p>
            </div>
          </div>
        )}

        {/* Out-of-scope warning (chat mode) */}
        {isOutOfScope && !isOffTopic && (
          <div className="p-3 rounded-xl bg-warning border border-warning-foreground/10 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-warning-foreground">Evidência insuficiente</p>
              <p className="text-[11px] text-warning-foreground/75 mt-0.5 leading-relaxed">
                Não foi possível encontrar informação suficiente nos materiais do curso.
              </p>
            </div>
          </div>
        )}

        {/* Pedagogical guidance */}
        {guidance && (
          <div className="p-3 rounded-xl bg-hint border border-hint-foreground/10 flex items-start gap-2.5">
            <BookOpen className="h-4 w-4 text-hint-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-hint-foreground">Orientação pedagógica</p>
              <p className="text-[11px] text-hint-foreground/75 mt-0.5 leading-relaxed">{guidance}</p>
            </div>
          </div>
        )}

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div className="p-3 rounded-xl bg-source border border-source-foreground/10 flex items-start gap-2.5">
            <FileText className="h-4 w-4 text-source-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-source-foreground">Fontes consultadas</p>
              <ul className="mt-1 space-y-0.5">
                {sources.map((s, i) => (
                  <li key={i} className="text-[11px] text-source-foreground/75 flex items-start gap-1">
                    <span className="text-source-foreground/40 mt-px">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
