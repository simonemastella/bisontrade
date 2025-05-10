import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { Hex, Mnemonic } from '@vechain/sdk-core';
import 'dotenv/config';
import '@vechain/sdk-hardhat-plugin';
import { ethers } from 'ethers';

const vechain_pk_buff = Hex.of(
  Mnemonic.toPrivateKey(process.env['mnemonic']!.split(' '))
).toString();
const base_pk_buff = ethers.Wallet.fromPhrase(
  process.env['mnemonic']!
).privateKey;

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    vechain_testnet: {
      url: 'https://testnet.vechain.org',
      accounts: [vechain_pk_buff],
    },
    base_testnet: {
      //obv sepolia, the only one
      url: 'https://sepolia.base.org',
      accounts: [base_pk_buff],
    },
  },
};

export default config;
