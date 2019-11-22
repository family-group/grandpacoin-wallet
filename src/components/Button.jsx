import React from 'react';
import './css/Button.css';

const Button = (props) => {
    const { children, onClick, style = {}, className = "", disabled = true } = props;
    return (
        <button
            className={`button ${className}`}
            style={style}
            onClick={onClick}
            disabled={disabled}
        >{children}</button>
    );
}

export default Button;