import React from 'react';
import UserMap from '../components/Map';
import { useGlobalState } from '../providers/root';

const Router = () => {
    const { meta } = useGlobalState();
    return (
        <Switch>
            <Route exact path="/">
                <UserMap />
            </Route>
            <Route exact path="/*">
                <Redirect to="/" />
            </Route>
        </Switch>
    )
}