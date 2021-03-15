import { Box } from '@chakra-ui/react';
import React from 'react';

const Wrapper = (props) => {
    const inline = {
        height: window.innerHeight,
        width: window.innerWidth,
    }
    return (
        <Box style={inline} display="flex" justifyContent="center" alignItems="center">
            {props.children}
        </Box>
    )
}

export default Wrapper;