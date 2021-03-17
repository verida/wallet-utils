var assert = require("assert")
import utils from '../src/utils'
const nearAPI = require('near-api-js');

describe("Near", function() {

    describe("Create Account", function() {
        const account = utils.createWallet('near')

        it("Has valid DID", function() {
            assert(account['did'].substring(0,9) == 'did:near:', true)
        })

        it("Has valid mnemonic", function() {
            assert(account['mnemonic'].length > 0, true)
            assert(account['mnemonic'].split(' ').length >= 12, true)
        })

        it("Has correct chain", function() {
            assert(account['chain'] == 'near', true)
        })

        //  Also tests `getWallet()`
        it("Has valid signing function", async function() {
            // todo: Replace this with config variables locally and only run if specified
            // to avoid sharing seed phrase
            const testAccountId = "verida-wallet-utiles-unittest.testnet";
            const testPhrase = "ring flame nasty cigar fringe journey puzzle unhappy bright cover rebel normal";
            const testAccount = utils.getWallet('near', testPhrase);
            const did = `did:near:${testAccountId}`;

            const message = "Do you approve access to view and update \"Verida Wallet\"?\n\n" + did;

            const signature = await utils.signMessage('near', testAccount.privateKey, message)
            assert(signature && signature.length, true)

            const validSignature = await utils.verifySignature('near', message, signature, did)
            assert(validSignature, true)
        })

        it("Can retreive from mnemonic", function() {
            const accountRetreived = utils.getWallet('near', account.mnemonic)

            assert(account.mnemonic == accountRetreived.mnemonic, true)
            assert(account.privateKey == accountRetreived.privateKey, true)
            assert(account.publicKey == accountRetreived.publicKey, true)
            assert(account.address == accountRetreived.address, true)
        })
    });

});