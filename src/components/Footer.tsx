'use client';

import { Zap, Twitter, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t mt-32"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(3,3,8,0.8)' }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                <Zap size={16} fill="white" className="text-white" />
              </div>
              <span className="font-black text-white">SolSense</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Smart wallet intelligence for Solana traders. Real-time analytics powered by Birdeye.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/adityachotaliya9299-jpg/Solsense" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Github size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Portfolio Tracker', href: '/dashboard' },
                { label: 'Whale Tracker', href: '/dashboard' },
                { label: 'Price Alerts', href: '/dashboard' },
                { label: 'Token Search', href: '/dashboard' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/40 hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Partners</h4>
            <ul className="space-y-3">
              {[
                { label: 'Birdeye', href: 'https://birdeye.so' },
                { label: 'Solflare', href: 'https://solflare.com' },
                { label: 'DFlow', href: 'https://dflow.net' },
                { label: 'Solana', href: 'https://solana.com' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1">
                    {item.label} <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: 'GitHub', href: 'https://github.com/adityachotaliya9299-jpg/Solsense' },
                { label: 'Birdeye Docs', href: 'https://docs.birdeye.so' },
                { label: 'Solflare Docs', href: 'https://docs.solflare.com' },
                { label: 'DFlow Docs', href: 'https://pond.dflow.net/build/introduction' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1">
                    {item.label} <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-sm text-white/30">© 2025 SolSense. Built for Eitherway Frontier Hackathon.</p>
          <div className="flex items-center gap-2 text-sm text-white/30">
            <span>Built on</span>
            <span className="text-purple-400 font-semibold">Solana</span>
            <span>•</span>
            <span>Powered by</span>
            <span className="text-blue-400 font-semibold">Birdeye</span>
          </div>
        </div>
      </div>
    </footer>
  );
}