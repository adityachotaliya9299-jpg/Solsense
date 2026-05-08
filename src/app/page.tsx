// 'use client';

// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { getWalletPortfolio, getTopTokens, getWalletTransactions } from '@/lib/birdeye';
// import {
//   Wallet, TrendingUp, Activity, RefreshCw, ExternalLink,
//   Zap, Shield, BarChart3, Bell, Search
// } from 'lucide-react';
// import PriceChart from '@/components/PriceChart';
// import WhaleTracker from '@/components/WhaleTracker';
// import PriceAlerts from '@/components/PriceAlerts';
// import SwapWidget from '@/components/SwapWidget';
// import TokenSearch from '@/components/TokenSearch';

// interface Token {
//   address: string; symbol: string; name: string;
//   logoURI?: string; balance: number; valueUsd: number;
//   priceUsd: number; priceChange24h?: number;
// }
// interface Transaction {
//   txHash: string; blockTime: number; status: string;
// }
// interface TopToken {
//   address: string; symbol: string; name: string;
//   logoURI?: string; price: number;
//   v24hChangePercent: number; v24hUSD: number;
// }

// const DEMO_PORTFOLIO: Token[] = [
//   { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', balance: 12.5, valueUsd: 1062.5, priceUsd: 85.0, priceChange24h: 7.2 },
//   { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', balance: 500, valueUsd: 500, priceUsd: 1.0, priceChange24h: 0.1 },
//   { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I', balance: 15000000, valueUsd: 225, priceUsd: 0.000015, priceChange24h: 12.4 },
//   { address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt', symbol: 'JTO', name: 'Jito', logoURI: 'https://metadata.jito.network/token/jto/image', balance: 45, valueUsd: 135, priceUsd: 3.0, priceChange24h: -2.1 },
// ];

// const DEMO_TRANSACTIONS: Transaction[] = [
//   { txHash: '5KtPn1LGuxhFiwjxErkxTb4JTbJNDCXPQwBME6tTYNNN1111aaaa', blockTime: Math.floor(Date.now()/1000) - 300, status: 'Success' },
//   { txHash: '3mZGnRxmPaGq2222BBBd2JNaWenKbsZQh7XhBBBjNDCXPbbbb', blockTime: Math.floor(Date.now()/1000) - 900, status: 'Success' },
//   { txHash: '9xQwErTyUiOpAsDF3333GhJkLzXcVbNmQwErTyUiOpAscccc', blockTime: Math.floor(Date.now()/1000) - 1800, status: 'Failed' },
// ];

// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
// };

// const stagger = {
//   show: { transition: { staggerChildren: 0.08 } },
// };

// export default function Home() {
//   const { connected, publicKey } = useWallet();
//   const [portfolio, setPortfolio] = useState<Token[]>([]);
//   const [topTokens, setTopTokens] = useState<TopToken[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [totalValue, setTotalValue] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [activeTab, setActiveTab] = useState<'portfolio'|'market'|'activity'|'whales'|'alerts'|'search'|'swap'>('portfolio');
//   const [selectedToken, setSelectedToken] = useState<Token | null>(null);
//   const [demoMode, setDemoMode] = useState(false);
//   const [walletSearch, setWalletSearch] = useState('');
//   const [searchedWallet, setSearchedWallet] = useState('');
//   const [searchedPortfolio, setSearchedPortfolio] = useState<Token[]>([]);
//   const [searchedTotal, setSearchedTotal] = useState(0);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => { setMounted(true); }, []);
//   useEffect(() => { fetchTopTokens(); }, []);
//   useEffect(() => {
//     if (connected && publicKey) { fetchPortfolio(); fetchTransactions(); }
//   }, [connected, publicKey]);

//   async function fetchTopTokens() {
//     const data = await getTopTokens();
//     if (data?.data?.tokens) setTopTokens(data.data.tokens);
//   }

//   async function fetchPortfolio() {
//     if (!publicKey) return;
//     setLoading(true);
//     const data = await getWalletPortfolio(publicKey.toString());
//     if (data?.data?.items) {
//       const tokens = data.data.items.filter((t: Token) => t.valueUsd > 0);
//       setPortfolio(tokens);
//       setTotalValue(tokens.reduce((sum: number, t: Token) => sum + t.valueUsd, 0));
//     }
//     setLoading(false);
//   }

