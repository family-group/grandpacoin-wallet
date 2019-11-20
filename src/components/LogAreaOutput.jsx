import React from 'react';
import './css/LogAreaOutput.css';

const LogAreaOutput = (props) => {
    const { value = '', style = {} } = props;

    return (
        <div className="log-area-output" style={style}>
            {value}
        </div>
    )
}

export default LogAreaOutput;