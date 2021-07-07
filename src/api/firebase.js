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
        if (user) {
            dispatch({ type: 'FIREBASE_AUTHENTICATION_SUCCESS', payload: { user } });
            var userRefUpdates = firebase.database().ref('users/' + user.uid);
            userRefUpdates.on('value', (snapshot) => {
                dispatch(isFetching);
                const snapshotValue = snapshot.val();
                if (snapshotValue) {
                    if (snapshotValue.groupId) {
                        dispatch({ type: 'SET_GROUP_ID', payload: { groupId: snapshotValue.groupId } })
                    }
                    readGroupId(snapshotValue.groupId, user.uid, dispatch)
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

export const addUserLocation = ({ postData, user, dispatch }) => {
    const [provider] = user.providerData;
    var userListRef = firebase.database().ref(`users/${user.uid}`);
    userListRef.update({
        ...postData,
        createdDate: new Date().toISOString(),
        provider
    }).then(() => {
        dispatch(fetchingComplete);
    });
}

const readGroupId = (groupId, uid, dispatch) => {
    var groupsRefUpdates = firebase.database().ref('groups/' + groupId);
    groupsRefUpdates.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        Object.keys(snapshotValue).map((key) => {
            if (key !== uid && key !== 'groupId') {
                readFriendData({ uid: key, dispatch })
            }
        })
    })
}

const updateUserGroupId = (groupId, uid) => {
    var userListRef = firebase.database().ref(`users/${uid}`);
    userListRef.update({ groupId: groupId.toString() }).then(() => { });
}

const createNewGroup = (uid) => {
    const groupId = generateKey();
    var groupListRef = firebase.database().ref(`groups/${groupId}`);

    groupListRef.set({ groupId: groupId.toString(), [uid]: uid }).then(() => {
        updateUserGroupId(groupId, uid);
    }).catch((e) => {
        console.log(e)
    })
}

const readFriendData = ({ uid, dispatch }) => {
    var authorizationsListRef = firebase.database().ref(`users/${uid}`);
    authorizationsListRef.on('value', (snapshot) => {
        const snapshotValue = snapshot.val();
        dispatch({ type: 'ADD_AUTHORIZED_USER_DATA', payload: { ...snapshotValue, uid } })
    })
}

const removeOldUidFromOldGroup = ({ groupId, uid }) => {
    var groupListRef = firebase.database().ref(`groups/${groupId}`);
    groupListRef.update({ groupId, [uid]: null });
}

export const joinGroupId = ({ newGroupId, groupId, uid, history }) => {
    var groupListRef = firebase.database().ref(`groups/${newGroupId}`);
    groupListRef.update({ groupId: newGroupId.toString(), [uid]: uid }).then(() => {
        updateUserGroupId(newGroupId, uid);
        history.push('/map');
        removeOldUidFromOldGroup({ groupId, uid })
    }).catch((e) => {
        console.log(e);
    })
}
