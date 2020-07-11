var assert = require("assert")
import utils from '../src/utils'
import { ethers } from 'ethers'
import { cry } from 'thor-devkit';

describe("Vechain", function() {

    describe("Create Account", function() {
        const account = utils.createAccount('vechain')
        console.log(account)

        it("Has valid DID", function() {
            assert(account['did'].substring(0,14) == 'did:vechain:0x', true)
            assert(account['did'].length == 54, true)
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
    });

});

describe("Ethereum", function() {

    describe("Create Account", function() {
        const account = utils.createAccount('ethr')
        console.log(account)

        it("Has valid DID", function() {
            assert(account['did'].substring(0,11) == 'did:ethr:0x', true)
            assert(account['did'].length == 51, true)
        })

        it("Has correct chain", function() {
            assert(account['chain'] == 'ethr', true)
        })

        it("Has valid address", function() {
            assert(ethers.utils.isAddress(account.address), true)
            assert(ethers.utils.computeAddress(account.privateKey) == account.address, true)
            assert(ethers.utils.computeAddress(account.publicKey) == account.address, true)
        })

        it("Has valid signing function", async function() {
            const message = "Do you approve access to view and update \"Verida Wallet\"?\n\n" + account['did'];
            
            const signature = await utils.signMessage('ethr', account.privateKey, message)
            assert(signature && signature.length, true)

            const address = await utils.recoverAddress('ethr', message, signature)
            assert(address == account['address'], true)
        })
    });

});