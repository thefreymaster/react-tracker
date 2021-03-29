import { Tag, Box, Button, Divider, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { addFriendCode } from '../../api/firebase';
import AbsoluteButton from '../../common/AbsoluteButton';
import Font from '../../common/Font';
import Wrapper from '../../common/Wrapper';
import { useGlobalState } from '../../providers/root';
import { generateKey } from '../../utils/generateKey';
import { readFriendCode } from '../../api/firebase';
import { useHistory } from 'react-router-dom';

const validate = ({ values, key }) => {
    if(values.code === key.toString() || values.code.length !== 4){
        return true;
    }
    return false;
}

const AddFriend = () => {
    const { firebase, dispatch } = useGlobalState();
    const { user } = firebase;
    const { uid } = user;
    const history = useHistory()

    const [key, setKey] = useState(generateKey());
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        addFriendCode({
            postData: {
                [user.uid]: true
            },
            key,
            dispatch
        })
    }, [])
    console.log(key)
    return (
        <Wrapper>
            <Box display="flex" justifyContent="center" alignItems="center" flexDir="column">
                <Text>Add Friend</Text>
                <Box padding="10px" />
                <Tag>
                    <Text fontSize="64px" fontWeight="bold">{key}</Text>
                </Tag>
                <Box padding="10px" />
                <Text>Send this code with a friend to add you.</Text>
                <Text>You must both add each other.</Text>
                <Box padding="10px" />
                <Divider />
                <Box padding="10px" />
                {
                    showForm ? (
                        <>
                            <Formik initialValues={{ code: '' }}>
                                {(props) => {
                                    return (
                                        <Form>
                                            <Field name="code">
                                                {({ field, form }) => (
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor="code">Add Friend's Code Below</FormLabel>
                                                        <Input maxLength={4} {...field} variant="filled" id="code" placeholder="Four digit code" autoCorrect={false} _autofill={false} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <AbsoluteButton disabled={validate({ values: props.values, key })} onClick={() => readFriendCode({ key: props.values.code, uid, dispatch, history })}>Submit</AbsoluteButton>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </>
                    ) : (
                        <Button onClick={() => setShowForm(true)}>Enter Friend's Code</Button>
                    )
                }
                <AbsoluteButton left={20} right="none" onClick={() => history.goBack()}>Back</AbsoluteButton>
            </Box>
        </Wrapper>
    )
}

export default AddFriend;