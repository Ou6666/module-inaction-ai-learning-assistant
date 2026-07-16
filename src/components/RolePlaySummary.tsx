import { Trophy, RotateCcw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import mascotImg from '@/assets/mascot.png';
import type { RolePlayState } from '@/types/chat';

interface RolePlaySummaryProps {
  state: RolePlayState;
  onRestart: () => void;
  onSwitchToChat: () => void;
}

export function RolePlaySummary({ state, onRestart, onSwitchToChat }: RolePlaySummaryProps) {
  const score = state.finalScore ?? 0;
  const maxScore = 10;
  const percentage = Math.round((score / maxScore) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return 'Excelente!';
    if (percentage >= 60) return 'Bom trabalho';
    if (percentage >= 40) return 'Pode melhorar';
    return 'Precisa de revisão';
  };

  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <img
        src={mascotImg}
        alt=""
        className="h-20 w-auto mb-4 drop-shadow-lg"
      />

      <div className="mb-4">
        <Trophy className="h-10 w-10 text-accent mx-auto mb-2" />
        <h3 className="text-lg font-bold text-foreground">Role Play Concluído!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Completou {state.totalQuestions} questões de negociação comercial.
        </p>
      </div>

      {/* Score ring */}
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/{maxScore}</span>
        </div>
      </div>

      <p className={`text-sm font-semibold mb-2 ${getScoreColor()}`}>{getScoreLabel()}</p>

      {state.summary && (
        <div className="w-full max-w-md p-4 rounded-xl bg-muted/40 border border-border/60 text-left mb-6">
          <p className="text-xs font-semibold text-foreground mb-1.5">Feedback final</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{state.summary}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onRestart}
          className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-card"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Novo Role Play
        </Button>
        <Button
          variant="outline"
          onClick={onSwitchToChat}
          className="rounded-xl"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat livre
        </Button>
      </div>
    </div>
  );
}
