import { Product } from '../types';

export type ParsedItemType =
  | 'peca'
  | 'regua'
  | 'ripa'
  | 'ripao'
  | 'caibro'
  | 'viga'
  | 'tabua'
  | 'prancha'
  | 'pilar'
  | 'tora'
  | 'porteira'
  | 'mesa';

export interface ParsedOrderItem {
  id: string;
  type: ParsedItemType;
  originalText: string;
  matchedKeyword: string;
  quantity: number;
  length?: number;
  width?: number;
  thickness?: number;
  diameter?: number;
  height?: number;
  rails?: number;
  hasBenches?: boolean;
  product: Product;
  confidence: number;
  totalLinearMeters?: number;
  linearMode?: 'linear' | 'pieces';
  splitPieceLength?: number;
}

export const DICTIONARY_PECA = [
  'peça', 'peca', 'peças', 'pecas',
  'pecinha', 'pecinhas', 'peçinha', 'peçinhas', 'pedacinho', 'pedacinhos', 'pedaco', 'pedacos', 'pedaço', 'pedaços',
  'peção', 'pecao', 'peções', 'pecoes', 'pecona', 'peconas', 'peçona', 'peçonas', 'pecãozinho', 'pecaozinho',
  'pc', 'pcs', 'pç', 'pçs', 'pça', 'pças', 'un', 'und', 'unid', 'unidade', 'unidades',
  'viga', 'vigas', 'viguinha', 'viguinhas', 'vigão', 'vigao', 'vigões', 'vigoes', 'vigota', 'vigotas', 'vigotinha', 'vigotinhas',
  'prumo', 'prumos', 'linha', 'linhas', 'linhão', 'linhao', 'pontalete', 'pontaletes', 'pontaletezinho', 'escora', 'escoras', 'guia', 'guias'
];

export const DICTIONARY_REGUA = [
  'régua', 'regua', 'réguas', 'reguas',
  'reguinha', 'reguinhas', 'réguinha', 'réguinhas', 'reguinhazinha', 'reguinhaszinhas',
  'reguão', 'reguao', 'reguões', 'reguoes', 'reguona', 'reguonas', 'reguãozinho', 'reguaozinho',
  'regueiro', 'regueiros', 'travessa', 'travessas', 'travessinha', 'travessinhas', 'travessão', 'travessao', 'travessões', 'travessoes',
  'estrado', 'estrados', 'tábua de cerca', 'tabua de cerca', 'tábua régua', 'tabua regua'
];

export const DICTIONARY_RIPA = [
  'ripa', 'ripas',
  'ripinha', 'ripinhas', 'ripinhazinha', 'ripinhaszinhas', 'ripita', 'ripitas',
  'ripona', 'riponas', 'ripaço', 'ripaco',
  'filete', 'filetes', 'filetinho', 'filetinhos', 'ripete', 'ripetes'
];

export const DICTIONARY_RIPAO = [
  'ripão', 'ripao', 'ripões', 'ripoes', 'ripaos', 'ripãos',
  'ripãozinho', 'ripaozinho', 'ripãozinhos', 'ripaozinhos', 'ripaezinhos', 'ripõezinhos', 'ripozinho', 'ripozinhos', 'ripãosinho', 'ripaosinho',
  'ripaça', 'ripaca', 'ripaçarão',
  'sarrafo', 'sarrafos', 'sarrafinho', 'sarrafinhos', 'sarrafão', 'sarrafao', 'sarrafões', 'sarrafoes',
  'barrote', 'barrotes', 'barrotinho', 'barrotinhos', 'contra-ripa', 'contraripa'
];

export const DICTIONARY_CAIBRO = [
  'caibro', 'caibros', 'caibro beneficiado', 'caibro bruto',
  'caibrinho', 'caibrinhos',
  'caibrão', 'caibrao', 'caibrões', 'caibroes',
  'caibramento', 'caibração'
];

export const DICTIONARY_TABUA = [
  'tábua', 'tabua', 'tábuas', 'tabuas',
  'tabuinha', 'tabuinhas', 'tábuinha', 'tábuinhas', 'tabuinhazinha',
  'tabuona', 'tabuonas', 'tábuão', 'tabuao', 'tabuões', 'tabuoes', 'tabão', 'tabao',
  'tábua de caixaria', 'tabua de caixaria', 'tábua de pinus', 'tabua de pinus', 'tábua de eucalipto', 'tabua de eucalipto', 'assoalho', 'forro', 'deck'
];

export const DICTIONARY_PRANCHA = [
  'prancha', 'pranchas',
  'pranchinha', 'pranchinhas',
  'pranchão', 'pranchao', 'pranchões', 'pranchoes', 'pranchona', 'pranchonas', 'pranchãozinho', 'pranchaozinho', 'pranchaço', 'pranchaco',
  'pranchão de eucalipto', 'pranchao macico', 'prancha maciça', 'prancha macica'
];

export const DICTIONARY_MOURAO_PILAR = [
  'mourão', 'mourao', 'mourões', 'mouroes', 'morão', 'morao', 'morões', 'moroes',
  'mourãozinho', 'mouraozinho', 'mourãozinhos', 'mouraozinhos', 'mourõezinhos', 'mourõeszinhos',
  'mourezinhos', 'morãozinho', 'moraozinho', 'morãozinhos', 'moraozinhos', 'mourãozão', 'mouraozao',
  'pilar', 'pilares', 'pilarzinho', 'pilarzinhos', 'pilarzão', 'pilarzao', 'pilarzões', 'pilarzoes',
  'pilastra', 'pilastras', 'pilastrinha', 'pilastrinhas', 'pilastrão', 'pilastrao',
  'esteio', 'esteios', 'esteinho', 'esteinhos', 'esteião', 'esteiao', 'esteiozinho',
  'estaca', 'estacas', 'estaquinha', 'estaquinhas', 'estacão', 'estacao', 'estacona', 'estaconas',
  'palanque', 'palanques', 'palanquinho', 'palanquinhos', 'palancão', 'palancao',
  'coluna', 'colunas', 'coluninha', 'coluninhas', 'colunão', 'colunao', 'poste', 'postes', 'postinho', 'postinhos',
  'roliço', 'rolico', 'roliços', 'rolicos', 'rolicinho', 'rolicinhos'
];

