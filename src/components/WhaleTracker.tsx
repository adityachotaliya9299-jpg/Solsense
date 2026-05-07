'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface TopToken {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  price: number;
  v24hChangePercent: number;
  v24hUSD: number;
  mc: number;
}

export default function WhaleTracker() {
  const [tokens, setTokens] = useState<TopToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(
        'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=20',
        { headers: { 'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '', 'x-chain': 'solana' } }
      );
      const data = await res.json();
      if (data?.data?.tokens) {
        setTokens(data.data.tokens);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const formatUSD = (val: number) => {
    if (!val || isNaN(val)) return '$0';
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  const filtered = tokens.filter(t => {
    if (filter === 'gainers') return (t.v24hChangePercent || 0) > 0;
    if (filter === 'losers') return (t.v24hChangePercent || 0) < 0;
    return true;
  });

  const totalVolume = tokens.reduce((sum, t) => sum + (t.v24hUSD || 0), 0);

  return (
    <div className="space-y-4">
      {/* Volume Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total 24h Volume', value: formatUSD(totalVolume), color: '#a78bfa' },
          { label: 'Top Gainer', value: tokens.length ? `${tokens.sort((a,b) => (b.v24hChangePercent||0)-(a.v24hChangePercent||0))[0]?.symbol} +${tokens[0]?.v24hChangePercent?.toFixed(1)}%` : '-', color: '#22c55e' },
          { label: 'Tokens Tracked', value: `${tokens.length} tokens`, color: '#38bdf8' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl backdrop-blur-sm"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-bold flex items-center gap-2">
              🐋 Market Volume Tracker
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}>
                Live Birdeye Data
              </span>
            </h2>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-0.5">
                Updated {lastUpdated.toLocaleTimeString()} • Refreshes every 60s
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'gainers', 'losers'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                style={{
                  background: filter === f ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.06)',
                  color: filter === f ? 'white' : '#6b7280',
                }}>
                {f}
              </button>
            ))}
            <button onClick={fetchData}
              className="p-2 rounded-lg text-gray-400 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {loading && tokens.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-6 px-5 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              {['#', 'Token', 'Price', '24h Change', '24h Volume', 'Market Cap'].map((h) => (
                <div key={h} className="text-xs text-gray-500 font-medium">{h}</div>
              ))}
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {filtered.map((token, i) => (
                <div key={`${token.address}-${i}`}
                  className="grid grid-cols-6 items-center px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="text-xs text-gray-600">{i + 1}</div>
                  <div className="flex items-center gap-2">
                    {token.logoURI
                      ? <img src={token.logoURI} alt={token.symbol}
                          style={{ width: 28, height: 28, minWidth: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 28, height: 28, minWidth: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                          {token.symbol?.slice(0, 2)}
                        </div>
                    }
                    <div>
                      <div className="text-sm font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-500 truncate max-w-16">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    ${token.price < 0.01 ? token.price?.toFixed(6) : token.price?.toFixed(3)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(token.v24hChangePercent || 0) >= 0
                      ? <TrendingUp size={12} />
                      : <TrendingDown size={12} />
                    }
                    {(token.v24hChangePercent || 0) >= 0 ? '+' : ''}{(token.v24hChangePercent || 0).toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-300">{formatUSD(token.v24hUSD)}</div>
                  <div className="text-sm text-gray-400">{formatUSD(token.mc)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}