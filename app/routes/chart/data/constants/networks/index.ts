import type { chainHexIds } from "..";
import type { NetworkIF } from "../../types/token/networkIF";
import type { TokenIF } from "../../types/token/TokenIF";
import { ethereumMainnet } from "./ethereumMainnet";
import { ethereumSepolia } from "./ethereumSepolia";

export const brand: string | undefined =
  import.meta.env.VITE_BRAND_ASSET_SET ?? "";

const networkDefinitions: NetworkIF[] = [ethereumMainnet, ethereumSepolia];

function getNetworks(chns: (string | chainHexIds)[]): {
  [x: string]: NetworkIF;
} {
  const networksToShow: NetworkIF[] = chns
    .map((c: string) => {
      const network: NetworkIF | undefined = networkDefinitions.find(
        (n: NetworkIF) => n.chainId.toLowerCase() === c
      );
      return network;
    })
    .filter((n: NetworkIF | undefined) => !!n) as NetworkIF[];
  const output: { [x: string]: NetworkIF } = {};
  networksToShow.forEach((n: NetworkIF) => (output[n.chainId] = n));
  return output;
}

export const allNetworks: { [x: string]: NetworkIF } = getNetworks(
  Object.keys({
    // ethereum mainnet
    "0x1": {
      // first value in array is default color scheme
      color: ["purple_dark", "purple_light", "futa_dark"],
      premiumColor: [],
    },
  })
);

export const supportedNetworks: { [x: string]: NetworkIF } =
  brand === "ambientProduction"
    ? getNetworks(
        Object.keys({
          // ethereum mainnet
          "0x1": {
            // first value in array is default color scheme
            color: ["purple_dark", "purple_light", "futa_dark"],
            premiumColor: [],
          },
        })
      )
    : getNetworks(
        Object.keys({
          "0xaa36a7": {
            // first value in array is default color scheme
            color: ["purple_dark", "purple_light", "futa_dark"],
            premiumColor: [],
          },
        })
      );

const vaultNetworks = networkDefinitions.filter((n: NetworkIF) =>
  n.vaultsEnabled ? n : null
);

export const vaultSupportedNetworkIds = vaultNetworks.map(
  (n: NetworkIF) => n.chainId
);
export const vaultSupportedNetworks = getNetworks(vaultSupportedNetworkIds);

export function getDefaultPairForChain(chainId: string): [TokenIF, TokenIF] {
  if (brand === "futa") {
    return (
      supportedNetworks[chainId].defaultPairFuta ?? [
        supportedNetworks[chainId].defaultPair[0],
        supportedNetworks[chainId].defaultPair[1],
      ]
    );
  } else {
    return [
      supportedNetworks[chainId].defaultPair[0],
      supportedNetworks[chainId].defaultPair[1],
    ];
  }
}

export { ethereumMainnet, ethereumSepolia };