export const DICTIONARY_TORA = [
  'tora', 'toras', 'torinha', 'torinhas', 'torona', 'toronas', 'torão', 'torao', 'tora roliça', 'tora rolica', 'toras roliças', 'toras rolicas', 'tronco', 'troncos', 'tora bruta', 'toras brutas'
];

export const DICTIONARY_PORTEIRA = [
  'porteira', 'porteiras',
  'porteirinha', 'porteirinhas',
  'porteirão', 'porteirao', 'porteirões', 'porteiroes', 'porteirona', 'porteironas',
  'cancela', 'cancelas', 'cancelinha', 'cancelinhas', 'cancelão', 'cancelao',
  'portão', 'portao', 'portões', 'portoes', 'portãozinho', 'portaozinho',
  'colcho', 'colchos', 'colchão', 'colchões', 'colchoes'
];

export const DICTIONARY_MESA = [
  'mesa', 'mesas', 'mesa rústica', 'mesa rustica', 'mesas rústicas', 'mesas rusticas',
  'mesinha', 'mesinhas',
  'mesona', 'mesonas', 'mesão', 'mesao', 'mesões', 'mesoes',
  'mesa de prancha', 'mesa de tronco', 'mesa com bancos', 'mesa c/ bancos', 'mesa pranchao'
];

export const stripAccents = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/á|à|â|ã|ä/g, 'a')
    .replace(/é|è|ê|ë/g, 'e')
    .replace(/í|ì|î|ï/g, 'i')
    .replace(/ó|ò|ô|õ|ö/g, 'o')
    .replace(/ú|ù|û|ü/g, 'u')
    .replace(/ç/g, 'c');
};

const NUMBER_WORDS: Record<string, number> = {
  'um': 1, 'uma': 1,
  'dois': 2, 'duas': 2,
  'tres': 3, 'quatro': 4, 'cinco': 5,
  'seis': 6, 'meia duzia': 6, 'meia dz': 6,
  'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10,
  'onze': 11, 'doze': 12, 'uma duzia': 12, 'duzia': 12, 'dz': 12,
  'treze': 13, 'quatorze': 14, 'catorze': 14, 'quinze': 15,
  'dezesseis': 16, 'dezessete': 17, 'dezoito': 18, 'dezenove': 19,
  'vinte': 20, 'vinte e cinco': 25, 'trinta': 30, 'quarenta': 40, 'cinquenta': 50,
  'sessenta': 60, 'setenta': 70, 'oitenta': 80, 'noventa': 90,
  'cem': 100, 'cento': 100, 'duzentos': 200, 'trezentos': 300, 'quatrocentos': 400, 'quinhentos': 500
};

function buildRegexGroup(words: string[]): string {
  const normalized = Array.from(new Set(words.map(w => stripAccents(w))))
    .sort((a, b) => b.length - a.length);
  return `(?:${normalized.map(w => w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`;
}

const PECA_GROUP = `\\b${buildRegexGroup(DICTIONARY_PECA)}\\b`;
const REGUA_GROUP = `\\b${buildRegexGroup(DICTIONARY_REGUA)}\\b`;
const RIPA_GROUP = `\\b${buildRegexGroup(DICTIONARY_RIPA)}\\b`;
const RIPAO_GROUP = `\\b${buildRegexGroup(DICTIONARY_RIPAO)}\\b`;
const CAIBRO_GROUP = `\\b${buildRegexGroup(DICTIONARY_CAIBRO)}\\b`;
const TABUA_GROUP = `\\b${buildRegexGroup(DICTIONARY_TABUA)}\\b`;
const PRANCHA_GROUP = `\\b${buildRegexGroup(DICTIONARY_PRANCHA)}\\b`;
const MOURAO_PILAR_GROUP = `\\b${buildRegexGroup(DICTIONARY_MOURAO_PILAR)}\\b`;
const TORA_GROUP = `\\b${buildRegexGroup(DICTIONARY_TORA)}\\b`;
const PORTEIRA_GROUP = `\\b${buildRegexGroup(DICTIONARY_PORTEIRA)}\\b`;
const MESA_GROUP = `\\b${buildRegexGroup(DICTIONARY_MESA)}\\b`;

const QTY_CAPTURE = `(?:(\\d+(?:\\s*(?:duzias?|dz))?|meia\\s+duzia|uma\\s+duzia|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze|vinte|trinta|quarenta|cinquenta|cem|duzentos|trezentos|quatrocentos|quinhentos)\\s*(?:de\\s+)?)`;
const LINEAR_QTY_CAPTURE = `(?:(\\d+(?:\\.\\d+)?|um|uma|dois|duas|tres|quatro|cinco|seis|dez|vinte|trinta|cinquenta|cem|cento|duzentos|trezentos|quatrocentos|quinhentos)\\s*)`;

function parseQtyValue(raw?: string): number {
  if (!raw) return 1;
  const clean = stripAccents(raw.trim()).replace(/\s+/g, ' ');
  const dzMatch = clean.match(/^(\d+)\s*(?:duzias?|dz)$/);
  if (dzMatch) {
    return (parseInt(dzMatch[1], 10) || 1) * 12;
  }
  if (NUMBER_WORDS[clean]) return NUMBER_WORDS[clean];
  const num = parseInt(clean, 10);
  if (!isNaN(num)) return num;
  return 1;
}

export function parseLinearQty(raw?: string): number {
  if (!raw) return 100;
  const clean = stripAccents(raw.trim());
  if (NUMBER_WORDS[clean]) return NUMBER_WORDS[clean];
  const num = parseFloat(clean);
  if (!isNaN(num)) return num;
  return 100;
}

