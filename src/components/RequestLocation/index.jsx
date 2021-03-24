import { Box, Button, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useGlobalState } from '../../providers/root';
import { getGPSCoordinates } from '../../utils/gps';
import { Redirect } from 'react-router-dom';

const RequestLocation = () => {
    const { coordinates, dispatch, firebase } = useGlobalState();
    useEffect(() => {
        getGPSCoordinates(dispatch, firebase.user.uid)
    }, [])
    if(!coordinates.hasCoordinates){
        return (
            <Box>
                <Spinner />
            </Box>
        )
    }
    return (
        <Redirect to="/map" />
    )
}

export default RequestLocation;