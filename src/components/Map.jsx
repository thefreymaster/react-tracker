import React from 'react';
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

const MapContainer = () => {
    const { coordinates } = useGlobalState();

    const viewportObj = {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: coordinates.lat,
        longitude: coordinates.long,
        zoom: 14,
    }

    const [viewport, setViewport] = React.useState({
        ...viewportObj, 
        latitude: coordinates.lat,
        longitude: coordinates.long,
    });

    console.log({ viewportObj, viewport })

    const Map = ReactMapboxGl({
        accessToken:
            process.env.REACT_APP_MAPBOX_TOKEN
    });

    if (!coordinates.hasCoordinates) {
        return <Spinner />
    }
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
            <Marker key="you-marker" coordinates={[coordinates.long, coordinates.lat]}>
                <div className="you">You</div>
            </Marker >
        </Map>
    )
}

export default UserMap;