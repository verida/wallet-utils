var assert = require("assert")
import utils from '../src/utils'
import { cry } from 'thor-devkit';

describe("Vechain", function() {

    describe("Create Account", function() {
        const account = utils.createWallet('vechain')

        it("Has valid DID", function() {
            assert(account['did'].substring(0,14) == 'did:vechain:0x', true)
            assert(account['did'].length == 54, true)
        })

        it("Has valid mnemonic", function() {
            assert(account['mnemonic'].length > 0, true)
            assert(account['mnemonic'].split(' ').length >= 12, true)
        })

        it("Has correct chain", function() {
            assert(account['chain'] == 'vechain', true)
        })

        it("Has valid address", function() {
            assert(cry.isAddress(account.address), true)
            const addressBuffer = cry.publicKeyToAddress(Buffer.from(account.publicKey.substring(2, account.publicKey.length), 'hex'))
            assert('0x' + addressBuffer.toString('hex') == account.address, true)
        })

        it("Has valid signing function", async function() {
            const message = "Do you approve access to view and update \"Verida Wallet\"?\n\n" + account['did'];
            
            const signature = await utils.signMessage('vechain', account.privateKey, message)
            assert(signature && signature.length, true)

            const address = await utils.recoverAddress('vechain', message, signature)
            assert(address == account['address'], true)
        })

        it("Can retreive from mnemonic", function() {
            const accountRetreived = utils.getWallet('vechain', account['mnemonic'])
            assert(account.mnemonic == accountRetreived.mnemonic, true)
            assert(account.privateKey == accountRetreived.privateKey, true)
            assert(account.publicKey == accountRetreived.publicKey, true)
            assert(account.address == accountRetreived.address, true)
        })
    });

});