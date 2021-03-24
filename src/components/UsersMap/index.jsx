import Wrapper from '../../common/Wrapper';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import React, { useEffect } from 'react';
import { useGlobalState } from '../../providers/root';
import { Redirect } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';
import { DAY_BOX_SHADOW } from '../../constants';
import AbsoluteButton from '../../common/AbsoluteButton';
import { useHistory } from 'react-router-dom';

import { readOtherUserLocation } from '../../api/firebase';

const UserMap = () => {
    const { coordinates } = useGlobalState();
    useEffect(() => {
        // readOtherUserLocation({ uid: "YOF0cSiRNvg0ZNOGtzSLTW088002" })
    }, [])
    if (!coordinates.hasCoordinates) {
        return (
            <Redirect to="/request" />
        )
    }
    return (
        <Wrapper>
            <MapContainer coordinates={coordinates} />
        </Wrapper>
    )
}

const defaultState = {
    width: window.innerWidth,
    height: window.innerHeight,
    zoom: 14,
}

const MapContainer = (props) => {
    const { latitude, longitude } = props.coordinates;
    const history = useHistory()

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
            <MarkerContainer coordinates={props.coordinates} />
            <AbsoluteButton onClick={() => history.push('/add')}>Add Friend</AbsoluteButton>
            <FriendsContainer />
        </Map>
    )
}

const style = {
    width: 34,
    height: 34,
    backgroundColor: 'white',
    transform: 'rotate(45deg)',
    position: 'fixed',
    zIndex: -1,
    top: '17px',
    left: '7px',
    borderRadius: '50px 50px 0px 50px',
    boxShadow: 'rgb(255 255 255 / 50%) 0px 0px 0px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px',
}

const FriendsContainer = (props) => {
    const { authorizedUsers } = useGlobalState();
    return Object.entries(authorizedUsers).map(([key, value]) => {
        const { coordinates } = value;
        return (
            <Marker key="you-marker" coordinates={[coordinates.longitude, coordinates.latitude]}>
                <Avatar size="md" style={{ border: '2px solid white' }} src={value.avatarUrl} />
                <div style={style} />
            </Marker>
        )
    })

}

const MarkerContainer = (props) => {
    const { firebase } = useGlobalState();

    return (
        <Marker key="you-marker" coordinates={[props.coordinates.longitude, props.coordinates.latitude]}>
            <Avatar size="md" style={{ border: '2px solid white' }} src={firebase.user.photoURL} />
            <div style={style} />
        </Marker>
    )
}

export default UserMap;