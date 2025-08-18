import { defineChain } from "wagmi"
import type { AppKitNetwork } from "@reown/appkit/networks"
import { somniaTestnet } from "@reown/appkit/networks"

export const CHAIN_IDS = {
  SOMNIA: 50312,
  ELECTRONEUM: 52014
} as const

export const electroneum = defineChain({
  id: CHAIN_IDS.ELECTRONEUM,
  name: "Electroneum Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETN",
    symbol: "ETN",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ETN_RPC_URL || ""],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ETN_RPC_URL || ""],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet-explorer.electroneum.com" },
  },
  testnet: true,
})

// Create custom network configurations with reliable RPCs
export const customSomniaTestnet: AppKitNetwork = {
  ...somniaTestnet,
  id: CHAIN_IDS.SOMNIA,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || ""],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_SOMNIA_RPC_URL || ""],
    },
  },
}

export const customElectroneumTestnet: AppKitNetwork = {
  ...electroneum,
  id: CHAIN_IDS.ELECTRONEUM,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ETN_RPC_URL || ""],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ETN_RPC_URL || ""],
    },
  },
}