//   async function fetchTransactions() {
//     if (!publicKey) return;
//     const data = await getWalletTransactions(publicKey.toString());
//     if (data?.data?.solana) setTransactions(data.data.solana);
//   }

//   async function handleWalletSearch() {
//     if (!walletSearch.trim()) return;
//     setSearchLoading(true);
//     setSearchedWallet(walletSearch.trim());
//     const data = await getWalletPortfolio(walletSearch.trim());
//     if (data?.data?.items) {
//       const tokens = data.data.items.filter((t: Token) => t.valueUsd > 0);
//       setSearchedPortfolio(tokens);
//       setSearchedTotal(tokens.reduce((sum: number, t: Token) => sum + t.valueUsd, 0));
//       setActiveTab('portfolio');
//     }
//     setSearchLoading(false);
//   }

//   const displayPortfolio = searchedWallet ? searchedPortfolio : demoMode ? DEMO_PORTFOLIO : portfolio;
//   const displayTotal = searchedWallet ? searchedTotal : demoMode ? DEMO_PORTFOLIO.reduce((s,t) => s+t.valueUsd,0) : totalValue;
//   const displayTransactions = demoMode ? DEMO_TRANSACTIONS : transactions;

//   const formatUSD = (val: number) =>
//     new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
//   const formatDate = (ts: number) =>
//     new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

//   if (!mounted) return null;

//   const tabs = [
//     { id: 'portfolio', label: 'Portfolio', icon: <Wallet size={13}/> },
//     { id: 'market',    label: 'Market',    icon: <TrendingUp size={13}/> },
//     { id: 'activity',  label: 'Activity',  icon: <Activity size={13}/> },
//     { id: 'whales',    label: '🐋 Whales', icon: null },
//     { id: 'alerts',    label: '🔔 Alerts', icon: null },
//     { id: 'search',    label: '🔍 Search', icon: null },
//     { id: 'swap',      label: '⚡ Swap',   icon: null },
//   ] as const;

//   return (
//     <main className="min-h-screen text-white relative overflow-x-hidden"
//       style={{ background: 'linear-gradient(135deg, #06060f 0%, #0a0614 40%, #060a14 100%)' }}>

//       {/* Animated background orbs */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//         <div className="orb-animate absolute top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.15]"
//           style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(60px)' }} />
//         <div className="orb-animate-slow absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.12]"
//           style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)', filter: 'blur(60px)' }} />
//         <div className="orb-animate absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full opacity-[0.08]"
//           style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)', filter: 'blur(50px)' }} />
//         {/* Grid pattern overlay */}
//         <div className="absolute inset-0 opacity-[0.02]"
//           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
//       </div>

//       {/* Navbar */}
//       <motion.nav
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative z-10 border-b px-8 py-4 flex items-center justify-between"
//         style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(6,6,15,0.8)', backdropFilter: 'blur(20px)' }}>
//         <div className="flex items-center gap-3">
//           <motion.div
//             whileHover={{ scale: 1.1, rotate: 5 }}
//             className="w-9 h-9 rounded-xl flex items-center justify-center glow-purple"
//             style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
//             <Zap size={18} fill="white" />
//           </motion.div>
//           <div>
//             <span className="text-lg font-black tracking-tight gradient-text">SolSense</span>
//             <span className="text-xs text-gray-600 ml-2">by Birdeye × Solflare</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           {connected && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//               className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs glass">
//               <div className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
//               <span className="text-green-400 font-medium">Mainnet</span>
//             </motion.div>
//           )}
//           <WalletMultiButton style={{
//             background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
//             borderRadius: '12px', fontSize: '13px',
//             padding: '8px 20px', height: 'auto',
//             boxShadow: '0 0 20px rgba(124,58,237,0.3)',
//           }} />
//         </div>
//       </motion.nav>

//       {/* LANDING PAGE */}
//       {!connected ? (
//         <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
//           <motion.div className="text-center mb-16"
//             initial="hidden" animate="show" variants={stagger}>

//             <motion.div variants={fadeUp}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 glass"
//               style={{ border: '1px solid rgba(124,58,237,0.3)' }}>
//               <Shield size={12} className="text-purple-400" />
//               <span className="text-purple-300">Powered by Birdeye API × Solflare × DFlow</span>
//             </motion.div>

