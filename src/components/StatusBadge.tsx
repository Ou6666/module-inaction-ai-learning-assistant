import type { ConnectionStatus } from '@/types/chat';

const statusConfig: Record<ConnectionStatus, { dotClass: string; label: string }> = {
  'não configurado': { dotClass: 'bg-status-unconfigured', label: 'Não configurado' },
  'pronto': { dotClass: 'bg-status-ready', label: 'Pronto' },
  'a enviar': { dotClass: 'bg-status-sending animate-pulse', label: 'A enviar...' },
  'erro': { dotClass: 'bg-status-error', label: 'Erro' },
};

export function StatusBadge({ status }: { status: ConnectionStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted/70 text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}
