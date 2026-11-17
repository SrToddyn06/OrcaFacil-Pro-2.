import { Product, UnitType } from '../types';

/**
 * Utilitários de Exportação e Importação de Itens/Materiais (Madeiras)
 * Suporta formatos CSV (Excel pt-BR com BOM UTF-8) e JSON.
 */

const CSV_HEADER = 'Código;Nome;Categoria;Unidade;Preço (R$);Espessura (cm);Largura (cm);Comprimento (m);Diâmetro (cm);Descrição';

/**
 * Escapa valores para CSV padrão RFC 4180 / Excel
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Desescapa valores de uma linha CSV
 */
function splitCsvLine(line: string, delimiter: string = ';'): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // pular aspa duplicada
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Converte lista de produtos para texto CSV compatível com Excel (pt-BR)
 */
export function exportProductsToCSV(products: Product[]): string {
  const lines: string[] = [CSV_HEADER];

  products.forEach(p => {
    const row = [
      escapeCsvValue(p.code || ''),
      escapeCsvValue(p.name || ''),
      escapeCsvValue(p.category || 'Madeiras'),
      escapeCsvValue(p.unit || 'M'),
      escapeCsvValue(p.price !== undefined ? p.price.toFixed(2).replace('.', ',') : '0,00'),
      escapeCsvValue(p.thickness !== undefined ? p.thickness : ''),
      escapeCsvValue(p.width !== undefined ? p.width : ''),
      escapeCsvValue(p.length !== undefined ? p.length : ''),
      escapeCsvValue(p.diameter !== undefined ? p.diameter : ''),
      escapeCsvValue(p.description || '')
    ];
    lines.push(row.join(';'));
  });

  return '\uFEFF' + lines.join('\r\n'); // BOM para garantir acentuação correta no Excel Windows
}

/**
 * Baixa diretamente o arquivo CSV no navegador
 */
