import { Box } from '@chakra-ui/react';
import React from 'react';
import { useGlobalState } from '../../providers/root';
import { Redirect } from 'react-router-dom';


const UserMap = () => {
    const { coordinates } = useGlobalState();
    if(!coordinates.hasCoordinates){
        return (
            <Redirect to="/request" />
        )
    }
    return (
        <Box>
            latitude: {coordinates.latitude}
            longitude: {coordinates.longitude}
        </Box>
    )
}

export default UserMap;