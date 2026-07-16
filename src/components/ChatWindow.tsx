import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageBubble } from '@/components/MessageBubble';
import { EmptyState } from '@/components/EmptyState';
import { RolePlayProgress } from '@/components/RolePlayProgress';
import { RolePlaySummary } from '@/components/RolePlaySummary';
import type { ChatMessage, ConnectionStatus, InteractionMode, RolePlayState } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  chatStatus: string;
  mode: InteractionMode;
  rolePlayState?: RolePlayState;
  onRestartRolePlay?: () => void;
  onSwitchToChat?: () => void;
}

export function ChatWindow({
  messages,
  onSend,
  isLoading,
  connectionStatus,
  chatStatus,
  mode,
  rolePlayState,
  onRestartRolePlay,
  onSwitchToChat,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = connectionStatus === 'pronto' || connectionStatus === 'a enviar';
  const isRolePlay = mode === 'roleplay';
  const isRolePlayCompleted = isRolePlay && rolePlayState?.completed;

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-elevated flex flex-col h-[600px] lg:h-[700px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isRolePlay ? 'bg-accent/20' : 'gradient-primary'}`}>
              {isRolePlay
                ? <Swords className="h-4 w-4 text-accent" />
                : <MessageCircle className="h-4 w-4 text-primary-foreground" />
              }
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {isRolePlay ? 'Role Play — Negociação Comercial' : 'Chat com o assistente'}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {isRolePlay
                  ? 'Responda ao cliente como representante de vendas'
                  : 'Faça perguntas em linguagem natural sobre o curso'
                }
              </p>
            </div>
          </div>
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
            isRolePlayCompleted
              ? 'bg-green-100 text-green-700'
              : chatStatus === 'Em curso'
                ? 'bg-status-ready/10 text-status-ready'
                : 'bg-muted text-muted-foreground'
          }`}>
            {isRolePlayCompleted ? 'Concluído' : chatStatus}
          </span>
        </div>
      </div>

      {/* Role Play Progress Bar */}
      {isRolePlay && rolePlayState?.active && !rolePlayState.completed && (
        <RolePlayProgress state={rolePlayState} />
      )}

      {/* Messages or Summary */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scroll min-h-0">
        {isRolePlayCompleted && rolePlayState && onRestartRolePlay && onSwitchToChat ? (
          <RolePlaySummary
            state={rolePlayState}
            onRestart={onRestartRolePlay}
            onSwitchToChat={onSwitchToChat}
          />
        ) : messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isRolePlayMode={isRolePlay} />
            ))}
            {isLoading && (
              <MessageBubble
                message={{ id: 'loading', role: 'assistant', content: '', timestamp: new Date().toISOString(), isLoading: true }}
                isRolePlayMode={isRolePlay}
              />
            )}
          </>
        )}
      </div>

      {/* Input (hidden when role play is completed) */}
      {!isRolePlayCompleted && (
        <div className="shrink-0 border-t border-border/50 p-3 bg-muted/20">
          <p className="text-[10px] text-muted-foreground mb-2 px-1">
            {isRolePlay
              ? 'Responda ao cliente em linguagem profissional. Shift+Enter para nova linha.'
              : 'Shift+Enter para nova linha.'
            }
          </p>
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !canSend
                  ? 'Configure o webhook para começar'
                  : isRolePlay
                    ? 'Escreva a sua resposta ao cliente...'
                    : 'Escreva a sua pergunta...'
              }
              disabled={!canSend}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-primary/40 disabled:opacity-40 transition-all"
              aria-label="Mensagem"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !canSend}
              className="gradient-primary text-primary-foreground hover:opacity-90 shrink-0 h-10 w-10 rounded-xl shadow-card disabled:opacity-30"
              size="icon"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
