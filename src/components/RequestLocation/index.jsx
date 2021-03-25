import { Box, Button, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useGlobalState } from '../../providers/root';
import { getGPSCoordinates } from '../../utils/gps';
import { Redirect, useParams } from 'react-router-dom';
import Wrapper from '../../common/Wrapper';

const RequestLocation = () => {
    const { coordinates, dispatch, firebase } = useGlobalState();
    const { id } = useParams();

    useEffect(() => {
        if (firebase.isAuthenticated) {
            // const getGPS = () => {
            //     setTimeout(() => {
            //         getGPSCoordinates(dispatch, firebase.user.uid, firebase.user.photoURL)
            //         getGPS();
            //     }, 5000);
            // }
            // getGPS();
            getGPSCoordinates(dispatch, firebase.user.uid, firebase.user.photoURL)

        }
    }, [])

    if (!coordinates.hasCoordinates) {
        return (
            <Wrapper>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Spinner />
                </Box>
            </Wrapper>
        )
    }
    if (id) {
        return (
            <Redirect to={`/map/${id}`} />
        )
    }
    return (
        <Redirect to="/map" />
    )
}

export default RequestLocation;