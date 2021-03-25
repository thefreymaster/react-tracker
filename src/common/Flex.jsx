import React from 'react';
import classnames from 'classnames';
import './common.scss';

const Flex = (props) => {
    const inline = {
        display: props.display,
        flexDirection: props.direction,
        justifyContent: props.justifyContent || props.jc,
        alignItems: props.alignItems || props.ai,
        height: props.height,
        width: props.width,
        backgroundColor: props.backgroundColor,
        margin: props.margin,
        borderRadius: props.borderRadius,
        flexWrap: props.flexWrap,
        boxShadow: props.boxShadow && `0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)`,
        padding: props.padding,
        flexGrow: props.flexGrow || 1,
        maxWidth: props.maxWidth,
        ...props.style,
    }
    return (
        <React.Fragment>
            <div key={props.key} ref={props.ref} style={inline} onClick={props.onClick} className={classnames(props.className, {'hover-cursor': props.hoverCursor, 'transition-background': props.transitionBackground})}>
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default Flex;