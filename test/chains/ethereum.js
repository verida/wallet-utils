var assert = require("assert");
import { utils } from "../../src/utils";
import { ethers } from "ethers";

describe("Ethereum", function () {
  describe("Create Account", function () {
    const account = utils.createWallet("ethr");

    it("Has valid DID", function () {
      assert(account["did"].substring(0, 11) == "did:ethr:0x", true);
      assert(account["did"].length == 51, true);
    });

    it("Has valid mnemonic", function () {
      assert(account["mnemonic"].length > 0, true);
      assert(account["mnemonic"].split(" ").length >= 12, true);
    });

    it("Has correct chain", function () {
      assert(account["chain"] == "ethr", true);
    });

    it("Has valid address", function () {
      assert.ok(ethers.utils.isAddress(account.address), "Is an address");
      assert.ok(
        ethers.utils.computeAddress(account.privateKey) == account.address,
        "Private key matches correct address"
      );
      assert.ok(
        ethers.utils.computeAddress(account.publicKey) == account.address,
        "Public key matches correct address"
      );
    });

    it("Has valid signing function", async function () {
      const message =
        'Do you approve access to view and update "Verida Wallet"?\n\n' +
        account["did"];

      const signature = await utils.signMessage(
        "ethr",
        account.privateKey,
        message
      );
      assert(signature && signature.length, true);

      const address = await utils.recoverAddress("ethr", message, signature);
      assert(address == account["address"], true);
    });

    it("Can retreive from mnemonic", function () {
      const accountRetreived = utils.getWallet("ethr", account.mnemonic);

      assert.ok(
        account.mnemonic == accountRetreived.mnemonic,
        "Mnemonic matches"
      );
      assert.ok(
        account.privateKey == accountRetreived.privateKey,
        "Private key matches"
      );
      assert.ok(
        account.publicKey == accountRetreived.publicKey,
        "Public key matches"
      );
      assert.ok(account.address == accountRetreived.address, "Address matches");
    });

    it("Can retreive from privateKey", function () {
      const accountRetreived = utils.getWalletByPrivateKey("ethr", account.privateKey);

      assert.ok(
        accountRetreived.mnemonic === null,
        "Mnemonic is null"
      );
      assert.ok(
        account.privateKey == accountRetreived.privateKey,
        "Private key matches"
      );
      assert.ok(
        account.publicKey == accountRetreived.publicKey,
        "Public key matches"
      );
      assert.ok(account.address == accountRetreived.address, "Address matches");
    });
  });
});
