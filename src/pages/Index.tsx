import { useState, useCallback, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { InfoCards } from '@/components/InfoCards';
import { LearningSetup } from '@/components/LearningSetup';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ChatWindow } from '@/components/ChatWindow';
import type {
  ChatMessage, ConnectionStatus, SessionConfig,
  InteractionMode, RolePlayState,
} from '@/types/chat';
import { INITIAL_ROLEPLAY_STATE } from '@/types/chat';
import {
  loadConfig, saveConfig, loadMessages, saveMessages,
  loadSetupDone, saveSetupDone, loadRolePlayState, saveRolePlayState,
  clearRolePlayState, loadMode, saveMode,
} from '@/services/storage';
import {
  sendMessage, isWebhookConfigured, startRolePlay, sendRolePlayAnswer,
} from '@/services/webhook';

const Index = () => {
  const [config, setConfig] = useState<SessionConfig>(loadConfig);
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [setupDone, setSetupDone] = useState(loadSetupDone);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('não configurado');
  const [mode, setMode] = useState<InteractionMode>(loadMode);
  const [rolePlayState, setRolePlayState] = useState<RolePlayState>(loadRolePlayState);

  useEffect(() => {
    if (isLoading) setConnectionStatus('a enviar');
    else if (isWebhookConfigured(config.webhookUrl)) setConnectionStatus('pronto');
    else setConnectionStatus('não configurado');
  }, [config.webhookUrl, isLoading]);

  const handleConfigChange = useCallback((c: SessionConfig) => {
    setConfig(c);
    saveConfig(c);
  }, []);

  // ─── Start handler (mode only) ───

  const handleStart = useCallback(async (startMode: InteractionMode) => {
    setSetupDone(true);
    saveSetupDone(true);
    setMode(startMode);
    saveMode(startMode);

    if (startMode === 'roleplay') {
      // Start role play session
      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: 'Role Play iniciado — Negociação Comercial · 10 questões',
        timestamp: new Date().toISOString(),
      };
      setMessages([sysMsg]);
      saveMessages([sysMsg]);
      setIsLoading(true);

      try {
        const result = await startRolePlay(
          config.webhookUrl, config.userId, 'commercial_negotiation', 10, config.apiKey,
        );

        const rpState: RolePlayState = {
          roleplaySessionId: result.roleplaySessionId,
          currentQuestionIndex: result.currentQuestionIndex,
          totalQuestions: result.totalQuestions,
          completed: false,
          active: true,
        };
        setRolePlayState(rpState);
        saveRolePlayState(rpState);

        const questionMsg: ChatMessage = {
          id: `rp-q-${Date.now()}`,
          role: 'assistant',
          content: result.question,
          timestamp: new Date().toISOString(),
          isRolePlayQuestion: true,
        };
        const msgs = [sysMsg, questionMsg];
        setMessages(msgs);
        saveMessages(msgs);
      } catch (err) {
        setConnectionStatus('erro');
        const eMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'error',
          content: err instanceof Error ? err.message : 'Erro ao iniciar role play.',
          timestamp: new Date().toISOString(),
        };
        setMessages([sysMsg, eMsg]);
        saveMessages([sysMsg, eMsg]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Chat mode — just start with an empty conversation
      const msg: ChatMessage = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: 'Chat iniciado — pode começar a fazer perguntas sobre o curso',
        timestamp: new Date().toISOString(),
      };
      setMessages([msg]);
      saveMessages([msg]);
      setRolePlayState({ ...INITIAL_ROLEPLAY_STATE });
      clearRolePlayState();
    }
  }, [config]);

  // ─── Send handler ───

  const handleSend = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveMessages(updated);
    setIsLoading(true);

    if (mode === 'roleplay' && rolePlayState.active && !rolePlayState.completed) {
      // ─── Role play answer ───
      try {
        const result = await sendRolePlayAnswer(
          config.webhookUrl, config.userId,
          rolePlayState.roleplaySessionId, text, config.apiKey,
        );

        const newMsgs = [...updated];

        if (result.isOffTopic) {
          const feedbackMsg: ChatMessage = {
            id: `rp-fb-${Date.now()}`,
            role: 'assistant',
            content: result.feedback || result.question || 'Por favor, foque na negociação.',
            timestamp: new Date().toISOString(),
            isRolePlayFeedback: true,
            isOffTopic: true,
          };
          newMsgs.push(feedbackMsg);
        } else if (result.completed) {
          if (result.feedback) {
            const feedbackMsg: ChatMessage = {
              id: `rp-fb-${Date.now()}`,
              role: 'assistant',
              content: result.feedback,
              timestamp: new Date().toISOString(),
              isRolePlayFeedback: true,
              score: result.score,
            };
            newMsgs.push(feedbackMsg);
          }

          const rpState: RolePlayState = {
            ...rolePlayState,
            completed: true,
            summary: result.summary,
            finalScore: result.score,
          };
          setRolePlayState(rpState);
          saveRolePlayState(rpState);
        } else {
          if (result.feedback) {
            const feedbackMsg: ChatMessage = {
              id: `rp-fb-${Date.now()}`,
              role: 'assistant',
              content: result.feedback,
              timestamp: new Date().toISOString(),
              isRolePlayFeedback: true,
              score: result.score,
            };
            newMsgs.push(feedbackMsg);
          }

          if (result.question) {
            const questionMsg: ChatMessage = {
              id: `rp-q-${Date.now() + 1}`,
              role: 'assistant',
              content: result.question,
              timestamp: new Date().toISOString(),
              isRolePlayQuestion: true,
            };
            newMsgs.push(questionMsg);
          }

          const rpState: RolePlayState = {
            ...rolePlayState,
            currentQuestionIndex: result.currentQuestionIndex,
          };
          setRolePlayState(rpState);
          saveRolePlayState(rpState);
        }

        setMessages(newMsgs);
        saveMessages(newMsgs);
      } catch (err) {
        setConnectionStatus('erro');
        const eMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'error',
          content: err instanceof Error ? err.message : 'Erro ao enviar resposta.',
          timestamp: new Date().toISOString(),
        };
        setMessages([...updated, eMsg]);
        saveMessages([...updated, eMsg]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // ─── Chat mode ───
      try {
        const result = await sendMessage(config, text);
        const aMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: result.answer,
          timestamp: new Date().toISOString(),
          guidance: result.guidance,
          sources: result.sources,
          isOutOfScope: result.isOutOfScope,
          score: result.score,
        };
        const final_ = [...updated, aMsg];
        setMessages(final_);
        saveMessages(final_);
      } catch (err) {
        setConnectionStatus('erro');
        const eMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'error',
          content: err instanceof Error ? err.message : 'Erro desconhecido.',
          timestamp: new Date().toISOString(),
        };
        setMessages([...updated, eMsg]);
        saveMessages([...updated, eMsg]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [messages, config, mode, rolePlayState]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
    if (mode === 'roleplay') {
      setRolePlayState({ ...INITIAL_ROLEPLAY_STATE });
      clearRolePlayState();
    }
  }, [mode]);

  const handleRestartRolePlay = useCallback(() => {
    setRolePlayState({ ...INITIAL_ROLEPLAY_STATE });
    clearRolePlayState();
    setSetupDone(false);
    saveSetupDone(false);
    setMessages([]);
    saveMessages([]);
  }, []);

  const handleSwitchToChat = useCallback(() => {
    setMode('chat');
    saveMode('chat');
    setRolePlayState({ ...INITIAL_ROLEPLAY_STATE });
    clearRolePlayState();
    setSetupDone(false);
    saveSetupDone(false);
    setMessages([]);
    saveMessages([]);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setSetupDone(false);
    saveSetupDone(false);
    setMessages([]);
    saveMessages([]);
    setRolePlayState({ ...INITIAL_ROLEPLAY_STATE });
    clearRolePlayState();
  }, []);

  const chatStatus = messages.length === 0 ? 'Conversa limpa' : 'Em curso';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-5 space-y-5">
        <InfoCards />

        {!setupDone ? (
          <div className="py-4">
            <LearningSetup onStart={handleStart} />
          </div>
        ) : (
          <>
            {/* Mode badge + back button */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full text-primary-foreground shadow-card ${
                mode === 'roleplay' ? 'bg-accent' : 'gradient-badge'
              }`}>
                {mode === 'roleplay' ? '🎭 Role Play — Negociação Comercial' : '💬 Chat Livre'}
              </span>
              <button
                onClick={handleBackToMenu}
                className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                ← Voltar ao menu
              </button>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
              <div className="order-2 lg:order-1">
                <ConfigPanel
                  config={config}
                  onChange={handleConfigChange}
                  connectionStatus={connectionStatus}
                  messages={messages}
                  onClearChat={handleClearChat}
                />
              </div>
              <div className="order-1 lg:order-2">
                <ChatWindow
                  messages={messages}
                  onSend={handleSend}
                  isLoading={isLoading}
                  connectionStatus={connectionStatus}
                  chatStatus={chatStatus}
                  mode={mode}
                  rolePlayState={rolePlayState}
                  onRestartRolePlay={handleRestartRolePlay}
                  onSwitchToChat={handleSwitchToChat}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="text-center py-3 text-[11px] text-muted-foreground/60 border-t border-border/40">
        Cegos Fase 3 — Demo Frontend · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
