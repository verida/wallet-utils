export default class utils {
    static createPrivateKey(): string;
    static getPublicKey(privateKey: string): string;
    static getAddress(privateKey: string): string;
    static signMessage(privateKey: string, message: string): Promise<string>;
}
