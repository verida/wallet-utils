export default class utils {
    /**
     * Create a new account
     * @param chain `ethereum` or `vechain`
     */
    static createAccount(chain: string): object;
    static createPrivateKey(chain: string): string;
    static getPublicKey(chain: string, privateKey: string): string;
    static getAddress(chain: string, privateKey: string): string;
    static signMessage(chain: string, privateKey: string, message: string): Promise<string>;
    static recoverAddress(chain: string, message: string, signature: string): string;
}
