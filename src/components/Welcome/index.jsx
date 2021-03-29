import { Box, Button, SlideFade, Spinner, toast, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { signInWithGoogle } from '../../api/firebase';
import Font from '../../common/Font';
import Wrapper from '../../common/Wrapper';
import { useGlobalState } from '../../providers/root';
import { isMobile } from 'react-device-detect';
import './welcome.scss';
import { PRIMARY_COLOR, PRIMARY_COLOR_SCHEME } from '../../constants';

const Welcome = () => {
    const { firebase, dispatch } = useGlobalState();
    const { isOpen, onToggle } = useDisclosure();

    React.useEffect(() => {
        onToggle();
    }, [])

    const showSuccessToast = () => {
        toast({
            title: "Authenticated",
            status: "success",
            duration: 3000,
            isClosable: true,
        })
    }
    if (firebase.isValidatingAuthentication) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                <Spinner />
            </Box>
        )
    }
    if (!firebase.isValidatingAuthentication && firebase.isAuthenticated) {
        return <Redirect to="/request" />
    }
    const background = {
        // backgroundImage: `url(${CUTTING_BOARD})`,
        width: window.innerWidth,
        height: window.innerHeight,
        position: 'absolute',
        top: 0,
        filter: 'blur(10px)',
        transform: 'scale(1)',
        zIndex: -1,
    }
    return (
        <div style={{
            minHeight: "100%",
            minWidth: "100%"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <SlideFade direction="bottom" in={isOpen}>
                    <Wrapper>
                        <Box display="flex" flexDir="column" justifyContent="center" alignItems="center">
                            <Font fontWeight={900} fontSize={isMobile ? 72 : 124} variant="primary">Friendar</Font>
                            <Font fontWeight={600} fontSize={18}>Keep track of friends</Font>
                            <Box mt={5} display="flex" flexDir={isMobile ? "column" : "row"}>
                                <Button size="lg" colorScheme={PRIMARY_COLOR_SCHEME} disabled={firebase.isValidatingAuthentication} onClick={() => signInWithGoogle(dispatch, showSuccessToast)}>Sign Up With Google</Button>
                                <Box mr={5} />
                                <Button size="lg" colorScheme={PRIMARY_COLOR_SCHEME} disabled={firebase.isValidatingAuthentication} onClick={() => signInWithGoogle(dispatch, showSuccessToast)}>Sign In With Google</Button>
                            </Box>
                        </Box>
                    </Wrapper>
                    {/* <div style={background} className="cover-background" /> */}
                </SlideFade>
            </div>
        </div>
    )
}

export default Welcome;