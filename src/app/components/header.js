"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export default function Header() {
  const { address } = useAccount();
  const [addr, setAddr] = useState(null);

  const { open, close } = useWeb3Modal();
  const handleWallet = () => {
    open();
  };

  useEffect(() => {
    if (address) {
      setAddr(address);
    } else {
      setAddr(null);
    }
  }, [address]);

  return (
    <header className="flex items-center justify-between p-5 bg-black">
      <div className="flex">
        {/* <Link href="/#">
          <img className="" src="/Token.png" />
        </Link> */}
        <Link
          href="/#"
          className="px-8 py-2 text-xs font-semibold border uppercas"
        >
          Home
        </Link>
        <div className="pt-1 pl-8">
          <Link
            href="/healthproviders"
            className="px-8 py-2 text-xs font-semibold uppercase border"
          >
            For Healthcare Provider
          </Link>
        </div>
        <div className="pt-1 pl-8">
          <Link
            href="/individuals"
            className="px-8 py-2 text-xs font-semibold uppercase border"
          >
            For Individuals
          </Link>
        </div>
      </div>
      <button
        className="px-8 py-2 text-xs font-semibold uppercase border"
        onClick={handleWallet}
      >
        {addr ? "Disconnect" : "Connect Your Wallet"}
      </button>
      {/* <div>
        <w3m-button />
      </div> */}
    </header>
  );
}
