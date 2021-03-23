import React, { useEffect } from 'react';
import Wrapper from '../common/Wrapper';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { Redirect } from 'react-router-dom';
import { useGlobalState } from '../providers/root';
import './restaurants-map.scss';
import { Avatar, Box, Spinner } from '@chakra-ui/react';
import { DAY_BOX_SHADOW } from '../constants';
import { getGPSCoordinates } from '../utils/gps';

const UserMap = () => {
    return (
        <Wrapper>
            <MapContainer />
        </Wrapper>
    )
}

const defaultState = {
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 14,
}

const MapContainer = () => {
    const { coordinates } = useGlobalState();
    const { latitude, longitude } = coordinates;

    const [viewport, setViewport] = React.useState({
        ...defaultState,
        latitude, 
        longitude
    });

    const Map = ReactMapboxGl({
        accessToken:
            process.env.REACT_APP_MAPBOX_TOKEN
    });

    return (
        <Map
            style="mapbox://styles/mapbox/basic-v9"
            containerStyle={{
                height: '100vh',
                width: '100vw'
            }}
            center={[viewport.longitude, viewport.latitude]}
            zoom={[viewport.zoom]}
        >
            <MarkerContainer />
        </Map>
    )
}

const MarkerContainer = () => {
    const { coordinates, firebase, dispatch } = useGlobalState();
    useEffect(() => {
        if (navigator.geolocation && firebase.isAuthenticated) {
            const getGPS = () => {
                setTimeout(() => {
                    getGPSCoordinates(dispatch, firebase.user.uid, coordinates.hasCoordinates);
                    getGPS();
                }, 1000);
            }
            getGPS();
        }
    }, [firebase.isAuthenticated])
    return (
        <Marker key="you-marker" coordinates={[coordinates.longitude, coordinates.latitude]}>
            <Avatar style={{ border: '2px solid white', boxShadow: DAY_BOX_SHADOW }} src={firebase.user.photoURL} />
        </Marker >
    )
}

export default UserMap;