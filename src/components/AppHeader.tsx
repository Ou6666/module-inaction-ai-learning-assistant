import mascotImg from '@/assets/mascot.png';
import { GraduationCap } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/20 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-foreground/15 translate-y-1/2 -translate-x-1/4 blur-2xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/10">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary-foreground">
                  Cegos Fase 3
                </h1>
                <p className="text-primary-foreground/60 text-xs font-medium tracking-wide uppercase">
                  Assistente de Aprendizagem
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/75 text-sm md:text-base max-w-lg leading-relaxed">
              Demonstração do chatbot RAG para formação corporativa — 
              pratique conhecimentos através de perguntas e respostas guiadas.
            </p>
          </div>

          {/* Mascot */}
          <div className="hidden md:block">
            <img
              src={mascotImg}
              alt="Assistente de aprendizagem"
              className="h-28 w-auto animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
