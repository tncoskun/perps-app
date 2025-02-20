/* eslint-disable camelcase */
import { ZeroAddress } from "ethers";

import { fetchBatch } from "./fetchBatch";
import { PRICE_WINDOW_GRANULARITY } from "../constants";
import { allNetworks } from "../constants/networks";
import { translateToken } from "../dataLayer/functions/translateToken";
import {
  isETHorStakedEthToken,
  isUsdStableToken,
} from "../dataLayer/stablePairs";
import { memoizePromiseFn } from "../dataLayer/functions/memoizePromiseFn";

const randomNum = Math.random();

export const fetchTokenPrice = async (
  dispToken: string,
  chain: string,
  _lastTime: number
) => {
  const address = translateToken(dispToken, chain);
  const assetPlatform = allNetworks[chain]?.tokenPriceQueryAssetPlatform;
  const body = {
    config_path: "price",
    asset_platform: assetPlatform ? assetPlatform : "ethereum",
    token_address: address,
  };

  const response = await fetchBatch<"price">(body);

  if ("error" in response) throw new Error(response.error);
  if (response.value.source === "") {
    throw new Error("no source available");
  }
  if (response.value.usdPrice === Infinity) {
    throw new Error("USD value returned as Infinity");
  }
  return response.value;
};

export type TokenPriceFnReturn =
  | {
      nativePrice?:
        | {
            value: string;
            decimals: number;
            name: string;
            symbol: string;
          }
        | undefined;
      usdPrice: number;
      exchangeAddress?: string | undefined;
      exchangeName?: string | undefined;
    }
  | undefined;

export type TokenPriceFn = (
  address: string,
  chain: string
) => Promise<TokenPriceFnReturn>;

const randomOffset = PRICE_WINDOW_GRANULARITY * randomNum;

// TODO: remove this after moving over to fetchBatch
export function memoizeTokenPrice(): TokenPriceFn {
  const memoFn = memoizePromiseFn(fetchTokenPrice);
  return (address: string, chain: string) =>
    memoFn(
      address,
      chain,
      Math.floor((Date.now() + randomOffset) / PRICE_WINDOW_GRANULARITY)
    );
}
