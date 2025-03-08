"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const ethers_1 = require("ethers");
const ChainXSHelper_1 = require("./ChainXSHelper");
class Wallet {
    constructor(seed) {
        this.getExtendedPublicKey = (account) => {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'`);
            return node.neuter().extendedKey;
        };
        this.getAddress = (type) => {
            return ChainXSHelper_1.ChainXSHelper.encodeBWSAddress(type, this.account.address);
        };
        this.getStealthAddress = (account, index) => {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
            return ChainXSHelper_1.ChainXSHelper.encodeBWSAddress(ChainXSHelper_1.ChainXSAddressType.STEALTH_ADDRESS_ACCOUNT, node.address);
        };
        this.signHash = (hash) => __awaiter(this, void 0, void 0, function* () {
            hash = ChainXSHelper_1.ChainXSHelper.Base64StringToHexString(hash);
            let sign = yield this.account.signMessage(hash);
            sign = ChainXSHelper_1.ChainXSHelper.HexStringToBase64String(sign);
            return sign;
        });
        this.signStealthAddressHash = (hash, account, index) => __awaiter(this, void 0, void 0, function* () {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
            hash = ChainXSHelper_1.ChainXSHelper.Base64StringToHexString(hash);
            let sign = (yield node.signMessage(hash));
            sign = ChainXSHelper_1.ChainXSHelper.HexStringToBase64String(sign);
            return sign;
        });
        this.signStealthAddressFunction = (account, index) => {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
            return (hash) => __awaiter(this, void 0, void 0, function* () {
                return yield node.signMessage(hash);
            });
        };
        if (seed) {
            this.seed = seed;
        }
        else {
            let mnemonic = ethers_1.ethers.Wallet.createRandom().mnemonic;
            if (!mnemonic)
                throw new Error('cant generate mnemonic phrase');
            this.seed = mnemonic.phrase;
        }
        this.account = ethers_1.ethers.Wallet.fromPhrase(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress(ChainXSHelper_1.ChainXSAddressType.EXTERNALLY_OWNED_ACCOUNT);
    }
}
exports.Wallet = Wallet;
