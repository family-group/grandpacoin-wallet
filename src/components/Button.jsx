import React from 'react';
import './css/Button.css';

const Button = (props) => {
    const { children, onClick, style = {}, className = "", active = true } = props;
    return (
        <button
            className={`button ${className}`}
            style={style}
            onClick={onClick}
            disabled={active}
        >{children}</button>
    );
}

export default Button;