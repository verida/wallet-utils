export default class utils {
    static createPrivateKey(): string;
    static getPublicKey(privateKey: string): string;
    static getAddress(privateKey: string): string;
    static signMessage(privateKey: string, message: string): Promise<string>;
    /**
     * Recover an address from a message and signature
     *
     * @param message
     * @param signature
     */
    static recoverAddress(message: string, signature: string): string | undefined;
}
