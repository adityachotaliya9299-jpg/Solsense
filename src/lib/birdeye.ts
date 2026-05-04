const BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
const BASE_URL = 'https://public-api.birdeye.so';

const headers = {
  'X-API-KEY': BIRDEYE_API_KEY || '',
  'x-chain': 'solana',
};

export async function getWalletPortfolio(walletAddress: string) {
  const res = await fetch(
    `${BASE_URL}/v1/wallet/token_list?wallet=${walletAddress}`,
    { headers }
  );
  const data = await res.json();
  return data;
}

export async function getTokenPrice(tokenAddress: string) {
  const res = await fetch(
    `${BASE_URL}/defi/price?address=${tokenAddress}`,
    { headers }
  );
  const data = await res.json();
  return data;
}

export async function getTopTokens() {
  const res = await fetch(
    `${BASE_URL}/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=10`,
    { headers }
  );
  const data = await res.json();
  return data;
}

export async function getWalletTransactions(walletAddress: string) {
  const res = await fetch(
    `${BASE_URL}/v1/wallet/tx_list?wallet=${walletAddress}&limit=10`,
    { headers }
  );
  const data = await res.json();
  return data;
}