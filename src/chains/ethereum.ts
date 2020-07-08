import { ethers } from 'ethers'

export default class utils {

    static createPrivateKey(): string {
        const wallet = ethers.Wallet.createRandom()
        return wallet.privateKey
    }

    static getPublicKey(privateKey: string): string {
        const wallet = new ethers.Wallet(privateKey)
        return wallet.publicKey
    }

    static getAddress(privateKey: string): string {
        return ethers.utils.computeAddress(privateKey)
    }

    static async signMessage(privateKey: string, message: string): Promise<string> {
        const wallet = new ethers.Wallet(privateKey)
        return await wallet.signMessage(message)
    }

}