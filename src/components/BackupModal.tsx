import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Upload, 
  Database, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Package, 
  Users, 
  Receipt, 
  Sparkles, 
  AlertCircle,
  X,
  FileCode,
  HardDrive,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, Client, Budget, YardBatch, WoodInventoryItem } from '../types';
import { 
  downloadProductsCSV, 
  downloadProductsJSON, 
  parseProductsFromCSV, 
  parseProductsFromJSON,
  exportProductsToCSV,
  exportProductsToJSON
} from '../utils/itemBackupHelper';

export interface BackupData {
  version: string;
  exportedAt: string;
  type: 'full_backup' | 'products_only';
  summary: {
    productsCount: number;
    clientsCount: number;
    budgetsCount: number;
    batchesCount?: number;
    inventoryCount?: number;
    torasHistoryCount?: number;
    pranchasHistoryCount?: number;
  };
  products: Product[];
  clients?: Client[];
  budgets?: Budget[];
  yardBatches?: YardBatch[];
  woodInventory?: WoodInventoryItem[];
  torasHistory?: any[];
  pranchasHistory?: any[];
  companyProfile?: Record<string, any>;
}

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  clients: Client[];
  budgets: Budget[];
  yardBatches?: YardBatch[];
  woodInventory?: WoodInventoryItem[];
  torasHistory?: any[];
  pranchasHistory?: any[];
  companyProfile?: Record<string, any>;
  initialTab?: 'export' | 'import';
  initialScope?: 'full_backup' | 'products_only';
  onRestore: (data: {
    products: Product[];
    clients?: Client[];
    budgets?: Budget[];
    yardBatches?: YardBatch[];
    woodInventory?: WoodInventoryItem[];
    torasHistory?: any[];
    pranchasHistory?: any[];
    companyProfile?: Record<string, any>;
    mode: 'replace' | 'merge';
  }) => void;
  onNotify: (msg: string) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  products,
  clients,
  budgets,
  yardBatches = [],
  woodInventory = [],
  torasHistory = [],
  pranchasHistory = [],
  companyProfile,
  initialTab = 'export',
  initialScope = 'products_only',
  onRestore,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [activeScope, setActiveScope] = useState<'full_backup' | 'products_only'>('products_only');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge'); // Padrão seguro: mesclar
  const [pastedContent, setPastedContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Dynamic Loading Animation State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [loadingSuccess, setLoadingSuccess] = useState<boolean>(false);
  const [restoredStats, setRestoredStats] = useState<{ products: number; clients: number; budgets: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Sincroniza com as props de abertura
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setActiveScope(initialScope);
      setPastedContent('');
      setFileContent('');
      setSelectedFile(null);
      setCopySuccess(false);
    } else {
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current = [];
      setIsLoading(false);
      setLoadingSuccess(false);
      setLoadingProgress(0);
      setRestoredStats(null);
    }
  }, [isOpen, initialTab, initialScope]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // Análise em tempo real do conteúdo a ser importado (CSV ou JSON)
  const detectedImportData = useMemo(() => {
    const raw = (fileContent || pastedContent).trim();
    if (!raw) return null;

    // 1. Tenta como JSON
    if (raw.startsWith('{') || raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        let prods: Product[] = [];
        let clis: Client[] | undefined = undefined;
        let buds: Budget[] | undefined = undefined;
        let batches: YardBatch[] | undefined = undefined;
        let inv: WoodInventoryItem[] | undefined = undefined;
        let toras: any[] | undefined = undefined;
        let pranchas: any[] | undefined = undefined;
        let profile: Record<string, any> | undefined = undefined;
        let isFull = false;

        if (Array.isArray(parsed)) {
          const res = parseProductsFromJSON(raw);
          if (res.success) prods = res.products;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.products)) {
            prods = parsed.products;
          }
          if (Array.isArray(parsed.clients) && parsed.clients.length > 0) {
            clis = parsed.clients;
            isFull = true;
          }
          if (Array.isArray(parsed.budgets) && parsed.budgets.length > 0) {
            buds = parsed.budgets;
            isFull = true;
          }
          if (Array.isArray(parsed.yardBatches) && parsed.yardBatches.length > 0) {
            batches = parsed.yardBatches;
            isFull = true;
          }
          if (Array.isArray(parsed.woodInventory) && parsed.woodInventory.length > 0) {
            inv = parsed.woodInventory;
            isFull = true;
          }
          if (Array.isArray(parsed.torasHistory) && parsed.torasHistory.length > 0) {
            toras = parsed.torasHistory;
            isFull = true;
          }
          if (Array.isArray(parsed.pranchasHistory) && parsed.pranchasHistory.length > 0) {
            pranchas = parsed.pranchasHistory;
            isFull = true;
          }
          if (parsed.companyProfile && typeof parsed.companyProfile === 'object') {
            profile = parsed.companyProfile;
            isFull = true;
          }
        }

        const detectedCount = prods.length + (clis?.length || 0) + (buds?.length || 0) + (batches?.length || 0) + (inv?.length || 0) + (toras?.length || 0) + (pranchas?.length || 0);
        if (detectedCount > 0) {
          return {
            format: 'json' as const,
            isFullBackup: isFull,
            products: prods,
            clients: clis,
            budgets: buds,
            yardBatches: batches,
            woodInventory: inv,
            torasHistory: toras,
            pranchasHistory: pranchas,
            companyProfile: profile,
            totalItems: prods.length,
            totalRecords: detectedCount
          };
        }
      } catch (e) {
        // não é json válido, tenta como CSV abaixo
      }
    }

    // 2. Tenta como CSV / Tabela com separador
    const csvResult = parseProductsFromCSV(raw);
    if (csvResult.success && csvResult.products.length > 0) {
      return {
        format: 'csv' as const,
        isFullBackup: false,
        products: csvResult.products,
        clients: undefined,
        budgets: undefined,
        yardBatches: undefined,
        woodInventory: undefined,
        torasHistory: undefined,
        pranchasHistory: undefined,
        companyProfile: undefined,
        totalItems: csvResult.products.length,
        totalRecords: csvResult.products.length
      };
    }

    return {
      format: 'unknown' as const,
      isFullBackup: false,
      products: [],
      clients: undefined,
      budgets: undefined,
      yardBatches: undefined,
      woodInventory: undefined,
      torasHistory: undefined,
      pranchasHistory: undefined,
      companyProfile: undefined,
      totalItems: 0,
      totalRecords: 0,
      error: 'Formato não reconhecido. Use arquivo CSV (Excel) ou JSON do sistema.'
    };
  }, [fileContent, pastedContent]);

  // Download Backup File Completo
  const handleDownloadFullBackup = () => {
    try {
      const data: BackupData = {
        version: '1.0.4',
        exportedAt: new Date().toISOString(),
        type: 'full_backup',
        summary: {
          productsCount: products.length,
          clientsCount: clients.length,
          budgetsCount: budgets.length,
          batchesCount: yardBatches.length,
          inventoryCount: woodInventory.length,
          torasHistoryCount: torasHistory.length,
          pranchasHistoryCount: pranchasHistory.length,
        },
        products,
        clients,
        budgets,
        yardBatches,
        woodInventory,
        torasHistory,
        pranchasHistory,
        companyProfile
      };
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `backup_orcafacil_completo_${dateStr}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onNotify(`✓ Backup completo baixado: "${filename}"`);
    } catch (err) {
      console.error(err);
      onNotify('Erro ao gerar arquivo de backup completo.');
    }
  };

  // Download Itens CSV
  const handleDownloadItemsCSV = () => {
    try {
      const filename = downloadProductsCSV(products);
      onNotify(`✓ Lista de ${products.length} itens baixada em Excel (.CSV): "${filename}"`);
    } catch (err) {
      console.error(err);
      onNotify('Erro ao exportar itens para CSV.');
    }
  };

  // Download Itens JSON
  const handleDownloadItemsJSON = () => {
    try {
      const filename = downloadProductsJSON(products);
      onNotify(`✓ Catálogo de ${products.length} itens baixado em JSON: "${filename}"`);
    } catch (err) {
      console.error(err);
      onNotify('Erro ao exportar itens para JSON.');
    }
  };

  // Copiar itens para Área de Transferência
  const handleCopyItems = (format: 'json' | 'csv') => {
    try {
      const content = format === 'csv' ? exportProductsToCSV(products) : exportProductsToJSON(products);
      navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
      onNotify(`✓ ${format.toUpperCase()} dos itens copiado para a área de transferência!`);
    } catch (err) {
      console.error(err);
      onNotify('Erro ao copiar dados dos itens.');
    }
  };

  // Seleção de Arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text || '');
      setPastedContent(text || '');
    };
    reader.readAsText(file);
  };

  // Executar Restauração com Animação Dinâmica
  const handleExecuteRestore = () => {
    if (!detectedImportData || (detectedImportData.totalRecords || detectedImportData.totalItems) === 0) {
      onNotify('Nenhum dado válido para restauração foi detectado.');
      return;
    }

    const {
      products: incomingProducts,
      clients: incomingClients,
      budgets: incomingBudgets,
      yardBatches: incomingBatches,
      woodInventory: incomingInventory,
      torasHistory: incomingToras,
      pranchasHistory: incomingPranchas,
      companyProfile: incomingProfile
    } = detectedImportData;

    // Inicia Animação de Carregamento Dinâmica
    setIsLoading(true);
    setLoadingProgress(5);
    setLoadingStage('Validando e descompactando dados recebidos...');
    setLoadingSuccess(false);

    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];

    const timer1 = setTimeout(() => {
      setLoadingProgress(35);
      setLoadingStage(`Analisando ${incomingProducts.length} materiais, lotes e romaneios...`);
    }, 300);

    const timer2 = setTimeout(() => {
      setLoadingProgress(70);
      setLoadingStage(`Gravando no banco local (${importMode === 'replace' ? 'Substituição total' : 'Mesclando sem duplicatas'})...`);
    }, 700);

    const timer3 = setTimeout(() => {
      setLoadingProgress(92);
      setLoadingStage('Reindexando buscas, estoque e cálculos em tempo real...');
    }, 1100);

    const timer4 = setTimeout(() => {
      setLoadingProgress(100);
      setLoadingStage('✓ Dados importados e prontos para uso!');
      setLoadingSuccess(true);
      setRestoredStats({
        products: incomingProducts.length,
        clients: incomingClients ? incomingClients.length : 0,
        budgets: incomingBudgets ? incomingBudgets.length : 0
      });

      // Aplica as alterações no estado principal
      onRestore({
        products: incomingProducts,
        clients: incomingClients,
        budgets: incomingBudgets,
        yardBatches: incomingBatches,
        woodInventory: incomingInventory,
        torasHistory: incomingToras,
        pranchasHistory: incomingPranchas,
        companyProfile: incomingProfile,
        mode: importMode
      });

      onNotify(`✓ Backup restaurado com sucesso!`);
    }, 1500);

    timersRef.current = [timer1, timer2, timer3, timer4];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-[120] flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
      <div className="bg-neutral-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Dynamic Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center space-y-6"
            >
              {/* Animated Sawblade Spinner */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-emerald-500/20 to-amber-400/40 blur-xl"
                />

                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                  className="w-28 h-28 text-amber-500 relative flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" className="text-amber-500/40" />
                    <circle cx="50" cy="50" r="36" fill="#18181b" stroke="#f59e0b" strokeWidth="3" />
                    {Array.from({ length: 16 }).map((_, i) => {
                      const angle = (i * 360) / 16;
                      return (
                        <g key={i} transform={`rotate(${angle} 50 50)`}>
                          <polygon points="50,6 55,16 45,16" fill="#f59e0b" />
                        </g>
                      );
                    })}
                    <circle cx="50" cy="50" r="14" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="50" cy="6" fill="#f59e0b" />
                  </svg>
                </motion.div>

                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
                  className="absolute inset-2 border-2 border-dashed border-emerald-400/50 rounded-full pointer-events-none"
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-mono text-xs font-black text-amber-300 drop-shadow">
                    {loadingProgress}%
                  </span>
                </div>
              </div>

              {/* Progress and status message */}
              <div className="w-full max-w-sm space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    {loadingStage}
                  </span>
                  <span className="font-mono font-black text-amber-400">{loadingProgress}%</span>
                </div>

                <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  />
                </div>
              </div>

              {/* Success summary button */}
              {loadingSuccess && restoredStats && (
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-neutral-900/90 border border-emerald-500/40 p-4 rounded-2xl max-w-sm w-full space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-sm uppercase">
                    <Sparkles className="w-5 h-5" />
                    <span>Importação Concluída com Sucesso!</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                      <span className="text-zinc-500 text-[10px] block">Materiais</span>
                      <span className="font-black text-amber-400 text-sm">{restoredStats.products}</span>
                    </div>
                    <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                      <span className="text-zinc-500 text-[10px] block">Clientes</span>
                      <span className="font-black text-emerald-400 text-sm">{restoredStats.clients}</span>
                    </div>
                    <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                      <span className="text-zinc-500 text-[10px] block">Orçamentos</span>
                      <span className="font-black text-purple-400 text-sm">{restoredStats.budgets}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(false);
                      onClose();
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
                  >
                    ✓ Continuar e Ver Catálogo de Itens
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <Package className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                <span>Backup e Importação / Exportação de Itens</span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Materiais salvos, bitolas, preços e catálogo completo da madeireira
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Database Summary Badges */}
        <div className="bg-neutral-950/70 px-4 py-2 border-b border-neutral-850 flex items-center justify-between text-xs flex-wrap gap-2 shrink-0">
          <span className="text-zinc-400 font-bold uppercase text-[10px]">Cadastrados no Dispositivo:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold flex items-center gap-1">
              <Package className="w-3 h-3 text-amber-400" />
              <span>{products.length} Itens / Materiais</span>
            </span>
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>{clients.length} Clientes</span>
            </span>
            <span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold flex items-center gap-1">
              <Receipt className="w-3 h-3 text-purple-400" />
              <span>{budgets.length} Orçamentos</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-neutral-950 border-b border-neutral-850 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'export'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-neutral-900'
            }`}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Exportar Itens / Backup</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'import'
                ? 'bg-emerald-500 text-neutral-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-neutral-900'
            }`}
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Importar / Restaurar Itens</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'export' ? (
            <div className="space-y-4 animate-fade-in text-xs">
              
              {/* Scope Selector: Itens Only vs Full Backup */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveScope('products_only')}
                  className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activeScope === 'products_only'
                      ? 'bg-amber-500/20 border border-amber-500 text-amber-300 font-extrabold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Apenas Itens & Materiais</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScope('full_backup')}
                  className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    activeScope === 'full_backup'
                      ? 'bg-amber-500/20 border border-amber-500 text-amber-300 font-extrabold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Backup Completo do App</span>
                </button>
              </div>

              {activeScope === 'products_only' ? (
                /* EXPORT ONLY PRODUCTS / ITENS */
                <div className="space-y-3">
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-black text-amber-400 text-xs sm:text-sm uppercase flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                          <span>Planilha Excel / CSV dos Itens Cadastrados</span>
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                          Arquivo .CSV formatado para Excel (separador ponto-e-vírgula com codificação UTF-8 brasileira).
                          Ideal para visualizar, editar no computador ou repassar para a equipe de vendas.
                        </p>
                      </div>
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0">
                        {products.length} itens
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={handleDownloadItemsCSV}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-black py-2.5 px-3 rounded-xl uppercase text-[11px] tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>Baixar Planilha Excel (.CSV)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyItems('csv')}
                        className="bg-neutral-900 hover:bg-neutral-850 text-zinc-300 border border-neutral-800 px-3 py-2.5 rounded-xl font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        title="Copiar texto CSV para a área de transferência"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copySuccess ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 hover:border-amber-500/30 transition-colors space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-black text-zinc-200 text-xs sm:text-sm uppercase flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-amber-400" />
                          <span>Arquivo de Dados JSON dos Itens</span>
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                          Arquivo estruturado para restaurar ou migrar sua lista de madeiras diretamente em outro celular ou computador sem perda de bitolas.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={handleDownloadItemsJSON}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2.5 px-3 rounded-xl uppercase text-[11px] tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>Baixar Arquivo de Itens (.JSON)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyItems('json')}
                        className="bg-neutral-900 hover:bg-neutral-850 text-zinc-300 border border-neutral-800 px-3 py-2.5 rounded-xl font-bold uppercase text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        title="Copiar código JSON dos itens"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copiar JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* EXPORT FULL BACKUP */
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 hover:border-amber-500/40 transition-colors space-y-3">
                  <div className="space-y-1">
                    <span className="font-black text-amber-400 text-xs sm:text-sm uppercase flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
                      <span>Backup Geral de Todo o Aplicativo</span>
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Inclui {products.length} materiais, {budgets.length} orçamentos, {clients.length} clientes, {yardBatches.length} lotes de pátio, {woodInventory.length} itens de estoque, {torasHistory.length + pranchasHistory.length} registros de romaneio e dados da empresa.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={handleDownloadFullBackup}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-2.5 px-3 rounded-xl uppercase text-[11px] tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Baixar Backup Completo (.JSON)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* IMPORT PANEL */
            <div className="space-y-4 animate-fade-in text-xs">
              
              {/* Import Mode: Merge vs Replace */}
              <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 space-y-2">
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">
                  Como deseja importar os itens?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      importMode === 'merge'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="block font-black text-xs uppercase flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mesclar / Unir (Seguro)</span>
                    </span>
                    <span className="text-[10px] block opacity-80 mt-0.5">
                      Preserva os itens atuais e adiciona os novos sem duplicar
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      importMode === 'replace'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900 border-neutral-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="block font-black text-xs uppercase flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Substituir Lista</span>
                    </span>
                    <span className="text-[10px] block opacity-80 mt-0.5">
                      Substitui a lista de materiais pelos itens do arquivo
                    </span>
                  </button>
                </div>
              </div>

              {/* File upload picker (Supports CSV, JSON, TXT) */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Selecione Arquivo de Itens (.CSV ou .JSON):</span>
                  </span>
                  {selectedFile && (
                    <span className="font-mono text-[10px] text-emerald-400 font-bold truncate max-w-[160px]">
                      {selectedFile.name}
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.json,.txt,.tsv,text/csv,application/json,text/plain"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-800 hover:border-emerald-500/60 p-4 rounded-xl text-center cursor-pointer transition-all bg-neutral-900/60 hover:bg-neutral-900 flex flex-col items-center justify-center gap-1.5 select-none"
                >
                  <Upload className="w-6 h-6 text-emerald-400" />
                  <span className="font-black text-xs text-zinc-200">
                    {selectedFile ? 'Trocar Arquivo Selecionado' : 'Toque aqui para escolher o arquivo (.CSV ou .JSON)'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Suporta planilhas Excel (CSV), backups do app ou tabelas copiadas
                  </span>
                </div>
              </div>

              {/* Or Paste text */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 font-extrabold uppercase">
                    Ou Cole o Texto da Planilha ou Código JSON:
                  </span>
                  {pastedContent && (
                    <button
                      type="button"
                      onClick={() => {
                        setPastedContent('');
                        setFileContent('');
                        setSelectedFile(null);
                      }}
                      className="text-[9px] text-zinc-500 hover:text-red-400 font-bold uppercase cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={pastedContent}
                  onChange={(e) => {
                    setPastedContent(e.target.value);
                    setFileContent(e.target.value);
                  }}
                  placeholder="Cole aqui linhas de planilha (ex: Código;Nome;Categoria;Unidade;Preço...) ou código JSON"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 font-mono text-[10px] text-emerald-400 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Live Detection Preview Card */}
              {detectedImportData && (detectedImportData.totalRecords || detectedImportData.totalItems) > 0 && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-2xl space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-400 text-xs uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {detectedImportData.isFullBackup
                          ? `Backup Completo (${detectedImportData.totalRecords} registros)`
                          : `${detectedImportData.totalItems} materiais identificados com sucesso!`}
                      </span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
                      Formato {detectedImportData.format.toUpperCase()}
                    </span>
                  </div>

                  {detectedImportData.isFullBackup && (
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-300">
                      <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{detectedImportData.products.length} Materiais</span>
                      {detectedImportData.clients && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{detectedImportData.clients.length} Clientes</span>}
                      {detectedImportData.budgets && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{detectedImportData.budgets.length} Orçamentos</span>}
                      {detectedImportData.yardBatches && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{detectedImportData.yardBatches.length} Lotes DOF</span>}
                      {detectedImportData.woodInventory && <span className="bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">{detectedImportData.woodInventory.length} Estoque</span>}
                    </div>
                  )}

                  {/* Preview first 3 items */}
                  {detectedImportData.products.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Amostra dos itens a serem salvos:</span>
                      <div className="grid grid-cols-1 gap-1 text-[11px] font-mono bg-neutral-950/80 p-2 rounded-xl border border-emerald-900/40">
                        {detectedImportData.products.slice(0, 3).map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-zinc-300 py-0.5 border-b border-neutral-850 last:border-none">
                            <span className="truncate max-w-[240px]">
                              <strong className="text-amber-400">[{p.code}]</strong> {p.name}
                            </span>
                            <span className="text-emerald-400 font-bold shrink-0">
                              R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/{p.unit}
                            </span>
                          </div>
                        ))}
                        {detectedImportData.products.length > 3 && (
                          <span className="text-[10px] text-zinc-500 italic text-center pt-1 block">
                            + {detectedImportData.products.length - 3} outros materiais na lista...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error message if unknown */}
              {detectedImportData && detectedImportData.format === 'unknown' && (
                <div className="bg-red-950/30 border border-red-500/40 p-3 rounded-xl flex items-center gap-2 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{detectedImportData.error}</span>
                </div>
              )}

              {/* Execute Import Action Button */}
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={!detectedImportData || (detectedImportData.totalRecords || detectedImportData.totalItems) === 0}
                className="w-full bg-emerald-500 disabled:bg-neutral-800 disabled:text-zinc-600 hover:bg-emerald-400 text-neutral-950 font-black py-3.5 rounded-xl uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 transition-all active:scale-98 select-none"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {detectedImportData && (detectedImportData.totalRecords || detectedImportData.totalItems) > 0
                    ? `Importar e Salvar ${detectedImportData.isFullBackup ? `${detectedImportData.totalRecords} Registros` : `${detectedImportData.totalItems} Itens`} Agora`
                    : 'Importar e Salvar Itens'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-neutral-950 p-3 border-t border-neutral-850 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
          <span>Armazenamento: LocalStorage + Memória Física</span>
          <span className="text-amber-500 font-bold">100% Offline e Seguro</span>
        </div>
      </div>
    </div>
  );
};
