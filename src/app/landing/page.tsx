'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, TrendingUp, Bell, Search, BarChart3, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen text-white"
      style={{ background: 'linear-gradient(135deg, #030308 0%, #07040f 50%, #030810 100%)' }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)', filter: 'blur(80px)' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.3), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <Shield size={12} className="text-purple-400" />
            <span className="text-purple-300 font-medium">Powered by Birdeye × Solflare × DFlow</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tighter">
            <span style={{ background: 'linear-gradient(135deg, #fff 0%, #e2d9f3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Smart Wallet
            </span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            Real-time Solana portfolio analytics, whale tracking, price alerts, and MEV-protected swaps — all in one powerful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap">
            <motion.a href="/dashboard"
              whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 40px rgba(124,58,237,0.35)' }}>
              Launch App <ArrowRight size={18} />
            </motion.a>
            <motion.a href="https://github.com/adityachotaliya9299-jpg/Solsense" target="_blank"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white/70 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              View GitHub <ExternalLink size={16} />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center justify-center gap-12 mt-20">
            {[
              { value: '7+', label: 'Birdeye API Endpoints' },
              { value: '3', label: 'Partner Integrations' },
              { value: 'Live', label: 'Solana Mainnet' },
              { value: '100%', label: 'Open Source' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
          variants={stagger} className="text-center mb-20">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <span className="text-purple-400">Everything you need</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl font-black text-white mb-6 tracking-tight">
            Built for Serious Traders
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 text-lg max-w-xl mx-auto">
            Every feature is designed around real trading workflows and powered by live on-chain data.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <BarChart3 size={24}/>, color: '#7c3aed', title: 'Portfolio Intelligence', desc: 'Real-time token balances, USD values, and 24h PnL tracking for every asset in your wallet. Powered by Birdeye\'s live pricing API.', tag: 'Birdeye API' },
            { icon: <TrendingUp size={24}/>, color: '#0891b2', title: 'Market Intelligence', desc: 'Track top tokens by volume, see live gainers and losers, and spot market anomalies before everyone else.', tag: 'Live Data' },
            { icon: '🐋', color: '#f59e0b', title: 'Whale Tracker', desc: 'Monitor large SOL swap transactions in real-time. Know what smart money is doing before it moves the market.', tag: 'Real-time' },
            { icon: <Bell size={24}/>, color: '#059669', title: 'Price Alerts', desc: 'Set custom price targets for any token and receive instant browser push notifications when they\'re hit.', tag: 'Push Notifications' },
            { icon: <Search size={24}/>, color: '#7c3aed', title: 'Token Search', desc: 'Look up any Solana token by address. Get instant price, volume, market cap, and 7D/30D price charts.', tag: 'Any Token' },
            { icon: <Zap size={24}/>, color: '#2563eb', title: 'MEV-Protected Swaps', desc: 'Swap tokens directly with DFlow\'s MEV-resistant routing. Get real quotes via Jupiter aggregator.', tag: 'DFlow Protocol' },
          ].map((f) => (
            <motion.div key={f.title} variants={fadeUp}
              whileHover={{ y: -6, borderColor: `${f.color}44` }}
              className="rounded-3xl p-8 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{ background: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${f.color}15`, color: f.color }}>
                  {f.tag}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-3">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger} className="text-center mb-20">
          <motion.h2 variants={fadeUp} className="text-5xl font-black text-white mb-6 tracking-tight">
            How It Works
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 text-lg max-w-xl mx-auto">
            Get started in seconds. No sign-up required.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Connect Wallet', desc: 'Click "Launch App" and connect your Solflare wallet. Your portfolio loads instantly from Birdeye.', color: '#7c3aed' },
            { step: '02', title: 'Explore Dashboard', desc: 'Navigate through Portfolio, Market, Whales, Alerts, Search, and Swap tabs. All data is live.', color: '#2563eb' },
            { step: '03', title: 'Trade Smarter', desc: 'Set price alerts, track whale movements, search any token, and swap with MEV protection via DFlow.', color: '#059669' },
          ].map((s, i) => (
            <motion.div key={s.step} variants={fadeUp}
              className="relative rounded-3xl p-8"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-6xl font-black mb-6 opacity-10" style={{ color: s.color }}>{s.step}</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-sm font-bold text-white"
                style={{ background: s.color }}>
                {parseInt(s.step)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-white/20 text-2xl">→</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="relative z-10 max-w-7xl mx-auto px-8 py-32">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger} className="text-center mb-20">
          <motion.h2 variants={fadeUp} className="text-5xl font-black text-white mb-6 tracking-tight">
            Powered By
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 text-lg max-w-xl mx-auto">
            Built on top of the best infrastructure in the Solana ecosystem.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Birdeye', role: 'Primary Data Partner', desc: 'Real-time token prices, portfolio data, OHLCV charts, whale tracking, and market intelligence via 7+ API endpoints.', color: '#00D4AA', href: 'https://birdeye.so' },
            { name: 'Solflare', role: 'Wallet Integration', desc: 'Deep wallet integration as the primary connection method. Wallet-first UX with auto-connect and Mainnet support.', color: '#FF6B35', href: 'https://solflare.com' },
            { name: 'DFlow', role: 'Trading Infrastructure', desc: 'MEV-protected swap routing with real quotes via Jupiter aggregator. Slippage control and referral tracking.', color: '#4F46E5', href: 'https://dflow.net' },
          ].map((p) => (
            <motion.a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: `${p.color}44` }}
              className="rounded-3xl p-8 transition-all duration-300 block"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-black" style={{ color: p.color }}>{p.name}</div>
                <ExternalLink size={16} className="text-white/20" />
              </div>
              <div className="text-xs font-semibold mb-3 px-2 py-1 rounded-full w-fit"
                style={{ background: `${p.color}15`, color: p.color }}>
                {p.role}
              </div>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-8 py-32">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-5xl font-black text-white mb-6 tracking-tight">FAQ</motion.h2>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={stagger} className="space-y-4">
          {[
            { q: 'Is SolSense free to use?', a: 'Yes, completely free. Connect your Solflare wallet and start tracking instantly.' },
            { q: 'Do I need to sign up?', a: 'No sign-up required. Just connect your wallet and you\'re in.' },
            { q: 'Which wallets are supported?', a: 'Solflare is the primary wallet. Other Solana wallets may also work via the wallet adapter.' },
            { q: 'How is my data protected?', a: 'SolSense never stores your private keys. All wallet data is fetched live from public Solana data via Birdeye.' },
            { q: 'What is Demo Mode?', a: 'Demo Mode shows sample portfolio data so you can explore all features without a funded wallet.' },
            { q: 'How does the swap work?', a: 'Swaps are routed through DFlow Protocol with MEV protection. Real quotes come from Jupiter aggregator.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h4 className="font-bold text-white mb-2">{item.q}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="rounded-3xl p-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15), transparent 70%)' }} />
          <h2 className="text-4xl font-black text-white mb-4 relative z-10">Ready to trade smarter?</h2>
          <p className="text-white/50 mb-10 relative z-10">Join traders using SolSense to get ahead of the market.</p>
          <motion.a href="/dashboard"
            whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(124,58,237,0.6)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-bold text-white relative z-10"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
            Launch SolSense <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}