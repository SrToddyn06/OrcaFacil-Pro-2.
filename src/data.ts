import { Client, Product, Budget, UnitType } from './types';

// Pre-configured Products
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', code: 'PIL-1515', name: 'Pilar de Eucalipto 15x15', price: 48.00, unit: 'M', description: 'Pilar de eucalipto tratado por metro linear' },
  { id: 'p2', code: 'REG-EUC', name: 'Régua de Eucalipto', price: 6.50, unit: 'M', description: 'Régua de eucalipto para deck ou travamento por metro linear' },
  { id: 'p3', code: 'PEC-1106', name: 'Peças de Eucalipto 11x6', price: 14.00, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p4', code: 'PEC-1406', name: 'Peças de Eucalipto 14x6', price: 16.80, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p5', code: 'PEC-1506', name: 'Peças de Eucalipto 15x6', price: 18.00, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p6', code: 'PEC-1806', name: 'Peças de Eucalipto 18x6', price: 21.60, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p7', code: 'PEC-2006', name: 'Peças de Eucalipto 20x6', price: 24.00, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p8', code: 'PEC-2506', name: 'Peças de Eucalipto 25x6', price: 30.00, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p9', code: 'PEC-3006', name: 'Peças de Eucalipto 30x6', price: 36.00, unit: 'M', description: 'Peça de eucalipto estrutural por metro linear' },
  { id: 'p10', code: 'CAI-0604', name: 'Caibro de Eucalipto 6x4', price: 6.00, unit: 'M', description: 'Caibro beneficiado de eucalipto por metro linear' },
  { id: 'p11', code: 'RPA-0503', name: 'Ripão de Eucalipto 5x3', price: 4.00, unit: 'M', description: 'Ripão estrutural para ripas de telhado' },
  { id: 'p12', code: 'RPI-0402', name: 'Ripá de Eucalipto 4x2', price: 2.50, unit: 'M', description: 'Ripa fina de eucalipto para acabamento' },
  { id: 'p13', code: 'TAB-EUC', name: 'Tábua de Eucalipto (Preço por cm)', price: 0.80, unit: 'TABUA', description: 'Cálculo dinâmico: Largura (cm) * R$ 0,80/cm * Comprimento (m)' },
  { id: 'p14', code: 'PRA-EUC', name: 'Prancha de Eucalipto (Preço por cm)', price: 2.00, unit: 'PRANCHA', description: 'Cálculo dinâmico: Largura (cm) * R$ 2,00/cm * Comprimento (m)' },
  { id: 'p15', code: 'TOR-EUC', name: 'Tora de Eucalipto Bruta (M³)', price: 450.00, unit: 'M3', description: 'Tora inteira para serrar. Requer cálculo de m³ por Huber' }
];

// Pre-configured list of clients
export const INITIAL_CLIENTS: Client[] = [];

// Pre-configured budgets
export const INITIAL_BUDGETS: Budget[] = [];

// Reusable sample TXT file contents for importing
export const SAMPLE_TXT_FILES = {
  mergeUpdate: `PIL-1515|Pilar de Eucalipto 15x15|52.00|M|Pilar bitola firme tratado autoclave - reajuste
PEC-1106|Peças de Eucalipto 11x6|15.00|M|Peças eucalipto rosa
PEC-1506|Peças de Eucalipto 15x6|19.50|M|Estrutural bitola média
TAB-EUC|Tábua de Eucalipto (Preço por cm)|0.85|TABUA|Tábua tratada premium por cm de largura
PRA-EUC|Prancha de Eucalipto (Preço por cm)|2.10|PRANCHA|Prancha pesada por cm de largura`,
  
  fullReplace: `PIL-1515|Pilar de Eucalipto 15x15|48.00|M|Pilar eucalipto bruto por metro
CAI-0604|Caibro de Eucalipto 6x4|5.80|M|Caibro eucalipto rosa de telhado
RPA-0503|Ripão de Eucalipto 5x3|3.80|M|Ripão eucalipto standard`
};

// SQLite/Room Database Schema metadata for Interactive Developer tab
export interface TableSchema {
  name: string;
  description: string;
  columns: { name: string; type: string; constraints?: string; desc: string }[];
  indexes: string[];
}

