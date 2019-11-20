import utils from '../utils/functions';
import Transaction from './transaction';
import grandpa44 from '../utils/bip44-params';
import elliptic from 'elliptic';
import ripemd160 from 'ripemd160';
const secp256k1 = new elliptic.ec('secp256k1');

function getAddress(publicKeyCompressed) {
    return new ripemd160().update(publicKeyCompressed).digest('hex');
}

function getCompressedPublicKey(publicPoints) {
    return `${utils.toHexString(publicPoints.x)}${publicPoints.encodeCompressed('hex').substring(0, 2) === '02' ? 0 : 1}`;
}

function CreateAccount(rootKey, index) {

    let _pathFromRootKey = rootKey.derivePath(grandpa44.mainPath + '/' + index);
    let _path = grandpa44.mainPath + '/' + index;
    let _keyPair = secp256k1.keyFromPrivate(_pathFromRootKey.privateKey);
    let _publicKey = getCompressedPublicKey(_keyPair.getPublic());
    let _address = '0x' + getAddress(_publicKey);
    _publicKey = '0x' + _publicKey;
    let _privateKey = '0x' + utils.toHexString(_keyPair.getPrivate().toString('hex'));

    class Account {
        get publicKey() {
            return _publicKey;
        }
        get privateKey() {
            return _privateKey;
        }
        get address() {
            return _address;
        }
        get path() {
            return _address;
        }
        getData() {
            return {
                publicKey: _publicKey,
                privateKey: _privateKey,
                address: _address,
            }
        }
        generateTransaction(to, value, fee, data) {
            return new Transaction(this.address, to, value, fee, data, this.publicKey);
        }
        signTransaction(to, value, fee, data) {
            const transaction = this.generateTransaction(to, value, fee, data);
            transaction.sign(this.privateKey);
            return transaction;
        }
    }
    return new Account();
};


export default CreateAccount;