import React from 'react';
import './css/TextInput.css';

const TextInput = (props) => {
    const { name, value, onChange, placeholder = '', style = {}, className = "" } = props;

    return (
        <input
            className={`text-input ${className}`}
            style={style}
            type="text"
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}

export default TextInput;