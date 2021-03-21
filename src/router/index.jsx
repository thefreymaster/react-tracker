import React from 'react';
import UserMap from '../components/Map';
import { useGlobalState } from '../providers/root';
import { Switch, Route, Redirect } from 'react-router-dom';
import Welcome from '../components/Welcome';

const Router = () => {
    const { firebase } = useGlobalState();
    console.log(firebase)
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