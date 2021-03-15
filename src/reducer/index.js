

const reducer = (state, action) => {
    const newState = { ...state };
    const { payload } = action;

    switch (action.type) {
        case 'FIREBASE_INITIALIZED_SUCCESS': {
            newState.firebase.isInitialized = true;
            break;
        }
        case 'FIREBASE_AUTHENTICATION_SUCCESS': {
            newState.firebase.isAuthenticated = true;
            newState.firebase.isValidatingAuthentication = false;
            newState.firebase.user = payload.user;
            break;
        }
        case 'FIREBASE_AUTHENTICATION_SIGN_OUT_SUCCESS': {
            newState.firebase.isAuthenticated = false;
            newState.firebase.user = {};
            newState.restaurants = [];
            break;
        }
        case 'FIREBASE_AUTHENTICATION_VERIFICATION_COMPLETE': {
            newState.firebase.isValidatingAuthentication = false;
            break;
        }
        case 'TOGGLE_SETTINGS_DRAWER': {
            newState.meta.settingsDrawerIsOpen = !state.meta.settingsDrawerIsOpen;
            break;
        }
        case 'TOGGLE_FETCHING': {
            newState.meta.fetching = !state.meta.fetching;
            break;
        }
        case 'IS_FETCHING': {
            newState.meta.fetching = true;
            break;
        }
        case 'SET_GPS_COORDINATES': {
            newState.coordinates.lat = payload.lat;
            newState.coordinates.long = payload.long;
            newState.coordinates.hasCoordinates = true;
            break;
        }
        case 'FETCHING_COMPLETE': {
            newState.meta.fetching = false;
            break;
        }
        case 'SET_GPS_COORDINATES': {
            newState.coordinates.lat = payload.lat;
            newState.coordinates.long = payload.long;
            break;
        }
        case 'IS_SERVER_ERROR': {
            newState.meta.isServerError = true;
            break;
        }
        case 'IS_INSTALLED_APP': {
            newState.meta.isInstalled = true;
            break;
        }
        default:
            console.error(new Error());
    }
    console.log({ action, newState })
    return newState;
}

export default reducer;