const algosdk = require('algosdk');

function stringToArray(string: string) {
    return Buffer.from(string.substring(2,string.length), 'hex').toJSON().data
}

export default class utils {

    static createWallet(): object {
        const wallet = algosdk.generateAccount();
        const mnemonic = algosdk.secretKeyToMnemonic(wallet.sk);
        const privateKey = '0x' + Buffer.from(wallet.sk).toString('hex')

        return {
            mnemonic,
            privateKey,
            publicKey: wallet.addr,
            address: wallet.addr
        }
    }

    static getWallet(mnemonic: string): object {
        const wallet = algosdk.mnemonicToSecretKey(mnemonic)
        const privateKey = '0x' + Buffer.from(wallet.sk).toString('hex')

        return {
            mnemonic: mnemonic,
            privateKey,
            publicKey: wallet.addr,
            address: wallet.addr
        }
    }

    static getPublicKey(privateKey: string): string {
        const sk = algosdk.secretKeyToMnemonic(stringToArray(privateKey))
        const wallet = algosdk.mnemonicToSecretKey(sk)
        return wallet.addr
    }

    static getAddress(privateKey: string): string {
        const sk = algosdk.secretKeyToMnemonic(stringToArray(privateKey))
        const wallet = algosdk.mnemonicToSecretKey(sk)
        return wallet.addr
    }

    static async signMessage(privateKey: string, message: string): Promise<string> {
        const encodedMessage = new TextEncoder().encode(message)
        const sk = algosdk.secretKeyToMnemonic(stringToArray(privateKey))
        const wallet = algosdk.mnemonicToSecretKey(sk)
        const signature = algosdk.signBytes(encodedMessage, wallet.sk)
        const stringFromSignature = '0x' + Buffer.from(signature).toString('hex')
        return stringFromSignature
    }

    static recoverAddress() {
        throw new Error('Not implemented');
    }

    static async verifySignature(message: string, signature: string, did: string): Promise<boolean> {
        const bufferFromSignatureString =  Buffer.from(signature.substring(2,signature.length), 'hex')
        const encodedMessage = new TextEncoder().encode(message)
        const address = did.replace('did:algo:', '')
        return algosdk.verifyBytes(encodedMessage, bufferFromSignatureString, address)
    }
}