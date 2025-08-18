"use client";

import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHAIN_IDS, customSomniaTestnet, customElectroneumTestnet } from "@/config/chains";

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { open } = useAppKit();
  const [isConnecting, setIsConnecting] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Copy address to clipboard
  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  // Connect handler
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      open();
    } catch (e) {
      console.error("Connection error:", e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem("colorsnap_player_name");
    localStorage.removeItem("colorsnap_active_game_id");
    localStorage.removeItem("colorsnap_player_points");
    setDropdownOpen(false);
    router.push("/");
  };

  const handleSwitchNetwork = (chainId: number) => {
    if (switchNetwork) {
      switchNetwork(chainId);
    }
    setDropdownOpen(false);
  };

  // Dropdown close on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Connected UI
  if (isConnected && address) {
    const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((open) => !open)}
          className="relative px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/25 border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2 group overflow-hidden
          sm:px-4 sm:py-2.5
          px-3 py-2 text-xs min-w-0 max-w-full w-full sm:w-auto"
        >
          <span className="font-mono truncate max-w-[90px] sm:max-w-none">
            {shortened}
          </span>
          <span className="text-xs opacity-60">
            ({chain?.name || 'Unknown Network'})
          </span>
          {justCopied ? (
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
          <svg
            className="w-4 h-4 text-white/70 transition-transform duration-200 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
            <div className="py-2">
              {/* Network Selection Section */}
              <div className="px-4 py-2 text-xs text-white/50 border-b border-white/10">
                Networks
              </div>
              <button
                onClick={() => handleSwitchNetwork(CHAIN_IDS.SOMNIA)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-white/10 text-left ${
                  chain?.id === customSomniaTestnet.id ? 'text-blue-400' : 'text-white/90'
                }`}
              >
                <span>Somnia Testnet</span>
                {chain?.id === customSomniaTestnet.id && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Active</span>
                )}
              </button>
              <button
                onClick={() => handleSwitchNetwork(CHAIN_IDS.ELECTRONEUM)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-white/10 text-left ${
                  chain?.id === customElectroneumTestnet.id ? 'text-blue-400' : 'text-white/90'
                }`}
              >
                <span>Electroneum Testnet</span>
                {chain?.id === customElectroneumTestnet.id && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Active</span>
                )}
              </button>

              {/* Account Actions Section */}
              <div className="border-t border-white/10 mt-2">
                <button
                  onClick={copyToClipboard}
                  className="w-full px-4 py-2 text-left text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{justCopied ? "Copied!" : "Copy Address"}</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Disconnected UI
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="relative px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-purple-500/25 border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2
      sm:px-4 sm:py-2.5
        px-3 py-2 text-xs min-w-0 max-w-full w-full sm:w-auto"
    >
      {isConnecting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}
