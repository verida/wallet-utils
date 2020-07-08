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

        /*it("Has valid signing function", async function() {
            const message = 'hello world'

            //const privateKeyBuffer = Buffer.from(privateKey.substring(2, privateKey.length), 'hex')
            //const signature = cry.secp256k1.sign(cry.keccak256(message), privateKeyBuffer)
            
            const signature = await utils.signMessage('vechain', account.privateKey, message)
            assert(signature && signature.length, true)

            const signatureBuffer = Buffer.from(signature, 'hex')
            const hash = cry.keccak256(message, signatureBuffer)

            const signingAddress = cry.secp256k1.recover(hash, signatureBuffer)
            console.log("sa", signingAddress, signingAddress.toString('hex'))
            //assert(signingAddress == account.address, true)
        })*/
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
            const message = 'hello world'
            
            const signature = await utils.signMessage('ethr', account.privateKey, message)
            assert(signature && signature.length, true)

            const signingAddress = ethers.utils.verifyMessage(message, signature)
            assert(signingAddress == account.address, true)
        })
    });

});