//             <motion.h1 variants={fadeUp} className="text-7xl font-black mb-6 leading-none">
//               <span className="gradient-text">Smart Wallet</span>
//               <br />
//               <span className="gradient-text-purple">Intelligence</span>
//             </motion.h1>

//             <motion.p variants={fadeUp} className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
//               Real-time Solana portfolio analytics, PnL tracking, whale movements and market intelligence — all in one dashboard.
//             </motion.p>

//             <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//               <WalletMultiButton style={{
//                 background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
//                 borderRadius: '14px', fontSize: '16px',
//                 padding: '14px 40px', height: 'auto',
//                 boxShadow: '0 0 50px rgba(124,58,237,0.5)',
//               }} />
//             </motion.div>
//           </motion.div>

//           {/* Feature cards */}
//           <motion.div
//             className="feature-grid grid grid-cols-4 gap-4 mb-12"
//             initial="hidden" animate="show" variants={stagger}>
//             {[
//               { icon: <BarChart3 size={22}/>, color: '#7c3aed', title: 'Portfolio Analytics', desc: 'Real-time token values & 24h PnL tracking' },
//               { icon: <TrendingUp size={22}/>, color: '#0891b2', title: 'Market Intelligence', desc: 'Top movers, gainers & losers live' },
//               { icon: '🐋', color: '#f59e0b', title: 'Whale Tracker', desc: 'Live large transaction monitoring' },
//               { icon: <Bell size={22}/>, color: '#059669', title: 'Price Alerts', desc: 'Browser push notifications' },
//             ].map((f) => (
//               <motion.div key={f.title} variants={fadeUp}
//                 whileHover={{ y: -4, borderColor: `${f.color}44` }}
//                 className="rounded-2xl p-5 glass card-hover cursor-default">
//                 <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-lg"
//                   style={{ background: `${f.color}18`, color: f.color }}>
//                   {f.icon}
//                 </div>
//                 <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
//                 <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Live market preview */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//             className="rounded-2xl p-6 glass">
//             <div className="flex items-center gap-2 mb-5">
//               <div className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
//               <span className="text-sm font-semibold text-gray-300">Live Market Preview</span>
//               <span className="text-xs text-gray-600 ml-auto">Powered by Birdeye</span>
//             </div>
//             <div className="market-preview-grid grid grid-cols-5 gap-3">
//               {topTokens.slice(0, 10).map((token, i) => (
//                 <motion.div key={token.address}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: i * 0.05 }}
//                   whileHover={{ y: -2 }}
//                   className="rounded-xl p-3 glass-strong card-hover">
//                   <div className="flex items-center gap-2 mb-2">
//                     {token.logoURI
//                       ? <img src={token.logoURI} alt={token.symbol}
//                           style={{ width:24, height:24, minWidth:24, borderRadius:'50%', objectFit:'cover' }} />
//                       : <div style={{ width:24, height:24, minWidth:24, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9 }}>
//                           {token.symbol?.slice(0,2)}
//                         </div>
//                     }
//                     <span className="text-xs font-bold">{token.symbol}</span>
//                   </div>
//                   <div className="text-sm font-bold">
//                     ${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}
//                   </div>
//                   <div className={`text-xs mt-0.5 font-semibold ${(token.v24hChangePercent||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                     {(token.v24hChangePercent||0) >= 0 ? '▲' : '▼'} {Math.abs(token.v24hChangePercent||0).toFixed(1)}%
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>

//       ) : (
//         /* DASHBOARD */
//         <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">

