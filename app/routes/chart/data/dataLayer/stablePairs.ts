// @return true if the two tokens constitute a stable pair (USD based stables only for now)
//
// NOTE: Definition of what constitutes a "stable pair" is arbitrary and just based
//       on the devs discretion. Users should not assume that true/false implies



import { ZERO_ADDRESS } from '../constants';
import { MAINNET_TOKENS } from '../constants/networks/ethereumMainnet';
import { SEPOLIA_TOKENS } from '../constants/networks/ethereumSepolia';

//       any sort of specific guaranteed relation between the tokens.
export function isStablePair(addr1: string, addr2: string): boolean {
    return isUsdStableToken(addr1) && isUsdStableToken(addr2);
}

// @return true if the token represents a USD-based stablecoin
// NOTE: Decision of whether a token counts as stable or not is arbitrary and just at the
//       discretion of the app authors
export function isUsdStableToken(addr: string): boolean {
    return STABLE_USD_TOKENS.includes(addr.toLowerCase());
}

export function isUsdcToken(addr: string): boolean {
    return USDC_TOKENS.includes(addr.toLowerCase());
}


export function isETHorStakedEthToken(addr: string): boolean {
    return (
        addr === ZERO_ADDRESS || STAKED_ETH_TOKENS.includes(addr.toLowerCase())
    );
}

export function isWbtcOrStakedBTCToken(addr: string): boolean {
    return isWbtcToken(addr) || STAKED_BTC_TOKENS.includes(addr.toLowerCase());
}

export function isETHPair(addr1: string, addr2: string): boolean {
    return isETHorStakedEthToken(addr1) && isETHorStakedEthToken(addr2);
}

export function isBtcPair(addr1: string, addr2: string): boolean {
    return isWbtcOrStakedBTCToken(addr1) && isWbtcOrStakedBTCToken(addr2);
}

export function isWbtcToken(addr: string): boolean {
    return WBTC_TOKENS.includes(addr.toLowerCase());
}


// @return true if the token is a WETH or wrapped native token asset
export function isWrappedNativeToken(addr: string): boolean {
    return WRAPPED_NATIVE_TOKENS.includes(addr.toLowerCase());
}

export function remapTokenIfWrappedNative(addr: string): string {
    if (isWrappedNativeToken(addr)) {
        return ZERO_ADDRESS;
    }
    return addr;
}

// USDC prioritized in some lists
export const USDC_TOKENS = [
    MAINNET_TOKENS.USDC, 
    SEPOLIA_TOKENS.USDC,
  
].map((x) => x.address.toLowerCase());

export const STABLE_USD_TOKENS = [
    MAINNET_TOKENS.DAI,
    MAINNET_TOKENS.USDT,
]
    .map((x) => x.address.toLowerCase())
    .concat(USDC_TOKENS);

export const WBTC_TOKENS = [
    MAINNET_TOKENS.WBTC,
    SEPOLIA_TOKENS.WBTC,
].map((x) => x.address.toLowerCase());

export const STAKED_ETH_TOKENS = [
    MAINNET_TOKENS.swETH,
    MAINNET_TOKENS.rsETH,
    MAINNET_TOKENS.rswETH,
    MAINNET_TOKENS.STONE,
].map((x) => x.address.toLowerCase());

export const USD_EXCLUDED_TOKENS = [
    MAINNET_TOKENS.SWELL.address,
].map((x) => x.toLowerCase());

export const STAKED_BTC_TOKENS = [
    MAINNET_TOKENS.tBTC,
].map((x) => x.address.toLowerCase());

export const WRAPPED_NATIVE_TOKENS = [
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // Mainnet
    '0x5300000000000000000000000000000000000004', // Scroll (test and main)
    '0x4300000000000000000000000000000000000004', // Blast
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // Sepolia
    '0x4200000000000000000000000000000000000023', // Blast Sepolia
    '0xaA6210015fbf0855F0D9fDA3C415c1B12776Ae74', // Plume Sepolia
    '0x863d7abb9c62d8bc69ea9ebc3e3583057d533e6f', // Scroll Sepolia
].map((x) => x.toLowerCase());
