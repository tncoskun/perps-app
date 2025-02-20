/* eslint-disable @typescript-eslint/no-explicit-any  */
import type { ChainSpec } from '@crocswap-libs/sdk';
import type { TokenIF } from './TokenIF';


export interface ChainSpecForWeb3Modal {
    chainId: number;
    name: string;
    currency: string;
    rpcUrl: string;
    explorerUrl: string;
}

export interface NetworkIF {
    chainId: string;
    GCGO_URL: string;
    chainSpecForWalletConnector: ChainSpecForWeb3Modal;
    evmRpcUrl: string;
    fallbackRpcUrl: string;
    poolIndex: number;
    gridSize: number;
    defaultPair: TokenIF[];
    defaultPairFuta?: [TokenIF, TokenIF];
    priorityPool?: [TokenIF, TokenIF];
    blockExplorer: string;
    displayName: string;
    tokenPriceQueryAssetPlatform: string | undefined;
    vaultsEnabled: boolean;
    tempestApiNetworkName: string;
    chainSpec: ChainSpec;
}