//           {/* Stats */}
//           <motion.div className="stats-grid grid grid-cols-4 gap-4 mb-5"
//             initial="hidden" animate="show" variants={stagger}>
//             {[
//               { label: 'Portfolio Value', value: formatUSD(displayTotal), sub: 'Total USD', color: '#a78bfa' },
//               { label: 'Tokens Held', value: displayPortfolio.length.toString(), sub: 'Unique assets', color: '#38bdf8' },
//               { label: 'Wallet', value: publicKey?.toString().slice(0,8)+'...', sub: 'Via Solflare', color: '#34d399' },
//               { label: 'Network', value: 'Mainnet', sub: 'Solana • Live', color: '#fb923c' },
//             ].map((s) => (
//               <motion.div key={s.label} variants={fadeUp}
//                 whileHover={{ y: -2 }}
//                 className="rounded-2xl p-5 glass card-hover">
//                 <div className="text-xs text-gray-500 mb-1">{s.label}</div>
//                 <div className="text-2xl font-black mb-1 count-up" style={{ color: s.color }}>{s.value}</div>
//                 <div className="text-xs text-gray-600">{s.sub}</div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Wallet search bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl glass">
//             <Search size={14} className="text-gray-500" />
//             <span className="text-sm text-gray-500 whitespace-nowrap">Analyze wallet:</span>
//             <input
//               type="text"
//               value={walletSearch}
//               onChange={(e) => setWalletSearch(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleWalletSearch()}
//               placeholder="Enter any Solana wallet address..."
//               className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-700"
//             />
//             {walletSearch && (
//               <button onClick={() => { setWalletSearch(''); setSearchedWallet(''); setSearchedPortfolio([]); }}
//                 className="text-gray-600 hover:text-white text-xs transition-colors">✕</button>
//             )}
//             <motion.button onClick={handleWalletSearch}
//               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//               className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap"
//               style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
//               {searchLoading ? '...' : 'Analyze'}
//             </motion.button>
//           </motion.div>

//           {/* Banners */}
//           <AnimatePresence>
//             {searchedWallet && (
//               <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
//                 className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
//                 style={{ background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)' }}>
//                 <span className="text-sm text-blue-300">🔍 Analyzing: {searchedWallet.slice(0,24)}...</span>
//                 <button onClick={() => { setSearchedWallet(''); setWalletSearch(''); setSearchedPortfolio([]); }}
//                   className="ml-auto px-3 py-1 rounded-lg text-xs text-blue-300"
//                   style={{ background:'rgba(37,99,235,0.2)' }}>Clear</button>
//               </motion.div>
//             )}
//             {!demoMode && !searchedWallet && displayPortfolio.length === 0 && (
//               <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
//                 className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
//                 style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)' }}>
//                 <span className="text-sm text-gray-400">Your wallet appears empty.</span>
//                 <motion.button onClick={() => setDemoMode(true)}
//                   whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
//                   className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
//                   style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
//                   Try Demo Mode
//                 </motion.button>
//               </motion.div>
//             )}
//             {demoMode && (
//               <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
//                 className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
//                 style={{ background:'rgba(251,146,60,0.08)', border:'1px solid rgba(251,146,60,0.2)' }}>
//                 <span className="text-sm text-orange-300">🎭 Demo Mode — sample portfolio data</span>
//                 <button onClick={() => setDemoMode(false)}
//                   className="ml-auto px-3 py-1 rounded-lg text-xs text-orange-300"
//                   style={{ background:'rgba(251,146,60,0.15)' }}>Exit Demo</button>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Tabs */}
//           <motion.div
//             initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
//             className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
//             style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
//             {tabs.map((tab) => (
//               <motion.button key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 whileTap={{ scale:0.95 }}
//                 className="tab-btn flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium relative"
//                 style={{ color: activeTab === tab.id ? 'white' : '#6b7280' }}>
//                 {activeTab === tab.id && (
//                   <motion.div layoutId="activeTab"
//                     className="absolute inset-0 rounded-lg"
//                     style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}
//                     transition={{ type:'spring', bounce:0.2, duration:0.5 }}
//                   />
//                 )}
//                 <span className="relative z-10 flex items-center gap-1.5">
//                   {tab.icon}{tab.label}
//                 </span>
//               </motion.button>
//             ))}
//           </motion.div>

//           {/* Tab content */}
//           <AnimatePresence mode="wait">
//             <motion.div key={activeTab}
//               initial={{ opacity:0, y:15 }}
//               animate={{ opacity:1, y:0 }}
//               exit={{ opacity:0, y:-10 }}
//               transition={{ duration:0.25 }}>