export function calculateParsedItemValues(item: ParsedOrderItem): {
  unitPrice: number;
  totalPrice: number;
  unitLabel: string;
  calcDesc: string;
} {
  const prod = item.product;
  const unit = prod.unit;
  const pPrice = prod.price;
  const qty = item.quantity;
  const len = item.length || 1.0;
  const width = item.width || 0;
  const thickness = item.thickness || 0;

  let unitPrice = pPrice;
  let totalPrice = 0;
  let unitLabel = `R$ / ${unit}`;
  let calcDesc = '';

  if (unit === 'M') {
    let pricePerMeter = pPrice;
    if (width > 0 && thickness > 0 && item.type === 'peca' && prod.code === 'PEC-1106' && (width !== 11 || thickness !== 6)) {
      pricePerMeter = width * thickness * 0.20;
    }

    if (item.linearMode === 'linear') {
      unitPrice = pricePerMeter;
      totalPrice = pricePerMeter * qty;
      unitLabel = 'R$ / metro';
      calcDesc = width && thickness
        ? `${qty}m corridos (${width}x${thickness}cm) x R$ ${pricePerMeter.toFixed(2)}/m`
        : `${qty}m corridos x R$ ${pricePerMeter.toFixed(2)}/m`;
    } else {
      unitPrice = pricePerMeter * len;
      totalPrice = unitPrice * qty;
      unitLabel = `R$ / pç de ${len}m`;
      calcDesc = width && thickness
        ? `${qty} peças (${width}x${thickness}cm x ${len}m) = R$ ${pricePerMeter.toFixed(2)}/m x ${len}m = R$ ${unitPrice.toFixed(2)}/pç`
        : `${qty} peças de ${len}m (${(qty * len).toFixed(1)}m total) x R$ ${pricePerMeter.toFixed(2)}/m`;
    }
  } else if (unit === 'TABUA' || unit === 'PRANCHA') {
    const w = width || 30;
    if (item.linearMode === 'linear') {
      unitPrice = w * pPrice;
      totalPrice = unitPrice * qty;
      unitLabel = 'R$ / metro linear';
      calcDesc = `${w}cm larg. x R$ ${pPrice.toFixed(2)} x ${qty}m`;
    } else {
      unitPrice = w * pPrice * len;
      totalPrice = unitPrice * qty;
      unitLabel = `R$ / pç de ${len}m`;
      calcDesc = `${qty} peças de ${len}m x ${w}cm larg. x R$ ${pPrice.toFixed(2)}`;
    }
  } else if (unit === 'M3_BLOCO') {
    const th = thickness || 6;
    const w = width || 11;
    const volPerPiece = (th * w * len) / 10000;
    unitPrice = volPerPiece * pPrice;
    totalPrice = unitPrice * qty;
    unitLabel = `R$ / pç (${volPerPiece.toFixed(4)} m³)`;
    calcDesc = `${qty} peças (${th}x${w}cm x ${len}m) = ${(volPerPiece * qty).toFixed(4)} m³ x R$ ${pPrice.toFixed(2)}/m³`;
  } else if (unit === 'M3') {
    const diam = item.diameter || thickness || 35;
    const vol = (Math.PI * Math.pow(diam, 2) * len) / 40000;
    unitPrice = vol * pPrice;
    totalPrice = unitPrice * qty;
    unitLabel = `R$ / tora (${vol.toFixed(3)} m³)`;
    calcDesc = `${qty} toras (Ø${diam}cm x ${len}m = ${(vol * qty).toFixed(3)}m³) x R$ ${pPrice.toFixed(2)}/m³`;
  } else {
    unitPrice = pPrice;
    totalPrice = pPrice * qty;
    unitLabel = `R$ / ${unit}`;
    calcDesc = `${qty} ${unit} x R$ ${pPrice.toFixed(2)}`;
  }

  return { unitPrice, totalPrice, unitLabel, calcDesc };
}

export function calculateGatePrice(width: number, height: number, rails: number, woodType: string): number {
  let woodPriceM3 = 1800;
  const woodLower = woodType.toLowerCase();
  if (woodLower.includes('roxinho')) woodPriceM3 = 4800;
  else if (woodLower.includes('ipê') || woodLower.includes('ipe')) woodPriceM3 = 6500;
  else if (woodLower.includes('cedro')) woodPriceM3 = 3200;
  else if (woodLower.includes('itaúba') || woodLower.includes('itauba')) woodPriceM3 = 4200;

  const columnsVol = 2 * (0.10 * 0.10 * height);
  const railsVol = rails * (0.025 * 0.12 * width);
  const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  const zBraceVol = 0.025 * 0.12 * diagonal;

  const totalWoodVol = columnsVol + railsVol + zBraceVol;
  const woodCost = totalWoodVol * woodPriceM3;

  const totalCost = woodCost + 180 + 150;
  return Math.max(300, Math.round(totalCost * 1.35));
}

export function calculateTablePrice(length: number, woodType: string, hasBenches: boolean): number {
  let woodPriceM3 = 1800;
  const woodLower = woodType.toLowerCase();
  if (woodLower.includes('roxinho') || woodLower.includes('roxo')) woodPriceM3 = 4800;
  else if (woodLower.includes('ipê') || woodLower.includes('ipe')) woodPriceM3 = 6500;
  else if (woodLower.includes('cedro')) woodPriceM3 = 3200;
  else if (woodLower.includes('itaúba') || woodLower.includes('itauba')) woodPriceM3 = 4200;

  const slabVol = 0.06 * 0.90 * length;
  const woodCost = slabVol * woodPriceM3;

  const benchSlabVol = 2 * (0.04 * 0.35 * length);
  const totalBenchesCost = hasBenches ? benchSlabVol * woodPriceM3 + 300 + 150 + 80 : 0;

  const totalCost = woodCost + 450 + 150 + 250 + totalBenchesCost;
  return Math.max(500, Math.round(totalCost * 1.35));
}

