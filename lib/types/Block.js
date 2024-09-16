"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const ChainXSHelper_1 = require("../utils/ChainXSHelper");
class Block {
    constructor(block) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.height = (_a = block === null || block === void 0 ? void 0 : block.height) !== null && _a !== void 0 ? _a : 0;
        this.slices = (_b = block === null || block === void 0 ? void 0 : block.slices) !== null && _b !== void 0 ? _b : [];
        this.transactionsCount = (_c = block === null || block === void 0 ? void 0 : block.transactionsCount) !== null && _c !== void 0 ? _c : 0;
        this.version = (_d = block === null || block === void 0 ? void 0 : block.version) !== null && _d !== void 0 ? _d : '';
        this.chain = (_e = block === null || block === void 0 ? void 0 : block.chain) !== null && _e !== void 0 ? _e : '';
        this.from = (_f = block === null || block === void 0 ? void 0 : block.from) !== null && _f !== void 0 ? _f : '';
        this.created = (_g = block === null || block === void 0 ? void 0 : block.created) !== null && _g !== void 0 ? _g : 0;
        this.lastHash = (_h = block === null || block === void 0 ? void 0 : block.lastHash) !== null && _h !== void 0 ? _h : '';
        this.hash = (_j = block === null || block === void 0 ? void 0 : block.hash) !== null && _j !== void 0 ? _j : '';
        this.sign = (_k = block === null || block === void 0 ? void 0 : block.sign) !== null && _k !== void 0 ? _k : '';
        this.externalTxID = (_l = block === null || block === void 0 ? void 0 : block.externalTxID) !== null && _l !== void 0 ? _l : [];
    }
    getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
            });
            merkleRoot = ChainXSHelper_1.ChainXSHelper.makeHash(merkleRoot);
        }
        else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000';
        }
        return merkleRoot;
    }
    toHash() {
        let bytes = '';
        bytes += ChainXSHelper_1.ChainXSHelper.numberToHex(this.height);
        bytes += ChainXSHelper_1.ChainXSHelper.numberToHex(this.transactionsCount);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.version == '2') {
            bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        }
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += ChainXSHelper_1.ChainXSHelper.numberToHex(this.created);
        bytes += this.getMerkleRoot();
        bytes += this.lastHash;
        bytes = ChainXSHelper_1.ChainXSHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (!ChainXSHelper_1.ChainXSHelper.isValidInteger(this.height))
            throw new Error('invalid block height');
        if (!ChainXSHelper_1.ChainXSHelper.isValidInteger(this.transactionsCount))
            throw new Error('invalid block transactionsCount');
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.slices))
            throw new Error('invalid array');
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!ChainXSHelper_1.ChainXSHelper.isValidHash(sliceHash))
                throw new Error(`invalid block hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '2')
            throw new Error('invalid block version ' + this.version);
        if (this.chain.length === 0)
            throw new Error('invalid block chain cant be empty');
        if (!ChainXSHelper_1.ChainXSHelper.isValidAlfaNum(this.chain))
            throw new Error('invalid chain');
        if (!ChainXSHelper_1.ChainXSHelper.isValidAddress(this.from))
            throw new Error('invalid block from address ' + this.from);
        if (!ChainXSHelper_1.ChainXSHelper.isValidDate(this.created))
            throw new Error('invalid created date');
        if (!ChainXSHelper_1.ChainXSHelper.isValidHash(this.lastHash))
            throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash())
            throw new Error(`corrupt transaction`);
        if (!ChainXSHelper_1.ChainXSHelper.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid block signature');
        if (!ChainXSHelper_1.ChainXSHelper.isStringArray(this.externalTxID))
            throw new Error('invalid array');
        for (let i = 0; i < this.externalTxID.length; i++) {
            let txId = this.externalTxID[i];
            if (!ChainXSHelper_1.ChainXSHelper.isValidHash(txId))
                throw new Error(`invalid externalTxID txId ${i} - ${txId}`);
        }
    }
}
exports.Block = Block;
