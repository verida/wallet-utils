const assert = require("assert");
const algosdk = require("algosdk");
import { utils } from "../../src/utils";

describe("Algorand", function () {
  describe("Create Account", function () {
    const account = utils.createWallet("algo");

    it("Has valid DID", function () {
      assert(account["did"].substring(0, 9) == "did:algo:", true);
      assert(account["did"].length == 67, true);
    });

    it("Has valid mnemonic", function () {
      assert(account["mnemonic"].length > 0, true);
      assert(account["mnemonic"].split(" ").length >= 12, true);
    });

    it("Has correct chain", function () {
      assert(account["chain"] == "algo", true);
    });

    it("Has valid address", function () {
      assert.ok(algosdk.isValidAddress(account.address), "Is an address");
      const address = utils.getAddress("algo", account.privateKey);
      assert.ok(
        address == account.address,
        "Private key matches correct address"
      );
    });

    it("Has valid message signing function", async function () {
      const message =
        'Do you approve access to view and update "Verida Wallet"?\n\n' +
        account["did"];

      const signature = await utils.signMessage(
        "algo",
        account.privateKey,
        message
      );
      assert(signature && signature.length, true);

      const verifySignature = await utils.verifySignature(
        "algo",
        message,
        signature,
        account.did
      );
      assert(verifySignature, true);
    });

    it("Can retreive from mnemonic", function () {
      const accountRetreived = utils.getWallet("algo", account.mnemonic);

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
  });
});