export function downloadProductsCSV(products: Product[], customFilename?: string): string {
  const csvContent = exportProductsToCSV(products);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `catalogo_madeiras_itens_${dateStr}.csv`;
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Converte lista de produtos para JSON formatado
 */
export function exportProductsToJSON(products: Product[]): string {
  const payload = {
    app: 'OrcaFacil Pro',
    version: '1.0.3',
    type: 'products_only',
    exportedAt: new Date().toISOString(),
    totalItems: products.length,
    products: products
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Baixa arquivo JSON de produtos
 */
export function downloadProductsJSON(products: Product[], customFilename?: string): string {
  const jsonContent = exportProductsToJSON(products);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `materiais_cadastrados_${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Normaliza e sanitiza valor numérico (suporta '1.500,50' ou '1500.50' ou 'R$ 25,00')
 */
function parsePriceNumber(raw: string): number {
  if (!raw) return 0;
  const clean = raw.replace(/[^\d.,-]/g, '').trim();
  if (clean.includes(',') && clean.includes('.')) {
    // Ex: 1.500,50
    return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0;
  }
  if (clean.includes(',')) {
    return parseFloat(clean.replace(',', '.')) || 0;
  }
  return parseFloat(clean) || 0;
}

/**
 * Normaliza Unidade
 */
function normalizeUnit(raw: string): UnitType {
  const u = (raw || '').trim().toUpperCase();
  if (u === 'M3' || u === 'M³' || u === 'METRO CUBICO' || u === 'METRO CÚBICO') return 'M3';
  if (u === 'M3_BLOCO' || u === 'BLOCO' || u === 'PRANCHÃO' || u === 'PRANCHAO') return 'M3_BLOCO';
  if (u === 'PRANCHA') return 'PRANCHA';
  if (u === 'TABUA' || u === 'TÁBUA') return 'TABUA';
  if (u === 'M' || u === 'MT' || u === 'METRO' || u === 'METRO LINEAR') return 'M';
  if (u === 'M2' || u === 'M²' || u === 'METRO QUADRADO') return 'M2';
  if (u === 'MIL' || u === 'MILHEIRO') return 'MIL';
  if (u === 'HORA' || u === 'HR') return 'HORA';
  if (u === 'DIARIA' || u === 'DIÁRIA') return 'DIARIA';
  if (u === 'KG') return 'KG';
  if (u === 'TON') return 'TON';
  if (u === 'ST') return 'ST';
  return 'UN';
}

/**
 * Faz o parsing de texto CSV ou tabela colada
 */
export function parseProductsFromCSV(rawText: string): {
  success: boolean;
  products: Product[];
  errors: string[];
} {
  const errors: string[] = [];
  if (!rawText || !rawText.trim()) {
    return { success: false, products: [], errors: ['Arquivo ou texto vazio.'] };
  }

  // Remove BOM se presente
  const cleanText = rawText.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanText.split(/\r?\n/).filter(l => l.trim().length > 0);

  if (rawLines.length === 0) {
    return { success: false, products: [], errors: ['Nenhuma linha encontrada.'] };
  }

  // Detecta o delimitador na primeira linha (; ou , ou \t ou |)
  const firstLine = rawLines[0];
  let delimiter = ';';
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const pipeCount = (firstLine.match(/\|/g) || []).length;

  if (pipeCount > semiCount && pipeCount > commaCount) delimiter = '|';
  else if (tabCount > semiCount && tabCount > commaCount) delimiter = '\t';
  else if (commaCount > semiCount && semiCount === 0) delimiter = ',';

  // Detecta se a primeira linha é cabeçalho
  const colHeaders = splitCsvLine(firstLine, delimiter).map(h => 
    h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  );

  let hasHeader = false;
  let codeIdx = -1;
  let nameIdx = -1;
  let catIdx = -1;
  let unitIdx = -1;
  let priceIdx = -1;
  let thIdx = -1;
  let widthIdx = -1;
  let lenIdx = -1;
  let diaIdx = -1;
  let descIdx = -1;

  colHeaders.forEach((header, idx) => {
    if (header.includes('codigo') || header.includes('sku') || header === 'cod') {
      codeIdx = idx;
      hasHeader = true;
    } else if (header.includes('nome') || header.includes('material') || header.includes('madeira') || header.includes('produto') || header.includes('item')) {
      nameIdx = idx;
      hasHeader = true;
    } else if (header.includes('categoria') || header.includes('grupo') || header.includes('tipo')) {
      catIdx = idx;
      hasHeader = true;
    } else if (header.includes('unidade') || header === 'un' || header === 'unid') {
      unitIdx = idx;
      hasHeader = true;
    } else if (header.includes('preco') || header.includes('valor') || header.includes('custo')) {
      priceIdx = idx;
      hasHeader = true;
    } else if (header.includes('espessura') || header.includes('bitola') || header === 'esp') {
      thIdx = idx;
      hasHeader = true;
    } else if (header.includes('largura') || header === 'larg') {
      widthIdx = idx;
      hasHeader = true;
    } else if (header.includes('comprimento') || header === 'comp' || header === 'tam') {
      lenIdx = idx;
      hasHeader = true;
    } else if (header.includes('diametro') || header === 'diam') {
      diaIdx = idx;
      hasHeader = true;
    } else if (header.includes('descricao') || header.includes('obs')) {
      descIdx = idx;
      hasHeader = true;
    }
  });

  // Se não foi identificado cabeçalho, assume posições padrão
  if (!hasHeader || nameIdx === -1) {
    codeIdx = 0;
    nameIdx = 1;
    catIdx = 2;
    unitIdx = 3;
    priceIdx = 4;
    thIdx = 5;
    widthIdx = 6;
    lenIdx = 7;
    diaIdx = 8;
    descIdx = 9;
    hasHeader = false;
  }

  const startRow = hasHeader ? 1 : 0;
  const parsedProducts: Product[] = [];

  for (let i = startRow; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line.trim()) continue;

    const cols = splitCsvLine(line, delimiter);
    const rawName = (nameIdx >= 0 && cols[nameIdx]) ? cols[nameIdx] : '';
    if (!rawName.trim()) continue; // pula linhas sem nome

    const rawCode = (codeIdx >= 0 && cols[codeIdx]) 
      ? cols[codeIdx].trim().toUpperCase() 
      : `ITEM-${parsedProducts.length + 1}`;

    const rawCategory = (catIdx >= 0 && cols[catIdx]) ? cols[catIdx].trim() : 'Madeiras';
    const rawUnit = (unitIdx >= 0 && cols[unitIdx]) ? cols[unitIdx] : 'M';
    const rawPrice = (priceIdx >= 0 && cols[priceIdx]) ? cols[priceIdx] : '0';
    const rawTh = (thIdx >= 0 && cols[thIdx]) ? cols[thIdx] : '';
    const rawWd = (widthIdx >= 0 && cols[widthIdx]) ? cols[widthIdx] : '';
    const rawLen = (lenIdx >= 0 && cols[lenIdx]) ? cols[lenIdx] : '';
    const rawDia = (diaIdx >= 0 && cols[diaIdx]) ? cols[diaIdx] : '';
    const rawDesc = (descIdx >= 0 && cols[descIdx]) ? cols[descIdx] : '';

    const price = parsePriceNumber(rawPrice);
    const thickness = rawTh ? parseFloat(rawTh.replace(',', '.')) : undefined;
    const width = rawWd ? parseFloat(rawWd.replace(',', '.')) : undefined;
    const length = rawLen ? parseFloat(rawLen.replace(',', '.')) : undefined;
    const diameter = rawDia ? parseFloat(rawDia.replace(',', '.')) : undefined;

    const prod: Product = {
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      code: rawCode,
      name: rawName.trim(),
      category: rawCategory,
      unit: normalizeUnit(rawUnit),
      price: price,
      description: rawDesc.trim(),
      thickness: (!isNaN(thickness as any) && (thickness as number) > 0) ? thickness : undefined,
      width: (!isNaN(width as any) && (width as number) > 0) ? width : undefined,
      length: (!isNaN(length as any) && (length as number) > 0) ? length : undefined,
      diameter: (!isNaN(diameter as any) && (diameter as number) > 0) ? diameter : undefined
    };

    parsedProducts.push(prod);
  }

  if (parsedProducts.length === 0) {
    return {
      success: false,
      products: [],
      errors: ['Nenhum item válido pôde ser extraído do arquivo. Verifique o cabeçalho e os campos.']
    };
  }

  return {
    success: true,
    products: parsedProducts,
    errors
  };
}

/**
 * Faz o parsing de JSON (aceita array puro ou envelope { products: [...] })
 */
export function parseProductsFromJSON(rawText: string): {
  success: boolean;
  products: Product[];
  error?: string;
} {
  try {
    const data = JSON.parse(rawText);
    let items: any[] = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.products)) {
        items = data.products;
      } else if (Array.isArray(data.items)) {
        items = data.items;
      }
    }

    if (!items || items.length === 0) {
      return { success: false, products: [], error: 'Nenhum material encontrado no código JSON informado.' };
    }

    const validated: Product[] = items.map((it, idx) => ({
      id: it.id || 'prod_' + Date.now() + '_' + idx,
      code: String(it.code || `ITEM-${idx + 1}`).trim().toUpperCase(),
      name: String(it.name || 'Madeira sem nome').trim(),
      category: it.category || 'Madeiras',
      unit: normalizeUnit(it.unit || 'M'),
      price: typeof it.price === 'number' ? it.price : parsePriceNumber(String(it.price || 0)),
      description: String(it.description || ''),
      thickness: typeof it.thickness === 'number' ? it.thickness : undefined,
      width: typeof it.width === 'number' ? it.width : undefined,
      length: typeof it.length === 'number' ? it.length : undefined,
      diameter: typeof it.diameter === 'number' ? it.diameter : undefined
    }));

    return { success: true, products: validated };
  } catch (err: any) {
    return { success: false, products: [], error: 'O texto não é um JSON válido: ' + (err.message || '') };
  }
}