//               {/* PORTFOLIO TAB */}
//               {activeTab === 'portfolio' && (
//                 <div className="rounded-2xl overflow-hidden glass">
//                   <div className="flex items-center justify-between p-5 border-b"
//                     style={{ borderColor:'rgba(255,255,255,0.06)' }}>
//                     <h2 className="font-bold flex items-center gap-2">
//                       <Wallet size={16} className="text-purple-400"/> Your Portfolio
//                     </h2>
//                     <motion.button onClick={fetchPortfolio}
//                       whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
//                       className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white glass">
//                       <RefreshCw size={12}/> Refresh
//                     </motion.button>
//                   </div>
//                   {loading ? (
//                     <div className="p-5 space-y-3">
//                       {[1,2,3,4,5].map((i) => (
//                         <div key={i} className="grid grid-cols-5 gap-4 items-center py-2">
//                           <div className="flex items-center gap-3">
//                             <div className="skeleton skeleton-circle" style={{ width:32, height:32 }}/>
//                             <div className="space-y-1 flex-1">
//                               <div className="skeleton" style={{ height:12, width:60 }}/>
//                               <div className="skeleton" style={{ height:10, width:40 }}/>
//                             </div>
//                           </div>
//                           {[1,2,3,4].map(j => <div key={j} className="skeleton" style={{ height:12 }}/>)}
//                         </div>
//                       ))}
//                     </div>
//                   ) : displayPortfolio.length === 0 ? (
//                     <div className="text-center py-16 text-gray-600">
//                       <Wallet size={40} className="mx-auto mb-3 opacity-20"/>
//                       <p>No tokens with value found</p>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="grid grid-cols-5 border-b"
//                         style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
//                         {['Token','Balance','Price','24h','Value'].map((h) => (
//                           <div key={h} className="px-5 py-3 text-xs text-gray-600 font-semibold uppercase tracking-wide">{h}</div>
//                         ))}
//                       </div>
//                       <motion.div initial="hidden" animate="show" variants={stagger}>
//                         {displayPortfolio.map((token, i) => (
//                           <motion.div key={token.address} variants={fadeUp}
//                             className="grid grid-cols-5 hover:bg-white/5 transition-colors cursor-pointer border-b"
//                             style={{ borderColor:'rgba(255,255,255,0.04)' }}
//                             onClick={() => setSelectedToken(token)}
//                             whileHover={{ x: 2 }}>
//                             <div className="flex items-center gap-3 px-5 py-4">
//                               {token.logoURI
//                                 ? <img src={token.logoURI} alt={token.symbol}
//                                     style={{ width:32, height:32, minWidth:32, borderRadius:'50%', objectFit:'cover' }}/>
//                                 : <div style={{ width:32, height:32, minWidth:32, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:'bold' }}>
//                                     {token.symbol?.slice(0,2)}
//                                   </div>
//                               }
//                               <div>
//                                 <div className="font-bold text-sm">{token.symbol}</div>
//                                 <div className="text-xs text-gray-600 truncate max-w-20">{token.name}</div>
//                               </div>
//                             </div>
//                             <div className="flex items-center px-5 py-4 text-sm text-gray-300">{token.balance?.toFixed(4)}</div>
//                             <div className="flex items-center px-5 py-4 text-sm">
//                               ${token.priceUsd < 0.01 ? token.priceUsd?.toFixed(6) : token.priceUsd?.toFixed(4)}
//                             </div>
//                             <div className={`flex items-center px-5 py-4 text-sm font-semibold ${(token.priceChange24h||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                               {(token.priceChange24h||0) >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h||0).toFixed(2)}%
//                             </div>
//                             <div className="flex items-center px-5 py-4 font-bold text-sm">{formatUSD(token.valueUsd)}</div>
//                           </motion.div>
//                         ))}
//                       </motion.div>
//                       <div className="px-5 py-3 text-xs text-gray-600 text-center">
//                         💡 Click any token to view its price chart
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* MARKET TAB */}
//               {activeTab === 'market' && (
//                 <div className="grid grid-cols-2 gap-5">
//                   <div className="rounded-2xl glass overflow-hidden">
//                     <div className="p-5 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
//                       <h2 className="font-bold flex items-center gap-2">
//                         <TrendingUp size={16} className="text-green-400"/> Top by Volume (24h)
//                       </h2>
//                     </div>
//                     <motion.div className="p-3 space-y-1" initial="hidden" animate="show" variants={stagger}>
//                       {topTokens.map((token, i) => (
//                         <motion.div key={token.address} variants={fadeUp}
//                           className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
//                           whileHover={{ x: 3 }}>
//                           <div className="flex items-center gap-3">
//                             <span className="text-xs text-gray-700 w-4">{i+1}</span>
//                             {token.logoURI
//                               ? <img src={token.logoURI} alt={token.symbol}
//                                   style={{ width:32, height:32, minWidth:32, borderRadius:'50%', objectFit:'cover' }}/>
//                               : <div style={{ width:32, height:32, minWidth:32, borderRadius:'50%', background:'rgba(124,58,237,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>
//                                   {token.symbol?.slice(0,2)}
//                                 </div>
//                             }
//                             <div>
//                               <div className="font-semibold text-sm">{token.symbol}</div>
//                               <div className="text-xs text-gray-600">${(token.v24hUSD/1e6).toFixed(1)}M vol</div>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm font-medium">${token.price < 0.01 ? token.price.toFixed(5) : token.price.toFixed(3)}</div>
//                             <div className={`text-xs font-bold ${(token.v24hChangePercent||0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                               {(token.v24hChangePercent||0) >= 0 ? '+' : ''}{(token.v24hChangePercent||0).toFixed(1)}%
//                             </div>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   </div>
//                   <div className="space-y-5">
//                     {[
//                       { title: '🚀 Top Gainers', color: 'text-green-400', tokens: [...topTokens].sort((a,b)=>(b.v24hChangePercent||0)-(a.v24hChangePercent||0)).slice(0,5), sign: '+' },
//                       { title: '📉 Top Losers', color: 'text-red-400', tokens: [...topTokens].sort((a,b)=>(a.v24hChangePercent||0)-(b.v24hChangePercent||0)).slice(0,5), sign: '' },
//                     ].map((panel) => (
//                       <motion.div key={panel.title} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
//                         className="rounded-2xl glass overflow-hidden">
//                         <div className="p-4 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
//                           <h2 className={`font-bold ${panel.color}`}>{panel.title}</h2>
//                         </div>
//                         <div className="p-3 space-y-1">
//                           {panel.tokens.map((token) => (
//                             <div key={token.address} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
//                               <div className="flex items-center gap-2">
//                                 {token.logoURI
//                                   ? <img src={token.logoURI} alt=""
//                                       style={{ width:24, height:24, minWidth:24, borderRadius:'50%', objectFit:'cover' }}/>
//                                   : <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }}/>
//                                 }
//                                 <span className="text-sm font-medium">{token.symbol}</span>
//                               </div>
//                               <span className={`text-sm font-bold ${panel.color}`}>
//                                 {panel.sign}{(token.v24hChangePercent||0).toFixed(1)}%
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ACTIVITY TAB */}
//               {activeTab === 'activity' && (
//                 <div className="rounded-2xl glass overflow-hidden">
//                   <div className="p-5 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
//                     <h2 className="font-bold flex items-center gap-2">
//                       <Activity size={16} className="text-blue-400"/> Recent Transactions
//                     </h2>
//                   </div>
//                   {displayTransactions.length === 0 ? (
//                     <div className="text-center py-16 text-gray-600">
//                       <Activity size={40} className="mx-auto mb-3 opacity-20"/>
//                       <p>No recent transactions found</p>
//                     </div>
//                   ) : (
//                     <motion.div className="divide-y" style={{ borderColor:'rgba(255,255,255,0.04)' }}
//                       initial="hidden" animate="show" variants={stagger}>
//                       {displayTransactions.map((tx, i) => (
//                         <motion.div key={`${tx.txHash}-${i}`} variants={fadeUp}
//                           className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
//                           whileHover={{ x: 2 }}>
//                           <div className="flex items-center gap-3">
//                             <div className={`w-2.5 h-2.5 rounded-full ${tx.status === 'Success' ? 'bg-green-400' : 'bg-red-400'}`}/>
//                             <div>
//                               <div className="font-mono text-sm text-gray-300">{tx.txHash?.slice(0,28)}...</div>
//                               <div className="text-xs text-gray-600 mt-0.5">{formatDate(tx.blockTime)}</div>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <span className={`text-xs px-2 py-1 rounded-full font-medium ${tx.status === 'Success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
//                               {tx.status}
//                             </span>
//                             <a href={`https://solscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer"
//                               className="text-gray-600 hover:text-white transition-colors">
//                               <ExternalLink size={14}/>
//                             </a>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </div>
//               )}

