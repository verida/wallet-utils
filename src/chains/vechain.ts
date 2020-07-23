import { cry } from 'thor-devkit'

export default class utils {

    static createWallet(): object {
        const words = cry.mnemonic.generate()
        const privateKeyBytes = cry.mnemonic.derivePrivateKey(words)
        const privateKey = '0x' + Buffer.from(privateKeyBytes).toString('hex')
        const publicKey = utils.getPublicKey(privateKey)
        const address = utils.getAddress(privateKey)

        return {
            mnemonic: words.join(' '),
            privateKey: privateKey,
            publicKey: publicKey,
            address: address
        }
    }

    static getWallet(words: string): object {
        const privateKeyBytes = cry.mnemonic.derivePrivateKey(words.split(' '))
        const privateKey = '0x' + Buffer.from(privateKeyBytes).toString('hex')
        const publicKey = utils.getPublicKey(privateKey)
        const address = utils.getAddress(privateKey)

        return {
            mnemonic: words,
            privateKey: privateKey,
            publicKey: publicKey,
            address: address
        }
    }

    static createPrivateKey(): string {
        const keyBytes = cry.secp256k1.generatePrivateKey()
        return '0x' + Buffer.from(keyBytes).toString('hex')
    }

    /**
     * Get the public key from a private key
     * 
     * @param privateKey With a leading `0x`
     */
    static getPublicKey(privateKey: string): string {
        const publicKey = cry.secp256k1.derivePublicKey(utils.hexToBuffer(privateKey))
        return '0x' + Buffer.from(publicKey).toString('hex')
    }

    /**
     * Get the address from a private key
     * 
     * @param privateKey With a leading `0x`
     */
    static getAddress(privateKey: string): string {
        const publicKeyBuffer = utils.getPublicKey(privateKey)
        const buffer = cry.publicKeyToAddress(utils.hexToBuffer(publicKeyBuffer))
        return '0x' + buffer.toString('hex')
    }

    /**
     * Sign a message
     * 
     * @param privateKey With a leading `0x`
     * @param message Message to sign
     */
    static async signMessage(privateKey: string, message: string): Promise<string> {
        const hash = cry.keccak256(message)
        const sig = cry.secp256k1.sign(hash, utils.hexToBuffer(privateKey))
        return '0x' + sig.toString('hex')
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
        const signatureBuffer = Buffer.from(signature.substring(2, signature.length), 'hex')
        const hash = cry.keccak256(message)
        const publicKey = cry.secp256k1.recover(hash, signatureBuffer)

        if (publicKey) {
            const signingAddress = cry.publicKeyToAddress(publicKey)
            return '0x' + signingAddress.toString('hex')
        }
    }

}