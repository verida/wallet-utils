/// <reference types="node" />
export default class utils {
    static createPrivateKey(): string;
    /**
     * Get the public key from a private key
     *
     * @param privateKey With a leading `0x`
     */
    static getPublicKey(privateKey: string): string;
    /**
     * Get the address from a private key
     *
     * @param privateKey With a leading `0x`
     */
    static getAddress(privateKey: string): string;
    /**
     * Sign a message
     *
     * @param privateKey With a leading `0x`
     * @param message Message to sign
     */
    static signMessage(privateKey: string, message: string): Promise<string>;
    static hexToBuffer(hex: string): Buffer;
}
