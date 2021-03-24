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
                Object.keys(snapshotValue.authorizedUsers).map((key) => {
                    readFriendData({ uid: key, dispatch })
                })
                //read authorized user's data here and put into store to be rendered
                // if (snapshotValue) {
                //     dispatch({
                //         type: 'POPULATE_RESTAURANTS',
                //         payload: {
                //             restaurants: snapshotValue.restaurants
                //         }
                //     });
                //     dispatch(fetchingComplete);
                // }
                // else {
                //     dispatch(fetchingComplete);
                // }
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

export const addUserLocation = ({ postData, uid, dispatch, avatarUrl }) => {
    var userListRef = firebase.database().ref(`users/${uid}`);
    userListRef.update({ ...postData, createdDate: new Date().toISOString(), avatarUrl  }).then(() => {
        dispatch(fetchingComplete);
    });
}

export const addFriendCode = ({ postData, key, dispatch }) => {
    var authorizationsListRef = firebase.database().ref(`authorizations/${key}`);
    authorizationsListRef.update({ ...postData }).then(() => {
        dispatch(fetchingComplete);
    });
}

const addAuthorizedUser = ({ postData, uid, dispatch, history }) => {
    var userListRef = firebase.database().ref(`users/${uid}/authorizedUsers`);
    userListRef.update({ ...postData }).then(() => {
        dispatch(fetchingComplete);
        history.push('/map')
    });
}

const readFriendData = ({ uid, dispatch }) => {
    var authorizationsListRef = firebase.database().ref(`users/${uid}`);
    authorizationsListRef.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        dispatch({ type: 'ADD_AUTHORIZED_USER_DATA', payload: { ...snapshotValue, uid } })
    })
}

export const readFriendCode = ({ key, uid, dispatch, history }) => {
    var authorizationsListRef = firebase.database().ref(`authorizations/${key}`);
    authorizationsListRef.once('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        addAuthorizedUser({ postData: snapshotValue, uid, dispatch, history });
    })
}

export const readOtherUserLocation = ({ key }) => {
    //read this uid from our logged in user's data
    var userRefUpdates = firebase.database().ref(`authorizations/${key}`);
    userRefUpdates.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        debugger
        //add data to store next to be rendered
    })
}
