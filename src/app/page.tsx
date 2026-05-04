'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { getWalletPortfolio, getTopTokens, getWalletTransactions } from '@/lib/birdeye';
import { Wallet, TrendingUp, Activity, RefreshCw, ExternalLink, Zap, Shield, BarChart3 } from 'lucide-react';

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  balance: number;
  valueUsd: number;
  priceUsd: number;
  priceChange24h?: number;
}

interface Transaction {
  txHash: string;
  blockTime: number;
  status: string;
}

interface TopToken {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  price: number;
  v24hChangePercent: number;
  v24hUSD: number;
}

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [portfolio, setPortfolio] = useState<Token[]>([]);
  const [topTokens, setTopTokens] = useState<TopToken[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'activity'>('portfolio');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { fetchTopTokens(); }, []);
  useEffect(() => {
    if (connected && publicKey) {
      fetchPortfolio();
      fetchTransactions();
    }
  }, [connected, publicKey]);

  async function fetchTopTokens() {
    const data = await getTopTokens();
    if (data?.data?.tokens) setTopTokens(data.data.tokens);
  }

  async function fetchPortfolio() {
    if (!publicKey) return;
    setLoading(true);
    const data = await getWalletPortfolio(publicKey.toString());
    if (data?.data?.items) {
      const tokens = data.data.items.filter((t: Token) => t.valueUsd > 0);
      setPortfolio(tokens);
      setTotalValue(tokens.reduce((sum: number, t: Token) => sum + t.valueUsd, 0));
    }
    setLoading(false);
  }

  async function fetchTransactions() {
    if (!publicKey) return;
    const data = await getWalletTransactions(publicKey.toString());
    if (data?.data?.solana) setTransactions(data.data.solana);
  }

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  if (!mounted) return null;

  return (
    <main className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0a1a 50%, #0a0f1a 100%)' }}>

      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(60px)' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b px-8 py-4 flex items-center justify-between backdrop-blur-md"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(10,10,20,0.7)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <Zap size={18} fill="white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">SolSense</span>
            <span className="text-xs text-gray-500 ml-2">by Birdeye × Solflare</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {connected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">Mainnet</span>
            </div>
          )}
          <WalletMultiButton style={{
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            borderRadius: '12px',
            fontSize: '13px',
            padding: '8px 20px',
            height: 'auto',
          }} />
        </div>
      </nav>

      {!connected ? (
        /* ── LANDING PAGE ── */
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Shield size={12} className="text-purple-400" />
              <span className="text-purple-300">Powered by Birdeye API & Solflare Wallet</span>
            </div>
            <h1 className="text-6xl font-black mb-6 leading-tight">
              <span style={{ background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smart Wallet
              </span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Intelligence
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time Solana portfolio analytics, PnL tracking, whale movements and market intelligence — all in one dashboard.
            </p>
            <WalletMultiButton style={{
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              borderRadius: '14px',
              fontSize: '16px',
              padding: '14px 36px',
              height: 'auto',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
            }} />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-5 mb-16">
            {[
              { icon: <BarChart3 size={24} />, color: '#7c3aed', title: 'Portfolio Intelligence', desc: 'Real-time token balances, USD values and 24h PnL for every asset in your wallet.' },
              { icon: <TrendingUp size={24} />, color: '#0891b2', title: 'Market Signals', desc: 'Live top movers by volume, price changes and anomaly detection powered by Birdeye.' },
              { icon: <Activity size={24} />, color: '#059669', title: 'Transaction Timeline', desc: 'Full activity history with status, timestamps and direct Solscan links.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}22`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Live Market Preview */}
          <div className="rounded-2xl p-6 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-300">Live Market — Top Solana Tokens</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {topTokens.slice(0, 8).map((token) => (
                <div key={token.address} className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {token.logoURI
                      ? <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.symbol} />
                      : <div className="w-6 h-6 rounded-full bg-purple-800 flex items-center justify-center text-xs">{token.symbol?.slice(0,2)}</div>
                    }
                    <span className="text-sm font-semibold">{token.symbol}</span>
                  </div>
                  <div className="text-sm font-bold">${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(3)}</div>
                  <div className={`text-xs mt-0.5 font-medium ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(token.v24hChangePercent || 0) >= 0 ? '▲' : '▼'} {Math.abs(token.v24hChangePercent || 0).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── DASHBOARD ── */
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Portfolio Value', value: formatUSD(totalValue), sub: 'Total USD', color: '#a78bfa' },
              { label: 'Tokens Held', value: portfolio.length.toString(), sub: 'Unique assets', color: '#38bdf8' },
              { label: 'Wallet', value: publicKey?.toString().slice(0,8) + '...', sub: 'Connected via Solflare', color: '#34d399' },
              { label: 'Network', value: 'Mainnet', sub: 'Solana • Live', color: '#fb923c' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tab Nav */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(['portfolio', 'market', 'activity'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#6b7280',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="rounded-2xl backdrop-blur-sm overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h2 className="font-bold flex items-center gap-2">
                  <Wallet size={16} className="text-purple-400" /> Your Portfolio
                </h2>
                <button onClick={fetchPortfolio}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Fetching portfolio from Birdeye...</p>
                  </div>
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Wallet size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No tokens with value found in this wallet</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-px p-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {['Token', 'Balance', 'Price', 'Value'].map((h) => (
                      <div key={h} className="px-5 py-3 text-xs text-gray-500 font-medium"
                        style={{ background: 'rgba(10,10,20,0.8)' }}>{h}</div>
                    ))}
                  </div>
                  {portfolio.map((token, i) => (
                    <div key={token.address}
                      className="grid grid-cols-4 gap-px hover:bg-white/5 transition-colors"
                      style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div className="flex items-center gap-3 px-5 py-4">
                        {token.logoURI
                          ? <img src={token.logoURI} className="w-8 h-8 rounded-full" alt={token.symbol} />
                          : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                              {token.symbol?.slice(0,2)}
                            </div>
                        }
                        <div>
                          <div className="font-semibold text-sm">{token.symbol}</div>
                          <div className="text-xs text-gray-500 truncate max-w-24">{token.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center px-5 py-4 text-sm text-gray-300">
                        {token.balance?.toFixed(4)}
                      </div>
                      <div className="flex items-center px-5 py-4">
                        <div>
                          <div className="text-sm">${token.priceUsd < 0.01 ? token.priceUsd?.toFixed(6) : token.priceUsd?.toFixed(4)}</div>
                          <div className={`text-xs font-medium ${(token.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(token.priceChange24h || 0) >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center px-5 py-4 font-semibold text-sm">
                        {formatUSD(token.valueUsd)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Market Tab */}
          {activeTab === 'market' && (
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <h2 className="font-bold flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-400" /> Top by Volume (24h)
                  </h2>
                </div>
                <div className="p-3 space-y-1">
                  {topTokens.map((token, i) => (
                    <div key={token.address}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                        {token.logoURI
                          ? <img src={token.logoURI} className="w-8 h-8 rounded-full" alt={token.symbol} />
                          : <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">{token.symbol?.slice(0,2)}</div>
                        }
                        <div>
                          <div className="font-semibold text-sm">{token.symbol}</div>
                          <div className="text-xs text-gray-500">${(token.v24hUSD / 1e6).toFixed(1)}M vol</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(3)}</div>
                        <div className={`text-xs font-bold ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(token.v24hChangePercent || 0) >= 0 ? '+' : ''}{(token.v24hChangePercent || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gainers vs Losers */}
              <div className="space-y-5">
                <div className="rounded-2xl backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <h2 className="font-bold text-green-400 flex items-center gap-2">🚀 Top Gainers</h2>
                  </div>
                  <div className="p-3 space-y-1">
                    {[...topTokens].sort((a, b) => (b.v24hChangePercent || 0) - (a.v24hChangePercent || 0)).slice(0, 5).map((token) => (
                      <div key={token.address} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                        <div className="flex items-center gap-2">
                          {token.logoURI ? <img src={token.logoURI} className="w-6 h-6 rounded-full" alt="" /> : <div className="w-6 h-6 rounded-full bg-gray-800" />}
                          <span className="text-sm font-medium">{token.symbol}</span>
                        </div>
                        <span className="text-green-400 text-sm font-bold">+{(token.v24hChangePercent || 0).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <h2 className="font-bold text-red-400 flex items-center gap-2">📉 Top Losers</h2>
                  </div>
                  <div className="p-3 space-y-1">
                    {[...topTokens].sort((a, b) => (a.v24hChangePercent || 0) - (b.v24hChangePercent || 0)).slice(0, 5).map((token) => (
                      <div key={token.address} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                        <div className="flex items-center gap-2">
                          {token.logoURI ? <img src={token.logoURI} className="w-6 h-6 rounded-full" alt="" /> : <div className="w-6 h-6 rounded-full bg-gray-800" />}
                          <span className="text-sm font-medium">{token.symbol}</span>
                        </div>
                        <span className="text-red-400 text-sm font-bold">{(token.v24hChangePercent || 0).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="rounded-2xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h2 className="font-bold flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" /> Recent Transactions
                </h2>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Activity size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No recent transactions found</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {transactions.map((tx) => (
                    <div key={tx.txHash} className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${tx.status === 'Success' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div>
                          <div className="font-mono text-sm">{tx.txHash?.slice(0, 24)}...</div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatDate(tx.blockTime)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${tx.status === 'Success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                          {tx.status}
                        </span>
                        <a href={`https://solscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}