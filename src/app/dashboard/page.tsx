'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWalletPortfolio, getTopTokens, getWalletTransactions } from '@/lib/birdeye';
import {
  Wallet, TrendingUp, Activity, RefreshCw, ExternalLink,
  Zap, Shield, BarChart3, Bell, Search
} from 'lucide-react';
import PriceChart from '@/components/PriceChart';
import WhaleTracker from '@/components/WhaleTracker';
import PriceAlerts from '@/components/PriceAlerts';
import SwapWidget from '@/components/SwapWidget';
import TokenSearch from '@/components/TokenSearch';

// --- Interfaces ---
interface Token { address: string; symbol: string; name: string; logoURI?: string; balance: number; valueUsd: number; priceUsd: number; priceChange24h?: number; }
interface Transaction { txHash: string; blockTime: number; status: string; }
interface TopToken { address: string; symbol: string; name: string; logoURI?: string; price: number; v24hChangePercent: number; v24hUSD: number; }

// --- Global Demo Data ---
const DEMO_PORTFOLIO: Token[] = [
  { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', balance: 12.5, valueUsd: 1812.5, priceUsd: 145.0, priceChange24h: 5.4 },
  { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', balance: 4500, valueUsd: 4500, priceUsd: 1.0, priceChange24h: 0.01 },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', symbol: 'JUP', name: 'Jupiter', logoURI: 'https://static.jup.ag/jup/icon.png', balance: 15000, valueUsd: 16500, priceUsd: 1.10, priceChange24h: 12.4 },
];

const DEMO_TOP_TOKENS: TopToken[] = [
  { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', price: 145.2, v24hChangePercent: 5.4, v24hUSD: 1500000000 },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', symbol: 'JUP', name: 'Jupiter', logoURI: 'https://static.jup.ag/jup/icon.png', price: 1.12, v24hChangePercent: 12.5, v24hUSD: 450000000 },
  { address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', symbol: 'WIF', name: 'Dogwifhat', logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbgn2dnd2n33udnpd7ypaswl5bhm.ipfs.nftstorage.link', price: 2.45, v24hChangePercent: -4.2, v24hUSD: 300000000 },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I', price: 0.000024, v24hChangePercent: 8.1, v24hUSD: 150000000 },
  { address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', symbol: 'PYTH', name: 'Pyth Network', logoURI: 'https://pyth.network/token.svg', price: 0.45, v24hChangePercent: -1.2, v24hUSD: 80000000 },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  { txHash: '5KtPn1LGuxhFiwjxErkxTb4JTbJNDCXPQwBME6tTYNNN1111aaaa', blockTime: Math.floor(Date.now()/1000) - 120, status: 'Success' },
  { txHash: '3mZGnRxmPaGq2222BBBd2JNaWenKbsZQh7XhBBBjNDCXPbbbb', blockTime: Math.floor(Date.now()/1000) - 850, status: 'Success' },
  { txHash: '9xQwErTyUiOpAsDF3333GhJkLzXcVbNmQwErTyUiOpAscccc', blockTime: Math.floor(Date.now()/1000) - 3600, status: 'Failed' },
];

// --- Animations ---
const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const typingContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } } };
const typingLetter = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [portfolio, setPortfolio] = useState<Token[]>([]);
  const [topTokens, setTopTokens] = useState<TopToken[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio'|'market'|'activity'|'whales'|'alerts'|'search'|'swap'>('portfolio');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  
  // Search & Demo State
  const [demoMode, setDemoMode] = useState(false);
  const [walletSearch, setWalletSearch] = useState('');
  const [searchedWallet, setSearchedWallet] = useState('');
  const [searchedPortfolio, setSearchedPortfolio] = useState<Token[]>([]);
  const [searchedTotal, setSearchedTotal] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { setMounted(true); fetchTopTokens(); }, []);
  useEffect(() => {
    if (connected && publicKey) { fetchPortfolio(); fetchTransactions(); }
  }, [connected, publicKey]);

  async function fetchTopTokens() {
    try {
      const data = await getTopTokens();
      if (data?.data?.tokens) setTopTokens(data.data.tokens);
    } catch (e) { console.error("Birdeye Limit Hit"); }
  }

  async function fetchPortfolio() {
    if (!publicKey) return;
    setLoading(true);
    try {
      const data = await getWalletPortfolio(publicKey.toString());
      if (data?.data?.items) {
        const tokens = data.data.items.filter((t: Token) => t.valueUsd > 0);
        setPortfolio(tokens);
        setTotalValue(tokens.reduce((sum: number, t: Token) => sum + t.valueUsd, 0));
      }
    } catch (e) { console.error("Birdeye Limit Hit"); }
    setLoading(false);
  }

  async function fetchTransactions() {
    if (!publicKey) return;
    try {
      const data = await getWalletTransactions(publicKey.toString());
      if (data?.data?.solana) setTransactions(data.data.solana);
    } catch (e) { console.error("Birdeye Limit Hit"); }
  }

  // Active Display Logic (Switches between Live Data and Demo Data)
