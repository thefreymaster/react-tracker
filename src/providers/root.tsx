import React from 'react';
import reducer from '../reducer';

export interface IDefaultState {
    firebase: {
        isValidatingAuthentication: boolean,
        isAuthenticated: boolean,
        isInitialized: boolean,
        isAuthenticatedError: boolean,
        user: object,
    },
    meta: {
        isServerError: boolean,
        fetching: boolean;
        isDay: boolean;
        isInstalled: boolean;
    }
    dispatch: any;
    coordinates: {
        lat?: number;
        long?: number;
        hasCoordinates: boolean;
    }
}

const defaultState: IDefaultState = {
    firebase: {
        isValidatingAuthentication: true,
        isAuthenticated: false,
        isInitialized: false,
        isAuthenticatedError: false,
        user: {},
    },
    meta: {
        isServerError: false,
        fetching: true,
        isDay: new Date().getHours() >= 6 && new Date().getHours() <= 17 ? true : false,
        isInstalled: false,
    },
    coordinates: {
        hasCoordinates: false,
        lat: 30.27433216857506,
        long: -97.74037796492102
    },
    dispatch: () => { },
}

const Context = React.createContext(defaultState);

export const useGlobalState = () => React.useContext(Context);

export const Provider = (props: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer(reducer, defaultState);

    return (
        <Context.Provider value={{ ...state as IDefaultState, dispatch }}>
            {props.children}
        </Context.Provider>
    )
}