import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { customSomniaTestnet, customElectroneumTestnet } from './chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [
  customSomniaTestnet,
  customElectroneumTestnet
] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  SOMNIA: process.env.NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS,
  ELECTRONEUM: process.env.NEXT_PUBLIC_ETN_CONTRACT_ADDRESS
}