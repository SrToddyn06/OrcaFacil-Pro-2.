import React from 'react';
import { motion } from 'motion/react';
import { Zap, Factory, Check, X, ShieldCheck, ArrowRight, Gauge, Layers, FileSpreadsheet, Sparkles } from 'lucide-react';

interface ModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'easy' | 'complete';
  onSelectMode: (mode: 'easy' | 'complete') => void;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-850 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950 flex items-center justify-center font-black shadow-lg">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-sans">
                Selecione o Modo de Operação
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Alterne a qualquer momento conforme a sua necessidade de trabalho
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Cards Comparison */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* MODO FÁCIL */}
            <div
              onClick={() => {
                onSelectMode('easy');
                onClose();
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group select-none ${
                currentMode === 'easy'
                  ? 'bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-950 border-amber-500 shadow-xl shadow-amber-950/30'
                  : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {currentMode === 'easy' && (
                <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Ativo Agora</span>
                </div>
              )}

              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Operacional de Campo
                </span>
                <h4 className="text-lg font-black text-white font-sans mt-0.5">
                  Modo Fácil
                </h4>
                <p className="text-xs text-zinc-300 font-medium mt-2 leading-relaxed">
                  Projetado para o operador no pátio de toras, balcão rápido ou marceneiro. Telas limpas, botões grandes e zero termos contábeis complexos.
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>3 Botões de toque único na tela inicial</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Cubagem rápida de Toras (Huber) e Pranchas</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Orçamento simplificado para WhatsApp em 3 passos</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Simulador guiado de uso passo a passo</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    currentMode === 'easy'
                      ? 'bg-amber-500 text-neutral-950'
                      : 'bg-neutral-800 text-zinc-300 group-hover:bg-amber-500 group-hover:text-neutral-950'
                  }`}
                >
                  <span>{currentMode === 'easy' ? 'Continuar no Modo Fácil' : 'Usar Modo Fácil'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* MODO COMPLETO */}
            <div
              onClick={() => {
                onSelectMode('complete');
                onClose();
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group select-none ${
                currentMode === 'complete'
                  ? 'bg-gradient-to-b from-indigo-950/40 via-neutral-900 to-neutral-950 border-indigo-500 shadow-xl shadow-indigo-950/30'
                  : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {currentMode === 'complete' && (
                <div className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Ativo Agora</span>
                </div>
              )}

              <div>
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
                  <Factory className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  Gestão Industrial & Comercial
                </span>
                <h4 className="text-lg font-black text-white font-sans mt-0.5">
                  Modo Completo
                </h4>
                <p className="text-xs text-zinc-300 font-medium mt-2 leading-relaxed">
                  Centro de comando para gestores e proprietários de serraria. Métricas de faturamento, aproveitamento de corte, controle de lotes/DOF e estoque em m³.
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Dashboard Executivo & CRM Comercial com DRE</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Calculadora de Rendimento de Desdobro (Tora → Prancha)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Rastreamento de Lotes de Cargas & DOF Florestal</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Formador de Preço de Venda com Margem e Impostos</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Controle de Estoque Físico de Madeira no Pátio</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    currentMode === 'complete'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-neutral-800 text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}
                >
                  <span>{currentMode === 'complete' ? 'Continuar no Modo Completo' : 'Usar Modo Completo'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-850 bg-neutral-900/70 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Todos os dados, orçamentos e romaneios são preservados na troca.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-300 hover:text-white font-bold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