function findCatalogMatch(
  catalogProducts: Product[],
  type: ParsedItemType,
  woodLower: string,
  width?: number,
  thickness?: number
): Product {
  const safeFallback = catalogProducts[0] || {
    id: 'fallback-wood',
    code: 'MAD-GEN',
    name: 'Madeira Serrada',
    price: 15,
    unit: 'M' as const,
    description: 'Item de madeira serrada',
  };

  if (type === 'tora') {
    return (
      catalogProducts.find(p => p.unit === 'M3' && stripAccents(p.name).includes(woodLower)) ||
      catalogProducts.find(p => p.unit === 'M3') ||
      {
        id: 'tora-huber-default',
        code: 'TOR-HUBER',
        name: `Tora Roliça (${woodLower.toUpperCase()})`,
        price: 450,
        unit: 'M3',
        description: 'Cubagem em m³ pelo método Huber',
      }
    );
  }

  if (type === 'regua') {
    return (
      catalogProducts.find(p => stripAccents(p.name).includes('regua') && stripAccents(p.name).includes(woodLower)) ||
      catalogProducts.find(p => p.code === 'REG-EUC') ||
      catalogProducts.find(p => stripAccents(p.name).includes('regua')) ||
      safeFallback
    );
  }

  if (type === 'ripa') {
    return (
      catalogProducts.find(p => p.code === 'RPI-0402') ||
      catalogProducts.find(p => stripAccents(p.name).includes('ripa') && !stripAccents(p.name).includes('ripao')) ||
      safeFallback
    );
  }

  if (type === 'ripao') {
    return (
      catalogProducts.find(p => p.code === 'RPA-0503') ||
      catalogProducts.find(p => stripAccents(p.name).includes('ripao') || stripAccents(p.name).includes('sarrafo')) ||
      safeFallback
    );
  }

  if (type === 'caibro') {
    return (
      catalogProducts.find(p => p.code === 'CAI-0604') ||
      catalogProducts.find(p => stripAccents(p.name).includes('caibro')) ||
      safeFallback
    );
  }

  if (type === 'tabua') {
    return (
      catalogProducts.find(p => p.code === 'TAB-EUC') ||
      catalogProducts.find(p => stripAccents(p.name).includes('tabua')) ||
      safeFallback
    );
  }

  if (type === 'prancha') {
    return (
      catalogProducts.find(p => p.code === 'PRA-EUC') ||
      catalogProducts.find(p => stripAccents(p.name).includes('prancha')) ||
      safeFallback
    );
  }

  if (type === 'pilar') {
    return (
      catalogProducts.find(p => p.code.startsWith('PIL-') && stripAccents(p.name).includes(woodLower)) ||
      catalogProducts.find(p => p.code.startsWith('PIL-')) ||
      catalogProducts.find(p => stripAccents(p.name).includes('pilar') || stripAccents(p.name).includes('mourao')) ||
      safeFallback
    );
  }

  if (width && thickness) {
    const codeToSearch = `PEC-${width}${thickness < 10 ? '0' + thickness : thickness}`;
    const exactMatch = catalogProducts.find(p => p.code === codeToSearch);
    if (exactMatch) return exactMatch;

    if (width === 6 && thickness === 4) {
      const cai = catalogProducts.find(p => p.code === 'CAI-0604');
      if (cai) return cai;
    }
    if (width === 5 && thickness === 3) {
      const rpa = catalogProducts.find(p => p.code === 'RPA-0503');
      if (rpa) return rpa;
    }
    if (width === 4 && thickness === 2) {
      const rpi = catalogProducts.find(p => p.code === 'RPI-0402');
      if (rpi) return rpi;
    }
  }

  return (
    catalogProducts.find(p => p.code === 'PEC-1106') ||
    catalogProducts.find(p => stripAccents(p.name).includes('peca')) ||
    safeFallback
  );
}

function normalizePortugueseOrderText(rawText: string): string {
  let t = stripAccents(rawText);

  // 1. Decimais com vírgula -> ponto (ex: 4,5 -> 4.5)
  t = t.replace(/(\d+),(\d+)/g, '$1.$2');

  // 2. Expressões "X metros e meio" / "X e meio" / "X e meia" -> X.5
  t = t.replace(/(\d+)\s*(?:metros?|mts?|m)?\s+e\s+mei[oa]\b/g, '$1.5m');

  // 3. Metros + centímetros colados (ex: 4m50 ou 2m20 -> 4.50m), SEM capturar "10m 30x6"
  t = t.replace(/(\d+)\s*m\s*(\d{2})(?!\s*[x*])\b/g, '$1.$2m');

  // 4. Dúzias coladas ou soltas em palavras-chave (ex: "2 duzias" -> "24", "meia duzia" -> "6", "1 duzia" -> "12")
  t = t.replace(/\bmeia\s+(?:duzia|dz)\b/g, '6');
  t = t.replace(/\buma\s+(?:duzia|dz)\b/g, '12');
  t = t.replace(/(\d+)\s*(?:duzias?|dz)\b/g, (_m, n) => String((parseInt(n, 10) || 1) * 12));

  // 5. Seções tipo "11 por 6" ou "11 p/ 6" ou "11 * 6" -> "11x6"
  t = t.replace(/(\d+(?:\.\d+)?)\s*(?:por|p\/|\*)\s*(\d+(?:\.\d+)?)/g, '$1x$2');

  // 6. Normaliza palavras numéricas antes de medidas (ex: "tres metros" -> "3m", "quatro e meio" já tratado)
  t = t.replace(/\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|doze|quinze|vinte|trinta|quarenta|cinquenta)\b/g, (word) => {
    const val = NUMBER_WORDS[word];
    return val ? String(val) : word;
  });

  return t;
}

/**
 * Divide o texto em cláusulas independentes (por quebra de linha, ponto e vírgula, vírgula ou " e ")
 * evitando que padrões de um item invadam o item vizinho.
 */
