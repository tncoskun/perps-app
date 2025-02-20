export interface CandleDataIF {
    time: number;
    period: number;
    tvlData: {
        time: number;
        tvl: number;
    };
    volumeUSD: number;
    averageLiquidityFee: number;
    minPriceDecimalCorrected: number;
    maxPriceDecimalCorrected: number;
    priceOpenDecimalCorrected: number;
    priceCloseDecimalCorrected: number;
    invMinPriceDecimalCorrected: number;
    invMaxPriceDecimalCorrected: number;
    invPriceOpenDecimalCorrected: number;
    invPriceCloseDecimalCorrected: number;
    priceCloseExclMEVDecimalCorrected: number;
    invPriceCloseExclMEVDecimalCorrected: number;
    minPriceExclMEVDecimalCorrected: number;
    invMinPriceExclMEVDecimalCorrected: number;
    maxPriceExclMEVDecimalCorrected: number;
    invMaxPriceExclMEVDecimalCorrected: number;
    priceOpenExclMEVDecimalCorrected: number;
    invPriceOpenExclMEVDecimalCorrected: number;
    isCrocData: boolean;
}

export interface CandlesByPoolAndDurationIF {
    pool: {
        baseAddress: string;
        quoteAddress: string;
        poolIdx: number;
        chainId: string;
    };
    duration: number;
    candles: Array<CandleDataIF>;
}


export interface CandleDataServerIF {
    priceOpen: number;
    priceClose: number;
    minPrice: number;
    maxPrice: number;
    volumeBase: number;
    volumeQuote: number;
    tvlBase: number;
    tvlQuote: number;
    feeRateOpen: number;
    feeRateClose: number;
    period: number;
    time: number;
}
