const vechainUtils = require("./chains/vechain").default;
const ethereumUtils = require("./chains/ethereum").default;
const nearUtils = require("./chains/near").default;
const algorandUtils = require("./chains/algorand").default;

type Dictionary = { [index: string]: any };

const chains: Dictionary = {
  ethr: ethereumUtils,
  poly: ethereumUtils,
  vechain: vechainUtils,
  near: nearUtils,
  algo: algorandUtils,
};

export class utils {
  /**
   * Create a new account
   * @param chain `ethereum` or `vechain`
   */
  static createWallet(chain: string): object {
    const wallet = chains[chain].createWallet();
    const did = "did:" + chain + ":" + wallet["address"];

    return {
      chain: chain,
      mnemonic: wallet["mnemonic"],
      privateKey: wallet["privateKey"],
      publicKey: wallet["publicKey"],
      did: did,
      address: wallet["address"],
    };
  }

  static getWallet(chain: string, mnemonic: string): object {
    const wallet = chains[chain].getWallet(mnemonic);
    const did = "did:" + chain + ":" + wallet["address"];

    return {
      chain: chain,
      mnemonic: wallet["mnemonic"],
      privateKey: wallet["privateKey"],
      publicKey: wallet["publicKey"],
      did: did,
      address: wallet["address"],
    };
  }

  static getWalletByPrivateKey(chain: string, privateKey: string): object {
    const wallet = chains[chain].getWalletByPrivateKey(privateKey);
    const did = "did:" + chain + ":" + wallet["address"];

    return {
      chain: chain,
      mnemonic: wallet["mnemonic"],
      privateKey: wallet["privateKey"],
      publicKey: wallet["publicKey"],
      did: did,
      address: wallet["address"],
    };
  }

  static getPublicKey(chain: string, privateKey: string): string {
    return chains[chain].getPublicKey(privateKey);
  }

  static getAddress(chain: string, privateKey: string): string {
    return chains[chain].getAddress(privateKey);
  }

  static async signMessage(
    chain: string,
    privateKey: string,
    message: string
  ): Promise<string> {
    return chains[chain].signMessage(privateKey, message);
  }

  static recoverAddress(
    chain: string,
    message: string,
    signature: string
  ): string {
    return chains[chain].recoverAddress(message, signature);
  }

  static async verifySignature(
    chain: string,
    message: string,
    signature: string,
    did: string
  ): Promise<boolean> {
    return chains[chain].verifySignature(message, signature, did);
  }
}
