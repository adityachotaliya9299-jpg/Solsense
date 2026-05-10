# SolSense — Smart Wallet Intelligence

<div align="center">

![SolSense Banner](https://img.shields.io/badge/SolSense-Smart%20Wallet%20Intelligence-7c3aed?style=for-the-badge&logo=solana)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-solsense--rho.vercel.app-00D4AA?style=for-the-badge)](https://solsense-rho.vercel.app)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![Birdeye](https://img.shields.io/badge/Birdeye-API-00D4AA?style=for-the-badge)](https://birdeye.so)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Real-time Solana portfolio analytics powered by Birdeye × Solflare × DFlow**

[🚀 Live Demo](https://solsense-rho.vercel.app)

</div>

---

## 🌟 What is SolSense?

SolSense is a **production-ready Solana wallet intelligence dashboard** that gives traders and DeFi users complete visibility into their on-chain activity and the broader Solana market — all in one place.

Built for the **Eitherway Frontier Hackathon** with deep integrations across Birdeye, Solflare, and DFlow.

---

## ✨ Features

### 📊 Portfolio Intelligence
- Real-time token balances and USD values via Birdeye API
- 24h PnL tracking per token (green/red indicators)
- Click any token to view 7D/30D price chart
- Demo Mode with sample data for exploration

### 📈 Market Intelligence
- Top 20 Solana tokens by 24h volume
- Live price and % change per token
- Top Gainers & Top Losers panels
- Full market table with volume and market cap

### 🐋 Whale Tracker
- Live monitoring of large SOL swap transactions
- BUY/SELL direction indicators
- Auto-refreshes every 30 seconds
- Direct Solscan links for verification

### 🔔 Price Alerts
- Set custom price targets (above/below) for any token
- Real browser push notifications when triggered
- Checks prices every 15 seconds
- Export alerts to JSON, persisted in localStorage

### 🔍 Token Search
- Search any Solana token by contract address
- Quick buttons for SOL, BONK, JTO, WIF, PYTH
- Shows price, 24h change, volume, market cap
- One-click price chart via Birdeye OHLCV

### ⚡ MEV-Protected Swap (DFlow)
- Real swap quotes via Jupiter aggregator
- MEV-protected routing via DFlow Protocol
- Slippage control (0.1% to 2.0%)
- Supports SOL, USDC, USDT, BONK, JTO, WIF

### 🎭 Demo Mode
- Full-featured demo without a funded wallet
- Sample portfolio: SOL, USDC, JUP
- Sample transactions and market data
- Perfect for judges and new users

---

## 🏗 Architecture

```
solsense/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Root redirect → /landing
│   │   ├── landing/
│   │   │   └── page.tsx          # Marketing landing page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main app dashboard (500+ lines)
│   │   ├── layout.tsx            # Root layout with wallet provider
│   │   └── globals.css           # Global styles + animations
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky navbar with scroll effect
│   │   ├── Footer.tsx            # Site footer with links
│   │   ├── PriceChart.tsx        # OHLCV chart modal (Recharts)
│   │   ├── WhaleTracker.tsx      # Live whale monitoring
│   │   ├── PriceAlerts.tsx       # Alert system with notifications
│   │   ├── SwapWidget.tsx        # DFlow swap interface
│   │   ├── TokenSearch.tsx       # Token search + overview
│   │   └── ErrorBoundary.tsx     # Error recovery UI
│   ├── providers/
│   │   └── WalletProvider.tsx    # Solflare wallet setup
│   └── lib/
│       └── birdeye.ts            # All Birdeye API calls + caching
```

### Data Flow

```
User → Solflare Wallet → SolSense Dashboard
                              ↓
                    Birdeye API (7 endpoints)
                    ├── /v1/wallet/token_list    → Portfolio
                    ├── /defi/tokenlist          → Market data
                    ├── /defi/ohlcv              → Price charts
                    ├── /v1/wallet/tx_list       → Transactions
                    ├── /defi/txs/token          → Whale tracking
                    ├── /defi/price              → Alert prices
                    └── /defi/token_overview     → Token search
                              ↓
                    Jupiter API → Real swap quotes
                              ↓
                    DFlow Protocol → MEV-protected execution
```

---

## 🔗 Partner Integrations

### 🟢 Birdeye (Primary Track)

| Endpoint | Usage |
|----------|-------|
| `/v1/wallet/token_list` | Portfolio balances and USD values |
| `/defi/tokenlist` | Top 20 tokens by 24h volume |
| `/defi/ohlcv` | 7D/30D price chart data |
| `/v1/wallet/tx_list` | Transaction history |
| `/defi/txs/token` | Whale transaction monitoring |
| `/defi/price` | Real-time prices for alerts |
| `/defi/token_overview` | Token search details |

### 🟠 Solflare (Secondary Track)
- Primary wallet connection via `@solana/wallet-adapter-react`
- Wallet-first UX — all features built around connected wallet
- Auto-connect on return visits
- Mainnet live connection

### 🔵 DFlow (Third Integration)
- MEV-protected swap routing
- Real quotes via Jupiter aggregator
- Slippage control (0.1% to 2%)
- Referral tracking via `?ref=solsense`

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Glassmorphism |
| Animations | Framer Motion |
| Charts | Recharts (AreaChart) |
| Wallet | @solana/wallet-adapter |
| Data | Birdeye Public API |
| Swap Quotes | Jupiter Aggregator v6 |
| Deployment | Vercel |
| Network | Solana Mainnet |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Birdeye API key (free at [birdeye.so](https://birdeye.so))
- A Solflare wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/adityachotaliya9299-jpg/Solsense
cd Solsense

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key_here
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

### Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎯 Hackathon

**Event:** Eitherway Frontier Track — Superteam Earn  
**Prize Pool:** $20,000 USDC  
**Primary Track:** Birdeye ($3,000)  
**Grand Prize Eligible:** Yes (3 partner integrations)  

### Judging Criteria

| Criteria | Weight | Our Score |
|----------|--------|-----------|
| Real-world utility | 30% | ⭐⭐⭐⭐⭐ |
| Product quality | 30% | ⭐⭐⭐⭐ |
| Integration depth | 25% | ⭐⭐⭐⭐⭐ |
| Adoption potential | 15% | ⭐⭐⭐⭐ |

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to landing page |
| `/landing` | Marketing page with hero, features, FAQ |
| `/dashboard` | Main app with all 7 tabs |

---

## 🔒 Security

- No private keys stored
- All wallet data fetched from public Solana data
- API keys stored in environment variables
- No user data collected or stored server-side

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Birdeye](https://birdeye.so) — Real-time Solana data
- [Solflare](https://solflare.com) — Wallet infrastructure  
- [DFlow](https://dflow.net) — MEV-protected trading
- [Jupiter](https://jup.ag) — Swap quote aggregation
- [Eitherway](https://eitherway.ai) — Deployment platform

---

<div align="center">

**Built with ❤️ for the Eitherway Frontier Hackathon**

[🚀 Launch App](https://solsense-rho.vercel.app) • [⭐ Star on GitHub](https://github.com/adityachotaliya9299-jpg/Solsense)

</div>
