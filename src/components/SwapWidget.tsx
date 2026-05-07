'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { ArrowDownUp, ExternalLink, Zap, Info, RefreshCw } from 'lucide-react';

const TOKENS = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
  { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5 },
  { symbol: 'JTO', address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt', decimals: 9 },
  { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', decimals: 6 },
];

export default function SwapWidget() {
  const { connected } = useWallet();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSlippage, setShowSlippage] = useState(false);
  const [quote, setQuote] = useState<{outAmount: string; priceImpact: string} | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [fromPrice, setFromPrice] = useState<number | null>(null);
  const [toPrice, setToPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchPrices();
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const timer = setTimeout(fetchQuote, 500);
      return () => clearTimeout(timer);
    } else {
      setQuote(null);
    }
  }, [fromAmount, fromToken, toToken, slippage]);

  async function fetchPrices() {
    try {
      const key = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '';
      const [r1, r2] = await Promise.all([
        fetch(`https://public-api.birdeye.so/defi/price?address=${fromToken.address}`, { headers: { 'X-API-KEY': key, 'x-chain': 'solana' } }),
        fetch(`https://public-api.birdeye.so/defi/price?address=${toToken.address}`, { headers: { 'X-API-KEY': key, 'x-chain': 'solana' } }),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      setFromPrice(d1?.data?.value || null);
      setToPrice(d2?.data?.value || null);
    } catch {}
  }

  async function fetchQuote() {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setQuoteLoading(true);
    try {
      // Use Jupiter aggregator for real quote (publicly accessible)
      const amount = Math.floor(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));
      const res = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${amount}&slippageBps=${Math.floor(parseFloat(slippage) * 100)}`
      );
      const data = await res.json();
      if (data?.outAmount) {
        const outAmount = parseInt(data.outAmount) / Math.pow(10, toToken.decimals);
        const priceImpact = data.priceImpactPct ? (parseFloat(data.priceImpactPct) * 100).toFixed(3) : '0.000';
        setQuote({ outAmount: outAmount.toFixed(6), priceImpact });
      }
    } catch {
      // Fallback to price-based estimate
      if (fromPrice && toPrice) {
        const estimated = (parseFloat(fromAmount) * fromPrice) / toPrice;
        setQuote({ outAmount: estimated.toFixed(6), priceImpact: '<0.01' });
      }
    }
    setQuoteLoading(false);
  }

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setQuote(null);
  }

  function buildDFlowURL() {
    return `https://dflow.net/swap?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${fromAmount}&slippage=${slippage}&ref=solsense`;
  }

  const usdValue = fromPrice && fromAmount ? (parseFloat(fromAmount) * fromPrice).toFixed(2) : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-bold flex items-center gap-2">
              <Zap size={16} className="text-blue-400" /> Swap via DFlow
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">MEV-protected • Real quotes via Jupiter</p>
          </div>
          <button onClick={() => setShowSlippage(!showSlippage)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Info size={12} /> {slippage}% slippage
          </button>
        </div>

        {/* Slippage */}
        {showSlippage && (
          <div className="px-5 py-3 border-b flex items-center gap-2"
            style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <span className="text-xs text-gray-400">Slippage:</span>
            {['0.1', '0.5', '1.0', '2.0'].map((s) => (
              <button key={s} onClick={() => setSlippage(s)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: slippage === s ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.06)',
                  color: slippage === s ? 'white' : '#9ca3af',
                }}>
                {s}%
              </button>
            ))}
          </div>
        )}

        <div className="p-5 space-y-3">
          {/* From */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">You pay</span>
              {usdValue && <span className="text-xs text-gray-500">≈ ${usdValue}</span>}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold outline-none text-white placeholder-gray-600"
              />
              <select
                value={fromToken.symbol}
                onChange={(e) => setFromToken(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[0])}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
            {fromPrice && <div className="text-xs text-gray-600 mt-1">1 {fromToken.symbol} = ${fromPrice.toFixed(4)}</div>}
          </div>

          {/* Flip */}
          <div className="flex justify-center">
            <button onClick={flipTokens}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <ArrowDownUp size={16} className="text-purple-400" />
            </button>
          </div>

          {/* To */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">You receive</span>
              <span className="text-xs text-blue-400 flex items-center gap-1">
                <Zap size={10} /> DFlow routing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-2xl font-bold text-gray-300 flex items-center gap-2">
                {quoteLoading
                  ? <RefreshCw size={20} className="animate-spin text-purple-400" />
                  : quote ? quote.outAmount : '0.00'
                }
              </div>
              <select
                value={toToken.symbol}
                onChange={(e) => setToToken(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[1])}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(37,99,235,0.4)' }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
            {toPrice && <div className="text-xs text-gray-600 mt-1">1 {toToken.symbol} = ${toPrice.toFixed(4)}</div>}
          </div>

          {/* Quote Details */}
          <div className="rounded-xl p-3 text-xs space-y-1.5"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)' }}>
            {[
              ['Routing', 'DFlow Protocol'],
              ['Quote Source', 'Jupiter Aggregator'],
              ['Price Impact', quote ? `${quote.priceImpact}%` : '-'],
              ['Slippage', `${slippage}%`],
              ['MEV Protection', 'Enabled'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className={`text-gray-300 ${label === 'MEV Protection' ? 'text-green-400' : ''}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          {!connected ? (
            <div className="text-center py-3 text-sm text-gray-400">
              Connect your Solflare wallet to swap
            </div>
          ) : (
            <a href={buildDFlowURL()} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
              <Zap size={18} fill="white" />
              Swap via DFlow
              <ExternalLink size={14} />
            </a>
          )}
          <p className="text-center text-xs text-gray-600">
            Real quotes via Jupiter • Executed via DFlow MEV protection
          </p>
        </div>
      </div>
    </div>
  );
}