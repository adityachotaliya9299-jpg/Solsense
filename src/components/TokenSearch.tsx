'use client';

import { useState } from 'react';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { getTokenOverview } from '@/lib/birdeye';
import PriceChart from './PriceChart';

const POPULAR = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { symbol: 'JTO', address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt' },
  { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
  { symbol: 'PYTH', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
];

interface TokenData {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  price: number;
  priceChange24hPercent: number;
  v24hUSD: number;
  mc: number;
}

export default function TokenSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChart, setShowChart] = useState(false);

  async function search(address?: string) {
    const addr = address || query.trim();
    if (!addr) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getTokenOverview(addr);
      if (data?.data) {
        setResult({ ...data.data, address: addr });
      } else {
        setError('Token not found. Try a Solana token address.');
      }
    } catch {
      setError('Error fetching token data.');
    }
    setLoading(false);
  }

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatLarge = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return formatUSD(val);
  };

  return (
    <div className="rounded-2xl backdrop-blur-sm"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <h2 className="font-bold flex items-center gap-2 mb-4">
          <Search size={16} className="text-purple-400" /> Token Search
        </h2>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={14} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Enter Solana token address..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
            />
            {query && (
              <button onClick={() => { setQuery(''); setResult(null); setError(''); }}>
                <X size={14} className="text-gray-500 hover:text-white" />
              </button>
            )}
          </div>
          <button onClick={() => search()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            Search
          </button>
        </div>

        {/* Popular tokens */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Quick:</span>
          {POPULAR.map((t) => (
            <button key={t.address} onClick={() => { setQuery(t.address); search(t.address); }}
              className="text-xs px-2.5 py-1 rounded-full transition-all hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
              {t.symbol}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !result && !error && (
          <div className="text-center py-8 text-gray-500">
            <Search size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">Search any Solana token by address</p>
            <p className="text-xs mt-1">Or click a quick token above</p>
          </div>
        )}

        {result && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.logoURI
                  ? <img src={result.logoURI} className="w-12 h-12 rounded-full" style={{ width: 48, height: 48, minWidth: 48 }} alt={result.symbol} />
                  : <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', width: 48, height: 48, minWidth: 48 }}>
                      {result.symbol?.slice(0, 2)}
                    </div>
                }
                <div>
                  <div className="font-bold text-xl">{result.symbol}</div>
                  <div className="text-sm text-gray-400">{result.name}</div>
                </div>
              </div>
              <button onClick={() => setShowChart(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}>
                📈 View Chart
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Price', value: result.price < 0.01 ? `$${result.price?.toFixed(6)}` : `$${result.price?.toFixed(4)}` },
                { label: '24h Change', value: `${(result.priceChange24hPercent || 0) >= 0 ? '+' : ''}${(result.priceChange24hPercent || 0).toFixed(2)}%`, color: (result.priceChange24hPercent || 0) >= 0 ? '#22c55e' : '#ef4444' },
                { label: '24h Volume', value: formatLarge(result.v24hUSD || 0) },
                { label: 'Market Cap', value: formatLarge(result.mc || 0) },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="font-bold text-sm" style={{ color: s.color || 'white' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showChart && result && (
        <PriceChart
          token={{ address: result.address, symbol: result.symbol, priceUsd: result.price, priceChange24h: result.priceChange24hPercent, logoURI: result.logoURI }}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
}