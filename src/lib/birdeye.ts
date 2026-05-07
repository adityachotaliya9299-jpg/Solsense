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

// Cache for API responses
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_TTL = 30000; // 30 seconds

async function fetchWithCache(url: string, options: RequestInit) {
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < CACHE_TTL) {
    return cache[url].data;
  }
  const res = await fetch(url, options);
  const data = await res.json();
  cache[url] = { data, timestamp: now };
  return data;
}

export async function getWhaleTransactions() {
  // Use token trades endpoint which has proper volume data
  const data = await fetchWithCache(
    `${BASE_URL}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=20`,
    { headers }
  );
  return data;
}

export async function getLargeTransactions() {
  const res = await fetch(
    `${BASE_URL}/defi/txs/token?address=So11111111111111111111111111111111111111112&offset=0&limit=50&tx_type=swap`,
    { headers }
  );
  return res.json();
}

export async function searchTokenByName(keyword: string) {
  const data = await fetchWithCache(
    `${BASE_URL}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=20&keyword=${keyword}`,
    { headers }
  );
  return data;
}