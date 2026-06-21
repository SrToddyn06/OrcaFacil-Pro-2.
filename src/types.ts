export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  observations: string;
  createdAt: string;
  totalSpent: number;
}

export type UnitType = 'UN' | 'M' | 'M3' | 'TABUA' | 'PRANCHA';

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  unit: UnitType;
  description: string;
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
  parentVersionId?: string; // For tracing duplicate/version history
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
