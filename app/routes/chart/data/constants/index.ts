export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ANALYTICS_URL = "https://ambindexer.net/analytics/run?";

export const BATCH_ENS_CACHE_EXPIRY = import.meta.env.BATCH_ENS_CACHE_EXPIRY
  ? parseFloat(import.meta.env.BATCH_ENS_CACHE_EXPIRY)
  : 1 * 60 * 60 * 1000;

export const BATCH_SIZE = import.meta.env.VITE_BATCH_BATCH_SIZE
  ? parseFloat(import.meta.env.VITE_BATCH_BATCH_SIZE)
  : 50;


export const PRICE_WINDOW_GRANULARITY = 15 * 60 * 1000;

export const CACHE_UPDATE_FREQ_IN_MS = 60000; // 1 minute


export type chainHexIds =
    | '0x1' // ethereum mainnet
    | '0x82750' // scroll mainnet
    | '0x783' // swell mainnet
    | '0x18231' // plume mainnet
    | '0x13e31' // blast mainnet
    | '0xaa36a7' // ethereum sepolia
    | '0x8274f' // scroll sepolia
    | '0xa0c71fd' // blast sepolia
    | '0x18230' // plume sepolia
    | '0x784' // swell sepolia
    | '0x14a34'; // base sepolia
