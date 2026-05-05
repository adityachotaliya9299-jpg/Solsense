'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { ArrowDownUp, ExternalLink, Zap, Info } from 'lucide-react';

const TOKENS = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png' },
  { symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg' },
  { symbol: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
  { symbol: 'JTO', address: 'jtojtomepa8berqQfDqoh8QY7KRM3bkdnUXkbgdNjt', logoURI: 'https://metadata.jito.network/token/jto/image' },
  { symbol: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbgn2dnd2n33udnpd7ypaswl5bhm.ipfs.nftstorage.link' },
];

const DFLOW_REFERRAL = 'https://dflow.net';

export default function SwapWidget() {
  const { connected, publicKey } = useWallet();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSlippage, setShowSlippage] = useState(false);

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
  }

  function buildDFlowURL() {
    return `https://dflow.net/swap?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${fromAmount}&slippage=${slippage}&ref=solsense`;
  }

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
            <p className="text-xs text-gray-500 mt-0.5">MEV-protected execution • Best price routing</p>
          </div>
          <button onClick={() => setShowSlippage(!showSlippage)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Info size={12} /> {slippage}% slippage
          </button>
        </div>

        {/* Slippage Settings */}
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
          {/* From Token */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">You pay</span>
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.4)' }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
          </div>

          {/* Flip Button */}
          <div className="flex justify-center">
            <button onClick={flipTokens}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <ArrowDownUp size={16} className="text-purple-400" />
            </button>
          </div>

          {/* To Token */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">You receive</span>
              <span className="text-xs text-blue-400 flex items-center gap-1">
                <Zap size={10} /> DFlow routing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-2xl font-bold text-gray-500">
                {fromAmount ? '~' + (parseFloat(fromAmount) * 0.998).toFixed(4) : '0.00'}
              </div>
              <select
                value={toToken.symbol}
                onChange={(e) => setToToken(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[1])}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(37,99,235,0.4)' }}>
                {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
              </select>
            </div>
          </div>

          {/* DFlow Info Box */}
          <div className="rounded-xl p-3 text-xs space-y-1.5"
            style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)' }}>
            {[
              ['Routing', 'DFlow Protocol'],
              ['Protection', 'MEV-resistant execution'],
              ['Slippage', `${slippage}%`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-300">{value}</span>
              </div>
            ))}
          </div>

          {/* Swap Button */}
          {!connected ? (
            <div className="text-center py-3 text-sm text-gray-400">
              Connect your Solflare wallet to swap
            </div>
          ) : (
            <a
              href={buildDFlowURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
              <Zap size={18} fill="white" />
              Swap via DFlow
              <ExternalLink size={14} />
            </a>
          )}

          <p className="text-center text-xs text-gray-600">
            Powered by DFlow Protocol • MEV-protected liquidity routing
          </p>
        </div>
      </div>
    </div>
  );
}