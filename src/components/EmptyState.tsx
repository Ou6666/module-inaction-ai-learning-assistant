import mascotImg from '@/assets/mascot.png';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
      <img
        src={mascotImg}
        alt="Assistente"
        className="h-24 w-auto mb-6 animate-float drop-shadow-lg opacity-80"
      />
      <h3 className="font-semibold text-base text-foreground mb-1.5">Pronto para começar</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Coloque uma pergunta relacionada com o curso e o assistente responderá com base nos materiais de formação.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 justify-center max-w-sm">
        {['Fases da negociação', 'Técnicas de fecho', 'Proposta de valor'].map((q) => (
          <span
            key={q}
            className="text-[11px] px-3 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 font-medium"
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}
