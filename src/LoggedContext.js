import React from 'react';

export const checkLogged = {
    logged: false,
    mnemonic: '',
    publicKey: '',
    privateKey: '',
    address: ''
}

export const LoggedContext = React.createContext(checkLogged);
