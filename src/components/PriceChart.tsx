'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTokenOHLCV } from '@/lib/birdeye';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  token: {
    address: string;
    symbol: string;
    priceUsd: number;
    priceChange24h?: number;
    logoURI?: string;
  };
  onClose: () => void;
}

export default function PriceChart({ token, onClose }: Props) {
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7D' | '30D'>('7D');

  useEffect(() => {
    fetchChart();
  }, [token.address, range]);

  async function fetchChart() {
    setLoading(true);
    const now = Math.floor(Date.now() / 1000);
    const from = now - (range === '7D' ? 7 : 30) * 86400;
    const data = await getTokenOHLCV(token.address, from, now);
    if (data?.data?.items) {
      const formatted = data.data.items.map((item: { unixTime: number; c: number }) => ({
        time: new Date(item.unixTime * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.c,
      }));
      setChartData(formatted);
    }
    setLoading(false);
  }

  const isPositive = (token.priceChange24h || 0) >= 0;
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-2xl rounded-2xl p-6"
        style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {token.logoURI
              ? <img src={token.logoURI} className="w-10 h-10 rounded-full" alt={token.symbol} />
              : <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  {token.symbol?.slice(0, 2)}
                </div>
            }
            <div>
              <h3 className="text-lg font-bold">{token.symbol}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  ${token.priceUsd < 0.01 ? token.priceUsd?.toFixed(6) : token.priceUsd?.toFixed(4)}
                </span>
                <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isPositive ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['7D', '30D'] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: range === r ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.06)',
                  color: range === r ? 'white' : '#6b7280',
                }}>
                {r}
              </button>
            ))}
            <button onClick={onClose}
              className="ml-2 p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center h-48 flex items-center justify-center text-gray-500">
            No chart data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[minPrice * 0.98, maxPrice * 1.02]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={70}
                  tickFormatter={(v) => `$${v < 0.01 ? v.toFixed(5) : v.toFixed(2)}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }}
                  formatter={(value: number) => [`$${value < 0.01 ? value.toFixed(6) : value.toFixed(4)}`, 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke={isPositive ? '#22c55e' : '#ef4444'}
                  strokeWidth={2} fill="url(#priceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>Low: ${minPrice < 0.01 ? minPrice.toFixed(6) : minPrice.toFixed(4)}</span>
              <span>High: ${maxPrice < 0.01 ? maxPrice.toFixed(6) : maxPrice.toFixed(4)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}