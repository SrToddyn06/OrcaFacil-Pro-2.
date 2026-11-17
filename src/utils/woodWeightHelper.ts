// Utilitário de densidade madeireira e estimativa de carga logística (Frete / Caminhão)

export interface WoodSpeciesDensity {
  key: string;
  label: string;
  greenKgPerM3: number; // Madeira verde / recém-derrubada
  dryKgPerM3: number;   // Madeira seca ao ar / estufa (AD/KD)
}

export const WOOD_DENSITIES: WoodSpeciesDensity[] = [
  { key: 'eucalipto', label: 'Eucalipto', greenKgPerM3: 980, dryKgPerM3: 750 },
  { key: 'pinus', label: 'Pinus', greenKgPerM3: 820, dryKgPerM3: 550 },
  { key: 'ipe', label: 'Ipê / Tabaco', greenKgPerM3: 1180, dryKgPerM3: 1020 },
  { key: 'cumaru', label: 'Cumaru', greenKgPerM3: 1150, dryKgPerM3: 990 },
  { key: 'jatoba', label: 'Jatobá', greenKgPerM3: 1100, dryKgPerM3: 940 },
  { key: 'itauba', label: 'Itaúba', greenKgPerM3: 1080, dryKgPerM3: 920 },
  { key: 'roxinho', label: 'Roxinho', greenKgPerM3: 1090, dryKgPerM3: 930 },
  { key: 'cedro', label: 'Cedro / Garapeira', greenKgPerM3: 880, dryKgPerM3: 680 },
];

export interface LoadEstimate {
  totalVolumeM3: number;
  estimatedKg: number;
  estimatedTons: number;
  recommendedVehicle: string;
  capacityHint: string;
}

export function estimateSpeciesDensity(speciesText?: string, isGreen = false): number {
  const s = (speciesText || '').toLowerCase();
  const found = WOOD_DENSITIES.find(d => s.includes(d.key) || (d.key === 'ipe' && s.includes('ipê')) || (d.key === 'itauba' && s.includes('itaúba')) || (d.key === 'jatoba' && s.includes('jatobá')));
  if (found) return isGreen ? found.greenKgPerM3 : found.dryKgPerM3;
  // Padrão médio comercial (Eucalipto/Mista)
  return isGreen ? 950 : 780;
}

export function calculateLoadEstimate(totalVolumeM3: number, speciesHint?: string, isGreen = false): LoadEstimate {
  const density = estimateSpeciesDensity(speciesHint, isGreen);
  const estimatedKg = Math.round(totalVolumeM3 * density);
  const estimatedTons = estimatedKg / 1000;

  let recommendedVehicle = 'Utilitário / Pick-up';
  let capacityHint = 'Até 1,2 ton (carga leve)';

  if (estimatedTons > 24) {
    recommendedVehicle = 'Bitrem / Rodotrem Florestal';
    capacityHint = 'Carga pesada acima de 24 ton';
  } else if (estimatedTons > 14) {
    recommendedVehicle = 'Carreta (3 eixos / Vanderleia)';
    capacityHint = 'Capacidade 14 a 24 ton';
  } else if (estimatedTons > 6.5) {
    recommendedVehicle = 'Caminhão Truck (3 eixos)';
    capacityHint = 'Capacidade 6,5 a 14 ton';
  } else if (estimatedTons > 3.5) {
    recommendedVehicle = 'Caminhão Toco (2 eixos)';
    capacityHint = 'Capacidade 3,5 a 6,5 ton';
  } else if (estimatedTons > 1.2) {
    recommendedVehicle = 'Caminhão 3/4 (VUC)';
    capacityHint = 'Capacidade 1,2 a 3,5 ton';
  }

  return {
    totalVolumeM3,
    estimatedKg,
    estimatedTons,
    recommendedVehicle,
    capacityHint,
  };
}
