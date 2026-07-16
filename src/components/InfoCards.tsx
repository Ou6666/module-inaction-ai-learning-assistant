import { Target, Link2, MessageSquare } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Objetivo',
    description: 'Testar o chatbot de aprendizagem sem aceder ao n8n. Valide respostas, fontes e comportamento pedagógico.',
    accent: 'from-primary to-accent',
  },
  {
    icon: Link2,
    title: 'Ligação',
    description: 'O frontend envia pedidos HTTP POST para um webhook remoto. Configure o URL no painel de configuração.',
    accent: 'from-accent to-primary',
  },
  {
    icon: MessageSquare,
    title: 'Utilização',
    description: 'Coloque perguntas e valide a clareza, pertinência e citação de fontes. Exporte o registo para análise.',
    accent: 'from-primary to-accent',
  },
];

export function InfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group relative bg-card rounded-xl border border-border/60 p-4 shadow-card hover:shadow-elevated transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.accent} shrink-0`}>
              <card.icon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground mb-0.5">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
