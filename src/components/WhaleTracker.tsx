'use client';

import { useEffect, useState } from 'react';
import { getWhaleTransactions } from '@/lib/birdeye';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface WhaleTx {
  txHash: string;
  blockUnixTime: number;
  from: { address: string };
  to: { address: string };
  volumeUSD: number;
  side: string;
}

export default function WhaleTracker() {
  const [txs, setTxs] = useState<WhaleTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchWhales();
    const interval = setInterval(fetchWhales, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWhales() {
  setLoading(true);
  try {
    const data = await getWhaleTransactions();
    console.log('Whale data:', data); // check browser console
    if (data?.data?.items) {
      setTxs(data.data.items.slice(0, 10));
      setLastUpdated(new Date());
    }
  } catch (e) {
    console.error(e);
  }
  setLoading(false);
}

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const getSize = (vol: number) => {
    if (vol > 1000000) return { label: 'MEGA', color: '#f59e0b' };
    if (vol > 100000) return { label: 'LARGE', color: '#a78bfa' };
    return { label: 'MID', color: '#38bdf8' };
  };

  return (
    <div className="rounded-2xl backdrop-blur-sm"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between p-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div>
          <h2 className="font-bold flex items-center gap-2">
            🐋 Whale Tracker
            <span className="text-xs px-2 py-0.5 rounded-full font-normal"
              style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}>
              Live SOL swaps
            </span>
          </h2>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-0.5">
              Updated {lastUpdated.toLocaleTimeString()} • Refreshes every 30s
            </p>
          )}
        </div>
        <button onClick={fetchWhales}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {loading && txs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Scanning for whale activity...</p>
          </div>
        </div>
      ) : txs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">🐋</p>
          <p>No large transactions found right now</p>
         <p className="text-xs mt-1">Threshold: All transactions</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {txs.slice(0, 10).map((tx) => {
            const size = getSize(tx.volumeUSD);
            return (
              <div key={tx.txHash}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${size.color}22`, color: size.color }}>
                    {size.label}
                  </span>
                  <div>
                    <div className="font-mono text-xs text-gray-400">
                      {tx.from?.address?.slice(0, 8)}... → {tx.to?.address?.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">{formatTime(tx.blockUnixTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${tx.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.side === 'buy' ? '▲ BUY' : '▼ SELL'}
                  </span>
                  <span className="font-bold text-white">{formatUSD(tx.volumeUSD)}</span>
                  <a href={`https://solscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors">
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}