  
import { Button } from '@chakra-ui/react';
import React from 'react';
import { PRIMARY_COLOR_SCHEME, DAY_BOX_SHADOW } from '../constants';
import { useGlobalState } from '../providers/root';

const AbsoluteButton = (props) => {
    const { meta } = useGlobalState();
    const fixedButton = {
        position: "fixed",
        bottom: props.bottom ? props.bottom : meta.isInstalled ? 100 : 20,
        right: props.right || 20,
        left: props.left,
    }
    if(props.isHidden){
        return null;
    }
    return (
        <Button 
            zIndex={1000}
            margin={props.margin}
            colorScheme={PRIMARY_COLOR_SCHEME} 
            isLoading={props.loading} 
            disabled={props.disabled} 
            boxShadow={'0 0px 0px -1px #ffffff80, 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)'}
            style={fixedButton} 
            onClick={props.onClick}>
                {props.children}
        </Button>
    )
}

export default AbsoluteButton;