import { Tag, Box, Button, Divider, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { joinGroupId } from '../../api/firebase';
import AbsoluteButton from '../../common/AbsoluteButton';
import Font from '../../common/Font';
import Wrapper from '../../common/Wrapper';
import { useGlobalState } from '../../providers/root';
import { generateKey } from '../../utils/generateKey';
import { useHistory } from 'react-router-dom';

const validate = ({ values, key }) => {
    if(values.code === key.toString() || values.code.length !== 4){
        return true;
    }
    return false;
}

const AddFriend = () => {
    const { firebase, dispatch, groupId } = useGlobalState();
    const { user } = firebase;
    const { uid } = user;
    const history = useHistory()

    const [key, setKey] = useState(generateKey());
    const [showForm, setShowForm] = useState(false);

    console.log(key)
    return (
        <Wrapper>
            <Box display="flex" justifyContent="center" alignItems="center" flexDir="column">
                <Text>Your Group</Text>
                <Box padding="10px" />
                <Tag>
                    <Text fontSize="64px" fontWeight="bold">{groupId}</Text>
                </Tag>
                <Box padding="10px" />
                <Text>Send this code to others to join your group.</Text>
                <Box display="flex" flexDir="row" width="100%" alignItems="center" justifyContent="center">
                    <Divider />
                    <Box margin="10px">
                        <Text>Or</Text>
                    </Box>
                    <Divider />
                </Box>
                <Box padding="5px" />
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
                                                        <FormLabel htmlFor="code">Add Friend's Group Below</FormLabel>
                                                        <Input maxLength={4} {...field} variant="filled" id="code" placeholder="Four digit code" autoCorrect={false} _autofill={false} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <AbsoluteButton disabled={validate({ values: props.values, key: groupId })} onClick={() => joinGroupId({ newGroupId: props.values.code, groupId, uid, history })}>Submit</AbsoluteButton>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </>
                    ) : (
                        <Button onClick={() => setShowForm(true)}>Join Friend's Group</Button>
                    )
                }
                <AbsoluteButton left={20} right="none" onClick={() => history.goBack()}>Back</AbsoluteButton>
            </Box>
        </Wrapper>
    )
}

export default AddFriend;