import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { somniaTestnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Create a custom Somnia Testnet network with a reliable RPC
export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL

const customSomniaTestnet = {
  ...somniaTestnet,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
}

export const networks = [customSomniaTestnet] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig