import type { RolePlayState } from '@/types/chat';

interface RolePlayProgressProps {
  state: RolePlayState;
}

export function RolePlayProgress({ state }: RolePlayProgressProps) {
  const { currentQuestionIndex, totalQuestions, completed } = state;
  const progress = completed
    ? 100
    : totalQuestions > 0
      ? ((currentQuestionIndex - 1) / totalQuestions) * 100
      : 0;

  return (
    <div className="px-5 py-4 border-b border-border/50 bg-muted/20">
      {/* Top row: label + percentage */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {completed ? (
            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span className="text-lg">🎉</span>
              Concluído!
            </span>
          ) : (
            <>
              <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-full bg-accent text-white text-xs font-black shadow-sm">
                {currentQuestionIndex}
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                de {totalQuestions} questões
              </span>
            </>
          )}
        </div>
        <span className="text-sm font-black text-primary tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Duolingo-style progress bar */}
      <div
        className="relative h-[18px] rounded-full overflow-hidden"
        style={{
          background: 'hsl(var(--muted))',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${progress}%`,
            transition: 'width 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: completed
              ? 'linear-gradient(180deg, #7FD651 0%, #58CC02 60%, #46A302 100%)'
              : 'linear-gradient(180deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 70%, hsl(var(--primary) / 0.85) 100%)',
            boxShadow: completed
              ? 'inset 0 -3px 0 rgba(0, 0, 0, 0.15), 0 0 8px rgba(88, 204, 2, 0.4)'
              : 'inset 0 -3px 0 rgba(0, 0, 0, 0.18), 0 0 6px hsl(var(--primary) / 0.3)',
          }}
        >
          {/* Glossy top highlight — the Duolingo signature look */}
          {progress > 2 && (
            <div
              className="absolute top-[3px] left-2 right-2 h-[5px] rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.1) 100%)',
              }}
            />
          )}

          {/* Shimmer animation */}
          {!completed && progress > 10 && (
            <div
              className="absolute inset-y-0 w-1/3 rounded-full opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                animation: 'progress-shimmer 2.5s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
