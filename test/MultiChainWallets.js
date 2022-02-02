const assert = require("assert");
import MultiChainWallets from "../src/MultiChainWallets";

describe("MultiChainWallets", function () {
  describe("Create mnemonic", function () {
    const mnemonic = MultiChainWallets.generateMnemonic();
    console.log(mnemonic, "mnemonic");

    it("Has valid mnemonic", function () {
      assert(mnemonic.length > 0, true);
      assert(mnemonic.split(" ").length === 12, true);
    });
  });

  describe("Create Multi Chain Wallets", function () {
    const mnemonic =
      "today door leopard valley myself deliver circle intact steak credit fetch tribe";
    const wallets = MultiChainWallets.generateHDWallets(mnemonic);

    it("Creates expected account address Ethereum", function () {
      assert(
        wallets.ethr.address === "0x0D58F285B6209c5A8B9b130be87010BF22db40bc",
        true
      );
    });

    it("Creates expected account address Algorand", function () {
      assert(
        wallets.algo.address ===
          "VN3WOKRJP7NFADNFM4MO7N2GVS23UIK433MC55ILSRZ72Z5BD672MGZ3KU",
        true
      );
    });
  });
});