const displayPortfolio = searchedWallet ? searchedPortfolio : demoMode ? DEMO_PORTFOLIO : portfolio;
const displayTotal = searchedWallet ? searchedTotal : demoMode ? DEMO_PORTFOLIO.reduce((s,t) => s+t.valueUsd,0) : totalValue;
const displayTransactions = demoMode ? DEMO_TRANSACTIONS : transactions.length > 0 ? transactions : [];
const displayTopTokens = topTokens.length > 0 ? topTokens : DEMO_TOP_TOKENS;

  const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!mounted) return null;

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: <Wallet size={14}/> },
    { id: 'market',    label: 'Market',    icon: <TrendingUp size={14}/> },
    { id: 'activity',  label: 'Activity',  icon: <Activity size={14}/> },
    { id: 'whales',    label: 'Whales',    icon: '🐋' },
    { id: 'alerts',    label: 'Alerts',    icon: <Bell size={14}/> },
    { id: 'search',    label: 'Search',    icon: <Search size={14}/> },
    { id: 'swap',      label: 'Swap',      icon: <Zap size={14}/> },
  ] as const;

  return (
    <main className="min-h-screen bg-[#030308] text-white relative overflow-x-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] bg-purple-900/30" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] bg-blue-900/20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-3xl px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
            <Zap size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">SolSense</span>
            <span className="text-[10px] text-white/40 tracking-wider uppercase font-medium">Powered by Birdeye</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {connected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-md text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-green-400 font-medium">Mainnet</span>
            </div>
          )}

          <button
  onClick={() => setDemoMode(!demoMode)}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
  style={{ 
    background: demoMode ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.06)',
    border: demoMode ? '1px solid rgba(251,146,60,0.3)' : '1px solid rgba(255,255,255,0.1)',
    color: demoMode ? '#fb923c' : '#6b7280'
  }}>
  {demoMode ? '🎭 Demo' : '📊 Live'}
