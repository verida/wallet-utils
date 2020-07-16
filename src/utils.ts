const ethereumUtils = require('./chains/ethereum').default

type Dictionary = { [index: string]: any }

const chains:Dictionary = {
    'ethr': ethereumUtils
}

export default class utils {

    /**
     * Create a new account
     * @param chain `ethereum` or `vechain`
     */
    static createAccount(chain: string): object {
        const privateKey = utils.createPrivateKey(chain)
        const publicKey = utils.getPublicKey(chain, privateKey)
        const address = utils.getAddress(chain, privateKey)
        const did = 'did:' + chain + ':' + address

        return {
            chain: chain,
            privateKey: privateKey,
            publicKey: publicKey,
            did: did,
            address: address
        }
    }

    static createPrivateKey(chain: string): string {
        return chains[chain].createPrivateKey()
    }

    static getPublicKey(chain: string, privateKey: string): string {
        return chains[chain].getPublicKey(privateKey)
    }

    static getAddress(chain: string, privateKey: string): string {
        return chains[chain].getAddress(privateKey)
    }

    static async signMessage(chain: string, privateKey: string, message: string): Promise<string> {
        return chains[chain].signMessage(privateKey, message)
    }

    static recoverAddress(chain: string, message: string, signature: string): string {
        return chains[chain].recoverAddress(message, signature)
    }

}
