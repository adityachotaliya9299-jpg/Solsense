'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { getWalletPortfolio, getTopTokens, getWalletTransactions } from '@/lib/birdeye';
import { Wallet, TrendingUp, Activity, RefreshCw, ExternalLink } from 'lucide-react';

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
  from: string;
  to: string;
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

  useEffect(() => {
    fetchTopTokens();
  }, []);

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
      const total = tokens.reduce((sum: number, t: Token) => sum + t.valueUsd, 0);
      setTotalValue(total);
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
    new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <span className="text-xl font-bold">SolSense</span>
          <span className="text-xs text-gray-400 ml-2">Smart Wallet Intelligence</span>
        </div>
        <WalletMultiButton style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          borderRadius: '10px',
          fontSize: '14px',
        }} />
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!connected ? (
          /* Landing State */
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet size={40} className="text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Smart Wallet Intelligence
            </h1>
            <p className="text-gray-400 text-xl mb-8 max-w-xl mx-auto">
              Connect your Solflare wallet to get real-time portfolio analytics, PnL tracking, and market insights powered by Birdeye.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              {[
                { icon: '📊', title: 'Portfolio Tracking', desc: 'Real-time token balances & values' },
                { icon: '🔥', title: 'Market Intelligence', desc: 'Top movers & volume leaders' },
                { icon: '⚡', title: 'Transaction History', desc: 'Full wallet activity timeline' },
              ].map((f) => (
                <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <div className="font-semibold mb-1">{f.title}</div>
                  <div className="text-sm text-gray-400">{f.desc}</div>
                </div>
              ))}
            </div>
            <WalletMultiButton style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              borderRadius: '12px',
              fontSize: '16px',
              padding: '12px 32px',
            }} />
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-gray-400 text-sm mb-1">Total Portfolio Value</div>
                <div className="text-3xl font-bold text-purple-400">{formatUSD(totalValue)}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-gray-400 text-sm mb-1">Tokens Held</div>
                <div className="text-3xl font-bold">{portfolio.length}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-gray-400 text-sm mb-1">Wallet</div>
                <div className="text-sm font-mono text-gray-300 mt-2 truncate">
                  {publicKey?.toString().slice(0, 20)}...
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Portfolio */}
              <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Wallet size={16} className="text-purple-400" /> Your Portfolio
                  </h2>
                  <button onClick={fetchPortfolio} className="text-gray-400 hover:text-white">
                    <RefreshCw size={16} />
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-8 text-gray-400">Loading portfolio...</div>
                ) : portfolio.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No tokens found</div>
                ) : (
                  <div className="space-y-3">
                    {portfolio.slice(0, 8).map((token) => (
                      <div key={token.address} className="flex items-center justify-between py-2 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                          {token.logoURI ? (
                            <img src={token.logoURI} className="w-8 h-8 rounded-full" alt={token.symbol} />
                          ) : (
                            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-xs">
                              {token.symbol?.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{token.symbol}</div>
                            <div className="text-xs text-gray-400">{token.balance?.toFixed(4)} tokens</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatUSD(token.valueUsd)}</div>
                          <div className={`text-xs ${(token.priceChange24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(token.priceChange24h || 0) >= 0 ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Tokens */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h2 className="font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-green-400" /> Top by Volume
                </h2>
                <div className="space-y-3">
                  {topTokens.slice(0, 8).map((token) => (
                    <div key={token.address} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.symbol} />
                        ) : (
                          <div className="w-6 h-6 bg-gray-700 rounded-full" />
                        )}
                        <span className="text-sm font-medium">{token.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">${token.price?.toFixed(4)}</div>
                        <div className={`text-xs ${(token.v24hChangePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {(token.v24hChangePercent || 0) >= 0 ? '+' : ''}{(token.v24hChangePercent || 0).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Activity size={16} className="text-blue-400" /> Recent Transactions
              </h2>
              {transactions.length === 0 ? (
                <div className="text-center py-6 text-gray-400">No recent transactions</div>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.txHash} className="flex items-center justify-between py-2 border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${tx.status === 'Success' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="font-mono text-sm text-gray-300">{tx.txHash?.slice(0, 20)}...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{formatDate(tx.blockTime)}</span>
                        <a
                          href={`https://solscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}