function splitOrderIntoClauses(normalizedText: string): string[] {
  // Preserva "com bancos" / "e bancos" junto da mesa
  const protectedText = normalizedText
    .replace(/\be\s+bancos\b/g, ' com bancos')
    .replace(/\bc\/\s*bancos\b/g, ' com bancos');

  const rawSegments = protectedText
    .split(/[\n;]+|,(?!\d)|\s+\be\b\s+(?=\d|\b(?:peca|pecas|pecinha|pecinhas|ripa|ripas|ripinha|ripinhas|ripao|ripoes|ripaozinho|caibro|caibros|caibrinho|regua|reguas|reguinha|tabua|tabuas|tabuinha|prancha|pranchas|pranchao|mourao|mouroes|estaca|estacas|pilar|pilares|pilastra|pilastras|tora|toras|porteira|porteiras|mesa|mesas)\b)/g)
    .map(s => s.trim())
    .filter(Boolean);

  return rawSegments.length > 0 ? rawSegments : [normalizedText];
}

function detectWoodSpecies(text: string): string {
  if (text.includes('roxinho') || text.includes('roxo')) return 'Roxinho';
  if (text.includes('cedro')) return 'Cedro';
  if (text.includes('ipe')) return 'Ipê';
  if (text.includes('itauba') || text.includes('itau')) return 'Itaúba';
  if (text.includes('pinus')) return 'Pinus';
  if (text.includes('cumaru')) return 'Cumaru';
  if (text.includes('jatoba')) return 'Jatobá';
  if (text.includes('garapeira')) return 'Garapeira';
  return 'Eucalipto';
}

