import Wrapper from '../../common/Wrapper';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import React, { useEffect } from 'react';
import { useGlobalState } from '../../providers/root';
import { Redirect } from 'react-router-dom';
import { Avatar, Spinner } from '@chakra-ui/react';
import AbsoluteButton from '../../common/AbsoluteButton';
import { useHistory, useParams } from 'react-router-dom';

import './users-map.scss';
import { isEmpty } from 'lodash';


const Map = ReactMapboxGl({
    accessToken:
        process.env.REACT_APP_MAPBOX_TOKEN
});

const UserMap = () => {
    const { coordinates, firebase } = useGlobalState();
    const { id } = useParams();

    if (!firebase.isAuthenticated) {
        return (
            <Redirect to="/" />
        )
    }
    if (!coordinates.hasCoordinates) {
        if(id){
            return (
                <Redirect to={`/request/${id}`} />
            )
        }
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
    let viewportObj;
    const { coordinates, authorizedUsers } = useGlobalState();
    const { latitude, longitude } = coordinates;
    const { id } = useParams();

    if (id && !isEmpty(authorizedUsers)) {
        viewportObj = {
            width: window.innerWidth,
            height: window.innerHeight,
            latitude: authorizedUsers[id].coordinates.latitude,
            longitude: authorizedUsers[id].coordinates.longitude,
            zoom: 16,
        }
    }
    else {
        viewportObj = {
            width: window.innerWidth,
            height: window.innerHeight,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            zoom: 14,
        }
    }
    useEffect(() => {
        setViewport({ ...viewportObj })
    }, [])
    useEffect(() => {
        setViewport({ ...viewportObj })
    }, [authorizedUsers, id])
    const [viewport, setViewport] = React.useState();
    const history = useHistory();

    if(!viewport){
        return <Spinner />
    }
    return (
        <>
            <Map
                style="mapbox://styles/mapbox/basic-v9"
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                center={[viewport.longitude, viewport.latitude]}
                zoom={[viewport.zoom]}
                // onMoveEnd={(stop) => {
                //     setViewport({ ...viewportObj, latitude: stop.transform.center.lat, longitude: stop.transform.center.lng })
                // }}
            >
                <MarkerContainer coordinates={props.coordinates} />
                <FriendsContainer setViewport={setViewport} viewport={viewport} />
            </Map>
            <AbsoluteButton onClick={() => history.push('/add')}>Add Friend</AbsoluteButton>
        </>
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
    const history = useHistory()

    return Object.entries(authorizedUsers).map(([key, value]) => {
        const { coordinates } = value;
        return (
            // <Layer>
            //     <Feature
            //         className="cursor-hover"
            //         history={history}
            //         onClick={() => {
            //             history.push(`/map/${key}`)
            //             props.setViewport({ zoom: 16, latitude: coordinates.latitude, longitude: coordinates.longitude })
            //         }}
            //         key={`friend-marker-${key}`}
            //         coordinates={[coordinates.longitude, coordinates.latitude]}
            //     >
            //         <Image src={value.avatarUrl} />
            //         <Avatar size="md" style={{ border: '2px solid white' }} src={value.avatarUrl} />
            //         <div style={style} />
            //     </Feature>
            // </Layer>
            <Marker onClick={() => {
                history.push(`/map/${key}`)
                props.setViewport({ zoom: 16, latitude: coordinates.latitude, longitude: coordinates.longitude })
            }}
                key={`friend-marker-${key}`}
                coordinates={[coordinates.longitude, coordinates.latitude]}>
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
            <div className="you" />
        </Marker>
    )
}

export default UserMap;