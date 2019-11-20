import { validateMnemonic } from 'bip39';
import {
    loadAccounts, generateMnemonic,
    decryptMnemonic, encryptMnemonic
} from '../utils/functions';
import { ethers } from 'ethers';



function _fromEncryptedJSON(JSON, password) {
    return decryptMnemonic(JSON, password).then(wallet => new Wallet(wallet.mnemonic));
}

function _createRandom() {
    return new Wallet(generateMnemonic());
}

function Wallet(mnemonic) {
    if (!mnemonic) {
        throw 'mnemonic required.';
    }
    if (mnemonic && !validateMnemonic(mnemonic)) {
        throw 'Invalid mnemonic.';
    }
    let _mnemonic = mnemonic;

    class SingleWallet {
        constructor() {
            this.accounts = loadAccounts(_mnemonic, 5);
            console.log(new ethers.Wallet.fromMnemonic(_mnemonic, "m/44'/1313'/0'/0/0"));
            console.log(this.accounts[0].getData());
        }

        get mnemonic() {
            return _mnemonic;
        }

        getAccounts() {
            return this.accounts.map(account => account.getData());
        }

        encrypt(password) {
            return encryptMnemonic(this.mnemonic, password)
        }
    }

    return new SingleWallet();
}


Wallet.fromEncryptedJSON = _fromEncryptedJSON;

Wallet.createRandom = _createRandom;

export default Wallet;