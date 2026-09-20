import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Factory,
  TrendingUp,
  Boxes,
  Calculator,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  TreePine,
  ArrowRight,
  Sparkles,
  BarChart3,
  Percent,
  Truck,
  RotateCcw,
  Download,
  Share2,
  FileText
} from 'lucide-react';
import { Budget, Client, YardBatch, WoodInventoryItem } from '../types';

interface CompleteModeModuleProps {
  budgets: Budget[];
  clients: Client[];
  onStartNewBudget: () => void;
  onNavigateToTab: (tabId: string) => void;
  onAddLog: (msg: string) => void;
  onTriggerNotification: (msg: string) => void;
}

// Lotes de pátio iniciais realistas para a serraria
const INITIAL_BATCHES: YardBatch[] = [
  {
    id: 'batch-1',
    batchNumber: 'LOTE-2026-08',
    entryDate: '12/09/2026',
    supplier: 'Manejo Florestal Sustentável Rondônia',
    documentType: 'DOF',
    documentNumber: 'DOF-BR-994218',
    species: 'Ipê Amarelo',
    logsCount: 14,
    grossVolumeM3: 42.85,
    totalCost: 38565.0,
    costPerM3: 900.0,
    status: 'No Pátio',
    notes: 'Toras retas, diâmetro médio de 48cm, ótima densidade.',
  },
  {
    id: 'batch-2',
    batchNumber: 'LOTE-2026-07',
    entryDate: '08/09/2026',
    supplier: 'Reflorestamento & Agrofloresta Brasil',
    documentType: 'Guia Florestal',
    documentNumber: 'GF-MT-31089',
    species: 'Cumaru Ferro',
    logsCount: 18,
    grossVolumeM3: 56.2,
    totalCost: 44960.0,
    costPerM3: 800.0,
    status: 'Em Desdobro',
    notes: 'Destinado para assoalhos e decks de alta resistência.',
  },
  {
    id: 'batch-3',
    batchNumber: 'LOTE-2026-06',
    entryDate: '01/09/2026',
    supplier: 'Serraria & Madeiras Vale Verde',
    documentType: 'Nota Fiscal',
    documentNumber: 'NF-e 004.812',
    species: 'Jatobá',
    logsCount: 22,
    grossVolumeM3: 68.4,
    totalCost: 51300.0,
    costPerM3: 750.0,
    status: 'Processado 100%',
    notes: 'Aproveitamento de 61.2% obtido em vigas e pranchas.',
  },
];

// Estoque inicial consolidado de madeira
const INITIAL_INVENTORY: WoodInventoryItem[] = [
  {
    id: 'inv-1',
    species: 'Ipê Tabaco',
    woodType: 'Prancha',
    volumeM3: 14.5,
    piecesCount: 185,
    averagePricePerM3: 3200.0,
    storageLocation: 'Galpão 01 - Baia A',
    drynessState: 'Seca ao Ar (AD)',
    minAlertM3: 5.0,
  },
  {
    id: 'inv-2',
    species: 'Cumaru',
    woodType: 'Viga',
    volumeM3: 22.8,
    piecesCount: 210,
    averagePricePerM3: 2900.0,
    storageLocation: 'Galpão 01 - Baia B',
    drynessState: 'Seca em Estufa (KD)',
    minAlertM3: 8.0,
  },
  {
    id: 'inv-3',
    species: 'Jatobá',
    woodType: 'Tábua',
    volumeM3: 8.4,
    piecesCount: 320,
    averagePricePerM3: 2400.0,
    storageLocation: 'Galpão 02 - Prateleira 4',
    drynessState: 'Seca ao Ar (AD)',
    minAlertM3: 4.0,
  },
  {
    id: 'inv-4',
    species: 'Garapeira',
    woodType: 'Caibro / Ripa',
    volumeM3: 12.1,
    piecesCount: 450,
    averagePricePerM3: 2100.0,
    storageLocation: 'Galpão 02 - Prateleira 1',
    drynessState: 'Verde',
    minAlertM3: 6.0,
  },
  {
    id: 'inv-5',
    species: 'Eucalipto Tratado',
    woodType: 'Pontalete',
    volumeM3: 18.0,
    piecesCount: 500,
    averagePricePerM3: 1100.0,
    storageLocation: 'Pátio Aberto - Setor C',
    drynessState: 'Seca ao Ar (AD)',
    minAlertM3: 10.0,
  },
];

