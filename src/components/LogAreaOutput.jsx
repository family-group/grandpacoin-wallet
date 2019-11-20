import React from 'react';
import './css/LogAreaOutput.css';

const LogAreaOutput = (props) => {
    const { value = '', style = {}, className = "" } = props;

    return (
        <div className={`log-area-output ${className}`} style={style}>
            {value}
        </div>
    )
}

export default LogAreaOutput;