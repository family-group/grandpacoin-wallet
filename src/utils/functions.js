import elliptic from 'elliptic';
import cryptoJS from 'crypto-js';
import ethers from 'ethers';
import { fromSeed } from 'bip32';
import { mnemonicToSeedSync } from 'bip39';
import Account from '../models/account';
const secp256k1 = new elliptic.ec('secp256k1');

export function toHexString (value) {
    let hexString = value.toString(16);
    let padding = 64 - hexString.length;
    if(!padding) {
        return hexString;
    }
    padding = new Array(padding).fill('0');
    return `${padding.join('')}${hexString}`;
}

export function bytesToHexString(uintArray) {
    return uintArray.reduce((str, byte) => str + byte.toString(16).padStart(2,0), '');
}

function _hexStringToUint8Array(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

export const hexStringToUint8Array = _hexStringToUint8Array;

export function signTransaction(transaction, privKey) {
    transaction.transactionDataHash = cryptoJS.SHA256(JSON.stringify(transaction)).toString();
    const keyPair = secp256k1.keyFromPrivate(privKey.replace('0x',''));
    const signature = keyPair.sign(transaction.transactionDataHash);
    return [signature.r.toString(16), signature.s.toString(16)];
}

function descompressPublicKey(pubKeyCompressed){
    return `${pubKeyCompressed.substr(64,65) === '0' ? '02' : '03'}${pubKeyCompressed.substr(2,64)}`
}

export function verifySignature(data, publicKey, signature) {
    const keyPair = secp256k1.keyFromPublic(descompressPublicKey(publicKey), 'hex');
    return keyPair.verify(data, {r: signature[0], s: signature[1]})
}

export function generateMnemonic() {
    return ethers.utils.HDNode.entropyToMnemonic(generateEntropy(16)); // cryptographyc secure seed
}

export function generateEntropy(length = 16) {
    return ethers.utils.randomBytes(length); // cryptographyc secure seed
}

export function encryptMnemonic(mnemonic, password = '') {
    return ethers.Wallet.fromMnemonic(mnemonic).encrypt(password);
}

export function decryptMnemonic(encryptJSON, password = '') {
    return ethers.Wallet.fromEncryptedJson(encryptJSON, password);
}

export function loadAccounts(mnemonic, count = 1) {
    const seed = mnemonicToSeedSync(mnemonic);
    const accounts = [];
    const rootKey = fromSeed(seed);
    for(let i = 0; i < count; i++) {
        accounts.push(Account(rootKey, i));
    }
    return accounts;
}

export default {
    toHexString,
    bytesToHexString,
    signTransaction,
    verifySignature,
    generateMnemonic,
    generateEntropy,
    encryptMnemonic,
    decryptMnemonic,
    loadAccounts,
    hexStringToUint8Array
}