</button>
          <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !transition-all !duration-500 !rounded-xl !py-2 !px-6 border border-white/10" />
        </div>
      </motion.nav>

      {!connected ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 pb-20">
          <motion.div className="text-center w-full max-w-4xl mt-20" variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-8">
              <Shield size={14} className="text-purple-400" />
              <span className="text-sm font-medium text-purple-200">Next-Gen Portfolio Tracking</span>
            </motion.div>

            <motion.h1 variants={typingContainer} className="text-7xl md:text-8xl font-bold mb-8 tracking-tighter leading-[1.1]">
              {Array.from("Intelligence").map((char, index) => (
                <motion.span key={index} variants={typingLetter} className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">{char}</motion.span>
              ))}
              
              <br />
          <span className="inline-block mt-2">
            {Array.from("On-Chain").map((char, index) => (
              <motion.span 
                key={index} 
                variants={typingLetter} 
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>


            </motion.h1>

            <motion.div variants={fadeUp} className="flex justify-center mb-24">
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-500 hover:!to-blue-500 !transition-all !duration-500 !rounded-2xl !text-lg !py-4 !px-8 !shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:!shadow-[0_0_60px_rgba(124,58,237,0.5)] !font-medium" />
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="w-full max-w-5xl rounded-3xl p-8 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white/70">Live Market Preview</span>
              {demoMode && <span className="ml-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md">Demo Data</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {displayTopTokens.slice(0, 5).map((token) => (
                <div key={token.address} className="rounded-2xl p-4 border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    {token.logoURI ? (
                      <img src={token.logoURI} alt={token.symbol} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">{token.symbol?.slice(0,2)}</div>
                    )}
                    <span className="text-sm font-bold">{token.symbol}</span>
                  </div>
                  <div className="text-lg font-bold">${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}</div>
                  <div className={`text-xs mt-1 font-medium ${(token.v24hChangePercent||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(token.v24hChangePercent||0) >= 0 ? '▲' : '▼'} {Math.abs(token.v24hChangePercent||0).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
          
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Portfolio Value', value: formatUSD(displayTotal), sub: 'Total USD', color: 'from-purple-400 to-blue-400' },
              { label: 'Tokens Held', value: displayPortfolio.length.toString(), sub: 'Unique assets', color: 'from-blue-400 to-cyan-400' },
              { label: 'Wallet', value: publicKey?.toString().slice(0,8)+'...', sub: 'Via Solflare', color: 'from-green-400 to-emerald-400' },
              { label: 'Network', value: 'Mainnet', sub: 'Solana • Live', color: 'from-orange-400 to-red-400' },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="rounded-3xl p-6 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="text-sm text-white/40 mb-2">{s.label}</div>
                <div className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-white/30">{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {demoMode && (
  <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 backdrop-blur-md">
    <span className="text-sm text-orange-300">🎭 Showing sample data — connect a funded wallet to see real portfolio</span>
    <button onClick={() => setDemoMode(false)}
      className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-200 hover:bg-orange-500/30">
      Refresh Live Data
    </button>
  </motion.div>
)}
          </AnimatePresence>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} className="flex overflow-x-auto gap-2 mb-8 p-1.5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl w-fit">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.3 }}>
              
              {activeTab === 'portfolio' && (
  <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-white/5">
      <h2 className="text-lg font-semibold flex items-center gap-2"><Wallet className="text-purple-400"/> Your Assets</h2>
      <div className="flex items-center gap-2">
        {!demoMode && (
          <button onClick={() => setDemoMode(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background:'rgba(251,146,60,0.15)', color:'#fb923c', border:'1px solid rgba(251,146,60,0.3)' }}>
            🎭 Try Demo
          </button>
        )}
        {demoMode && (
          <button onClick={() => setDemoMode(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background:'rgba(124,58,237,0.15)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.3)' }}>
            📊 Exit Demo
          </button>
        )}
      </div>
    </div>
    {displayPortfolio.length === 0 ? (
      <div className="text-center py-16 text-white/30">
        <Wallet size={48} className="mx-auto mb-4 opacity-20"/>
        <p className="text-lg mb-2">No tokens found in this wallet</p>
        <p className="text-sm mb-6">Connect a funded wallet or try demo mode</p>
        <button onClick={() => setDemoMode(true)}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          🎭 Try Demo Mode
        </button>
      </div>
    ) : (
      <div className="divide-y divide-white/5">
        {displayPortfolio.map((token) => (
                <div key={token.address} onClick={() => setSelectedToken(token)} className="flex items-center justify-between p-6 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {token.logoURI
                      ? <img src={token.logoURI} alt="" className="w-12 h-12 rounded-full border border-white/10" style={{objectFit:'cover'}}/>
                      : <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"/>
                    }
                    <div>
                      <p className="font-bold text-lg group-hover:text-purple-300 transition-colors">{token.symbol}</p>
                      <p className="text-white/40 text-sm">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatUSD(token.valueUsd)}</p>
                    <p className="text-white/40 text-sm">{token.balance.toFixed(4)} {token.symbol}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${(token.priceChange24h||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(token.priceChange24h||0) >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h||0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
              {activeTab === 'market' && (
  <div className="space-y-6">
    {/* Summary stats */}
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total 24h Volume', value: `$${(displayTopTokens.reduce((s,t) => s + t.v24hUSD, 0)/1e9).toFixed(2)}B`, color: 'from-purple-400 to-blue-400' },
        { label: 'Top Gainer', value: `${[...displayTopTokens].sort((a,b) => b.v24hChangePercent - a.v24hChangePercent)[0]?.symbol} +${[...displayTopTokens].sort((a,b) => b.v24hChangePercent - a.v24hChangePercent)[0]?.v24hChangePercent.toFixed(1)}%`, color: 'from-green-400 to-emerald-400' },
        { label: 'Top Loser', value: `${[...displayTopTokens].sort((a,b) => a.v24hChangePercent - b.v24hChangePercent)[0]?.symbol} ${[...displayTopTokens].sort((a,b) => a.v24hChangePercent - b.v24hChangePercent)[0]?.v24hChangePercent.toFixed(1)}%`, color: 'from-red-400 to-orange-400' },
      ].map((s) => (
        <div key={s.label} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
          <div className="text-sm text-white/40 mb-1">{s.label}</div>
          <div className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>

    {/* Full token table */}
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400"/> All Tokens by Volume
        </h2>
        <span className="text-xs text-white/30">{displayTopTokens.length} tokens • Click to view chart</span>
      </div>
      {/* Table header */}
      <div className="grid grid-cols-6 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        {['#', 'Token', 'Price', '24h Change', '24h Volume', 'Market Cap'].map((h) => (
          <div key={h} className="text-xs text-white/30 font-semibold uppercase tracking-wide">{h}</div>
        ))}
      </div>
      {/* Token rows */}
      {displayTopTokens.map((token, i) => (
        <div key={`${token.address}-${i}`}
          onClick={() => setSelectedToken({ address: token.address, symbol: token.symbol, name: token.name, logoURI: token.logoURI, balance: 0, valueUsd: 0, priceUsd: token.price, priceChange24h: token.v24hChangePercent })}
          className="grid grid-cols-6 items-center px-5 py-4 border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="text-sm text-white/30">{i+1}</div>
          <div className="flex items-center gap-3">
            {token.logoURI
              ? <img src={token.logoURI} alt={token.symbol} style={{ width:36, height:36, minWidth:36, borderRadius:'50%', objectFit:'cover' }}/>
              : <div style={{ width:36, height:36, minWidth:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:'bold' }}>{token.symbol?.slice(0,2)}</div>
            }
            <div>
              <div className="font-bold text-sm group-hover:text-purple-300 transition-colors">{token.symbol}</div>
              <div className="text-xs text-white/30 truncate max-w-20">{token.name}</div>
            </div>
          </div>
          <div className="text-sm font-medium">
            ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(3)}
          </div>
          <div className={`text-sm font-bold ${(token.v24hChangePercent||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(token.v24hChangePercent||0) >= 0 ? '▲ +' : '▼ '}{(token.v24hChangePercent||0).toFixed(2)}%
          </div>
          <div className="text-sm text-white/60">
            ${(token.v24hUSD/1e6).toFixed(1)}M
          </div>
          <div className="text-sm text-white/40">
            {token.v24hUSD > 0 ? `$${((token.v24hUSD * 10)/1e6).toFixed(1)}M` : 'N/A'}
          </div>
        </div>
      ))}
    </div>

    {/* Gainers & Losers side by side */}
    <div className="grid grid-cols-2 gap-5">
      {[
        { title: '🚀 Top Gainers', tokens: [...displayTopTokens].sort((a,b) => (b.v24hChangePercent||0)-(a.v24hChangePercent||0)).slice(0,5), positive: true },
        { title: '📉 Top Losers', tokens: [...displayTopTokens].sort((a,b) => (a.v24hChangePercent||0)-(b.v24hChangePercent||0)).slice(0,5), positive: false },
      ].map((panel) => (
        <div key={panel.title} className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className={`font-bold ${panel.positive ? 'text-green-400' : 'text-red-400'}`}>{panel.title}</h3>
          </div>
          <div className="p-3 space-y-1">
            {panel.tokens.map((token, i) => (
              <div key={i} onClick={() => setSelectedToken({ address: token.address, symbol: token.symbol, name: token.name, logoURI: token.logoURI, balance: 0, valueUsd: 0, priceUsd: token.price, priceChange24h: token.v24hChangePercent })} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  {token.logoURI
                    ? <img src={token.logoURI} alt="" style={{ width:28, height:28, minWidth:28, borderRadius:'50%', objectFit:'cover' }}/>
                    : <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }}/>
                  }
                  <span className="text-sm font-medium">{token.symbol}</span>
                </div>
                <span className={`text-sm font-bold ${panel.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {panel.positive ? '+' : ''}{(token.v24hChangePercent||0).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              {activeTab === 'activity' && (
  <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-white/5">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Activity size={18} className="text-blue-400"/> Transactions
      </h2>
      {!demoMode && (
        <button onClick={() => setDemoMode(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background:'rgba(251,146,60,0.15)', color:'#fb923c', border:'1px solid rgba(251,146,60,0.3)' }}>
          🎭 Try Demo
        </button>
      )}
    </div>
    {displayTransactions.length === 0 ? (
      <div className="text-center py-16 text-white/30">
        <Activity size={48} className="mx-auto mb-4 opacity-20"/>
        <p className="text-lg mb-2">No transactions found</p>
        <p className="text-sm mb-6">This wallet has no recent activity</p>
        <button onClick={() => setDemoMode(true)}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
          🎭 Try Demo Mode
        </button>
      </div>
    ) : (
      <div className="divide-y divide-white/5">
        {displayTransactions.map((tx, i) => (
          <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02]">
            <div>
              <p className="font-mono text-sm text-white/70">{tx.txHash?.slice(0,32)}...</p>
              <p className="text-xs text-white/40 mt-1">{formatDate(tx.blockTime)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {tx.status}
              </span>
              <a href={`https://solscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors">
                <ExternalLink size={14}/>
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

              {activeTab === 'whales' && (
                <div>
                  {/* Demo market data for whales tab */}
                  <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 mb-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">🐋 Top Volume Movers</h2>
                    <div className="divide-y divide-white/5">
                      {displayTopTokens.map((token, i) => (
                        <div key={i} 
  onClick={() => setSelectedToken({ address: token.address, symbol: token.symbol, name: token.name, logoURI: token.logoURI, balance: 0, valueUsd: 0, priceUsd: token.price, priceChange24h: token.v24hChangePercent })}
  className="flex items-center justify-between py-4 cursor-pointer hover:bg-white/[0.03] px-2 rounded-xl transition-colors">
                          <div className="flex items-center gap-3">
                            {token.logoURI
                              ? <img src={token.logoURI} className="w-10 h-10 rounded-full" style={{objectFit:'cover'}} alt=""/>
                              : <div className="w-10 h-10 rounded-full bg-white/10"/>
                            }
                            <div>
                              <p className="font-bold">{token.symbol}</p>
                              <p className="text-xs text-white/40">24h Vol: ${(token.v24hUSD/1e6).toFixed(1)}M</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}</p>
                            <p className={`text-sm font-semibold ${token.v24hChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {token.v24hChangePercent >= 0 ? '+' : ''}{token.v24hChangePercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-white/30 text-center mt-4">💡 Click any token to view price chart</p>
                  </div>
                </div>
              )}
              {activeTab === 'alerts' && <PriceAlerts/>}
              {activeTab === 'search' && <TokenSearch/>}
              {activeTab === 'swap'   && <SwapWidget/>}

            </motion.div>
          </AnimatePresence>
        </div>
      )}
   {/* Price Chart Modal */}
      <AnimatePresence>
        {selectedToken && (
          <PriceChart token={selectedToken} onClose={() => setSelectedToken(null)}/>
        )}
      </AnimatePresence>
    </main>
  );
}