import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { authValidationComplete, isFetching, fetchingComplete } from "../actions";

export const checkForFirebaseAuth = (dispatch, showSuccessToast) => {
    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            if (result.credential) {
                dispatch({ type: 'FIREBASE_AUTHENTICATION_SUCCESS', payload: { user: result.user } });
                setTimeout(() => {
                    dispatch({ type: 'TOGGLE_SETTINGS_DRAWER' });
                }, 500);
                showSuccessToast();
            }
        }).catch((error) => {
            console.error(error);
        });
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            dispatch({ type: 'FIREBASE_AUTHENTICATION_SUCCESS', payload: { user } });
            var userRefUpdates = firebase.database().ref('users/' + user.uid);
            userRefUpdates.on('value', (snapshot) => {
                dispatch(isFetching);
                const snapshotValue = snapshot.val();
                if (snapshotValue) {
                    dispatch({
                        type: 'POPULATE_RESTAURANTS',
                        payload: {
                            restaurants: snapshotValue.restaurants
                        }
                    });
                    dispatch(fetchingComplete);
                }
                else {
                    dispatch(fetchingComplete);
                }
            })
        }
        else {
            dispatch(authValidationComplete);
            dispatch(fetchingComplete);
        }

    })
}

export const signInWithGoogle = (dispatch, showSuccessToast) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

export const signOutWithGoogle = (dispatch, showInfoToast, history) => {
    firebase.auth().signOut().then(function () {
        setTimeout(() => {
            dispatch({ type: 'TOGGLE_SETTINGS_DRAWER' });
            showInfoToast();
            history.push("/")
            setTimeout(() => {
                dispatch({ type: 'FIREBASE_AUTHENTICATION_SIGN_OUT_SUCCESS' });
            }, 1000);
        }, 500);
    }).catch(function (error) {
        console.error(error);
    });
}

export const addRestaurant = ({ postData, uid, dispatch, history, toast }) => {
    dispatch(isFetching);
    var restaurantListRef = firebase.database().ref(`users/${uid}/restaurants`);
    restaurantListRef.push({ ...postData, createdDate: new Date().toISOString() }).then(() => {
        toast();
        dispatch(fetchingComplete);
        history.push("/");
    });
}

export const updateRestaurant = ({ postData, uid, dispatch, history, itemId, toast }) => {
    dispatch(isFetching);
    var restaurantListRef = firebase.database().ref(`users/${uid}/restaurants/${itemId}`);
    console.log({ ...postData, modifiedData: new Date().toISOString() })
    restaurantListRef.update({ ...postData, modifiedData: new Date().toISOString() }).then(() => {
        toast();
        dispatch(fetchingComplete)
        history.goBack();
    });
}

export const deleteRestaurant = ({ uid, dispatch, history, itemId, onClose, setIsDeleting, toast }) => {
    dispatch(isFetching);
    var restaurantListRef = firebase.database().ref(`users/${uid}/restaurants/${itemId}`);
    restaurantListRef.remove().then(() => {
        toast();
        dispatch(fetchingComplete);
        setIsDeleting(false);
        onClose();
        history.push("/");
    });
}
