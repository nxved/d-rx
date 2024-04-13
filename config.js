const {
  PrescriptionManagement,
  RegistrationVault,
} = require("./contracts/abi.json");

const ChainConfig = {
  bsc: {
    bscTestnet: {
      id: 97,
      name: "Binance Smart Chain Testnet",
      network: "bsc-testnet",
      nativeCurrency: {
        decimals: 18,
        name: "BNB",
        symbol: "tBNB",
      },
      rpcUrls: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545"],
      blockExplorers: ["https://testnet.bscscan.com"],
      screamContract: {
        address: "0x13096aa0479B9a3164Bd50DB417920f9E56e7097",
        abi: PrescriptionManagement,
      },
    },
  },
  eth: {
    sepolia: {
      id: 11_155_111,
      name: "Sepolia",
      network: "Sepolia",
      nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
      rpcUrls: ["https://rpc.sepolia.org"],
      blockExplorers: {
        etherscan: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
        },
        default: {
          name: "Etherscan",
          url: "https://sepolia.etherscan.io",
        },
      },
      PrescriptionContract: {
        address: "0xb9d1847b0591b670CD4efe2c69E46fd3F0D23EEB",
        abi: PrescriptionManagement,
      },
      VaultContract: {
        address: "0xf996c1BcbB4EeB185FA74431f10613B571015d41",
        abi: RegistrationVault,
      },
    },
  },
};

export const chainConfig = ChainConfig.eth.sepolia;
export const prescriptionContract = chainConfig.PrescriptionContract;
export const vaultContract = chainConfig.VaultContract;
