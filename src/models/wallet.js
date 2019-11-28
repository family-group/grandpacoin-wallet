import { validateMnemonic } from 'bip39';
import {
    generateMnemonic, decryptMnemonic, 
    encryptMnemonic, loadAccount
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
            this.account = loadAccount(mnemonic);
        }

        get mnemonic() {
            return _mnemonic;
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