function parseSingleClause(
  clause: string,
  catalogProducts: Product[],
  globalWood: string
): ParsedOrderItem[] {
  const results: ParsedOrderItem[] = [];
  let processingText = clause;
  const localWood = detectWoodSpecies(clause) !== 'Eucalipto' ? detectWoodSpecies(clause) : globalWood;
  const woodLower = stripAccents(localWood);

  const consumeMatch = (m: RegExpExecArray) => {
    const idx = m.index;
    const len = m[0].length;
    processingText = processingText.substring(0, idx) + ' '.repeat(len) + processingText.substring(idx + len);
  };

  let match: RegExpExecArray | null;

  // 1. MESAS RÚSTICAS
  const mesaPatterns = [
    new RegExp(`${QTY_CAPTURE}?\\s*${MESA_GROUP}\\s*(?:de\\s+)?([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${MESA_GROUP}`, 'gi'),
  ];
  for (let i = 0; i < mesaPatterns.length; i++) {
    const regex = mesaPatterns[i];
    while ((match = regex.exec(processingText)) !== null) {
      const hasBenches = match[0].includes('banco') || processingText.includes('banco');
      const qty = parseQtyValue(match[1]);
      const length = i === 0 && match[2] ? parseFloat(match[2]) : 2.5;
      const tablePrice = calculateTablePrice(length, localWood, hasBenches);
      results.push({
        id: 'parsed_' + Math.random().toString(36).substring(2, 11),
        type: 'mesa',
        originalText: match[0].trim(),
        matchedKeyword: match[0].trim(),
        quantity: qty,
        length,
        hasBenches,
        product: {
          id: 'proj_mesa_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          code: `MESA-${localWood.slice(0, 3).toUpperCase()}-${length.toFixed(0)}`,
          name: `Mesa Rústica ${localWood} ${length}m${hasBenches ? ' + 2 Bancos' : ''}`,
          price: tablePrice,
          unit: 'UN',
          description: `Mesa de prancha maciça em ${localWood} (${length}m) com acabamento selecionado.`,
        },
        confidence: 0.96,
      });
      consumeMatch(match);
    }
  }

  // 2. PORTEIRAS / CANCELAS
  const porteiraPatterns = [
    new RegExp(`${QTY_CAPTURE}?\\s*${PORTEIRA_GROUP}\\s*(?:de\\s+)?([\\d.]+)\\s*(?:m)?\\s*(?:x|a|\\s)\\s*([\\d.]+)\\s*(?:m)?(?:\\s*(?:de|com)?\\s*(\\d+)\\s*reguas?)?`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${PORTEIRA_GROUP}\\s*(?:de\\s+)?([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${PORTEIRA_GROUP}`, 'gi'),
  ];
  for (let i = 0; i < porteiraPatterns.length; i++) {
    const regex = porteiraPatterns[i];
    while ((match = regex.exec(processingText)) !== null) {
      const qty = parseQtyValue(match[1]);
      let width = 3.0;
      let height = 1.8;
      let rails = 4;
      if (i === 0) {
        width = match[2] ? parseFloat(match[2]) : 3.0;
        height = match[3] ? parseFloat(match[3]) : 1.8;
        rails = match[4] ? parseInt(match[4], 10) : 4;
      } else if (i === 1) {
        width = match[2] ? parseFloat(match[2]) : 3.0;
      }
      const gatePrice = calculateGatePrice(width, height, rails, localWood + ' Tratado');
      results.push({
        id: 'parsed_' + Math.random().toString(36).substring(2, 11),
        type: 'porteira',
        originalText: match[0].trim(),
        matchedKeyword: match[0].trim(),
        quantity: qty,
        width,
        height,
        rails,
        product: {
          id: 'proj_port_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          code: `PORT-${localWood.slice(0, 3).toUpperCase()}-${width.toFixed(0)}${height.toFixed(0)}`,
          name: `Porteira ${localWood} ${width}m x ${height}m`,
          price: gatePrice,
          unit: 'UN',
          description: `Porteira de alta resistência sob medida em ${localWood} com ${rails} réguas.`,
        },
        confidence: 0.96,
      });
      consumeMatch(match);
    }
  }

  // 3. TORAS ROLIÇAS (HUBER m³)
  const toraPatterns = [
    new RegExp(`${QTY_CAPTURE}?\\s*${TORA_GROUP}\\s*(?:de\\s+|com\\s+|ø\\s*)?(\\d+(?:\\.\\d+)?)\\s*cm\\s*(?:de\\s+diametro\\s*)?(?:de|com|x)?\\s*([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${TORA_GROUP}\\s*(?:de\\s+)?([\\d.]+)\\s*(?:m|metros?)\\s*(?:de|com|ø)?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:cm)?`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${TORA_GROUP}\\s*(?:de|com|ø)?\\s*(\\d+(?:\\.\\d+)?)\\s*cm`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${TORA_GROUP}\\s*(?:de|com)?\\s*([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
    new RegExp(`${QTY_CAPTURE}?\\s*${TORA_GROUP}`, 'gi'),
  ];
  for (let i = 0; i < toraPatterns.length; i++) {
    const regex = toraPatterns[i];
    while ((match = regex.exec(processingText)) !== null) {
      const qty = parseQtyValue(match[1]);
      let diameter = 35;
      let length = 4.0;
      if (i === 0) {
        diameter = parseFloat(match[2]) || 35;
        length = parseFloat(match[3]) || 4.0;
      } else if (i === 1) {
        length = parseFloat(match[2]) || 4.0;
        diameter = parseFloat(match[3]) || 35;
      } else if (i === 2) {
        diameter = parseFloat(match[2]) || 35;
      } else if (i === 3) {
        length = parseFloat(match[2]) || 4.0;
      }
      const matchedProd = findCatalogMatch(catalogProducts, 'tora', woodLower);
      results.push({
        id: 'parsed_' + Math.random().toString(36).substring(2, 11),
        type: 'tora',
        originalText: match[0].trim(),
        matchedKeyword: match[0].trim(),
        quantity: qty,
        diameter,
        length,
        product: matchedProd,
        confidence: 0.92,
      });
      consumeMatch(match);
    }
  }

  // 4. PEDIDOS EM METROS LINEARES GRANDES (ex: 300m de ripão, 100 metros de ripa)
  // Nota: Se vier "50m de régua de 3m", já divide ou mantém opção no card.
  const linearCategories: { type: ParsedItemType; group: string; defaultWidth: number; defaultThickness: number }[] = [
    { type: 'ripao', group: RIPAO_GROUP, defaultWidth: 5, defaultThickness: 3 },
    { type: 'ripa', group: RIPA_GROUP, defaultWidth: 4, defaultThickness: 2 },
    { type: 'regua', group: REGUA_GROUP, defaultWidth: 15, defaultThickness: 3 },
    { type: 'caibro', group: CAIBRO_GROUP, defaultWidth: 6, defaultThickness: 4 },
    { type: 'tabua', group: TABUA_GROUP, defaultWidth: 30, defaultThickness: 2 },
    { type: 'prancha', group: PRANCHA_GROUP, defaultWidth: 30, defaultThickness: 6 },
    { type: 'peca', group: PECA_GROUP, defaultWidth: 11, defaultThickness: 6 },
    { type: 'pilar', group: MOURAO_PILAR_GROUP, defaultWidth: 15, defaultThickness: 15 },
  ];

  for (const cat of linearCategories) {
    const patternA = new RegExp(
      `${LINEAR_QTY_CAPTURE}\\s*(?:metros?\\s+lineares|metros?\\s+corridos?|metro\\s+corrido|metros?|mts?|ml|m)\\s*(?:de\\s+)?${cat.group}` +
      `(?:\\s*(?:de|com|x)?\\s*(\\d+)\\s*x\\s*(\\d+))?` +
      `(?:\\s*(?:em\\s+pecas?\\s+de|cortados?\\s+em|cortados?\\s+de|de|com)\\s*([\\d.]+)\\s*(?:m|metros?))?`,
      'gi'
    );
    while ((match = patternA.exec(processingText)) !== null) {
      const totalMeters = parseLinearQty(match[1]);
      const w = match[2] ? parseInt(match[2], 10) : cat.defaultWidth;
      const th = match[3] ? parseInt(match[3], 10) : cat.defaultThickness;
      const pieceCutHint = match[4] ? parseFloat(match[4]) : undefined;
      const matchedProd = findCatalogMatch(catalogProducts, cat.type, woodLower, w, th);

      results.push({
        id: 'parsed_' + Math.random().toString(36).substring(2, 11),
        type: cat.type,
        originalText: match[0].trim(),
        matchedKeyword: match[0].trim(),
        quantity: pieceCutHint && pieceCutHint > 0 ? Math.ceil(totalMeters / pieceCutHint) : totalMeters,
        length: pieceCutHint && pieceCutHint > 0 ? pieceCutHint : 1.0,
        width: w,
        thickness: th,
        product: matchedProd,
        confidence: 0.96,
        totalLinearMeters: totalMeters,
        linearMode: pieceCutHint && pieceCutHint > 0 ? 'pieces' : 'linear',
        splitPieceLength: pieceCutHint || 3.0,
      });
      consumeMatch(match);
    }

    const patternB = new RegExp(
      `${cat.group}(?:\\s*(?:de|com|x)?\\s*(\\d+)\\s*x\\s*(\\d+))?\\s*(?:de|com|x)?\\s*${LINEAR_QTY_CAPTURE}\\s*(?:metros?\\s+lineares|metros?\\s+corridos?|metro\\s+corrido|metros?|mts?|ml|m)(?:\\s*(?:em\\s+pecas?\\s+de|cortados?\\s+em|cortados?\\s+de|de|com)\\s*([\\d.]+)\\s*(?:m|metros?))?`,
      'gi'
    );
    while ((match = patternB.exec(processingText)) !== null) {
      const w = match[1] ? parseInt(match[1], 10) : cat.defaultWidth;
      const th = match[2] ? parseInt(match[2], 10) : cat.defaultThickness;
      const totalMeters = parseLinearQty(match[3]);
      const pieceCutHint = match[4] ? parseFloat(match[4]) : undefined;
      const matchedProd = findCatalogMatch(catalogProducts, cat.type, woodLower, w, th);

      results.push({
        id: 'parsed_' + Math.random().toString(36).substring(2, 11),
        type: cat.type,
        originalText: match[0].trim(),
        matchedKeyword: match[0].trim(),
        quantity: pieceCutHint && pieceCutHint > 0 ? Math.ceil(totalMeters / pieceCutHint) : totalMeters,
        length: pieceCutHint && pieceCutHint > 0 ? pieceCutHint : 1.0,
        width: w,
        thickness: th,
        product: matchedProd,
        confidence: 0.96,
        totalLinearMeters: totalMeters,
        linearMode: pieceCutHint && pieceCutHint > 0 ? 'pieces' : 'linear',
        splitPieceLength: pieceCutHint || 3.0,
      });
      consumeMatch(match);
    }
  }

  // 5. CATEGORIAS POR PEÇAS / UNIDADES (Ordem específica para não colidir)
  const unitSpecs: {
    type: ParsedItemType;
    group: string;
    defW: number;
    defT: number;
    defL: number;
  }[] = [
    { type: 'pilar', group: MOURAO_PILAR_GROUP, defW: 15, defT: 15, defL: 3.0 },
    { type: 'regua', group: REGUA_GROUP, defW: 15, defT: 3, defL: 3.0 },
    { type: 'ripao', group: RIPAO_GROUP, defW: 5, defT: 3, defL: 3.0 },
    { type: 'ripa', group: RIPA_GROUP, defW: 4, defT: 2, defL: 3.0 },
    { type: 'caibro', group: CAIBRO_GROUP, defW: 6, defT: 4, defL: 3.0 },
    { type: 'prancha', group: PRANCHA_GROUP, defW: 30, defT: 6, defL: 3.0 },
    { type: 'tabua', group: TABUA_GROUP, defW: 30, defT: 2, defL: 3.0 },
    { type: 'peca', group: PECA_GROUP, defW: 11, defT: 6, defL: 3.0 },
  ];

  for (const spec of unitSpecs) {
    const patterns = [
      // Qty + Term + Section (11x6) + Length (4.5m)
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}(?:\\s+(?:de|com|em|eucalipto|pinus|ipe|roxinho|cedro|itauba|cumaru|jatoba))?\\s*(\\d+)\\s*x\\s*(\\d+)\\s*(?:cm)?\\s*(?:de|com|x|\\s+)?\\s*([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
      // Qty + Term + Length (4.5m) + Section (11x6)
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}\\s*(?:de|com)?\\s*([\\d.]+)\\s*(?:m|metros?)\\s*(?:de|com|x)?\\s*(\\d+)\\s*x\\s*(\\d+)(?:\\s*cm)?`, 'gi'),
      // Qty + Term + Width cm + Length m (para tábuas/pranchas: "10 tábuas de 30cm de 3m")
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}\\s*(?:de|com)?\\s*(\\d+)\\s*cm\\s*(?:de\\s+largura\\s*)?(?:de|com|x)?\\s*([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
      // Qty + Term + Diameter range ("10 estacas de 10 a 12 de 2.20m")
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}\\s*(?:de\\s+)?(\\d+)\\s*(?:a|-)\\s*(\\d+)(?:\\s*(?:de|com)?\\s*([\\d.]+)\\s*(?:m|metros?))?`, 'gi'),
      // Qty + Term + Section only ("5 pilastras 14x16")
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}\\s*(?:de|com)?\\s*(\\d+)\\s*x\\s*(\\d+)(?:\\s*cm)?`, 'gi'),
      // Qty + Term + Length only ("15 caibrinhos de 3m")
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}\\s*(?:de|com)?\\s*([\\d.]+)\\s*(?:m|metros?)`, 'gi'),
      // Qty + Term only ("15 caibrinhos")
      new RegExp(`${QTY_CAPTURE}?\\s*${spec.group}`, 'gi'),
    ];

    for (let i = 0; i < patterns.length; i++) {
      const regex = patterns[i];
      while ((match = regex.exec(processingText)) !== null) {
        const qty = parseQtyValue(match[1]);
        let w = spec.defW;
        let th = spec.defT;
        let len = spec.defL;

        if (i === 0) {
          w = parseInt(match[2], 10) || spec.defW;
          th = parseInt(match[3], 10) || spec.defT;
          len = parseFloat(match[4]) || spec.defL;
        } else if (i === 1) {
          len = parseFloat(match[2]) || spec.defL;
          w = parseInt(match[3], 10) || spec.defW;
          th = parseInt(match[4], 10) || spec.defT;
        } else if (i === 2) {
          w = parseInt(match[2], 10) || spec.defW;
          len = parseFloat(match[3]) || spec.defL;
        } else if (i === 3) {
          const dMin = parseInt(match[2], 10);
          const dMax = parseInt(match[3], 10);
          w = Math.round((dMin + dMax) / 2);
          th = w;
          len = match[4] ? parseFloat(match[4]) : spec.defL;
        } else if (i === 4) {
          w = parseInt(match[2], 10) || spec.defW;
          th = parseInt(match[3], 10) || spec.defT;
        } else if (i === 5) {
          len = parseFloat(match[2]) || spec.defL;
        }

        const matchedProd = findCatalogMatch(catalogProducts, spec.type, woodLower, w, th);
        results.push({
          id: 'parsed_' + Math.random().toString(36).substring(2, 11),
          type: spec.type,
          originalText: match[0].trim(),
          matchedKeyword: match[0].trim(),
          quantity: qty,
          length: len,
          width: w,
          thickness: th,
          product: matchedProd,
          confidence: i <= 2 ? 0.95 : 0.90,
        });
        consumeMatch(match);
      }
    }
  }

  // 6. FALLBACK ISOLADO SEM PALAVRA-CHAVE (ex: "12 de 11x6 de 4.5m" ou "10 6x4 com 3m")
  const isolatedPattern = /(\d+)\s*(?:un|und|pç|pc)?\s*(?:de\s+)?(\d+)\s*x\s*(\d+)\s*(?:de|com|x)?\s*([\d.]+)\s*(?:m|metros?)/gi;
  while ((match = isolatedPattern.exec(processingText)) !== null) {
    const qty = parseInt(match[1], 10) || 1;
    const width = parseInt(match[2], 10);
    const thickness = parseInt(match[3], 10);
    const length = parseFloat(match[4]);
    const matchedProd = findCatalogMatch(catalogProducts, 'peca', woodLower, width, thickness);

    results.push({
      id: 'parsed_' + Math.random().toString(36).substring(2, 11),
      type: 'peca',
      originalText: match[0].trim(),
      matchedKeyword: `${width}x${thickness}`,
      quantity: qty,
      length,
      width,
      thickness,
      product: matchedProd,
      confidence: 0.85,
    });
    consumeMatch(match);
  }

  return results;
}

/**
 * Motor Offline Corrigido de Decodificação de Pedidos do WhatsApp
 */
export function parseWhatsAppOrder(rawText: string, catalogProducts: Product[]): ParsedOrderItem[] {
  if (!rawText || !rawText.trim()) return [];
  const normalized = normalizePortugueseOrderText(rawText);
  const globalWood = detectWoodSpecies(normalized);
  const clauses = splitOrderIntoClauses(normalized);

  const allItems: ParsedOrderItem[] = [];
  for (const clause of clauses) {
    const clauseItems = parseSingleClause(clause, catalogProducts, globalWood);
    allItems.push(...clauseItems);
  }
  return allItems;
}

export interface AIDecodedItemPayload {
  type: string;
  originalSnippet?: string;
  quantity: number;
  lengthMeters?: number;
  widthCm?: number;
  thicknessCm?: number;
  diameterCm?: number;
  heightMeters?: number;
  rails?: number;
  hasBenches?: boolean;
  isLinearOrder?: boolean;
}

/**
 * Converte itens estruturados retornados pela API Gemini em ParsedOrderItem compatíveis com a cesta
 */
export function mapAIDecodedItemsToParsedOrder(
  aiItems: AIDecodedItemPayload[],
  woodSpecies: string,
  catalogProducts: Product[]
): ParsedOrderItem[] {
  const validTypes: ParsedItemType[] = [
    'peca', 'regua', 'ripa', 'ripao', 'caibro', 'viga',
    'tabua', 'prancha', 'pilar', 'tora', 'porteira', 'mesa'
  ];
  const woodLower = stripAccents(woodSpecies || 'eucalipto');

  return aiItems.map((raw) => {
    const normType = stripAccents(raw.type || 'peca') as ParsedItemType;
    const itemType: ParsedItemType = validTypes.includes(normType) ? normType : 'peca';
    const qty = Math.max(1, Number(raw.quantity) || 1);

    if (itemType === 'porteira') {
      const w = Number(raw.widthCm) || 3.0;
      const h = Number(raw.heightMeters) || 1.8;
      const rails = Number(raw.rails) || 4;
      const price = calculateGatePrice(w, h, rails, woodSpecies + ' Tratado');
      return {
        id: 'ai_parsed_' + Math.random().toString(36).substring(2, 11),
        type: 'porteira',
        originalText: raw.originalSnippet || `Porteira ${w}m x ${h}m`,
        matchedKeyword: 'IA Smart Decode',
        quantity: qty,
        width: w,
        height: h,
        rails,
        product: {
          id: 'proj_port_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          code: `PORT-${woodSpecies.slice(0, 3).toUpperCase()}-${w.toFixed(0)}${h.toFixed(0)}`,
          name: `Porteira ${woodSpecies} ${w}m x ${h}m`,
          price,
          unit: 'UN',
          description: `Porteira sob medida em ${woodSpecies} com ${rails} réguas.`,
        },
        confidence: 0.99,
      };
    }

    if (itemType === 'mesa') {
      const len = Number(raw.lengthMeters) || 2.5;
      const hasBenches = Boolean(raw.hasBenches);
      const price = calculateTablePrice(len, woodSpecies, hasBenches);
      return {
        id: 'ai_parsed_' + Math.random().toString(36).substring(2, 11),
        type: 'mesa',
        originalText: raw.originalSnippet || `Mesa Rústica ${len}m`,
        matchedKeyword: 'IA Smart Decode',
        quantity: qty,
        length: len,
        hasBenches,
        product: {
          id: 'proj_mesa_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          code: `MESA-${woodSpecies.slice(0, 3).toUpperCase()}-${len.toFixed(0)}`,
          name: `Mesa Rústica ${woodSpecies} ${len}m${hasBenches ? ' + 2 Bancos' : ''}`,
          price,
          unit: 'UN',
          description: `Mesa rústica em ${woodSpecies} (${len}m).`,
        },
        confidence: 0.99,
      };
    }

    const w = raw.widthCm ? Number(raw.widthCm) : undefined;
    const th = raw.thicknessCm ? Number(raw.thicknessCm) : undefined;
    const diam = raw.diameterCm ? Number(raw.diameterCm) : undefined;
    const len = raw.lengthMeters ? Number(raw.lengthMeters) : (raw.isLinearOrder ? 1.0 : 3.0);
    const matchedProd = findCatalogMatch(catalogProducts, itemType, woodLower, w, th);

    return {
      id: 'ai_parsed_' + Math.random().toString(36).substring(2, 11),
      type: itemType,
      originalText: raw.originalSnippet || `${qty}x ${itemType}`,
      matchedKeyword: 'IA Smart Decode',
      quantity: qty,
      length: len,
      width: w,
      thickness: th,
      diameter: diam,
      product: matchedProd,
      confidence: 0.98,
      totalLinearMeters: raw.isLinearOrder ? qty : undefined,
      linearMode: raw.isLinearOrder ? 'linear' : 'pieces',
      splitPieceLength: 3.0,
    };
  });
}

export const PRESET_EXAMPLES = [
  {
    title: '📏 Metragens Lineares Grandes (300m ripão, 100m ripa, 400m régua)',
    text: 'Quero 300 metros de ripão, 100 metros de ripa e 400 metros de régua de eucalipto',
  },
  {
    title: '🪵 Peças, Dúzias & Meios Metros',
    text: '2 dúzias de caibrinhos de 4 metros e meio, meia dúzia de peças 11x6 de 4m e 10 ripãozinho de 3m',
  },
  {
    title: '🌲 Toras Huber & Pranchões',
    text: '8 toras de eucalipto 38cm com 5m, e 3 pranchões de 30x6 de 4 metros',
  },
  {
    title: '📋 Teste Geral Misto Completo',
    text: 'seguinte patrão quero 50m de régua de 3m, 12 peças de 4,5m de 11x6, 2 porteiras de 3m por 1,80m de 4 réguas e 5 pilastras de 14x16 tudo de eucalipto.',
  },
];
