"use client";

import dynamic from "next/dynamic";
const ColorSnapGame = dynamic(() => import("../../components/ColorSnapGame"), { ssr: false });

export default function GamePage() {
  return <ColorSnapGame />;
} 