export const DATABASE_SCHEMAS: TableSchema[] = [
  {
    name: 'clients',
    description: 'Armazena as informações cadreais dos clientes com cache local físico.',
    columns: [
      { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY', desc: 'UUID gerado localmente' },
      { name: 'name', type: 'TEXT', constraints: 'NOT NULL', desc: 'Nome completo ou Razão Social' },
      { name: 'phone', type: 'TEXT', constraints: '', desc: 'Telefone comercial formatado' },
      { name: 'whatsapp', type: 'TEXT', constraints: '', desc: 'Apenas números para deeplinking direto' },
      { name: 'address', type: 'TEXT', constraints: '', desc: 'Endereço completo de entrega' },
      { name: 'observations', type: 'TEXT', constraints: '', desc: 'Notas de hábitos de compra, perfil' },
      { name: 'created_at', type: 'TEXT', constraints: 'DEFAULT CURRENT_DATE', desc: 'Data de cadastro do cliente' }
    ],
    indexes: ['idx_clients_name (name COLLATE NOCASE)', 'idx_clients_phone (phone)']
  },
  {
    name: 'products',
    description: 'Tabela mestre contendo produtos locais para uso rápido e importação flexível.',
    columns: [
      { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY', desc: 'UUID único ou SKU' },
      { name: 'code', type: 'TEXT', constraints: 'UNIQUE NOT NULL', desc: 'Código de Barra/SKU da tabela' },
      { name: 'name', type: 'TEXT', constraints: 'NOT NULL', desc: 'Descrição legível do material' },
      { name: 'price', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', desc: 'Preço unitário base' },
      { name: 'unit', type: 'TEXT', constraints: 'NOT NULL CHECK (unit IN ("UN", "M", "M3", "TABUA", "PRANCHA"))', desc: 'Ex: UN, M, M3, TABUA, PRANCHA' },
      { name: 'description', type: 'TEXT', constraints: '', desc: 'Notas técnicas ou especificações do fornecedor' }
    ],
    indexes: ['idx_products_code (code)', 'idx_products_name (name COLLATE NOCASE)']
  },
  {
    name: 'budgets',
    description: 'Orçamentos criados, com versionamento e vínculo relacional.',
    columns: [
      { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY', desc: 'Identificador único do orçamento' },
      { name: 'number', type: 'TEXT', constraints: 'UNIQUE NOT NULL', desc: 'Sequencial formatado p/ o usuário (ORC-YYYY-XXX)' },
      { name: 'client_id', type: 'TEXT', constraints: 'REFERENCES clients(id) ON DELETE CASCADE', desc: 'Relacionado ao cliente' },
      { name: 'status', type: 'TEXT', constraints: 'NOT NULL DEFAULT "Rascunho"', desc: 'Rascunho, Aguardando, Confirmado, Vendido' },
      { name: 'date', type: 'TEXT', constraints: 'NOT NULL', desc: 'Data de emissão' },
      { name: 'validity_days', type: 'INTEGER', constraints: 'DEFAULT 10', desc: 'Validade do orçamento' },
      { name: 'discount', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', desc: 'Valor percentual de desconto' },
      { name: 'freight', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', desc: 'Valor total do frete' },
      { name: 'observations', type: 'TEXT', constraints: '', desc: 'Anotações gerais do negócio' },
      { name: 'subtotal', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', desc: 'Soma dos itens antes de desconto/frete' },
      { name: 'total', type: 'REAL', constraints: 'NOT NULL DEFAULT 0.0', desc: 'Total final líquido calculado' },
      { name: 'version', type: 'INTEGER', constraints: 'NOT NULL DEFAULT 1', desc: 'Controle de versão do histórico' },
      { name: 'parent_version_id', type: 'TEXT', constraints: '', desc: 'Filiado ao ID anterior para rastreabilidade' }
    ],
    indexes: ['idx_budgets_client (client_id)', 'idx_budgets_number_version (number, version)']
  },
  {
    name: 'budget_items',
    description: 'Especificação granular de produtos adicionados no orçamento. Suporta diâmetro e comprimento para M3.',
    columns: [
      { name: 'budget_id', type: 'TEXT', constraints: 'REFERENCES budgets(id) ON DELETE CASCADE', desc: 'ID do orçamento herdeiro' },
      { name: 'product_id', type: 'TEXT', constraints: 'REFERENCES products(id)', desc: 'ID do produto adicionado' },
      { name: 'price', type: 'REAL', constraints: 'NOT NULL', desc: 'Preço unitário negociado (na data)' },
      { name: 'quantity', type: 'REAL', constraints: 'NOT NULL', desc: 'Quantidade (suporta ponto flutuante para metro/cúbicos)' },
      { name: 'unit', type: 'TEXT', constraints: 'NOT NULL', desc: 'Cópia da unidade de medida do produto' },
      { name: 'diameter', type: 'REAL', constraints: '', desc: 'Diâmetro médio (usado no cálculo de M3 se aplicável)' },
      { name: 'width', type: 'REAL', constraints: '', desc: 'Largura em cm (usada no cálculo de Tábua/Prancha)' },
      { name: 'length', type: 'REAL', constraints: '', desc: 'Comprimento em m (usado no cálculo de M3/Tábua/Prancha)' }
    ],
    indexes: ['idx_item_budget_product (budget_id, product_id)']
  },
  {
    name: 'budget_timeline',
    description: 'Log auditável cronológico para reparações operacionais offline do orçamento.',
    columns: [
      { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY', desc: 'ID do log' },
      { name: 'budget_id', type: 'TEXT', constraints: 'REFERENCES budgets(id) ON DELETE CASCADE', desc: 'ID vinculado' },
      { name: 'timestamp', type: 'TEXT', constraints: 'DEFAULT CURRENT_TIMESTAMP', desc: 'Data e Hora da ação localmente' },
      { name: 'action', type: 'TEXT', constraints: 'NOT NULL', desc: 'Ação executada: Criação, Edição, Status, WhatsApp' },
      { name: 'description', type: 'TEXT', constraints: 'NOT NULL', desc: 'Log detalhado das informações' }
    ],
    indexes: ['idx_timeline_budget (budget_id)']
  }
];
