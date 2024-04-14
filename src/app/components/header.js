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
          apiKey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk5ZjNlNDE4LTg2ZWUtNDRmMi05NmU1LTgwMTY3ZDUyOWM4ZCIsIm9yZ0lkIjoiMzg3OTA1IiwidXNlcklkIjoiMzk4NTg3IiwidHlwZUlkIjoiYTkxNWI5MzMtZmJkNS00OTllLTkwNGQtZDRmMDk1NzkxYjU3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTMwOTIxNzAsImV4cCI6NDg2ODg1MjE3MH0.cEJSsBqUamhtr9eWHscXHPYy_K6jmqq9B-8cLo_sYo8",
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
      </div>

      <div className="px-8 py-2 text-xs font-semibold text-white uppercase border ml-[500px]">
        {/* Display the Ethereum price if available */}
        <span>Ethereum Price: ${Number(ethPrice).toFixed(2)}</span>
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
