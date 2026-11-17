export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  observations: string;
  createdAt: string;
  totalSpent: number;
  gpsCoords?: string;
  document?: string; // CPF or CNPJ
  city?: string;
  state?: string;
  clientType?: 'PF' | 'PJ';
}

export type UnitType = 'UN' | 'M' | 'M3' | 'TABUA' | 'PRANCHA' | 'HORA' | 'M2' | 'KG' | 'TON' | 'DIARIA' | 'M3_BLOCO' | 'MIL' | 'ST';

export type WoodCategoryType = 
  | 'all' 
  | 'pecas'        // Peças, Pilares, Caibros, Vigas
  | 'reguas'       // Réguas, Mourões, Guias
  | 'ripas'        // Ripas, Ripões, Sarrafos
  | 'tabuas'       // Tábuas, Pranchas, Decks, Assoalhos
  | 'toras'        // Toras Roliças Huber (m³)
  | 'porteiras'    // Porteiras, Mesas, Móveis Rústicos
  | 'servicos';    // Desdobro de toras, Cortes, Serviços por hora/m²

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  unit: UnitType;
  description: string;
  category?: string;
  diameter?: number;
  thickness?: number;
  width?: number;
  length?: number;
}

export type BudgetStatus = 'Rascunho' | 'Em Processamento' | 'Aguardando Cliente' | 'Confirmado' | 'Vendido' | 'Cancelado';

export interface BudgetItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  unit: UnitType;
  // Cubic / Custom measurement metadata
  diameter?: number; // in cm
  thickness?: number; // in cm (for BLOCKS and PRANCHAS)
  width?: number;    // in cm (for TABUA and PRANCHA)
  length?: number;   // in m
}

export interface Budget {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  status: BudgetStatus;
  date: string;
  validityDays: number;
  items: BudgetItem[];
  discount: number; // percentage or fixed
  freight: number;
  observations: string;
  subtotal: number;
  total: number;
  version: number;
  gpsCoords?: string;
  woodPhoto?: string;
  parentVersionId?: string; // For tracing duplicate/version history
  stockDeducted?: boolean; // Controla baixa automática no estoque ao marcar como Vendido
  paymentMethod?: 'Pix' | 'Dinheiro' | 'Cartão' | 'Boleto / Prazo' | 'Transferência';
  paymentStatus?: 'Em Aberto' | 'Sinal Pago' | 'Quitado';
  amountPaid?: number;
  clientSignature?: string; // Assinatura digital capturada na tela (DataURL PNG)
  updateHistory: {
    timestamp: string;
    action: string;
    description: string;
  }[];
}

export interface TXTFormatGuide {
  separator: string;
  example: string;
  instruction: string;
}

export interface TableUpdateResult {
  added: Product[];
  removed: Product[];
  priceIncreased: { product: Product; oldPrice: number; newPrice: number }[];
  priceDecreased: { product: Product; oldPrice: number; newPrice: number }[];
  descriptionChanged: { product: Product; oldDesc: string }[];
  unchangedCount: number;
}

// ==========================================
// TIPOS EXCLUSIVOS DO MODO COMPLETO (SERRARIA PRO)
// ==========================================

export interface YardBatch {
  id: string;
  batchNumber: string;
  entryDate: string;
  supplier: string;
  documentType: 'DOF' | 'Guia Florestal' | 'Nota Fiscal' | 'Romaneio Próprio';
  documentNumber: string;
  species: string;
  logsCount: number;
  grossVolumeM3: number;
  totalCost: number;
  costPerM3: number;
  status: 'No Pátio' | 'Em Desdobro' | 'Processado 100%' | 'Quarentena';
  notes?: string;
}

export interface WoodInventoryItem {
  id: string;
  species: string;
  woodType: 'Tora Bruta' | 'Prancha' | 'Viga' | 'Tábua' | 'Caibro / Ripa' | 'Pontalete';
  volumeM3: number;
  piecesCount: number;
  averagePricePerM3: number;
  storageLocation: string;
  drynessState: 'Verde' | 'Seca ao Ar (AD)' | 'Seca em Estufa (KD)';
  minAlertM3: number;
}

export interface SawmillEfficiencyConfig {
  toraVolumeInputM3: number;
  recoveredLumberM3: number;
  recoveryRatePercent: number; // Ex: 58%
  bladeKerfMm: number;        // Espessura do traço de corte da serra
  sawdustPercent: number;     // Perda em serragem (ex: 15%)
  slabsPercent: number;       // Costaneiras e aparas (ex: 20%)
  barkPercent: number;        // Casca (ex: 7%)
  hourlyOperationalCost: number; // Custo hora da máquina/equipe
}

export interface MarkupCalculation {
  rawWoodCostM3: number;
  sawingLaborCostM3: number;
  energyAndFuelCostM3: number;
  handlingFreightM3: number;
  lossFactorPercent: number;   // Fator de perda de desdobro (ex: 40%)
  taxPercent: number;          // Alíquota de impostos (ex: 6% Simples)
  desiredProfitMarginPercent: number; // Margem de lucro (ex: 30%)
  breakEvenPriceM3: number;    // Preço de custo real / ponto de equilíbrio
  suggestedSalePriceM3: number; // Preço sugerido de venda
}