//               {activeTab === 'whales' && <WhaleTracker/>}
//               {activeTab === 'alerts' && <PriceAlerts/>}
//               {activeTab === 'search' && <TokenSearch/>}
//               {activeTab === 'swap' && <SwapWidget/>}

//             </motion.div>
//           </AnimatePresence>
//         </div>
//       )}

//       {/* Price Chart Modal */}
//       <AnimatePresence>
//         {selectedToken && (
//           <PriceChart token={selectedToken} onClose={() => setSelectedToken(null)}/>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }









//new code 


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
  { address: '1', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', balance: 142.5, valueUsd: 20662.5, priceUsd: 145.0, priceChange24h: 5.2 },
  { address: '2', symbol: 'USDC', name: 'USD Coin', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', balance: 4500, valueUsd: 4500, priceUsd: 1.0, priceChange24h: 0.01 },
  { address: '3', symbol: 'JUP', name: 'Jupiter', logoURI: 'https://static.jup.ag/jup/icon.png', balance: 15000, valueUsd: 16500, priceUsd: 1.10, priceChange24h: 12.4 },
];

const DEMO_TOP_TOKENS: TopToken[] = [
  { address: 't1', symbol: 'SOL', name: 'Solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', price: 145.2, v24hChangePercent: 5.4, v24hUSD: 1500000000 },
  { address: 't2', symbol: 'JUP', name: 'Jupiter', logoURI: 'https://static.jup.ag/jup/icon.png', price: 1.12, v24hChangePercent: 12.5, v24hUSD: 450000000 },
  { address: 't3', symbol: 'WIF', name: 'Dogwifhat', logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png', price: 2.45, v24hChangePercent: -4.2, v24hUSD: 300000000 },
  { address: 't4', symbol: 'BONK', name: 'Bonk', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I', price: 0.000024, v24hChangePercent: 8.1, v24hUSD: 150000000 },
  { address: 't5', symbol: 'PYTH', name: 'Pyth Network', logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28177.png', price: 0.45, v24hChangePercent: -1.2, v24hUSD: 80000000 },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  { txHash: '5KtPn1LGuxhFiwjxErkxTb4JTbJNDCXPQwBME6tTYNNN1111aaaa', blockTime: Math.floor(Date.now()/1000) - 120, status: 'Success' },
  { txHash: '3mZGnRxmPaGq2222BBBd2JNaWenKbsZQh7XhBBBjNDCXPbbbb', blockTime: Math.floor(Date.now()/1000) - 850, status: 'Success' },
  { txHash: '9xQwErTyUiOpAsDF3333GhJkLzXcVbNmQwErTyUiOpAscccc', blockTime: Math.floor(Date.now()/1000) - 3600, status: 'Failed' },
];

// --- Animations ---
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const typingContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } } };
const typingLetter = { hidden: { opacity: 0, y: 10, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

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
 const displayPortfolio = searchedWallet ? searchedPortfolio : (demoMode || portfolio.length === 0) ? DEMO_PORTFOLIO : portfolio;
const displayTotal = searchedWallet ? searchedTotal : (demoMode || portfolio.length === 0) ? DEMO_PORTFOLIO.reduce((s,t) => s+t.valueUsd,0) : totalValue;
const displayTransactions = (demoMode || transactions.length === 0) ? DEMO_TRANSACTIONS : transactions;
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
                <span className="text-sm text-orange-300">🎭 Demo Mode Active — API limit reached. Showing sample data.</span>
                <button onClick={() => setDemoMode(false)} className="ml-auto px-4 py-1.5 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-200 hover:bg-orange-500/30">Try Live Data</button>
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
                  </div>
                  <div className="divide-y divide-white/5">
                    {displayPortfolio.map((token) => (
                      <div key={token.address} onClick={() => setSelectedToken(token)} className="flex items-center justify-between p-6 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          {token.logoURI ? <img src={token.logoURI} alt="" className="w-12 h-12 rounded-full border border-white/10" /> : <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />}
                          <div>
                            <p className="font-bold text-lg group-hover:text-purple-300 transition-colors">{token.symbol}</p>
                            <p className="text-white/40 text-sm">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatUSD(token.valueUsd)}</p>
                          <p className="text-white/40 text-sm">{token.balance.toFixed(4)} {token.symbol}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <div className="p-6 border-b border-white/5"><h2 className="text-lg font-semibold flex items-center gap-2"><Activity className="text-blue-400"/> Transactions</h2></div>
                  <div className="divide-y divide-white/5">
                    {displayTransactions.map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02]">
                        <div>
                          <p className="font-mono text-sm text-white/70">{tx.txHash}</p>
                          <p className="text-xs text-white/40 mt-1">{formatDate(tx.blockTime)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{tx.status}</span>
                      </div>
                    ))}
                  </div>
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
    </main>
  );
}