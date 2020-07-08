import { cry } from 'thor-devkit'

export default class utils {

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
        const sig = cry.secp256k1.sign(cry.keccak256(message), utils.hexToBuffer(privateKey))
        return sig.toString('hex')
    }

    static hexToBuffer(hex: string): Buffer {
        return Buffer.from(hex.substring(2,hex.length), 'hex')
    }

}