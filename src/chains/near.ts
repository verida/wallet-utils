const nearAPI = require('near-api-js');
const _ = require('lodash');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const crypto = require('crypto');

export default class utils {

    static createWallet(): object {
        throw new Error('Not implemented');
    }

    static getWallet(words: string): object {
        throw new Error('Not implemented');
    }

    static createPrivateKey(): string {
        throw new Error('Not implemented');
    }

    /**
     * Get the public key from a private key
     * 
     * @param privateKey With a leading `0x`
     */
    static getPublicKey(privateKey: string): string {
        throw new Error('Not implemented');
    }

    /**
     * Get the address from a private key
     * 
     * @param privateKey With a leading `0x`
     */
    static getAddress(privateKey: string): string {
        throw new Error('Not implemented');
    }

    /**
     * Sign a message
     * 
     * @param privateKey With a leading `0x`
     * @param message Message to sign
     */
    static async signMessage(privateKey: string, message: string): Promise<string> {
        throw new Error('Not implemented');
    }

    static hexToBuffer(hex: string): Buffer {
        return Buffer.from(hex.substring(2,hex.length), 'hex')
    }

    /**
     * Recover an address from a message and signature
     * 
     * @param message 
     * @param signature 
     */
    static recoverAddress(message: string, signature: string) {
        throw new Error('Not implemented');
    }

    /**
     * Verify a signature matches a given DID
     * 
     * @param message 
     * @param signature  (hex encoded)
     * @param did 
     */
    static async verifySignature(message: string, signature: string, did: string, config: any = {}): Promise<boolean> {
        const accountId = did.replace('did:near:', '')
        config = _.merge({
            networkId: 'default',
            nodeUrl: 'https://rpc.testnet.near.org',
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
        }, config);

        const { Near, Account } = nearAPI;
        const { networkId, nodeUrl, walletUrl } = config;
        const near = new Near({
            networkId, nodeUrl, walletUrl, deps: { keyStore: new nearAPI.keyStores.InMemoryKeyStore() }
        });
        const nearAccount = new Account(near.connection, accountId);
        const messageBuffer = Buffer.from(message);
        const sigBuffer = Buffer.from(signature.replace('0x',''), 'hex')

        // pulled from https://github.com/near/near-contract-helper/blob/cf9bab1f05d3e639bb01c104cb465b35c89992b8/app.js#L133
        try {
            const hash = crypto.createHash('sha256').update(messageBuffer).digest();
            const accessKeys = await nearAccount.getAccessKeys()
            return accessKeys.some((it: any) => {
                const publicKey = it.public_key.replace('ed25519:', '');
                return nacl.sign.detached.verify(hash, sigBuffer, bs58.decode(publicKey));
            });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

}