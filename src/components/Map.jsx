import React, { useEffect } from 'react';
import Wrapper from '../common/Wrapper';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import { useGlobalState } from '../providers/root';
import './restaurants-map.scss';
import { Spinner } from '@chakra-ui/react';

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

    const [viewport, setViewport] = React.useState();

    console.log({ viewport, coordinates })

    const Map = ReactMapboxGl({
        accessToken:
            process.env.REACT_APP_MAPBOX_TOKEN
    });

    useEffect(() => {
        if (coordinates.hasCoordinates) {
            console.log(typeof latitude)
            setViewport({
                ...defaultState,
                latitude,
                longitude
            })
        }
    }, [coordinates.hasCoordinates, latitude, longitude])

    if (!coordinates.hasCoordinates || !viewport?.latitude || !viewport?.longitude) {
        return <Spinner />
    }
    debugger
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
            <Marker key="you-marker" coordinates={[coordinates.longitude, coordinates.latitude]}>
                <div className="you" />
            </Marker >
        </Map>
    )
}

export default UserMap;