"use client"

import dynamic from "next/dynamic";

const MainApp = dynamic(() => import("../client/src/MainApp"), { ssr: false });

export default function SyntheticV0PageForDeployment() {
  return <MainApp />;
}