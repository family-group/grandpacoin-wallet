import { validateMnemonic } from 'bip39';
import {
    loadAccounts, generateMnemonic,
    decryptMnemonic, encryptMnemonic, loadAccount
} from '../utils/functions';



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
            this.accounts = loadAccounts(_mnemonic, 1);
            this.account = loadAccount(mnemonic);
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