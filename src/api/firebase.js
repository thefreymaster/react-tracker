import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import { authValidationComplete, isFetching, fetchingComplete } from "../actions";
import { generateKey } from "../utils/generateKey";

export const checkForFirebaseAuth = (dispatch, showSuccessToast) => {
    firebase.auth()
        .getRedirectResult()
        .then((result) => {
            console.log(result)
            if (result.credential) {
                dispatch({ type: 'FIREBASE_AUTHENTICATION_SUCCESS', payload: { user: result.user } });
                setTimeout(() => {
                    dispatch({ type: 'TOGGLE_SETTINGS_DRAWER' });
                }, 500);
                showSuccessToast();
            }
            if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
                console.log('new')
                createNewGroup(result.user.uid);
            }
        }).catch((error) => {
            console.error(error);
        });
    firebase.auth().onAuthStateChanged((user) => {
        console.log(user)
        if (user) {
            dispatch({ type: 'FIREBASE_AUTHENTICATION_SUCCESS', payload: { user } });
            var userRefUpdates = firebase.database().ref('users/' + user.uid);
            userRefUpdates.on('value', (snapshot) => {
                dispatch(isFetching);
                const snapshotValue = snapshot.val();
                if (snapshotValue?.authorizedUsers) {
                    Object.keys(snapshotValue.authorizedUsers).map((key) => {
                        readFriendData({ uid: key, dispatch })
                    })
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
            dispatch({ type: 'FIREBASE_AUTHENTICATION_SIGN_OUT_SUCCESS' });
            showInfoToast();
            history.push("/")
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_SETTINGS_DRAWER' });
            }, 1000);
        }, 500);
    }).catch(function (error) {
        console.error(error);
    });
}

export const addUserLocation = ({ postData, uid, dispatch, avatarUrl }) => {
    var userListRef = firebase.database().ref(`users/${uid}`);
    userListRef.update({
        ...postData,
        createdDate: new Date().toISOString(),
        avatarUrl
    }).then(() => {
        dispatch(fetchingComplete);
    });
}

export const addFriendCode = ({ postData, key, dispatch }) => {
    var authorizationsListRef = firebase.database().ref(`authorizations/${key}`);
    authorizationsListRef.update({ ...postData }).then(() => {
        dispatch(fetchingComplete);
    });
}

const updateUserGroupId = (groupId, uid) => {
    var userListRef = firebase.database().ref(`users/${uid}`);
    userListRef.update({ groupId: groupId.toString() }).then(() => {});
}

const createNewGroup = (uid) => {
    const groupId = generateKey();
    console.log(groupId)
    var groupListRef = firebase.database().ref(`groups/${groupId}`);
    console.log({ groupId, [uid]: true })

    groupListRef.set({ groupId: groupId.toString(), [uid]: true }).then(() => {
        updateUserGroupId(groupId, uid);
    }).catch((e) => {
        debugger
    })
}

const removeFriendCode = ({ key }) => {
    var authorizationsListRef = firebase.database().ref(`authorizations/${key}`);
    authorizationsListRef.remove();
}

const addAuthorizedUser = ({ postData, uid, dispatch, history, key }) => {
    var userListRef = firebase.database().ref(`users/${uid}/authorizedUsers`);
    userListRef.update({ ...postData }).then(() => {
        removeFriendCode({ key })
        dispatch(fetchingComplete);
        history.push('/map');
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
        addAuthorizedUser({ postData: snapshotValue, uid, dispatch, history, key });
    })
}

export const readOtherUserLocation = ({ key }) => {
    //read this uid from our logged in user's data
    var userRefUpdates = firebase.database().ref(`authorizations/${key}`);
    userRefUpdates.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        //add data to store next to be rendered
    })
}
