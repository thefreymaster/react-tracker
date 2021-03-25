import React from 'react';

const Zindex = (props) => (
    <div style={{zIndex: props.zIndex}}>{props.children}</div>
)

export default Zindex;