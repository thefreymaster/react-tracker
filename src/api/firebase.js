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
                    // if (snapshotValue?.authorizedUsers) {
                    //     Object.keys(snapshotValue.authorizedUsers).map((key) => {
                    //         readFriendData({ uid: key, dispatch })
                    //     })
                    // }
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

const removeGroup = ({ groupId, uid }) => {
    var groupListRef = firebase.database().ref(`groups/${groupId}/users/${uid}`);
    groupListRef.update({ groupId, [uid]: null });
}

export const joinGroupId = ({ newGroupId, groupId, uid, history }) => {
    var groupListRef = firebase.database().ref(`groups/${newGroupId}`);
    groupListRef.update({ groupId: newGroupId.toString(), [uid]: uid }).then(() => {
        updateUserGroupId(newGroupId, uid);
        history.push('/map');
        // removeGroup({ groupId, uid })
    }).catch((e) => {
        console.log(e);
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
