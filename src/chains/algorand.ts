const algosdk = require('algosdk');

function privateKeyToArray(privateKey: string) {
    return Buffer.from(privateKey.substring(2,privateKey.length), 'hex').toJSON().data
}

export default class utils {

    static createWallet(): object {
        const wallet = algosdk.generateAccount();
        const mnemonic = algosdk.secretKeyToMnemonic(wallet.sk);
        const privateKey = '0x' + Buffer.from(wallet.sk).toString('hex')
        const publicKey = '0x' + Buffer.from(wallet.addr).toString('hex')

        return {
            mnemonic,
            privateKey,
            publicKey,
            address: wallet.addr
        }
    }

    static getWallet(mnemonic: string): object {
        const wallet = algosdk.mnemonicToSecretKey(mnemonic)
        const privateKey = '0x' + Buffer.from(wallet.sk).toString('hex')
        const publicKey = '0x' + Buffer.from(wallet.addr).toString('hex')

        return {
            mnemonic: mnemonic,
            privateKey,
            publicKey,
            address: wallet.addr
        }
    }

    static getPublicKey() {
        throw new Error('Not implemented');
    }

    static getAddress(privateKey: string): string {
        const sk = algosdk.secretKeyToMnemonic(privateKeyToArray(privateKey))
        const wallet = algosdk.mnemonicToSecretKey(sk)
        return wallet.addr
    }

    static signTransaction(privateKey: string, transaction: any): object {
        const {sender, receiver, amount, note, params} = transaction
        const txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, note, params);
        const sk = algosdk.secretKeyToMnemonic(privateKeyToArray(privateKey))
        const wallet = algosdk.mnemonicToSecretKey(sk)
        const signedTxn = txn.signTxn(wallet.sk);
        return {txn, signedTxn}
    }

    static async signMessage() {
        throw new Error('Not implemented');
    }

    static recoverAddress() {
        throw new Error('Not implemented');
    }

    static async verifySignature() {
        throw new Error('Not implemented');
    }

}