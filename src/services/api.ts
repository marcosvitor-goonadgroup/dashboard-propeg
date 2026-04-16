import axios from 'axios';
import { ApiResponse, ProcessedCampaignData } from '../types/campaign';
import { parse } from 'date-fns';

const CAMPAIGN_API_URLS = [
  '/api-proxy/google/sheets/1bOT3vNItNiBPZzUVhVPaxdn3ICvk49TpNAuawsjL43M/data?range=Consolidado'
];

const parseNumber = (value: string): number => {
  if (!value || value === '') return 0;
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

const parseCurrency = (value: string): number => {
  if (!value || value === '') return 0;
  // Remove "R$" e espaços, depois processa como número
  const cleaned = value.replace('R$', '').trim().replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};


const parseSearchDate = (dateString: string): Date => {
  try {
    if (!dateString) return new Date();
    // Formato dd/MM/yyyy (ex: "18/06/2025")
    if (dateString.includes('/')) {
      return parse(dateString, 'dd/MM/yyyy', new Date());
    }
    // Formato yyyy-MM-dd (fallback)
    return parse(dateString, 'yyyy-MM-dd', new Date());
  } catch {
    return new Date();
  }
};

const normalizeVeiculo = (veiculo: string): string => {
  const normalized = veiculo.trim();
  const lower = normalized.toLowerCase();
  if (lower === 'audience network' || lower === 'messenger' || lower === 'threads' || lower === 'unknown') {
    return 'Facebook';
  }
  return normalized;
};

// Colunas da planilha Consolidado (índice → campo):
// [0] Nome Conta, [1] ID Conta, [2] Data, [3] Device, [4] Campaign Name, [5] Campaign ID,
// [6] Ad Group Name, [7] Ad group ID, [8] Ad Name, [9] Ad ID, [10] Ad Final URL,
// [11] Cost (Spend), [12] Impressions, [13] Clicks, [14] Video View, [15] Views 25%,
// [16] Views 50%, [17] Views 75%, [18] Views 100%, [19] VA (engajamento),
// [20] Agência, [21] Veículo, [22] Número PI, [23] Tipo de Compra, [24] Investimento,
// [25] Formato, [26] Campanha, [27] Cliente
export const fetchCampaignData = async (): Promise<ProcessedCampaignData[]> => {
  try {
    const responses = await Promise.all(
      CAMPAIGN_API_URLS.map(url => axios.get<ApiResponse>(url))
    );

    const allData: ProcessedCampaignData[] = [];

    responses.forEach(response => {
      if (response.data.success && response.data.data.values.length > 1) {
        const rows = response.data.data.values.slice(1);

        rows.forEach(row => {
          if (row.length >= 14) {
            const numeroPi = row[22] || '';
            const veiculoRaw = row[21] || '';
            const veiculo = normalizeVeiculo(veiculoRaw);
            const cliente = row[27] || '';
            const agencia = row[20] || '';

            if (numeroPi === '#VALUE!') {
              return;
            }

            const dataRow: ProcessedCampaignData = {
              date: parseSearchDate(row[2]),
              campaignName: row[4] || '',
              adSetName: row[6] || '',
              adName: row[8] || '',
              cost: parseCurrency(row[24]),
              impressions: parseNumber(row[12]),
              reach: 0,
              clicks: parseNumber(row[13]),
              videoViews: parseNumber(row[14]),
              videoViews25: parseNumber(row[15]),
              videoViews50: parseNumber(row[16]),
              videoViews75: parseNumber(row[17]),
              videoCompletions: parseNumber(row[18]),
              totalEngagements: parseNumber(row[19]),
              veiculo: veiculo,
              tipoDeCompra: row[23] || '',
              videoEstaticoAudio: row[25] || '',
              image: '',
              campanha: row[26] || '',
              numeroPi: numeroPi,
              cliente: cliente,
              agencia: agencia
            };
            allData.push(dataRow);
          }
        });
      }
    });

    return allData;
  } catch (error) {
    console.error('Erro ao buscar dados das campanhas:', error);
    throw error;
  }
};

