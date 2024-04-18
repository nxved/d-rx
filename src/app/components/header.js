"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Moralis from "moralis";

export default function Header() {
  const { address } = useAccount();
  const [addr, setAddr] = useState(null);
  const [ethPrice, setEthPrice] = useState(0.0);

  const { open, close } = useWeb3Modal();
  const handleWallet = () => {
    open();
  };

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API,
        });

        const response = await Moralis.EvmApi.token.getTokenPrice({
          chain: "0x1",
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        });
        const jsonResponse = response.getResponse();
        setEthPrice(jsonResponse.usdPriceFormatted);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (address) {
      setAddr(address);
    } else {
      setAddr(null);
    }
  }, [address]);

  return (
    <header className="flex items-center justify-between p-5 text-white bg-black">
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
        <div className="pl-8">
          <div className="px-8 py-2 text-xs font-semibold uppercase border">
            Ethereum Price: ${Number(ethPrice).toFixed(2)}
          </div>
        </div>
      </div>

      <button
        className="px-8 py-2 text-xs font-semibold uppercase border"
        onClick={handleWallet}
      >
        {addr ? "Disconnect" : "Connect Wallet"}
      </button>
      {/* <div>
        <w3m-button />
      </div> */}
    </header>
  );
}