export const CompleteModeModule: React.FC<CompleteModeModuleProps> = ({
  budgets,
  clients,
  onStartNewBudget,
  onNavigateToTab,
  onAddLog,
  onTriggerNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'rendimento' | 'lotes' | 'precificacao' | 'estoque'>('dashboard');

  // Estado de Lotes de Pátio com persistência local
  const [batches, setBatches] = useState<YardBatch[]>(() => {
    try {
      const saved = localStorage.getItem('sawmill_yard_batches');
      return saved ? JSON.parse(saved) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  // Estado de Estoque Físico
  const [inventory, setInventory] = useState<WoodInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sawmill_wood_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Modal para adicionar novo lote
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<YardBatch>>({
    batchNumber: '',
    entryDate: new Date().toLocaleDateString('pt-BR'),
    supplier: '',
    documentType: 'DOF',
    documentNumber: '',
    species: 'Ipê',
    logsCount: 10,
    grossVolumeM3: 30.0,
    costPerM3: 850.0,
    status: 'No Pátio',
    notes: '',
  });

  // Simulador de Rendimento de Desdobro
  const [simInputLogM3, setSimInputLogM3] = useState<number>(10.0);
  const [simKerfMm, setSimKerfMm] = useState<number>(3.2); // Fita de serra mm
  const [simRecoveryRate, setSimRecoveryRate] = useState<number>(58.0); // 58% média nacional
  const [simLogCostPerM3, setSimLogCostPerM3] = useState<number>(850.0);
  const [simSawingCostHour, setSimSawingCostHour] = useState<number>(180.0);
  const [simHoursNeeded, setSimHoursNeeded] = useState<number>(4.0);

  // Simulador de Markup e Formação de Preço
  const [markupWoodCost, setMarkupWoodCost] = useState<number>(900.0);
  const [markupSawingCost, setMarkupSawingCost] = useState<number>(250.0);
  const [markupFreight, setMarkupFreight] = useState<number>(120.0);
  const [markupLossRate, setMarkupLossRate] = useState<number>(42.0); // Perda de 42% = 58% aproveitamento
  const [markupTaxRate, setMarkupTaxRate] = useState<number>(6.0); // Simples Nacional 6%
  const [markupProfitMargin, setMarkupProfitMargin] = useState<number>(35.0); // Margem líquida 35%

  // Salvar lotes e estoque no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sawmill_yard_batches', JSON.stringify(batches));
    } catch (e) {
      console.error(e);
    }
  }, [batches]);

  useEffect(() => {
    try {
      localStorage.setItem('sawmill_wood_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.error(e);
    }
  }, [inventory]);

  // Cálculos do Dashboard Executivo
  const totalFaturado = budgets
    .filter(b => b.status === 'Vendido')
    .reduce((acc, b) => acc + b.total, 0);

  const totalEmNegociacao = budgets
    .filter(b => b.status === 'Aguardando Cliente' || b.status === 'Confirmado')
    .reduce((acc, b) => acc + b.total, 0);

  const totalOrcadoGeral = budgets.reduce((acc, b) => acc + b.total, 0);
  const totalVolumeVendidoM3 = budgets
    .filter(b => b.status === 'Vendido')
    .reduce((acc, b) => {
      const itemsM3 = b.items
        .filter(i => i.unit === 'M3' || i.unit === 'M3_BLOCO')
        .reduce((sum, item) => sum + item.quantity, 0);
      return acc + itemsM3;
    }, 0);

  const totalEstoqueM3 = inventory.reduce((sum, item) => sum + item.volumeM3, 0);
  const totalPatrimonioEstoque = inventory.reduce((sum, item) => sum + (item.volumeM3 * item.averagePricePerM3), 0);
  const totalTorasNoPatioM3 = batches
    .filter(b => b.status === 'No Pátio' || b.status === 'Em Desdobro')
    .reduce((sum, b) => sum + b.grossVolumeM3, 0);

  // Cálculos do Simulador de Rendimento
  const recoveredLumberM3 = (simInputLogM3 * simRecoveryRate) / 100;
  const sawdustM3 = (simInputLogM3 * (simKerfMm * 4.5)) / 100; // perda proporcional ao traço
  const slabsM3 = Math.max(0, simInputLogM3 - recoveredLumberM3 - sawdustM3);
  const totalSawingOperationalCost = simSawingCostHour * simHoursNeeded;
  const rawLogsTotalCost = simInputLogM3 * simLogCostPerM3;
  const totalProcessingCost = rawLogsTotalCost + totalSawingOperationalCost;
  const costPerRecoveredM3 = recoveredLumberM3 > 0 ? totalProcessingCost / recoveredLumberM3 : 0;

  // Cálculos de Formação de Preço (Markup)
  // Custo base real considerando o fator de perda de corte:
  // Se aproveitamento é 58% (perda 42%), 1m³ de madeira serrada requer (1 / (1 - perda)) de tora bruta
  const grossLogsNeededPerM3 = 1 / Math.max(0.1, (1 - (markupLossRate / 100)));
  const effectiveWoodCost = markupWoodCost * grossLogsNeededPerM3;
  const directCostsM3 = effectiveWoodCost + markupSawingCost + markupFreight;
  // Preço de venda com impostos e margem: Preço = Custo / (1 - (Impostos% + Margem%))
  const marginAndTaxesFactor = 1 - ((markupTaxRate + markupProfitMargin) / 100);
  const suggestedPriceM3 = marginAndTaxesFactor > 0 ? directCostsM3 / marginAndTaxesFactor : directCostsM3 * 2;
  const grossProfitPerM3 = suggestedPriceM3 - directCostsM3 - (suggestedPriceM3 * (markupTaxRate / 100));

  // Handler para adicionar lote
  const handleSaveBatch = () => {
    if (!newBatch.batchNumber || !newBatch.species) {
      onTriggerNotification('Preencha o número do lote e a espécie!');
      return;
    }

    const volume = Number(newBatch.grossVolumeM3) || 1;
    const costM3 = Number(newBatch.costPerM3) || 0;
    const total = volume * costM3;

    const item: YardBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: newBatch.batchNumber || `LOTE-${Date.now().toString().slice(-4)}`,
      entryDate: newBatch.entryDate || new Date().toLocaleDateString('pt-BR'),
      supplier: newBatch.supplier || 'Fornecedor Registrado',
      documentType: newBatch.documentType || 'DOF',
      documentNumber: newBatch.documentNumber || 'S/N',
      species: newBatch.species || 'Madeira Nativa',
      logsCount: Number(newBatch.logsCount) || 1,
      grossVolumeM3: volume,
      totalCost: total,
      costPerM3: costM3,
      status: (newBatch.status as any) || 'No Pátio',
      notes: newBatch.notes || '',
    };

    setBatches(prev => [item, ...prev]);
    setShowNewBatchModal(false);
    onAddLog(`Lote de carga ${item.batchNumber} (${item.species}) registrado no pátio.`);
    onTriggerNotification(`✅ Lote ${item.batchNumber} adicionado ao pátio!`);
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in font-sans">
      {/* Top Banner de Identificação do Modo Completo */}
      <div className="bg-gradient-to-r from-indigo-950 via-neutral-900 to-neutral-950 border-2 border-indigo-500/80 p-4 sm:p-5 rounded-3xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-950/50 shrink-0">
            <Factory className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                Modo Completo (Serraria Pro)
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                Gestão Industrial
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-medium mt-0.5">
              Controle de faturamento, rendimento de desdobro, lotes de toras com DOF e estoque em m³
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onStartNewBudget}
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Novo Orçamento</span>
          </button>
        </div>
      </div>

      {/* Navegação por Sub-abas do Modo Completo */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-800">
        {[
          { id: 'dashboard', label: 'Painel Executivo & DRE', icon: BarChart3 },
          { id: 'rendimento', label: 'Rendimento de Desdobro', icon: Percent },
          { id: 'lotes', label: 'Lotes de Pátio & DOF', icon: Truck },
          { id: 'precificacao', label: 'Formação de Preço (Markup)', icon: DollarSign },
          { id: 'estoque', label: 'Estoque de Madeira (m³)', icon: Boxes },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer select-none border-b-2 ${
                isSelected
                  ? 'bg-neutral-900 text-indigo-300 border-indigo-500 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-neutral-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD EXECUTIVO & DRE SINTÉTICO */}
      {/* ========================================================================= */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-5 animate-fade-in">
          {/* Métricas Principais da Serraria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Faturamento Confirmado */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Vendas Faturadas</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block tracking-tight">
                  R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                  {budgets.filter(b => b.status === 'Vendido').length} orçamentos concluídos
                </span>
              </div>
            </div>

            {/* Em Negociação */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Pipeline / Negociação</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 block tracking-tight">
                  R$ {totalEmNegociacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                  Propostas ativas aguardando resposta
                </span>
              </div>
            </div>

            {/* Madeira em Toras no Pátio */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Toras no Pátio (Bruto)</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <TreePine className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-300 block tracking-tight">
                  {totalTorasNoPatioM3.toFixed(2)} m³
                </span>
                <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                  Aguardando ou em processo de desdobro
                </span>
              </div>
            </div>

            {/* Valor do Estoque de Madeira Serrada */}
            <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase">
                <span>Patrimônio em Estoque</span>
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Boxes className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-blue-300 block tracking-tight">
                  R$ {totalPatrimonioEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                  {totalEstoqueM3.toFixed(2)} m³ de madeira serrada estocada
                </span>
              </div>
            </div>
          </div>

          {/* DRE Sintético da Serraria & Funil Comercial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* DRE Operacional Sintético */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      DRE Sintético Operacional (Estimado)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Consolidado</span>
                </div>

                <div className="space-y-3 mt-4 text-xs font-mono">
                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-zinc-300 font-bold">(+) Receita Bruta de Vendas</span>
                    <span className="text-emerald-400 font-black">
                      R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-zinc-400 font-medium">(-) Impostos s/ Faturamento (Simples ~6%)</span>
                    <span className="text-rose-400 font-bold">
                      - R$ {(totalFaturado * 0.06).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-zinc-400 font-medium">(-) Custo da Madeira Serrada (~45%)</span>
                    <span className="text-rose-400 font-bold">
                      - R$ {(totalFaturado * 0.45).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-neutral-900">
                    <span className="text-zinc-400 font-medium">(-) Custos Operacionais & Serragem (~18%)</span>
                    <span className="text-rose-400 font-bold">
                      - R$ {(totalFaturado * 0.18).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-sm bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                    <span className="text-emerald-300 font-black uppercase">(=) Margem Operacional Líquida</span>
                    <span className="text-emerald-400 font-black">
                      R$ {(totalFaturado * 0.31).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (31%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-850 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Baseado nos orçamentos com status "Vendido"</span>
                <span className="text-emerald-400 font-bold">Alta Rentabilidade</span>
              </div>
            </div>

            {/* Funil Comercial & Status */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                      Funil Comercial de Orçamentos
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Total: {budgets.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                  {[
                    { label: 'Rascunho', status: 'Rascunho', color: 'text-zinc-300 border-zinc-700 bg-zinc-900/50' },
                    { label: 'Aguardando', status: 'Aguardando Cliente', color: 'text-amber-300 border-amber-800/60 bg-amber-950/20' },
                    { label: 'Confirmado', status: 'Confirmado', color: 'text-blue-300 border-blue-800/60 bg-blue-950/20' },
                    { label: 'Vendido', status: 'Vendido', color: 'text-emerald-300 border-emerald-800/60 bg-emerald-950/20' },
                  ].map(step => {
                    const count = budgets.filter(b => b.status === step.status).length;
                    const val = budgets.filter(b => b.status === step.status).reduce((s, b) => s + b.total, 0);
                    return (
                      <div key={step.status} className={`p-3 rounded-xl border ${step.color} flex flex-col justify-between`}>
                        <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">{step.label}</span>
                        <div className="mt-2">
                          <span className="text-xl font-black font-mono block">{count}</span>
                          <span className="text-[10px] font-mono opacity-90 block mt-0.5 truncate">
                            R$ {(val / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs text-zinc-300 flex items-center justify-between">
                  <span>Taxa de Conversão da Serraria:</span>
                  <strong className="text-emerald-400 font-mono text-sm font-black">
                    {budgets.length > 0
                      ? `${Math.round((budgets.filter(b => b.status === 'Vendido').length / budgets.length) * 100)}%`
                      : '0%'}
                  </strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-850 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => onNavigateToTab('budgets')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Gerenciar todos os orçamentos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CALCULADORA INDUSTRIAL DE RENDIMENTO DE DESDOBRO (Tora -> Pranchas) */}
      {/* ========================================================================= */}
      {activeSubTab === 'rendimento' && (
        <div className="bg-neutral-950 p-5 sm:p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Percent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Calculadora de Rendimento de Desdobro Florestal
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Simule o aproveitamento real da tora bruta ao serrar pranchas, vigas e tábuas, calculando perdas e custo efetivo por m³.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-900/60 text-amber-300 px-3 py-1 rounded-xl border border-amber-700/50 font-mono font-bold">
                Média Brasil: 55% a 62%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parâmetros de Entrada */}
            <div className="bg-neutral-900/70 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block pb-2 border-b border-neutral-800">
                1. Parâmetros da Tora & Serra Fita
              </span>

              {/* Volume de Toras de Entrada */}
              <div>
                <label className="text-xs text-zinc-200 font-bold block mb-1.5">
                  Volume de Tora Bruta de Entrada (m³)
                </label>
                <input
                  type="number"
                  value={simInputLogM3}
                  onChange={e => setSimInputLogM3(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2.5 px-3.5 font-mono text-base text-amber-400 outline-none font-bold"
                />
              </div>

              {/* Taxa de Rendimento Estimada */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-zinc-200 font-bold">
                    Taxa de Rendimento / Aproveitamento (%)
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-400">{simRecoveryRate}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="75"
                  step="0.5"
                  value={simRecoveryRate}
                  onChange={e => setSimRecoveryRate(parseFloat(e.target.value) || 58)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>40% (Baixo/Torta)</span>
                  <span className="text-amber-400 font-bold">58% (Padrão)</span>
                  <span>75% (Excelente/Reta)</span>
                </div>
              </div>

              {/* Espessura do Traço da Serra (Kerf) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1.5">
                    Traço de Serra (Kerf mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={simKerfMm}
                    onChange={e => setSimKerfMm(parseFloat(e.target.value) || 3.2)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-xs text-zinc-200 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1.5">
                    Custo da Tora (R$/m³)
                  </label>
                  <input
                    type="number"
                    value={simLogCostPerM3}
                    onChange={e => setSimLogCostPerM3(parseFloat(e.target.value) || 850)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-xs text-zinc-200 outline-none font-bold"
                  />
                </div>
              </div>

              {/* Custos Operacionais de Máquina */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1.5">
                    Custo Hora Serra (R$/h)
                  </label>
                  <input
                    type="number"
                    value={simSawingCostHour}
                    onChange={e => setSimSawingCostHour(parseFloat(e.target.value) || 180)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-xs text-zinc-200 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1.5">
                    Horas para Serrar Lote
                  </label>
                  <input
                    type="number"
                    value={simHoursNeeded}
                    onChange={e => setSimHoursNeeded(parseFloat(e.target.value) || 4)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-xs text-zinc-200 outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Balanço de Massa e Custo do Desdobro */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="bg-neutral-900/70 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block pb-2 border-b border-neutral-800">
                  2. Balanço Físico de Madeira Obtida
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-emerald-500/40 text-center">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase block">Madeira Útil</span>
                    <strong className="text-lg font-mono text-emerald-400 font-black block mt-1">
                      {recoveredLumberM3.toFixed(2)} m³
                    </strong>
                    <span className="text-[10px] text-zinc-400 font-mono">({simRecoveryRate}%)</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-amber-700/40 text-center">
                    <span className="text-[10px] text-amber-300 font-bold uppercase block">Costaneiras</span>
                    <strong className="text-lg font-mono text-amber-400 font-black block mt-1">
                      {slabsM3.toFixed(2)} m³
                    </strong>
                    <span className="text-[10px] text-zinc-400 font-mono">Subproduto</span>
                  </div>

                  <div className="bg-neutral-950 p-3 rounded-xl border border-zinc-700 text-center">
                    <span className="text-[10px] text-zinc-300 font-bold uppercase block">Serragem</span>
                    <strong className="text-lg font-mono text-zinc-300 font-black block mt-1">
                      {sawdustM3.toFixed(2)} m³
                    </strong>
                    <span className="text-[10px] text-zinc-400 font-mono">Perda corte</span>
                  </div>
                </div>

                {/* Gráfico de Barra Proporcional */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] text-zinc-400 font-medium">Distribuição Percentual:</span>
                  <div className="w-full h-4 bg-neutral-950 rounded-full overflow-hidden flex border border-neutral-800">
                    <div style={{ width: `${simRecoveryRate}%` }} className="bg-emerald-500" title="Madeira Serrada" />
                    <div style={{ width: `${(slabsM3 / simInputLogM3) * 100}%` }} className="bg-amber-500" title="Costaneiras" />
                    <div style={{ width: `${(sawdustM3 / simInputLogM3) * 100}%` }} className="bg-neutral-600" title="Serragem" />
                  </div>
                </div>
              </div>

              {/* Custo Efetivo Real do m³ Serrado */}
              <div className="bg-gradient-to-br from-indigo-950/80 to-neutral-900 p-5 rounded-2xl border-2 border-indigo-500/80 shadow-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-black tracking-wider text-indigo-300">
                    Custo Efetivo Real de Produção
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded">
                    Por m³ Serrado
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                    R$ {costPerRecoveredM3.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-zinc-300 font-mono">/ m³ útil</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  A tora bruta custou R$ {simLogCostPerM3}/m³, mas devido à perda de corte ({100 - simRecoveryRate}%) e aos custos de máquina (R$ {totalSawingOperationalCost.toFixed(0)}), seu custo real de base para orçar é de <strong>R$ {costPerRecoveredM3.toFixed(2)}/m³</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOTES DE PÁTIO & DOCUMENTO DE ORIGEM FLORESTAL (DOF) */}
      {/* ========================================================================= */}
      {activeSubTab === 'lotes' && (
        <div className="bg-neutral-950 p-5 sm:p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Truck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Gestão de Lotes de Pátio & Documentos Florestais (DOF)
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Cadastre e rastreie cargas recebidas de toras brutas com número de Guia Florestal e volume oficial.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewBatchModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Nova Carga / Lote</span>
            </button>
          </div>

          {/* Lista de Lotes */}
          <div className="space-y-3">
            {batches.map(batch => (
              <div
                key={batch.id}
                className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors font-mono text-xs"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-black text-white text-sm">{batch.batchNumber}</span>
                    <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
                      {batch.documentType}: {batch.documentNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      batch.status === 'No Pátio'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        : batch.status === 'Em Desdobro'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/50'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                  <span className="text-zinc-300 font-sans text-xs">
                    Espécie: <strong className="text-amber-400 font-bold">{batch.species}</strong> | {batch.logsCount} toras | Fornecedor: {batch.supplier}
                  </span>
                  {batch.notes && (
                    <span className="text-zinc-500 text-[11px] font-sans italic">{batch.notes}</span>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-black text-emerald-400 block font-mono">
                      {batch.grossVolumeM3.toFixed(2)} m³
                    </span>
                    <span className="text-[11px] text-zinc-400 block font-mono">
                      R$ {batch.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (@ R$ {batch.costPerM3}/m³)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBatches(prev => prev.filter(b => b.id !== batch.id));
                      onAddLog(`Lote ${batch.batchNumber} removido do pátio.`);
                      onTriggerNotification('Lote removido!');
                    }}
                    className="text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Excluir lote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FORMAÇÃO DE PREÇO & MARKUP INDUSTRIAL */}
      {/* ========================================================================= */}
      {activeSubTab === 'precificacao' && (
        <div className="bg-neutral-950 p-5 sm:p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <DollarSign className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Formador de Preço de Venda (Markup & Margens)
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Calcule o preço justo de venda por metro cúbico serrado, cobrindo perda de corte, frete, impostos e garantindo sua margem de lucro.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Variáveis de Custo */}
            <div className="bg-neutral-900/70 p-5 rounded-2xl border border-neutral-800 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-200 block pb-2 border-b border-neutral-800">
                1. Custos Diretos & Despesas por m³
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Custo da Tora Bruta (R$/m³)
                  </label>
                  <input
                    type="number"
                    value={markupWoodCost}
                    onChange={e => setMarkupWoodCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-amber-400 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Perda Estimada no Corte (%)
                  </label>
                  <input
                    type="number"
                    value={markupLossRate}
                    onChange={e => setMarkupLossRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-zinc-200 font-bold outline-none"
                  />
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Ex: 42% de perda = 58% útil</span>
                </div>

                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Mão de Obra / Serragem (R$/m³)
                  </label>
                  <input
                    type="number"
                    value={markupSawingCost}
                    onChange={e => setMarkupSawingCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-zinc-200 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Frete / Carga de Pátio (R$/m³)
                  </label>
                  <input
                    type="number"
                    value={markupFreight}
                    onChange={e => setMarkupFreight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-zinc-200 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Alíquota de Impostos (%)
                  </label>
                  <input
                    type="number"
                    value={markupTaxRate}
                    onChange={e => setMarkupTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-zinc-200 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-200 font-bold block mb-1">
                    Margem Líquida Almejada (%)
                  </label>
                  <input
                    type="number"
                    value={markupProfitMargin}
                    onChange={e => setMarkupProfitMargin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2 px-3 font-mono text-sm text-emerald-400 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Resultado do Preço Sugerido */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-neutral-900 to-neutral-950 p-6 rounded-2xl border-2 border-emerald-500/80 shadow-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block pb-2 border-b border-neutral-800">
                  2. Preço de Venda Recomendado
                </span>

                <div className="mt-4">
                  <span className="text-xs text-zinc-400 font-medium block">Preço de Venda Sugerido por m³:</span>
                  <span className="text-3xl sm:text-5xl font-black font-mono text-emerald-400 block mt-1 tracking-tight">
                    R$ {suggestedPriceM3.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-neutral-800 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Custo Efetivo de Matéria-Prima:</span>
                    <strong className="text-zinc-200">R$ {effectiveWoodCost.toFixed(2)}/m³</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Custos Operacionais + Frete:</span>
                    <strong className="text-zinc-200">R$ {(markupSawingCost + markupFreight).toFixed(2)}/m³</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Impostos Estimados ({markupTaxRate}%):</span>
                    <strong className="text-rose-400">- R$ {(suggestedPriceM3 * (markupTaxRate / 100)).toFixed(2)}/m³</strong>
                  </div>
                  <div className="flex justify-between text-emerald-300 font-bold pt-1 border-t border-neutral-800">
                    <span>Lucro Líquido Real Estimado:</span>
                    <strong className="text-emerald-400">R$ {grossProfitPerM3.toFixed(2)}/m³ ({markupProfitMargin}%)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={() => {
                    onAddLog(`Preço de referência de R$ ${suggestedPriceM3.toFixed(2)}/m³ calculado com sucesso.`);
                    onTriggerNotification(`💡 Preço sugerido: R$ ${suggestedPriceM3.toFixed(2)}/m³`);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Usar este Preço como Base Comercial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONTROLE DE ESTOQUE FÍSICO DE MADEIRA (m³ & PEÇAS) */}
      {/* ========================================================================= */}
      {activeSubTab === 'estoque' && (
        <div className="bg-neutral-950 p-5 sm:p-6 rounded-3xl border border-neutral-800 shadow-2xl space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <Boxes className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Controle Físico de Estoque de Madeira
                </h3>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-1">
                Monitore o volume em m³, contagem de peças por bitola e valor imobilizado por galpão.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-zinc-400 block uppercase">Total no Pátio</span>
              <strong className="text-lg font-mono text-blue-400 font-black">
                {totalEstoqueM3.toFixed(2)} m³ | R$ {(totalPatrimonioEstoque / 1000).toFixed(1)}k
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            {inventory.map(item => {
              const isLow = item.volumeM3 <= item.minAlertM3;
              return (
                <div
                  key={item.id}
                  className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-black text-white text-sm">{item.species}</span>
                      <span className="bg-neutral-950 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        {item.woodType}
                      </span>
                      <span className="bg-neutral-950 text-zinc-300 border border-neutral-800 px-2 py-0.5 rounded text-[10px]">
                        {item.drynessState}
                      </span>
                      {isLow && (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Estoque Baixo</span>
                        </span>
                      )}
                    </div>
                    <span className="text-zinc-400 font-sans text-xs">
                      Localização: <strong className="text-zinc-200">{item.storageLocation}</strong> | {item.piecesCount} peças
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    <div className="text-left sm:text-right">
                      <span className="text-sm font-black text-blue-300 block font-mono">
                        {item.volumeM3.toFixed(2)} m³
                      </span>
                      <span className="text-[11px] text-zinc-400 block font-mono">
                        R$ {(item.volumeM3 * item.averagePricePerM3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setInventory(prev => prev.map(i => i.id === item.id ? { ...i, volumeM3: Math.max(0, i.volumeM3 - 1) } : i));
                        }}
                        className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-zinc-300 font-black flex items-center justify-center cursor-pointer"
                        title="Diminuir 1 m³"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInventory(prev => prev.map(i => i.id === item.id ? { ...i, volumeM3: i.volumeM3 + 1 } : i));
                        }}
                        className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-zinc-300 font-black flex items-center justify-center cursor-pointer"
                        title="Adicionar 1 m³"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL PARA REGISTRAR NOVA CARGA / LOTE DE PÁTIO */}
      {showNewBatchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white font-sans uppercase tracking-wide">
                Registrar Nova Carga de Toras
              </h3>
              <button
                type="button"
                onClick={() => setShowNewBatchModal(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Identificação do Lote</label>
                  <input
                    type="text"
                    value={newBatch.batchNumber}
                    onChange={e => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                    placeholder="Ex: LOTE-2026-09"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Espécie da Madeira</label>
                  <input
                    type="text"
                    value={newBatch.species}
                    onChange={e => setNewBatch({ ...newBatch, species: e.target.value })}
                    placeholder="Ex: Ipê Amarelo"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Tipo de Documento</label>
                  <select
                    value={newBatch.documentType}
                    onChange={e => setNewBatch({ ...newBatch, documentType: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                  >
                    <option value="DOF">DOF (Documento de Origem)</option>
                    <option value="Guia Florestal">Guia Florestal (GF)</option>
                    <option value="Nota Fiscal">Nota Fiscal (NF-e)</option>
                    <option value="Romaneio Próprio">Romaneio Próprio</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Número do Documento</label>
                  <input
                    type="text"
                    value={newBatch.documentNumber}
                    onChange={e => setNewBatch({ ...newBatch, documentNumber: e.target.value })}
                    placeholder="Ex: DOF-BR-12345"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Nº de Toras</label>
                  <input
                    type="number"
                    value={newBatch.logsCount}
                    onChange={e => setNewBatch({ ...newBatch, logsCount: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Volume (m³)</label>
                  <input
                    type="number"
                    value={newBatch.grossVolumeM3}
                    onChange={e => setNewBatch({ ...newBatch, grossVolumeM3: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-bold block mb-1">Custo (R$/m³)</label>
                  <input
                    type="number"
                    value={newBatch.costPerM3}
                    onChange={e => setNewBatch({ ...newBatch, costPerM3: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-bold block mb-1">Fornecedor / Origem</label>
                <input
                  type="text"
                  value={newBatch.supplier}
                  onChange={e => setNewBatch({ ...newBatch, supplier: e.target.value })}
                  placeholder="Nome da fazenda ou madeireira fornecedora"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-zinc-200 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNewBatchModal(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-700 text-zinc-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveBatch}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Salvar Carga no Pátio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
