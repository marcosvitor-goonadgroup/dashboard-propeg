import { useMemo } from 'react';
import { ProcessedCampaignData } from '../types/campaign';

interface PIInfoCardProps {
  numeroPi: string | null;
  campaignData?: ProcessedCampaignData[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat('pt-BR').format(Math.round(n));

const PIInfoCard = ({ numeroPi, campaignData = [] }: PIInfoCardProps) => {
  const totais = useMemo(() => {
    return campaignData.reduce(
      (acc, item) => {
        acc.investimento += item.cost;
        acc.impressoes += item.impressions;
        acc.cliques += item.clicks;
        acc.views += item.videoViews;
        acc.completions += item.videoCompletions;
        acc.engajamento += item.totalEngagements;
        return acc;
      },
      { investimento: 0, impressoes: 0, cliques: 0, views: 0, completions: 0, engajamento: 0 }
    );
  }, [campaignData]);

  if (!numeroPi) return null;

  const ctr = totais.impressoes > 0 ? (totais.cliques / totais.impressoes) * 100 : 0;
  const vtr = totais.impressoes > 0 ? (totais.completions / totais.impressoes) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[24px] shadow-lg border border-blue-200 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">PI {numeroPi}</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">Investimento</p>
          <p className="text-sm font-semibold text-gray-800">{fmt(totais.investimento)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">Impressões</p>
          <p className="text-sm font-semibold text-gray-800">{fmtNum(totais.impressoes)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">Cliques</p>
          <p className="text-sm font-semibold text-gray-800">{fmtNum(totais.cliques)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">Views</p>
          <p className="text-sm font-semibold text-gray-800">{fmtNum(totais.views)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">CTR</p>
          <p className="text-sm font-semibold text-gray-800">{ctr.toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-1">VTR</p>
          <p className="text-sm font-semibold text-gray-800">{vtr.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default PIInfoCard;
