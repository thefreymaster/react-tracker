import React, { useEffect } from 'react';
import UserMap from '../components/Map';
import { useGlobalState } from '../providers/root';
import { Switch, Route, Redirect } from 'react-router-dom';
import Welcome from '../components/Welcome';
import { Spinner } from '@chakra-ui/react';
import { getGPSCoordinates } from '../utils/gps';

const Router = () => {
    const { firebase, coordinates, dispatch } = useGlobalState();

    useEffect(() => {
        getGPSCoordinates(dispatch, firebase.user.uid, coordinates.hasCoordinates)
    }, [firebase.isAuthenticated])

    if (firebase.isValidatingAuthentication || !coordinates.hasCoordinates) {
        return <Spinner />
    }
    return (
        <Switch>
            <Route exact path="/map">
                <UserMap />
            </Route>
            <Route exact path="/">
                <Welcome />
            </Route>
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    )
}

export default Router;