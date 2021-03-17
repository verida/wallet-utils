const nearAPI = require('near-api-js');
const nearSeedPhrase = require('near-seed-phrase');
const _ = require('lodash');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const crypto = require('crypto');

function implicitAccountId(publicKey: string) {
    return bs58.decode(publicKey.replace('ed25519:', '')).toString('hex');
}

export default class utils {

    static createWallet(): object {
        const { seedPhrase, secretKey, publicKey } = nearSeedPhrase.generateSeedPhrase();
        const accountId = implicitAccountId(publicKey);

        return {
            mnemonic: seedPhrase,
            privateKey: secretKey,
            publicKey: publicKey,
            address: accountId
        }
    }

    static getWallet(seedPhrase: string): object {
        const { secretKey, publicKey } = nearSeedPhrase.parseSeedPhrase(seedPhrase)
        const accountId = implicitAccountId(publicKey)

        return {
            mnemonic: seedPhrase,
            privateKey: secretKey,
            publicKey: publicKey,
            address: accountId
        }
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
        const { KeyPair } = nearAPI;
        const keyPair = KeyPair.fromString(privateKey);
        const messageBuffer = Buffer.from(message);
        const hash = crypto.createHash('sha256').update(messageBuffer).digest();
        const signature = keyPair.sign(hash);
        return '0x' + Buffer.from(signature.signature).toString('hex');
    }

    /**
     * Recover an address from a message and signature
     * 
     * @param message 
     * @param signature 
     */
    static recoverAddress(message: string, signature: string) {
        throw new Error('Not supported due to NEAR\'s multi-key per account architecture');
    }

    /**
     * Verify a signature matches a given DID.
     * 
     * This checks the blockchain to ensure the signature matches a valid public key
     * attached to the on chain DID.
     * 
     * @param message 
     * @param signature  (hex encoded)
     * @param did 
     */
    static async verifySignature(message: string, signature: string, did: string, config: any = {}): Promise<boolean> {
        const accountId = did.replace('did:near:', '')
        const { Account } = nearAPI;
        const near = await utils.getNear(config)
        
        const nearAccount = new Account(near.connection, accountId);
        const messageBuffer = Buffer.from(message);
        const sigBuffer = Buffer.from(signature.replace('0x',''), 'hex')

        // Referenced from https://github.com/near/near-contract-helper/blob/cf9bab1f05d3e639bb01c104cb465b35c89992b8/app.js#L133
        try {
            const hash = crypto.createHash('sha256').update(messageBuffer).digest();
            const accessKeys = await nearAccount.getAccessKeys()
            return accessKeys.some((it: any) => {
                const publicKey = it.public_key.replace('ed25519:', '');
                console.log("checking", publicKey);
                return nacl.sign.detached.verify(hash, sigBuffer, bs58.decode(publicKey));
            });
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    static async getNear(config: any): Promise<any> {
        config = _.merge({
            networkId: 'default',
            nodeUrl: 'https://rpc.testnet.near.org',
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
        }, config);

        const { Near } = nearAPI;
        const { networkId, nodeUrl, walletUrl } = config;
        const near = new Near({
            networkId, nodeUrl, walletUrl, deps: { keyStore: new nearAPI.keyStores.InMemoryKeyStore() }
        });

        return near;
    }

}