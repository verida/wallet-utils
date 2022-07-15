const utils = require("./utils").utils;

const algosdk = require("algosdk");
const bip39 = require("bip39");
const ethers = require("ethers");

// paths based on BIP 44 standard
const ETH_PATH = "m/44'/60'/0'/0/0";
const ALGO_PATH = "m/44'/283'/0'/0/0";
const NEAR_PATH = "m/44'/397'/0'/0/0";
const MATIC_PATH = "m/44'/966'/0'/0/0";

export default class MultiChainWallets {
  static generateMnemonic(): string {
    // generates random mnemonic
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
  }

  static generateHDWallets(mnemonic: string): object {
    // create base node using above mnemonic and then child node based on paths
    const node = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const ethNode = node.derivePath(ETH_PATH);
    const algoNode = node.derivePath(ALGO_PATH);
    const nearNode = node.derivePath(NEAR_PATH);
    const polygonNode = node.derivePath(MATIC_PATH);

    // create algo wallet
    const algoMnemonic = algosdk.mnemonicFromSeed(
      Buffer.from(algoNode.privateKey.slice(2), "hex")
    );
    const algoWallet = utils.getWallet("algo", algoMnemonic);
    const ethrWallet = utils.getWallet("ethr", ethNode.mnemonic.phrase);
    const nearWallet = utils.getWallet("near", nearNode.mnemonic.phrase);
    const polygonWallet = utils.getWallet("poly", polygonNode.mnemonic.phrase);

    return {
      algo: algoWallet,
      ethr: ethrWallet,
      near: nearWallet,
      poly: polygonWallet,
    };
  }
}
