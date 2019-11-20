import React from 'react';
import './css/TextInput.css';

const TextInput = (props) => {
    const { value, onChange, placeholder = '' } = props;

    return (
        <input className="text-input" type="text" value={value} placeholder={placeholder} onChange={onChange} />
    )
}

export default TextInput;