import { useEffect, useState } from 'react';
import { Settings, Trash2, Download, Copy, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/StatusBadge';
import type { SessionConfig, ConnectionStatus, ChatMessage } from '@/types/chat';
import { isWebhookConfigured } from '@/services/webhook';
import { exportAsJson, exportAsTxt } from '@/services/export';
import { resetAll } from '@/services/storage';
import { toast } from 'sonner';

interface ConfigPanelProps {
  config: SessionConfig;
  onChange: (config: SessionConfig) => void;
  connectionStatus: ConnectionStatus;
  messages: ChatMessage[];
  onClearChat: () => void;
}

export function ConfigPanel({ config, onChange, connectionStatus, messages, onClearChat }: ConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => { setLocalConfig(config); }, [config]);

  const update = (patch: Partial<SessionConfig>) => {
    const next = { ...localConfig, ...patch };
    setLocalConfig(next);
    onChange(next);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(localConfig, null, 2));
    toast.success('Configuração copiada!');
  };

  const handleReset = () => {
    resetAll();
    window.location.reload();
  };

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary">
            <Settings className="h-3.5 w-3.5 text-foreground" />
          </div>
          <span className="text-sm font-semibold">Configuração</span>
        </div>
        <StatusBadge status={connectionStatus} />
      </div>

      <div className="p-4 space-y-3">
        <Field label="URL do Webhook" id="webhookUrl">
          <Input
            id="webhookUrl"
            placeholder="https://seu-n8n.app.n8n.cloud/webhook/..."
            value={localConfig.webhookUrl}
            onChange={(e) => update({ webhookUrl: e.target.value })}
            className="text-xs h-8 font-mono"
          />
          {localConfig.webhookUrl && !isWebhookConfigured(localConfig.webhookUrl) && (
            <p className="text-[10px] text-destructive mt-0.5">URL inválido</p>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="ID da Sessão" id="sessionId">
            <Input id="sessionId" value={localConfig.sessionId} onChange={(e) => update({ sessionId: e.target.value })} className="text-xs h-8 font-mono" />
          </Field>
          <Field label="ID do Utilizador" id="userId">
            <Input id="userId" value={localConfig.userId} onChange={(e) => update({ userId: e.target.value })} className="text-xs h-8" />
          </Field>
        </div>

        <Field label="Chave API (opcional)" id="apiKey">
          <Input id="apiKey" type="password" placeholder="x-api-key" value={localConfig.apiKey} onChange={(e) => update({ apiKey: e.target.value })} className="text-xs h-8" />
        </Field>

        <Field label="Curso atual" id="course">
          <Input id="course" value={localConfig.course} onChange={(e) => update({ course: e.target.value })} className="text-xs h-8" />
        </Field>

        <Field label="Notas para o teste" id="notes">
          <Textarea id="notes" value={localConfig.notes} onChange={(e) => update({ notes: e.target.value })} className="text-xs min-h-[72px]" />
        </Field>

        <Separator className="my-1" />

        {/* Demo tip */}
        <div className="p-3 rounded-xl bg-hint border border-hint-foreground/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-hint-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-hint-foreground/80 leading-relaxed">
              <span className="font-semibold text-hint-foreground">Dica:</span> No modo Chat, pergunte "Quais são as fases da negociação comercial?". No modo Role Play, responda como representante de vendas ao cliente AI.
            </p>
          </div>
        </div>

        <Separator className="my-1" />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-1.5">
          <ActionBtn icon={Trash2} label="Limpar conversa" onClick={onClearChat} />
          <ActionBtn icon={Copy} label="Copiar config" onClick={handleCopyConfig} />
          <ActionBtn icon={Download} label="Exportar JSON" onClick={() => exportAsJson(config, messages)} />
          <ActionBtn icon={Download} label="Exportar TXT" onClick={() => exportAsTxt(config, messages)} />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-[11px] text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
          onClick={handleReset}
        >
          <RotateCcw className="h-3 w-3 mr-1.5" /> Resetar tudo
        </Button>
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="text-[11px] h-8 justify-start" onClick={onClick}>
      <Icon className="h-3 w-3 mr-1.5" /> {label}
    </Button>
  );
}
