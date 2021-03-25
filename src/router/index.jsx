import React, { useEffect } from 'react';
import { useGlobalState } from '../providers/root';
import { Switch, Route, Redirect } from 'react-router-dom';
import Welcome from '../components/Welcome';
import { Spinner } from '@chakra-ui/react';
import RequestLocation from '../components/RequestLocation';
import UserMap from '../components/UsersMap';
import AddFriend from '../components/AddFriend';
import Wrapper from '../common/Wrapper';

const Router = () => {
    const { firebase } = useGlobalState();

    if (firebase.isValidatingAuthentication) {
        return (
            <Wrapper>
                <Spinner />
            </Wrapper>
        )
    }
    return (
        <Switch>
            <Route exact path="/">
                <Welcome />
            </Route>
            <Route exact path="/request">
                <RequestLocation />
            </Route>
            <Route exact path="/map">
                <UserMap />
            </Route>
            <Route exact path="/map/:id">
                <UserMap />
            </Route>
            <Route exact path="/add">
                <AddFriend />
            </Route>
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    )
}

export default Router;