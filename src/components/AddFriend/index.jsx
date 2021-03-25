import { Box, Divider, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
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

    const [key, setKey] = useState(generateKey())
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
                <Text fontSize="72px" fontWeight="bold">{key}</Text>
                <Text>Share this code with a friend to add you.</Text>
                <Text>You must both add each other.</Text>
                <Box padding="10px" />
                <Divider />
                <Box padding="10px" />
                <Formik initialValues={{ code: '' }}>
                    {(props) => {
                        return (
                            <Form>
                                <Field name="code">
                                    {({ field, form }) => (
                                        <FormControl isRequired>
                                            <FormLabel htmlFor="code">Add Friend's Code Below</FormLabel>
                                            <Input maxLength={4} {...field} variant="filled" id="code" placeholder="4234" autoCorrect={false} _autofill={false} />
                                        </FormControl>
                                    )}
                                </Field>
                                <AbsoluteButton left={20} right="none" onClick={() => history.goBack()}>Back</AbsoluteButton>
                                <AbsoluteButton disabled={validate({ values: props.values, key })} onClick={() => readFriendCode({ key: props.values.code, uid, dispatch, history })}>Submit</AbsoluteButton>
                            </Form>
                        )
                    }}
                </Formik>
            </Box>
        </Wrapper>
    )
}

export default AddFriend;