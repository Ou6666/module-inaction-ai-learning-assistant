import { useState } from 'react';
import { Sparkles, ChevronRight, CheckCircle2, MessageCircle, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mascotImg from '@/assets/mascot.png';
import type { InteractionMode } from '@/types/chat';

interface LearningSetupProps {
  onStart: (mode: InteractionMode) => void;
}

export function LearningSetup({ onStart }: LearningSetupProps) {
  const [mode, setMode] = useState<InteractionMode | ''>('');

  const canStart = !!mode;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl border border-border/60 shadow-float overflow-hidden">
        {/* Header */}
        <div className="gradient-hero p-6 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/20 blur-2xl" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <img src={mascotImg} alt="" className="h-16 w-auto animate-float drop-shadow-lg" />
            <div>
              <h2 className="text-xl font-bold text-primary-foreground">Bem-vindo à Fase 3</h2>
              <p className="text-primary-foreground/70 text-sm mt-1">
                Escolha como deseja praticar: chat livre para explorar o conteúdo, ou role play para simular uma negociação completa.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode selection */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Escolha o modo de aprendizagem
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMode('chat')}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  mode === 'chat'
                    ? 'border-primary bg-primary/5 shadow-elevated'
                    : 'border-border/60 hover:border-primary/30 hover:bg-muted/30'
                }`}
              >
                {mode === 'chat' && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-primary" />}
                <MessageCircle className="h-7 w-7 text-primary mb-3" />
                <span className="font-semibold text-base block mb-1">Chat Livre</span>
                <span className="text-[12px] text-muted-foreground leading-relaxed block">
                  Faça perguntas livremente sobre o conteúdo do curso. O assistente responde com base nos materiais de formação.
                </span>
              </button>
              <button
                onClick={() => setMode('roleplay')}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  mode === 'roleplay'
                    ? 'border-accent bg-accent/5 shadow-elevated'
                    : 'border-border/60 hover:border-accent/30 hover:bg-muted/30'
                }`}
              >
                {mode === 'roleplay' && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-accent" />}
                <Swords className="h-7 w-7 text-accent mb-3" />
                <span className="font-semibold text-base block mb-1">Role Play</span>
                <span className="text-[12px] text-muted-foreground leading-relaxed block">
                  Simule uma negociação comercial completa com um cliente AI. 10 questões sequenciais com feedback e avaliação final.
                </span>
              </button>
            </div>
          </div>

          {/* Role Play info box */}
          {mode === 'roleplay' && (
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <Swords className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Negociação Comercial</p>
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                    Vai simular uma negociação completa com um cliente AI. O cenário inclui abertura, discussão de preços e condições,
                    gestão de objeções e fecho. Será avaliado em cada resposta (0–10) e receberá uma nota final no fim das 10 questões.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chat info box */}
          {mode === 'chat' && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Chat com o assistente pedagógico</p>
                  <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                    Pode fazer qualquer pergunta relacionada com o conteúdo do curso. O assistente irá responder com base nos materiais
                    disponíveis, com feedback pedagógico e referências às fontes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Start button */}
          <Button
            onClick={() => canStart && onStart(mode as InteractionMode)}
            disabled={!canStart}
            className={`w-full h-12 text-base font-semibold text-primary-foreground hover:opacity-90 transition-all duration-200 rounded-xl shadow-float disabled:opacity-40 disabled:shadow-none ${
              mode === 'roleplay' ? 'bg-accent hover:bg-accent/90' : 'gradient-primary'
            }`}
            size="lg"
          >
            {mode === 'roleplay' ? <Swords className="mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {mode === 'roleplay' ? 'Iniciar Role Play' : mode === 'chat' ? 'Começar Chat' : 'Escolha um modo'}
            {canStart && <ChevronRight className="ml-1 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
