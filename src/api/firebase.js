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

export const addUserLocation = ({ postData, uid, dispatch }) => {
    var userListRef = firebase.database().ref(`users/${uid}`);
    userListRef.update({ ...postData, createdDate: new Date().toISOString() }).then(() => {
        dispatch(fetchingComplete);
    });
}

export const readOtherUserLocation = ({ uid }) => {
    //read this uid from our logged in user's data
    var userRefUpdates = firebase.database().ref('users/' + uid + '/coordinates');
    userRefUpdates.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        debugger
        //add data to store next to be rendered
     })
}
