import { defineChain } from "viem"
import type { AppKitNetwork } from "@reown/appkit/networks"
import { somniaTestnet, base, baseSepolia } from "@reown/appkit/networks"

export const CHAIN_IDS = {
  BASE: 8453,
  BASE_SEPOLIA: 84532,
  SOMNIA: 50312,
  ELECTRONEUM: 5201420
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

// Somnia Chain Config
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

// Base Mainnet Configuration
export const customBaseMainnet: AppKitNetwork = {
  ...base,
  id: CHAIN_IDS.BASE,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"],
    },
  },
}

// Base Sepolia Testnet Configuration
export const customBaseSepolia: AppKitNetwork = {
  ...baseSepolia,
  id: CHAIN_IDS.BASE_SEPOLIA,
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org"],
    },
  },
}
