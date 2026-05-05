'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { getWalletPortfolio, getTopTokens, getWalletTransactions } from '@/lib/birdeye';
import { Wallet, TrendingUp, Activity, RefreshCw, ExternalLink, Zap, Shield, BarChart3, Bell } from 'lucide-react';
import PriceChart from '@/components/PriceChart';
import WhaleTracker from '@/components/WhaleTracker';
import SwapWidget from '@/components/SwapWidget';
import PriceAlerts from '@/components/PriceAlerts';
import TokenSearch from '@/components/TokenSearch';

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
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'activity' | 'whales' | 'alerts' | 'swap' | 'search'>('portfolio');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);


  const DEMO_PORTFOLIO = [
    { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', balance: 12.5, valueUsd: 1062.5, priceUsd: 85.0, priceChange24h: 7.2 },
    { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', balance: 500, valueUsd: 500, priceUsd: 1.0, priceChange24h: 0.1 },
    { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I', balance: 15000000, valueUsd: 225, priceUsd: 0.000015, priceChange24h: 12.4 },
    { address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt', symbol: 'JTO', name: 'Jito', logoURI: 'https://metadata.jito.network/token/jto/image', balance: 45, valueUsd: 135, priceUsd: 3.0, priceChange24h: -2.1 },
  ];

  const [demoMode, setDemoMode] = useState(false);
  const displayPortfolio = demoMode ? DEMO_PORTFOLIO : portfolio;
  const displayTotal = demoMode ? DEMO_PORTFOLIO.reduce((s, t) => s + t.valueUsd, 0) : totalValue;


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

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: <Wallet size={13} /> },
    { id: 'market', label: 'Market', icon: <TrendingUp size={13} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={13} /> },
    { id: 'whales', label: '🐋 Whales', icon: null },
    { id: 'alerts', label: '🔔 Alerts', icon: null },
    { id: 'search', label: '🔍 Search', icon: null },
    { id: 'swap', label: '⚡ Swap', icon: null },
  ] as const;

  return (
    <main className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0a1a 50%, #0a0f1a 100%)' }}>

      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)', filter: 'blur(80px)' }} />
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
            borderRadius: '12px', fontSize: '13px', padding: '8px 20px', height: 'auto',
          }} />
        </div>
      </nav>

      {!connected ? (
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20">
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
              borderRadius: '14px', fontSize: '16px', padding: '14px 36px', height: 'auto',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
            }} />
          </div>

          <div className="grid grid-cols-4 gap-5 mb-10">
            {[
              { icon: <BarChart3 size={22} />, color: '#7c3aed', title: 'Portfolio Analytics', desc: 'Real-time token values & 24h PnL' },
              { icon: <TrendingUp size={22} />, color: '#0891b2', title: 'Market Intelligence', desc: 'Top movers, gainers & losers' },
              { icon: '🐋', color: '#f59e0b', title: 'Whale Tracker', desc: 'Live large transaction monitoring' },
              { icon: <Bell size={22} />, color: '#059669', title: 'Price Alerts', desc: 'Browser notifications for targets' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-5 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
                  style={{ background: `${f.color}22`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-300">Live Market Preview</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {topTokens.slice(0, 10).map((token) => (
                <div key={token.address} className="rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {token.logoURI
                      ? <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.symbol} />
                      : <div className="w-6 h-6 rounded-full bg-purple-800 flex items-center justify-center text-xs">{token.symbol?.slice(0, 2)}</div>
                    }
                    <span className="text-xs font-semibold">{token.symbol}</span>
                  </div>
                  <div className="text-sm font-bold">${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}</div>
                  <div className={`text-xs mt-0.5 font-medium ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(token.v24hChangePercent || 0) >= 0 ? '▲' : '▼'} {Math.abs(token.v24hChangePercent || 0).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Portfolio Value', value: formatUSD(displayTotal), sub: 'Total USD', color: '#a78bfa' },
              { label: 'Tokens Held', value: displayPortfolio.length.toString(), sub: 'Unique assets', color: '#38bdf8' },
              { label: 'Wallet', value: publicKey?.toString().slice(0, 8) + '...', sub: 'Via Solflare', color: '#34d399' },
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


          {!demoMode && displayPortfolio.length === 0 && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <span className="text-sm text-gray-300">Your wallet appears empty.</span>
              <button onClick={() => setDemoMode(true)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                Try Demo Mode
              </button>
            </div>
          )}
          {demoMode && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
              <span className="text-sm text-orange-300">🎭 Demo Mode — showing sample portfolio data</span>
              <button onClick={() => setDemoMode(false)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-orange-300"
                style={{ background: 'rgba(251,146,60,0.2)' }}>
                Exit Demo
              </button>
            </div>
          )}


          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                }}>
                {tab.icon}{tab.label}
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Fetching from Birdeye...</p>
                  </div>
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Wallet size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No tokens with value found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 p-0">
                    {['Token', 'Balance', 'Price', '24h', 'Value'].map((h) => (
                      <div key={h} className="px-5 py-3 text-xs text-gray-500 font-medium border-b"
                        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>{h}</div>
                    ))}
                  </div>
                  {portfolio.map((token, i) => (
                    <div key={token.address}
                      className="grid grid-cols-5 hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      onClick={() => setSelectedToken(token)}>
                      <div className="flex items-center gap-3 px-5 py-4">
                        {token.logoURI
                          ? <img src={token.logoURI} className="w-8 h-8 rounded-full" alt={token.symbol} />
                          : <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                              {token.symbol?.slice(0, 2)}
                            </div>
                        }
                        <div>
                          <div className="font-semibold text-sm">{token.symbol}</div>
                          <div className="text-xs text-gray-500 truncate max-w-20">{token.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center px-5 py-4 text-sm text-gray-300">{token.balance?.toFixed(4)}</div>
                      <div className="flex items-center px-5 py-4 text-sm">
                        ${token.priceUsd < 0.01 ? token.priceUsd?.toFixed(6) : token.priceUsd?.toFixed(4)}
                      </div>
                      <div className={`flex items-center px-5 py-4 text-sm font-medium ${(token.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(token.priceChange24h || 0) >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h || 0).toFixed(2)}%
                      </div>
                      <div className="flex items-center px-5 py-4 font-semibold text-sm">{formatUSD(token.valueUsd)}</div>
                    </div>
                  ))}
                  <div className="p-4 text-center text-xs text-gray-500">
                    💡 Click any token to view its price chart
                  </div>
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
                          : <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">{token.symbol?.slice(0, 2)}</div>
                        }
                        <div>
                          <div className="font-semibold text-sm">{token.symbol}</div>
                          <div className="text-xs text-gray-500">${(token.v24hUSD / 1e6).toFixed(1)}M vol</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}</div>
                        <div className={`text-xs font-bold ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(token.v24hChangePercent || 0) >= 0 ? '+' : ''}{(token.v24hChangePercent || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div className="rounded-2xl backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    <h2 className="font-bold text-green-400">🚀 Top Gainers</h2>
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
                    <h2 className="font-bold text-red-400">📉 Top Losers</h2>
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
                    <div key={tx.txHash} className="flex items-center justify-between px-5 py-4 hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${tx.status === 'Success' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <div>
                          <div className="font-mono text-sm">{tx.txHash?.slice(0, 28)}...</div>
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

          {/* Whales Tab */}
          {activeTab === 'whales' && <WhaleTracker />}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && <PriceAlerts />}

          {activeTab === 'search' && <TokenSearch />}

          {activeTab === 'swap' && <SwapWidget />}
        </div>
      )}

      {/* Price Chart Modal */}
      {selectedToken && (
        <PriceChart token={selectedToken} onClose={() => setSelectedToken(null)} />
      )}
    </main>
  );
}