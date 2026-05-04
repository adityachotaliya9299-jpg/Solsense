const BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
const BASE_URL = 'https://public-api.birdeye.so';

const headers = {
  'X-API-KEY': BIRDEYE_API_KEY || '',
  'x-chain': 'solana',
};

export async function getWalletPortfolio(walletAddress: string) {
  const res = await fetch(`${BASE_URL}/v1/wallet/token_list?wallet=${walletAddress}`, { headers });
  return res.json();
}

export async function getTokenPrice(tokenAddress: string) {
  const res = await fetch(`${BASE_URL}/defi/price?address=${tokenAddress}`, { headers });
  return res.json();
}

export async function getTopTokens() {
  const res = await fetch(`${BASE_URL}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=20`, { headers });
  return res.json();
}

export async function getWalletTransactions(walletAddress: string) {
  const res = await fetch(`${BASE_URL}/v1/wallet/tx_list?wallet=${walletAddress}&limit=20`, { headers });
  return res.json();
}

export async function getTokenOHLCV(tokenAddress: string, timeFrom: number, timeTo: number) {
  const res = await fetch(
    `${BASE_URL}/defi/ohlcv?address=${tokenAddress}&type=1D&time_from=${timeFrom}&time_to=${timeTo}`,
    { headers }
  );
  return res.json();
}

export async function getTokenOverview(tokenAddress: string) {
  const res = await fetch(`${BASE_URL}/defi/token_overview?address=${tokenAddress}`, { headers });
  return res.json();
}

export async function getWhaleTransactions() {
  const res = await fetch(
    `${BASE_URL}/defi/txs/token?address=So11111111111111111111111111111111111111112&offset=0&limit=20&tx_type=swap`,
    { headers }
  );
  return res.json();
}